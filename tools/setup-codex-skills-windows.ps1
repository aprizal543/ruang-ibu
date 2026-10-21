# Ruang Ibu - Windows PowerShell installer for Codex CLI skills
# Run from the extracted project root, after reading docs/04-CODEX-SKILLS-SETUP-WINDOWS.md.
# Does NOT change application code, overwrite AGENTS.md, or download UI imagery.
[CmdletBinding()]
param(
  [switch]$SkipSuperpowers,
  [switch]$SkipBrowserInstall
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $projectRoot

function Need-Command([string]$commandName) {
  if (-not (Get-Command $commandName -ErrorAction SilentlyContinue)) {
    throw "Command '$commandName' not found. Please install prerequisite and reopen PowerShell."
  }
}
function Run-Step([string]$label, [scriptblock]$command) {
  Write-Host "`n>> $label" -ForegroundColor Cyan
  & $command
  if ($LASTEXITCODE -ne 0) { throw "FAILED: $label (exit code $LASTEXITCODE)" }
}

Need-Command 'git.exe'
Need-Command 'npm.cmd'
Need-Command 'npx.cmd'
Need-Command 'codex'

Write-Host "Project: $projectRoot"
Run-Step 'Codex CLI version' { codex --version }
Run-Step 'Install Anti UI Slop globally (Codex)' {
  npx.cmd --yes skills add uizze/uizze --skill anti-ui-slop -g -a codex -y
}
Run-Step 'Install Frontend Design globally (Codex)' {
  npx.cmd --yes skills add anthropics/skills --skill frontend-design -g -a codex -y
}
Run-Step 'Install Agent Browser discovery skill globally (Codex)' {
  npx.cmd --yes skills add vercel-labs/agent-browser -g -a codex -y
}
Run-Step 'Install UI UX Pro Max in this project (Codex)' {
  npx.cmd --yes ui-ux-pro-max-cli init --ai codex
}
if (-not $SkipBrowserInstall) {
  Run-Step 'Install Agent Browser CLI globally' { npm.cmd install -g agent-browser }
  Run-Step 'Download browser runtime for Agent Browser' { npx.cmd --yes agent-browser install }
}

# Official Superpowers Codex manual flow: git checkout + Windows junction.
# Alternatively use `/plugins` inside Codex CLI (SkipSuperpowers), not both.
if (-not $SkipSuperpowers) {
  $checkout = Join-Path $HOME '.codex\superpowers'
  $skillsHome = Join-Path $HOME '.agents\skills'
  $junction = Join-Path $skillsHome 'superpowers'
  New-Item -ItemType Directory -Force -Path (Split-Path $checkout -Parent) | Out-Null
  New-Item -ItemType Directory -Force -Path $skillsHome | Out-Null
  if (-not (Test-Path $checkout)) {
    Run-Step 'Clone Superpowers official repository' {
      git.exe clone https://github.com/obra/superpowers.git "$checkout"
    }
  } elseif (-not (Test-Path (Join-Path $checkout 'skills'))) {
    throw "Superpowers checkout path exists but does not contain skills: $checkout"
  } else {
    Write-Host '>> Superpowers checkout already exists; leaving it unchanged.' -ForegroundColor Yellow
  }
  if (-not (Test-Path $junction)) {
    Write-Host '>> Create Superpowers Windows junction' -ForegroundColor Cyan
    New-Item -ItemType Junction -Path $junction -Target (Join-Path $checkout 'skills') | Out-Null
  } else {
    Write-Host '>> Superpowers skill link exists; leaving it unchanged.' -ForegroundColor Yellow
  }
}

Write-Host "`n>> Installed global Codex skills" -ForegroundColor Cyan
& npx.cmd --yes skills list -g -a codex
Write-Host "`n>> Reference checks" -ForegroundColor Cyan
$paths = @(
 'AGENTS.md',
 'reference/MASTER-mobile-approved.png',
 'reference/screens/01-beranda.png',
 'docs/01-DESIGN-SYSTEM.md',
 'docs/02-PRD.md',
 'docs/03-ARCHITECTURE.md',
 '.agents/skills/ui-ux-pro-max/SKILL.md'
)
foreach ($relative in $paths) {
  $exists = Test-Path (Join-Path $projectRoot $relative)
  Write-Host ("{0}  {1}" -f $(if ($exists) {'OK '} else {'MISSING'}), $relative)
  if (-not $exists) { throw "Required file missing: $relative" }
}
Write-Host "`nInstallation commands completed. Restart Codex to refresh its discovered skills." -ForegroundColor Green
Write-Host 'Next: Read docs/04-CODEX-SKILLS-SETUP-WINDOWS.md for image-attached Codex launch command.'
