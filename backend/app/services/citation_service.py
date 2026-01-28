import re
from app.schemas.citation import CitationResponse


class CitationService:
    def check_citation(self, text: str, style: str) -> CitationResponse:
        style = style.upper()

        if style == "APA":
            # Very basic APA check: Look for (Year)
            year_match = re.search(r"\(\d{4}\)", text)
            if not year_match:
                return CitationResponse(
                    is_valid=False,
                    suggestions="APA style usually requires the year in parentheses, e.g., (2023).",
                    corrected_text=None,
                )

            # Check for italicized title (we can't really check italics in plain text string easily without markdown or HTML context)
            # So we assume if it looks like a structure: Author. (Year). Title. Source.
            parts = text.split(".")
            if len(parts) < 4:
                return CitationResponse(
                    is_valid=False,
                    suggestions="APA structure incomplete. Ensure: Author. (Year). Title. Source.",
                    corrected_text=None,
                )

            return CitationResponse(
                is_valid=True,
                suggestions="Looks good! Ensure the Source Name is italicized in your final document.",
                corrected_text=text,
            )

        elif style == "IEEE":
            # IEEE usually starts with [n] or Author name
            # Let's check if it ends with year.
            if not re.search(r"\d{4}\.$", text):
                return CitationResponse(
                    is_valid=False,
                    suggestions="IEEE citations typically end with the year.",
                    corrected_text=None,
                )

            return CitationResponse(
                is_valid=True,
                suggestions="Format appears consistent with IEEE standards.",
                corrected_text=text,
            )

        return CitationResponse(
            is_valid=False, suggestions="Unsupported style. Use APA or IEEE."
        )


citation_service = CitationService()
