# FPTU ResMap Backend

FastAPI backend for FPTU Research Map.

## Setup with `uv` (Recommended)

This project uses [uv](https://github.com/astral-sh/uv) for fast dependency management.

1.  **Install `uv`** (if not installed):
    ```bash
    # MacOS/Linux
    curl -LsSf https://astral.sh/uv/install.sh | sh
    
    # Windows
    powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
    ```

2.  **Install Dependencies**:
    ```bash
    cd backend
    uv sync
    uv run playwright install chromium
    ```

3.  **Run Development Server**:
    ```bash
    uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    ```
    Server runs at `http://localhost:8000`.
    Swagger UI: `http://localhost:8000/docs`.

## API Endpoints

### Health
- `GET /api/health`: Check API status.

### Chat (Topic Suggestion)
- `POST /api/chat/suggest`
    - Body: `{"major": "SE", "keywords": "AI"}`

### Tools (Citation Checker)
- `POST /api/tools/check`
    - Body: `{"text": "Author (2024)...", "style": "APA"}`

### Tools (Plagiarism Checker)
- `POST /api/tools/plagiarism-check`
    - Body supports optional `use_ai_similarity` (default `true`)
    - Response keeps legacy keys and adds optional telemetry fields:
      - `source_counts` (per-source usage count)
      - `source_failures` (source-level failure/degraded hints)
      - `quota_mode` (`memory` or configured persistent mode)
- `GET /api/tools/plagiarism-check/quota`
    - Returns semantic AI quota usage (`used`, `limit`, `remaining`, `usage_percent`, `reset_at`)
    - Adds optional `quota_mode`
- `POST /api/tools/plagiarism-check/report-pdf`
    - Runs plagiarism check and returns `application/pdf`
    - Includes `Content-Disposition: attachment` header for direct download

## Environment Variables
Create a `.env` file in `backend/` (optional for now as logic is mocked):
```
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=

# Semantic similarity controls
SEMANTIC_SCORING_ENABLED=false
SEMANTIC_PROVIDER=gemini
SEMANTIC_QUOTA_LIMIT=30000
SEMANTIC_TIMEOUT_SECONDS=8
SEMANTIC_MAX_CHECKS_PER_REQUEST=30

# Quota persistence controls
SEMANTIC_QUOTA_PERSISTENCE_ENABLED=false
SEMANTIC_QUOTA_FALLBACK_ENABLED=true
SEMANTIC_QUOTA_BACKEND_MODE=memory        # memory | supabase_postgres
SEMANTIC_QUOTA_UNIT=semantic_checks
SEMANTIC_QUOTA_WINDOW_DAYS=30

# Source toggles and candidate caps
PLAGIARISM_SOURCE_DUCKDUCKGO_ENABLED=true
PLAGIARISM_SOURCE_CROSSREF_ENABLED=true
PLAGIARISM_SOURCE_ARXIV_ENABLED=true
PLAGIARISM_SOURCE_CORE_ENABLED=false
PLAGIARISM_SOURCE_PUBMED_ENABLED=true
PLAGIARISM_SOURCE_DUCKDUCKGO_MAX_CANDIDATES=8
PLAGIARISM_SOURCE_CROSSREF_MAX_CANDIDATES=5
PLAGIARISM_SOURCE_ARXIV_MAX_CANDIDATES=5
PLAGIARISM_SOURCE_CORE_MAX_CANDIDATES=5
PLAGIARISM_SOURCE_PUBMED_MAX_CANDIDATES=5
PLAGIARISM_SOURCE_GLOBAL_MAX_CANDIDATES=10
PLAGIARISM_SOURCE_TIMEOUT_SECONDS=10

# CORE auth mode
PLAGIARISM_SOURCE_CORE_AUTH_MODE=bearer   # bearer | query
CORE_API_KEY=

# Server-side PDF rendering
PDF_RENDERER_TIMEOUT_MS=30000

# PubMed request identity (recommended by NCBI)
NCBI_TOOL=resmap
NCBI_EMAIL=resmap.researchteam@gmail.com
NCBI_API_KEY=

# Supabase (required only when using supabase_postgres mode)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Plagiarism Similarity Modes

- `use_ai_similarity=true`: use semantic similarity when enabled and quota is available.
- `use_ai_similarity=false`: force keyword-only analysis.
- Automatic fallback: if semantic scoring is unavailable or quota is exhausted, the service falls back to keyword matching and reports `fallback_used=true`.

## Source Aggregation Notes (Wave 3)

- Source connectors run in bounded parallel mode with per-source and global caps.
- Cross-source dedupe uses identifier-first keys (`doi`/`pmid`/`arxiv_id`) and falls back to canonical URL/title normalization.
- Source outage is fail-open: one connector timeout/failure does not fail the whole plagiarism request.
- Quota persistence is optional; if persistent backend is unavailable and fallback is enabled, service degrades safely to in-memory quota.

## Testing

```bash
cd backend
uv run pytest --collect-only
uv run pytest tests/test_plagiarism_*.py -q
uv run pytest -q
```
