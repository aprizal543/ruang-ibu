import { AdminApiError } from './adminApi'

export type AdminRole = 'owner' | 'moderator'
export interface AdminSessionUser { id: string; email: string; role: AdminRole; expiresAt: number }
export interface GoogleLoginChallenge { clientId: string; nonce: string; expiresAt: number }

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value) }

async function authRequest<T>(path: string, init: RequestInit = {}, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      ...init,
      credentials: 'same-origin',
      cache: 'no-store',
      signal,
      headers: { Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new AdminApiError(0, 'network_error', 'Sambungan ke layanan pengelola terputus. Coba lagi.')
  }
  let body: unknown
  try { body = await response.json() } catch { body = null }
  if (!response.ok) {
    const error = (body as { error?: { code?: unknown; message?: unknown } } | null)?.error
    throw new AdminApiError(response.status, typeof error?.code === 'string' ? error.code : 'request_failed', typeof error?.message === 'string' ? error.message : 'Permintaan belum dapat diproses.')
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('ruang-ibu:admin-session-activity'))
  const data = (body as { data?: unknown } | null)?.data
  if (!isRecord(data)) throw new AdminApiError(502, 'invalid_response', 'Respons layanan pengelola tidak sesuai format.')
  return data as T
}

function parseUser(value: unknown, expiresAt: unknown): AdminSessionUser {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.email !== 'string' || (value.role !== 'owner' && value.role !== 'moderator')) {
    throw new AdminApiError(502, 'invalid_response', 'Respons sesi pengelola tidak sesuai format.')
  }
  if (typeof expiresAt !== 'number' || !Number.isFinite(expiresAt)) throw new AdminApiError(502, 'invalid_response', 'Waktu sesi pengelola tidak sesuai format.')
  return { id: value.id, email: value.email, role: value.role, expiresAt }
}

export async function getAdminSession(signal?: AbortSignal): Promise<AdminSessionUser> {
  const data = await authRequest<{ authenticated?: unknown; user?: unknown; expiresAt?: unknown }>('/api/auth/session', {}, signal)
  if (data.authenticated !== true) throw new AdminApiError(502, 'invalid_response', 'Respons sesi pengelola tidak sesuai format.')
  return parseUser(data.user, data.expiresAt)
}

export async function getGoogleLoginChallenge(signal?: AbortSignal): Promise<GoogleLoginChallenge> {
  const data = await authRequest<{ clientId?: unknown; nonce?: unknown; expiresAt?: unknown }>('/api/auth/google/challenge', { method: 'POST', body: '{}' }, signal)
  if (typeof data.clientId !== 'string' || !data.clientId.endsWith('.apps.googleusercontent.com')
    || typeof data.nonce !== 'string' || !/^[A-Za-z0-9_-]{43}$/u.test(data.nonce)
    || typeof data.expiresAt !== 'number' || !Number.isFinite(data.expiresAt)) {
    throw new AdminApiError(502, 'invalid_response', 'Tantangan masuk Google tidak sesuai format.')
  }
  return { clientId: data.clientId, nonce: data.nonce, expiresAt: data.expiresAt }
}

export async function loginWithGoogle(credential: string, nonce: string): Promise<AdminSessionUser> {
  const data = await authRequest<{ authenticated?: unknown; user?: unknown; expiresAt?: unknown }>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential, nonce }),
  })
  if (data.authenticated !== true) throw new AdminApiError(502, 'invalid_response', 'Respons masuk Google tidak sesuai format.')
  return parseUser(data.user, data.expiresAt)
}

export async function logoutAdmin(): Promise<void> {
  await authRequest<{ loggedOut?: unknown }>('/api/auth/logout', { method: 'POST', body: '{}' })
}
