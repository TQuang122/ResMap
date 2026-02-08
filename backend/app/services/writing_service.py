import asyncio

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

    async def assist(
        self, *, text: str, task: str, tone: str, output_language: str
    ) -> str:
        if not self.gemini_api_key:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        if not self._client:
            raise RuntimeError("Gemini client is not initialized")

        # Type assertion for static type checker
        client = self._client
        assert client is not None

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
