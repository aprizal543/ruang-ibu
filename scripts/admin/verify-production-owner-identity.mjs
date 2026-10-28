#!/usr/bin/env node
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { pathToFileURL } from 'node:url'
import { verifyGoogleCredential } from '../../functions/api/auth/google.ts'
import { createGoogleSubBootstrapHandler } from './verify-google-sub.mjs'
import { verifyProductionOwnerIdentity } from './production-owner-provisioning.mjs'

const QA_CONFIG_PATH = new URL('../../wrangler.admin-qa.toml', import.meta.url)
const LOCAL_ORIGIN = 'http://localhost:5173'
const LOCAL_HOST = 'localhost:5173'
const LOCAL_BIND_HOST = '::1'
const SUCCESS_MESSAGE = 'Akun Google berhasil diverifikasi dan cocok dengan email yang diminta. Tidak ada identitas yang ditampilkan atau disimpan.'

export function listenOwnerBootstrapServer(server, port = 5173, onListening) {
  // Chrome resolves localhost to ::1 on this machine. Binding the bootstrap
  // handler on IPv4 alone lets the unrelated Vite server answer localhost.
  server.listen(port, LOCAL_BIND_HOST, onListening)
}

export function readQaGoogleClientId(configText) {
  const sectionHeader = '[env.preview.vars]'
  const sectionStart = configText.indexOf(sectionHeader)
  if (sectionStart < 0) throw new Error('Preview OAuth client is unavailable.')
  const afterHeader = configText.slice(sectionStart + sectionHeader.length)
  const nextSection = afterHeader.search(/^\s*\[/mu)
  const previewVars = nextSection < 0 ? afterHeader : afterHeader.slice(0, nextSection)
  const match = previewVars.match(/^GOOGLE_OAUTH_CLIENT_ID\s*=\s*"([^"]+)"\s*$/mu)
  const clientId = match?.[1]
  if (!clientId || clientId.length > 256 || !clientId.endsWith('.apps.googleusercontent.com')) {
    throw new Error('Preview OAuth client is unavailable.')
  }
  return clientId
}

export async function verifyOwnerIdentityInteractively({
  expectedEmail,
  configPath = QA_CONFIG_PATH,
  verifyCredential = verifyGoogleCredential,
  status = (message) => console.log(message),
} = {}) {
  const configText = await readFile(configPath, 'utf8')
  const clientId = readQaGoogleClientId(configText)

  return new Promise((resolve, reject) => {
    let verifiedIdentity
    let settled = false
    const server = createServer((request, response) => { void handler(request, response) })
    const handler = createGoogleSubBootstrapHandler({
      clientId,
      origin: LOCAL_ORIGIN,
      expectedHost: LOCAL_HOST,
      successMessage: SUCCESS_MESSAGE,
      verifyCredential,
      onVerified: async (_claims, credential, nonce) => {
        verifiedIdentity = await verifyProductionOwnerIdentity({
          credential,
          nonce,
          clientId,
          expectedEmail,
          verifyCredential,
        })
        server.close()
      },
    })

    server.once('error', () => {
      if (settled) return
      settled = true
      reject(new Error('Local Google identity verifier could not start.'))
    })
    server.once('close', () => {
      if (settled) return
      settled = true
      if (!verifiedIdentity) reject(new Error('Google identity verification did not complete.'))
      else resolve(verifiedIdentity)
    })
    listenOwnerBootstrapServer(server, 5173, () => {
      status(`Open ${LOCAL_ORIGIN} and complete Google Sign-In. Use only the approved Owner account.`)
    })
  })
}

async function run() {
  const readline = createInterface({ input: stdin, output: stdout })
  try {
    const expectedEmail = (await readline.question('Email Gmail Owner yang telah disetujui: ')).trim()
    const identity = await verifyOwnerIdentityInteractively({ expectedEmail })
    // Identity remains process-local and is intentionally never printed or persisted.
    void identity
    console.log('Verifikasi identitas selesai. Tidak ada akun D1 yang dibuat atau data identitas yang disimpan.')
  } finally {
    readline.close()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch(() => {
    console.error('Verifikasi identitas Owner gagal. Tidak ada data identitas yang ditampilkan atau disimpan.')
    process.exitCode = 1
  })
}
