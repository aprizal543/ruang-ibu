import { createLocalJWKSet } from 'jose'
import { verifyGoogleCredential } from '../../functions/api/auth/google'

interface SyntheticVerificationRequest {
  credential?: unknown
  nonce?: unknown
  clientId?: unknown
  jwks?: unknown
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/verify') {
      return Response.json({ error: 'not_found' }, { status: 404 })
    }
    try {
      const body = await request.json() as SyntheticVerificationRequest
      if (typeof body.credential !== 'string' || typeof body.nonce !== 'string'
        || typeof body.clientId !== 'string' || !body.jwks || typeof body.jwks !== 'object') {
        return Response.json({ error: 'invalid_test_input' }, { status: 400 })
      }
      const keySet = createLocalJWKSet(body.jwks as Parameters<typeof createLocalJWKSet>[0])
      await verifyGoogleCredential(body.credential, body.nonce, body.clientId, keySet)
      return Response.json({ verified: true })
    } catch {
      return Response.json({ error: 'verification_failed' }, { status: 401 })
    }
  },
}
