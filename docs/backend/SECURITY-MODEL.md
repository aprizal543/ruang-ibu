# Security Model — Google OIDC Admin Authentication (M4.6C)

## Status and scope

M4.6C locally replaces the M4.6A email/password authentication mechanism with Google Identity Services (GIS) OpenID Connect ID-token verification and the existing opaque D1-backed sessions. This is a local implementation, not a release approval. No Google or Cloudflare resource was created; no remote migration, account provisioning, deployment, or Production change was performed. Cloudflare Workers Free hosted CPU and remote JWKS behavior still require separately authorized verification. M4.6A PBKDF2 authentication was not viable on the hosted Free runtime and its password routes are removed.

M5A adds the public article Q&A form and discussion using the existing M3 endpoints and M4 Admin workspace. The M5 UX revision publishes new questions directly only after server-side validation and Turnstile; the existing `approved` database state is used for public unanswered items. Answers remain administrator-authored, and hide/delete controls remain available. Existing schema, audit tables, and owner/moderator policy are reused; evaluation remains ephemeral.

## Local verification (2026-10-27)

- `npm.cmd run test:backend`: 40/40 pass, including signature/claim rejection, nonce replay, unknown/disabled `sub`, role authority, strict same-origin/Fetch Metadata, D1 session/logout, privacy, and unchanged moderation APIs.
- `npm.cmd run test:auth:workerd`: pass with synthetic RSA/JWT data using the production `jose` verifier in local Wrangler/Workerd; valid RS256 verifies and altered signature is rejected. This is local runtime compatibility only.
- Content tests, TypeScript typecheck, Vite/PWA build, admin browser regression, and public route-scroll browser regression pass. The browser suites use synthetic API/GIS fixtures; they do not authenticate with a real Google account or test Cloudflare D1/JWKS/hosted CPU.
- Public browser regression covered all 11 article photos, individual source anchor, relaxation route/audio asset, ephemeral evaluation, six mobile tabs, reduced motion, and runtime errors. Audio asset loading was checked; actual playback was not exercised in this CDP run.
- Build produced a 479.68 kB initial public JS entry and separate admin/login chunks. Workbox generated 73 precache entries; backend regression checks keep admin/API out of offline precache/fallback and exclude MP3.
- `git diff --check` passes. No repository lint script is defined.

These checks do not make Google OIDC Preview-ready. A real Preview Web Client/origin and variables, authorized Preview-only migration/account provisioning, deployed CSP/cookie/JWKS checks, and separately authorized hosted runtime verification remain pending.

## Trust boundaries and authentication flow

1. The browser obtains a short-lived one-use nonce from same-origin `POST /api/auth/google/challenge`. The D1 table stores only its SHA-256 digest and expiry/consumed state. Challenge and login requests require an exact `Origin` match plus `Sec-Fetch-Site: same-origin`; bodies are bounded and reject unknown fields.
2. The official Google Identity Services library renders the provider button. It returns an ID token (`credential`) to a callback in page memory. The browser sends credential and nonce directly to same-origin `POST /api/auth/google`; it never stores the token in Web Storage, URL, D1, cache, or logs.
3. Pages Functions use `jose` with Google's HTTPS JWKS endpoint. Verification is pinned to `RS256` and checks signature/key, issuer (`https://accounts.google.com` or `accounts.google.com`), configured OAuth audience, expiration and maximum token age, `email_verified === true`, subject, and exact nonce. If `azp` is present it must match the client ID; multiple audiences require matching `azp`.
4. The verified `sub` is looked up against a privately provisioned `admin_users.google_sub`. Login does not create accounts and does not trust a client email/role. The internal D1 email and role are authoritative; account must be active. Unknown and disabled accounts receive the same generic denial.
5. A valid identity receives the existing opaque random 256-bit session cookie. D1 stores only its SHA-256 digest. Middleware checks the current active user/role for each `/api/admin/*` request, so disabling an account invalidates existing sessions. Idle timeout is 30 minutes; absolute timeout is 8 hours. Logout revokes the current session.

## Data boundaries

| Data | Storage/access |
|---|---|
| Google client ID | Public non-secret Preview configuration; returned to login page as challenge configuration. |
| Google ID token | Short-lived browser memory and request memory only; never returned, persisted, or logged. |
| Google `sub`, provisioned email, role, active flag | D1 `admin_users`; admin-only. `sub` is the immutable login binding. |
| Nonce | Browser memory; SHA-256 digest and short expiry in D1; consumed once. |
| Session token | Secure HttpOnly cookie in browser; SHA-256 digest only in D1. |
| Rate-limit key | HMAC-SHA256 of server-provided Cloudflare client IP and operation; raw IP is not saved. |
| Auth audit | Minimal action, admin row if known, timestamp, minimal metadata. No token, nonce, sub, email, raw IP, or request body. |
| Q&A private fields | Admin-only; public API returns only moderator-approved public text and answer. |

## Controls

- No public registration, password login, password reset, or default account remains. First owner and moderators are provisioned by a private operator procedure, never by successful Google login. Operator independently verifies `sub` and binds it to an already authorized person. The included script is pinned to the reviewed Preview staging target. The latest read-only staging check finds one active Owner and one linked `user_created` event; no identity fields were retrieved. Earlier empty results came from a primary read of the same target, so the intervening state change remains unknown. Do not provision another Owner. The current Preview deployment is older than this authentication implementation and is not release-ready.
- D1 migration `0002_admin_auth.sql` replaces only the not-yet-remotely-applied auth schema; `0001_questions.sql` is unchanged. `google_sub` is unique and required, roles are constrained, sessions/nonces/throttle/audit are indexed, and foreign keys remain enforced.
- Login challenges and failed OIDC requests are throttled with D1 counters keyed by `ADMIN_AUTH_HMAC_KEY` HMAC buckets. The HMAC key has a minimum of 32 bytes and no fixed fallback. CF-Connecting-IP is accepted only at the Cloudflare Worker boundary; local test fixtures use synthetic values.
- Mutating auth and admin routes require exact Origin and `Sec-Fetch-Site: same-origin`. Session cookies use `__Host-`, Secure, HttpOnly, SameSite=Strict and Path=/.
- All auth/admin/error responses are no-store. Workbox excludes `/admin`, `/api/*`, and admin chunks from offline fallback/precache. User input is rendered as React text; no raw HTML rendering was introduced.
- Google ID-token validity is short (max 5 minutes). JWKS is fetched over HTTPS and cached by `jose` to support key rotation. Network/JWKS errors fail closed.
- CSP in `public/_headers` allows the GIS client and required Google endpoints plus Cloudflare Turnstile script/frame/connect endpoints; it disallows objects and all framing. This header must be verified on the eventual Cloudflare Preview host, since Vite dev does not enforce Pages `_headers`.
- Public Q&A text and administrator answers are rendered as React text nodes. The form does not collect email or persist form state in Web Storage. A new question becomes public only after exact same-origin, input/PII/link/spam checks, D1 HMAC rate limit, consent, bounded payload, allowlisted article slug, and server-verified Turnstile action/hostname all pass; it is then stored directly as an unanswered public question. Missing site key, secret, hostname allowlist, HMAC key, or D1 fails closed. Existing legacy `pending` records remain private unless an administrator manually reviews their public text and publishes them together with an answer.
- `jose` uses WebCrypto RSA verification. A synthetic local Wrangler/workerd harness verifies RS256 and rejects a forged signature using the exact production verifier. This proves local runtime API compatibility only, not hosted CPU quota or production JWKS connectivity.

## Threat model / remaining risk

| Threat | Mitigation | Remaining limitation |
|---|---|---|
| Forged, expired, wrong-audience or wrong-issuer token | `jose` signature, algorithm, issuer, audience, expiry/max-age validation | Hosted Preview validation and actual OAuth client are pending. |
| Token replay | Signed nonce must equal a short-lived one-use D1 challenge; atomic consumed update | D1 availability required; XSS could read an in-flight challenge/token from page memory. Keep CSP and dependencies reviewed. |
| Unknown/disabled account or role escalation | Match verified `sub` to active D1 row; role from D1; no auto-provision | Private provisioning identity verification remains an operator responsibility. |
| Login CSRF / cross-origin mutation | Exact Origin, Fetch Metadata, JSON content type/body limits, SameSite=Strict cookie | Test through real Pages hostname and browser; proxy/header behavior must be checked. |
| Brute force/challenge abuse | HMAC-keyed D1 per-IP counters, bounded body, generic denial | D1-based distributed rate limiting is approximate under concurrent/global requests. |
| Session theft/fixation | New random token after OIDC, digest-only storage, `__Host-` Secure HttpOnly cookie, strict expiry/revocation | HTTPS/browser deployment and cookie behavior still need Preview verification. |
| Sensitive logging/caching | No-store, minimal audit, no request-body logs, service-worker exclusions | Verify deployed edge headers and Cache Storage after Preview setup. |
| Google/JWKS outage or key rotation | Remote JWKS cache with bounded timeout/cooldown; fail closed | Login depends on Google and outbound JWKS availability. |
| Free plan CPU exhaustion | Local workerd verification is measured, no password KDF remains | Hosted invocation CPU/outcome has not been measured. No Preview/release readiness until separately authorized test. |

## Release and recovery gates

Before Preview use: provision a Preview Google OAuth Web Client ID with exact authorized JavaScript origins; set `GOOGLE_OAUTH_CLIENT_ID`, Preview D1 `DB`, and a random server-only `ADMIN_AUTH_HMAC_KEY`; apply migration 0002 to Preview only after separate authorization; privately provision the first owner `sub`; verify edge headers, cookies, Google callback, JWKS, Free CPU/outcome, moderation, and public regression. Do not use Production D1 or a real user for synthetic tests.

Before Production: separately review the Production D1/environment, Google OAuth client/origin, HMAC key, backup/restore, owner recovery, privacy/retention policy, access policy and hosted runtime. Do not infer Production readiness from local tests or Preview. No credentials belong in Git, chat, command-line arguments, client `VITE_*` variables, or screenshots.

If an account is compromised, an authorized owner disables it and revokes its D1 sessions; investigate minimal audit records, rotate the HMAC secret if appropriate, and re-provision the verified Google subject through a reviewed private procedure. No password recovery is applicable. Do not run retention purge until customer approval.
