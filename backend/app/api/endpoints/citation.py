from fastapi import APIRouter, Depends
from app.schemas.citation import CitationRequest, CitationResponse
from app.services.citation_service import citation_service
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/check", response_model=CitationResponse)
async def check_citation(
    request: CitationRequest,
    current_user: dict = Depends(get_current_user),
):
    return citation_service.check_citation(request.text, request.style)
