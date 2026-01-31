# Plan: Expand Research Starter Kit

The goal is to expand the "Research Starter Kit" feature by creating a dedicated detailed page, integrating it into a side menu, and ensuring the summary section remains on the homepage.

## 🎯 Objectives
1.  **Navigation**: Implement a Side Menu (Drawer) accessible via the "Hamburger" icon.
2.  **Access**: Add "Research Starter Kit" link to this Side Menu.
3.  **Home Page**: Restore the `StarterKitSection` to the Homepage (it was previously removed).
4.  **Content**: Create a detailed `StarterKitPage` with specific items requested by the user.

## 📋 Content Requirements
The `/starter-kit` page must include:
1.  **Mẫu đề cương nghiên cứu** (Research Proposal Template)
2.  **Bảng tổng hợp tài liệu** (Literature Summary Table)
3.  **Nhật ký tiến độ nhóm** (Group Progress Log)
4.  **Mẫu phân công nhiệm vụ** (Task Assignment Template)
5.  **Checklist tuần đầu tiên** (Week 1 Checklist)
6.  **Hướng dẫn AI & Quản trị rủi ro** (AI in Research Guide)

## 🛠 Tech Stack
-   **Icons**: `lucide-react`
-   **Routing**: `react-router-dom`
-   **State**: React `useState` for Menu Drawer.

## 📅 Roadmap

### 🟢 Phase 1: Data Preparation
- [ ] **task-create-data**: Create `frontend/src/data/fullStarterKit.ts`.
    -   Define interface `StarterKitDetailItem`.
    -   Populate with the 6 requested items (title, description, icon).

### 🟡 Phase 2: Navigation & Menu
- [ ] **task-nav-drawer**: Update `Navigation.tsx`.
    -   Add state `isMenuOpen`.
    -   Create a Slide-in Drawer component (Mobile/Desktop friendly).
    -   Add "Research Starter Kit" link inside the Drawer.
    -   Ensure the "Hamburger" button toggles this Drawer.

### 🟠 Phase 3: Home Page Restoration
- [ ] **task-restore-home**: Update `HomePage.tsx`.
    -   Import `StarterKitSection`.
    -   Add `<StarterKitSection />` back into the render flow (before Tools section).

### 🔵 Phase 4: Starter Kit Page Implementation
- [ ] **task-build-page**: Update `StarterKitPage.tsx`.
    -   Import `FULL_STARTER_KIT` data.
    -   Design a grid layout to display these detailed items.
    -   Use a distinct UI (e.g., Cards with "Download" or "View" actions) to differentiate from the Home summary.

### Phase X: Verification
- [ ] **verify-menu**: Open Menu -> See Link -> Click Link -> Go to Page.
- [ ] **verify-home**: Scroll Home -> See Starter Kit Section.
- [ ] **verify-content**: Check all 6 items are present on the dedicated page.

---

## 🟢 Next Steps
1.  Approve this plan.
2.  Execute **Phase 1**.
