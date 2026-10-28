import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
const cdpOrigin = process.env.RUANG_IBU_CDP_ORIGIN ?? 'http://localhost:9339'
const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms))
const targets = await fetch(`${cdpOrigin}/json/list`).then((response) => response.json())
const target = targets.find((item) => item.type === 'page')
assert.ok(target?.webSocketDebuggerUrl, 'A local Chromium DevTools page is available')
const socket = new WebSocket(target.webSocketDebuggerUrl)
let nextId = 0
const pending = new Map()
const errors = []
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text)
  if (!message.id) return
  const waiter = pending.get(message.id)
  if (!waiter) return
  pending.delete(message.id)
  message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result)
})
await new Promise((resolveSocket, rejectSocket) => {
  socket.addEventListener('open', resolveSocket, { once: true })
  socket.addEventListener('error', rejectSocket, { once: true })
})

function cdp(method, params = {}) {
  const id = ++nextId
  return new Promise((resolveCommand, rejectCommand) => {
    const timeoutMs = method === 'Page.captureScreenshot' ? 25000 : 8000
    const timeout = setTimeout(() => { pending.delete(id); rejectCommand(new Error(`CDP command timed out: ${method}`)) }, timeoutMs)
    pending.set(id, { resolve: (value) => { clearTimeout(timeout); resolveCommand(value) }, reject: (error) => { clearTimeout(timeout); rejectCommand(error) } })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
  return result.result.value
}

const fixture = `(() => {
  const originalFetch = window.fetch.bind(window)
  const now = new Date().toISOString()
  const records = [
    { id: 'synthetic-unanswered-01', articleSlug: 'nyeri-punggung-kehamilan', displayName: 'Ibu Contoh', question: 'Apakah saya bisa membicarakan rasa tidak nyaman ini dengan bidan?', email: null, status: 'approved', publicDisplayName: 'Ibu Contoh', publicQuestion: 'Apakah saya bisa membicarakan rasa tidak nyaman ini dengan bidan?', createdAt: now, updatedAt: now, moderatedAt: null, expiresAt: now, answer: null },
    { id: 'synthetic-answered-02', articleSlug: 'nyeri-persalinan', displayName: 'Pengunjung Uji', question: 'Informasi edukasi tentang pilihan dukungan selama persalinan?', email: null, status: 'answered', publicDisplayName: 'Pengunjung Uji', publicQuestion: 'Informasi edukasi tentang pilihan dukungan selama persalinan?', createdAt: now, updatedAt: now, moderatedAt: now, expiresAt: now, answer: 'Silakan diskusikan pilihan yang sesuai dengan tenaga kesehatan yang mendampingi.', answerUpdatedAt: now },
    { id: 'synthetic-pending-legacy', articleSlug: 'pijat-kehamilan', displayName: 'Nama Uji', question: 'Apakah saya dapat bertanya tentang pilihan pijat kehamilan kepada bidan?', email: null, status: 'pending', publicDisplayName: null, publicQuestion: null, createdAt: now, updatedAt: now, moderatedAt: null, expiresAt: now, answer: null },
  ]
  const json = (data, status = 200) => Promise.resolve(new Response(JSON.stringify({ data }), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }))
  window.__adminFixture = { records, calls: [], mode: 'auth-required', googleOptions: null }
  window.google = { accounts: { id: {
    initialize(options) { window.__adminFixture.googleOptions = options },
    renderButton(parent) {
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = 'Google Sign-In test fixture'
      button.dataset.googleSigninFixture = 'true'
      button.addEventListener('click', () => window.__adminFixture.googleOptions?.callback({ credential: 'synthetic.google.oidc.token' }))
      parent.replaceChildren(button)
    },
  } } }
  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.origin)
    const method = (init.method || 'GET').toUpperCase()
    window.__adminFixture.calls.push({ method, path: url.pathname, search: url.search, body: init.body || null })
    const authUser = { id: 'synthetic-owner', email: 'operator@example.test', role: 'owner', expiresAt: Date.now() + 8 * 60 * 60 * 1000 }
    if (url.pathname === '/api/auth/session' && method === 'GET') {
      if (window.__adminFixture.mode === 'auth-required' || window.__adminFixture.mode === 'unauthorized') return new Response(JSON.stringify({ error: { code: 'unauthorized', message: 'Autentikasi diperlukan.' } }), { status: 401, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
      if (window.__adminFixture.mode === 'auth-unavailable') return new Response(JSON.stringify({ error: { code: 'auth_unavailable', message: 'Backend belum tersedia.' } }), { status: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
      return json({ authenticated: true, user: { id: authUser.id, email: authUser.email, role: authUser.role }, expiresAt: authUser.expiresAt })
    }
    if (url.pathname === '/api/auth/google/challenge' && method === 'POST') return json({ clientId: 'synthetic.apps.googleusercontent.com', nonce: 'A'.repeat(43), expiresAt: Date.now() + 300000 })
    if (url.pathname === '/api/auth/google' && method === 'POST') {
      window.__adminFixture.mode = 'ok'
      return json({ authenticated: true, user: { id: authUser.id, email: authUser.email, role: authUser.role }, expiresAt: authUser.expiresAt })
    }
    if (url.pathname === '/api/auth/logout' && method === 'POST') return json({ loggedOut: true })
    if (!url.pathname.startsWith('/api/admin/')) return originalFetch(input, init)
    if (window.__adminFixture.mode === 'network-error') throw new TypeError('Synthetic network error')
    if (window.__adminFixture.mode === 'unauthorized') return new Response(JSON.stringify({ error: { code: 'unauthorized', message: 'Autentikasi diperlukan.' } }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    if (window.__adminFixture.mode === 'forbidden') return new Response(JSON.stringify({ error: { code: 'forbidden', message: 'Akun tidak diizinkan.' } }), { status: 403, headers: { 'Content-Type': 'application/json' } })
    if (window.__adminFixture.mode === 'unavailable') return new Response(JSON.stringify({ error: { code: 'admin_auth_not_configured', message: 'Backend belum tersedia.' } }), { status: 503, headers: { 'Content-Type': 'application/json' } })
    if (window.__adminFixture.mode === 'conflict' && method === 'POST' && url.pathname.endsWith('/moderation')) return new Response(JSON.stringify({ error: { code: 'invalid_transition', message: 'Status pertanyaan telah berubah.' } }), { status: 409, headers: { 'Content-Type': 'application/json' } })
    if (url.pathname === '/api/admin/summary') return json({ total: 3, pending: 1, approved: 1, answered: 1, rejected: 0, hidden: 0 })
    if (url.pathname === '/api/admin/questions' && method === 'GET') {
      if (window.__adminFixture.mode === 'empty') return json({ questions: [], nextCursor: null })
      const statuses = url.searchParams.get('status')?.split(',')
  const effectiveStatuses = statuses
      const article = url.searchParams.get('articleSlug')
      const questions = records.filter((row) => (!effectiveStatuses || effectiveStatuses.includes(row.status)) && (!article || row.articleSlug === article))
      return json({ questions, nextCursor: url.searchParams.has('cursor') ? null : 'opaque-next-cursor' })
    }
    const questionId = url.pathname.split('/').at(-1)
    const rowForPath = records.find((item) => item.id === questionId || url.pathname.endsWith('/' + item.id + '/moderation') || url.pathname.endsWith('/' + item.id + '/answer'))
    if (rowForPath && url.pathname === '/api/admin/questions/' + rowForPath.id && method === 'GET') return json(rowForPath)
    if (url.pathname.endsWith('/moderation') && method === 'POST') {
      const payload = JSON.parse(init.body || '{}')
      const row = rowForPath
      if (row && payload.action === 'approve') { row.status = 'approved'; row.publicDisplayName = payload.publicDisplayName; row.publicQuestion = payload.publicQuestionText }
      if (row && payload.action === 'reject') row.status = 'rejected'
      if (row && payload.action === 'hide') row.status = 'hidden'
      return json({ id: row?.id, status: row?.status })
    }
    if (url.pathname.endsWith('/answer') && method === 'PUT') {
      if (rowForPath) {
        const payload = JSON.parse(init.body || '{}')
        rowForPath.answer = payload.answer
        rowForPath.status = 'answered'
        rowForPath.answerUpdatedAt = now
        if (payload.publicDisplayName) rowForPath.publicDisplayName = payload.publicDisplayName
        if (payload.publicQuestionText) rowForPath.publicQuestion = payload.publicQuestionText
      }
      return json({ id: rowForPath?.id, status: 'answered', answerUpdatedAt: now })
    }
    const pathParts = url.pathname.split('/')
    if (pathParts.length === 5 && pathParts[1] === 'api' && pathParts[2] === 'admin' && pathParts[3] === 'questions' && method === 'DELETE') return json({ id: pathParts.at(-1), deleted: true })
    return new Response(JSON.stringify({ error: { code: 'not_found', message: 'Not found.' } }), { status: 404, headers: { 'Content-Type': 'application/json' } })
  }
})()`

await cdp('Page.enable')
await cdp('Runtime.enable')
await cdp('Page.navigate', { url: 'about:blank' })
await sleep(120)
await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await cdp('Page.addScriptToEvaluateOnNewDocument', { source: fixture })
await cdp('Page.navigate', { url: `${origin}/admin` })
for (let i = 0; i < 80; i += 1) {
  if (await evaluate('Boolean(document.querySelector("[data-admin-login]"))')) break
  await sleep(100)
}
assert.equal(await evaluate('Boolean(document.querySelector("[data-admin-login]"))'), true, 'Direct admin navigation without a session renders login instead of private dashboard data')
assert.equal(await evaluate('Boolean(document.querySelector("[data-admin-app]"))'), false, 'Unauthenticated route does not render admin shell')
await mkdir(resolve('docs/evidence/m4-admin'), { recursive: true })
await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
await screenshot('admin-login-mobile-390x844')
await evaluate(`window.__adminFixture.mode = 'auth-unavailable'; history.pushState({}, '', '/admin'); dispatchEvent(new PopStateEvent('popstate'))`)
for (let i = 0; i < 60; i += 1) {
  if (await evaluate('Boolean(document.querySelector("[data-admin-auth-error]"))')) break
  await sleep(100)
}
assert.equal(await evaluate('Boolean(document.querySelector("[data-admin-auth-error]"))'), true, 'Unavailable auth backend shows a closed error state')
assert.equal(await evaluate('Boolean(document.querySelector("[data-admin-app]"))'), false, 'Unavailable auth backend exposes no admin data')
await screenshot('admin-auth-unavailable-mobile-390x844')
await evaluate(`window.__adminFixture.mode = 'auth-required'; history.pushState({}, '', '/admin/login'); dispatchEvent(new PopStateEvent('popstate'))`)
for (let i = 0; i < 60; i += 1) {
  if (await evaluate('Boolean(document.querySelector("[data-admin-login]"))')) break
  await sleep(100)
}
assert.equal(await evaluate('Boolean(document.querySelector("[data-admin-login]"))'), true, 'Expired/absent session returns to login')
await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await evaluate(`window.__adminFixture.mode = 'ok'`)
await waitFor('Boolean(document.querySelector("[data-google-signin-fixture]"))', 'Google GIS sign-in control')
await click('[data-google-signin-fixture]')
for (let i = 0; i < 80; i += 1) {
  if (await evaluate('Boolean(document.querySelector("[data-admin-app]"))')) break
  await sleep(150)
}
assert.equal(await evaluate('Boolean(document.querySelector("[data-admin-app]"))'), true, 'Admin route renders the dashboard shell')
assert.equal(await evaluate('window.__adminFixture.calls.some((call) => call.path === "/api/auth/google" && JSON.parse(call.body).credential === "synthetic.google.oidc.token" && JSON.parse(call.body).nonce === "A".repeat(43))'), true, 'Google credential and one-time challenge are posted to the same-origin API in memory')
await evaluate(`document.querySelectorAll('.admin-state--error button').forEach((button) => button.click())`)
async function waitFor(expression, label) {
  for (let i = 0; i < 60; i += 1) {
    if (await evaluate(expression)) return
    await sleep(100)
  }
  const state = await evaluate(`({url:location.href, status:document.querySelector('select[aria-label="Filter status"]')?.value, calls:window.__adminFixture.calls.filter((call)=>call.path==='/api/admin/questions').slice(-8)})`)
  assert.fail(`Timed out waiting for ${label}; state ${JSON.stringify(state)}`)
}
async function click(selector) { await evaluate(`(() => { const el=document.querySelector(${JSON.stringify(selector)}); el?.focus(); el?.click() })()`) }
async function screenshot(name) {
  const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile(resolve(`docs/evidence/m4-admin/${name}.png`), Buffer.from(shot.data, 'base64'))
}
for (let i = 0; i < 50; i += 1) {
  if (await evaluate('Boolean(document.querySelector("[data-admin-stat=total]"))')) break
  await sleep(100)
}
const totalStat = await evaluate('document.querySelector("[data-admin-stat=total]")?.textContent.trim()')
assert.equal(totalStat, '3', `Summary metrics render values from the API fixture (stat=${totalStat}; body=${(await evaluate('document.body.innerText')).slice(0, 600)}; calls=${JSON.stringify(await evaluate('window.__adminFixture?.calls'))})`)
assert.equal(await evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth'), false, 'Desktop dashboard has no horizontal overflow')
await mkdir(resolve('docs/evidence/m4-admin'), { recursive: true })
await screenshot('overview-desktop-1440x900')
console.log('QA: overview desktop')

// Check layout at all requested breakpoints and capture mobile overview.
for (const [width, height] of [[360, 800], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900]]) {
  await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 })
  await sleep(180)
  const overflow = await evaluate(`(() => ({ page: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, inner: innerWidth, elements: [...document.querySelectorAll('*')].filter((el) => el.scrollWidth > el.clientWidth + 1 || el.getBoundingClientRect().left < -1 || el.getBoundingClientRect().right > document.documentElement.clientWidth + 1).slice(0, 12).map((el) => ({ tag: el.tagName, className: typeof el.className === 'string' ? el.className : '', left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right), width: Math.round(el.getBoundingClientRect().width), scroll: el.scrollWidth, client: el.clientWidth })) }))()`)
  assert.equal(overflow.page > overflow.client, false, `Overview has no horizontal overflow at ${width}px: ${JSON.stringify(overflow)}`)
}
await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
await screenshot('overview-mobile-390x844')
console.log('QA: overview mobile')
await click('.admin-menu-trigger')
assert.equal(await evaluate('document.querySelector(".admin-drawer[role=dialog]") !== null'), true, 'Mobile navigation opens as a dialog drawer')
await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
await waitFor('!document.querySelector(".admin-drawer[role=dialog]")', 'drawer to close with Escape')
await sleep(60)
const drawerFocus = await evaluate('({tag: document.activeElement?.tagName, className: document.activeElement?.className, label: document.activeElement?.getAttribute("aria-label")})')
assert.equal(drawerFocus.className?.includes('admin-menu-trigger'), true, `Closing the drawer restores focus to its trigger (${JSON.stringify(drawerFocus)})`)
console.log('QA: drawer keyboard')

// Inbox filters live in the URL and pagination passes the API cursor.
await evaluate(`history.pushState({}, '', '/admin/questions'); dispatchEvent(new PopStateEvent('popstate'))`)
console.log('QA: inbox navigation started')
await waitFor('Boolean(document.querySelector("[data-admin-page=questions]")) && Boolean(document.querySelector(".admin-question-row"))', 'question inbox')
await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await screenshot('questions-inbox-desktop-1440x900')
for (const [width, height] of [[360, 800], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900]]) {
  await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 })
  await sleep(100)
  assert.equal(await evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth'), false, `Question inbox has no horizontal overflow at ${width}px`)
}
await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
await screenshot('questions-inbox-mobile-390x844')
assert.equal(await evaluate(`[...document.querySelectorAll('select[aria-label="Filter status"] option')].some((option) => option.value === 'unanswered')`), true, 'unanswered public filter is available')
assert.equal(await evaluate(`[...document.querySelectorAll('select[aria-label="Filter status"] option')].some((option) => option.value === 'rejected')`), true, 'rejected remains a selectable historical status')
assert.equal(await evaluate(`[...document.querySelectorAll('select[aria-label="Filter status"] option')].some((option) => option.value === 'hidden')`), true, 'hidden remains a selectable historical status')
await waitFor('document.querySelector(".admin-pagination button:last-child")?.disabled === false', 'available next cursor')
await click('.admin-pagination button:last-child')
try {
  await waitFor('window.__adminFixture.calls.some((call) => call.path === "/api/admin/questions" && call.search.includes("cursor=opaque-next-cursor"))', 'cursor pagination request')
} catch (error) {
  const state = await evaluate(`({ url: location.href, buttons: [...document.querySelectorAll('.admin-pagination button')].map((button) => ({ text: button.textContent.trim(), disabled: button.disabled })), calls: window.__adminFixture.calls.filter((call) => call.path === '/api/admin/questions').slice(-5), list: document.querySelector('.admin-question-list')?.innerText })`)
  assert.fail(`${error.message}; pagination state ${JSON.stringify(state)}`)
}
assert.equal(await evaluate('document.querySelector("[data-admin-page=questions]") !== null'), true, 'Inbox pagination remains on the questions page')
console.log('QA: inbox filters and pagination')

// Newly submitted questions are already public; an owner can answer without a separate approval action.
await evaluate(`history.pushState({}, '', '/admin/questions/synthetic-unanswered-01'); dispatchEvent(new PopStateEvent('popstate'))`)
await waitFor('Boolean(document.querySelector("[data-admin-page=question-detail]")) && Boolean(document.querySelector(".admin-answer-panel"))', 'unanswered detail and answer editor')
assert.equal(await evaluate('document.querySelector(".admin-moderation-panel") === null'), true, 'new questions have no separate approval panel')
assert.equal(await evaluate('document.querySelector(".admin-answer-panel")?.textContent.includes("Simpan dan publikasikan jawaban")'), true, 'unanswered question can be answered directly')
for (const [width, height] of [[360, 800], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900]]) {
  await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 })
  await sleep(120)
  assert.equal(await evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth'), false, `Question detail has no horizontal overflow at ${width}px`)
}
await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
await screenshot('unanswered-detail-390x844')
await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
console.log('QA: unanswered question responsive; no separate approval')
await evaluate(`(() => { const field = document.querySelector('.admin-answer-panel textarea'); Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(field,'Bicarakan keluhan dan pilihan dukungan dengan bidan atau dokter yang mendampingi.'); field.dispatchEvent(new Event('input',{bubbles:true})); })()`)
await click('.admin-answer-panel form button[type="submit"]')
await waitFor('window.__adminFixture.calls.some((call) => call.path.endsWith("/answer") && call.method === "PUT" && JSON.parse(call.body).answer.includes("Bicarakan keluhan"))', 'answer API request without approval')
const directAnswerBody = await evaluate('JSON.parse(window.__adminFixture.calls.filter((call) => call.path.endsWith("/answer")).at(-1).body)')
assert.equal(directAnswerBody.publicDisplayName, undefined, 'public question fields are not resent for new questions')
await evaluate(`document.querySelector('.admin-answer-panel')?.scrollIntoView({ block: 'start' })`)
await sleep(120)
await screenshot('answer-editor-desktop-1440x900')

// Legacy pending data is preserved and can be safely published only together with a manually written answer.
await evaluate(`history.pushState({}, '', '/admin/questions/synthetic-pending-legacy'); dispatchEvent(new PopStateEvent('popstate'))`)
await waitFor(`document.querySelector('.admin-answer-panel') !== null && document.querySelector('textarea[maxlength="1000"]') !== null`, 'legacy question and combined publication form')
await evaluate(`(() => { const fields = document.querySelectorAll('.admin-answer-panel input, .admin-answer-panel textarea'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(fields[0],'Ibu Uji'); fields[0].dispatchEvent(new Event('input',{bubbles:true})); Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(fields[1],'Apa yang dapat dibicarakan kepada bidan tentang pijat saat hamil?'); fields[1].dispatchEvent(new Event('input',{bubbles:true})); const answer = document.querySelector('.admin-answer-panel textarea[maxlength="2000"]'); Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(answer,'Tanyakan kepada bidan atau dokter apakah pilihan tersebut sesuai dengan kondisi Ibu.'); answer.dispatchEvent(new Event('input',{bubbles:true})); })()`)
await click('.admin-answer-panel form button[type="submit"]')
await waitFor('window.__adminFixture.calls.some((call) => call.path.endsWith("/answer") && JSON.parse(call.body).publicQuestionText)', 'legacy combined publication request')
const legacyBody = await evaluate('JSON.parse(window.__adminFixture.calls.filter((call) => call.path.endsWith("/answer")).at(-1).body)')
assert.equal(legacyBody.publicDisplayName, 'Ibu Uji')
assert.equal(legacyBody.publicQuestionText, 'Apa yang dapat dibicarakan kepada bidan tentang pijat saat hamil?')
assert.ok(legacyBody.answer, 'legacy question is published with its answer in one action')

// Hide requires confirmation; Escape restores focus without sending a mutation.
await evaluate(`history.pushState({}, '', '/admin/questions/synthetic-pending-legacy'); dispatchEvent(new PopStateEvent('popstate'))`)
await waitFor('document.querySelector(".admin-hide-button") !== null', 'legacy question hide action')
await click('.admin-hide-button')
assert.equal(await evaluate('document.querySelector("[role=alertdialog]") !== null'), true, 'Hide opens a confirmation dialog')
await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
await waitFor('!document.querySelector("[role=alertdialog]")', 'confirmation dialog Escape dismissal')
assert.equal(await evaluate('document.activeElement?.classList.contains("admin-hide-button")'), true, 'Confirmation dialog restores focus to the action trigger')
await click('.admin-hide-button')
await click('.admin-dialog__actions .admin-button:not(.admin-button--secondary)')
await waitFor('window.__adminFixture.calls.some((call) => call.path.endsWith("/moderation") && JSON.parse(call.body).action === "hide")', 'hide API request')
console.log('QA: legacy publish, hide confirmation')

// Existing answers can be edited; hiding and deletion each require confirmation.
await evaluate(`history.pushState({}, '', '/admin/questions/synthetic-answered-02'); dispatchEvent(new PopStateEvent('popstate'))`)
await waitFor('document.querySelector(".admin-answer-panel") !== null', 'answered detail')
await click('.admin-answer-panel button')
await click('.admin-answer-panel textarea')
await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Control', code: 'ControlLeft', modifiers: 2 })
await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', code: 'KeyA', modifiers: 2 })
await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', code: 'KeyA', modifiers: 2 })
await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Control', code: 'ControlLeft' })
await cdp('Input.insertText', { text: 'Silakan bicarakan pilihan dukungan dengan bidan yang mendampingi dan sampaikan kebutuhan Ibu.' })
await click('.admin-answer-panel form button[type="submit"]')
await waitFor('window.__adminFixture.calls.some((call) => call.path.endsWith("/answer") && call.method === "PUT")', 'answer update API request')
await evaluate(`window.__adminFixture.mode = 'conflict'`)
await click('.admin-hide-button')
assert.equal(await evaluate('document.querySelector("[role=alertdialog]") !== null'), true, 'Hide opens a confirmation dialog')
await click('.admin-dialog__actions .admin-button:not(.admin-button--secondary)')
await waitFor('document.querySelector(".admin-toast__refresh") !== null', '409 conflict message with refresh action')
await click('.admin-toast__refresh')
await evaluate(`window.__adminFixture.mode = 'ok'`)
await waitFor('document.querySelector(".admin-hide-button") !== null', 'question reload after conflict')
await click('.admin-hide-button')
await click('.admin-dialog__actions .admin-button:not(.admin-button--secondary)')
await waitFor('window.__adminFixture.calls.some((call) => call.path.endsWith("/moderation") && JSON.parse(call.body).action === "hide" && call.method === "POST")', 'hide API request')
assert.equal(await evaluate('Boolean(document.querySelector(".admin-moderation-panel"))'), false, 'Hidden questions do not offer re-approval')
await click('.admin-delete-button')
assert.equal(await evaluate('document.querySelector("[role=alertdialog]")?.textContent.includes("dihapus permanen")'), true, 'Delete explains permanent removal before confirmation')
await click('.admin-dialog__actions .admin-button--danger')
await waitFor('window.__adminFixture.calls.some((call) => call.method === "DELETE")', 'individual delete API request')
console.log('QA: answer, hide and delete')

await evaluate(`history.pushState({}, '', '/admin/history'); dispatchEvent(new PopStateEvent('popstate'))`)
await waitFor('document.querySelector("[data-admin-page=history]") !== null', 'history page')
assert.equal(await evaluate(`([...document.querySelectorAll('select[aria-label="Filter status"] option')].some((option) => option.value === 'pending'))`), false, 'History excludes the pending filter')
await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false })
await sleep(150)
assert.equal(await evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth'), false, 'History has no horizontal overflow at 390px')
await screenshot('history-mobile-390x844')

// Empty, unavailable, auth-denied and network errors never fall back to mock records.
await evaluate(`window.__adminFixture.mode = 'empty'; history.pushState({}, '', '/admin/questions?status=hidden'); dispatchEvent(new PopStateEvent('popstate'))`)
await waitFor('document.querySelector(".admin-empty") !== null', 'empty state')
await screenshot('empty-state-mobile-390x844')
await evaluate(`window.__adminFixture.mode = 'unavailable'; history.pushState({}, '', '/admin'); dispatchEvent(new PopStateEvent('popstate'))`)
await waitFor('document.querySelector(".admin-state--error")?.textContent.includes("Akses pengelola belum tersedia")', '503 unavailable state')
await screenshot('auth-unavailable-mobile-390x844')
console.log('QA: empty and unavailable')
await evaluate(`window.__adminFixture.mode = 'unauthorized'; history.pushState({}, '', '/admin/questions'); dispatchEvent(new PopStateEvent('popstate'))`)
await waitFor('location.pathname === "/admin/login" && Boolean(document.querySelector("[data-admin-login]"))', '401 redirects to the sign-in route')
assert.equal(await evaluate('Boolean(document.querySelector("[data-admin-app]"))'), false, 'A 401 response removes private dashboard content')
await evaluate(`window.__adminFixture.mode = 'forbidden'; history.pushState({}, '', '/admin/history'); dispatchEvent(new PopStateEvent('popstate'))`)
await waitFor('document.querySelector(".admin-state--error")?.textContent.includes("belum memiliki izin")', '403 forbidden state')
await evaluate(`window.__adminFixture.mode = 'network-error'; history.pushState({}, '', '/admin/questions'); dispatchEvent(new PopStateEvent('popstate'))`)
for (let i = 0; i < 60; i += 1) {
  if (await evaluate('document.querySelector(".admin-state--error")?.textContent.includes("Layanan belum dapat dijangkau")')) break
  await sleep(100)
}
const networkErrorState = await evaluate('({ href: location.href, text: document.querySelector(".admin-state--error")?.textContent, fixtureMode: window.__adminFixture.mode, calls: window.__adminFixture.calls.slice(-8) })')
assert.match(networkErrorState.text ?? '', /Layanan belum dapat dijangkau/u, `Network error state is rendered (${JSON.stringify(networkErrorState)})`)
const storageKeys = await evaluate('({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })')
const storageContents = await evaluate('JSON.stringify({ local: Object.fromEntries(Object.entries(localStorage)), session: Object.fromEntries(Object.entries(sessionStorage)) })')
assert.equal(/synthetic-|private-test@example|Pengunjung Uji|Ibu Contoh|bearer|access_token|jwt/i.test(storageContents), false, `Admin does not persist question data or credentials in Web Storage (${JSON.stringify(storageKeys)})`)
assert.equal(await evaluate('document.body.innerText.toLowerCase().includes("purge massal")'), false, 'Admin has no mass purge control')
await evaluate(`history.pushState({}, '', '/admin/settings'); dispatchEvent(new PopStateEvent('popstate'))`)
await waitFor('Boolean(document.querySelector("[data-admin-page=settings]"))', 'settings information page')
await cdp('Emulation.setDeviceMetricsOverride', { width: 360, height: 800, deviceScaleFactor: 1, mobile: true })
assert.equal(await evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth'), false, 'Settings has no horizontal overflow at 360px')
assert.equal(await evaluate('[...document.querySelectorAll("button")].some((button) => /purge/i.test(button.textContent || ""))'), false, 'Settings exposes no purge action')
assert.equal(await evaluate('document.body.innerText.includes("BELUM DISETUJUI CUSTOMER")'), true, 'Settings labels retention values as awaiting customer approval')
await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await screenshot('settings-desktop-1440x900')
assert.equal(await evaluate('Boolean(document.querySelector(".admin-password-form, input[type=password]"))'), false, 'Password authentication controls are absent from the dashboard')
assert.equal(await evaluate('window.__adminFixture.calls.some((call) => call.path.includes("/api/auth/change-password") || call.path === "/api/auth/login")'), false, 'Legacy password endpoints are not called')
assert.equal(await evaluate('location.search.includes("synthetic") || location.hash.includes("synthetic")'), false, 'Google credential is never placed in the URL')
await evaluate(`window.__adminFixture.mode = 'auth-required'`)
await click('.admin-logout-button')
await waitFor('Boolean(document.querySelector("[data-admin-login]"))', 'logout returns to admin login')
assert.equal(await evaluate('window.__adminFixture.calls.some((call) => call.path === "/api/auth/logout" && call.method === "POST")'), true, 'Logout revokes session through the server API')
const cacheUrls = await evaluate(`caches.keys().then((keys) => Promise.all(keys.map((key) => caches.open(key).then((cache) => cache.keys()))).then((requests) => requests.flat().map((request) => request.url)))`)
assert.equal(cacheUrls.some((url) => /\/api\/admin\//.test(url)), false, 'Admin API responses are absent from Cache Storage')
const sw = await (await import('node:fs/promises')).readFile(resolve('src/pwa/service-worker.ts'), 'utf8')
assert.match(sw, /\/\^\\\/admin\(\?:\\\/\|\$\)\//, 'Admin navigation is excluded from the offline SPA fallback')
const viteConfig = await (await import('node:fs/promises')).readFile(resolve('vite.config.ts'), 'utf8')
assert.match(viteConfig, /AdminLayout-\*\.js/)
assert.match(viteConfig, /AdminPages-\*\.js/)
assert.match(viteConfig, /AdminLayout-\*\.css/)
assert.match(viteConfig, /AdminLoginPage-\*\.js/)
assert.match(viteConfig, /authApi-\*\.js/)
assert.match(viteConfig, /auth-context-\*\.js/)
assert.match(viteConfig, /admin-\*\.css/)
assert.deepEqual(errors, [], `Dashboard has no runtime errors: ${errors.join('; ')}`)
socket.close()
