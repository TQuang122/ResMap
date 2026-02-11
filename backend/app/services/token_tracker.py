from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import hashlib
from threading import Lock
from typing import Protocol

import httpx


@dataclass
class QuotaSnapshot:
    used: int
    limit: int
    remaining: int
    usage_percent: float
    reset_at: str


class QuotaRepository(Protocol):
    def snapshot(self, user_key: str) -> QuotaSnapshot: ...

    def consume(self, user_key: str, amount: int = 1) -> bool: ...


def make_quota_user_key(user: dict | None = None, anon_seed: str | None = None) -> str:
    user_id = str((user or {}).get("id") or "").strip()
    if user_id:
        return f"user:{user_id}"

    if anon_seed:
        digest = hashlib.sha256(anon_seed.strip().lower().encode("utf-8")).hexdigest()[
            :24
        ]
        return f"anon:{digest}"

    return "anon:global"


class InMemoryQuotaRepository:
    def __init__(self, limit: int, window_days: int = 30) -> None:
        self._limit = max(0, limit)
        self._window_days = max(1, window_days)
        self._events: dict[str, list[datetime]] = {}
        self._lock = Lock()

    def _window_start_for(self, user_key: str, now: datetime) -> datetime:
        events = self._events.get(user_key, [])
        if not events:
            return now
        return min(events)

    def _prune_expired(self, user_key: str, now: datetime) -> None:
        window_start = now - timedelta(days=self._window_days)
        events = self._events.get(user_key, [])
        self._events[user_key] = [ts for ts in events if ts >= window_start]

    def _current_used(self, user_key: str) -> int:
        return len(self._events.get(user_key, []))

    def set_limit(self, limit: int) -> None:
        with self._lock:
            self._limit = max(0, limit)

    def can_consume(self, user_key: str, amount: int = 1) -> bool:
        amount = max(0, amount)
        with self._lock:
            now = datetime.now(timezone.utc)
            self._prune_expired(user_key, now)
            return self._current_used(user_key) + amount <= self._limit

    def consume(self, user_key: str, amount: int = 1) -> bool:
        amount = max(0, amount)
        with self._lock:
            now = datetime.now(timezone.utc)
            self._prune_expired(user_key, now)
            used = self._current_used(user_key)
            if used + amount > self._limit:
                return False

            events = self._events.setdefault(user_key, [])
            for _ in range(amount):
                events.append(now)
            return True

    def snapshot(self, user_key: str) -> QuotaSnapshot:
        with self._lock:
            now = datetime.now(timezone.utc)
            self._prune_expired(user_key, now)
            used = self._current_used(user_key)
            remaining = max(0, self._limit - used)
            usage_percent = (used / self._limit) * 100 if self._limit > 0 else 0.0

            if used == 0:
                reset_at = now + timedelta(days=self._window_days)
            else:
                window_start = self._window_start_for(user_key, now)
                reset_at = window_start + timedelta(days=self._window_days)

            return QuotaSnapshot(
                used=used,
                limit=self._limit,
                remaining=remaining,
                usage_percent=round(usage_percent, 2),
                reset_at=reset_at.isoformat(),
            )


class SupabasePostgresQuotaRepository:
    def __init__(
        self,
        *,
        limit: int,
        window_days: int,
        base_url: str,
        api_key: str,
        timeout_seconds: float = 3.0,
    ) -> None:
        self._limit = max(0, limit)
        self._window_days = max(1, window_days)
        self._base_url = base_url.rstrip("/")
        self._api_key = api_key
        self._timeout_seconds = max(0.5, timeout_seconds)

    def _rpc_url(self, function_name: str) -> str:
        return f"{self._base_url}/rest/v1/rpc/{function_name}"

    def _headers(self) -> dict[str, str]:
        return {
            "apikey": self._api_key,
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }

    def snapshot(self, user_key: str) -> QuotaSnapshot:
        payload = {
            "p_user_key": user_key,
            "p_limit": self._limit,
            "p_window_days": self._window_days,
        }
        with httpx.Client(timeout=self._timeout_seconds) as client:
            response = client.post(
                self._rpc_url("snapshot_semantic_quota"),
                headers=self._headers(),
                json=payload,
            )

        response.raise_for_status()
        data = response.json()
        if not isinstance(data, dict):
            raise RuntimeError("Invalid quota snapshot response")

        return QuotaSnapshot(
            used=max(0, int(data.get("used", 0))),
            limit=max(0, int(data.get("limit", self._limit))),
            remaining=max(0, int(data.get("remaining", self._limit))),
            usage_percent=round(float(data.get("usage_percent", 0.0)), 2),
            reset_at=str(data.get("reset_at", datetime.now(timezone.utc).isoformat())),
        )

    def consume(self, user_key: str, amount: int = 1) -> bool:
        payload = {
            "p_user_key": user_key,
            "p_amount": max(0, amount),
            "p_limit": self._limit,
            "p_window_days": self._window_days,
        }
        with httpx.Client(timeout=self._timeout_seconds) as client:
            response = client.post(
                self._rpc_url("consume_semantic_quota"),
                headers=self._headers(),
                json=payload,
            )

        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict):
            return bool(data.get("consumed", False))
        return bool(data)


class ResilientQuotaRepository:
    def __init__(
        self,
        primary: QuotaRepository,
        fallback: QuotaRepository,
        *,
        fallback_enabled: bool = True,
    ) -> None:
        self._primary = primary
        self._fallback = fallback
        self._fallback_enabled = fallback_enabled

    def snapshot(self, user_key: str) -> QuotaSnapshot:
        try:
            return self._primary.snapshot(user_key)
        except Exception:
            if not self._fallback_enabled:
                raise
            return self._fallback.snapshot(user_key)

    def consume(self, user_key: str, amount: int = 1) -> bool:
        try:
            return self._primary.consume(user_key, amount)
        except Exception:
            if not self._fallback_enabled:
                raise
            return self._fallback.consume(user_key, amount)


class _UserAwareQuotaTracker:
    def __init__(self, repository: QuotaRepository) -> None:
        self._repository = repository

    def consume(self, user_key: str, amount: int = 1) -> bool:
        return self._repository.consume(user_key, amount)

    def snapshot(self, user_key: str) -> QuotaSnapshot:
        return self._repository.snapshot(user_key)


class LegacyQuotaTracker:
    def __init__(self, limit: int, window_days: int = 30) -> None:
        self._repo = InMemoryQuotaRepository(limit=limit, window_days=window_days)

    def set_limit(self, limit: int) -> None:
        self._repo.set_limit(limit)

    def can_consume(self, amount: int = 1) -> bool:
        return self._repo.can_consume("anon:global", amount)

    def consume(self, amount: int = 1) -> bool:
        return self._repo.consume("anon:global", amount)

    def snapshot(self) -> QuotaSnapshot:
        return self._repo.snapshot("anon:global")


QuotaTracker = LegacyQuotaTracker


def build_quota_tracker(repository: QuotaRepository) -> _UserAwareQuotaTracker:
    return _UserAwareQuotaTracker(repository)


def build_quota_repository(
    *,
    limit: int,
    window_days: int,
    persistence_enabled: bool,
    backend_mode: str,
    fallback_enabled: bool,
    supabase_url: str,
    supabase_api_key: str,
) -> QuotaRepository:
    fallback_repo = InMemoryQuotaRepository(limit=limit, window_days=window_days)

    mode = (backend_mode or "").strip().lower()
    if not persistence_enabled or mode == "memory":
        return fallback_repo

    if mode != "supabase_postgres" or not supabase_url or not supabase_api_key:
        return fallback_repo

    primary_repo = SupabasePostgresQuotaRepository(
        limit=limit,
        window_days=window_days,
        base_url=supabase_url,
        api_key=supabase_api_key,
    )
    return ResilientQuotaRepository(
        primary=primary_repo,
        fallback=fallback_repo,
        fallback_enabled=fallback_enabled,
    )
