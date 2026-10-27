# Ruang Ibu M3 Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add a locally testable Cloudflare Pages Functions and D1 foundation for moderated public questions and protected admin moderation.

**Architecture:** Pages Functions expose `/api/questions` and `/api/admin/*`, backed by a local/remote-configured D1 binding named `DB`. Public submission is always pending, requires Turnstile Siteverify and same-origin validation, while admin routes verify Cloudflare Access RS256 JWTs and an explicit email allowlist. Test-only dependencies are injected in unit tests; no runtime bypass is introduced.

**Tech Stack:** Cloudflare Pages Functions, D1, Wrangler, TypeScript, `jose`, Node test runner with `tsx`, SQLite/D1 local emulator.

**Spec:** User request “RUANG IBU — FINAL REVISION 2026 / MILESTONE 3: CLOUDFLARE BACKEND & Q&A FOUNDATION”, plus `docs/02-PRD.md`, `docs/03-ARCHITECTURE.md`, `docs/FINAL-REVISION-2026-10-26.md`, and `AGENTS.md`.

## Global Constraints

- Work only on `feat/ruang-ibu-revision-2026-m3-backend`, created from M2 `4681725108c2bf82a879a1102120133bdd09b873`.
- Do not change M1/M2 behavior, article content, sources, photos, Evaluation persistence, Cloudflare production, or remote D1 resources.
- Public submissions are private and `pending`; public reads include only moderator-approved `approved` or `answered` rows.
- Do not store raw visitor IPs, expose emails, create custom admin login, or bypass missing Turnstile/Access configuration.
- Never place a fake D1 ID in committed Wrangler configuration; use a clearly local-only ID only as a CLI test argument if Wrangler requires one.
- Keep `/api/*` outside SPA navigation fallback and service-worker caching; static assets should not invoke Functions.
- No dashboard, public Q&A UI, email notifications, chatbot, or evaluation API.

## Review Focus

- Forged, expired, wrong-issuer, and wrong-audience Access JWTs must fail; missing configuration must fail closed.
- Pending, rejected, hidden, and private values must never be returned by public reads.
- Duplicate/concurrent submissions must not bypass the bounded rate limit; D1 writes must use prepared statements and atomic transitions.
- SPA routes and PWA navigation must remain static and API responses must never be cached.
- Article aliases must map to the existing 11 articles without creating new content; tests compare the shared registry to current routes.

---

### Task 1: Shared article registry and D1 schema

**Files:** `src/content/questionArticleRegistry.ts`, `migrations/0001_questions.sql`, `wrangler.toml` or local-only Wrangler config, `qa/backend/*.test.ts`.

**Interfaces:** Registry maps public route slugs and legacy aliases to stable article IDs and labels. D1 schema creates `questions`, `answers`, `moderation_events`, and hashed-key `question_rate_limits` with constraints and indexes.

- [x] Write registry parity and schema tests: 11 articles, known aliases, pending defaults, FK/index presence, duplicate answer prevention, and safe event fields.
- [x] Run tests and verify expected missing-registry/schema failure.
- [x] Implement registry, idempotent D1 migration, and local binding config without committed fake remote database IDs.
- [x] Run database migration/tests with Wrangler's local D1 emulator.

### Task 2: Public API and privacy controls

**Files:** `functions/api/questions/index.ts`, `functions/_shared/*`, `functions/_types.ts`, `qa/backend/public-questions.test.ts`, `qa/backend/d1-integration.test.ts`.

**Interfaces:** `GET /api/questions` accepts an allowlisted slug, bounded `limit`, and opaque cursor. `POST /api/questions` accepts only the documented fields, verifies origin, payload, consent, Turnstile, and hashed-IP rate limit, then returns a private pending receipt.

- [x] Write failing tests for validation, Turnstile outcomes/missing config, slug allowlist, pending default, public-field allowlist, no-store headers, pagination, privacy, and bounded rate limit.
- [x] Implement shared error/JSON helpers, body parsing/normalization, Siteverify timeout/action/hostname validation, D1 prepared queries, and public handlers.
- [x] Run the public API tests and real local D1 integration tests until green.

### Task 3: Cloudflare Access and admin API

**Files:** `functions/api/admin/_middleware.ts`, `functions/api/admin/summary.ts`, `functions/api/admin/questions/index.ts`, `functions/api/admin/questions/[questionId].ts`, `functions/api/admin/questions/[questionId]/moderation.ts`, `functions/api/admin/questions/[questionId]/answer.ts`, `functions/_shared/access.ts`, `qa/backend/access-security.test.ts`, `qa/backend/moderation.test.ts`.

**Interfaces:** Middleware verifies `Cf-Access-Jwt-Assertion` with JOSE RS256 against configured issuer/audience and allowlisted verified email; missing config fails closed. Admin API lists paginated/filterable inbox data, reads a question, applies moderation transitions and creates/updates the single answer with an audit event.

- [x] Write failing tests for absent/bad/expired/wrong-audience/wrong-issuer JWTs, unauthorized email, valid signed identity, origin checks, transitions, sanitization, answer updates, audit event, and no-store.
- [x] Implement middleware and admin handlers with transactions/batched D1 writes where needed; preserve original private text while moderators set separate public text/name.
- [x] Run admin/security tests against local D1.

### Task 4: Pages routing, docs, and regression gate

**Files:** `public/_routes.json`, `src/pwa/service-worker.ts` only if required to deny `/api/*`, `docs/03-ARCHITECTURE.md`, `docs/backend/API-CONTRACT.md`, `docs/backend/SECURITY-MODEL.md`, `docs/backend/D1-SETUP.md`, `docs/backend/DEPLOYMENT-RUNBOOK.md`, `package.json`, `package-lock.json`, `qa/backend/run.mjs`.

- [x] Add a regression test that `/api/*` is routed to Functions, static asset paths are excluded, and the service worker does not cache API/admin responses or MP3 files.
- [x] Add `npm.cmd run test:backend` for local SQLite API integration/security tests, and document/run the separate Wrangler D1 + Pages Functions local smoke workflow.
- [x] Update architecture to state that Evaluation remains in-memory while question submissions are the only new persisted visitor data.
- [x] Document endpoint contracts, privacy/retention, trust boundaries, local/preview/production bindings, Turnstile, Access, migration, rollback, and the Cloudflare resources still required.
- [x] Run `npm.cmd run test:backend`, `npm.cmd run test:content`, `npm.cmd run typecheck`, `npm.cmd run build`, M2 browser regression, route-scroll regression, and `git diff --check`.
- [x] Review the final diff for unchanged M1/M2 content, no secrets, no remote provisioning, and no commit/push/deploy.
