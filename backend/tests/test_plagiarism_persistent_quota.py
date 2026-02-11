from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone

import pytest

from app.services import token_tracker
from app.services.token_tracker import (
    InMemoryQuotaRepository,
    build_quota_repository,
    make_quota_user_key,
)


def test_quota_repository_snapshot_consume_contract():
    repo = InMemoryQuotaRepository(limit=3, window_days=30)
    user_key = "user:test-1"

    start = repo.snapshot(user_key)
    assert start.used == 0
    assert start.limit == 3
    assert start.remaining == 3
    assert start.usage_percent == 0.0
    assert isinstance(start.reset_at, str)

    assert repo.consume(user_key, 1) is True
    assert repo.consume(user_key, 2) is True
    assert repo.consume(user_key, 1) is False

    end = repo.snapshot(user_key)
    assert end.used == 3
    assert end.limit == 3
    assert end.remaining == 0
    assert end.usage_percent == 100.0


def test_quota_window_rolling_30_days(monkeypatch: pytest.MonkeyPatch):
    t0 = datetime(2026, 1, 1, 9, 0, tzinfo=timezone.utc)
    ticks = [t0, t0 + timedelta(days=29), t0 + timedelta(days=31)]

    class FrozenDateTime(datetime):
        @classmethod
        def now(cls, tz=None):
            value = ticks[0]
            if len(ticks) > 1:
                ticks.pop(0)
            if tz is not None:
                return value.astimezone(tz)
            return value

    monkeypatch.setattr(token_tracker, "datetime", FrozenDateTime)

    repo = InMemoryQuotaRepository(limit=5, window_days=30)
    user_key = "user:rolling"

    assert repo.consume(user_key, 1) is True
    before_expiry = repo.snapshot(user_key)
    after_expiry = repo.snapshot(user_key)

    assert before_expiry.used == 1
    assert before_expiry.remaining == 4
    assert after_expiry.used == 0
    assert after_expiry.remaining == 5


def test_quota_atomic_consume_never_negative_under_concurrency():
    repo = InMemoryQuotaRepository(limit=25, window_days=30)
    user_key = "user:concurrent"

    def attempt() -> bool:
        return repo.consume(user_key, 1)

    with ThreadPoolExecutor(max_workers=40) as executor:
        results = list(executor.map(lambda _: attempt(), range(200)))

    success = sum(1 for v in results if v)
    snapshot = repo.snapshot(user_key)

    assert success == 25
    assert snapshot.used == 25
    assert snapshot.remaining == 0
    assert snapshot.used >= 0
    assert snapshot.remaining >= 0


def test_quota_fallback_when_db_unavailable(monkeypatch: pytest.MonkeyPatch):
    def broken_snapshot(self, user_key: str):
        raise RuntimeError("db unavailable")

    def broken_consume(self, user_key: str, amount: int = 1):
        raise RuntimeError("db unavailable")

    monkeypatch.setattr(
        token_tracker.SupabasePostgresQuotaRepository,
        "snapshot",
        broken_snapshot,
    )
    monkeypatch.setattr(
        token_tracker.SupabasePostgresQuotaRepository,
        "consume",
        broken_consume,
    )

    repo = build_quota_repository(
        limit=2,
        window_days=30,
        persistence_enabled=True,
        backend_mode="supabase_postgres",
        fallback_enabled=True,
        supabase_url="https://example.supabase.co",
        supabase_api_key="key",
    )

    user_key = make_quota_user_key({"id": "abc-123"}, None)
    assert repo.consume(user_key, 1) is True
    snapshot = repo.snapshot(user_key)

    assert snapshot.used == 1
    assert snapshot.limit == 2
    assert snapshot.remaining == 1
    assert 0 <= snapshot.usage_percent <= 100


def test_quota_user_key_policy_is_stable():
    assert make_quota_user_key({"id": "u-1"}, "1.2.3.4") == "user:u-1"
    anon_a = make_quota_user_key({"role": "anon"}, "1.2.3.4")
    anon_b = make_quota_user_key({"role": "anon"}, "1.2.3.4")
    anon_c = make_quota_user_key({"role": "anon"}, "5.6.7.8")

    assert anon_a == anon_b
    assert anon_a != anon_c
    assert anon_a.startswith("anon:")


def test_quota_persistent_mode_survives_repository_rebuild(
    monkeypatch: pytest.MonkeyPatch,
):
    store: dict[str, int] = {}

    def fake_consume(self, user_key: str, amount: int = 1) -> bool:
        used = store.get(user_key, 0)
        if used + amount > self._limit:
            return False
        store[user_key] = used + amount
        return True

    def fake_snapshot(self, user_key: str):
        used = store.get(user_key, 0)
        remaining = max(0, self._limit - used)
        usage_percent = (used / self._limit) * 100 if self._limit > 0 else 0.0
        return token_tracker.QuotaSnapshot(
            used=used,
            limit=self._limit,
            remaining=remaining,
            usage_percent=round(usage_percent, 2),
            reset_at=(
                datetime.now(timezone.utc) + timedelta(days=self._window_days)
            ).isoformat(),
        )

    monkeypatch.setattr(
        token_tracker.SupabasePostgresQuotaRepository,
        "consume",
        fake_consume,
    )
    monkeypatch.setattr(
        token_tracker.SupabasePostgresQuotaRepository,
        "snapshot",
        fake_snapshot,
    )

    repo1 = build_quota_repository(
        limit=3,
        window_days=30,
        persistence_enabled=True,
        backend_mode="supabase_postgres",
        fallback_enabled=False,
        supabase_url="https://example.supabase.co",
        supabase_api_key="service-key",
    )

    user_key = make_quota_user_key({"id": "persist-user"}, None)
    assert repo1.consume(user_key, 1) is True

    repo2 = build_quota_repository(
        limit=3,
        window_days=30,
        persistence_enabled=True,
        backend_mode="supabase_postgres",
        fallback_enabled=False,
        supabase_url="https://example.supabase.co",
        supabase_api_key="service-key",
    )
    snapshot = repo2.snapshot(user_key)

    assert snapshot.used == 1
    assert snapshot.remaining == 2
