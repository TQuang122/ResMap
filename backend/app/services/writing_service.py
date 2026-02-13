import asyncio
from functools import lru_cache

from google import genai
from google.genai import errors as genai_errors

from app.core.config import settings


class WritingService:
    def __init__(
        self, gemini_api_key: str = "", model: str = "models/gemini-2.5-flash"
    ):
        self.gemini_api_key = gemini_api_key
        self.model = model if model.startswith("models/") else f"models/{model}"

        self._client = (
            genai.Client(api_key=self.gemini_api_key) if self.gemini_api_key else None
        )

    @lru_cache(maxsize=128)
    def _build_prompt(self, task: str, tone: str, output_language: str) -> str:
        """Build cached prompt based on task parameters."""
        lang_instruction = ""
        if output_language.lower() in ["vietnamese", "vi", "tiếng việt"]:
            lang_instruction = "Output must be in Vietnamese."
        elif output_language.lower() in ["english", "en", "tiếng anh"]:
            lang_instruction = "Output must be in English."

        tone_instruction = f"Use a {tone} tone." if tone else ""

        if task == "summarize":
            return f"Summarize the following text concisely. {tone_instruction} {lang_instruction}\n\nText: {{text}}"
        elif task == "rewrite":
            return f"Rewrite the following text to improve clarity and academic quality. {tone_instruction} {lang_instruction}\n\nText: {{text}}"
        elif task == "polish":
            return f"Polish and refine the following text for academic publication. {tone_instruction} {lang_instruction}\n\nText: {{text}}"
        elif task == "expand":
            return f"Expand the following text with more details and examples while maintaining academic tone. {tone_instruction} {lang_instruction}\n\nText: {{text}}"
        else:
            return f"Process the following text. {tone_instruction} {lang_instruction}\n\nText: {{text}}"

    async def assist(
        self, *, text: str, task: str, tone: str, output_language: str
    ) -> str:
        if not self.gemini_api_key:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        if not self._client:
            raise RuntimeError("Gemini client is not initialized")

        client = self._client
        assert client is not None

        prompt = self._build_prompt(task, tone, output_language).replace("{text}", text)

        def _run() -> str:
            try:
                resp = client.models.generate_content(model=self.model, contents=prompt)
            except genai_errors.APIError as e:
                # Map upstream API errors to a RuntimeError so the endpoint can return 503.
                raise RuntimeError(f"Gemini API error: {e}")

            # Extract text safely; some responses can be blocked or empty.
            try:
                t = getattr(resp, "text", None)
                if isinstance(t, str) and t.strip():
                    return t.strip()
            except Exception:
                # Accessing .text can raise if the response has no candidates.
                pass

            cand = getattr(resp, "candidates", None)
            if isinstance(cand, list) and cand:
                content = getattr(cand[0], "content", None)
                parts = getattr(content, "parts", None) if content else None
                if isinstance(parts, list) and parts:
                    p0 = parts[0]
                    t2 = getattr(p0, "text", None)
                    if isinstance(t2, str) and t2.strip():
                        return t2.strip()

            raise RuntimeError(
                "Gemini returned an empty/blocked response. Please try different wording."
            )

        return await asyncio.to_thread(_run)


writing_service = WritingService(gemini_api_key=settings.GEMINI_API_KEY)
