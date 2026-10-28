# Ruang Ibu — Final Revision 2026

**Baseline:** `origin/main` at `814462bc0e68f947ee7ac95b6011af7cc0e89110`
**Implementation status (2026-10-28):** M1 and M2 are completed checkpoints. M3 Cloudflare Pages Functions/D1 Q&A backend foundation and M4 Admin CMS are implemented. M4.6 Google OIDC is integrated in the separate Admin QA project; Production is unchanged. M5A and the M5 UX direct-publication and answer-toggle revisions are implemented and deployed only to the separate `ruang-ibu-admin-qa` Preview. The owner manually confirmed the principal public submission, Admin answer publication, and answer show/hide flows. M5 UX functional QA is **PASS**; this does not authorize or imply a Production release. M6 visual enhancement remains unfinished.

**M4.6C update (2026-10-27):** The local M4.6A password flow was removed after the isolated hosted test found PBKDF2 600,000 iterations unsupported by the target runtime. Admin identity now uses Google OIDC/GIS verification with `jose`, one-use D1 nonce, pre-provisioned Google `sub`, and the existing opaque D1 session/role system. Synthetic local tests and a local Wrangler/workerd signature-verification harness pass. No Google resource, remote migration, account provisioning, or deployment was performed. Preview readiness is **pending** the owner's Google Web Client/origin setup, Preview configuration/migration/account provisioning approvals, and separately authorized hosted CPU/network validation; tests do not establish release readiness. M5 remains unfinished.

**M4.6C local QA result (2026-10-27):** Backend 40/40; content regression, typecheck, build, local Workerd OIDC signature test, admin browser suite, public route-scroll suite, and `git diff --check` pass. Browser suites use synthetic fixtures; public QA loaded the audio asset but did not exercise playback. Google account login, deployed CSP/JWKS, D1 Preview, and hosted Workers CPU were not tested. The repository has no lint script.

**M5 UX revision (2026-10-28):** On article detail, the Q&A list and form appear before the Sources disclosure. The form is closed by default and opens from “+ Ajukan Pertanyaan.” A new submission is directly public as an unanswered question only after server-side validation, personal-data/link/spam checks, rate limiting, same-origin checks, and Turnstile Siteverify pass. It uses the existing D1 `approved` status for compatibility; the public label is “Belum dijawab,” not an admin approval. The admin can answer, hide, or (Owner only) delete; no separate approval is required for newly received questions. Historical `pending` records are not rewritten or published silently and require reviewed public text plus an answer in one admin operation if handled. Turnstile uses Managed behavior with `appearance: interaction-only` and execution on submit; expired/failed challenges do not submit or publish a question. Local backend flow tests use synthetic SQLite D1 and an injected verifier; browser coverage uses synthetic fetch/widget fixtures. The revision was subsequently deployed to the separate `ruang-ibu-admin-qa` Preview (branch `admin-qa`). The owner manually confirmed direct publication, Admin answer publication, and the answer show/hide toggle. No Production operation, migration, or clinical content change was part of that deployment.

This document records the ten customer-approved revision areas for future planning. It is a scope reference; it does not authorize implementation of all milestones at once.

## Approved revision scope

1. Add images and captions to educational material after selecting and documenting rights-cleared assets.
2. Add a **“Yang Bisa Ibu Lakukan”** section to each article, subject to source and clinical review.
3. Add per-article questions and answers with server-side abuse checks, public unanswered questions, and Admin answer/hide/delete workflows; do not use an AI chatbot.
4. Add an `/admin` dashboard that follows the approved Ruang Ibu visual design.
5. Add backend services using Cloudflare Pages Functions, D1, Turnstile, and independent D1-backed admin sessions.
6. Fix scroll behavior, navigation, and the article reading experience (Milestone 1).
7. Audit research from 2022–2026 while retaining the customer's eight mandatory journals.
8. Add restrained visual enhancements and light animation within the approved design system.
9. Use this article sequence: title → introduction → visual → discussion → safety → practical options → Tanya Jawab → Sumber Informasi at the bottom.
10. Test and release through Cloudflare Preview before any production release.

## Delivery and content constraints

- M1/M2, M3 backend, M4 Admin CMS and M4.6 Google OIDC implementation are available. M5 public Q&A direct-publication and answer-toggle flows passed local automated checks and owner-confirmed functional QA on the separate Cloudflare QA Preview. Production remains unchanged; any Production release requires its own review and authorization. M6 visual enhancements remain unfinished.
- Audit older research by source status and source type. Keep distinctions between peer-reviewed research, guidelines, government or health-service information, and other material.
- Do not remove customer-approved content, including the eight mandatory journals. Corrections must preserve traceability and explain their basis.
- Email notifications are not required for the first MVP.
- Do not describe material as clinically approved, clinically validated, or clinically reviewed without documented approval by a qualified reviewer.
- Article content, imagery, source claims, and practical options remain subject to their applicable licensing, evidence, and clinical review gates.
- No Production Cloudflare resource or database has been provisioned by M3. Do not claim deployment or change Production without a separate approved release.
- Q&A retention values in the local M3 implementation are provisional defaults only (pending 90 days, rejected/hidden 30 days, approved/answered 365 days). Customer approval is pending; no scheduled purge is configured.

## Whole-site scientific-source and Production readiness audit — 28 October 2026

The completed local source inventory and evidence-to-claim review are recorded in `docs/content-research/PHASE-2.3-SOURCE-AUDIT.md` and `docs/content-research/THERAPY-CLAIM-SOURCE-MATRIX.md`. It covers all 43 registry records, 11 article routes/12 customer topics, both maternity guides, Sources disclosures, relaxation audio copy, and the ephemeral Evaluation page. The inventory identifies 7 records explicitly published before 2022, 16 official-information entries without a verified publication year, and 20 entries dated 2022–2026. Three older Cochrane/systematic research reviews are archive-only; older guidelines and official health information are separately classified and retained only with the source-scope/date caveats documented in the audit. C01–C08 DOI and URL identity is unchanged.

This is a bibliographic/editorial audit, not clinical review. Every article/guide remains `clinicalReview: draft`. Unresolved source-access and clinical-copy gates include the direct T03 grounding evidence, general prenatal massage scope, pregnancy warm-compress protocol/effect claims, pregnancy-versus-labor breathing boundaries, and confirmation of warning-sign wording against current Indonesian maternity pathways. No clinician approval is implied.

### Targeted content remediation — 28 October 2026

Copy for A01/A04/A05/A06/B01/B05/B06/T01–T04 was narrowed where studies were small, structured, population-specific, or indirect. T03 no longer presents grounding as a general clinical relaxation method and has no self-guided technique; its source review remains draft. No source IDs, article URLs, DOI, customer reference identity, article structure, or Q&A workflow changed. The source audit and claim matrix record VERIFIED facts, LIMITED EVIDENCE, and CLINICAL REVIEW REQUIRED items separately. All clinical review states remain draft, so Production stays NO-GO pending a qualified Indonesian maternity review and the operational release gates below.

The reviewer-ready per-article form is `docs/content-research/CLINICAL-REVIEW-PACKET-2026-10-28.md`. It records the claims, source IDs, safety boundaries, and blank reviewer decision/name/date/note fields; it does not change application review state.

**Production status: NO-GO.** QA owner-confirmed M5 functionality does not establish Production readiness. Production D1 and its `0001`/`0002` migrations, Production OAuth client/origin, runtime binding/variables, encrypted auth/rate-limit/Turnstile secrets, exact Turnstile hostname, Production Owner provisioning path, and final clinical review remain unverified or unprepared. The existing provisioning script is pinned to staging and must not be used for Production. Direct-publication PII/spam screening is heuristic; operational moderation, hide/delete response, privacy notice, and customer-approved retention policy remain release gates. Production must use a separate D1 database, not staging. The current detailed release gates and rollback sequence are in `docs/backend/DEPLOYMENT-RUNBOOK.md`.
