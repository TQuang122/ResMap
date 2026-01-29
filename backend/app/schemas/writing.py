from pydantic import BaseModel, Field
from typing import Literal


WritingTask = Literal["summarize", "rewrite"]
WritingTone = Literal["academic", "simple", "formal"]


class WritingAssistRequest(BaseModel):
    text: str = Field(..., min_length=50, description="Input text (min 50 chars)")
    task: WritingTask = Field(default="summarize", description="summarize or rewrite")
    tone: WritingTone = Field(default="academic", description="Desired writing tone")
    output_language: str = Field(default="vi", description="Output language (vi/en)")


class WritingAssistResponse(BaseModel):
    result: str
