# Codex Agent Contract — Ruang Ibu

You are implementing a **user-approved visual design**. Before changing code, read in order:
1. `reference/MASTER-mobile-approved.png` and per-screen crops in `reference/screens/`.
2. `docs/01-DESIGN-SYSTEM.md` (visual source of truth).
3. `docs/02-PRD.md` (feature/safety scope).
4. `docs/03-ARCHITECTURE.md` (technical structure).
5. `docs/Clinical-Review-Log.md` and `assets/ASSET-LICENSE-MANIFEST.md`.

**Never** redesign, change palette, change the 6-tab IA, convert homepage into dashboard, use fake iPhone OS chrome, embed whole screenshot as UI, or invent therapeutic efficacy / 'clinically validated' claims.

## Mandatory implementation process

- Phase 1: Set up Vite + React + TS; import `design-system/tokens.css`; create route scaffolding.
- Phase 2: Implement **Screen 01 homepage only**; render and inspect at 390×844 against `reference/screens/01-beranda.png` (allow that screenshot includes phone frame). Request user approval for significant design differences. Do not automatically continue to all pages before fidelity is acceptable.
- Phase 3: Build other views 02–08 without changing approved principles.
- Phase 4: Add actual licensed media and clinically approved educational content. Do not fake working playback when files are unavailable.
- Phase 5: Test every UI state at 360/375/390/430 widths; WCAG 2.2 AA checks, keyboard, audio failure; update `docs/Fidelity-QA.md` with evidence.

## Before completion

Run lint/typecheck/tests/build; check no names/medical scores transmitted or persisted; verify no unsupported claims; verify asset license manifest; compare screenshots; provide summary of changed files, tests, open clinical approvals, and remaining visual deviations.

## About UI/UX Pro Max skill

If locally installed in Codex CLI, use it only to research typography/accessibility/navigation practices; do not regenerate or overwrite the approved design. Its recommended workflow is public at `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`.

## Skills and direct image viewing (Codex Windows setup)

Read `docs/04-CODEX-SKILLS-SETUP-WINDOWS.md` for verified repository and setup procedures. When installed, select skills according to task:
- `anti-ui-slop`: audit for templated, arbitrary UI patterns; the approved reference wins if there is a disagreement.
- `frontend-design`: implement high-quality semantic responsive UI without inventing new visual direction.
- `ui-ux-pro-max`: check interaction, typography, responsive design and accessibility; do not auto-generate a different design system.
- `agent-browser`: inspect local running app at 390x844, capture screenshots, test interactions and mobile breakpoints.
- `superpowers`: use planning, iterative implementation, testing and review — but respect the already-approved design and PRD.

**Image inspection gate:** `reference/MASTER-mobile-approved.png` and the current screen crop are provided with the initial Codex prompt using `-i/--image` (example in setup guide). Before implementing any screen, report what was visually observed in these images. Just seeing a filename in text is insufficient evidence. Verify the file exists and is readable. When visual inspection is not possible, stop and ask for image attachment instead of inventing a layout.

**Do not treat screenshot crops as production photographs:** obtain discrete rights-cleared image assets before implementation and document their provenance. The screenshot includes visual mockup chrome; never reproduce OS status bars as website UI.
