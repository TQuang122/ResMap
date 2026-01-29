import asyncio

import google.generativeai as genai

from app.core.config import settings


class WritingService:
    def __init__(self, gemini_api_key: str = "", model: str = "gemini-1.5-flash"):
        self.gemini_api_key = gemini_api_key
        self.model = model

        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)

    async def assist(
        self, *, text: str, task: str, tone: str, output_language: str
    ) -> str:
        if not self.gemini_api_key:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        action = "Summarize" if task == "summarize" else "Rewrite"
        lang = "Vietnamese" if output_language.lower().startswith("vi") else "English"

        prompt = f"""
You are an academic writing assistant.

Action: {action}
Tone: {tone}
Output language: {lang}

Ethics:
- Do not invent citations, authors, or facts.
- Keep the meaning faithful to the input.

Input text:
"""
        # Keep the input separated to reduce prompt injection risk.
        prompt = prompt + "\n" + text.strip() + "\n"

        def _run() -> str:
            model = genai.GenerativeModel(self.model)
            resp = model.generate_content(prompt)
            return (resp.text or "").strip()

        return await asyncio.to_thread(_run)


writing_service = WritingService(gemini_api_key=settings.GEMINI_API_KEY)
