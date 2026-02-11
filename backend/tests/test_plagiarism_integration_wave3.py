import asyncio

import httpx
import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_current_user
from app.main import app
from app.schemas.plagiarism import PlagiarismCheckRequest, PlagiarismCheckResponse
from app.services import plagiarism


@pytest.mark.asyncio
async def test_core_degraded_window_60s(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(plagiarism.settings, "CORE_API_KEY", "core-key")
    monkeypatch.setattr(
        plagiarism.settings,
        "PLAGIARISM_SOURCE_CORE_AUTH_MODE",
        plagiarism.CORE_AUTH_MODE_BEARER,
    )

    core_connector = plagiarism.CoreConnector()
    failing_attempts = 0

    async def always_fail_request(*args, **kwargs):
        del args
        del kwargs
        nonlocal failing_attempts
        failing_attempts += 1
        return None

    monkeypatch.setattr(core_connector, "_request_with_retry", always_fail_request)

    class FallbackConnector:
        name = "fallback"

        async def search(self, query, client, limit):
            del query
            del client
            if limit <= 0:
                return []
            return [
                plagiarism.NormalizedSourceCandidate(
                    source=self.name,
                    canonical_url="https://fallback.local/result-1",
                    title="Fallback source survives CORE outage",
                )
            ]

    connectors: list[plagiarism.SourceConnector] = [core_connector, FallbackConnector()]
    per_source_caps = {"core": 1, "fallback": 1}

    async with httpx.AsyncClient() as client:
        for _ in range(3):
            candidates = await plagiarism.collect_source_candidates(
                query="degraded window",
                client=client,
                connectors=connectors,
                per_source_caps=per_source_caps,
                global_cap=2,
            )
            assert [candidate.source for candidate in candidates] == ["fallback"]

        assert core_connector._degraded_until is not None
        now = asyncio.get_running_loop().time()
        remaining = core_connector._degraded_until - now
        assert remaining > 59.0
        assert failing_attempts == 3

        degraded_candidates = await plagiarism.collect_source_candidates(
            query="degraded window",
            client=client,
            connectors=connectors,
            per_source_caps=per_source_caps,
            global_cap=2,
        )

    assert [candidate.source for candidate in degraded_candidates] == ["fallback"]
    assert failing_attempts == 3


@pytest.mark.asyncio
async def test_multi_source_dedupe():
    class StubConnector:
        def __init__(
            self,
            name: str,
            payloads: list[plagiarism.NormalizedSourceCandidate],
        ):
            self.name = name
            self._payloads = payloads

        async def search(
            self,
            query: str,
            client: httpx.AsyncClient,
            limit: int,
        ) -> list[plagiarism.NormalizedSourceCandidate]:
            del query
            del client
            return self._payloads[:limit]

    connectors: list[plagiarism.SourceConnector] = [
        StubConnector(
            "crossref",
            [
                plagiarism.NormalizedSourceCandidate(
                    source="crossref",
                    canonical_url="https://doi.org/10.1000/duplicate",
                    title="Strong DOI candidate",
                    snippet="A long metadata snippet for ranking.",
                    identifiers=plagiarism.CandidateIdentifiers(
                        doi="10.1000/duplicate"
                    ),
                ),
                plagiarism.NormalizedSourceCandidate(
                    source="crossref",
                    canonical_url="https://example.org/title-only",
                    title="Neural retrieval for capstone projects",
                    snippet="Cross-source title duplicate",
                ),
            ],
        ),
        StubConnector(
            "pubmed",
            [
                plagiarism.NormalizedSourceCandidate(
                    source="pubmed",
                    canonical_url="https://pubmed.ncbi.nlm.nih.gov/12345/",
                    title="PubMed DOI duplicate should collapse",
                    identifiers=plagiarism.CandidateIdentifiers(
                        doi="10.1000/duplicate", pmid="12345"
                    ),
                ),
                plagiarism.NormalizedSourceCandidate(
                    source="pubmed",
                    canonical_url="https://pubmed.ncbi.nlm.nih.gov/99999/",
                    title="Neural retrieval for capstone projects",
                    snippet="PubMed source duplicate by title fallback",
                ),
            ],
        ),
        StubConnector(
            "arxiv",
            [
                plagiarism.NormalizedSourceCandidate(
                    source="arxiv",
                    canonical_url="https://arxiv.org/abs/2401.00001v1",
                    title="Unique arXiv candidate",
                    identifiers=plagiarism.CandidateIdentifiers(
                        arxiv_id="2401.00001v1"
                    ),
                )
            ],
        ),
    ]

    async with httpx.AsyncClient() as client:
        candidates = await plagiarism.collect_source_candidates(
            query="neural retrieval capstone",
            client=client,
            connectors=connectors,
            per_source_caps={"crossref": 3, "pubmed": 3, "arxiv": 3},
            global_cap=10,
        )

    assert len(candidates) == 3
    urls = [candidate.canonical_url for candidate in candidates]
    assert "https://arxiv.org/abs/2401.00001v1" in urls
    assert (
        sum(
            1
            for candidate in candidates
            if (candidate.identifiers.doi or "").lower() == "10.1000/duplicate"
        )
        == 1
    )
    assert any(
        candidate.title == "Neural retrieval for capstone projects"
        for candidate in candidates
    )


@pytest.mark.asyncio
async def test_partial_source_outage_still_returns_response():
    class FailingConnector:
        name = "failing"

        async def search(
            self,
            query: str,
            client: httpx.AsyncClient,
            limit: int,
        ) -> list[plagiarism.NormalizedSourceCandidate]:
            del query
            del client
            del limit
            raise httpx.TimeoutException("simulated timeout")

    class HealthyConnector:
        name = "healthy"

        async def search(
            self,
            query: str,
            client: httpx.AsyncClient,
            limit: int,
        ) -> list[plagiarism.NormalizedSourceCandidate]:
            del query
            del client
            if limit <= 0:
                return []
            return [
                plagiarism.NormalizedSourceCandidate(
                    source=self.name,
                    canonical_url="https://healthy.local/paper",
                    title="Healthy source survives partial outage",
                    snippet="This source should still be used.",
                )
            ]

    async with httpx.AsyncClient() as client:
        candidates = await plagiarism.collect_source_candidates(
            query="partial outage",
            client=client,
            connectors=[FailingConnector(), HealthyConnector()],
            per_source_caps={"failing": 2, "healthy": 2},
            global_cap=5,
        )

    assert [candidate.source for candidate in candidates] == ["healthy"]


@pytest.mark.asyncio
async def test_integration_policy_lock_not_relaxed(
    monkeypatch: pytest.MonkeyPatch,
):
    captured_limits: dict[str, int] = {}

    class CaptureConnector:
        def __init__(self, name: str):
            self.name = name

        async def search(
            self,
            query: str,
            client: httpx.AsyncClient,
            limit: int,
        ) -> list[plagiarism.NormalizedSourceCandidate]:
            del query
            del client
            captured_limits[self.name] = limit
            return []

    monkeypatch.setattr(
        plagiarism.settings,
        "PLAGIARISM_SOURCE_ARXIV_MAX_CANDIDATES",
        2,
    )
    monkeypatch.setattr(
        plagiarism.settings,
        "PLAGIARISM_SOURCE_CORE_MAX_CANDIDATES",
        3,
    )
    monkeypatch.setattr(
        plagiarism.settings,
        "PLAGIARISM_SOURCE_PUBMED_MAX_CANDIDATES",
        4,
    )

    per_source_caps = plagiarism.get_source_caps()
    connectors: list[plagiarism.SourceConnector] = [
        CaptureConnector("arxiv"),
        CaptureConnector("core"),
        CaptureConnector("pubmed"),
    ]

    async with httpx.AsyncClient() as client:
        await plagiarism.collect_source_candidates(
            query="policy lock integration",
            client=client,
            connectors=connectors,
            per_source_caps=per_source_caps,
            global_cap=10,
        )

    assert captured_limits == {"arxiv": 2, "core": 3, "pubmed": 4}


@pytest.mark.asyncio
async def test_telemetry_optional_fields_nullable(monkeypatch: pytest.MonkeyPatch):
    async def fake_search_web(query, client):
        del query
        del client
        return ["https://doi.org/10.1000/test"]

    async def fake_fetch_page_content(url, client):
        del url
        del client
        return (
            "Machine learning methods are used in sentiment analysis and classification "
            "for social media text in practical applications."
        )

    monkeypatch.setattr(plagiarism, "search_web", fake_search_web)
    monkeypatch.setattr(plagiarism, "fetch_page_content", fake_fetch_page_content)
    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)

    request = PlagiarismCheckRequest(
        text=(
            "Machine learning methods are broadly used for sentiment analysis in modern systems. "
            "These techniques help improve accuracy for noisy social media text."
        ),
        use_ai_similarity=False,
    )

    response = await plagiarism.check_plagiarism(request)
    payload = response.model_dump()
    payload.pop("source_counts", None)
    payload.pop("source_failures", None)
    payload.pop("quota_mode", None)

    reparsed = PlagiarismCheckResponse.model_validate(payload)
    assert reparsed.total_sentences >= 1
    assert reparsed.source_counts is None
    assert reparsed.source_failures is None
    assert reparsed.quota_mode is None


def test_legacy_payload_contract_still_valid(monkeypatch: pytest.MonkeyPatch):
    async def fake_search_web(query, client):
        del query
        del client
        return ["https://example.com/reference"]

    async def fake_fetch_page_content(url, client):
        del url
        del client
        return (
            "Machine learning methods are used in sentiment analysis and classification "
            "for social media text in practical applications."
        )

    monkeypatch.setattr(plagiarism, "search_web", fake_search_web)
    monkeypatch.setattr(plagiarism, "fetch_page_content", fake_fetch_page_content)
    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)

    app.dependency_overrides[get_current_user] = lambda: {"role": "test", "id": "u-1"}
    with TestClient(app) as client:
        response = client.post(
            "/api/tools/plagiarism-check",
            json={
                "text": (
                    "Machine learning methods are broadly used for sentiment analysis in modern systems. "
                    "These techniques help improve accuracy for noisy social media text."
                )
            },
        )
    app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 200
    payload = response.json()
    expected_keys = {
        "overall_score",
        "plagiarism_percentage",
        "total_sentences",
        "plagiarized_sentences",
        "results",
    }
    assert expected_keys.issubset(payload.keys())
