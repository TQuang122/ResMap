# Plan: FPTU Research Enhancement

This plan focuses on customizing the `frontend/` application to specifically serve FPT University students undertaking scientific research (ResFes, Capstone, Assignments).

## Project Type
- **Type:** WEB (Frontend Only focus for this plan)
- **Target Audience:** FPT University Students (SE, Biz, Design, etc.)

## Success Criteria
1.  **Content Relevance:** Application explicitly addresses FPTU majors and research workflows.
2.  **Branding:** Visual identity reflects FPTU (Orange/Black accents, specific terminology).
3.  **Resources:** Starter Kit includes FPT-specific templates (placeholders).
4.  **User Experience:** Clear navigation tailored to student research phases.

## Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## File Structure Analysis
- `src/data/`: Key location for content updates (`topics.tsx`, `starterKit.tsx`, `stepsData.ts`).
- `src/components/`: UI components to be updated with branding.
- `src/constants.tsx`: Theme definitions.

---

## 📋 Task Breakdown

### Phase 1: Content Localization (FPT Context)

- [x] **task-fpt-topics**: Update `src/data/topics.tsx`
  - **Input:** Existing generic topics.
  - **Action:** Replace/Refine with FPTU specific majors:
    - Kỹ thuật phần mềm (Software Engineering)
    - An toàn thông tin (Information Assurance)
    - Thiết kế đồ họa (Graphic Design)
    - Quản trị kinh doanh (Business Administration)
    - Truyền thông đa phương tiện (Multimedia)
    - Ngôn ngữ (Nhật/Anh/Hàn)
  - **Output:** Updated `TOPICS` array.
  - **Verify:** Topics match FPTU curriculum.

- [x] **task-fpt-starter-kit**: Update `src/data/starterKit.tsx`
  - **Input:** Generic starter kit items.
  - **Action:** Add/Rename items to FPT context:
    - "Template Đồ án tốt nghiệp (Capstone)"
    - "Mẫu báo cáo NCKH (ResFes)"
    - "Hướng dẫn trích dẫn APA 7 (FPTU standard)"
  - **Output:** Updated `STARTER_KIT_ITEMS`.
  - **Verify:** Labels are specific to FPTU deliverables.

- [x] **task-fpt-steps**: Enhance `src/data/stepsData.ts`
  - **Input:** Generic 6 steps.
  - **Action:** Rewrite descriptions to include FPT terminology (e.g., "Mentor", "Bảo vệ đề cương", "Hội đồng").
  - **Output:** Enriched step descriptions.
  - **Verify:** Text flows naturally for an FPT student.

### Phase 2: Visual & Branding

- [x] **task-fpt-branding-colors**: Update Theme Colors
  - **Input:** `src/constants.tsx` (if colors are central) or Tailwind classes.
  - **Action:** Introduce FPT Orange (`#F36F21`) as a highlight/accent color in the Hero or Intro sections.
  - **Output:** Updated color constants.
  - **Verify:** UI elements reflect FPT brand identity without breaking accessibility.

- [x] **task-fpt-ui-text**: Update Copy in `HeroSection` & `IntroSection`
  - **Input:** `HeroSection.tsx`, `IntroSection.tsx`
  - **Action:** Change headlines to specific calls to action for FPT students (e.g., "Đồng hành cùng sinh viên FPT chinh phục NCKH").
  - **Output:** Updated component text.
  - **Verify:** Home page clearly targets FPT students.

### Phase 3: Verification (Phase X)

- [x] **task-verify-build**: Run build check
  - **Command:** `npm run build`
  - **Verify:** No TypeScript errors from data changes.

- [x] **task-verify-lint**: Run lint check
  - **Command:** `npm run lint` (if available) or manual code review.

---

## 🟢 Execution Strategy
1.  Execute **Phase 1** tasks to set the foundation.
2.  Execute **Phase 2** to apply the "look and feel".
3.  Run **Phase 3** to ensure stability.
