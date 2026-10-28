import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  assertD1InfoMatchesProduction,
  createWranglerJsonRunner,
  parseWranglerJsonOutput,
  runProductionOwnerProvisioning,
} from '../../scripts/admin/provision-production-owner.mjs'

test('Wrangler JSON parser accepts valid JSON output and no identity-bearing data is inspected', () => {
  assert.deepEqual(parseWranglerJsonOutput('{"result":{"name":"ruang-ibu-production","uuid":"2b9c3de9-eafb-4842-a613-27eab7ae7174"}}'), {
    result: { name: 'ruang-ibu-production', uuid: '2b9c3de9-eafb-4842-a613-27eab7ae7174' },
  })
})

test('Wrangler JSON parser rejects malformed output and API error envelopes generically', () => {
  assert.throws(() => parseWranglerJsonOutput('not-json with synthetic-private-marker'), /invalid JSON/u)
  assert.throws(() => parseWranglerJsonOutput('{"success":false,"errors":[{"message":"synthetic-private-marker"}]}'), /API reported an error/u)
})

test('Wrangler JSON runner rejects a failed CLI exit without exposing process output', () => {
  const run = createWranglerJsonRunner(() => {
    const error = new Error('synthetic-private-marker')
    error.status = 1
    throw error
  })
  assert.throws(() => run(['d1', 'info']), (error) => {
    assert.match(error.message, /CLI command failed/u)
    assert.doesNotMatch(error.message, /synthetic-private-marker/u)
    return true
  })
})

test('remote metadata preflight requires the exact Production D1 name and UUID', () => {
  assert.equal(assertD1InfoMatchesProduction({
    result: { name: 'ruang-ibu-production', uuid: '2b9c3de9-eafb-4842-a613-27eab7ae7174' },
  }), true)
  assert.throws(() => assertD1InfoMatchesProduction({
    result: { name: 'ruang-ibu-production', uuid: '125bcaa1-014f-43ad-8600-05e1c4341c76' },
  }), /Production D1 metadata mismatch/u)
  assert.throws(() => assertD1InfoMatchesProduction({
    result: { name: 'ruang-ibu-staging', uuid: '2b9c3de9-eafb-4842-a613-27eab7ae7174' },
  }), /Production D1 metadata mismatch/u)
})

test('local production bootstrap config binds only the fixed Production D1 and defines no public route', () => {
  const config = readFileSync(new URL('../../scripts/admin/production-owner-provisioning.wrangler.toml', import.meta.url), 'utf8')
  assert.match(config, /account_id\s*=\s*"32a9a8d36173f8af3e9f404956e7b7d7"/u)
  assert.match(config, /database_name\s*=\s*"ruang-ibu-production"/u)
  assert.match(config, /database_id\s*=\s*"2b9c3de9-eafb-4842-a613-27eab7ae7174"/u)
  assert.match(config, /remote\s*=\s*true/u)
  assert.doesNotMatch(config, /^routes\s*=|^workers_dev\s*=\s*true|^triggers\s*=/mu)
})

test('operator dry-run performs aggregate reads only, skips unnecessary identity collection, and disposes its proxy', async () => {
  let batches = 0
  let disposed = false
  let status = ''
  const database = {
    prepare() {
      return { bind: () => ({ first: async () => ({ admin_count: 0, owner_count: null, moderator_count: null, user_created_event_count: 0, owner_creation_event_count: 0 }) }) }
    },
    batch() { batches += 1; throw new Error('write must not run during dry-run') },
  }
  const result = await runProductionOwnerProvisioning({
    mode: 'dry-run',
    identityVerifier: async () => { throw new Error('read-only dry-run must not collect identity') },
    targetVerifier: async () => ({ accountId: '32a9a8d36173f8af3e9f404956e7b7d7', databaseName: 'ruang-ibu-production', databaseId: '2b9c3de9-eafb-4842-a613-27eab7ae7174' }),
    platformFactory: async () => ({ env: { DB: database }, dispose: async () => { disposed = true } }),
    status: (message) => { status = message },
  })
  assert.deepEqual(result, {
    mode: 'dry-run',
    adminCount: 0,
    ownerCount: 0,
    moderatorCount: 0,
    userCreatedEventCount: 0,
    ownerCreationEventCount: 0,
    canCreateFirstOwner: true,
  })
  assert.equal(batches, 0)
  assert.equal(disposed, true)
  assert.match(status, /admins=0, owners=0, moderators=0/u)
  assert.doesNotMatch(status, /owner@gmail\.com|verified-sub/u)
})

test('operator target verification completes before any remote D1 binding is opened', async () => {
  let platformOpened = false
  await assert.rejects(runProductionOwnerProvisioning({
    mode: 'dry-run',
    emailPrompt: 'owner@gmail.com',
    identityVerifier: async () => ({ email: 'owner@gmail.com', googleSub: 'verified-sub' }),
    targetVerifier: async () => { throw new Error('wrong account') },
    platformFactory: async () => { platformOpened = true; throw new Error('must not open') },
    status: () => {},
  }), /wrong account/u)
  assert.equal(platformOpened, false)
})

test('operator is not asked to confirm a write when aggregate preflight finds an existing account', async () => {
  let confirmationAsked = false
  let identityCollected = false
  const database = {
    prepare() {
      return { bind: () => ({ first: async () => ({ admin_count: 1, owner_count: 1, moderator_count: 0, user_created_event_count: 1, owner_creation_event_count: 1 }) }) }
    },
    batch() { throw new Error('writes are disallowed before confirmation') },
  }
  await assert.rejects(runProductionOwnerProvisioning({
    mode: 'execute',
    confirmationPrompt: async () => { confirmationAsked = true; return 'CREATE FIRST PRODUCTION OWNER' },
    identityVerifier: async () => { identityCollected = true; return { email: 'owner@gmail.com', googleSub: 'verified-sub' } },
    targetVerifier: async () => ({ accountId: '32a9a8d36173f8af3e9f404956e7b7d7', databaseName: 'ruang-ibu-production', databaseId: '2b9c3de9-eafb-4842-a613-27eab7ae7174' }),
    platformFactory: async () => ({ env: { DB: database }, dispose: async () => {} }),
    status: () => {},
  }), /not empty/u)
  assert.equal(confirmationAsked, false)
  assert.equal(identityCollected, false)
})

test('final operator confirmation names the verified Production target after identity verification', async () => {
  let identityVerified = false
  let statusMessage = ''
  let batches = 0
  const database = {
    prepare() {
      return { bind: () => ({ first: async () => ({ admin_count: 0, owner_count: null, moderator_count: null, user_created_event_count: 0, owner_creation_event_count: 0 }) }) }
    },
    batch() { batches += 1; throw new Error('wrong confirmation must not write') },
  }
  await assert.rejects(runProductionOwnerProvisioning({
    mode: 'execute',
    emailPrompt: async () => 'owner@gmail.com',
    identityVerifier: async ({ expectedEmail }) => {
      assert.equal(expectedEmail, 'owner@gmail.com')
      identityVerified = true
      return { email: 'owner@gmail.com', googleSub: 'verified-sub' }
    },
    confirmationPrompt: async () => {
      assert.equal(identityVerified, true)
      assert.match(statusMessage, /ruang-ibu-production/u)
      assert.match(statusMessage, /2b9c3de9-eafb-4842-a613-27eab7ae7174/u)
      assert.match(statusMessage, /exactly one Owner/u)
      assert.doesNotMatch(statusMessage, /owner@gmail\.com|verified-sub/u)
      return 'not the confirmation phrase'
    },
    targetVerifier: async () => ({
      accountId: '32a9a8d36173f8af3e9f404956e7b7d7',
      databaseName: 'ruang-ibu-production',
      databaseId: '2b9c3de9-eafb-4842-a613-27eab7ae7174',
    }),
    platformFactory: async () => ({ env: { DB: database }, dispose: async () => {} }),
    status: (message) => { statusMessage = message },
  }), /Exact Production Owner confirmation is required/u)
  assert.equal(batches, 0)
})

test('remote aggregate read failure fails closed in dry-run and execute before identity or write', async () => {
  for (const mode of ['dry-run', 'execute']) {
    let identityCalled = false
    let confirmationCalled = false
    let batches = 0
    let disposed = false
    const database = {
      prepare() { return { bind: () => ({ first: async () => { throw new Error('synthetic D1 internal error') } }) } },
      batch() { batches += 1; throw new Error('writes are forbidden') },
    }
    await assert.rejects(runProductionOwnerProvisioning({
      mode,
      identityVerifier: async () => { identityCalled = true; throw new Error('must not be requested') },
      emailPrompt: async () => 'owner@gmail.com',
      confirmationPrompt: async () => { confirmationCalled = true; return 'CREATE FIRST PRODUCTION OWNER' },
      targetVerifier: async () => ({ accountId: '32a9a8d36173f8af3e9f404956e7b7d7', databaseName: 'ruang-ibu-production', databaseId: '2b9c3de9-eafb-4842-a613-27eab7ae7174' }),
      platformFactory: async () => ({ env: { DB: database }, dispose: async () => { disposed = true } }),
      status: () => {},
    }), /aggregate read failed/u)
    assert.equal(identityCalled, false)
    assert.equal(confirmationCalled, false)
    assert.equal(batches, 0)
    assert.equal(disposed, true)
  }
})
