from fastapi import APIRouter, Request, Depends
from app.schemas.topic import TopicRequest, TopicResponse
from app.services.llm_service import llm_service
from app.core.limiter import limiter
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/suggest", response_model=TopicResponse)
@limiter.limit("10/minute")
async def suggest_topics(
    request: Request,
    payload: TopicRequest,
    current_user: dict = Depends(get_current_user),
):
    topics = await llm_service.suggest_topics(payload.major, payload.keywords)
    return TopicResponse(topics=topics)
