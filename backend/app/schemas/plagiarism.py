"""
Plagiarism Checker Schemas
Ported from: https://github.com/cu-sanjay/Free-Turnitin-Plagiarism-Checker
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class PlagiarismCheckRequest(BaseModel):
    """Request body for plagiarism check."""

    text: str = Field(
        ...,
        min_length=50,
        description="Text to check for plagiarism (minimum 50 characters)",
    )
    exclude_citations: bool = Field(
        default=False, description="Whether to exclude quoted text from analysis"
    )
    max_sentences: int = Field(
        default=20,
        ge=1,
        le=50,
        description="Maximum number of sentences to check (1-50)",
    )


class SourceMatch(BaseModel):
    """A source URL that matches part of the text."""

    url: str
    similarity: int = Field(
        ..., ge=0, le=100, description="Similarity percentage (0-100)"
    )


class SentenceResult(BaseModel):
    """Result for a single sentence."""

    sentence: str
    similarity: int = Field(
        ..., ge=0, le=100, description="Maximum similarity percentage found"
    )
    sources: List[SourceMatch] = Field(
        default_factory=list, description="List of matching sources"
    )
    is_plagiarized: bool = Field(..., description="True if similarity > 50%")


class PlagiarismCheckResponse(BaseModel):
    """Response from plagiarism check."""

    overall_score: int = Field(
        ..., ge=0, le=100, description="Average similarity score across all sentences"
    )
    plagiarism_percentage: int = Field(
        ..., ge=0, le=100, description="Percentage of sentences flagged as plagiarized"
    )
    total_sentences: int = Field(
        ..., ge=0, description="Total number of sentences analyzed"
    )
    plagiarized_sentences: int = Field(
        ..., ge=0, description="Number of sentences flagged as plagiarized"
    )
    results: List[SentenceResult] = Field(
        default_factory=list, description="Detailed results per sentence"
    )
