# Auth Page UX/UI Enhancement Plan

## TL;DR

> **Quick Summary**: Redesign the `/auth` page with modern aesthetics, subtle animations, and improved UX while preserving all existing Supabase authentication functionality. Focus on professional micro-interactions, mobile responsiveness, and accessibility improvements.

> **Deliverables**:
> - Enhanced AuthPage.tsx with modern UI
> - Subtle Framer Motion animations for form interactions
> - Improved mobile layout and responsive behavior
> - Accessibility improvements (focus management, ARIA, reduced-motion)
> - Preserved auth logic (email/password, OAuth, password reset)

> **Estimated Effort**: Medium
> **Parallel Execution**: NO - sequential (animations depend on layout)
> **Critical Path**: Layout redesign → Animations → Accessibility → QA

---

## Context

### Original Request
Update UX/UI for `/auth` page with:
- Animations & micro-interactions (subtle & professional)
- Visual redesign (fresh modern redesign)
- Form UX improvements
- Mobile responsiveness
- Accessibility & feedback
- Backend functionality must remain intact

### Interview Summary
**Key Discussions**:
- Animation style: Subtle & professional (not bold/playful)
- Design direction: Fresh modern redesign (refine from current)
- All auth flows must work exactly as before
- Mobile-first improvements needed
- Accessibility is priority

**Research Findings**:
- AuthPage.tsx: 403 lines, two-column layout
- Tech stack: Tailwind CSS, Framer Motion, Supabase
- Current animations: Basic AnimatePresence form transitions
- Google OAuth integrated with logo asset

### Metis Review
**Identified Gaps** (addressed):
- Auth state machine documented (signin/signup/reset)
- Guardrails established (no auth logic changes)
- Edge cases documented (keyboard overlap, slow network, long errors)

---

## Work Objectives

### Core Objective
Modernize the `/auth` page appearance and interactions with professional polish while maintaining 100% functional compatibility with existing Supabase authentication.

### Concrete Deliverables
- Redesigned AuthPage.tsx component
- Enhanced form input interactions (focus, validation feedback)
- Subtle entrance and interaction animations
- Improved mobile responsive layout
- Accessibility improvements (focus, ARIA, reduced-motion)
- Preserved auth flows (login, register, OAuth, password reset)

### Definition of Done
- [ ] Build passes without errors
- [ ] TypeScript compilation succeeds
- [ ] All auth flows work exactly as before
- [ ] Mobile layout works at 375px width
- [ ] No layout shifts or broken interactions
- [ ] Animations respect reduced-motion preference
- [ ] Focus management works for keyboard navigation

### Must Have
- Professional, modern visual design
- Subtle, smooth animations (no jarring transitions)
- Fully functional auth (email/password, OAuth, reset)
- Mobile-responsive layout
- Accessible (keyboard, screen reader friendly)

### Must NOT Have (Guardrails)
- NO changes to Supabase integration or auth logic
- NO new auth methods or flows
- NO new design system dependencies
- NO changes to routing or redirects
- NO breaking changes to existing functionality
- NO new global CSS or Tailwind config changes

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: [Check package.json]
- **Automated tests**: Tests-after
- **Framework**: Existing test setup

### Agent-Executed QA Scenarios (MANDATORY — per-scenario, ultra-detailed)

**Scenario: Build and TypeScript verification**
  Tool: Bash
  Preconditions: None
  Steps:
    1. cd frontend && npm run build
    2. Assert: Exit code 0
    3. Assert: No TypeScript errors
  Expected Result: Build succeeds without errors
  Evidence: Build output captured

**Scenario: Mobile layout verification (375px width)**
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running on localhost:5173
  Steps:
    1. Navigate to http://localhost:5173/auth
    2. Set viewport to 375x812
    3. Assert: No horizontal scroll
    4. Assert: All form inputs visible and tappable (min 44px touch target)
    5. Assert: Submit button visible without scrolling
  Expected Result: Mobile layout works correctly
  Evidence: Screenshot at .sisyphus/evidence/auth-mobile-layout.png

**Scenario: Desktop layout verification (1280x720)**
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running on localhost:5173
  Steps:
    1. Navigate to http://localhost:5173/auth
    2. Set viewport to 1280x720
    3. Assert: Two-column layout renders
    4. Assert: Left marketing panel visible
    5. Assert: Right form panel centered
  Expected Result: Desktop layout works correctly
  Evidence: Screenshot at .sisyphus/evidence/auth-desktop-layout.png

**Scenario: Login form interaction**
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Fill email input with "test@example.com"
    2. Fill password input with "password123"
    3. Click submit button
    4. Assert: Loading state shown (button disabled, text changes)
    5. Assert: Error message appears or redirect occurs
  Expected Result: Form interaction works
  Evidence: Console output captured

**Scenario: Signup form interaction**
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Click "Đăng ký" toggle
    2. Assert: Username input appears with animation
    3. Fill all required fields
    4. Submit form
    5. Assert: Loading state, then success/error
  Expected Result: Signup flow works
  Evidence: Console output captured

**Scenario: Google OAuth button**
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Click "Tiếp tục với Google" button
    2. Assert: OAuth flow initiates (new window or redirect)
    3. Assert: No console errors
  Expected Result: OAuth button functional
  Evidence: Console output captured

**Scenario: Password reset flow**
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Click "Quên mật khẩu?" link
    2. Assert: Reset email input focused
    3. Enter email and submit
    4. Assert: Success message appears
  Expected Result: Password reset works
  Evidence: Console output captured

**Scenario: Keyboard navigation**
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Press Tab to navigate through all inputs
    2. Assert: Focus visible on each element
    3. Assert: No focus trap or lost focus
    4. Assert: Enter submits form when focused
  Expected Result: Keyboard navigation works
  Evidence: Focus order documented

**Scenario: Reduced motion preference**
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Set prefers-reduced-motion media query
    2. Navigate to /auth
    3. Toggle between signin/signup
    4. Assert: No large motion transitions
    5. Assert: Instant switch instead of animated
  Expected Result: Respects reduced-motion
  Evidence: Comparison screenshots

**Evidence to Capture**:
- [ ] Screenshots in .sisyphus/evidence/ for layout checks
- [ ] Console output for form interactions
- [ ] Focus order documented
- [ ] Build output captured

---

## Execution Strategy

### Sequential Execution

**Phase 1: Layout & Visual Design**
- Update color scheme and typography
- Refine spacing and visual hierarchy
- Improve form input styling
- Enhance mobile layout

**Phase 2: Animations & Micro-interactions**
- Add subtle entrance animations
- Improve form transition animations
- Add input focus/hover effects
- Add button interaction feedback

**Phase 3: Accessibility Improvements**
- Focus management enhancements
- ARIA improvements
- Reduced-motion support
- Error message accessibility

**Phase 4: Testing & QA**
- Verify all auth flows
- Test responsive behavior
- Accessibility testing
- Build verification

---

## TODOs

> Implementation + Test = ONE Task. Never separate.

- [ ] 1. Refactor AuthPage layout and visual design

  **What to do**:
  - Update color scheme while maintaining brand identity
  - Improve typography and visual hierarchy
  - Refine spacing and padding
  - Enhance form input styling (borders, focus states)
  - Improve mobile responsive behavior

  **Must NOT do**:
  - Change auth logic or Supabase integration
  - Add new authentication methods
  - Change routing or redirects

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: UI/UX redesign task requiring modern aesthetics
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Design expertise for visual improvements

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Tasks 2, 3, 4
  - **Blocked By**: None (first task)

  **References**:
  - `frontend/src/pages/AuthPage.tsx:1-403` - Current implementation to enhance
  - `frontend/src/pages/StarterKitPage.tsx` - Recent design patterns used
  - `frontend/src/pages/IntroSection.tsx` - Animation patterns reference

  **Acceptance Criteria**:
  - [ ] Design updated with modern aesthetic
  - [ ] Colors refined (orange accent preserved)
  - [ ] Typography improved
  - [ ] Form inputs enhanced
  - [ ] Mobile layout improved
  - cd frontend && npm run build → Exit 0

- [ ] 2. Add subtle animations and micro-interactions

  **What to do**:
  - Add entrance animations for page load
  - Improve form transition animations (signin ↔ signup)
  - Add input field focus animations
  - Add button hover/tap feedback
  - Add loading state animations
  - Implement reduced-motion support

  **Must NOT do**:
  - Add jarring or bold animations
  - Change auth functionality

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: Animation implementation task
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Micro-interaction expertise

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Tasks 3, 4
  - **Blocked By**: Task 1

  **References**:
  - `frontend/src/pages/IntroSection.tsx` - Animation patterns reference
  - `frontend/src/pages/StarterKitPage.tsx` - Button hover effects
  - Framer Motion docs - Animation best practices

  **Acceptance Criteria**:
  - [ ] Page entrance animation (subtle fade/slide)
  - [ ] Form transitions smooth (signin ↔ signup)
  - [ ] Input focus animations
  - [ ] Button hover/tap feedback
  - [ ] Loading state animations
  - [ ] Reduced-motion support works
  - cd frontend && npm run build → Exit 0

- [ ] 3. Implement accessibility improvements

  **What to do**:
  - Improve focus management
  - Add ARIA labels where needed
  - Enhance error message accessibility
  - Improve keyboard navigation
  - Add screen reader support for form states
  - Implement proper focus trapping

  **Must NOT do**:
  - Change auth behavior
  - Add visual elements that aren't accessible

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: Accessibility-focused task
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Accessibility expertise

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 4
  - **Blocked By**: Task 2

  **References**:
  - WCAG 2.1 guidelines - Accessibility standards
  - Existing form components in project

  **Acceptance Criteria**:
  - [ ] Focus visible on all interactive elements
  - [ ] ARIA labels added where needed
  - [ ] Error messages announced to screen readers
  - [ ] Keyboard navigation works fully
  - [ ] Reduced-motion media query respected
  - cd frontend && npm run build → Exit 0

- [ ] 4. Final QA and verification

  **What to do**:
  - Test all auth flows (login, signup, OAuth, reset)
  - Verify mobile responsiveness
  - Run accessibility checks
  - Verify build passes
  - Document any issues found

  **Must NOT do**:
  - Make major changes without approval

  **Recommended Agent Profile**:
  - **Category**: quick
    - Reason: Verification task, straightforward testing
  - **Skills**: [`playwright`]
    - `playwright`: Browser automation for testing

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 1, 2, 3

  **References**:
  - All previous task acceptance criteria
  - Project testing patterns

  **Acceptance Criteria**:
  - [ ] Login flow works
  - [ ] Signup flow works
  - [ ] Google OAuth works
  - [ ] Password reset works
  - [ ] Mobile layout verified (375px)
  - [ ] Desktop layout verified (1280px)
  - [ ] Keyboard navigation verified
  - [ ] Reduced-motion verified
  - cd frontend && npm run build → Exit 0
  - cd frontend && npm run lint → Exit 0

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `refactor(auth): enhance auth page visual design` | AuthPage.tsx | npm run build |
| 2 | `feat(auth): add animations and micro-interactions` | AuthPage.tsx | npm run build |
| 3 | `feat(auth): improve accessibility` | AuthPage.tsx | npm run build |
| 4 | `test(auth): verify all auth flows` | AuthPage.tsx | npm run build + QA |

---

## Success Criteria

### Verification Commands
```bash
cd frontend && npm run build  # Exit 0
cd frontend && npm run lint    # Exit 0
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Build passes
- [ ] All auth flows functional
- [ ] Mobile responsive
- [ ] Accessibility improved
- [ ] Animations subtle and professional
