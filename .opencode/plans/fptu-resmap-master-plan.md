# Plan: FPTU ResMap - Master Plan

This master plan outlines the development of the FPTU Research Map (ResMap), a research guidance portal for FPT University students, enhanced with AI utilities.

## 🎯 Project Overview
- **Type:** Research Portal + AI Tools
- **Audience:** FPT University Students (SE, Biz, GD, Media, Languages)
- **Deployment:** Frontend (Vercel) + Backend (AWS/FastAPI)
- **Data Strategy:** Hardcoded static content (MVP approach)

## 🏗️ Architecture

### Frontend (`/frontend`)
- **Tech:** React, TypeScript, Vite, Tailwind CSS.
- **Hosting:** Vercel.
- **Responsibility:**
    - Display Research Roadmap (Steps 1-6).
    - Provide Static Resources (Templates, Guides).
    - UI for Chatbot & Format Checker.
    - Internal Search Interface.

### Backend (`/backend`)
- **Tech:** Python, FastAPI.
- **Hosting:** AWS (EC2 or Lambda + API Gateway).
- **Responsibility:**
    - **Topic Suggestion API:** LLM integration (e.g., Gemini/OpenAI) to suggest topics based on major.
    - **Format Checker API:** Logic to validate citation strings (APA 7 / IEEE).
    - **Search API:** Search over local hardcoded content.

---

## 📅 Roadmap & Tasks

### 🟢 Phase 1: Frontend Foundation (Current State)
*Focus: UI Polish & Content Localization (Mostly Complete)*
- [x] **task-fpt-branding**: Apply FPT Orange colors & Typography.
- [x] **task-fpt-content**: Update Topics, Steps, and Starter Kit data.
- [x] **task-ui-fix**: Fix overlapping Intro badge.
- [x] **task-footer-update**: Update address & contact info.

### 🟡 Phase 2: Backend Foundation (FastAPI)
*Focus: Setting up the Python environment*
- [x] **task-backend-init**: Initialize FastAPI project structure.
    - `backend/app/main.py`
    - `backend/app/api/` (endpoints)
    - `backend/app/core/` (config, settings)
    - `backend/requirements.txt` / `pyproject.toml`
- [x] **task-backend-cors**: Configure CORS to allow requests from Vercel frontend.
- [x] **task-api-health**: Create `/health` endpoint to verify deployment.

### 🟠 Phase 3: AI Features (The Core Value)
*Focus: Intelligent Tools for Students*

#### 3.1 Topic Suggestion Chatbot
- [x] **task-ai-topic-api**: Implement `POST /api/chat/suggest-topic`.
    - Input: Major (SE/Biz/etc.), Interest Keywords.
    - Logic: Call LLM to generate 3-5 research topic ideas.
    - Output: JSON list of topics with brief descriptions.
- [x] **task-ui-chatbot**: Create `ChatbotWidget.tsx` in frontend.
    - Floating bubble or dedicated section.
    - Simple chat interface.

#### 3.2 Citation Checker (APA/IEEE)
- [x] **task-ai-format-api**: Implement `POST /api/tools/check-citation`.
    - Input: Citation string, Style (APA/IEEE).
    - Logic: Regex-based validation OR LLM validation.
    - Output: { isValid: boolean, corrections: string, suggestions: string }.
- [x] **task-ui-checker**: Create `CitationChecker.tsx` page/modal.
    - Text area for input.
    - Real-time feedback display.

### 🔵 Phase 4: Internal Search
*Focus: Quick Access to Information*
- [x] **task-search-api**: Implement `GET /api/search`.
    - Logic: Search across hardcoded `stepsData`, `topics`, and `starterKit`.
    - **Optimization:** Since data is hardcoded on Frontend, we might move search logic to **Client-side** (Fuse.js) for speed, unless we plan to move data to DB later.
    - *Decision:* Use Client-side search (Fuse.js) for MVP to save backend calls.
- [x] **task-ui-search**: Add Search Bar to `Navigation.tsx`.
    - Dropdown results linking to specific Steps or Resources.

### 🟣 Phase 5: Deployment & Integration
- [ ] **task-deploy-backend**: Dockerize FastAPI app & Deploy to AWS (or PythonAnywhere for dev).
- [ ] **task-deploy-frontend**: Connect Vercel to Git repo.
- [ ] **task-env-setup**: Configure Environment Variables (`VITE_API_URL`, `OPENAI_API_KEY`, etc.).

### Phase X: Verification
- [ ] **verify-e2e**: Test full flow (User -> Web -> Chatbot -> API -> Result).
- [ ] **verify-mobile**: Ensure Chatbot & Search work on mobile.
- [ ] **verify-security**: Check API rate limiting (prevent AI abuse).

---

## 🛠 Tech Decisions
1.  **Search Strategy:** Moving Search to **Client-side (Fuse.js)** because data is small and static. Backend search is overkill for hardcoded data.
2.  **AI Integration:** Will need an API Key (OpenAI/Gemini). We will need to set up a `.env` file in Backend.

## 📝 Next Steps
1.  Approve this plan.
2.  Start **Phase 2 (Backend Init)**.
