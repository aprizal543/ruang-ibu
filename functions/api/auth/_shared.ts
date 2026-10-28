import type { AdminIdentity, D1Database, Env } from '../../_shared/types'

export const ABSOLUTE_SESSION_MS = 8 * 60 * 60 * 1000
export const IDLE_SESSION_MS = 30 * 60 * 1000
export const LOGIN_NONCE_TTL_MS = 5 * 60 * 1000
export const SESSION_COOKIE = '__Host-ruang_ibu_session'
export const AUTH_HMAC_MIN_BYTES = 32

const encoder = new TextEncoder()
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_LOCK_MS = 15 * 60 * 1000
const CHALLENGE_LIMIT = 20
const LOGIN_FAILURE_LIMIT = 20

export function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const value of bytes) binary += String.fromCharCode(value)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
}

export function createSessionToken(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(32)))
}

export function createLoginNonce(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(32)))
}

export async function hashSessionToken(token: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(token)))
  return [...digest].map((value) => value.toString(16).padStart(2, '0')).join('')
}

export function getSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie')
  if (!cookieHeader) return null
  for (const item of cookieHeader.split(';')) {
    const separator = item.indexOf('=')
    if (separator < 0 || item.slice(0, separator).trim() !== SESSION_COOKIE) continue
    const value = item.slice(separator + 1).trim()
    return /^[A-Za-z0-9_-]{43}$/u.test(value) ? value : null
  }
  return null
}

export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`
}

export function expiredSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
}

export function appendCookie(response: Response, cookie: string): Response {
  const headers = new Headers(response.headers)
  headers.append('Set-Cookie', cookie)
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

export function authKeyIsConfigured(env: Env): boolean {
  return typeof env.ADMIN_AUTH_HMAC_KEY === 'string' && encoder.encode(env.ADMIN_AUTH_HMAC_KEY).length >= AUTH_HMAC_MIN_BYTES
}

export function googleClientIdIsConfigured(env: Env): boolean {
  return typeof env.GOOGLE_OAUTH_CLIENT_ID === 'string'
    && env.GOOGLE_OAUTH_CLIENT_ID.length <= 256
    && env.GOOGLE_OAUTH_CLIENT_ID.endsWith('.apps.googleusercontent.com')
}

export function hasSameOriginBrowserRequest(request: Request): boolean {
  const origin = request.headers.get('Origin')
  return origin === new URL(request.url).origin && request.headers.get('Sec-Fetch-Site') === 'same-origin'
}

export interface SessionIdentity extends AdminIdentity {
  sessionHash: string
  absoluteExpiresAt: number
}

export async function resolveAdminSession(db: D1Database, token: string, now = Date.now()): Promise<SessionIdentity | null> {
  const hash = await hashSessionToken(token)
  const cutoff = now - IDLE_SESSION_MS
  const active = await db.prepare(`
    SELECT s.session_hash AS sessionHash, s.absolute_expires_at AS absoluteExpiresAt, u.id, u.email, u.role
    FROM admin_sessions s
    JOIN admin_users u ON u.id = s.admin_user_id
    WHERE s.session_hash = ? AND s.revoked_at IS NULL
      AND s.absolute_expires_at > ? AND s.last_seen_at > ? AND u.is_active = 1
  `).bind(hash, now, cutoff).first<{ sessionHash: string; absoluteExpiresAt: number; id: string; email: string; role: 'owner' | 'moderator' }>()
  if (!active) return null

  const touched = await db.prepare(`UPDATE admin_sessions SET last_seen_at = ?
    WHERE session_hash = ? AND revoked_at IS NULL AND absolute_expires_at > ? AND last_seen_at > ?`)
    .bind(now, hash, now, cutoff).run()
  if (touched.meta.changes !== 1) return null
  return { sessionHash: active.sessionHash, absoluteExpiresAt: active.absoluteExpiresAt, id: active.id, email: active.email, role: active.role }
}

export async function makeAuthThrottleKey(secret: string, scope: 'challenge' | 'login', ip: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(`${scope}\0${ip}`)))
  return [...signature].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function isAuthThrottled(db: D1Database, bucketHash: string, now: number): Promise<boolean> {
  const row = await db.prepare('SELECT blocked_until AS blockedUntil FROM admin_login_throttles WHERE bucket_hash = ? AND expires_at > ?')
    .bind(bucketHash, now).first<{ blockedUntil: number | null }>()
  return row?.blockedUntil !== null && row?.blockedUntil !== undefined && row.blockedUntil > now
}

export async function recordAuthAttempt(db: D1Database, bucketHash: string, scope: 'challenge' | 'login', now: number): Promise<void> {
  const limit = scope === 'challenge' ? CHALLENGE_LIMIT : LOGIN_FAILURE_LIMIT
  await db.batch([
    db.prepare('DELETE FROM admin_login_throttles WHERE expires_at <= ?').bind(now),
    db.prepare(`INSERT INTO admin_login_throttles
      (bucket_hash, scope, window_started_at, failure_count, blocked_until, expires_at, updated_at)
      VALUES (?, ?, ?, 1, NULL, ?, ?)
      ON CONFLICT(bucket_hash) DO UPDATE SET
        window_started_at = CASE WHEN ? - admin_login_throttles.window_started_at >= ? THEN ? ELSE admin_login_throttles.window_started_at END,
        failure_count = CASE WHEN ? - admin_login_throttles.window_started_at >= ? THEN 1 ELSE admin_login_throttles.failure_count + 1 END,
        blocked_until = CASE
          WHEN (CASE WHEN ? - admin_login_throttles.window_started_at >= ? THEN 1 ELSE admin_login_throttles.failure_count + 1 END) >= ? THEN ? + ?
          ELSE admin_login_throttles.blocked_until END,
        expires_at = excluded.expires_at,
        updated_at = excluded.updated_at`)
      .bind(bucketHash, scope, now, now + LOGIN_WINDOW_MS * 2, now,
        now, LOGIN_WINDOW_MS, now,
        now, LOGIN_WINDOW_MS,
        now, LOGIN_WINDOW_MS, limit, now, LOGIN_LOCK_MS),
  ])
}

export async function recordGoogleLoginFailure(db: D1Database, bucketHash: string, now: number): Promise<void> {
  await db.batch([
    db.prepare('DELETE FROM admin_login_throttles WHERE expires_at <= ?').bind(now),
    db.prepare(`INSERT INTO admin_login_throttles
      (bucket_hash, scope, window_started_at, failure_count, blocked_until, expires_at, updated_at)
      VALUES (?, 'login', ?, 1, NULL, ?, ?)
      ON CONFLICT(bucket_hash) DO UPDATE SET
        window_started_at = CASE WHEN ? - admin_login_throttles.window_started_at >= ? THEN ? ELSE admin_login_throttles.window_started_at END,
        failure_count = CASE WHEN ? - admin_login_throttles.window_started_at >= ? THEN 1 ELSE admin_login_throttles.failure_count + 1 END,
        blocked_until = CASE
          WHEN (CASE WHEN ? - admin_login_throttles.window_started_at >= ? THEN 1 ELSE admin_login_throttles.failure_count + 1 END) >= ? THEN ? + ?
          ELSE admin_login_throttles.blocked_until END,
        expires_at = excluded.expires_at,
        updated_at = excluded.updated_at`)
      .bind(bucketHash, now, now + LOGIN_WINDOW_MS * 2, now,
        now, LOGIN_WINDOW_MS, now,
        now, LOGIN_WINDOW_MS,
        now, LOGIN_WINDOW_MS, LOGIN_FAILURE_LIMIT, now, LOGIN_LOCK_MS),
    db.prepare(`INSERT INTO admin_auth_events (event_id, admin_user_id, action, created_at, metadata_json)
      VALUES (?, NULL, 'google_login_failure', ?, '{}')`).bind(crypto.randomUUID(), now),
  ])
}

export async function consumeLoginNonce(db: D1Database, nonce: string, now: number): Promise<boolean> {
  const hash = await hashSessionToken(nonce)
  const result = await db.prepare(`UPDATE admin_login_nonces SET consumed_at = ?
    WHERE nonce_hash = ? AND consumed_at IS NULL AND expires_at > ?`).bind(now, hash, now).run()
  return result.meta.changes === 1
}

export async function recordSuccessfulGoogleLogin(
  db: D1Database,
  throttleKeys: string[],
  user: AdminIdentity,
  now = Date.now(),
): Promise<string | null> {
  const token = createSessionToken()
  const hash = await hashSessionToken(token)
  const clearPlaceholders = throttleKeys.map(() => '?').join(', ')
  const statements = [
    ...(clearPlaceholders ? [db.prepare(`DELETE FROM admin_login_throttles WHERE bucket_hash IN (${clearPlaceholders})`).bind(...throttleKeys)] : []),
    db.prepare('UPDATE admin_users SET last_login_at = ?, updated_at = ? WHERE id = ? AND is_active = 1').bind(now, now, user.id),
    db.prepare(`INSERT INTO admin_sessions (session_hash, admin_user_id, created_at, last_seen_at, absolute_expires_at)
      SELECT ?, id, ?, ?, ? FROM admin_users WHERE id = ? AND is_active = 1`)
      .bind(hash, now, now, now + ABSOLUTE_SESSION_MS, user.id),
    db.prepare(`INSERT INTO admin_auth_events (event_id, admin_user_id, action, created_at, metadata_json)
      SELECT ?, id, 'google_login_success', ?, ? FROM admin_users WHERE id = ? AND is_active = 1`)
      .bind(crypto.randomUUID(), now, JSON.stringify({ role: user.role }), user.id),
  ]
  const results = await db.batch(statements)
  return results.at(-2)?.meta.changes === 1 ? token : null
}

export async function recordLogout(db: D1Database, token: string | null, now = Date.now()): Promise<void> {
  if (!token) return
  const hash = await hashSessionToken(token)
  await db.batch([
    db.prepare('UPDATE admin_sessions SET revoked_at = ? WHERE session_hash = ? AND revoked_at IS NULL').bind(now, hash),
    db.prepare(`INSERT INTO admin_auth_events (event_id, admin_user_id, action, created_at, metadata_json)
      SELECT ?, admin_user_id, 'logout', ?, '{}' FROM admin_sessions WHERE session_hash = ? AND revoked_at = ?`)
      .bind(crypto.randomUUID(), now, hash, now),
  ])
}

export function validAdminEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)
}
