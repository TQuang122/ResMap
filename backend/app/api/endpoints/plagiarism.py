"""
Plagiarism Checker API Endpoints
"""

from fastapi import APIRouter, HTTPException, Request, Depends

from app.schemas.plagiarism import PlagiarismCheckRequest, PlagiarismCheckResponse
from app.services.plagiarism import check_plagiarism
from app.services.semantic_similarity import get_quota_info, resolve_quota_user_key
from app.core.limiter import limiter
from app.api.deps import get_current_user

router = APIRouter()


@router.post(
    "/plagiarism-check",
    response_model=PlagiarismCheckResponse,
    summary="Check text for plagiarism",
    description="""
    Analyzes the provided text for potential plagiarism by:
    1. Splitting the text into sentences
    2. Searching the web (DuckDuckGo + CrossRef) for each sentence
    3. Calculating similarity scores using Cosine and N-gram methods
    
    Returns detailed results per sentence and overall plagiarism statistics.
    
    **Note:** This process may take 10-60 seconds depending on text length.
    """,
)
@limiter.limit("3/minute")
async def plagiarism_check(
    request: Request,
    payload: PlagiarismCheckRequest,
    current_user: dict = Depends(get_current_user),
) -> PlagiarismCheckResponse:
    """
    Check text for plagiarism.

    - **text**: The text to check (minimum 50 characters)
    - **exclude_citations**: If true, quoted text will be excluded from analysis
    - **max_sentences**: Maximum number of sentences to check (1-50, default 20)
    """
    try:
        anon_seed = request.client.host if request.client else None
        user_key = resolve_quota_user_key(
            current_user=current_user, anon_seed=anon_seed
        )
        result = await check_plagiarism(payload, user_key=user_key)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Plagiarism check failed: {str(e)}"
        )


@router.get(
    "/plagiarism-check/quota",
    summary="Get AI similarity quota usage",
    description="Returns current semantic similarity quota usage and reset time.",
)
@limiter.limit("30/minute")
async def plagiarism_quota(
    request: Request,
    current_user: dict = Depends(get_current_user),
) -> dict:
    anon_seed = request.client.host if request.client else None
    user_key = resolve_quota_user_key(current_user=current_user, anon_seed=anon_seed)
    return get_quota_info(user_key=user_key)
