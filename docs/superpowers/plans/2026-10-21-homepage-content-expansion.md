# Ruang Ibu Homepage Content Expansion Implementation Plan

> **For agentic workers:** Implement inline task by task. Preserve the approved Phase 1.2 hero and do not work on other screens.

**Goal:** Add the six specified editorial sections below the unchanged Beranda first viewport.

**Architecture:** Keep the existing React Router, shared fixed six-tab navigation, CSS tokens, and fallback route. Add one reusable editorial section component and compose the exact Phase 1.3 copy as semantic React content; use existing Phosphor icons and no new imagery.

**Tech Stack:** React 19, TypeScript, React Router, existing CSS tokens/global stylesheet, `@phosphor-icons/react`, Vite PWA unchanged.

**Spec:** `docs/05-HOMEPAGE-PHASE-1.3.md`

## Global Constraints

- Freeze the Phase 1.2 hero, benefits, header, palette, typography, approved photo, and six-tab navigation.
- Add six sections only after the benefit strip; implement no other routes/screens.
- Keep clinical content visibly in review; no claims of efficacy, validation, testimonials, fake statistics, or practice instructions.
- Do not fabricate audio playback or add unverified assets.
- Preserve honest fallback routing and existing PWA architecture.
- Keep all scrolling content clear of the fixed bottom navigation and safe area.

## Review Focus

- First viewport geometry and hero pixels remain unchanged after the content expansion.
- Six section copy and route targets match the spec exactly; unknown routes render the existing fallback.
- At narrow viewports, footer links remain reachable above fixed navigation with no horizontal overflow.
- Clinical status is visible without suggesting reviewed/approved instructions.
- Keyboard order and visible focus remain coherent through the long page.

---

### Task 1: Compose editorial homepage sections

**Files:**
- Create: `src/components/home/HomeEditorialContent.tsx`
- Create: `src/components/home/EditorialSection.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- `EditorialSection` consumes `id`, optional `eyebrow`, `title`, `className`, and `children`; it renders one semantic section with an H2.
- `HomeEditorialContent` renders six ordered content sections after the approved hero/benefit region.

- [x] Keep hero and benefit markup/appearance byte-for-byte in its existing component subtree; wrap it only to establish a first-viewport boundary.
- [x] Add exact Phase 1.3 copy, two guide links, four numbered therapy rows and review status, the non-interactive audio band, the evaluation link, safety copy/links, and footer label.
- [x] Style with existing tokens, varied editorial layouts, subtle rules, and no additional imagery or generic card grid.
- [x] Verify all new navigation destinations use React Router links and wildcard paths still reach `NotBuiltYet`.

### Task 2: Responsive, visual, accessibility, and build QA

**Files:**
- Modify: `docs/Fidelity-QA.md`
- Create screenshots in: `tmp/fidelity/`

- [x] Run Agent Browser at 390×844, 375×812, and 430×932. Save first viewport and full-page screenshots at each size; compare first viewport with Phase 1.2.
- [x] Check 360 px width, keyboard focus/navigation, horizontal overflow, footer scroll clearance, and exact page copy/routes.
- [x] Run `npm.cmd run typecheck` and `npm.cmd run build`.
- [x] Record screenshots, hero comparison, clinical status, Anti UI Slop review, results, and remaining differences in `docs/Fidelity-QA.md`.
- [x] Stop for user review; do not implement other screens.
