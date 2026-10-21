# Setup Codex CLI + 5 Skills + Approved Mobile Images (Windows)

**Project:** Ruang Ibu | **Purpose:** Local preparation, NOT website implementation.
**Status:** The installer is provided, but must be executed on YOUR Windows computer. It has not been run on your PC by ChatGPT.

## 0. The visual truth is already in this project

- `reference/MASTER-mobile-approved.png` — original user-approved mobile montage (immutable).
- `reference/screens/01-beranda.png` through `08-menu.png` — crops for targeted review.
- `docs/01-DESIGN-SYSTEM.md`, `docs/02-PRD.md`, `docs/03-ARCHITECTURE.md` — baseline contract.
- `AGENTS.md` — Codex's standing project instructions.

These references should remain in the same local repository as the code and documents. They do not need a web URL or Google Drive link. **Do not use the montage as the live page background.** It is a visual reference only. The cropped screenshots still include pieces of the mock-phone chrome and may not match a web viewport pixel-for-pixel; compare the *web content region*, not iOS status bars or frame shadows.

## 1. Prerequisites

Use PowerShell in Windows Terminal or the VS Code terminal:

```powershell
node --version
npm --version
git --version
codex --version
python --version
```

Install Node.js LTS, Git for Windows, Codex CLI and Python 3 if any command is missing. Do not blindly reinstall software you already use.

Unzip this project anywhere you choose, and open its root (the folder containing `AGENTS.md`) in VS Code. Do **not** assume any hardcoded `C:\` or `D:\` project location.

## 2. Two installation paths

### Path A — Run a reviewed installer (recommended)

First examine `tools/setup-codex-skills-windows.ps1` in VS Code. Then, from the project root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\setup-codex-skills-windows.ps1
```

The `Bypass` flag applies only to this PowerShell process; avoid system-wide execution-policy changes. This downloads externally maintained skills/code using npm, GitHub and Git; inspect repository sources before trusting them. Do not run as Administrator unless you have a genuine permissions issue.

This installs:
- **Anti UI Slop** (`uizze/uizze`) — global via `npx skills` for Codex.
- **Frontend Design** (`anthropics/skills`) — global for Codex.
- **Agent Browser** skill (`vercel-labs/agent-browser`) — global, and its CLI plus Chrome for Testing.
- **UI UX Pro Max** (`nextlevelbuilder/ui-ux-pro-max-skill`) — **project-local** via the official `ui-ux-pro-max-cli`.
- **Superpowers** (`obra/superpowers`) — official manual checkout in `~/.codex/superpowers` + junction to `~/.agents/skills/superpowers` for Windows.

If you would rather install Superpowers through Codex CLI's **official plugin marketplace**, run the script with `-SkipSuperpowers`, then open Codex, enter `/plugins`, search **Superpowers**, and select **Install Plugin**. Use *either* the plugin or the manual version, not both.

If a command fails, stop there, read its output, and fix that particular issue. The script does not overwrite existing project documents or reinstall Superpowers where an existing checkout/link is found.

### Path B — Install manually, one at a time

Open PowerShell **from the project root** and enter:

```powershell
# 1. Anti UI Slop (global)
npx.cmd --yes skills add uizze/uizze --skill anti-ui-slop -g -a codex -y

# 2. Frontend Design (global)
npx.cmd --yes skills add anthropics/skills --skill frontend-design -g -a codex -y

# 3. UI UX Pro Max (project-local)
npx.cmd --yes ui-ux-pro-max-cli init --ai codex

# 4. Agent Browser: skill and browser tooling
npx.cmd --yes skills add vercel-labs/agent-browser -g -a codex -y
npm.cmd install -g agent-browser
npx.cmd --yes agent-browser install
```

**5. Superpowers:** Inside Codex CLI, enter `/plugins` and select the official Superpowers plugin. If your CLI version does not expose that menu, use the documented Windows manual method:

```powershell
New-Item -ItemType Directory -Force -Path "$HOME\.codex" | Out-Null
New-Item -ItemType Directory -Force -Path "$HOME\.agents\skills" | Out-Null
git clone https://github.com/obra/superpowers.git "$HOME\.codex\superpowers"
New-Item -ItemType Junction -Path "$HOME\.agents\skills\superpowers" -Target "$HOME\.codex\superpowers\skills"
```

If those paths already exist, inspect before cloning or creating a junction again. **Restart Codex** after installing skills.

## 3. Verify that Codex has access

```powershell
npx.cmd --yes skills list -g -a codex
Test-Path .\reference\MASTER-mobile-approved.png
Test-Path .\reference\screens\01-beranda.png
Test-Path .\AGENTS.md
Test-Path .\.agents\skills\ui-ux-pro-max\SKILL.md
agent-browser --help
```

Expected: relevant skills appear under global or project scope, required paths return `True`, and Agent Browser shows its CLI help. You can additionally inspect `~/.agents/skills` and `./.agents/skills/`. A successful install alone is not proof that a skill *ran*; verify by asking Codex to name the exact `SKILL.md` it read for the task.

## 4. Attach the reference image to the Codex session

From the folder that contains `AGENTS.md`, use:

```powershell
codex -i .\reference\MASTER-mobile-approved.png -i .\reference\screens\01-beranda.png "Read AGENTS.md, the three primary project docs, and both attached images. Audit the planned mobile homepage against the approved image. Report the layout, typography, photography, navigation, safety wording, and skills discovered. Do NOT code or redesign yet."
```

If `codex` is blocked in PowerShell by a script execution policy, use `codex.cmd` when your installation provides that executable.

`-i` / `--image` attaches local PNGs to the opening prompt. This is the **reliable** visual input route, in addition to preserving file paths for future turns. A path written in `AGENTS.md` does not, by itself, guarantee the image has been visually inspected by the model.

For later pages, attach their respective crop, e.g. `-i .\reference\screens\05-relaksasi.png`. Keep the full montage in the repository for context. Do not place UI reference images in `.gitignore` if you intend your team or Codex cloud workflows to receive them. Avoid pushing sensitive personal photos to a public repo.

## 5. Hard constraints — visual and clinical

1. The approved reference overrides newly invented design systems or generative recommendations. Use UI UX Pro Max for checks, not aesthetic replacement.
2. Mobile-first only. First implement **Screen 01 Beranda**, 390x844 content viewport (do not imitate mock iPhone chrome).
3. Do not embed a screenshot as UI, use it as a screenshot baseline. Recreate separate semantic components and properly licensed image assets.
4. Make a browser screenshot at 390x844 with Agent Browser. Compare content layout and proportions by eye first; direct pixel diffs against the phone-collage crop will be misleading.
5. Get approval on Screen 01 before implementing the other seven screens.
6. Do not label content as clinically validated until a competent reviewer has actually signed off. Medical content must be reviewed; no invented safety or efficacy claims.
7. Audio licenses and real playback should be verified before production. Never fabricate audio paths or "playable" demo claims.
8. Do not send or persist individual health questionnaire results without designing the necessary privacy safeguards.

## 6. Browser QA example (after dev server exists)

The following assumes **the website is already running at** `http://localhost:5173`. This is not a currently deployed website.

```powershell
agent-browser open http://localhost:5173
agent-browser set viewport 390 844
agent-browser screenshot .\reference\qa-beranda-390.png
agent-browser snapshot -i
agent-browser close
```

Review `reference/qa-beranda-390.png` against `reference/screens/01-beranda.png`. Remember to compare the *website content*, not iPhone frame/status-bar mockups. Record mismatches in `docs/Fidelity-QA.md` and fix them before moving to another view.

## Official sources

- Anti UI Slop: https://github.com/uizze/uizze
- Frontend Design: https://github.com/anthropics/skills
- UI UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Agent Browser: https://github.com/vercel-labs/agent-browser
- Superpowers: https://github.com/obra/superpowers
- Codex CLI `--image`: https://learn.chatgpt.com/docs/cli/reference
