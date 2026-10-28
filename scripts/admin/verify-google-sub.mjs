#!/usr/bin/env node
import { createServer } from 'node:http'
import { randomBytes } from 'node:crypto'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { pathToFileURL } from 'node:url'
import { verifyGoogleCredential } from '../../functions/api/auth/google.ts'

const LOCAL_ORIGIN = 'http://localhost:5173'
const LOCAL_HOST = 'localhost:5173'
const NONCE_TTL_MS = 5 * 60 * 1000
const MAX_BODY_BYTES = 12 * 1024
const CREDENTIAL_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/u
const NONCE_PATTERN = /^[A-Za-z0-9_-]{43}$/u

function send(response, status, body, extraHeaders = {}) {
  response.writeHead(status, {
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  })
  response.end(JSON.stringify(body))
}

function sendText(response, status, body, contentType, extraHeaders = {}) {
  response.writeHead(status, {
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  })
  response.end(body)
}

async function readBoundedJson(request) {
  const contentLength = Number(request.headers['content-length'] ?? 0)
  if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) throw new Error('invalid_body')
  let body = ''
  for await (const chunk of request) {
    body += chunk.toString('utf8')
    if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) throw new Error('invalid_body')
  }
  const value = JSON.parse(body)
  if (typeof value !== 'object' || value === null || Array.isArray(value)
    || Object.keys(value).length !== 2
    || typeof value.credential !== 'string' || value.credential.length > 10_000 || !CREDENTIAL_PATTERN.test(value.credential)
    || typeof value.nonce !== 'string' || !NONCE_PATTERN.test(value.nonce)) {
    throw new Error('invalid_body')
  }
  return value
}

const page = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Verifikasi Google sub — lokal</title><style>
body{font:16px system-ui,sans-serif;max-width:42rem;margin:3rem auto;padding:0 1rem;color:#183b32;background:#faf7ef}
main{background:#fffdf8;border:1px solid #dfd6c6;border-radius:1rem;padding:2rem}h1{font-size:1.5rem}p{line-height:1.6}
#status{min-height:2rem;color:#8a4938}.note{font-size:.9rem;color:#55675e}
</style><script src="/app.js" defer></script></head><body><main>
<p>Ruang Ibu · Alat lokal operator</p><h1>Verifikasi identitas Google</h1>
<p>Masuk dengan akun Google yang ingin diverifikasi. Server lokal memeriksa signature dan klaim yang diperlukan. Token tidak disimpan atau dicatat; halaman hanya menampilkan status verifikasi.</p>
<div id="google-button"></div><p id="status" role="status" aria-live="polite">Menyiapkan tombol Google…</p>
<p class="note">Gunakan hanya pada komputer tepercaya. Setelah verifikasi, proses lokal akan menampilkan ringkasan target Production dan menunggu konfirmasi terpisah sebelum membuat akun.</p>
</main></body></html>`

const browserScript = `const statusNode=document.querySelector('#status');
function status(text){statusNode.textContent=text}
async function start(){
 try{
  const challengeResponse=await fetch('/challenge',{cache:'no-store'});
  if(!challengeResponse.ok)throw new Error();
  const challenge=await challengeResponse.json();
  await new Promise((resolve,reject)=>{
   const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;script.onload=resolve;script.onerror=reject;document.head.append(script)
  });
  google.accounts.id.initialize({client_id:challenge.clientId,nonce:challenge.nonce,callback:async(result)=>{
   status('Memverifikasi identitas Google…');
   try{
    const response=await fetch('/verify',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({credential:result.credential,nonce:challenge.nonce})});
    const outcome=await response.json();
    if(!response.ok||outcome.verified!==true)throw new Error();
    status(challenge.successMessage);
   }catch{status('Verifikasi gagal. Token tidak diterima untuk provisioning; tutup dan mulai ulang alat lokal.')}
  }});
  google.accounts.id.renderButton(document.querySelector('#google-button'),{type:'standard',theme:'outline',size:'large',shape:'pill',text:'signin_with'});
  status('Pilih akun Google untuk diverifikasi.');
 }catch{status('Google Sign-In tidak dapat dimuat. Tutup alat dan periksa koneksi serta konfigurasi origin.')}
}
void start();`

export function createGoogleSubBootstrapHandler({
  clientId,
  verifyCredential = verifyGoogleCredential,
  createNonce = () => randomBytes(32).toString('base64url'),
  onVerified = () => {},
  now = () => Date.now(),
  origin = LOCAL_ORIGIN,
  expectedHost = LOCAL_HOST,
  successMessage = 'Identitas Google berhasil diverifikasi. Token tidak disimpan.',
} = {}) {
  if (typeof clientId !== 'string' || !clientId.endsWith('.apps.googleusercontent.com')) throw new Error('A valid public Google Web Client ID is required.')
  let pendingChallenge = null

  return async (request, response) => {
    const url = new URL(request.url ?? '/', origin)
    if (request.headers.host !== expectedHost) return send(response, 403, { error: 'origin_not_allowed' })

    if (request.method === 'GET' && url.pathname === '/') {
      return sendText(response, 200, page, 'text/html; charset=utf-8', {
        'Content-Security-Policy': "default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'none'; script-src 'self' https://accounts.google.com/gsi/client; style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style; connect-src 'self' https://accounts.google.com/gsi/; frame-src https://accounts.google.com/gsi/; img-src data: https://*.googleusercontent.com",
        'Referrer-Policy': 'no-referrer',
      })
    }
    if (request.method === 'GET' && url.pathname === '/app.js') {
      return sendText(response, 200, browserScript, 'text/javascript; charset=utf-8', { 'Content-Security-Policy': "default-src 'none'; script-src 'self'" })
    }
    if (request.method === 'GET' && url.pathname === '/challenge') {
      if (request.headers['sec-fetch-site'] !== 'same-origin') return send(response, 403, { error: 'origin_not_allowed' })
      const nonce = createNonce()
      if (typeof nonce !== 'string' || !NONCE_PATTERN.test(nonce)) return send(response, 500, { error: 'challenge_unavailable' })
      pendingChallenge = { nonce, expiresAt: now() + NONCE_TTL_MS }
      return send(response, 200, { clientId, nonce, expiresAt: pendingChallenge.expiresAt, successMessage })
    }
    if (request.method === 'POST' && url.pathname === '/verify') {
      if (request.headers.origin !== origin || request.headers['sec-fetch-site'] !== 'same-origin') {
        return send(response, 403, { error: 'origin_not_allowed' })
      }
      if (!String(request.headers['content-type'] ?? '').toLowerCase().startsWith('application/json')) {
        return send(response, 415, { error: 'invalid_content_type' })
      }
      let body
      try { body = await readBoundedJson(request) }
      catch { return send(response, 400, { error: 'invalid_request' }) }
      const challenge = pendingChallenge
      if (!challenge || challenge.expiresAt <= now() || challenge.nonce !== body.nonce) {
        return send(response, 401, { error: 'verification_failed' })
      }
      pendingChallenge = null
      try {
        const claims = await verifyCredential(body.credential, challenge.nonce, clientId)
        if (claims.email_verified !== true || typeof claims.sub !== 'string' || !claims.sub) throw new Error('invalid_claims')
        await onVerified(claims, body.credential, challenge.nonce)
        return send(response, 200, { verified: true })
      } catch {
        return send(response, 401, { error: 'verification_failed' })
      }
    }
    return send(response, 404, { error: 'not_found' })
  }
}

async function run() {
  const readline = createInterface({ input: stdin, output: stdout })
  try {
    const clientId = (await readline.question('Google Web Client ID (public): ')).trim()
    if (!clientId.endsWith('.apps.googleusercontent.com') || clientId.length > 256) throw new Error('Client ID format is invalid.')
    const server = createServer(createGoogleSubBootstrapHandler({
      clientId,
      onVerified: (claims) => {
        console.log('Google identity signature and required claims verified. Google sub:')
        console.log(claims.sub)
        console.log('ID token was not written to disk or logged.')
        server.close()
      },
    }))
    server.listen(5173, '127.0.0.1', () => {
      console.log(`Open ${LOCAL_ORIGIN} in a browser and complete Google Sign-In. Press Ctrl+C to stop.`)
    })
    await new Promise((resolve, reject) => {
      server.once('close', resolve)
      server.once('error', reject)
      process.once('SIGINT', () => server.close())
    })
  } finally {
    readline.close()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : 'Local Google subject verification failed.')
    process.exitCode = 1
  })
}
