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

## Environment Variables
Create a `.env` file in `backend/` (optional for now as logic is mocked):
```
OPENAI_API_KEY=sk-...
```
