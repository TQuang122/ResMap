# Plan: Reorganize Sections and Citation Checker

This plan addresses the user's request to:
1.  **Move Research Starter Kit:** Move the "Research Starter Kit" summary section on the homepage to appear **before** the "Research How-To" (Topic Selection) section.
2.  **Move Citation Checker:** Move the "Citation Checker" tool (currently `ToolsSection` on Homepage) to a dedicated page `/citation-check` and add it to the Menu Drawer.

## 🎯 Objectives
1.  **Home Page Reordering**:
    *   Current: Intro -> Benefits -> Research How-To (Hero) -> Starter Kit -> Tools.
    *   New: Intro -> Benefits -> **Starter Kit** -> Research How-To (Hero) -> (Tools removed).
2.  **New Page**: Create `/citation-check` page for the Citation Checker tool.
3.  **Navigation**: Add "Kiểm tra trích dẫn" link to the Side Menu.

## 📅 Roadmap

### 🟢 Phase 1: Reorder Homepage Sections
- [ ] **task-reorder-home**: Update `frontend/src/pages/HomePage.tsx`.
    -   Move `<StarterKitSection />` to appear before `<HeroSection />`.
    -   Remove `<ToolsSection />` from `HomePage`.
    -   Update `INITIAL_SECTIONS_COUNT` logic (Intro, Benefits, StarterKit, Hero = 4 static sections).
    -   Update `sectionLabels` order in `SidebarDots`.
- [ ] **task-update-sidebar**: Update `frontend/src/components/SidebarDots.tsx`.
    -   Update `STATIC_SECTIONS` constant if necessary (likely 4 now, since Tools moved).

### 🟡 Phase 2: Create Citation Check Page
- [ ] **task-create-citation-page**: Create `frontend/src/pages/CitationCheckPage.tsx`.
    -   Import and render `<CitationChecker />` (the widget currently in `ToolsSection`).
    -   Wrap in a nice layout with header/footer.
- [ ] **task-update-router**: Update `frontend/src/App.tsx`.
    -   Add route `/citation-check` -> `CitationCheckPage`.

### 🟠 Phase 3: Navigation Updates
- [ ] **task-update-menu**: Update `frontend/src/components/MenuDrawer.tsx`.
    -   Add link to `/citation-check` with icon (e.g., `Quote` or `CheckCircle`).

### Phase X: Verification
- [ ] **verify-order**: Home: Intro -> Benefits -> Starter Kit -> How-To/Hero.
- [ ] **verify-page**: Go to `/citation-check`.
- [ ] **verify-menu**: Check menu link works.

---

## 🟢 Next Steps
1.  Approve this plan.
2.  Execute **Phase 1**.
