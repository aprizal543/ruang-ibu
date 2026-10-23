import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://localhost:5173'
const output = 'tmp/fidelity/phase2_2a'
mkdirSync(output, { recursive: true })

function browser(...args) {
  return execFileSync('agent-browser.cmd', args, {
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
    shell: true,
    windowsHide: true,
  }).trim()
}

browser('connect', '9339')

const pages = [
  ['music', '/terapi/terapi-musik'],
  ['relaksasi-otot-ringan', '/terapi/relaksasi-otot-ringan'],
  ['pijat-pendamping', '/terapi/pijat-pendamping'],
]
const viewports = [[375, 812], [390, 844], [430, 932]]

for (const [slug, route] of pages) {
  for (const [width, height] of viewports) {
    browser('set', 'viewport', String(width), String(height))
    browser('open', `${origin}${route}`)
    browser('eval', '-b', Buffer.from("JSON.stringify((() => { document.documentElement.style.scrollbarWidth = 'none'; window.scrollTo(0, 0); return true })())").toString('base64'))
    browser('screenshot', `${output}/${slug}-first-${width}x${height}.png`)
    browser('screenshot', '--full', `${output}/${slug}-full-${width}x${height}.png`)
    browser('eval', '-b', Buffer.from('JSON.stringify((() => { window.scrollTo(0, document.documentElement.scrollHeight); return true })())').toString('base64'))
    browser('screenshot', `${output}/${slug}-footer-${width}x${height}.png`)
  }
}

const baselines = [
  ['home', '/', (size) => `docs/evidence/approved-homepage-v1.0/home-phase1.4-first-${size}.png`],
  ['catalog', '/terapi', (size) => `docs/evidence/approved-therapy-v1.0/therapy-${size}.png`],
  ['breathing', '/terapi/teknik-pernapasan', (size) => `docs/evidence/approved-therapy-detail-v1.0/first-${size}.png`],
]

for (const [name, route] of pagesFromBaselines(baselines)) {
  for (const [width, height] of viewports) {
    const size = `${width}x${height}`
    browser('set', 'viewport', String(width), String(height))
    browser('open', `${origin}${route}`)
    browser('eval', '-b', Buffer.from("JSON.stringify((() => { document.documentElement.style.scrollbarWidth = 'none'; window.scrollTo(0, 0); return true })())").toString('base64'))
    browser('screenshot', `${output}/${name}-regression-${size}.png`)
  }
}

function* pagesFromBaselines(items) {
  for (const [name, route] of items) yield [name, route]
}

console.log(`Phase 2.2 screenshots saved under ${output}/ (27 detail captures, 9 regression captures).`)
