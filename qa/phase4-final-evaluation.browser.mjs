import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5174'
const cdpPort = Number(process.env.RUANG_IBU_CDP ?? 9339)
const evidenceDir = 'docs/evidence/phase-4-final-evaluation'
mkdirSync(evidenceDir, { recursive: true })
const sliderEvidenceDir = 'tmp/fidelity/phase-4-slider-positions'
mkdirSync(sliderEvidenceDir, { recursive: true })

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
function sliderValue(id) { return Number(evaluate(`document.getElementById("${id}").value`)) }
function valueText(id) { return evaluate(`document.getElementById("${id}").getAttribute("aria-valuetext")`) }
async function setViewportViaCdp(width, height, { screenshotPath, expression } = {}) {
  // Keep Agent Browser's mouse-coordinate viewport in sync with CDP emulation.
  browser('set', 'viewport', String(width), String(height))
  const targets = await fetch(`http://127.0.0.1:${cdpPort}/json/list`).then((response) => response.json())
  const target = targets.find((item) => item.type === 'page' && item.url.includes('/evaluasi'))
  assert.ok(target, 'Agent Browser has the Evaluation page attached')
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  let nextId = 0
  const pending = new Map()
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    const waiter = pending.get(message.id)
    if (!waiter) return
    pending.delete(message.id)
    message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result)
  })
  const send = (method, params = {}) => {
    const id = ++nextId
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject })
      socket.send(JSON.stringify({ id, method, params }))
    })
  }
  try {
    await send('Emulation.clearDeviceMetricsOverride')
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
    const viewportResult = await send('Runtime.evaluate', { expression: 'JSON.stringify({ innerWidth, innerHeight })', returnByValue: true })
    const viewport = JSON.parse(viewportResult.result.value)
    assert.deepEqual(viewport, { innerWidth: width, innerHeight: height }, `CDP viewport is ${width}x${height}`)
    let value
    if (expression) {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true })
      value = typeof result.result.value === 'string' ? JSON.parse(result.result.value) : result.result.value
    }
    if (screenshotPath) {
      const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false })
      writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'))
    }
    return value
  } finally {
    socket.close()
  }
}

async function assertThumbAt(id, expected) {
  const geometry = await setViewportViaCdp(390, 844, { expression: `JSON.stringify((() => {
    const input = document.getElementById(${JSON.stringify(id)});
    const wrapRect = input.parentElement.getBoundingClientRect();
    const thumbRect = input.parentElement.querySelector('.evaluation-rating__thumb-value').getBoundingClientRect();
    const actual = thumbRect.left + thumbRect.width / 2;
    const target = wrapRect.left + 12 + (wrapRect.width - 24) * Number(input.value) / 10;
    return { actual, target, distance: Math.abs(actual - target), value: Number(input.value) };
  })())` })
  assert.ok(geometry && geometry.value === expected && geometry.distance <= 1.5,
    `${id} thumb should visually sit at ${expected}/10; got ${JSON.stringify(geometry)}`)
}

browser('connect', String(cdpPort))
browser('open', origin + '/evaluasi')
browser('wait', '--load', 'networkidle')
await setViewportViaCdp(390, 844, { screenshotPath: `${evidenceDir}/evaluation-empty-390x844.png` })
assert.equal(browser('get', 'text', 'h1'), 'Bagaimana Perasaan Ibu Hari Ini?')
assert.ok(evaluate('document.body.innerText.includes("Luangkan sejenak untuk mengenali kenyamanan dan rasa cemas yang Ibu rasakan saat ini.")'))
assert.equal(evaluate('document.body.innerText.includes("Jawaban hanya tersimpan sementara dan akan hilang saat halaman dimuat ulang.")'), false)
assert.equal(browser('get', 'text', '.bottom-tabs__item.is-active span'), 'Evaluasi')
assert.equal(evaluate('document.querySelectorAll("input[type=range]").length'), 2)
assert.equal(evaluate('document.querySelectorAll(".evaluation-activity-field, .evaluation-activity-select, .evaluation-progress, [data-step], [data-after-form]").length'), 0)
assert.equal(evaluate('Array.from(document.querySelectorAll("input[type=range]")).every((input) => input.min === "0" && input.max === "10" && input.getAttribute("aria-labelledby") && input.getAttribute("aria-valuetext") === "Belum dinilai" && input.dataset.rated === "false" && input.getBoundingClientRect().height >= 44)'), true)
assert.equal(evaluate('Array.from(document.querySelectorAll(".evaluation-rating output")).every((output) => output.textContent.trim() === "Belum dinilai")'), true)
assert.equal(evaluate('document.querySelector("#evaluation-submit") !== null'), true)
assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true)
evaluate('(() => { window.__riRequests = []; const oldFetch = window.fetch; window.fetch = (...args) => { window.__riRequests.push("fetch"); return oldFetch(...args) }; const oldOpen = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function(...args) { window.__riRequests.push("xhr"); return oldOpen.apply(this, args) }; const oldBeacon = navigator.sendBeacon?.bind(navigator); if (oldBeacon) navigator.sendBeacon = (...args) => { window.__riRequests.push("beacon"); return oldBeacon(...args) }; window.__riStorage = [localStorage.length, sessionStorage.length]; return true })()')

// Validation does not invent default values.
click('#evaluation-submit')
assert.ok(evaluate('document.querySelector("[data-validation]").textContent.includes("Pilih nilai pada kedua skala")'))
assert.equal(valueText('comfort-score'), 'Belum dinilai')
assert.equal(valueText('anxiety-score'), 'Belum dinilai')

// Check the rendered thumb, not just React state or the range value, at both endpoints and midpoint.
for (const id of ['comfort-score', 'anxiety-score']) {
  evaluate(`document.getElementById("${id}").focus()`)
  press('Home')
  assert.equal(sliderValue(id), 0)
  await assertThumbAt(id, 0)
}
await setViewportViaCdp(390, 844, { screenshotPath: `${sliderEvidenceDir}/both-sliders-0-390x844.png` })
for (const id of ['comfort-score', 'anxiety-score']) {
  evaluate(`document.getElementById("${id}").focus()`)
  for (let step = 0; step < 5; step += 1) press('ArrowRight')
  assert.equal(sliderValue(id), 5)
  await assertThumbAt(id, 5)
}
await setViewportViaCdp(390, 844, { screenshotPath: `${sliderEvidenceDir}/both-sliders-5-390x844.png` })
for (const id of ['comfort-score', 'anxiety-score']) {
  evaluate(`document.getElementById("${id}").focus()`)
  press('End')
  assert.equal(sliderValue(id), 10)
  await assertThumbAt(id, 10)
  assert.equal(evaluate(`getComputedStyle(document.getElementById("${id}")).outlineStyle !== "none"`), true, `${id} keeps a visible keyboard focus indicator`)
}
await setViewportViaCdp(390, 844, { screenshotPath: `${sliderEvidenceDir}/both-sliders-10-390x844.png` })

// Keyboard Home/arrow operations work after the visual position checks.
evaluate('document.getElementById("comfort-score").focus()')
press('Home')
assert.equal(sliderValue('comfort-score'), 0)
assert.equal(valueText('comfort-score'), '0 dari 10')
press('ArrowRight')
assert.equal(sliderValue('comfort-score'), 1)
press('Home')
assert.equal(sliderValue('comfort-score'), 0)
browser('click', '#comfort-score')
assert.equal(evaluate('document.getElementById("comfort-score").dataset.rated'), true)
assert.ok(sliderValue('comfort-score') >= 4 && sliderValue('comfort-score') <= 6)
evaluate('document.getElementById("comfort-score").focus()')
press('Home')
assert.equal(sliderValue('comfort-score'), 0)

// The other endpoint is a valid response, and the selected values are visible.
evaluate('document.getElementById("anxiety-score").focus()')
press('End')
assert.equal(sliderValue('anxiety-score'), 10)
assert.equal(valueText('anxiety-score'), '10 dari 10')
await setViewportViaCdp(390, 844, { screenshotPath: `${evidenceDir}/evaluation-filled-390x844.png` })
click('#evaluation-submit')
assert.equal(evaluate('document.querySelector("[data-evaluation-result]") !== null'), true)
assert.ok(evaluate('document.querySelector("[data-evaluation-result]").innerText.includes("Tingkat kenyamanan")'))
assert.ok(evaluate('document.querySelector("[data-evaluation-result]").innerText.includes("0/10")'))
assert.ok(evaluate('document.querySelector("[data-evaluation-result]").innerText.includes("Tingkat kecemasan")'))
assert.ok(evaluate('document.querySelector("[data-evaluation-result]").innerText.includes("10/10")'))
assert.ok(evaluate('document.querySelector("[data-evaluation-result]").innerText.includes("mencerminkan perasaan")'))
assert.ok(evaluate('document.querySelector("[data-evaluation-result]").innerText.includes("bukan diagnosis")'))
assert.equal(evaluate('window.__riRequests.length'), 0)
assert.equal(evaluate('JSON.stringify(window.__riStorage) === JSON.stringify([localStorage.length, sessionStorage.length])'), true)
await setViewportViaCdp(390, 844, { screenshotPath: `${evidenceDir}/evaluation-summary-390x844.png` })

// Reset restores genuinely unselected state and keeps summary values out of the form.
click('[data-reset-evaluation]')
assert.equal(evaluate('document.querySelector("[data-evaluation-result]") === null'), true)
assert.equal(valueText('comfort-score'), 'Belum dinilai')
assert.equal(valueText('anxiety-score'), 'Belum dinilai')
assert.equal(evaluate('document.querySelectorAll("[data-before-score], [data-after-score], [data-score-delta]").length'), 0)

// Reload discards all ephemeral answers.
evaluate('document.getElementById("comfort-score").focus()')
press('End')
browser('open', origin + '/evaluasi')
browser('wait', '--load', 'networkidle')
assert.equal(valueText('comfort-score'), 'Belum dinilai')

for (const [width, height] of [[375, 812], [390, 844], [430, 932]]) {
  const layout = await setViewportViaCdp(width, height, { expression: `JSON.stringify((() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    const nav = document.querySelector('.bottom-tabs').getBoundingClientRect();
    const safety = document.querySelector('.evaluation-page__safety').getBoundingClientRect();
    return {
      activeTab: document.querySelector('.bottom-tabs__item.is-active span').textContent.trim(),
      noOverflow: document.documentElement.scrollWidth === document.documentElement.clientWidth,
      navAtViewportBottom: Math.round(nav.bottom - window.innerHeight) === 0,
      safetyClearance: Math.round(nav.top - safety.bottom),
    };
  })())` })
  assert.equal(layout.activeTab, 'Evaluasi')
  assert.equal(layout.noOverflow, true, `no horizontal overflow at ${width}`)
  assert.equal(layout.navAtViewportBottom, true)
  assert.ok(layout.safetyClearance >= 16, `safety/footer clears navigation at ${width}`)
}

// Approved route smoke regression: the shared fixed tab bar remains present and active on each destination.
for (const [route, activeLabel] of [['/', 'Beranda'], ['/terapi', 'Terapi'], ['/terapi/teknik-pernapasan', 'Terapi'], ['/relaksasi', 'Relaksasi'], ['/hamil', 'Hamil'], ['/bersalin', 'Bersalin']]) {
  browser('open', origin + route)
  browser('wait', '--load', 'networkidle')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `${route} has no overflow`)
  assert.equal(evaluate('document.querySelector(".bottom-tabs") !== null && getComputedStyle(document.querySelector(".bottom-tabs")).position === "fixed"'), true, `${route} keeps fixed navigation`)
  assert.equal(browser('get', 'text', '.bottom-tabs__item.is-active span'), activeLabel, `${route} activates the correct navigation item`)
}

console.log(`Final Evaluation browser QA passed at 375x812, 390x844 and 430x932; evidence saved to ${evidenceDir}`)
