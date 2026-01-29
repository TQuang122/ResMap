from fastapi import APIRouter, Request
from app.schemas.topic import TopicRequest, TopicResponse
from app.services.llm_service import llm_service
from app.core.limiter import limiter

router = APIRouter()


@router.post("/suggest", response_model=TopicResponse)
@limiter.limit("10/minute")
async def suggest_topics(request: Request, payload: TopicRequest):
    topics = await llm_service.suggest_topics(payload.major, payload.keywords)
    return TopicResponse(topics=topics)
