# Local D1 and Pages Functions Setup (Windows 11)

This repository intentionally has no D1 database ID or remote binding in `wrangler.toml`. The file sets Pages output to `dist`; the CLI binding below is local-only and does not create or mutate a Cloudflare resource.

## Prerequisites

- Node.js version supported by the repository (tested locally with Node 22).
- Install packages using `npm.cmd install`.
- Use a disposable local-only identifier for Wrangler's local D1 state; do not copy a remote database ID here.

## Migrate and run

In PowerShell, from the repository root:

```powershell
npm.cmd run build
$localConfig = @'
name = "ruang-ibu-m3-local-test"
compatibility_date = "2026-10-27"
pages_build_output_dir = "./dist"

[[d1_databases]]
binding = "DB"
database_name = "ruang-ibu-m3-local"
database_id = "00000000-0000-0000-0000-000000000002"
'@
New-Item -ItemType Directory -Force -Path .wrangler | Out-Null
$localConfig | Set-Content -LiteralPath .wrangler\local-test.toml -Encoding utf8
npx.cmd wrangler d1 execute ruang-ibu-m3-local --config .wrangler/local-test.toml --local --file migrations/0001_questions.sql
npx.cmd wrangler pages dev dist --d1 "DB=00000000-0000-0000-0000-000000000002" --persist-to .wrangler\.wrangler\state --port 8788
```

The example `00000000-0000-0000-0000-000000000002` is a local-only Wrangler fixture identifier, not a real database ID; the temporary config lives under ignored `.wrangler/`. `pages dev --d1` overrides the binding locally. Run migrations against local only. Idempotent `CREATE TABLE/INDEX IF NOT EXISTS` allows rerunning this initial schema file; future schema changes should use a new numbered migration and a reviewed backup/migration plan. M3 does not schedule the manual retention purge. Before any operator invokes it, inspect due records via the authenticated admin inbox `expiresBefore` filter; the customer retention policy remains pending approval.

Set local secrets in `.dev.vars` (ignored by Git) for POST integration:

```dotenv
TURNSTILE_SECRET_KEY=replace-with-official-local-testing-secret
TURNSTILE_ALLOWED_HOSTNAMES=localhost,127.0.0.1
RATE_LIMIT_HMAC_KEY=replace-with-at-least-32-random-characters
ACCESS_TEAM_DOMAIN=https://example.cloudflareaccess.com
ACCESS_AUD=local-test-only-audience
ADMIN_EMAILS=operator@example.test
```

Use only Cloudflare's official public testing credentials for local Turnstile testing; do not copy a production secret into this file. For automated tests, Turnstile is injected through an in-memory verifier in the test harness; no network challenge is needed. Access JWT tests use a generated ephemeral RSA key and never enable a runtime bypass. Admin routes fail closed if Access config is absent.

Useful local checks:

```powershell
npm.cmd run test:backend
npm.cmd run test:content
npm.cmd run typecheck
npm.cmd run build
```

The backend test suite runs the migration in SQLite through Node's built-in `node:sqlite`, then exercises function handlers and cryptographic Access verification without any Cloudflare account. It complements Wrangler's local D1 runtime smoke check; it does not assert that remote bindings exist.

## Pages routing and PWA

`public/_routes.json` is copied into `dist` and includes only `/api/*` for Functions. Vite's static routes and assets stay on the Pages asset path. Workbox's SPA navigation fallback denies `/api/*`, and API URLs are not part of the precache. Do not add API caching rules.
