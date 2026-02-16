from fastapi.testclient import TestClient

from app.api.deps import get_current_user
from app.main import app
from app.schemas.plagiarism import PlagiarismCheckResponse
from app.api.endpoints import plagiarism as plagiarism_endpoint


def _payload() -> dict:
    return {
        "text": (
            "Machine learning methods are broadly used for sentiment analysis in modern systems. "
            "These techniques help improve accuracy for noisy social media text."
        ),
        "use_ai_similarity": False,
    }


def test_plagiarism_pdf_endpoint_returns_pdf(monkeypatch) -> None:
    async def fake_check_plagiarism(payload, user_key=None):
        return PlagiarismCheckResponse(
            overall_score=35,
            plagiarism_percentage=35,
            total_sentences=1,
            plagiarized_sentences=1,
            results=[],
            used_ai_similarity=False,
            fallback_used=False,
            analysis_method="keyword",
            ai_quota_remaining=100,
            ai_quota_percent=1.0,
            report_generated_at="2026-02-17T00:00:00+00:00",
            report_version="v2.2",
            report_v2=None,
        )

    async def fake_render_pdf(report):
        return b"%PDF-1.7\nfake"

    monkeypatch.setattr(plagiarism_endpoint, "check_plagiarism", fake_check_plagiarism)
    monkeypatch.setattr(
        plagiarism_endpoint, "render_plagiarism_report_pdf", fake_render_pdf
    )

    app.dependency_overrides[get_current_user] = lambda: {"role": "test"}
    with TestClient(app) as client:
        response = client.post(
            "/api/tools/plagiarism-check/report-pdf", json=_payload()
        )
    app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/pdf")
    assert "attachment; filename=" in response.headers.get("content-disposition", "")
    assert response.content.startswith(b"%PDF")


def test_plagiarism_pdf_endpoint_renderer_unavailable(monkeypatch) -> None:
    async def fake_check_plagiarism(payload, user_key=None):
        return PlagiarismCheckResponse(
            overall_score=0,
            plagiarism_percentage=0,
            total_sentences=0,
            plagiarized_sentences=0,
            results=[],
            used_ai_similarity=False,
            fallback_used=False,
            analysis_method="keyword",
            ai_quota_remaining=0,
            ai_quota_percent=0.0,
            report_v2=None,
        )

    async def fake_render_pdf(report):
        raise plagiarism_endpoint.PDFRendererUnavailableError("not ready")

    monkeypatch.setattr(plagiarism_endpoint, "check_plagiarism", fake_check_plagiarism)
    monkeypatch.setattr(
        plagiarism_endpoint, "render_plagiarism_report_pdf", fake_render_pdf
    )

    app.dependency_overrides[get_current_user] = lambda: {"role": "test"}
    with TestClient(app) as client:
        response = client.post(
            "/api/tools/plagiarism-check/report-pdf", json=_payload()
        )
    app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 503
    assert "temporarily unavailable" in response.json().get("detail", "")
