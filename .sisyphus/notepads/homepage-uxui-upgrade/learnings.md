## 2026-02-05 Task: bootstrap
- Keep animations moderate; respect `useReducedMotion`.
- Prefer Framer Motion patterns already used: `initial`/`whileInView` + `viewport={{ once: true }}`; use `AnimatePresence` for dialogs.
- Avoid new dependencies; implement carousel/typing with React + Framer Motion.

## 2026-02-06 Task: IntroSection typing + badges
- Typing effect implemented via `setTimeout` loop with cleanup; gated by `useReducedMotion`.
- Trust badges implemented as lightweight pill chips under CTA.
- Scroll indicator implemented as a `motion.button` with gentle y oscillation.

## 2026-02-06 Task: TestimonialsSection skeleton
- Prefer CSS `scroll-snap` + `scrollIntoView` for carousel behavior; no new deps.
- Provide a safe empty state when real testimonials are not yet available.
