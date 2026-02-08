import asyncio
import json
import re
from typing import List, Optional

from google import genai
from async_lru import alru_cache

from app.core.config import settings
from app.schemas.topic import TopicSuggestion


class LLMService:
    def __init__(
        self, gemini_api_key: str = "", model: str = "models/gemini-2.5-flash"
    ):
        self.gemini_api_key = gemini_api_key
        self.model = model if model.startswith("models/") else f"models/{model}"

        self._client = (
            genai.Client(api_key=self.gemini_api_key) if self.gemini_api_key else None
        )

    async def _gemini_generate(self, prompt: str) -> str:
        if not self.gemini_api_key:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        if not self._client:
            raise RuntimeError("Gemini client is not initialized")

        def _run() -> str:
            resp = self._client.models.generate_content(
                model=self.model, contents=prompt
            )
            text = getattr(resp, "text", None)
            if isinstance(text, str):
                return text.strip()
            # Fallback: try common response shapes
            cand = getattr(resp, "candidates", None)
            if isinstance(cand, list) and cand:
                content = getattr(cand[0], "content", None)
                parts = getattr(content, "parts", None) if content else None
                if isinstance(parts, list) and parts:
                    p0 = parts[0]
                    t = getattr(p0, "text", None)
                    if isinstance(t, str):
                        return t.strip()
            return ""

        return await asyncio.to_thread(_run)

    def _extract_json(self, text: str) -> Optional[dict]:
        # Gemini sometimes wraps JSON in ```json blocks.
        m = re.search(r"```json\s*(\{.*?\})\s*```", text, flags=re.S)
        if m:
            try:
                return json.loads(m.group(1))
            except Exception:
                return None

        m = re.search(r"(\{.*\})", text, flags=re.S)
        if m:
            try:
                return json.loads(m.group(1))
            except Exception:
                return None

        return None

    @alru_cache(maxsize=128, ttl=3600)
    async def suggest_topics(
        self, major: str, keywords: str | None
    ) -> List[TopicSuggestion]:
        """
        Suggest 5 research/capstone topics.
        Uses Gemini if configured; falls back to the old heuristic list.
        """
        kw = keywords if keywords else "general"

        def _fallback_topics() -> List[TopicSuggestion]:
            m = major.lower()
            if "phần mềm" in m or "software" in m:
                return [
                    TopicSuggestion(
                        title=f"AI Applications in {kw}",
                        description=f"Research how to apply Generative AI to optimize {kw} processes.",
                        difficulty="Hard",
                    ),
                    TopicSuggestion(
                        title=f"Microservices Architecture for {kw}",
                        description="Design and implement scalable microservices architecture.",
                        difficulty="Medium",
                    ),
                    TopicSuggestion(
                        title=f"Mobile App Development for {kw}",
                        description="Build cross-platform mobile solutions using Flutter/React Native.",
                        difficulty="Easy",
                    ),
                    TopicSuggestion(
                        title=f"Security and Privacy in {kw}",
                        description=f"Analyze security risks (prompt injection, data leakage) and propose protection measures for {kw}.",
                        difficulty="Medium",
                    ),
                    TopicSuggestion(
                        title=f"Performance and Cost Optimization for {kw}",
                        description=f"Research caching, batching, quantization and routing to reduce latency/cost in {kw}.",
                        difficulty="Hard",
                    ),
                ]

            if "kinh doanh" in m or "biz" in m:
                return [
                    TopicSuggestion(
                        title=f"Impact of {kw} on Gen Z Consumer Behavior",
                        description="Quantitative research on shopping habit changes.",
                        difficulty="Medium",
                    ),
                    TopicSuggestion(
                        title=f"Digital Marketing Strategies for {kw}",
                        description="Analyze effectiveness of social media channels for product promotion.",
                        difficulty="Easy",
                    ),
                    TopicSuggestion(
                        title=f"Personalization Using {kw} for Customer Journeys",
                        description="Design segmentation models and content/offers personalization based on behavioral data.",
                        difficulty="Medium",
                    ),
                    TopicSuggestion(
                        title=f"Measuring ROI for {kw} Implementation",
                        description="Build KPI framework and investment efficiency evaluation over time.",
                        difficulty="Medium",
                    ),
                    TopicSuggestion(
                        title=f"Legal and Ethical Risks of {kw}",
                        description="Analyze privacy, copyright risks and propose governance policies.",
                        difficulty="Hard",
                    ),
                ]

            return [
                TopicSuggestion(
                    title=f"Research on {kw} Trends in 2024",
                    description="Literature review and emerging trend analysis.",
                    difficulty="Easy",
                ),
                TopicSuggestion(
                    title=f"Technology Applications in {major}",
                    description="Assessing the impact of digital transformation.",
                    difficulty="Medium",
                ),
                TopicSuggestion(
                    title=f"Comparative Analysis of {kw} Solutions",
                    description="Design evaluation criteria (performance, cost, accuracy) and conduct empirical assessment.",
                    difficulty="Medium",
                ),
                TopicSuggestion(
                    title=f"Readiness Assessment for {kw} Adoption",
                    description="Design survey, analyze data and propose implementation roadmap.",
                    difficulty="Easy",
                ),
                TopicSuggestion(
                    title=f"Process Optimization Model with {kw}",
                    description="Build prototype process, measure productivity improvements and operational risks.",
                    difficulty="Hard",
                ),
            ]

        if self.gemini_api_key:
            prompt = f"""
You are a research mentor for FPT University students.

Task: Suggest exactly 5 novel research/capstone topics.

Major: {major}
Interests/keywords: {kw}

Constraints:
- Output must be valid JSON.
- Return an object with key "topics".
- "topics" is an array of 5 items.
- Each item has: title (string), description (string, 1-2 sentences), difficulty ("Easy"|"Medium"|"Hard").
- ALL titles and descriptions MUST be in ENGLISH.
- Keep topics practical and feasible for a semester project.
"""

            try:
                raw = await self._gemini_generate(prompt)
                data = self._extract_json(raw) or {}
                items = data.get("topics") if isinstance(data, dict) else None
                if isinstance(items, list) and len(items) > 0:
                    out: List[TopicSuggestion] = []
                    for it in items[:5]:
                        if not isinstance(it, dict):
                            continue
                        title = str(it.get("title", "")).strip()
                        desc = str(it.get("description", "")).strip()
                        diff = str(it.get("difficulty", "Medium")).strip()
                        if title and desc:
                            out.append(
                                TopicSuggestion(
                                    title=title, description=desc, difficulty=diff
                                )
                            )
                    if out:
                        # Ensure we always return exactly 5 topics.
                        if len(out) < 5:
                            fb = _fallback_topics()
                            seen = {t.title for t in out}
                            for t in fb:
                                if t.title not in seen:
                                    out.append(t)
                                    seen.add(t.title)
                                if len(out) >= 5:
                                    break
                        return out[:5]
            except Exception:
                # fall back to heuristic list below
                pass

        return _fallback_topics()


llm_service = LLMService(gemini_api_key=settings.GEMINI_API_KEY)
