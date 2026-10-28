import type { D1Database } from './types'

const WINDOW_MS = 60 * 60 * 1000
export const QUESTION_POSTS_PER_WINDOW = 3

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function consumeQuestionRateLimit(
  database: D1Database,
  ipAddress: string,
  hmacSecret: string,
  nowMs: number,
): Promise<{ allowed: boolean; count: number }> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(hmacSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ipAddress)))
  const keyHash = toHex(digest)
  const windowStart = Math.floor(nowMs / WINDOW_MS) * WINDOW_MS
  const expiresAt = windowStart + WINDOW_MS * 48
  await database.prepare('DELETE FROM question_rate_limits WHERE expires_at <= ?').bind(nowMs).run()
  const result = await database.prepare(`
    INSERT INTO question_rate_limits (key_hash, window_start, request_count, expires_at, updated_at)
    VALUES (?, ?, 1, ?, ?)
    ON CONFLICT(key_hash) DO UPDATE SET
      window_start = CASE WHEN question_rate_limits.window_start = excluded.window_start THEN question_rate_limits.window_start ELSE excluded.window_start END,
      request_count = CASE WHEN question_rate_limits.window_start = excluded.window_start THEN question_rate_limits.request_count + 1 ELSE 1 END,
      expires_at = excluded.expires_at,
      updated_at = excluded.updated_at
    RETURNING request_count
  `).bind(keyHash, windowStart, expiresAt, new Date(nowMs).toISOString()).first<{ request_count: number }>()

  if (!result) throw new Error('rate_limit_write_failed')
  return { allowed: result.request_count <= QUESTION_POSTS_PER_WINDOW, count: result.request_count }
}
