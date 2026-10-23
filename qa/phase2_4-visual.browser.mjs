import { mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://localhost:5173'
const output = 'tmp/fidelity/phase2_4'
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

const viewports = [[375, 812], [390, 844], [430, 932]]
const articles = [
  ['teknik-pernapasan', '/terapi/teknik-pernapasan'],
  ['terapi-musik', '/terapi/terapi-musik'],
  ['relaksasi-otot-ringan', '/terapi/relaksasi-otot-ringan'],
  ['pijat-pendamping', '/terapi/pijat-pendamping'],
]

for (const [slug, route] of articles) {
  for (const [width, height] of viewports) {
    const size = `${width}x${height}`
    browser('set', 'viewport', String(width), String(height))
    browser('open', `${origin}${route}`)
    browser('eval', '-b', Buffer.from("JSON.stringify((() => { document.documentElement.style.scrollbarWidth = 'none'; window.scrollTo(0, 0); return true })())").toString('base64'))
    browser('screenshot', `${output}/${slug}-first-${size}.png`)
    browser('screenshot', '--full', `${output}/${slug}-full-${size}.png`)
    browser('eval', '-b', Buffer.from('JSON.stringify((() => { window.scrollTo(0, document.documentElement.scrollHeight); return true })())').toString('base64'))
    browser('screenshot', `${output}/${slug}-footer-${size}.png`)
  }
}

for (const [name, route] of [['homepage', '/'], ['catalog', '/terapi']]) {
  for (const [width, height] of viewports) {
    const size = `${width}x${height}`
    browser('set', 'viewport', String(width), String(height))
    browser('open', `${origin}${route}`)
    browser('eval', '-b', Buffer.from("JSON.stringify((() => { document.documentElement.style.scrollbarWidth = 'none'; window.scrollTo(0, 0); return true })())").toString('base64'))
    browser('screenshot', `${output}/${name}-regression-${size}.png`)
  }
}

console.log(`Phase 2.4 visual evidence saved under ${output}/: 36 article captures plus 6 homepage/catalog regression captures.`)
