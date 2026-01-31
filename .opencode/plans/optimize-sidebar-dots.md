# Plan: Optimize Sidebar Dots UI

The user wants to refine the `SidebarDots` component:
1.  **Reduce Size**: The current container and dots are too large.
2.  **Mobile Orientation**: Change the mobile layout from horizontal (row) to vertical (column), consistent with desktop.

## 🎯 Objectives
1.  **Reduce Padding/Size**: Decrease `px-4 py-3` to something smaller (e.g., `p-2`).
2.  **Vertical Layout Everywhere**: Force `flex-col` on all screen sizes, removing the `flex-row` mobile logic.
3.  **Positioning**: On mobile, position it to the right (like desktop) or keep it bottom-right but vertical?
    *   *Decision*: Vertical bar usually sits on the **right edge** on mobile to avoid thumb reach issues, or stays hidden.
    *   The user asked for "dọc" (vertical). Vertical at the *bottom center* looks weird. Vertical at *right center* (like desktop) is standard.
    *   **Proposed Mobile Layout**: Fixed right center (`right-2 top-1/2 -translate-y-1/2`). This unifies the experience.

## 🛠 Changes in `frontend/src/components/SidebarDots.tsx`

### CSS Adjustments
-   **Container**:
    -   Remove `bottom-6 left-1/2 -translate-x-1/2`.
    -   Apply `right-2 top-1/2 -translate-y-1/2` globally (mobile & desktop).
    -   Change `flex-row` to `flex-col` globally.
    -   Reduce padding: `p-2` or `px-1.5 py-2`.
    -   Reduce rounded radius: `rounded-full` is fine, but maybe tighter.
-   **Track**:
    -   Remove the horizontal track divs (`lg:hidden`).
    -   Make the vertical track visible on all screens.
-   **Dots**:
    -   Reduce base size: `w-2 h-2` (inactive) / `w-3 h-3` (active).
    -   Reduce gap: `gap-3`.

## 📅 Roadmap

### 🟢 Phase 1: Style Refactor
- [ ] **task-update-sidebar**: Edit `frontend/src/components/SidebarDots.tsx`.
    -   Simplify classes to be mobile-first vertical.
    -   Adjust positioning to right side.
    -   Scale down sizes.

### Phase X: Verification
- [ ] **verify-mobile**: Check mobile view -> Vertical bar on right.
- [ ] **verify-size**: Check visual size -> Compact.

---

## 🟢 Next Steps
1.  Approve this plan.
2.  Execute **Phase 1**.
