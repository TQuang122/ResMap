# Home Page UX/UI Upgrade Plan

## TL;DR

> Upgrade toàn diện UX/UI cho home page với thiết kế professional + modern phù hợp cho sinh viên FPT, tập trung vào content consumption với mức độ animation moderate.

## Context

### Original Request
Upgrade UX/UI cho home page với các yêu cầu:
- **Target audience:** Sinh viên FPT University
- **Primary goal:** Content consumption
- **Design style:** Professional + Modern
- **Animation level:** Moderate

### User Selections
1. ✅ IntroSection: Typing effect, scroll indicator pulse, trust badges
2. ✅ BenefitsSection: Bento Grid layout với 3D tilt effects
3. ✅ StarterKitSection: Featured layout với preview/download buttons
4. ✅ Research How-To: Interactive step wizard
5. ✅ Testimonials carousel (new section)
6. ✅ Smart scroll navigation

---

## Work Objectives

### Core Objective
Nâng cấp toàn diện UX/UI cho home page với thiết kế professional, modern, tối ưu cho việc consume content của sinh viên FPT.

### Concrete Deliverables
- `components/IntroSection.tsx` - Upgraded với typing effect, pulse scroll, trust badges
- `components/TestimonialsSection.tsx` - New carousel component
- `components/BenefitsSection.tsx` - Bento Grid layout với glassmorphism
- `components/StarterKitSection.tsx` - Featured layout với preview/download
- `components/ResearchHowToSection.tsx` - Interactive step wizard
- `components/Navigation.tsx` - Smart scroll behavior
- Updated `App.tsx` - Route configuration
- Updated `HomePage.tsx` - Page composition

### Definition of Done
- [ ] Build success không có lỗi
- [ ] Typing effect hoạt động mượt
- [ ] Bento grid hiển thị đúng trên mobile/desktop
- [ ] Testimonials carousel scroll được
- [ ] Step wizard expand/collapse mượt
- [ ] Scroll behavior đúng

### Must Have
- Mobile-responsive (mobile-first approach)
- Tailwind CSS consistency
- Framer Motion animations (moderate - không overdo)
- Glassmorphism effects
- Professional FPT-branded look

### Must NOT Have
- Quá nhiều animations gây lag
- Inconsistent với existing design system
- Không accessible trên mobile
- Broken hover effects

---

## Verification Strategy

### Test Infrastructure
- **Infrastructure exists:** YES (Vite + React)
- **Test framework:** Bun test / Vitest (if user wants)
- **QA approach:** Agent-executed scenarios

### Agent-Executed QA Scenarios (MANDATORY)

**Scenario: Homepage loads without errors**
- Tool: Bash
- Preconditions: Dev server running
- Steps:
  1. `cd frontend && npm run dev &`
  2. Wait 5 seconds for server to start
  3. `curl -s http://localhost:5173/home | head -50`
  4. Check for React hydration errors
- Expected: Page loads, no console errors
- Evidence: Terminal output captured

**Scenario: Typing effect animates correctly**
- Tool: Playwright
- Preconditions: Page loaded at /home
- Steps:
  1. Navigate to http://localhost:5173/home
  2. Wait for intro section to be visible
  3. Observe typing effect in hero title
  4. Wait for full text cycle
- Expected: Text types character by character, cursor blinks
- Evidence: Screenshot of typing state

**Scenario: Bento grid renders correctly on all breakpoints**
- Tool: Playwright
- Preconditions: Page loaded
- Steps:
  1. Set viewport to mobile (375x667)
  2. Observe benefits section
  3. Set viewport to tablet (768x1024)
  4. Observe grid layout
  5. Set viewport to desktop (1920x1080)
  6. Observe bento grid
- Expected: 
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: Bento grid with varied sizes
- Evidence: Screenshots at each breakpoint

**Scenario: Testimonials carousel scrolls horizontally**
- Tool: Playwright
- Preconditions: Page loaded, testimonials section visible
- Steps:
  1. Find testimonials carousel
  2. Click next arrow button
  3. Verify carousel slides to next testimonial
  4. Click prev arrow button
  5. Verify carousel slides back
- Expected: Smooth horizontal scroll, no jump
- Evidence: Screenshot before/after click

**Scenario: Step wizard expand/collapse**
- Tool: Playwright
- Preconditions: Page loaded, Research How-To section visible
- Steps:
  1. Find step cards in Research How-To section
  2. Click on a step card
  3. Verify detail panel expands
  4. Click on another step
  5. Verify previous closes, new opens
- Expected: Smooth expand/collapse animation
- Evidence: Screenshot of expanded state

**Scenario: Smart scroll navigation behavior**
- Tool: Playwright
- Preconditions: Page loaded at top
- Steps:
  1. Scroll down 50px
  2. Observe navigation header
  3. Scroll up to top
  4. Observe header becomes transparent
- Expected:
  - Scroll > 50px: Solid/glassmorphism header
  - Scroll < 50px: Transparent header
- Evidence: Screenshot at each scroll position

**Scenario: Starter Kit preview/download buttons work**
- Tool: Playwright
- Preconditions: Page loaded, Starter Kit section visible
- Steps:
  1. Hover over starter kit cards
  2. Observe hover effects
  3. Click preview button on featured item
  4. Verify modal opens
  5. Click download button
- Expected: Hover scales, modal opens, download triggers
- Evidence: Screenshots of hover and modal state

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Upgrade IntroSection.tsx
└── Task 4: Create TestimonialsSection.tsx

Wave 2 (After Wave 1):
├── Task 2: Upgrade BenefitsSection.tsx (Bento Grid)
├── Task 3: Upgrade StarterKitSection.tsx
└── Task 5: Create ResearchHowToSection.tsx

Wave 3 (After Wave 2):
├── Task 6: Update Navigation.tsx (Smart scroll)
└── Task 7: Update HomePage.tsx (Compose all sections)

Wave 4 (After Wave 3):
└── Task 8: Build and verify
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 7 | 4 |
| 2 | 1 | 7 | 3, 5 |
| 3 | 1 | 7 | 2, 5 |
| 4 | None | 7 | 1 |
| 5 | 1 | 7 | 2, 3 |
| 6 | None | None | 7 |
| 7 | 2, 3, 4, 5 | 8 | 6 |
| 8 | 7 | None | None |

---

## TODOs

### Task 1: Upgrade IntroSection.tsx

**What to do:**
- Add typing effect for tagline with cursor animation
- Add animated floating background elements
- Add pulse animation to scroll indicator
- Add trust badges section (FPT partners, standards)
- Improve gradient mesh background with motion

**Must NOT do:**
- Remove existing FPT branding
- Add overly playful animations
- Break mobile responsiveness

**Recommended Agent Profile:**
- Category: `visual-engineering`
- Skills: [`frontend-ui-ux`]

**References:**

**Pattern References:**
- `components/IntroSection.tsx:1-77` - Existing intro structure to enhance

**Acceptance Criteria:**

**Test:**
- [ ] `npm run build` passes
- [ ] No TypeScript errors

**Agent-Executed QA Scenarios:**
```
Scenario: Intro section loads with typing animation
  Tool: Playwright
  Preconditions: Dev server running, page /home
  Steps:
    1. Open http://localhost:5173/home
    2. Wait 2 seconds
    3. Observe hero title typing effect
  Expected: Text types character by character
  Evidence: Screenshot of typing state

Scenario: Scroll indicator pulses
  Tool: Playwright
  Preconditions: Page loaded
  Steps:
    1. Find scroll indicator at bottom of intro
    2. Observe pulse animation
  Expected: Down arrow pulses smoothly
  Evidence: Screenshot
```

---

### Task 2: Upgrade BenefitsSection.tsx (Bento Grid)

**What to do:**
- Convert 4-card grid to Bento Grid layout
- Add 3D tilt effect on hover (use framer-motion)
- Add glassmorphism container effects
- Make cards vary in size (1 large, 3 medium)
- Add reveal details on hover

**Must NOT do:**
- Remove benefit content or icons
- Break existing benefit data structure
- Make animation too aggressive

**Recommended Agent Profile:**
- Category: `visual-engineering`
- Skills: [`frontend-ui-ux`]

**Pattern References:**
- `components/BenefitsSection.tsx` - Existing benefits to enhance

**Bento Grid Layout:**
```
┌──────────────┬──────────────────┐
│    Large     │     Medium      │
│    Card      │      Card        │
│  (Award)    │   (TrendingUp)  │
├──────────────┼──────────────────┤
│   Medium     │     Medium       │
│    Card      │      Card        │
│  (BookOpen)  │    (Users)      │
└──────────────┴──────────────────┘
```

**Acceptance Criteria:**

**Test:**
- [ ] `npm run build` passes

**Agent-Executed QA Scenarios:**
```
Scenario: Bento grid renders with varied card sizes
  Tool: Playwright
  Preconditions: Page loaded, scroll to Benefits section
  Steps:
    1. Navigate to Benefits section
    2. Observe card sizes
  Expected: One large card, three medium cards in grid
  Evidence: Screenshot

Scenario: Cards tilt on hover
  Tool: Playwright
  Preconditions: Benefits section visible
  Steps:
    1. Hover over first card
    2. Observe 3D tilt effect
  Expected: Card tilts in 3D space, shadow increases
  Evidence: Screenshot of hover state
```

---

### Task 3: Upgrade StarterKitSection.tsx

**What to do:**
- Convert to Featured Layout (1 featured + list)
- Add preview button to each card
- Add download button inline (không redirect)
- Add hover reveal for action buttons
- Keep existing STARTER_KIT_ITEMS data

**Must NOT do:**
- Change existing icons or labels
- Remove download functionality
- Break existing CTA links

**Recommended Agent Profile:**
- Category: `visual-engineering`
- Skills: [`frontend-ui-ux`]

**Enhanced Layout:**
```
┌─────────────────────────────────────────────────────┐
│  📄 TEMPLATE ĐỒ ÁN CAPSTONE (Featured - Large)     │
│  ────────────────────────────────────────────────── │
│  Template chuẩn FPTU format                          │
│                                                      │
│  [⬇ Download PDF]  [👁 Preview]  [📄 Download]   │
├───────────────────────┬─────────────────────────────┤
│  📋 ResFes           │  📎 APA 7 Citation Guide   │
│  [⬇ Download]        │  [⬇ Download]              │
├───────────────────────┴─────────────────────────────┤
│  🎓 Defense Tips & Tricks                             │
│  [⬇ Download]                                        │
└─────────────────────────────────────────────────────┘
```

**Acceptance Criteria:**

**Test:**
- [ ] `npm run build` passes

**Agent-Executed QA Scenarios:**
```
Scenario: Starter kit cards show download buttons on hover
  Tool: Playwright
  Preconditions: Page loaded, scroll to Starter Kit section
  Steps:
    1. Hover over template card
    2. Observe download/preview buttons appear
  Expected: Buttons fade in with animation
  Evidence: Screenshot
```

---

### Task 4: Create TestimonialsSection.tsx

**What to do:**
- Create new testimonials carousel component
- Add 3-4 testimonial cards
- Add horizontal scroll carousel
- Add navigation arrows
- Add pagination dots
- Use glassmorphism card design

**Must NOT do:**
- Create fake testimonials
- Use placeholder images without context
- Break horizontal scroll on mobile

**Recommended Agent Profile:**
- Category: `visual-engineering`
- Skills: [`frontend-ui-ux`]

**Testimonials Data Structure:**
```typescript
interface Testimonial {
  id: string;
  name: string;
  role: string; // "Sinh viên FPT năm X"
  faculty: string;
  quote: string;
  avatar?: string;
  metrics?: string; // e.g., "Điểm Capstone: A+"
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    role: 'Sinh viên FPT năm 4',
    faculty: 'Khoa Công nghệ thông tin',
    quote: 'ResMap giúp mình tiết kiệm rất nhiều thời gian nghiên cứu. Template chuẩn FPT và hướng dẫn chi tiết 6 bước làm mình tự tin hơn khi bảo vệ.',
    metrics: 'Điểm Capstone: A+'
  },
  // Add 2-3 more testimonials
];
```

**Acceptance Criteria:**

**Test:**
- [ ] `npm run build` passes

**Agent-Executed QA Scenarios:**
```
Scenario: Testimonials carousel scrolls horizontally
  Tool: Playwright
  Preconditions: Page loaded, scroll to Testimonials section
  Steps:
    1. Find carousel container
    2. Click right arrow button
    3. Observe slide transition
    4. Click left arrow button
  Expected: Smooth scroll between testimonials
  Evidence: Screenshots before/after click
```

---

### Task 5: Create ResearchHowToSection.tsx (Interactive Step Wizard)

**What to do:**
- Create new interactive step wizard component
- Convert horizontal steps to wizard format
- Add expand/collapse on click
- Add progress indicator
- Add detail panel for each step
- Use consistent styling with HeroSection

**Must NOT do:**
- Remove existing step content or data
- Break navigation to steps section

**Recommended Agent Profile:**
- Category: `visual-engineering`
- Skills: [`frontend-ui-ux`]

**Interactive Layout:**
```
┌─────────────────────────────────────────────────────┐
│  🎯 Research How-To: 6 Bước Thành Công              │
│                                                     │
│  Step 1  Step 2  Step 3  Step 4  Step 5  Step 6    │
│    ●       ○       ○       ○       ○       ○        │
├─────────────────────────────────────────────────────┤
│  [Active Step Expands Here]                         │
│  ┌─────────────────────────────────────────────┐  │
│  │  Step 1: Từ Ý tưởng đến Câu hỏi Nghiên cứu │  │
│  │                                             │  │
│  │  Mô tả chi tiết về cách xây dựng ý tưởng  │  │
│  │  và công thức câu hỏi nghiên cứu tốt.      │  │
│  │                                             │  │
│  │  [Các resources liên quan]                 │  │
│  │  [→ Tiếp tục sang bước tiếp theo]         │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Acceptance Criteria:**

**Test:**
- [ ] `npm run build` passes

**Agent-Executed QA Scenarios:**
```
Scenario: Step wizard expands on click
  Tool: Playwright
  Preconditions: Page loaded, scroll to Research How-To section
  Steps:
    1. Find step cards
    2. Click on "Step 1" card
    3. Observe detail panel expands
  Expected: Smooth expand animation, shows details
  Evidence: Screenshot
```

---

### Task 6: Update Navigation.tsx (Smart Scroll)

**What to do:**
- Add scroll position detection
- Change header style based on scroll:
  - Scroll < 50px: Transparent background
  - Scroll > 50px: White/glassmorphism background
- Add smooth transition
- Keep existing menu items and behavior

**Must NOT do:**
- Break existing navigation functionality
- Remove mobile menu drawer
- Change existing menu item positions

**Recommended Agent Profile:**
- Category: `visual-engineering`
- Skills: [`frontend-ui-ux`]

**Acceptance Criteria:**

**Test:**
- [ ] `npm run build` passes

**Agent-Executed QA Scenarios:**
```
Scenario: Navigation becomes solid on scroll
  Tool: Playwright
  Preconditions: Page loaded at top
  Steps:
    1. Scroll down 100px
    2. Observe navigation header
  Expected: Header becomes white with shadow
  Evidence: Screenshot at scroll position
```

---

### Task 7: Update HomePage.tsx

**What to do:**
- Compose all sections in correct order:
  1. IntroSection
  2. BenefitsSection (Bento Grid)
  3. StarterKitSection (Featured)
  4. TestimonialsSection (Carousel)
  5. ResearchHowToSection (Interactive Wizard)
- Add proper section IDs for navigation
- Update SidebarDots for new sections

**Must NOT do:**
- Break existing page structure
- Remove any existing functionality

**Recommended Agent Profile:**
- Category: `visual-engineering`
- Skills: [`frontend-ui-ux`]

**Section Order:**
```
1. IntroSection
   ↓
2. BenefitsSection (Bento Grid)
   ↓
3. StarterKitSection (Featured)
   ↓
4. TestimonialsSection (Carousel)
   ↓
5. ResearchHowToSection (Interactive Wizard)
```

**Acceptance Criteria:**

**Test:**
- [ ] `npm run build` passes

**Agent-Executed QA Scenarios:**
```
Scenario: All sections render in correct order
  Tool: Playwright
  Preconditions: Page loaded
  Steps:
    1. Scroll through entire page
    2. Observe sections in order
  Expected: All 5 sections visible in correct order
  Evidence: Screenshot of each section
```

---

### Task 8: Build and Verify

**What to do:**
- Run production build
- Verify no TypeScript errors
- Verify no console errors
- Report status

**Acceptance Criteria:**
- [ ] `npm run build` succeeds
- [ ] All QA scenarios pass
- [ ] No console errors in dev mode

---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| 1-8 | `feat(homepage): upgrade UX/UI with modern design patterns` | All modified files |

---

## Success Criteria

### Verification Commands
```bash
# Build
cd frontend && npm run build

# Dev mode check
cd frontend && npm run dev
```

### Final Checklist
- [ ] IntroSection: Typing effect + pulse scroll + trust badges ✅
- [ ] BenefitsSection: Bento Grid + 3D tilt ✅
- [ ] StarterKitSection: Featured layout + preview/download ✅
- [ ] TestimonialsSection: Carousel component ✅
- [ ] ResearchHowToSection: Interactive wizard ✅
- [ ] Navigation: Smart scroll behavior ✅
- [ ] Build passes ✅
- [ ] All QA scenarios pass ✅
