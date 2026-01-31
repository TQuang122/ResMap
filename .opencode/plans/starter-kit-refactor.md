# Plan: Refactor Research Starter Kit to Separate Page

The goal is to move the "Research Starter Kit" from a section on the homepage to a dedicated page, accessible via the main navigation menu.

## 🎯 Objectives
1.  **Architecture**: Introduce Client-Side Routing (`react-router-dom`).
2.  **New Page**: Create a dedicated `StarterKitPage`.
3.  **Navigation**: Add "Starter Kit" to the Navbar.
4.  **Cleanup**: Remove the Starter Kit section from the main scrollable homepage.

## 🛠 Tech Stack
-   **Routing**: `react-router-dom` (v6)

## 📅 Roadmap

### 🟢 Phase 1: Setup & Architecture
- [ ] **task-install-router**: Install `react-router-dom`.
- [ ] **task-create-pages-dir**: Create `frontend/src/pages/` directory.
- [ ] **task-extract-home**: Move current `App.tsx` logic (ScrollSpy, Sections) to `frontend/src/pages/HomePage.tsx`.

### 🟡 Phase 2: Create Starter Kit Page
- [ ] **task-create-starter-page**: Create `frontend/src/pages/StarterKitPage.tsx`.
    -   Display `STARTER_KIT_ITEMS` in a grid.
    -   Reuse `StepLayout` or create a consistent header style.
- [ ] **task-router-setup**: Update `App.tsx` to implement `<BrowserRouter>` and `<Routes>`:
    -   `/` -> `HomePage`
    -   `/starter-kit` -> `StarterKitPage`

### 🟠 Phase 3: Navigation Updates
- [ ] **task-update-nav**: Modify `Navigation.tsx`.
    -   Add "Research Starter Kit" link.
    -   Use `Link` component from `react-router-dom`.
    -   Handle active state.
- [ ] **task-cleanup-home**: Remove `StarterKitSection` from `HomePage.tsx`.

### Phase X: Verification
- [ ] **verify-nav**: Click "Starter Kit" -> Goes to new page.
- [ ] **verify-back**: Navigate back to Home.
- [ ] **verify-scroll**: Ensure scrollspy on Home still works independently.

---

## 🟢 Next Steps
1.  Approve this plan.
2.  Execute **Phase 1**.
