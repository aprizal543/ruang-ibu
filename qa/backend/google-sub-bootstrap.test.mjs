import assert from 'node:assert/strict'
import { test } from 'node:test'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { createGoogleSubBootstrapHandler } from '../../scripts/admin/verify-google-sub.mjs'
import { listenOwnerBootstrapServer } from '../../scripts/admin/verify-production-owner-identity.mjs'

test('operator bootstrap listener binds IPv6 localhost so localhost:5173 reaches the private runner', async () => {
  const server = createServer((_request, response) => response.end('ok'))
  const listening = once(server, 'listening')
  listenOwnerBootstrapServer(server, 0)
  await listening
  try {
    assert.equal(server.address()?.address, '::1')
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})

async function withServer(handlerFactory, run) {
  let handler
  const server = createServer((request, response) => { void handler(request, response) })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  const origin = `http://127.0.0.1:${address.port}`
  handler = handlerFactory(origin, new URL(origin).host)
  try { await run(origin) }
  finally { await new Promise((resolve) => server.close(resolve)) }
}

test('local bootstrap exposes a one-use nonce and returns verified credential only to its in-memory callback', async () => {
  const verified = []
  const successMessage = 'Google identity verified and owner email matched.'
  await withServer((origin, expectedHost) => createGoogleSubBootstrapHandler({
    clientId: 'synthetic.apps.googleusercontent.com',
    verifyCredential: async (credential, nonce, clientId) => {
      assert.equal(credential, 'header.payload.signature')
      assert.equal(clientId, 'synthetic.apps.googleusercontent.com')
      if (nonce !== 'N'.repeat(43)) throw new Error('invalid nonce')
      return { sub: 'verified-synthetic-subject', email_verified: true }
    },
    createNonce: () => 'N'.repeat(43),
    onVerified: async (claims, credential, nonce) => {
      await new Promise((resolve) => setTimeout(resolve, 20))
      verified.push({ sub: claims.sub, credential, nonce })
    },
    successMessage,
    origin,
    expectedHost,
  }), async (base) => {
    const challenge = await fetch(`${base}/challenge`, { headers: { 'Sec-Fetch-Site': 'same-origin' } })
    assert.equal(challenge.status, 200)
    const { clientId, nonce, successMessage: challengeMessage } = await challenge.json()
    assert.equal(clientId, 'synthetic.apps.googleusercontent.com')
    assert.equal(nonce, 'N'.repeat(43))
    assert.equal(challengeMessage, successMessage)

    const headers = { Origin: base, 'Sec-Fetch-Site': 'same-origin', 'Content-Type': 'application/json' }
    const valid = await fetch(`${base}/verify`, { method: 'POST', headers, body: JSON.stringify({ credential: 'header.payload.signature', nonce }) })
    assert.equal(valid.status, 200)
    assert.deepEqual(await valid.json(), { verified: true })
    assert.deepEqual(verified, [{ sub: 'verified-synthetic-subject', credential: 'header.payload.signature', nonce }])

    const replay = await fetch(`${base}/verify`, { method: 'POST', headers, body: JSON.stringify({ credential: 'header.payload.signature', nonce }) })
    assert.equal(replay.status, 401)
    assert.deepEqual(verified, [{ sub: 'verified-synthetic-subject', credential: 'header.payload.signature', nonce }])
  })
})

test('local bootstrap rejects cross-origin requests and invalid Google credentials without revealing identity', async () => {
  const verified = []
  await withServer((origin, expectedHost) => createGoogleSubBootstrapHandler({
    clientId: 'synthetic.apps.googleusercontent.com',
    verifyCredential: async () => { throw new Error('synthetic invalid signature') },
    createNonce: () => 'A'.repeat(43),
    onVerified: (claims) => verified.push(claims.sub),
    origin,
    expectedHost,
  }), async (base) => {
    const crossOrigin = await fetch(`${base}/verify`, { method: 'POST', headers: { Origin: 'http://evil.example', 'Sec-Fetch-Site': 'cross-site', 'Content-Type': 'application/json' }, body: '{}' })
    assert.equal(crossOrigin.status, 403)

    const crossSiteChallenge = await fetch(`${base}/challenge`, { headers: { 'Sec-Fetch-Site': 'cross-site' } })
    assert.equal(crossSiteChallenge.status, 403)
    const challenge = await fetch(`${base}/challenge`, { headers: { 'Sec-Fetch-Site': 'same-origin' } })
    const { nonce } = await challenge.json()
    const invalid = await fetch(`${base}/verify`, { method: 'POST', headers: { Origin: base, 'Sec-Fetch-Site': 'same-origin', 'Content-Type': 'application/json' }, body: JSON.stringify({ credential: 'invalid.payload.signature', nonce }) })
    assert.equal(invalid.status, 401)
    assert.deepEqual(await invalid.json(), { error: 'verification_failed' })
    assert.deepEqual(verified, [])
  })
})
