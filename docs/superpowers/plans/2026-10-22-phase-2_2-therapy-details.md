# Phase 2.2 Therapy Detail Pages Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` inline. Tasks use checkbox syntax and must be verified before completion.

**Goal:** Add data-driven, draft-only detail routes for Terapi Musik, Relaksasi Otot Ringan, and Pijat Pendamping while preserving the approved detail template and homepage/catalog baselines.

**Architecture:** Keep article copy and source IDs in the typed therapy content model. Extend only optional audio availability for topics without an audio section; the shared React template will render the existing editorial layout and hide that optional section where irrelevant. Add the three requested routes and update only their catalog hrefs.

**Tech Stack:** React, TypeScript, React Router, Phosphor Icons, Agent Browser.

**Spec:** Ruang Ibu Phase 2.2 user requirements; `docs/01-DESIGN-SYSTEM.md`, `docs/02-PRD.md`, `docs/03-ARCHITECTURE.md`, and `reference/MATERI-DRAF-v0.2.md`.

## Global Constraints

- Do not change the approved homepage, catalog layout, or detail-template visual styling.
- All three articles stay `draft`; practice guides stay locked and no audio player is added.
- Do not add movement, position, intensity, duration, pressure, or massage instructions.
- Preserve source IDs and metadata; publish only source-supported user-facing statements.
- No backend, PWA change, other routes, commit, or deployment.

## Review Focus

- Direct route and catalog href agree while source article slugs remain traceable.
- Each article's scope, uncertainty, safety copy, and references match its own sources.
- Relaksasi Otot Ringan and Pijat Pendamping do not expose practical instructions.
- Optional audio does not create an empty section for non-audio topics.
- Homepage, catalog, and Teknik Pernapasan render identically to approved baselines.

## Tasks

- [x] Audit T02/T03/T04 content, source bibliography, data model, routing, and approved screenshot.
- [x] Add failing Agent Browser assertions for three routes, catalog navigation, article-specific content/source lists, draft/locked states, and omitted optional audio sections.
- [x] Verify the new assertions fail before implementation.
- [x] Add T02/T03/T04 article data and references, route entries, catalog href updates, and optional audio section handling without CSS changes.
- [x] Run content/interactions and visual screenshot QA at 375×812, 390×844, and 430×932.
- [x] Compare homepage, catalog, and T01 screenshot regressions; run typecheck, production build, and `git diff --check`.
- [x] Record source mapping, material gaps, screenshot evidence, and pending clinical review in project docs. Stop without committing.
