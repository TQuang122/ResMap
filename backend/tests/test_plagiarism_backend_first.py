import pytest
from fastapi.testclient import TestClient
from time import perf_counter

from app.api.deps import get_current_user
from app.main import app
from app.schemas.plagiarism import PlagiarismCheckRequest
from app.services import plagiarism
from app.services.plagiarism import check_plagiarism
from app.services.semantic_similarity import SemanticSimilarityResult


SAMPLE_TEXT = (
    "Machine learning methods are broadly used for sentiment analysis in modern systems. "
    "These techniques help improve accuracy for noisy social media text."
)


@pytest.fixture
def stub_web(monkeypatch):
    async def fake_search_web(query, client):
        return ["https://example.com/reference"]

    async def fake_fetch_page_content(url, client):
        return (
            "Machine learning methods are used in sentiment analysis and classification "
            "for social media text in practical applications."
        )

    monkeypatch.setattr(plagiarism, "search_web", fake_search_web)
    monkeypatch.setattr(plagiarism, "fetch_page_content", fake_fetch_page_content)
    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)


def test_request_backward_compatibility_defaults():
    req = PlagiarismCheckRequest(text=SAMPLE_TEXT)
    assert req.exclude_citations is False
    assert req.max_sentences == 20
    assert req.use_ai_similarity is True


@pytest.mark.asyncio
async def test_keyword_mode_returns_compatible_response(stub_web):
    req = PlagiarismCheckRequest(text=SAMPLE_TEXT, use_ai_similarity=False)
    result = await check_plagiarism(req)

    assert result.overall_score >= 0
    assert result.total_sentences >= 1
    assert result.analysis_method == "keyword"
    assert result.used_ai_similarity is False
    assert result.fallback_used is False
    assert result.ai_quota_remaining is not None


@pytest.mark.asyncio
async def test_semantic_fallback_is_reported(monkeypatch, stub_web):
    monkeypatch.setattr(plagiarism.settings, "SEMANTIC_SCORING_ENABLED", True)

    async def fake_semantic(*args, **kwargs):
        return SemanticSimilarityResult(
            similarity=0.22,
            used_ai=False,
            fallback_used=True,
            method="keyword",
            error="quota_exhausted",
        )

    monkeypatch.setattr(plagiarism, "calculate_semantic_similarity", fake_semantic)

    req = PlagiarismCheckRequest(text=SAMPLE_TEXT, use_ai_similarity=True)
    result = await check_plagiarism(req)

    assert result.fallback_used is True
    assert result.analysis_method == "keyword"
    assert any(r.fallback_used for r in result.results)


@pytest.mark.asyncio
async def test_semantic_mode_reports_usage(monkeypatch, stub_web):
    monkeypatch.setattr(plagiarism.settings, "SEMANTIC_SCORING_ENABLED", True)

    async def fake_semantic(*args, **kwargs):
        return SemanticSimilarityResult(
            similarity=0.91,
            used_ai=True,
            fallback_used=False,
            method="semantic",
        )

    monkeypatch.setattr(plagiarism, "calculate_semantic_similarity", fake_semantic)

    req = PlagiarismCheckRequest(text=SAMPLE_TEXT, use_ai_similarity=True)
    result = await check_plagiarism(req)

    assert result.used_ai_similarity is True
    assert result.analysis_method == "semantic"
    assert any(r.semantic_similarity >= 90 for r in result.results)


def test_quota_endpoint_shape():
    app.dependency_overrides[get_current_user] = lambda: {"role": "test"}
    with TestClient(app) as client:
        response = client.get("/api/tools/plagiarism-check/quota")
    app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 200
    data = response.json()
    assert set(["used", "limit", "remaining", "usage_percent", "reset_at"]).issubset(
        data.keys()
    )
    assert data["remaining"] >= 0
    assert 0 <= data["usage_percent"] <= 100


@pytest.mark.asyncio
async def test_plagiarism_performance_budget_with_stubs(stub_web):
    text = " ".join(
        [
            "Sentence one about machine learning classification in social media analytics.",
            "Sentence two describes practical deployment constraints and inference tradeoffs.",
            "Sentence three compares lexical overlap with semantic understanding behaviors.",
            "Sentence four explains fallback strategies when external providers are unavailable.",
            "Sentence five summarizes evaluation outcomes with stable confidence thresholds.",
        ]
    )

    req = PlagiarismCheckRequest(text=text, use_ai_similarity=False, max_sentences=5)
    start = perf_counter()
    result = await check_plagiarism(req)
    elapsed = perf_counter() - start

    assert result.total_sentences == 5
    assert elapsed < 2.0
