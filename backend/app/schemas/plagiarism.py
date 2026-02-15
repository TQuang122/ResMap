"""
Plagiarism Checker Schemas
Ported from: https://github.com/cu-sanjay/Free-Turnitin-Plagiarism-Checker
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from io import BytesIO


class PlagiarismCheckRequest(BaseModel):
    """Request body for plagiarism check."""

    text: str = Field(
        default="",
        description="Text to check for plagiarism (minimum 50 characters if provided)",
    )
    file_content: Optional[str] = Field(
        default=None,
        description="Base64 encoded file content (PDF, DOCX, or TXT)",
    )
    file_name: Optional[str] = Field(
        default=None,
        description="Original filename for content type detection",
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
    use_ai_similarity: bool = Field(
        default=True,
        description="Enable AI semantic similarity when available; falls back to keyword matching",
    )
    exclude_small_matches: int = Field(
        default=0,
        ge=0,
        le=50,
        description="Exclude matches smaller than this word count",
    )
    exclude_small_sources: bool = Field(
        default=False,
        description="Exclude sources with fewer than 3 matches",
    )
    exclude_common_phrases: bool = Field(
        default=True,
        description="Exclude common academic phrases to reduce noise",
    )
    exclude_template_text: bool = Field(
        default=True,
        description="Exclude template/syllabus/policy text",
    )
    citation_severity_reduction: bool = Field(
        default=True,
        description="Reduce severity for cited matches instead of removing",
    )
    min_word_threshold: int = Field(
        default=10,
        ge=1,
        le=50,
        description="Minimum word count for a match to be counted",
    )
    source_contribution_threshold: int = Field(
        default=0,
        ge=0,
        le=10,
        description="Exclude sources contributing less than N% to overall similarity",
    )
    source_type_filter: Optional[List[str]] = Field(
        default=None,
        description="Filter by source types: web, academic, preprint, all",
    )


class PlagiarismProgressEvent(BaseModel):
    """Server-Sent Event for plagiarism check progress."""

    progress: int = Field(ge=0, le=100, description="Progress percentage (0-100)")
    current: int = Field(ge=0, description="Current sentence being processed")
    total: int = Field(ge=0, description="Total sentences to process")
    status: str = Field(
        description="Current status: preparing, retrieval, download, align, rerank, scoring, complete"
    )
    message: Optional[str] = Field(default=None, description="Human-readable message")
    stage: Optional[str] = Field(
        default=None,
        description="Granular stage: preparing, retrieval, download, extract, align, rerank, complete",
    )
    debug: Optional[dict] = Field(
        default=None,
        description="Debug metadata: candidates_fetched, sources_parsed, spans_found, sentences_processed",
    )


class SourceMatch(BaseModel):
    """A source URL that matches part of the text."""

    url: str
    similarity: int = Field(
        ..., ge=0, le=100, description="Similarity percentage (0-100)"
    )
    matched_ngrams: List[str] = Field(
        default_factory=list,
        description="List of matching n-grams (3-5 word phrases) found in this source",
    )
    passage_matches: List[dict] = Field(
        default_factory=list,
        description="Passage-level matches with start/end positions and matched text",
    )
    confidence_score: Optional[str] = Field(
        default=None,
        description="Confidence level: high, medium, low",
    )
    match_type: Optional[str] = Field(
        default=None,
        description="Match type: exact, passage, semantic_only, possible_paraphrase",
    )


class SentenceResult(BaseModel):
    """Result for a single sentence."""

    sentence: str
    similarity: int = Field(
        ..., ge=0, le=100, description="Maximum similarity percentage found"
    )
    semantic_similarity: int = Field(
        default=0, ge=0, le=100, description="Semantic similarity percentage (0-100)"
    )
    used_ai: bool = Field(
        default=False,
        description="True when AI semantic scoring was used for this sentence",
    )
    fallback_used: bool = Field(
        default=False,
        description="True when this sentence fell back to keyword scoring",
    )
    analysis_method: Optional[str] = Field(
        default=None,
        description="Method used for this sentence: semantic or keyword",
    )
    sources: List[SourceMatch] = Field(
        default_factory=list, description="List of matching sources"
    )
    matched_ngrams: List[str] = Field(
        default_factory=list,
        description="All matching n-grams from all sources (for word-level scoring)",
    )
    is_plagiarized: bool = Field(..., description="True if similarity > 50%")
    paraphrase_detected: bool = Field(
        default=False,
        description="True when semantic similarity > keyword similarity (paraphrase detected)",
    )


class ReportV2SourceSpan(BaseModel):
    sentence_index: int = Field(
        ..., ge=0, description="Index of sentence in submission"
    )
    start_char: int = Field(..., ge=0, description="Start offset in submission text")
    end_char: int = Field(..., ge=0, description="End offset in submission text")
    similarity: int = Field(
        ..., ge=0, le=100, description="Span-level similarity score"
    )


class ReportV2SourceGroup(BaseModel):
    source_id: str = Field(..., description="Stable source identifier")
    source_type: str = Field(..., description="Source type, for example web or journal")
    canonical_url: str = Field(..., description="Canonical source URL")
    spans: List[ReportV2SourceSpan] = Field(
        default_factory=list,
        description="Matched spans attributed to this source",
    )
    source_category: str = Field(
        default="internet",
        description="Category: academic_database, preprint, web",
    )
    credibility_score: int = Field(
        default=50,
        ge=0,
        le=100,
        description="Credibility score based on source type (0-100)",
    )


class ReportV2Caveat(BaseModel):
    code: str = Field(..., description="Machine-readable caveat code")
    message: str = Field(..., description="Human-readable caveat summary")


class MatchGroup(BaseModel):
    """Match group categorized by citation and quotation status (Turnitin-style)."""

    group_type: str = Field(
        ...,
        description="Group type: not_cited_or_quoted, missing_quotations, missing_citation, cited_and_quoted",
    )
    count: int = Field(default=0, ge=0, description="Number of matches in this group")
    percentage: float = Field(
        default=0.0, ge=0, le=100, description="Percentage of total matches"
    )
    sample_sentences: List[str] = Field(
        default_factory=list,
        description="Sample sentences from this group for display",
    )


class ReportV2(BaseModel):
    source_groups: List[ReportV2SourceGroup] = Field(
        default_factory=list,
        description="Source-centric grouping of matched spans",
    )
    match_groups: List[MatchGroup] = Field(
        default_factory=list,
        description="Match groups categorized by citation/quotation status",
    )
    caveats: List[ReportV2Caveat] = Field(
        default_factory=list,
        description="Generation caveats and limitations",
    )
    metadata: Optional[dict[str, str]] = Field(
        default=None,
        description="Optional metadata placeholders for report generation context",
    )


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
    used_ai_similarity: bool = Field(
        default=False,
        description="True when AI semantic similarity is used for at least one sentence",
    )
    fallback_used: bool = Field(
        default=False,
        description="True when service falls back to keyword matching",
    )
    analysis_method: Optional[str] = Field(
        default=None,
        description="Analysis method used: semantic, keyword, or hybrid",
    )
    ai_quota_remaining: Optional[int] = Field(
        default=None,
        ge=0,
        description="Remaining AI quota for current window",
    )
    ai_quota_percent: Optional[float] = Field(
        default=None,
        ge=0,
        le=100,
        description="AI quota usage percent",
    )
    source_counts: Optional[dict[str, int]] = Field(
        default=None,
        description="Optional telemetry: source usage counts by source type",
    )
    source_failures: Optional[List[str]] = Field(
        default=None,
        description="Optional telemetry: source connectors that failed/degraded",
    )
    quota_mode: Optional[str] = Field(
        default=None,
        description="Optional telemetry: active quota mode (memory or persistent mode)",
    )
    ai_detection_score: Optional[float] = Field(
        default=None,
        ge=0,
        le=100,
        description="AI detection score - probability that text is AI-generated (0-100)",
    )
    ai_detection_confidence: Optional[str] = Field(
        default=None,
        description="AI detection confidence: high, medium, or low",
    )
    report_v2: Optional[ReportV2] = Field(
        default=None,
        description="Optional extended plagiarism report contract",
    )
