import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { exportJWK, generateKeyPair, SignJWT } from 'jose'

const root = resolve(import.meta.dirname, '../..')
const wrangler = resolve(root, 'node_modules/wrangler/bin/wrangler.js')
const config = resolve(root, 'qa/workers/wrangler.google-oidc.toml')
const clientId = 'synthetic-workerd-test.apps.googleusercontent.com'
const nonce = 'N'.repeat(43)
const wranglerHome = await mkdtemp(resolve(tmpdir(), 'ruang-ibu-workerd-'))

const portServer = createServer()
await new Promise((resolveListen, rejectListen) => {
  portServer.once('error', rejectListen)
  portServer.listen(0, '127.0.0.1', resolveListen)
})
const port = portServer.address().port
await new Promise((resolveClose, rejectClose) => portServer.close((error) => error ? rejectClose(error) : resolveClose()))

const worker = spawn(process.execPath, [wrangler, 'dev', '--local', '--config', config, '--ip', '127.0.0.1', '--port', String(port), '--log-level', 'error'], {
  cwd: root,
  env: { ...process.env, XDG_CONFIG_HOME: wranglerHome, XDG_CACHE_HOME: wranglerHome },
  windowsHide: true,
  stdio: ['ignore', 'ignore', 'pipe'],
})
let stderr = ''
worker.stderr.setEncoding('utf8')
worker.stderr.on('data', (chunk) => { stderr = `${stderr}${chunk}`.slice(-4000) })

async function waitForWorker() {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    if (worker.exitCode !== null) throw new Error(`Local workerd exited before readiness (code ${worker.exitCode}). ${stderr}`)
    try {
      const response = await fetch(`http://127.0.0.1:${port}/not-found`)
      if (response.status === 404) return
    } catch { /* Wrangler is still starting. */ }
    await delay(250)
  }
  throw new Error(`Timed out waiting for local workerd. ${stderr}`)
}

try {
  await waitForWorker()
  const { privateKey, publicKey } = await generateKeyPair('RS256', { modulusLength: 2048 })
  const jwk = await exportJWK(publicKey)
  jwk.kid = 'synthetic-workerd-key'
  jwk.alg = 'RS256'
  jwk.use = 'sig'
  const now = Math.floor(Date.now() / 1000)
  const credential = await new SignJWT({ email: 'synthetic-admin@example.test', email_verified: true, nonce })
    .setProtectedHeader({ alg: 'RS256', kid: jwk.kid })
    .setIssuer('https://accounts.google.com')
    .setAudience(clientId)
    .setSubject('synthetic-google-subject')
    .setIssuedAt(now)
    .setExpirationTime(now + 120)
    .sign(privateKey)

  const response = await fetch(`http://127.0.0.1:${port}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential, nonce, clientId, jwks: { keys: [jwk] } }),
  })
  assert.equal(response.status, 200, 'workerd WebCrypto verifies a synthetic RS256 OIDC token')
  assert.deepEqual(await response.json(), { verified: true })

  const tokenParts = credential.split('.')
  tokenParts[2] = `${tokenParts[2].startsWith('A') ? 'B' : 'A'}${tokenParts[2].slice(1)}`
  const forged = await fetch(`http://127.0.0.1:${port}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential: tokenParts.join('.'), nonce, clientId, jwks: { keys: [jwk] } }),
  })
  assert.equal(forged.status, 401, 'workerd rejects a token with an invalid signature')
  assert.deepEqual(await forged.json(), { error: 'verification_failed' })
  console.log('PASS: workerd local runtime verifies RS256 signature and rejects forged signature using the production jose verifier.')
} finally {
  worker.kill('SIGTERM')
  await Promise.race([
    new Promise((resolveExit) => worker.once('exit', resolveExit)),
    delay(5_000),
  ])
  await rm(wranglerHome, { recursive: true, force: true })
}
