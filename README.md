# FPTU ResMap

Research and capstone assistant for FPT University students. ResMap helps students brainstorm topics, improve academic writing, and check plagiarism with AI-powered tools.

## Features
1. 💡 AI topic generator for capstone and research ideas.
2. ✍️ Writing assistant for summarizing, rewriting, and polishing academic text.
3. 🧭 Plagiarism checker with web search similarity analysis.
4. 📚 Citation helper for quick references.
5. ⚡ Performance optimizations with caching and rate limiting.

## Tech Stack

Frontend
1. ⚛️ React (Vite)
2. 🧩 TypeScript
3. 🧭 React Router
4. 🪄 Lucide Icons

Backend
1. 🚀 FastAPI (Python)
2. 🧠 Google Gemini via `google-genai`
3. 🛡️ SlowAPI for rate limiting
4. 🧊 Async-LRU for caching

## Getting Started

Prerequisites
1. 🧰 Node.js 18+
2. 🐍 Python 3.10+

### Backend Setup

```bash
cd backend

python -m venv venv
source venv/bin/activate

pip install .
```

Create a `.env` file in `backend/`:

```env
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=
PORT=8000
```

Run the API server:

```bash
python -m app.main
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` and the API at `http://localhost:8000`.

## API Docs

Swagger UI: `http://localhost:8000/docs`

## Environment Variables

| Variable | Description | Required |
| --- | --- | --- |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `OPENAI_API_KEY` | Optional OpenAI key (if needed) | No |
| `PORT` | Backend port | No |

## Security and Performance

✅ Rate limiting is enabled for AI-heavy endpoints.

✅ Topic suggestions are cached for faster repeated queries.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
