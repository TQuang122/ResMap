from app.schemas.plagiarism import PlagiarismCheckRequest, PlagiarismCheckResponse
from app.services.plagiarism import check_plagiarism, split_into_sentences


def test_smoke_imports_and_symbols() -> None:
    assert callable(split_into_sentences)
    assert callable(check_plagiarism)
    assert PlagiarismCheckRequest is not None
    assert PlagiarismCheckResponse is not None
