import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://localhost:5174'
const evidenceDir = 'docs/evidence/phase-4a-evaluation'
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

function press(key) { browser('press', key) }
function radio(activity) { click(`[data-activity="${activity}"]`) }
function keyboardRating(selector, keys) {
  evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`)
  for (const key of keys) press(key)
}
function expectRating(selector, value) {
  assert.equal(Number(evaluate(`document.querySelector(${JSON.stringify(selector)}).value`)), value)
}
function stepText(step) {
  const selector = `[data-step="${step}"]`
  return evaluate(`document.querySelector(${JSON.stringify(selector)})?.innerText ?? ""`)
}

browser('connect', '9339')
browser('set', 'viewport', '390', '844')
browser('open', origin + '/evaluasi')
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'text', 'h1'), 'Bagaimana Perasaan Ibu?')
assert.equal(browser('get', 'text', '.bottom-tabs__item.is-active span'), 'Evaluasi')
assert.equal(evaluate('document.querySelectorAll(".evaluation-activity-chip").length'), 5)
assert.equal(evaluate('document.querySelectorAll("input[type=range]").length'), 2)
assert.equal(evaluate('Array.from(document.querySelectorAll("input[type=range]")).every((input) => input.min === "0" && input.max === "10" && input.getAttribute("aria-valuetext") === "Belum dinilai")'), true)
assert.equal(evaluate('Array.from(document.querySelectorAll(".evaluation-activity-chip")).every((chip) => chip.getBoundingClientRect().height >= 44)'), true)
assert.equal(evaluate('Array.from(document.querySelectorAll("input[type=range]")).every((slider) => slider.getBoundingClientRect().height >= 44)'), true)
assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true)

browser('screenshot', `${evidenceDir}/step-1-before-390x844.png`)

// Gentle validation, with no stage advance and no browser-native error bubble.
click('[data-next-step="2"]')
assert.equal(evaluate('document.querySelector("[data-validation]")?.textContent.trim().length > 0'), true)
assert.equal(evaluate('document.querySelector("[data-step=\\\"1\\\"]") !== null'), true)

// Record a deliberately wide range using native keyboard semantics, including both endpoints.
radio('music')
keyboardRating('[data-rating="comfort-before"]', ['Home'])
keyboardRating('[data-rating="anxiety-before"]', ['End'])
expectRating('[data-rating="comfort-before"]', 0)
expectRating('[data-rating="anxiety-before"]', 10)
browser('screenshot', `${evidenceDir}/step-1-scales-filled-390x844.png`)

evaluate('(() => { window.__riRequests = []; const originalFetch = window.fetch; window.fetch = (...args) => { window.__riRequests.push("fetch"); return originalFetch(...args) }; const originalBeacon = navigator.sendBeacon?.bind(navigator); if (originalBeacon) navigator.sendBeacon = (...args) => { window.__riRequests.push("beacon"); return originalBeacon(...args) }; const originalOpen = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function(...args) { window.__riRequests.push("xhr"); return originalOpen.apply(this, args) }; window.__riStorageCounts = [localStorage.length, sessionStorage.length]; return true })()')
click('[data-next-step="2"]')
assert.equal(evaluate('document.querySelector("[data-step=\\\"2\\\"]") !== null'), true)
assert.ok(stepText(2).includes('Setelah Ibu selesai beraktivitas'))
assert.ok(stepText(2).includes('Musik untuk Relaksasi'))

// Leave for audio and return through SPA history; context must retain the unfinished assessment.
click('[data-relaxation-link]')
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'url'), origin + '/relaksasi')
browser('back')
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'url'), origin + '/evaluasi')
assert.equal(evaluate('document.querySelector("[data-step=\\\"2\\\"]") !== null'), true)
assert.ok(stepText(2).includes('Musik untuk Relaksasi'))
assert.ok(stepText(2).includes('0/10'))
assert.ok(stepText(2).includes('10/10'))
assert.equal(evaluate('document.querySelector("[data-relaxation-link]") !== null'), true)

// The initial-only summary contains no invented post-activity values.
click('[data-view-initial-summary]')
assert.equal(evaluate('document.querySelector("[data-step=\\\"3\\\"]") !== null'), true)
assert.ok(stepText(3).includes('Catatan Perasaan Ibu'))
assert.ok(stepText(3).includes('0/10'))
assert.ok(stepText(3).includes('10/10'))
assert.ok(stepText(3).includes('Penilaian sesudah belum diisi'))
assert.equal(evaluate('document.querySelector("[data-after-score]") === null'), true)

// Reset and complete a full pre/post session: comfort rises, anxiety falls.
click('[data-reset-evaluation]')
radio('music')
keyboardRating('[data-rating="comfort-before"]', ['End'])
keyboardRating('[data-rating="anxiety-before"]', ['Home'])
click('[data-next-step="2"]')
click('[data-enter-after]')
assert.equal(evaluate('document.querySelector("[data-after-form]") !== null'), true)
browser('screenshot', `${evidenceDir}/step-2-after-activity-390x844.png`)
keyboardRating('[data-rating="comfort-after"]', ['Home'])
keyboardRating('[data-rating="anxiety-after"]', ['End'])
click('[data-next-step="3"]')
assert.ok(stepText(3).includes('Musik untuk Relaksasi'))
assert.ok(stepText(3).includes('10/10'))
assert.ok(stepText(3).includes('0/10'))
assert.ok(stepText(3).includes('−10'))
assert.ok(stepText(3).includes('+10'))
assert.ok(stepText(3).includes('Perubahan angka tidak membuktikan penyebab atau keberhasilan suatu terapi.'))
assert.equal(evaluate('window.__riRequests.length === 0'), true)
assert.equal(evaluate('JSON.stringify(window.__riStorageCounts) === JSON.stringify([localStorage.length, sessionStorage.length])'), true)
browser('screenshot', `${evidenceDir}/step-3-summary-390x844.png`)

// Equal pre/post scores remain equal, and reset clears every field.
click('[data-reset-evaluation]')
radio('none')
keyboardRating('[data-rating="comfort-before"]', ['Home', 'ArrowRight', 'ArrowRight'])
keyboardRating('[data-rating="anxiety-before"]', ['Home', 'ArrowRight', 'ArrowRight', 'ArrowRight'])
click('[data-next-step="2"]')
click('[data-enter-after]')
keyboardRating('[data-rating="comfort-after"]', ['Home', 'ArrowRight', 'ArrowRight'])
keyboardRating('[data-rating="anxiety-after"]', ['Home', 'ArrowRight', 'ArrowRight', 'ArrowRight'])
click('[data-next-step="3"]')
assert.ok(stepText(3).includes('3/10'))
assert.ok(stepText(3).includes('Tidak ada perubahan angka pada dua catatan ini.'))
click('[data-reset-evaluation]')
assert.equal(evaluate('document.querySelector("[data-step=\\\"1\\\"]") !== null'), true)
assert.equal(evaluate('document.querySelector("[data-activity-input]:checked") === null'), true)
assert.equal(evaluate('Array.from(document.querySelectorAll("[data-rating]")).every((slider) => slider.getAttribute("aria-valuetext") === "Belum dinilai")'), true)

// Refresh is the only expected loss boundary: no persistent browser storage is used.
radio('music')
keyboardRating('[data-rating="comfort-before"]', ['Home'])
keyboardRating('[data-rating="anxiety-before"]', ['End'])
browser('open', origin + '/evaluasi')
browser('wait', '--load', 'networkidle')
assert.equal(evaluate('document.querySelector("[data-step=\\\"1\\\"]") !== null'), true)
assert.equal(evaluate('document.querySelector("[data-activity-input]:checked") === null'), true)
assert.equal(evaluate('Array.from(document.querySelectorAll("[data-rating]")).every((slider) => slider.getAttribute("aria-valuetext") === "Belum dinilai")'), true)

for (const [width, height] of [[375, 812], [390, 844], [430, 932]]) {
  browser('set', 'viewport', String(width), String(height))
  browser('open', origin + '/evaluasi')
  browser('wait', '--load', 'networkidle')
  assert.equal(browser('get', 'text', 'h1'), 'Bagaimana Perasaan Ibu?')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `no horizontal overflow at ${width}`)
  assert.equal(browser('get', 'text', '.bottom-tabs__item.is-active span'), 'Evaluasi')
  assert.ok(evaluate('Math.abs(document.querySelector(".bottom-tabs").getBoundingClientRect().bottom - window.innerHeight) <= 1'), `bottom tabs stay fixed at ${width}`)
  evaluate('window.scrollTo(0, document.documentElement.scrollHeight)')
  assert.ok(evaluate('Math.round(document.querySelector(".bottom-tabs").getBoundingClientRect().top - document.querySelector(".evaluation-page__privacy").getBoundingClientRect().bottom) >= 16'), `footer clears bottom tabs at ${width}`)
}

// Approved route regression smoke; the evaluation-only context/style must not affect them.
for (const route of ['/', '/terapi', '/terapi/teknik-pernapasan', '/relaksasi', '/hamil', '/bersalin']) {
  browser('open', origin + route)
  browser('wait', '--load', 'networkidle')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `${route} has no horizontal overflow`)
}

console.log(`Phase 4A browser QA passed at 375x812, 390x844 and 430x932; evidence saved to ${evidenceDir}`)
