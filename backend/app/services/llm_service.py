import asyncio
import json
import re
from typing import List, Optional

import google.generativeai as genai

from app.core.config import settings
from app.schemas.topic import TopicSuggestion


class LLMService:
    def __init__(self, gemini_api_key: str = "", model: str = "gemini-1.5-flash"):
        self.gemini_api_key = gemini_api_key
        self.model = model

        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)

    async def _gemini_generate(self, prompt: str) -> str:
        if not self.gemini_api_key:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        def _run() -> str:
            model = genai.GenerativeModel(self.model)
            resp = model.generate_content(prompt)
            return (resp.text or "").strip()

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

    async def suggest_topics(
        self, major: str, keywords: str | None
    ) -> List[TopicSuggestion]:
        """
        Suggest 5 research/capstone topics.
        Uses Gemini if configured; falls back to the old heuristic list.
        """
        kw = keywords if keywords else "general"

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
                        return out
            except Exception:
                # fall back to heuristic list below
                pass

        if "phần mềm" in major.lower() or "software" in major.lower():
            return [
                TopicSuggestion(
                    title=f"Ứng dụng AI trong {kw}",
                    description=f"Nghiên cứu cách áp dụng Generative AI để tối ưu hóa quy trình {kw}.",
                    difficulty="Hard",
                ),
                TopicSuggestion(
                    title=f"Xây dựng hệ thống {kw} dựa trên Microservices",
                    description="Thiết kế và triển khai kiến trúc microservices có khả năng mở rộng cao.",
                    difficulty="Medium",
                ),
                TopicSuggestion(
                    title=f"Phát triển ứng dụng Mobile cho {kw}",
                    description="Xây dựng giải pháp di động cross-platform sử dụng Flutter/React Native.",
                    difficulty="Easy",
                ),
            ]

        if "kinh doanh" in major.lower() or "biz" in major.lower():
            return [
                TopicSuggestion(
                    title=f"Tác động của {kw} đến hành vi người tiêu dùng Gen Z",
                    description="Nghiên cứu định lượng về sự thay đổi thói quen mua sắm.",
                    difficulty="Medium",
                ),
                TopicSuggestion(
                    title=f"Chiến lược Digital Marketing cho {kw}",
                    description="Phân tích hiệu quả các kênh social media trong việc quảng bá sản phẩm.",
                    difficulty="Easy",
                ),
            ]

        # Default fallback
        return [
            TopicSuggestion(
                title=f"Nghiên cứu xu hướng {kw} trong năm 2024",
                description="Tổng quan tài liệu và phân tích xu hướng mới nổi.",
                difficulty="Easy",
            ),
            TopicSuggestion(
                title=f"Ứng dụng công nghệ vào {major}",
                description="Đánh giá tác động của chuyển đổi số.",
                difficulty="Medium",
            ),
        ]


llm_service = LLMService(gemini_api_key=settings.GEMINI_API_KEY)
