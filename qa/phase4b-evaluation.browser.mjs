import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://localhost:5174'
const evidenceDir = 'docs/evidence/phase-4b-evaluation'
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
function choose(value) { browser('select', '[data-activity-select]', value) }
function ratingValue(selector) { return Number(evaluate(`document.querySelector(${JSON.stringify(selector)}).value`)) }
function ariaValue(selector) { return evaluate(`document.querySelector(${JSON.stringify(selector)}).getAttribute('aria-valuetext')`) }
function stepText(step) { return evaluate(`document.getElementById("evaluation-step-${step}")?.innerText ?? ""`) }

browser('connect', '9339')
browser('set', 'viewport', '390', '844')
browser('open', origin + '/evaluasi')
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'text', 'h1'), 'Bagaimana Perasaan Ibu?')
assert.equal(evaluate('document.querySelectorAll("[data-activity-select] option").length'), 6)
assert.equal(evaluate('document.querySelector("[data-activity-select]").value'), '')
assert.equal(evaluate('document.querySelectorAll("input[type=range]").length'), 2)
assert.equal(evaluate('Array.from(document.querySelectorAll("input[type=range]")).every((input) => input.min === "0" && input.max === "10" && input.getAttribute("aria-label") && input.getAttribute("aria-valuetext") === "Belum dinilai")'), true)
assert.equal(evaluate('Array.from(document.querySelectorAll("[data-rating-adjust]")).every((button) => { const box = button.getBoundingClientRect(); return box.width >= 44 && box.height >= 44 })'), true)
assert.equal(evaluate('document.querySelectorAll(".evaluation-activity-chip").length'), 0)
assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true)
evaluate('(() => { window.__riRequests = []; const oldFetch = window.fetch; window.fetch = (...args) => { window.__riRequests.push("fetch"); return oldFetch(...args) }; const oldOpen = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function(...args) { window.__riRequests.push("xhr"); return oldOpen.apply(this, args) }; const oldBeacon = navigator.sendBeacon?.bind(navigator); if (oldBeacon) navigator.sendBeacon = (...args) => { window.__riRequests.push("beacon"); return oldBeacon(...args) }; window.__riStorage = [localStorage.length, sessionStorage.length]; return true })()')
browser('screenshot', `${evidenceDir}/step-1-empty-390x844.png`)

// Validation keeps the initial answers explicitly empty.
click('[data-next-step="2"]')
assert.match(evaluate('document.querySelector("[data-validation]")?.textContent.trim()'), /lengkapi aktivitas/i)
assert.equal(ariaValue('[data-rating="comfort-before"]'), 'Belum dinilai')

// A blank value is not zero; adjustment buttons give explicit first values and respect bounds.
click('[data-rating-adjust="comfort-before"][data-delta="-1"]')
assert.equal(ratingValue('[data-rating="comfort-before"]'), 0)
assert.equal(ariaValue('[data-rating="comfort-before"]'), '0 dari 10')
click('[data-rating-adjust="comfort-before"][data-delta="-1"]')
assert.equal(ratingValue('[data-rating="comfort-before"]'), 0)
assert.equal(evaluate('document.getElementById("evaluation-comfort-before-decrease").disabled'), true)
choose('music')
click('[data-rating-adjust="anxiety-before"][data-delta="1"]')
assert.equal(ratingValue('[data-rating="anxiety-before"]'), 1)
evaluate('document.getElementById("evaluation-anxiety-before-increase").focus()')
press('Space')
assert.equal(ratingValue('[data-rating="anxiety-before"]'), 2)
evaluate('document.getElementById("evaluation-comfort-before").focus()')
press('End')
assert.equal(ratingValue('[data-rating="comfort-before"]'), 10)
click('[data-rating-adjust="comfort-before"][data-delta="1"]')
assert.equal(ratingValue('[data-rating="comfort-before"]'), 10)
assert.equal(evaluate('document.getElementById("evaluation-comfort-before-increase").disabled'), true)
browser('screenshot', `${evidenceDir}/step-1-filled-390x844.png`)

// Native select is keyboard operable; native range responds to keyboard and pointer.
evaluate('document.querySelector("[data-activity-select]").focus()')
press('ArrowDown')
press('Enter')
assert.ok(['body-relaxation', 'companion-massage', 'none'].includes(evaluate('document.querySelector("[data-activity-select]").value')))
choose('music')
const sliderBox = evaluate('(() => { const r = document.getElementById("evaluation-anxiety-before").getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } })()')
browser('click', '#evaluation-anxiety-before')
assert.equal(evaluate('document.getElementById("evaluation-anxiety-before").dataset.rated'), true)
assert.ok(ratingValue('[data-rating="anxiety-before"]') >= 4 && ratingValue('[data-rating="anxiety-before"]') <= 6)
// Keep an explicit 10 at the end of the initial note.
evaluate('document.getElementById("evaluation-anxiety-before").focus()')
press('End')
assert.equal(ratingValue('[data-rating="anxiety-before"]'), 10)
assert.ok(sliderBox.width > 0)
click('[data-next-step="2"]')
assert.equal(evaluate('document.getElementById("evaluation-step-2") !== null'), true)
assert.equal(evaluate('document.querySelector("[data-after-form]") !== null'), true)
assert.equal(evaluate('document.querySelector("[data-enter-after]") === null'), true)
assert.ok(stepText(2).includes('Seberapa nyaman Ibu setelah aktivitas?'))
assert.ok(stepText(2).includes('Lewati penilaian setelah aktivitas'))
assert.ok(stepText(2).includes('Musik untuk Relaksasi'))
assert.equal(ariaValue('[data-rating="comfort-after"]'), 'Belum dinilai')
assert.equal(ariaValue('[data-rating="anxiety-after"]'), 'Belum dinilai')
browser('screenshot', `${evidenceDir}/step-2-after-activity-390x844.png`)

// Optional relaxation route preserves the current note in SPA memory.
click('[data-relaxation-link]')
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'url'), origin + '/relaksasi')
browser('back')
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'url'), origin + '/evaluasi')
assert.ok(evaluate('document.querySelector(".evaluation-snapshot-preview").innerText.includes("10/10")'))
assert.equal(evaluate('window.__riRequests.length'), 0)
assert.equal(evaluate('JSON.stringify(window.__riStorage) === JSON.stringify([localStorage.length, sessionStorage.length])'), true)

// Skipping produces an initial-only summary, with no invented after values.
click('[data-skip-after]')
assert.equal(evaluate('document.getElementById("evaluation-step-3") !== null'), true)
assert.ok(stepText(3).includes('Penilaian sesudah belum diisi'))
assert.equal(evaluate('document.querySelector("[data-after-score]") === null'), true)

// Reset and fill complete pre/post values, then verify neutral comparisons and endpoints.
click('[data-reset-evaluation]')
choose('breathing')
click('[data-rating-adjust="comfort-before"][data-delta="1"]')
click('[data-rating-adjust="anxiety-before"][data-delta="-1"]')
assert.equal(ratingValue('[data-rating="comfort-before"]'), 1)
assert.equal(ratingValue('[data-rating="anxiety-before"]'), 0)
click('[data-next-step="2"]')
click('[data-rating-adjust="comfort-after"][data-delta="-1"]')
click('[data-rating-adjust="anxiety-after"][data-delta="1"]')
evaluate('document.getElementById("evaluation-comfort-after").focus()')
press('End')
assert.equal(ratingValue('[data-rating="comfort-after"]'), 10)
assert.equal(ratingValue('[data-rating="anxiety-after"]'), 1)
click('[data-next-step="3"]')
assert.ok(stepText(3).includes('1/10'))
assert.ok(stepText(3).includes('10/10'))
assert.ok(stepText(3).includes('Selisih catatan'))
assert.ok(stepText(3).includes('Perubahan angka tidak membuktikan penyebab'))
browser('screenshot', `${evidenceDir}/step-3-summary-390x844.png`)

// A 0 value remains a valid answer, reset clears all state, reload clears memory state.
click('[data-reset-evaluation]')
assert.equal(evaluate('document.querySelector("[data-activity-select]").value'), '')
assert.equal(ariaValue('[data-rating="comfort-before"]'), 'Belum dinilai')
assert.equal(ariaValue('[data-rating="anxiety-before"]'), 'Belum dinilai')
choose('none')
click('[data-rating-adjust="comfort-before"][data-delta="-1"]')
click('[data-rating-adjust="anxiety-before"][data-delta="-1"]')
assert.equal(ratingValue('[data-rating="comfort-before"]'), 0)
assert.equal(ariaValue('[data-rating="comfort-before"]'), '0 dari 10')
assert.equal(evaluate('document.querySelector("[data-activity-select]").value'), 'none')
click('[data-rating-adjust="anxiety-before"][data-delta="1"]')
click('[data-next-step="2"]')
assert.equal(ariaValue('[data-rating="comfort-after"]'), 'Belum dinilai')
assert.equal(ariaValue('[data-rating="anxiety-after"]'), 'Belum dinilai')
browser('open', origin + '/evaluasi')
browser('wait', '--load', 'networkidle')
assert.equal(evaluate('document.querySelector("[data-activity-select]").value'), '')
assert.equal(ariaValue('[data-rating="comfort-before"]'), 'Belum dinilai')

for (const [width, height] of [[375, 812], [390, 844], [430, 932]]) {
  browser('set', 'viewport', String(width), String(height))
  browser('open', origin + '/evaluasi')
  browser('wait', '--load', 'networkidle')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `no overflow at ${width}`)
  assert.equal(browser('get', 'text', '.bottom-tabs__item.is-active span'), 'Evaluasi')
  assert.ok(evaluate('Math.round(document.querySelector(".bottom-tabs").getBoundingClientRect().bottom - window.innerHeight) === 0'))
  choose('music')
  click('[data-rating-adjust="comfort-before"][data-delta="1"]')
  click('[data-rating-adjust="anxiety-before"][data-delta="1"]')
  click('[data-next-step="2"]')
  assert.equal(evaluate('document.querySelector("[data-after-form]") !== null'), true)
  evaluate('window.scrollTo(0, document.documentElement.scrollHeight)')
  assert.ok(evaluate('Math.round(document.querySelector(".bottom-tabs").getBoundingClientRect().top - document.querySelector(".evaluation-page__privacy").getBoundingClientRect().bottom) >= 16'), `footer clears navigation at ${width}`)
}

// Approved route smoke regression.
for (const route of ['/', '/terapi', '/terapi/teknik-pernapasan', '/relaksasi', '/hamil', '/bersalin']) {
  browser('open', origin + route)
  browser('wait', '--load', 'networkidle')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `${route} has no overflow`)
}

console.log(`Phase 4B browser QA passed at 375x812, 390x844 and 430x932; evidence saved to ${evidenceDir}`)
