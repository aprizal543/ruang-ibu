#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'node:url'
import { getPlatformProxy } from 'wrangler'
import {
  assertProductionD1Target,
  inspectFirstProductionOwner,
  PRODUCTION_D1_TARGET,
  provisionFirstProductionOwner,
} from './production-owner-provisioning.mjs'
import { verifyOwnerIdentityInteractively } from './verify-production-owner-identity.mjs'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const CONFIG_PATH = fileURLToPath(new URL('./production-owner-provisioning.wrangler.toml', import.meta.url))
const WRANGLER_CLI = fileURLToPath(new URL('../../node_modules/wrangler/bin/wrangler.js', import.meta.url))
const EXECUTE_CONFIRMATION = 'CREATE FIRST PRODUCTION OWNER'

export function parseWranglerJsonOutput(output) {
  let payload
  try {
    const text = String(output).replace(/^\uFEFF/u, '').trim()
    payload = JSON.parse(text)
  } catch {
    throw new Error('Cloudflare CLI returned invalid JSON. No database operation is allowed.')
  }
  if (payload?.success === false || (Array.isArray(payload?.errors) && payload.errors.length > 0)) {
    throw new Error('Cloudflare API reported an error. No database operation is allowed.')
  }
  return payload
}

export function createWranglerJsonRunner(runProcess) {
  if (typeof runProcess !== 'function') throw new TypeError('A Wrangler process runner is required.')
  return (args) => {
    let output
    try {
      output = runProcess(args)
    } catch {
      throw new Error('Cloudflare CLI command failed. No database operation is allowed.')
    }
    return parseWranglerJsonOutput(output)
  }
}

export function assertD1InfoMatchesProduction(payload) {
  const queue = [payload]
  while (queue.length > 0) {
    const value = queue.shift()
    if (Array.isArray(value)) {
      queue.push(...value)
    } else if (value && typeof value === 'object') {
      const name = value.name ?? value.database_name
      const databaseId = value.uuid ?? value.database_id ?? value.id
      if (name === PRODUCTION_D1_TARGET.databaseName && databaseId === PRODUCTION_D1_TARGET.databaseId) {
        assertProductionD1Target({ ...PRODUCTION_D1_TARGET, databaseName: name, databaseId })
        return true
      }
      queue.push(...Object.values(value))
    }
  }
  throw new Error('Production D1 metadata mismatch. No database operation is allowed.')
}

const runWranglerJson = createWranglerJsonRunner((args) => execFileSync(process.execPath, [WRANGLER_CLI, ...args], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      timeout: 60_000,
      maxBuffer: 1024 * 1024,
    }))

export function verifyProductionCloudflareTarget() {
  // Passing the fixed account ID makes Wrangler validate the current local
  // identity's membership against that exact account without printing it.
  runWranglerJson(['whoami', '--account', PRODUCTION_D1_TARGET.accountId, '--json'])
  const info = runWranglerJson([
    'd1', 'info', PRODUCTION_D1_TARGET.databaseName,
    '--config', CONFIG_PATH,
    '--json',
  ])
  assertD1InfoMatchesProduction(info)
  return { ...PRODUCTION_D1_TARGET }
}

export async function runProductionOwnerProvisioning({
  mode = 'dry-run',
  emailPrompt,
  confirmationPrompt,
  identityVerifier = verifyOwnerIdentityInteractively,
  targetVerifier = verifyProductionCloudflareTarget,
  platformFactory = getPlatformProxy,
  status = (message) => console.log(message),
} = {}) {
  if (!['dry-run', 'execute'].includes(mode)) throw new Error('Invalid operation mode.')

  const target = await targetVerifier()
  assertProductionD1Target(target)
  let platform
  try {
    platform = await platformFactory({
      configPath: CONFIG_PATH,
      remoteBindings: true,
      persist: false,
    })
  } catch {
    throw new Error('Private remote D1 binding could not be established. No database write was attempted.')
  }

  try {
    let state
    try {
      state = await inspectFirstProductionOwner(platform.env.DB)
    } catch {
      throw new Error('Production D1 aggregate read failed. No Owner write was attempted; stop and reconcile using read-only diagnostics.')
    }
    if (mode === 'dry-run') {
      status(`Read-only preflight: admins=${state.adminCount}, owners=${state.ownerCount}, moderators=${state.moderatorCount}, user-created-events=${state.userCreatedEventCount}, linked-owner-creation-events=${state.ownerCreationEventCount}, first-owner-eligible=${state.canCreateFirstOwner}.`)
      return { mode, ...state }
    }

    if (!state.canCreateFirstOwner) throw new Error('Provisioning stopped: admin database is not empty.')
    const expectedEmail = typeof emailPrompt === 'function' ? await emailPrompt() : emailPrompt
    const verifiedIdentity = await identityVerifier({ expectedEmail })
    status(`Final target confirmation: Cloudflare account ${target.accountId}; D1 ${target.databaseName}, UUID ${target.databaseId}. Current counts are admins=${state.adminCount}, Owners=${state.ownerCount}, Moderators=${state.moderatorCount}. This will create exactly one Owner and one linked user_created audit event. No staging database will be changed.`)
    const confirmation = typeof confirmationPrompt === 'function'
      ? await confirmationPrompt()
      : confirmationPrompt
    if (confirmation !== EXECUTE_CONFIRMATION) {
      throw new Error('Exact Production Owner confirmation is required. No account was created.')
    }

    const result = await provisionFirstProductionOwner(platform.env.DB, {
      email: verifiedIdentity.email,
      googleSub: verifiedIdentity.googleSub,
      confirmation,
    })
    const finalState = await inspectFirstProductionOwner(platform.env.DB)
    if (finalState.adminCount !== 1 || finalState.ownerCount !== 1 || finalState.moderatorCount !== 0
      || finalState.userCreatedEventCount !== 1 || finalState.ownerCreationEventCount !== 1) {
      throw new Error('Provisioning outcome requires read-only reconciliation. Do not retry.')
    }
    status('One Production Owner and its audit event were created; aggregate verification passed. Identity values were not displayed.')
    return { mode, created: result.created, ...finalState }
  } finally {
    await platform.dispose()
  }
}

async function run() {
  const args = process.argv.slice(2)
  if (args.some((arg) => !['--dry-run', '--execute'].includes(arg)) || args.length > 1) {
    throw new Error('Use no flag or --dry-run for read-only preflight, or --execute for the explicitly confirmed operation.')
  }
  const mode = args[0] === '--execute' ? 'execute' : 'dry-run'
  if (mode === 'dry-run') {
    await runProductionOwnerProvisioning({ mode })
    return
  }

  const readline = createInterface({ input: stdin, output: stdout })
  try {
    await runProductionOwnerProvisioning({
      mode,
      emailPrompt: () => readline.question('Email Gmail Owner yang disetujui: ').then((value) => value.trim()),
      confirmationPrompt: () => readline.question(`Ketik tepat ${EXECUTE_CONFIRMATION}: `),
    })
  } finally {
    readline.close()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : 'Production Owner operation stopped safely.')
    process.exitCode = 1
  })
}
