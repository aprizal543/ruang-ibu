# Cloudflare Pages Q&A Deployment Runbook (Not Executed in M3)

No Cloudflare resources were provisioned and no remote migration was run. This runbook is a future operator procedure; it does not authorize production changes.

## Provisioning sequence

1. Review API, privacy notice, retention policy, moderator procedures and preview access with the project owner.
2. Create separate Cloudflare D1 databases for Preview and Production. Record the actual IDs in the Cloudflare project configuration/secret manager, not in source placeholders. Keep local separate.
3. Configure Pages D1 binding `DB` independently for Preview and Production. Keep `wrangler.toml` free of invented IDs until real bindings are approved.
4. Apply `migrations/0001_questions.sql` to local first. Back up and review every later migration. Before any production migration, verify account/project/database identity, take/confirm a recoverable backup, apply during a controlled window, and inspect schema. Never pass the production database to a local command.
5. Create Turnstile widgets for the intended Preview and Production hostnames. Configure server secret as `TURNSTILE_SECRET_KEY`, allowed comma-separated exact hostnames as `TURNSTILE_ALLOWED_HOSTNAMES`, and the frontend site key separately when the M5 form is implemented. Never expose the secret in Vite client variables.
6. Configure a random server-side `RATE_LIMIT_HMAC_KEY` of at least 32 characters; rotate with an understood effect on active rate-limit buckets.
7. Create a Cloudflare Access self-hosted application for `/api/admin/*` and restrict its policy to named operators. Configure `ACCESS_TEAM_DOMAIN` to the exact HTTPS team origin and `ACCESS_AUD` from the app's Application Audience (AUD) tag. Add the same approved operator emails to server `ADMIN_EMAILS`.
8. Verify Preview cannot reach Production D1 and that Access protects the admin API even on Preview. Missing Access/Turnstile/D1 config must remain closed.
9. Run migrations against the selected environment explicitly, then smoke test public empty GET, pending POST (test Turnstile only in its designated environment), unauthorized admin 503/401, authorized summary/inbox, moderation, public sanitization, retention and static SPA routes. Confirm responses are `no-store` and API responses never enter service-worker caches.
10. Capture deployment commit SHA, binding environment, migration result, test evidence and rollback owner. Production release requires a separate approved release step; M3 does not perform it.

## Retention operation (manual only)

The 90/30/365-day expiry values are implementation defaults pending customer approval. M3 creates no scheduled purge or cron trigger. After the customer has approved a retention policy, an authorized operator can inspect due rows using the admin inbox `expiresBefore` filter and its pagination, verify the `status` and `expiresAt` values, then deliberately call the Access-protected purge endpoint. Each purge removes at most 500 expired questions, cascades answers and optional emails, excludes them from public reads, and retains non-content audit events. Do not schedule or invoke this operation against Preview or Production before policy and backup/restore procedures are approved.

## Rollback and troubleshooting

- For code rollback, redeploy the last reviewed Pages build without changing Production content unless an independently approved release exists.
- D1 schema rollback is not automatic. Prefer forward-compatible migrations and a tested restore plan; never drop tables as a quick rollback.
- `service_not_configured`: inspect environment-specific D1 binding, Turnstile secret/hostnames and rate HMAC configuration; never add a permissive fallback.
- `admin_auth_not_configured`: verify exact HTTPS team issuer, AUD and server-side allowlist. Do not disable JWT verification or trust a frontend role.
- Turnstile 403: confirm hostname, widget/site key pairing, action `ask_question`, token freshness and single-use behavior.
- Function routing issue: inspect `dist/_routes.json`; it should include `/api/*` without matching every asset. SPA fallback must continue to deny API navigation.
- Local database issue: confirm the Pages dev command uses only the local fixture ID, the binding name is exactly `DB`, and migration target is `--local`.
