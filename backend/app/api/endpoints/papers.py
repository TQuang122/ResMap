from fastapi import APIRouter, Request, Depends
from app.schemas.paper import (
    QueryRequest,
    QueryResponse,
    SearchRequest,
    SearchResponse,
    ScoreRequest,
    ScoreResponse,
    BatchScoreRequest,
    BatchScoreResponse,
)
from app.services.paper_service import paper_service
from app.core.limiter import limiter
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/queries", response_model=QueryResponse)
@limiter.limit("20/minute")
async def generate_queries(
    request: Request,
    payload: QueryRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Generate search queries for different academic sources.

    Returns queries formatted for Google Scholar, OpenAlex, IEEE, ACM, Semantic Scholar
    with keyword expansion and synonyms.
    """
    return await paper_service.generate_queries(payload)


@router.post("/search", response_model=SearchResponse)
@limiter.limit("30/minute")
async def search_papers(
    request: Request,
    payload: SearchRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Search papers using OpenAlex API.

    Returns papers with title, abstract, authors, citations, and open access links.
    """
    return await paper_service.search_papers(payload)


@router.post("/score", response_model=ScoreResponse)
@limiter.limit("10/minute")
async def score_paper(
    request: Request,
    payload: ScoreRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Score a single paper using AI based on 6 criteria:
    - Relevance: How directly does it address the research question?
    - Novelty: Does it contribute something new?
    - Methodology: How clear and rigorous?
    - Reproducibility: Could you replicate this?
    - Citation Context: How is it typically cited?
    - Dataset Fit: Does their data match your needs?

    Returns scores (1-10) with explanations and overall decision (keep/maybe/skip).
    """
    return await paper_service.score_paper(payload)


@router.post("/score/batch", response_model=BatchScoreResponse)
@limiter.limit("5/minute")
async def score_papers_batch(
    request: Request,
    payload: BatchScoreRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Score multiple papers in batch. Limited to 5 papers per request.
    """
    scores = []
    for paper in payload.papers[:5]:  # Limit to 5
        score_request = ScoreRequest(
            paper=paper,
            research_question=payload.research_question,
            context=payload.context,
        )
        result = await paper_service.score_paper(score_request)
        scores.append(result)

    return BatchScoreResponse(scores=scores)
