import type { Env } from './types'

export interface TurnstileResult {
  success: boolean
  action?: string
  hostname?: string
}

export type TurnstileVerifier = (token: string, env: Env) => Promise<TurnstileResult>

export async function verifyTurnstileToken(token: string, env: Env): Promise<TurnstileResult> {
  if (!env.TURNSTILE_SECRET_KEY) throw new Error('turnstile_not_configured')
  const allowedHostnames = (env.TURNSTILE_ALLOWED_HOSTNAMES ?? '').split(',').map((host) => host.trim().toLowerCase()).filter(Boolean)
  if (allowedHostnames.length === 0) throw new Error('turnstile_not_configured')

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
      signal: controller.signal,
    })
    if (!response.ok) return { success: false }
    const result = await response.json() as TurnstileResult
    return {
      success: result.success === true
        && result.action === 'ask_question'
        && typeof result.hostname === 'string'
        && allowedHostnames.includes(result.hostname.toLowerCase()),
      action: result.action,
      hostname: result.hostname,
    }
  } catch {
    return { success: false }
  } finally {
    clearTimeout(timeoutId)
  }
}
