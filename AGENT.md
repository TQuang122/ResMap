# RESMAP Agent Guide

This repo contains **FPTU RESMAP**: a student scientific-research portal with a React (Vite + TS + Tailwind) frontend and a FastAPI backend.

## What you should do in this project

- Keep UI/content in Vietnamese, aligned to FPT University context.
- Preserve the existing visual language (FPT orange `#F36F21`, glass + soft shadows) and avoid random redesigns.
- Prefer small, safe changes; avoid breaking routing, menu, and section scroll behavior.
- Do not commit or push unless explicitly asked.

## Project structure

- `frontend/`: React + TypeScript + Vite
- `backend/`: FastAPI (Python) with `uv`

## Local development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
uv run uvicorn app.main:app --reload
```

## Deployment notes (Vercel)

- Client-side routing requires rewrites to `index.html`.
- `vercel.json` exists at repo root (and also `frontend/vercel.json` for subdirectory deployments).

## Common UI behaviors to keep

- Home is `/home`; `/` redirects to `/home`.
- Hamburger menu is a Portal overlay (`MenuDrawer`).
- Sidebar section navigation uses `SidebarDots` (vertical, compact, glass).
- Intro CTA:
  - `Bắt đầu ngay` scrolls to the research how-to / major selection section.
  - `Tìm hiểu thêm` scrolls to the benefits section.
