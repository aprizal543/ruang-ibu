# Ruang Ibu Mobile Homepage Implementation Plan

> **For agentic workers:** Implement this plan in the current project workspace. Scope is Screen 01 only; use the approved reference as the visual authority.

**Goal:** Build and verify the Ruang Ibu mobile homepage in React, Vite, TypeScript, and Tailwind at the approved phone viewports.

**Architecture:** Use a static Vite SPA with React Router scaffolding, semantic homepage components, existing design tokens, self-hosted fonts, the approved WebP hero, and Lucide icons. Configure only the PWA shell foundation required by Architecture v1.1; defer approved icons and article/audio offline behavior.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React, `vite-plugin-pwa`/Workbox, Vitest/Testing Library, Agent Browser.

**Spec:** `AGENTS.md`, `docs/01-DESIGN-SYSTEM.md`, `docs/02-PRD.md`, `docs/03-ARCHITECTURE.md`, and `reference/screens/01-beranda.png`.

## Global Constraints

- Implement Screen 01 Beranda only; do not build other pages.
- Preserve the approved composition, palette, text hierarchy, two CTAs, benefit strip, and six-tab navigation.
- Do not use screenshots as production UI or add mock phone chrome.
- Do not claim that medical content is safe, effective, or clinically validated.
- Preserve the approved JPG; use `assets/images/hero/pexels-hero-mobile.webp` for the homepage.
- Keep evaluation, backend, database, and expanded offline/audio behavior out of scope.

## Review Focus

- Crop at 375 px must retain face and belly without colliding with the headline.
- At all target widths, no horizontal overflow and all six tab labels remain legible.
- Fixed bottom navigation must account for safe-area insets and not cover content.
- Font licensing and PWA install icon availability must be reported accurately.
- PWA cache must not admit draft/clinical/audio data in this phase.

---

### Task 1: Initialize repository and frontend foundation

**Files:** `package.json`, `pnpm-lock.yaml`, `.gitignore`, `index.html`, `vite.config.ts`, `tsconfig*.json`, `postcss.config.*`, Tailwind integration, `src/main.tsx`, `src/App.tsx`.

- [ ] Initialize Git in the project root and scaffold React + TypeScript + Vite + Tailwind.
- [ ] Add React Router and a root homepage route with a minimal not-yet-built fallback for other destinations.
- [ ] Configure `vite-plugin-pwa` using Architecture v1.1's `injectManifest` shell pattern; do not add article/audio cache features or invent PWA brand icons.
- [ ] Run typecheck and production build; both must succeed.

### Task 2: Implement the approved homepage

**Files:** `src/pages/HomePage.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/BottomTabBar.tsx`, `src/components/ui/ActionPill.tsx`, `src/styles/home.css`, `src/main.tsx`.

- [ ] Add licensed local Fraunces and DM Sans font packages and preserve their OFL license files.
- [ ] Import existing `design-system/tokens.css`; do not alter its token values.
- [ ] Implement one isolated temporary wordmark, hero with approved WebP and responsive focal crop, headline and truthful copy, both CTA links, three subdued benefit items, and six-tab navigation.
- [ ] Use Lucide React with one consistent outline style; avoid unavailable media playback and unsupported claims.
- [ ] Run build/typecheck and inspect semantic/accessibility structure.

### Task 3: Visual QA and handoff

**Files:** `docs/Fidelity-QA.md`, `tmp/fidelity/home-375x812.png`, `tmp/fidelity/home-390x844.png`, `tmp/fidelity/home-430x932.png`.

- [ ] Run the local app and capture real website screenshots with Agent Browser at all three target viewports.
- [ ] Compare only the website content region with `reference/screens/01-beranda.png`; identify and fix material crop, spacing, CTA, tab, overflow, and focus issues.
- [ ] Record actual captures, differences, checks, and unresolved limitations in `docs/Fidelity-QA.md`.
- [ ] Stop after Beranda QA; leave the visual approval field pending user review.
