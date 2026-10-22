import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
const output = 'tmp/fidelity/phase2_1c'
mkdirSync(output, { recursive: true })

function browser(...args) {
  return execFileSync('agent-browser.cmd', ['--cdp', '9339', ...args], {
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
    shell: true,
    windowsHide: true,
  }).trim()
}

function evaluate(expression) {
  const encoded = Buffer.from(`JSON.stringify(${expression})`, 'utf8').toString('base64')
  return JSON.parse(browser('eval', '-b', encoded))
}

for (const [width, height] of [[375, 812], [390, 844], [430, 932]]) {
  browser('set', 'viewport', String(width), String(height))
  browser('open', `${origin}/terapi/teknik-pernapasan`)
  evaluate("(() => { document.documentElement.style.scrollbarWidth = 'none'; window.scrollTo(0, 0); return true })()")
  browser('screenshot', `${output}/detail-first-${width}x${height}.png`)
  browser('screenshot', '--full', `${output}/detail-full-${width}x${height}.png`)
  evaluate('(() => { window.scrollTo(0, document.documentElement.scrollHeight); return true })()')
  browser('screenshot', `${output}/detail-footer-${width}x${height}.png`)
}

browser('set', 'viewport', '390', '844')
for (const [route, filename] of [
  ['/', 'home-regression-390x844.png'],
  ['/terapi', 'catalog-regression-390x844.png'],
]) {
  browser('open', `${origin}${route}`)
  evaluate("(() => { document.documentElement.style.scrollbarWidth = 'none'; window.scrollTo(0, 0); return true })()")
  browser('screenshot', `${output}/${filename}`)
}

browser('open', `${origin}/terapi/teknik-pernapasan`)
browser('set', 'viewport', '390', '844')
evaluate("(() => { document.documentElement.style.scrollbarWidth = 'none'; return true })()")
browser('scrollintoview', '[data-source-details] summary')
browser('click', '[data-source-details] summary')
browser('scrollintoview', '.therapy-detail__source a')
browser('screenshot', `${output}/detail-sources-open-390x844.png`)

console.log(`Phase 2.1C captures saved under ${output}/.`)
