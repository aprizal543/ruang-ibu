# Q&A Security and Privacy Model (M3)

## Trust boundaries and stored data

- Visitor browser → same-origin Pages Function: all fields are untrusted. POST requires exact origin, bounded JSON, allowlisted article, normalized text, explicit moderation consent, Turnstile, and a rate limit.
- Pages Function → D1: parameterized statements only. Visitor original name, question and optional email are private moderation data. Pending/rejected/hidden records never appear in public reads.
- Moderator browser → `/api/admin/*`: Cloudflare Access protects the application edge and the Function independently verifies the signed JWT (RS256, issuer, AUD, expiry, required claims), then matches the verified email against server configuration. Request-supplied role/email is ignored.
- Pages Function → Turnstile Siteverify / Access JWKS: fixed Cloudflare endpoints, short timeouts; secrets remain server environment variables.

Public questions expose only a moderator-approved display name/question, publication status/date, and the official answer. Email, original private text, IP, moderator identity, consent timestamp and audit events are excluded. `Cache-Control: no-store` applies to public and admin APIs. Service worker navigation routing excludes `/api/*`; API responses are not precached.

The evaluation feature remains ephemeral in the React application. It is not sent to Pages Functions, D1, analytics or the question API.

## Controls

- **Authentication/authorization:** Access JWT signature via Cloudflare Access JWKS; exact HTTPS issuer, configured AUD, RS256 only, expiry/issued-at checks, and exact server-side admin email allowlist. No custom login, password or static admin token. Missing config fails closed.
- **CSRF/origin:** Exact same-origin `Origin` required for visitor and admin mutations; reject cross-site Fetch Metadata where provided. Admin GETs still require Access JWT.
- **XSS:** Text is normalized and length bounded; APIs return data as JSON and never mark content as trusted HTML. UI rendering must use ordinary React text nodes; no `dangerouslySetInnerHTML` for questions/answers.
- **SQL injection:** D1 prepared statements and bound parameters for all user-controlled values. Dynamic SQL fragments are chosen only from fixed internal status/filter conditions.
- **Turnstile:** Mandatory server Siteverify; hostname and action `ask_question` checked. Five-second timeout; invalid, expired/reused or unavailable verification fails closed. The local API does not have a deployment bypass.
- **Rate limit:** Three POST attempts per HMAC'd `CF-Connecting-IP` per fixed hour, using a secret HMAC key and an expiring D1 row. Raw IP is not stored. This is a coarse per-edge-client limit; concurrent abuse and shared/NAT addresses remain operational limitations. Configure a random secret of at least 32 characters.
- **Abuse/privacy:** No personal medical details requested; moderator must sanitize public fields. No automated diagnosis/answer. Users are told not to send emergency requests. Do not include question content, email, tokens, JWT, secrets or IP in application logs.
- **Pagination/size:** Public limit ≤20, admin ≤50, public submission body ≤8 KiB, admin body ≤8 KiB, and retention batch ≤500 rows.

## Retention proposal

The implemented *unapproved defaults* are: pending 90 days from `created_at`; rejected/hidden 30 days from the moderation action (`moderated_at`); approved 365 days from approval; answered 365 days from answer creation or its latest edit. These defaults are not customer-approved policy and are not legal advice or a claim of statutory compliance.

No scheduled task/cron invokes purge. The only purge route is `POST /api/admin/retention/purge`, behind the same Cloudflare Access middleware and origin checks as all admin mutations. Before invoking it, an authorized moderator can page through `GET /api/admin/questions?expiresBefore=<ISO timestamp>`; the rows include status and expiry. M3 has no dashboard confirmation UI, so an operator must inspect the filtered result and deliberately call the endpoint. M4 should expose this review step before any UI action is added.

Purge deletes up to 500 expired question rows atomically with its count-only audit event. Deleting a question cascades its answer and removes any optional email held on the question. The question therefore disappears from public reads. Earlier moderation events remain as minimal records with `question_id` set to null; the purge event stores actor, time, deleted count and batch ID, but no original text, name or email. A moderator-requested individual deletion preserves a minimal delete event with the random question ID, not visitor content. Rate-limit HMAC rows expire separately after their bounded retention. The customer must approve the duration, audit-retention treatment, and user-facing deletion contact before enabling public collection or scheduling any purge.

## Preview and production isolation

No remote D1 database, binding, Access application, Turnstile secret/site key or production configuration was provisioned in M3. Use distinct D1 databases and Turnstile hostnames for local, Preview and Production. Keep `.dev.vars`, `.env*`, credentials and private keys out of Git. Cloudflare Preview must be independently protected; an absent Access configuration remains fail-closed. Never point local/Preview migrations at Production.

## Threats and residual limits

| Threat | Control | Residual limit |
|---|---|---|
| Spam or automated submissions | Turnstile, strict validation, 3/hour HMAC limit | Distributed or shared-IP abuse may need Cloudflare edge rules later. |
| Private details published | New rows pending; separate original/public fields; human sanitization required | Moderator can still make an error; a review checklist and takedown process are needed. |
| Unauthorized moderation | Access JWT cryptographic verification + email allowlist + same-origin writes | Correct Access app/policy and environment configuration still need operator verification. |
| SQL injection | Prepared D1 statements | Maintain review discipline for future dynamic query changes. |
| Browser cache leaks | no-store, API excluded from SPA navigation and precache | Verify Cloudflare/cache rules when remote Preview is provisioned. |
| Lost/deleted audit context | Audit events and minimal deletion tombstones | D1 backup/restore and audit retention procedures require operator setup. |
| Clinical misinformation in answers | Human response only; no AI or auto-publication; answer disclaimer in public policy needed | M3 does not provide clinical review or a final public Q&A UI. |

Operational logs should contain route, status, and a request correlation ID only; never log payloads or authorization headers. Use Cloudflare platform logging controls with retention reviewed before enabling verbose logs.
