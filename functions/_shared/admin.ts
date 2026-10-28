import { apiError, isResponse, readJsonObject, requireAdmin } from './http'
import type { AdminIdentity, PagesContext } from './types'

export function adminContextError(context: PagesContext): Response | undefined {
  const identity = context.data.admin as AdminIdentity | undefined
  return requireAdmin(identity)
}

export function databaseError(context: PagesContext): Response | undefined {
  return context.env.DB ? undefined : apiError(503, 'service_not_configured', 'Layanan pengelola belum tersedia.')
}

export async function readAdminBody(context: PagesContext): Promise<Record<string, unknown> | Response> {
  const value = await readJsonObject(context.request, 8192)
  return isResponse(value) ? value : value
}

export function isApiResponse(value: unknown): value is Response {
  return value instanceof Response
}

export function validId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,80}$/u.test(value)
}

export const DAY_MS = 24 * 60 * 60 * 1000
