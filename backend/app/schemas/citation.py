from pydantic import BaseModel


class CitationRequest(BaseModel):
    text: str
    style: str  # "APA" or "IEEE"


class CitationResponse(BaseModel):
    is_valid: bool
    suggestions: str
    corrected_text: str | None = None
