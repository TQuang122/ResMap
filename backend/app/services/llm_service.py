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
        self, gemini_api_key: str = "", model: str = "models/gemini-flash-latest"
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
                    TopicSuggestion(
                        title=f"Bảo mật và quyền riêng tư trong {kw}",
                        description=f"Phân tích rủi ro bảo mật (prompt injection, data leakage) và đề xuất biện pháp bảo vệ khi triển khai {kw}.",
                        difficulty="Medium",
                    ),
                    TopicSuggestion(
                        title=f"Tối ưu hiệu năng và chi phí cho hệ thống {kw}",
                        description=f"Nghiên cứu caching, batching, quantization và routing để giảm latency/cost khi vận hành {kw}.",
                        difficulty="Hard",
                    ),
                ]

            if "kinh doanh" in m or "biz" in m:
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
                    TopicSuggestion(
                        title=f"Ứng dụng {kw} để cá nhân hóa hành trình khách hàng",
                        description="Thiết kế mô hình phân khúc và cá nhân hóa nội dung/ưu đãi theo dữ liệu hành vi.",
                        difficulty="Medium",
                    ),
                    TopicSuggestion(
                        title=f"Đo lường ROI khi triển khai {kw} trong doanh nghiệp",
                        description="Xây dựng bộ chỉ số KPI và khung đánh giá hiệu quả đầu tư theo thời gian.",
                        difficulty="Medium",
                    ),
                    TopicSuggestion(
                        title=f"Rủi ro pháp lý và đạo đức khi ứng dụng {kw}",
                        description="Phân tích các rủi ro về quyền riêng tư, bản quyền và đề xuất chính sách quản trị.",
                        difficulty="Hard",
                    ),
                ]

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
                TopicSuggestion(
                    title=f"So sánh các giải pháp {kw} hiện nay",
                    description="Thiết kế tiêu chí so sánh (hiệu năng, chi phí, độ chính xác) và đánh giá thực nghiệm.",
                    difficulty="Medium",
                ),
                TopicSuggestion(
                    title=f"Khảo sát mức độ sẵn sàng áp dụng {kw}",
                    description="Thiết kế khảo sát, phân tích dữ liệu và đề xuất lộ trình triển khai phù hợp.",
                    difficulty="Easy",
                ),
                TopicSuggestion(
                    title=f"Mô hình tối ưu hóa quy trình với {kw}",
                    description="Xây dựng quy trình mẫu, đo lường cải thiện năng suất và rủi ro khi vận hành.",
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
