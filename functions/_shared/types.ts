export type D1Value = string | number | null | ArrayBuffer | Uint8Array

export interface D1Result<T = Record<string, unknown>> {
  results?: T[]
  success: boolean
  meta: { changes: number; [key: string]: unknown }
}

export interface D1PreparedStatement {
  bind(...values: D1Value[]): D1PreparedStatement
  first<T = Record<string, unknown>>(columnName?: string): Promise<T | null>
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>
  run(): Promise<D1Result>
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
}

export interface Env {
  DB?: D1Database
  TURNSTILE_SECRET_KEY?: string
  TURNSTILE_SITE_KEY?: string
  TURNSTILE_ALLOWED_HOSTNAMES?: string
  RATE_LIMIT_HMAC_KEY?: string
  ADMIN_AUTH_HMAC_KEY?: string
  GOOGLE_OAUTH_CLIENT_ID?: string
}

export type AdminRole = 'owner' | 'moderator'

export interface AdminIdentity {
  id: string
  email: string
  role: AdminRole
}

export interface PagesContext<E = Env> {
  request: Request
  env: E
  params: Record<string, string>
  data: Record<string, unknown>
  next: () => Promise<Response>
}

export type PagesFunction<E = Env> = (context: PagesContext<E>) => Response | Promise<Response>
