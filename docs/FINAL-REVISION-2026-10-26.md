# Ruang Ibu — Final Revision 2026

**Baseline:** `origin/main` at `814462bc0e68f947ee7ac95b6011af7cc0e89110`
**Implementation status (2026-10-27):** M1 and M2 are completed checkpoints. M3 Cloudflare Pages Functions/D1 Q&A backend foundation is implemented locally and its checkpoint is `9dc635b3999b0db805764bdaaf30c0489398b8d9`; remote D1/Access/Turnstile integration remains pending. M4 admin dashboard and M4.1 local QA stabilization are implemented on `feat/ruang-ibu-revision-2026-m4-admin`, not deployed. M5 public Q&A and M6 visual enhancement remain unfinished.

This document records the ten customer-approved revision areas for future planning. It is a scope reference; it does not authorize implementation of all milestones at once.

## Approved revision scope

1. Add images and captions to educational material after selecting and documenting rights-cleared assets.
2. Add a **“Yang Bisa Ibu Lakukan”** section to each article, subject to source and clinical review.
3. Add per-article questions and answers with moderation; do not use an AI chatbot.
4. Add an `/admin` dashboard that follows the approved Ruang Ibu visual design.
5. Add backend services using Cloudflare Pages Functions, D1, Turnstile, and Cloudflare Access.
6. Fix scroll behavior, navigation, and the article reading experience (Milestone 1).
7. Audit research from 2022–2026 while retaining the customer's eight mandatory journals.
8. Add restrained visual enhancements and light animation within the approved design system.
9. Use this article sequence: title → introduction → visual → discussion → safety → practical options → sources → questions and answers at the bottom.
10. Test and release through Cloudflare Preview before any production release.

## Delivery and content constraints

- M1 and M2 are completed checkpoints. M3 backend foundation and M4/M4.1 dashboard plus local QA are local implementations; Cloudflare remote integration remains pending. M5 public Q&A UI and M6 visual enhancements remain unimplemented.
- Audit older research by source status and source type. Keep distinctions between peer-reviewed research, guidelines, government or health-service information, and other material.
- Do not remove customer-approved content, including the eight mandatory journals. Corrections must preserve traceability and explain their basis.
- Email notifications are not required for the first MVP.
- Do not describe material as clinically approved, clinically validated, or clinically reviewed without documented approval by a qualified reviewer.
- Article content, imagery, source claims, and practical options remain subject to their applicable licensing, evidence, and clinical review gates.
- No Production Cloudflare resource or database has been provisioned by M3. Do not claim deployment or change Production without a separate approved release.
- Q&A retention values in the local M3 implementation are provisional defaults only (pending 90 days, rejected/hidden 30 days, approved/answered 365 days). Customer approval is pending; no scheduled purge is configured.
