# RUANG IBU — Blueprint v1.0

**Desain mobile disetujui: 21 Oktober 2026.**  
**Paket:** Design System + PRD + Architecture + reference screen crops + Codex agent contract.  
**State:** Beranda (Screen 01) is implemented in React/Vite and awaits visual approval. The other seven screens remain unbuilt.

## Start here

1. **`reference/MASTER-mobile-approved.png`** — master screenshot provided and approved by the user.
2. **`docs/01-DESIGN-SYSTEM.md`** — approved layout/visual rules, tokens, interactions and anti-slop/fidelity rules.
3. **`docs/02-PRD.md`** — audience, MVP, feature IDs, acceptance, exclusion and content safety.
4. **`docs/03-ARCHITECTURE.md`** — static React/Vite/TS, architecture diagrams, folder layout, data contracts and QA.
5. **`AGENTS.md`** — instructions and hard constraints to feed to Codex CLI.
6. **`docs/Fidelity-QA.md`** — blank QA log to be populated with actual coded screenshots.
7. **`assets/ASSET-LICENSE-MANIFEST.md` / `docs/Clinical-Review-Log.md`** — required production release gates.

## Essential gates

- **Visual:** must be extremely close to reference, not just "inspired by" it. First implement *only* homepage and get approval.
- **Product:** mobile-first six main nav items, eight visual states as in montage.
- **Safety:** existing written materia are research drafts; not yet clinically reviewed. Fix dangerous misleading copy from the mockup without changing layout.
- **Media:** all final assets require license/provenance, guided narration requires clinical review. The collage is NOT an image bank.
- **Privacy:** MVP survey runs in memory, with no cloud backend or persisted health values.

## What this is not

These documents and cropped screenshots are **not** a live working app, full Figma design, approved medical protocol, or verified audio license pack. UI/UX Pro Max CLI was not executed in this environment (repository download unavailable), although its documented methods informed the workflow.

## Suggested Codex kickoff (after the zip is extracted into a new folder)

> Read AGENTS.md and all docs in order. Treat reference/MASTER-mobile-approved.png as immutable design source. Implement only mobile homepage at 390x844 as semantic React components; take a browser screenshot and compare to reference/screens/01-beranda.png. Do not create dashboard UI, invent content or audio, or implement remaining pages before homepage fidelity is approved. Report exact files changed, tests and unmatched visual details.

## Codex skills setup and vision input

**Before coding:** read `docs/04-CODEX-SKILLS-SETUP-WINDOWS.md`. Windows installer available at `tools/setup-codex-skills-windows.ps1`. The approved PNG is available at `reference/MASTER-mobile-approved.png` and can be attached to the initial Codex prompt using `codex -i <path>`. Installs are performed by the user on their own PC; bundling the installer does not imply tools were installed remotely.
