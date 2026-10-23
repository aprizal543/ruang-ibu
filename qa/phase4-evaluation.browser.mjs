import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
const evidenceDir = 'docs/evidence/phase-4-evaluation'
mkdirSync(evidenceDir, { recursive: true })

function browser(...args) {
  return execFileSync('agent-browser.cmd', args, {
    encoding: 'utf8', maxBuffer: 2 * 1024 * 1024, shell: true, windowsHide: true,
  }).trim()
}

function evaluate(expression) {
  const encoded = Buffer.from('JSON.stringify(' + expression + ')', 'utf8').toString('base64')
  let value = JSON.parse(browser('eval', '-b', encoded))
  while (typeof value === 'string' && /^[\[{\"]/.test(value)) {
    try { value = JSON.parse(value) } catch { break }
  }
  if (value === 'true') return true
  if (value === 'false') return false
  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  return value
}

function click(selector) {
  const encoded = Buffer.from(`(() => { document.querySelector(${JSON.stringify(selector)})?.click(); return "ok" })()`, 'utf8').toString('base64')
  browser('eval', '-b', encoded)
}

browser('connect', '9339')
browser('set', 'viewport', '390', '844')
browser('open', origin + '/evaluasi')
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'text', 'h1'), 'Evaluasi Kenyamanan Ibu')
assert.equal(browser('get', 'count', '.bottom-tabs__item.is-active'), '1')
assert.equal(browser('get', 'text', '.bottom-tabs__item.is-active span'), 'Evaluasi')
assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true)
assert.equal(evaluate('document.querySelectorAll("[data-activity]").length'), 5)
assert.equal(evaluate('document.querySelectorAll("[data-rating]").length'), 5)
assert.equal(evaluate('Array.from(document.querySelectorAll(".evaluation-form__activity")).every((el) => el.getBoundingClientRect().height >= 44)'), true)
assert.equal(evaluate('Array.from(document.querySelectorAll(".evaluation-form__scale-option")).every((el) => el.getBoundingClientRect().width >= 44 && el.getBoundingClientRect().height >= 44)'), true)

browser('screenshot', `${evidenceDir}/evaluation-first-390x844.png`)
browser('screenshot', '--full', `${evidenceDir}/evaluation-full-390x844.png`)

// Empty submission must stay on the form and expose a native, associated required-field error.
click('[data-submit]')
assert.equal(evaluate('document.querySelector("[data-assessment-form]").checkValidity()'), false)
assert.equal(evaluate('document.querySelector("[data-result]") === null'), true)

// Native radio controls remain operable by keyboard and announce a checked value.
evaluate('document.querySelector("[data-activity=breathing]").focus()')
browser('press', 'Space')
assert.equal(evaluate('document.querySelector("[data-activity=breathing]").checked'), true)
evaluate('document.querySelector("[data-rating=\\\"4\\\"]").focus()')
browser('press', 'Space')
assert.equal(evaluate('document.querySelector("[data-rating=\\\"4\\\"]").checked'), true)

// Intercept browser submission channels, then ensure an answer only changes in-memory UI state.
evaluate('(() => { window.__riRequests = []; const originalFetch = window.fetch; window.fetch = (...args) => { window.__riRequests.push("fetch"); return originalFetch(...args) }; const originalBeacon = navigator.sendBeacon?.bind(navigator); if (originalBeacon) navigator.sendBeacon = (...args) => { window.__riRequests.push("beacon"); return originalBeacon(...args) }; const originalOpen = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function(...args) { window.__riRequests.push("xhr"); return originalOpen.apply(this, args) }; window.__riStorageCounts = [localStorage.length, sessionStorage.length]; return true })()')
click('[data-activity="breathing"]')
click('[data-rating="4"]')
click('[data-submit]')
assert.equal(evaluate('document.querySelector("[data-result]") !== null'), true)
assert.ok(browser('get', 'text', '[data-result]').includes('Teknik Pernapasan'))
assert.ok(browser('get', 'text', '[data-result]').includes('4 dari 5'))
assert.equal(browser('get', 'text', '[data-result]').includes('4 dari 5 · 4 dari 5'), false)
assert.equal(evaluate('window.__riRequests.length === 0'), true)
assert.equal(evaluate('JSON.stringify(window.__riStorageCounts) === JSON.stringify([localStorage.length, sessionStorage.length])'), true)
assert.ok(evaluate('Math.abs(document.querySelector(".bottom-tabs").getBoundingClientRect().bottom - window.innerHeight) <= 1'), 'fixed bottom tabs remain visible on result')
evaluate('window.scrollTo({ top: 0, behavior: "instant" })')
await new Promise((resolve) => setTimeout(resolve, 200))
browser('screenshot', `${evidenceDir}/evaluation-result-390x844.png`)

// Optional same-session repeat; keep the first rating only in React state.
click('[data-post-assessment]')
assert.equal(browser('get', 'text', 'h1'), 'Evaluasi Kenyamanan Ibu')
click('[data-rating="3"]')
click('[data-submit]')
assert.equal(evaluate('document.querySelector("[data-comparison]") !== null'), true)
assert.equal(evaluate('window.__riRequests.length === 0'), true)
click('[data-reset]')
assert.equal(evaluate('document.querySelector("[data-result]") === null && document.querySelector("[data-assessment-form]") !== null'), true)
assert.equal(evaluate('Array.from(document.querySelectorAll("[data-activity], [data-rating]")).every((radio) => !radio.checked)'), true)

for (const [width, height] of [[375, 812], [390, 844], [430, 932]]) {
  browser('set', 'viewport', String(width), String(height))
  browser('open', origin + '/evaluasi')
  browser('wait', '--load', 'networkidle')
  assert.equal(browser('get', 'text', 'h1'), 'Evaluasi Kenyamanan Ibu')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `no horizontal overflow at ${width}`)
  assert.equal(browser('get', 'count', '.bottom-tabs__item.is-active span'), '1')
  assert.ok(evaluate('Math.abs(document.querySelector(".bottom-tabs").getBoundingClientRect().bottom - window.innerHeight) <= 1'), `bottom tabs stay fixed at ${width}`)
  evaluate('window.scrollTo(0, document.documentElement.scrollHeight)')
  assert.ok(evaluate('Math.round(document.querySelector(".bottom-tabs").getBoundingClientRect().top - document.querySelector(".evaluation-page__privacy").getBoundingClientRect().bottom)') >= 16, `privacy note clears fixed bottom tabs at ${width}`)
}

// Approved route smoke and navigation history regression.
for (const route of ['/', '/terapi', '/terapi/teknik-pernapasan', '/relaksasi', '/hamil', '/bersalin']) {
  browser('open', origin + route)
  browser('wait', '--load', 'networkidle')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `${route} has no horizontal overflow`)
}
browser('open', origin + '/')
browser('wait', '--load', 'networkidle')
click('.bottom-tabs a[href="/evaluasi"]')
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'url'), origin + '/evaluasi')
browser('back')
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'url'), origin + '/')

console.log(`Phase 4 browser QA passed at 375x812, 390x844 and 430x932; evidence saved to ${evidenceDir}`)
