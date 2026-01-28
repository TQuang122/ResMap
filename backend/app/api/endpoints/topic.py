from fastapi import APIRouter, Depends
from app.schemas.topic import TopicRequest, TopicResponse
from app.services.llm_service import llm_service

router = APIRouter()


@router.post("/suggest", response_model=TopicResponse)
async def suggest_topics(request: TopicRequest):
    topics = await llm_service.suggest_topics(request.major, request.keywords)
    return TopicResponse(topics=topics)
