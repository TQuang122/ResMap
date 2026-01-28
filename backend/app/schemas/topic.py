from pydantic import BaseModel
from typing import List, Optional


class TopicRequest(BaseModel):
    major: str  # e.g., "Kỹ thuật phần mềm", "Kinh doanh"
    keywords: Optional[str] = None  # e.g., "AI", "Marketing", "Sustainability"


class TopicSuggestion(BaseModel):
    title: str
    description: str
    difficulty: str  # "Easy", "Medium", "Hard"


class TopicResponse(BaseModel):
    topics: List[TopicSuggestion]
