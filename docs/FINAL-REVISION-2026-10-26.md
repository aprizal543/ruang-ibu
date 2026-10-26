# Ruang Ibu — Final Revision 2026

**Baseline:** `origin/main` at `814462bc0e68f947ee7ac95b6011af7cc0e89110`
**Current implementation:** Milestone 1 (UX foundation and navigation fixes) only.

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

- Only Milestone 1 is being implemented in the current revision. Milestones 2–6 are not complete and must not be reported as complete.
- Audit older research by source status and source type. Keep distinctions between peer-reviewed research, guidelines, government or health-service information, and other material.
- Do not remove customer-approved content, including the eight mandatory journals. Corrections must preserve traceability and explain their basis.
- Email notifications are not required for the first MVP.
- Do not describe material as clinically approved, clinically validated, or clinically reviewed without documented approval by a qualified reviewer.
- Article content, imagery, source claims, and practical options remain subject to their applicable licensing, evidence, and clinical review gates.
- No Cloudflare, D1, authentication, admin, or production configuration changes are part of Milestone 1.
