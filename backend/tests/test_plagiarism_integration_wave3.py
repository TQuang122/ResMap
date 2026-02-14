import asyncio

import httpx
import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_current_user
from app.main import app
from app.schemas.plagiarism import PlagiarismCheckRequest, PlagiarismCheckResponse
from app.services import plagiarism
from app.services.semantic_similarity import SemanticSimilarityResult


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


def test_report_v2_optional_contract_accepts_legacy_and_extended_payloads():
    legacy_payload = {
        "overall_score": 10,
        "plagiarism_percentage": 0,
        "total_sentences": 2,
        "plagiarized_sentences": 0,
        "results": [],
    }
    legacy_reparsed = PlagiarismCheckResponse.model_validate(legacy_payload)

    assert legacy_reparsed.report_v2 is None
    assert legacy_reparsed.total_sentences == 2

    extended_payload = {
        "overall_score": 30,
        "plagiarism_percentage": 50,
        "total_sentences": 2,
        "plagiarized_sentences": 1,
        "results": [],
        "report_v2": {
            "source_groups": [
                {
                    "source_id": "src-1",
                    "source_type": "web",
                    "canonical_url": "https://example.com/paper",
                    "spans": [
                        {
                            "sentence_index": 0,
                            "start_char": 5,
                            "end_char": 42,
                            "similarity": 88,
                        }
                    ],
                }
            ],
            "caveats": [
                {
                    "code": "DEMO_ONLY",
                    "message": "Placeholder grouping before scoring rollout",
                }
            ],
            "metadata": {"schema_version": "2"},
        },
    }
    extended_reparsed = PlagiarismCheckResponse.model_validate(extended_payload)

    assert extended_reparsed.report_v2 is not None
    assert len(extended_reparsed.report_v2.source_groups) == 1
    assert len(extended_reparsed.report_v2.source_groups[0].spans) == 1
    assert extended_reparsed.report_v2.caveats[0].code == "DEMO_ONLY"


@pytest.mark.asyncio
async def test_scoring_policy_v2_adds_fallback_caveat_and_confidence_band(
    monkeypatch: pytest.MonkeyPatch,
):
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

    async def fake_semantic(*args, **kwargs):
        del args
        del kwargs
        return SemanticSimilarityResult(
            similarity=0.32,
            used_ai=False,
            fallback_used=True,
            method="keyword",
            error="quota_exhausted",
        )

    monkeypatch.setattr(plagiarism, "search_web", fake_search_web)
    monkeypatch.setattr(plagiarism, "fetch_page_content", fake_fetch_page_content)
    monkeypatch.setattr(plagiarism, "calculate_semantic_similarity", fake_semantic)
    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)

    request = PlagiarismCheckRequest(
        text=(
            "Machine learning methods are broadly used for sentiment analysis in modern systems. "
            "These techniques help improve accuracy for noisy social media text."
        ),
        use_ai_similarity=True,
    )

    response = await plagiarism.check_plagiarism(request)

    assert response.fallback_used is True
    assert response.report_v2 is not None
    assert response.report_v2.metadata is not None
    assert response.report_v2.metadata["scoring_policy"] == "v2_explainable"
    assert response.report_v2.metadata["confidence_band"] == "low"
    assert response.report_v2.metadata["fallback_sentences"] == str(
        response.total_sentences
    )
    assert any(
        caveat.code == "SEMANTIC_UNAVAILABLE_FALLBACK"
        for caveat in response.report_v2.caveats
    )


@pytest.mark.asyncio
async def test_scoring_policy_v2_reports_high_confidence_when_semantic_evidence_present(
    monkeypatch: pytest.MonkeyPatch,
):
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

    async def fake_semantic(*args, **kwargs):
        del args
        del kwargs
        return SemanticSimilarityResult(
            similarity=0.91,
            used_ai=True,
            fallback_used=False,
            method="semantic",
        )

    monkeypatch.setattr(plagiarism, "search_web", fake_search_web)
    monkeypatch.setattr(plagiarism, "fetch_page_content", fake_fetch_page_content)
    monkeypatch.setattr(plagiarism, "calculate_semantic_similarity", fake_semantic)
    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)

    request = PlagiarismCheckRequest(
        text=(
            "Machine learning methods are broadly used for sentiment analysis in modern systems. "
            "These techniques help improve accuracy for noisy social media text."
        ),
        use_ai_similarity=True,
    )

    response = await plagiarism.check_plagiarism(request)

    assert response.report_v2 is not None
    assert response.report_v2.metadata is not None
    assert response.report_v2.metadata["confidence_band"] == "high"
    assert response.report_v2.metadata["semantic_sentences"] == str(
        response.total_sentences
    )
    assert not any(
        caveat.code == "SEMANTIC_UNAVAILABLE_FALLBACK"
        for caveat in response.report_v2.caveats
    )


@pytest.mark.asyncio
async def test_exclude_citations_reports_transparent_v2_metadata_and_caveats(
    monkeypatch: pytest.MonkeyPatch,
):
    async def fake_search_web(query, client):
        del query
        del client
        return ["https://example.com/reference"]

    async def fake_fetch_page_content(url, client):
        del url
        del client
        return (
            "This standalone original finding sentence remains analyzable after exclusions "
            "and should still produce a stable plagiarism analysis response."
        )

    monkeypatch.setattr(plagiarism, "search_web", fake_search_web)
    monkeypatch.setattr(plagiarism, "fetch_page_content", fake_fetch_page_content)
    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)

    request = PlagiarismCheckRequest(
        text=(
            '"Quoted source text that should be excluded from analysis for fairness and focus." '
            "This standalone original finding sentence remains analyzable after exclusions and should still be checked. "
            "(Nguyen, 2024) [1] [2]. "
            "References\n"
            "[1] A very long reference entry that should be excluded from analysis entirely.\n"
            "[2] Another long reference entry that inflates excluded content size."
        ),
        exclude_citations=True,
        use_ai_similarity=False,
    )

    response = await plagiarism.check_plagiarism(request)

    assert response.total_sentences == 1
    assert response.report_v2 is not None
    assert response.report_v2.metadata is not None
    assert response.report_v2.metadata["exclusion_requested"] == "true"
    assert response.report_v2.metadata["exclusion_applied"] == "true"
    assert int(response.report_v2.metadata["excluded_quoted_segments"]) >= 1
    assert int(response.report_v2.metadata["excluded_parenthetical_citations"]) >= 1
    assert int(response.report_v2.metadata["excluded_numeric_citations"]) >= 1
    assert int(response.report_v2.metadata["excluded_reference_sections"]) >= 1
    assert any(
        caveat.code == "EXCLUSION_CITATIONS_APPLIED"
        for caveat in response.report_v2.caveats
    )


@pytest.mark.asyncio
async def test_exclude_citations_gracefully_handles_minimal_remaining_text():
    request = PlagiarismCheckRequest(
        text=(
            '"Direct quote one that should be removed." '
            '"Direct quote two that should also be removed." '
            "(Tran, 2022) [1] [2]. "
            "References\n"
            "[1] Long reference entry one.\n"
            "[2] Long reference entry two."
        ),
        exclude_citations=True,
        use_ai_similarity=False,
    )

    response = await plagiarism.check_plagiarism(request)

    assert response.total_sentences == 0
    assert response.results == []
    assert response.report_v2 is not None
    assert response.report_v2.metadata is not None
    assert response.report_v2.metadata["analyzable_text_minimal"] == "true"
    assert response.report_v2.metadata["analyzable_sentences_before_cap"] == "0"
    assert any(
        caveat.code == "INSUFFICIENT_ANALYZABLE_TEXT"
        for caveat in response.report_v2.caveats
    )


@pytest.mark.asyncio
async def test_report_v2_source_groups_built_from_sentence_evidence(monkeypatch):
    sentence_to_urls = {
        "Sentence one has enough characters for splitting and analysis": [
            "https://doi.org/10.1000/test-a",
            "https://example.com/source-1",
        ],
        "Sentence two also has enough characters and reuses one source": [
            "https://example.com/source-1/",
            "https://pubmed.ncbi.nlm.nih.gov/12345/",
        ],
    }

    async def fake_search_web(query, client):
        del client
        return sentence_to_urls[query]

    async def fake_fetch_page_content(url, client):
        del url
        del client
        return (
            "Sentence one has enough characters for splitting and analysis. "
            "Sentence two also has enough characters and reuses one source for analysis."
        )

    monkeypatch.setattr(plagiarism, "search_web", fake_search_web)
    monkeypatch.setattr(plagiarism, "fetch_page_content", fake_fetch_page_content)
    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)

    request = PlagiarismCheckRequest(
        text=(
            "Sentence one has enough characters for splitting and analysis. "
            "Sentence two also has enough characters and reuses one source."
        ),
        use_ai_similarity=False,
    )

    response = await plagiarism.check_plagiarism(request)

    assert response.report_v2 is not None
    source_groups = response.report_v2.source_groups
    assert [group.canonical_url for group in source_groups] == [
        "https://doi.org/10.1000/test-a",
        "https://example.com/source-1",
        "https://pubmed.ncbi.nlm.nih.gov/12345",
    ]

    grouped_spans = {
        group.canonical_url: [span.sentence_index for span in group.spans]
        for group in source_groups
    }
    assert grouped_spans["https://example.com/source-1"] == [0, 1]
    assert grouped_spans["https://doi.org/10.1000/test-a"] == [0]
    assert grouped_spans["https://pubmed.ncbi.nlm.nih.gov/12345"] == [1]

    assert response.report_v2.metadata is not None
    assert response.report_v2.metadata["total_source_matches"] == "4"
    assert response.report_v2.metadata["source_group_count"] == "3"
    assert response.report_v2.metadata["source_group_spans"] == "4"
