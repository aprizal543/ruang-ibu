import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const routes = JSON.parse(readFileSync(new URL('../../public/_routes.json', import.meta.url), 'utf8')) as {
  version: number
  include: string[]
  exclude: string[]
}
const serviceWorker = readFileSync(new URL('../../src/pwa/service-worker.ts', import.meta.url), 'utf8')
const viteConfig = readFileSync(new URL('../../vite.config.ts', import.meta.url), 'utf8')

test('Pages Functions include only the API route family and leave static routes to assets', () => {
  assert.equal(routes.version, 1)
  assert.deepEqual(routes.include, ['/api/*'])
  assert.deepEqual(routes.exclude, [])
  assert.doesNotMatch(routes.include.join('\n'), /\*\*/u)
})

test('Workbox SPA fallback excludes APIs and the precache allowlist cannot include MP3 or API responses', () => {
  assert.match(serviceWorker, /denylist:\s*\[[^\]]*\^\\\/api\\\//u)
  assert.doesNotMatch(viteConfig, /\.mp3|\/api\//iu)
  assert.match(viteConfig, /globPatterns:\s*\['\*\*\/\*\.\{html,js,css,svg,png,webp,woff2\}'\]/u)
})
