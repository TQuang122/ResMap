import asyncio
import html
import os
from datetime import datetime
from typing import Any

from app.core.config import settings
from app.schemas.plagiarism import PlagiarismCheckResponse


class PDFRendererUnavailableError(RuntimeError):
    pass


_playwright: Any | None = None
_browser: Any | None = None
_browser_lock = asyncio.Lock()


def _escape(value: Any) -> str:
    return html.escape(str(value))


def _confidence_label(value: str | None) -> str:
    if not value:
        return "Unknown"
    normalized = value.lower().strip()
    if normalized in {"high", "medium", "low"}:
        return normalized.title()
    return "Unknown"


def _build_report_html(report: PlagiarismCheckResponse) -> str:
    generated_at = report.report_generated_at or datetime.utcnow().isoformat()
    report_version = report.report_version or "v2"

    top_rows = []
    for sentence in report.results[:15]:
        for source in sentence.sources[:2]:
            top_rows.append(
                f"""
                <tr>
                  <td>{_escape(sentence.sentence[:220])}</td>
                  <td>{_escape(source.url)}</td>
                  <td>{_escape(source.similarity)}%</td>
                  <td>{_escape(source.match_type or "unknown")}</td>
                  <td>{_escape(_confidence_label(source.confidence_score))}</td>
                </tr>
                """
            )

    caveat_rows = []
    for caveat in report.report_v2.caveats if report.report_v2 else []:
        caveat_rows.append(
            f"<li><strong>{_escape(caveat.code)}</strong>: {_escape(caveat.message)}</li>"
        )

    if not top_rows:
        top_rows.append(
            "<tr><td colspan='5' style='text-align:center;color:#64748b;'>No evidence rows available</td></tr>"
        )

    caveat_block = (
        f"<ul>{''.join(caveat_rows)}</ul>"
        if caveat_rows
        else "<p style='color:#64748b;'>No caveats reported.</p>"
    )

    return f"""
<!doctype html>
<html>
  <head>
    <meta charset=\"utf-8\" />
    <title>ResMap Similarity Report</title>
    <style>
      @page {{ size: A4; margin: 18mm 14mm 18mm 14mm; }}
      body {{ font-family: 'Arial', 'Helvetica', sans-serif; color: #0f172a; font-size: 12px; }}
      .header {{ background:#f36f21; color:white; padding:14px 16px; border-radius:10px; }}
      .header h1 {{ margin:0; font-size:20px; }}
      .header p {{ margin:4px 0 0 0; font-size:12px; opacity:.95; }}
      .meta {{ margin-top: 12px; display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; }}
      .card {{ border:1px solid #e2e8f0; border-radius:8px; padding:8px; background:#f8fafc; }}
      .card .k {{ color:#64748b; font-size:11px; }}
      .card .v {{ font-size:18px; font-weight:700; margin-top:2px; }}
      h2 {{ margin-top: 16px; font-size:14px; }}
      table {{ width:100%; border-collapse: collapse; margin-top:8px; }}
      th, td {{ border:1px solid #e2e8f0; padding:6px; vertical-align: top; font-size:11px; }}
      th {{ background:#f1f5f9; text-align:left; }}
      .muted {{ color:#64748b; font-size:11px; }}
      .foot {{ margin-top: 18px; color:#94a3b8; font-size:10px; }}
    </style>
  </head>
  <body>
    <div class=\"header\">
      <h1>ResMap Similarity Report</h1>
      <p>Generated at: {_escape(generated_at)} | Version: {_escape(report_version)}</p>
    </div>

    <div class=\"meta\">
      <div class=\"card\"><div class=\"k\">Overall Similarity</div><div class=\"v\">{_escape(report.overall_score)}%</div></div>
      <div class=\"card\"><div class=\"k\">Plagiarism Percentage</div><div class=\"v\">{_escape(report.plagiarism_percentage)}%</div></div>
      <div class=\"card\"><div class=\"k\">Matched Sentences</div><div class=\"v\">{_escape(report.plagiarized_sentences)}</div></div>
      <div class=\"card\"><div class=\"k\">Total Sentences</div><div class=\"v\">{_escape(report.total_sentences)}</div></div>
    </div>

    <h2>Top Evidence</h2>
    <table>
      <thead>
        <tr>
          <th>Sentence</th>
          <th>Source</th>
          <th>Similarity</th>
          <th>Match Type</th>
          <th>Confidence</th>
        </tr>
      </thead>
      <tbody>
        {"".join(top_rows)}
      </tbody>
    </table>

    <h2>Caveats</h2>
    {caveat_block}

    <p class=\"foot\">This report supports academic review and should not be treated as a final misconduct verdict.</p>
  </body>
</html>
    """


async def _ensure_browser() -> Any:
    global _playwright, _browser
    if _browser is not None:
        return _browser

    async with _browser_lock:
        if _browser is not None:
            return _browser

        try:
            from playwright.async_api import async_playwright
        except Exception as exc:
            raise PDFRendererUnavailableError(
                "Playwright is not installed. Install dependency and chromium browser."
            ) from exc

        _playwright = await async_playwright().start()

        launch_args = ["--disable-dev-shm-usage"]
        if hasattr(os, "geteuid") and os.geteuid() == 0:
            launch_args.extend(["--no-sandbox", "--disable-setuid-sandbox"])

        _browser = await _playwright.chromium.launch(
            headless=True,
            args=launch_args,
        )
        return _browser


async def shutdown_plagiarism_pdf_renderer() -> None:
    global _playwright, _browser
    if _browser is not None:
        await _browser.close()
        _browser = None
    if _playwright is not None:
        await _playwright.stop()
        _playwright = None


async def render_plagiarism_report_pdf(report: PlagiarismCheckResponse) -> bytes:
    browser = await _ensure_browser()
    context = await browser.new_context()
    page = await context.new_page()
    timeout = max(5_000, int(settings.PDF_RENDERER_TIMEOUT_MS))

    try:
        html_content = _build_report_html(report)
        await page.set_content(html_content, wait_until="networkidle", timeout=timeout)
        return await page.pdf(
            format="A4",
            print_background=True,
            margin={"top": "14mm", "right": "12mm", "bottom": "14mm", "left": "12mm"},
            timeout=timeout,
        )
    except Exception as exc:
        raise PDFRendererUnavailableError(
            f"Failed to render plagiarism PDF: {exc}"
        ) from exc
    finally:
        await context.close()
