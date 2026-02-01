from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class PaperType(str, Enum):
    SURVEY = "survey"
    EMPIRICAL = "empirical"
    BENCHMARK = "benchmark"
    CASE_STUDY = "case"


# ============ Query Builder ============


class QueryRequest(BaseModel):
    topic: str
    year_start: int = 2020
    year_end: int = 2025
    paper_types: List[PaperType] = []
    domain: Optional[str] = None  # e.g., "Computer Science", "Business"


class QueryVariant(BaseModel):
    source: str  # "google_scholar", "semantic_scholar", "acm", "ieee", "openalex"
    query: str
    url: Optional[str] = None


class QueryResponse(BaseModel):
    original_topic: str
    keywords: List[str]  # Extracted/expanded keywords
    synonyms: List[str]  # Synonym variations
    queries: List[QueryVariant]


# ============ Paper Search ============


class Author(BaseModel):
    name: str
    affiliation: Optional[str] = None


class Paper(BaseModel):
    id: str
    title: str
    abstract: Optional[str] = None
    authors: List[Author]
    year: Optional[int] = None
    venue: Optional[str] = None  # Journal/Conference name
    cited_by_count: int = 0
    paper_type: Optional[str] = None
    open_access_url: Optional[str] = None
    doi: Optional[str] = None
    concepts: List[str] = []  # Research areas/topics


class SearchRequest(BaseModel):
    query: str
    year_start: int = 2020
    year_end: int = 2025
    paper_types: List[PaperType] = []
    limit: int = 20
    sort_by: str = "relevance"  # "relevance", "cited_by_count", "publication_date"


class SearchResponse(BaseModel):
    total_count: int
    papers: List[Paper]
    query_used: str


# ============ Paper Scorecard ============


class ScoreItem(BaseModel):
    score: int  # 1-10
    reason: str  # 1-2 sentences explanation


class ScoreRequest(BaseModel):
    paper: Paper
    research_question: str
    context: Optional[str] = None  # Additional context about user's research


class ScoreResponse(BaseModel):
    paper_id: str
    paper_title: str

    # 6 scoring criteria
    relevance: ScoreItem
    novelty: ScoreItem
    methodology: ScoreItem
    reproducibility: ScoreItem
    citation_context: ScoreItem
    dataset_fit: ScoreItem

    # Overall assessment
    overall_score: float  # Average of all scores
    decision: str  # "keep", "maybe", "skip"
    summary: str  # 1-2 sentence summary of why to keep/skip

    # Error field for debugging
    error: Optional[str] = None  # Error message if AI evaluation failed


class BatchScoreRequest(BaseModel):
    papers: List[Paper]
    research_question: str
    context: Optional[str] = None


class BatchScoreResponse(BaseModel):
    scores: List[ScoreResponse]
