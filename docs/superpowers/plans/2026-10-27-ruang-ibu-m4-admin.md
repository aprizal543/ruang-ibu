# Ruang Ibu M4 Admin Dashboard Implementation Plan

> **For agentic workers:** follow this plan task by task; preserve the approved visual direction and M3 security boundaries.

**Goal:** Build a responsive `/admin` moderation workspace using only the authenticated M3 admin APIs, with no fake-auth mode, no operational mock data, and no purge control.

**Architecture:** Add an isolated React admin feature and route family under `/admin`; use a same-origin typed `fetch` client for all data and mutations. Keep Cloudflare Access as the actual security boundary, let the API fail closed, and document the need for Access path protection on both the HTML routes and API routes.

**Tech Stack:** React 19, TypeScript, React Router 7, CSS design tokens, Pages Functions M3 API, existing Chromium CDP QA scripts.

**Spec:** User request dated 2026-10-27, M4 Admin Dashboard & Moderation Workspace.

## Global Constraints

- Keep public routes, six-tab public navigation, M1/M2 content, audio, evaluation, PWA and M3 migrations unchanged.
- No custom login, token storage, frontend auth bypass, fabricated dashboard data, public Q&A UI, purge action, or Cloudflare provisioning.
- Admin APIs remain same-origin, `no-store`, Access protected, with explicit loading/error/empty states.
- Never persist private question data in browser storage or include PII in URLs/logs.
- Use Ruang Ibu tokens and Fraunces/DM Sans; admin uses its own responsive navigation.
- Respect keyboard access, visible focus, touch targets, and reduced motion.

## Review Focus

- Access or D1 unconfigured: show a safe unavailable state and no private data.
- Stale/aborted list requests: latest URL filters and cursor remain authoritative.
- Invalid transitions/409: explain conflict and allow explicit refresh.
- PII editing: original and public fields remain clearly separated; public edits are explicit.
- Small widths and keyboard-only dialog use: no overflow, focus loss, or hidden actions.

---

### Task 1: Add admin API contract tests and dashboard browser runner

**Files:**
- Create: `qa/admin-dashboard.browser.mjs`
- Create or extend: existing `qa` test coverage for admin API client/UI contracts
- Modify: `package.json`

**Interfaces:** The browser harness intercepts `/api/admin/*` with synthetic fixtures only in the test process; production runtime has no fixture path.

- [ ] Assert dashboard routes render and use API responses, including loading, empty, auth, network error and pagination/filter query behavior.
- [ ] Run the test and confirm it fails because the M4 route/script is absent.

### Task 2: Implement typed API and route shell

**Files:**
- Create: `src/features/admin/types/admin.ts`
- Create: `src/features/admin/api/adminApi.ts`
- Create: `src/features/admin/components/AdminLayout.tsx`
- Create: `src/features/admin/pages/*`
- Create: `src/features/admin/admin.css`
- Modify: `src/App.tsx`

**Interfaces:** API client functions mirror `docs/backend/API-CONTRACT.md`, pass `credentials: 'same-origin'`, accept AbortSignal, parse `{data}` / `{error}`, and never store response data.

- [ ] Add routes for overview, inbox, detail, history and settings.
- [ ] Implement desktop sidebar and mobile keyboard-operable drawer, with all loading/error/empty/auth states.
- [ ] Verify route smoke and typecheck.

### Task 3: Implement moderation, answers, and deletion workflows

**Files:**
- Modify: admin detail and list pages/components.
- Add tests: moderation, answer edit, hide/reject/delete confirmation, 409 and auth error states.

**Interfaces:** Use exact M3 payloads and supported transitions; never call retention purge.

- [ ] Add pending public-name/question editing and explicit approve/reject confirmation.
- [ ] Add approved/answered hide, manual answer/edit, and confirmed individual deletion.
- [ ] Verify workflows using synthetic API fixtures.

### Task 4: Protect privacy and PWA behavior

**Files:**
- Modify service worker only if `/admin` can enter offline SPA fallback or admin routes are cached.
- Add tests for cache exclusions and storage privacy.

- [ ] Ensure admin route is excluded from offline navigation fallback and admin API is never cached.
- [ ] Verify no question data/token is written to Web Storage; no purge control exists.

### Task 5: Documentation and evidence

**Files:**
- Create: `docs/admin/DASHBOARD-DESIGN.md`
- Create: `docs/admin/ADMIN-WORKFLOW.md`
- Create: `docs/admin/ADMIN-QA.md`
- Create synthetic screenshots: `docs/evidence/m4-admin/`
- Modify: `docs/FINAL-REVISION-2026-10-26.md`, `docs/Fidelity-QA.md`, `docs/backend/DEPLOYMENT-RUNBOOK.md`

- [ ] Document deployment Access paths `/admin`, `/admin/*`, `/api/admin/*`, M4 behavior, known limits, M5 boundary and screenshot evidence.

### Task 6: Final verification

- [ ] Run `npm.cmd run test:backend`, `npm.cmd run test:content`, `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd run test:browser:m2`, `npm.cmd run test:browser:route-scroll`, `npm.cmd run test:browser:admin`, `npm.cmd audit`, and `git diff --check`.
- [ ] Capture responsive UI at 360, 375, 390, 430, 768, 1024 and 1440 widths; use synthetic data only.
- [ ] Report Cloudflare Access/D1/Turnstile configuration as pending where not provisioned.
