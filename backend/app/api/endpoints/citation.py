from fastapi import APIRouter
from app.schemas.citation import CitationRequest, CitationResponse
from app.services.citation_service import citation_service

router = APIRouter()


@router.post("/check", response_model=CitationResponse)
async def check_citation(request: CitationRequest):
    return citation_service.check_citation(request.text, request.style)
