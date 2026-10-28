import type { AdminIdentity } from './types'

const API_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
}

export function jsonResponse(data: unknown, status = 200, headers?: HeadersInit): Response {
  const responseHeaders = new Headers(API_HEADERS)
  new Headers(headers).forEach((value, key) => responseHeaders.set(key, value))
  return new Response(JSON.stringify(data), { status, headers: responseHeaders })
}

export function apiError(status: number, code: string, message: string): Response {
  return jsonResponse({ error: { code, message } }, status)
}

export function hasSameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin')
  if (!origin || origin !== new URL(request.url).origin) return false
  const fetchSite = request.headers.get('Sec-Fetch-Site')
  return !fetchSite || fetchSite === 'same-origin' || fetchSite === 'none'
}

export async function readJsonObject(request: Request, maxBytes: number): Promise<Record<string, unknown> | Response> {
  const declaredLength = Number(request.headers.get('Content-Length') ?? 0)
  if (declaredLength > maxBytes) return apiError(413, 'payload_too_large', 'Ukuran data melebihi batas.')
  if (!request.body) return apiError(400, 'invalid_json', 'Format data tidak valid.')

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) {
        await reader.cancel()
        return apiError(413, 'payload_too_large', 'Ukuran data melebihi batas.')
      }
      chunks.push(value)
    }
  } catch {
    return apiError(400, 'invalid_json', 'Format data tidak valid.')
  }

  try {
    const body = JSON.parse(new TextDecoder().decode(concat(chunks, size))) as unknown
    if (!body || typeof body !== 'object' || Array.isArray(body)) return apiError(400, 'invalid_json', 'Format data tidak valid.')
    return body as Record<string, unknown>
  } catch {
    return apiError(400, 'invalid_json', 'Format data tidak valid.')
  }
}

function concat(chunks: Uint8Array[], size: number): Uint8Array {
  const result = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.byteLength
  }
  return result
}

export function isResponse(value: unknown): value is Response {
  return value instanceof Response
}

export function requireAdmin(identity: AdminIdentity | undefined): Response | undefined {
  return identity ? undefined : apiError(401, 'unauthorized', 'Autentikasi pengelola diperlukan.')
}
