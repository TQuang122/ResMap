from __future__ import annotations

import asyncio
import math
from dataclasses import asdict, dataclass
from typing import List, Optional

from google import genai
from google.genai import errors as genai_errors

from app.core.config import settings
from app.services.token_tracker import (
    build_quota_repository,
    build_quota_tracker,
    make_quota_user_key,
)


EMBEDDING_MODEL = "models/text-embedding-004"


@dataclass
class SemanticSimilarityResult:
    similarity: float
    used_ai: bool
    fallback_used: bool
    method: str
    error: Optional[str] = None


def _keyword_similarity(text1: str, text2: str) -> float:
    words1 = text1.lower().split()
    words2 = text2.lower().split()

    if not words1 or not words2:
        return 0.0

    all_words = list(set(words1 + words2))
    vector1 = [words1.count(word) for word in all_words]
    vector2 = [words2.count(word) for word in all_words]

    dot_product = sum(v1 * v2 for v1, v2 in zip(vector1, vector2))
    magnitude1 = math.sqrt(sum(v * v for v in vector1))
    magnitude2 = math.sqrt(sum(v * v for v in vector2))

    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0

    return max(0.0, min(1.0, dot_product / (magnitude1 * magnitude2)))


def _cosine_similarity(emb1: List[float], emb2: List[float]) -> float:
    if not emb1 or not emb2 or len(emb1) != len(emb2):
        return 0.0

    dot = sum(a * b for a, b in zip(emb1, emb2))
    mag1 = math.sqrt(sum(a * a for a in emb1))
    mag2 = math.sqrt(sum(b * b for b in emb2))

    if mag1 == 0 or mag2 == 0:
        return 0.0

    return max(0.0, min(1.0, dot / (mag1 * mag2)))


class SemanticSimilarityService:
    def __init__(self) -> None:
        self._client = (
            genai.Client(api_key=settings.GEMINI_API_KEY)
            if settings.GEMINI_API_KEY
            else None
        )
        repo = build_quota_repository(
            limit=settings.SEMANTIC_QUOTA_LIMIT,
            window_days=max(1, int(settings.SEMANTIC_QUOTA_WINDOW_DAYS)),
            persistence_enabled=bool(settings.SEMANTIC_QUOTA_PERSISTENCE_ENABLED),
            backend_mode=settings.SEMANTIC_QUOTA_BACKEND_MODE,
            fallback_enabled=bool(settings.SEMANTIC_QUOTA_FALLBACK_ENABLED),
            supabase_url=settings.SUPABASE_URL,
            supabase_api_key=(
                settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
            ),
        )
        self._quota = build_quota_tracker(repo)

    async def _embed_pair(
        self, text1: str, text2: str
    ) -> tuple[List[float], List[float]]:
        if not self._client:
            raise RuntimeError("Gemini client is not initialized")

        client = self._client
        timeout = max(1.0, float(settings.SEMANTIC_TIMEOUT_SECONDS))

        def _run() -> tuple[List[float], List[float]]:
            response = client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=[text1[:1500], text2[:3000]],
            )
            embeddings = getattr(response, "embeddings", None)
            if not embeddings or len(embeddings) < 2:
                raise RuntimeError("Gemini embedding response is empty")

            emb1 = getattr(embeddings[0], "values", None)
            emb2 = getattr(embeddings[1], "values", None)
            if not emb1 or not emb2:
                raise RuntimeError("Gemini embedding vectors missing values")

            return list(emb1), list(emb2)

        return await asyncio.wait_for(asyncio.to_thread(_run), timeout=timeout)

    async def calculate(
        self,
        text1: str,
        text2: str,
        *,
        use_ai: bool,
        user_key: str | None = None,
    ) -> SemanticSimilarityResult:
        resolved_user_key = user_key or make_quota_user_key()
        if not text1.strip() or not text2.strip():
            return SemanticSimilarityResult(
                similarity=0.0,
                used_ai=False,
                fallback_used=False,
                method="keyword",
            )

        if not use_ai or not settings.SEMANTIC_SCORING_ENABLED:
            return SemanticSimilarityResult(
                similarity=_keyword_similarity(text1, text2),
                used_ai=False,
                fallback_used=False,
                method="keyword",
            )

        if not self._client:
            return SemanticSimilarityResult(
                similarity=_keyword_similarity(text1, text2),
                used_ai=False,
                fallback_used=True,
                method="keyword",
                error="gemini_client_unavailable",
            )

        if not self._quota.consume(resolved_user_key, 1):
            return SemanticSimilarityResult(
                similarity=_keyword_similarity(text1, text2),
                used_ai=False,
                fallback_used=True,
                method="keyword",
                error="semantic_quota_exhausted",
            )

        try:
            emb1, emb2 = await self._embed_pair(text1, text2)
            return SemanticSimilarityResult(
                similarity=_cosine_similarity(emb1, emb2),
                used_ai=True,
                fallback_used=False,
                method="semantic",
            )
        except genai_errors.APIError as e:
            return SemanticSimilarityResult(
                similarity=_keyword_similarity(text1, text2),
                used_ai=False,
                fallback_used=True,
                method="keyword",
                error=f"gemini_api_error:{e}",
            )
        except Exception as e:
            return SemanticSimilarityResult(
                similarity=_keyword_similarity(text1, text2),
                used_ai=False,
                fallback_used=True,
                method="keyword",
                error=f"semantic_exception:{e}",
            )

    def get_quota_info(self, *, user_key: str | None = None) -> dict:
        resolved_user_key = user_key or make_quota_user_key()
        data = asdict(self._quota.snapshot(resolved_user_key))
        quota_mode = (
            settings.SEMANTIC_QUOTA_BACKEND_MODE
            if settings.SEMANTIC_QUOTA_PERSISTENCE_ENABLED
            else "memory"
        )
        data["quota_mode"] = quota_mode
        return data


semantic_similarity_service = SemanticSimilarityService()


async def calculate_semantic_similarity(
    text1: str,
    text2: str,
    *,
    use_ai: bool,
    user_key: str | None = None,
) -> SemanticSimilarityResult:
    return await semantic_similarity_service.calculate(
        text1,
        text2,
        use_ai=use_ai,
        user_key=user_key,
    )


def get_quota_info(*, user_key: str | None = None) -> dict:
    return semantic_similarity_service.get_quota_info(user_key=user_key)


def resolve_quota_user_key(
    *,
    current_user: dict | None = None,
    anon_seed: str | None = None,
) -> str:
    return make_quota_user_key(user=current_user, anon_seed=anon_seed)
