import asyncio
import json
import re
from typing import List, Optional, Dict, Any
import httpx
from async_lru import alru_cache

from google import genai

from app.core.config import settings
from app.schemas.paper import (
    Paper,
    Author,
    PaperType,
    QueryRequest,
    QueryResponse,
    QueryVariant,
    SearchRequest,
    SearchResponse,
    ScoreRequest,
    ScoreResponse,
    ScoreItem,
)


class PaperService:
    """
    Service for searching papers (OpenAlex) and scoring them (Gemini AI).
    """

    OPENALEX_BASE = "https://api.openalex.org/works"

    def __init__(self, gemini_api_key: str = "", openalex_email: str = ""):
        self.gemini_api_key = gemini_api_key
        self.openalex_email = openalex_email
        self._client = (
            genai.Client(api_key=self.gemini_api_key) if self.gemini_api_key else None
        )

    # ============ Helper Methods ============

    def _decode_abstract(self, inverted_index: Optional[Dict[str, List[int]]]) -> str:
        """Convert OpenAlex inverted index to readable abstract."""
        if not inverted_index:
            return ""

        word_positions: List[tuple] = []
        for word, positions in inverted_index.items():
            for pos in positions:
                word_positions.append((pos, word))

        word_positions.sort(key=lambda x: x[0])
        return " ".join(word for _, word in word_positions)

    def _extract_json(self, text: str) -> Optional[dict]:
        """Extract JSON from LLM response (handles ```json blocks)."""
        m = re.search(r"```json\s*(\{.*?\})\s*```", text, flags=re.S)
        if m:
            try:
                return json.loads(m.group(1))
            except Exception:
                pass

        m = re.search(r"(\{.*\})", text, flags=re.S)
        if m:
            try:
                return json.loads(m.group(1))
            except Exception:
                pass

        return None

    async def _gemini_generate(self, prompt: str) -> str:
        """Generate text using Gemini API."""
        if not self.gemini_api_key or not self._client:
            raise RuntimeError("Gemini API is not configured")

        def _run() -> str:
            resp = self._client.models.generate_content(
                model="models/gemini-2.0-flash", contents=prompt
            )
            text = getattr(resp, "text", None)
            if isinstance(text, str):
                return text.strip()
            cand = getattr(resp, "candidates", None)
            if isinstance(cand, list) and cand:
                content = getattr(cand[0], "content", None)
                parts = getattr(content, "parts", None) if content else None
                if isinstance(parts, list) and parts:
                    t = getattr(parts[0], "text", None)
                    if isinstance(t, str):
                        return t.strip()
            return ""

        return await asyncio.to_thread(_run)

    def _parse_openalex_paper(self, item: Dict[str, Any]) -> Paper:
        """Parse OpenAlex API response item to Paper model."""
        # Extract authors
        authors = []
        for authorship in item.get("authorships", [])[:5]:  # Limit to 5 authors
            author_data = authorship.get("author", {})
            institutions = authorship.get("institutions", [])
            affiliation = institutions[0].get("display_name") if institutions else None
            authors.append(
                Author(
                    name=author_data.get("display_name", "Unknown"),
                    affiliation=affiliation,
                )
            )

        # Extract venue (source)
        primary_location = item.get("primary_location", {}) or {}
        source = primary_location.get("source", {}) or {}
        venue = source.get("display_name", "")

        # Extract open access URL
        oa_url = None
        if primary_location.get("is_oa"):
            oa_url = primary_location.get("pdf_url") or primary_location.get(
                "landing_page_url"
            )

        # If not in primary, check best_oa_location
        if not oa_url:
            best_oa = item.get("best_oa_location", {}) or {}
            oa_url = best_oa.get("pdf_url") or best_oa.get("landing_page_url")

        # Extract concepts (topics)
        concepts = [c.get("display_name", "") for c in item.get("concepts", [])[:5]]

        # Determine paper type from OpenAlex type
        openalex_type = item.get("type", "")
        paper_type = None
        if openalex_type == "review":
            paper_type = "survey"
        elif openalex_type == "article":
            paper_type = "empirical"

        return Paper(
            id=item.get("id", ""),
            title=item.get("title", "Untitled"),
            abstract=self._decode_abstract(item.get("abstract_inverted_index")),
            authors=authors,
            year=item.get("publication_year"),
            venue=venue,
            cited_by_count=item.get("cited_by_count", 0),
            paper_type=paper_type,
            open_access_url=oa_url,
            doi=item.get("doi"),
            concepts=concepts,
        )

    # ============ Query Builder ============

    async def generate_queries(self, request: QueryRequest) -> QueryResponse:
        """Generate search queries for different academic sources."""

        # Use Gemini to expand keywords and synonyms
        prompt = f"""
You are an academic research assistant. Given a research topic, generate search keywords and synonyms.

Topic: {request.topic}
Domain: {request.domain or "General"}
Paper types needed: {[pt.value for pt in request.paper_types] if request.paper_types else "all"}

Output JSON with:
- keywords: list of 3-5 key search terms
- synonyms: list of 3-5 alternative/related terms

Example output:
{{"keywords": ["machine learning", "sentiment analysis", "NLP"], "synonyms": ["deep learning", "opinion mining", "text classification"]}}
"""

        keywords = [request.topic]
        synonyms = []

        if self.gemini_api_key:
            try:
                raw = await self._gemini_generate(prompt)
                data = self._extract_json(raw)
                if data:
                    keywords = data.get("keywords", keywords)
                    synonyms = data.get("synonyms", [])
            except Exception:
                pass

        # Build queries for different sources
        base_query = " ".join(keywords[:3])
        year_filter = f"{request.year_start}-{request.year_end}"

        # Paper type filters
        type_terms = []
        for pt in request.paper_types:
            if pt == PaperType.SURVEY:
                type_terms.append("survey OR review OR systematic review")
            elif pt == PaperType.EMPIRICAL:
                type_terms.append("empirical OR experimental OR study")
            elif pt == PaperType.BENCHMARK:
                type_terms.append("benchmark OR comparison OR evaluation")
            elif pt == PaperType.CASE_STUDY:
                type_terms.append("case study OR application")

        queries = []

        # Google Scholar query
        gs_query = base_query
        if type_terms:
            gs_query += f" ({' OR '.join(type_terms)})"
        gs_url = f"https://scholar.google.com/scholar?q={gs_query.replace(' ', '+')}&as_ylo={request.year_start}&as_yhi={request.year_end}"
        queries.append(
            QueryVariant(source="google_scholar", query=gs_query, url=gs_url)
        )

        # OpenAlex query (what we'll actually use)
        oa_query = base_query
        queries.append(
            QueryVariant(
                source="openalex",
                query=oa_query,
                url=f"{self.OPENALEX_BASE}?search={oa_query.replace(' ', '+')}&filter=from_publication_date:{request.year_start}-01-01",
            )
        )

        # IEEE Xplore query
        ieee_query = f'("{base_query}")'
        ieee_url = f"https://ieeexplore.ieee.org/search/searchresult.jsp?queryText={ieee_query.replace(' ', '%20')}&ranges={request.year_start}_{request.year_end}_Year"
        queries.append(QueryVariant(source="ieee", query=ieee_query, url=ieee_url))

        # ACM Digital Library query
        acm_query = base_query
        acm_url = f"https://dl.acm.org/action/doSearch?AllField={acm_query.replace(' ', '+')}&AfterYear={request.year_start}&BeforeYear={request.year_end}"
        queries.append(QueryVariant(source="acm", query=acm_query, url=acm_url))

        # Semantic Scholar query
        ss_url = f"https://www.semanticscholar.org/search?q={base_query.replace(' ', '%20')}&year%5B0%5D={request.year_start}&year%5B1%5D={request.year_end}"
        queries.append(
            QueryVariant(source="semantic_scholar", query=base_query, url=ss_url)
        )

        return QueryResponse(
            original_topic=request.topic,
            keywords=keywords,
            synonyms=synonyms,
            queries=queries,
        )

    # ============ Paper Search (OpenAlex) ============

    async def search_papers(self, request: SearchRequest) -> SearchResponse:
        """Search papers using OpenAlex API."""

        # Build filter string
        filters = [
            f"from_publication_date:{request.year_start}-01-01",
            f"to_publication_date:{request.year_end}-12-31",
        ]

        # Add paper type filter if specified
        if request.paper_types:
            type_filters = []
            for pt in request.paper_types:
                if pt == PaperType.SURVEY:
                    type_filters.append("type:review")
                elif pt == PaperType.EMPIRICAL:
                    type_filters.append("type:article")
            if type_filters:
                filters.append(f"({','.join(type_filters)})")

        # Determine sort
        sort_param = "relevance_score:desc"
        if request.sort_by == "cited_by_count":
            sort_param = "cited_by_count:desc"
        elif request.sort_by == "publication_date":
            sort_param = "publication_date:desc"

        params = {
            "search": request.query,
            "filter": ",".join(filters),
            "per_page": min(request.limit, 50),  # Max 50 per page
            "sort": sort_param,
            "select": "id,title,publication_year,cited_by_count,abstract_inverted_index,authorships,primary_location,best_oa_location,concepts,type,doi",
        }

        if self.openalex_email:
            params["mailto"] = self.openalex_email

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.get(self.OPENALEX_BASE, params=params)
                response.raise_for_status()
                data = response.json()
            except Exception as e:
                # Return empty result on error
                return SearchResponse(
                    total_count=0, papers=[], query_used=request.query
                )

        # Parse results
        papers = []
        for item in data.get("results", []):
            try:
                paper = self._parse_openalex_paper(item)
                papers.append(paper)
            except Exception:
                continue

        return SearchResponse(
            total_count=data.get("meta", {}).get("count", len(papers)),
            papers=papers,
            query_used=request.query,
        )

    # ============ Paper Scoring (Gemini AI) ============

    async def score_paper(self, request: ScoreRequest) -> ScoreResponse:
        """Score a paper using Gemini AI based on 6 criteria."""

        paper = request.paper

        prompt = f"""
You are a research mentor helping a student evaluate papers for their literature review.

STUDENT'S RESEARCH QUESTION:
{request.research_question}

{f"ADDITIONAL CONTEXT: {request.context}" if request.context else ""}

PAPER TO EVALUATE:
Title: {paper.title}
Authors: {", ".join([a.name for a in paper.authors[:3]])}
Year: {paper.year}
Venue: {paper.venue or "Unknown"}
Citations: {paper.cited_by_count}
Abstract: {paper.abstract[:1500] if paper.abstract else "No abstract available"}

EVALUATION CRITERIA (score 1-10 for each):

1. RELEVANCE: How directly does this paper address the research question?
   - 9-10: Directly addresses the exact question
   - 6-8: Related topic, useful background
   - 3-5: Tangentially related
   - 1-2: Not relevant

2. NOVELTY: Does this paper contribute something new?
   - Consider: new methods, findings, perspectives
   - Higher if it's a foundational or breakthrough paper

3. METHODOLOGY: How clear and rigorous is the methodology?
   - Can you understand what they did?
   - Is the approach well-justified?

4. REPRODUCIBILITY: Could you replicate this study?
   - Are data sources, methods, tools described?
   - Are there code/data links?

5. CITATION_CONTEXT: How is this paper typically cited?
   - Is it cited positively (as foundation/support)?
   - Or critically (as counterexample/limitation)?
   - Consider the citation count and venue prestige

6. DATASET_FIT: Does their data/context match the student's needs?
   - Similar domain/population?
   - Comparable scale?

OUTPUT FORMAT (JSON only):
{{
  "relevance": {{"score": 8, "reason": "Directly addresses sentiment analysis in social media, which is the core topic."}},
  "novelty": {{"score": 7, "reason": "Proposes a novel attention mechanism, but builds on existing BERT architecture."}},
  "methodology": {{"score": 9, "reason": "Clear experimental setup with ablation studies and baseline comparisons."}},
  "reproducibility": {{"score": 6, "reason": "Code mentioned but not publicly available. Dataset is public."}},
  "citation_context": {{"score": 8, "reason": "Highly cited (2000+), primarily as a benchmark baseline."}},
  "dataset_fit": {{"score": 7, "reason": "Uses Twitter data which is relevant, but different domain (politics vs general)."}},
  "decision": "keep",
  "summary": "Strong foundational paper for BERT-based sentiment analysis. Keep for methodology and baseline comparison."
}}

DECISION RULES:
- "keep": Average score >= 6 AND relevance >= 6
- "maybe": Average score >= 5 OR any single score >= 8
- "skip": Otherwise

Return ONLY the JSON, no other text.
"""

        # Default scores if AI fails
        default_score = ScoreItem(score=5, reason="Unable to evaluate automatically")
        default_response = ScoreResponse(
            paper_id=paper.id,
            paper_title=paper.title,
            relevance=default_score,
            novelty=default_score,
            methodology=default_score,
            reproducibility=default_score,
            citation_context=default_score,
            dataset_fit=default_score,
            overall_score=5.0,
            decision="maybe",
            summary="Automatic evaluation unavailable. Please review manually.",
        )

        if not self.gemini_api_key:
            return default_response

        try:
            raw = await self._gemini_generate(prompt)
            data = self._extract_json(raw)

            if not data:
                return default_response

            # Parse scores
            def parse_score(key: str) -> ScoreItem:
                item = data.get(key, {})
                return ScoreItem(
                    score=min(10, max(1, int(item.get("score", 5)))),
                    reason=str(item.get("reason", "No reason provided"))[:200],
                )

            relevance = parse_score("relevance")
            novelty = parse_score("novelty")
            methodology = parse_score("methodology")
            reproducibility = parse_score("reproducibility")
            citation_context = parse_score("citation_context")
            dataset_fit = parse_score("dataset_fit")

            # Calculate overall score
            scores = [
                relevance.score,
                novelty.score,
                methodology.score,
                reproducibility.score,
                citation_context.score,
                dataset_fit.score,
            ]
            overall = sum(scores) / len(scores)

            return ScoreResponse(
                paper_id=paper.id,
                paper_title=paper.title,
                relevance=relevance,
                novelty=novelty,
                methodology=methodology,
                reproducibility=reproducibility,
                citation_context=citation_context,
                dataset_fit=dataset_fit,
                overall_score=round(overall, 1),
                decision=data.get("decision", "maybe"),
                summary=str(data.get("summary", ""))[:300],
            )

        except Exception:
            return default_response


# Create singleton instance
paper_service = PaperService(
    gemini_api_key=settings.GEMINI_API_KEY, openalex_email=settings.OPENALEX_EMAIL
)
