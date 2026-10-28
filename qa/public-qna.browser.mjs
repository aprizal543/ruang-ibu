import assert from 'node:assert/strict'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
const cdpOrigin = process.env.RUANG_IBU_CDP_ORIGIN ?? 'http://127.0.0.1:9339'
const pages = await fetch(`${cdpOrigin}/json/list`).then((response) => response.json())
const page = pages.find((item) => item.type === 'page')
assert.ok(page?.webSocketDebuggerUrl, 'QA Chromium exposes a page over CDP')
const socket = new WebSocket(page.webSocketDebuggerUrl)
let nextId = 0
const pending = new Map()
const errors = []
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
  if (!message.id) return
  const waiter = pending.get(message.id)
  if (!waiter) return
  pending.delete(message.id)
  message.error ? waiter.reject(new Error(`${waiter.method}: ${message.error.message}`)) : waiter.resolve(message.result)
})
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

function cdp(method, params = {}) {
  const id = ++nextId
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timed out: ${method}`)) }, 10000)
    pending.set(id, { method, resolve: (value) => { clearTimeout(timeout); resolve(value) }, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}

async function waitFor(expression, label) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (await evaluate(expression)) return
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const state = await evaluate(`({url:location.href, qna:document.querySelector('[data-public-qna]')?.innerText, form:Boolean(document.querySelector('#public-qna-form-panel')), config:window.__qnaRequests, widget:window.__turnstileOptions && {appearance:window.__turnstileOptions.appearance}, errors:window.__qnaErrors || []})`)
  assert.fail(`Timed out waiting for ${label}; state ${JSON.stringify(state)}`)
}

await cdp('Page.enable')
await cdp('Runtime.enable')
await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
await cdp('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
  window.__qnaRequests = [];
  window.__turnstileOptions = null;
  window.__turnstileExecuteCount = 0;
  window.__turnstileResetCount = 0;
  let executeCount = 0;
  window.turnstile = {
    render: (container, options) => { window.__turnstileOptions = options; container.dataset.widgetReady = 'true'; return 'fixture-widget'; },
    execute: () => { executeCount += 1; window.__turnstileExecuteCount = executeCount; if (executeCount === 1) window.__turnstileOptions['expired-callback'](); else window.__turnstileOptions.callback('synthetic-turnstile-token'); },
    reset: () => { window.__turnstileResetCount += 1; },
    remove: () => {},
  };
  const realFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (url.pathname.startsWith('/api/questions')) {
      window.__qnaRequests.push({ path: url.pathname + url.search, method: init.method || 'GET', body: init.body || null });
      if (url.pathname === '/api/questions/config') return new Response(JSON.stringify({data:{turnstileSiteKey:'qa-public-test-site-key'}}), {status:200, headers:{'Content-Type':'application/json'}});
      if ((init.method || 'GET') === 'POST') return new Response(JSON.stringify({data:{id:'synthetic-receipt',status:'approved',message:'Pertanyaan berhasil dikirim dan langsung tampil.',question:{id:'synthetic-receipt',articleSlug:'nyeri-punggung-kehamilan',displayName:'Ibu',question:'Apa yang dapat saya tanyakan kepada bidan tentang hal ini?',status:'approved',createdAt:'2026-10-28T00:00:00.000Z',answer:null}}}), {status:201, headers:{'Content-Type':'application/json'}});
      return new Response(JSON.stringify({data:{questions:[{id:'synthetic-unanswered',articleSlug:'nyeri-punggung-kehamilan',displayName:'Ibu Contoh',question:'Pertanyaan umum yang belum mendapat jawaban.',status:'approved',createdAt:'2026-10-27T00:00:00.000Z',answer:null},{id:'synthetic-answered',articleSlug:'nyeri-punggung-kehamilan',displayName:'Ibu Uji',question:'Pertanyaan yang sudah dijawab untuk simulasi.',status:'answered',createdAt:'2026-10-26T00:00:00.000Z',answer:{text:'Diskusikan keluhan ini dengan bidan atau dokter.',updatedAt:null}},{id:'synthetic-answered-two',articleSlug:'nyeri-punggung-kehamilan',displayName:'Ibu Kedua',question:'Pertanyaan kedua yang sudah dijawab.',status:'answered',createdAt:'2026-10-25T00:00:00.000Z',answer:{text:'Bicarakan pilihan perawatan dengan tenaga kesehatan.',updatedAt:null}}],nextCursor:null}}), {status:200, headers:{'Content-Type':'application/json'}});
    }
    return realFetch(input, init);
  };
})()` })
await cdp('Page.navigate', { url: `${origin}/terapi/nyeri-punggung-kehamilan` })
await waitFor('Boolean(document.querySelector("[data-public-qna]") && document.querySelector("#public-qna-heading"))', 'public Q&A section')
const initialQuestionListGetCount = await evaluate('window.__qnaRequests.filter((item) => item.method === "GET" && item.path.startsWith("/api/questions?")).length')
assert.equal(await evaluate('Boolean(document.querySelector("[data-public-qna]") && document.querySelector(".therapy-detail__sources") && (document.querySelector("[data-public-qna]").compareDocumentPosition(document.querySelector(".therapy-detail__sources")) & Node.DOCUMENT_POSITION_FOLLOWING))'), true, 'Sources disclosure follows the entire Q&A section')
assert.equal(await evaluate('Boolean(document.querySelector("#section-referensi"))'), true, 'article Sources anchor remains present')
await evaluate('document.querySelector(".therapy-detail__sources summary")?.click()')
await waitFor('Boolean(document.querySelector("#section-referensi li[id^=section-referensi-]"))', 'individual source target after disclosure opens')
assert.equal(await evaluate('document.querySelector("[data-public-qna]").compareDocumentPosition(document.querySelector(".therapy-detail__sources")) & Node.DOCUMENT_POSITION_FOLLOWING'), 4, 'Sources disclosure stays after Q&A')
assert.equal(await evaluate('document.querySelector("#public-qna-form-panel") === null'), true, 'form is closed by default')
assert.equal(await evaluate('document.querySelector(".public-qna__item img") === null'), true, 'public text is rendered as text, not HTML')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan yang sudah dijawab"))?.textContent.includes("Belum dijawab")'), false, 'answered questions do not show unanswered status')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].some((item) => item.textContent.includes("Pertanyaan umum yang belum mendapat jawaban.") && item.textContent.includes("Belum dijawab"))'), true, 'unanswered public questions remain visible with a simple label')
assert.equal(await evaluate('document.querySelectorAll(".public-qna__answer-toggle").length'), 2, 'each answered question has its own answer toggle')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan umum yang belum mendapat jawaban."))?.querySelector(".public-qna__answer-toggle") === null'), true, 'unanswered questions keep their plain status without a toggle')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__answer-toggle")].every((button) => button.textContent.trim() === "Lihat jawaban" && button.getAttribute("aria-expanded") === "false")'), true, 'answers start collapsed with accessible toggle state')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__answer-toggle")].every((button) => button.getAttribute("aria-controls") && document.getElementById(button.getAttribute("aria-controls"))?.hidden)'), true, 'each collapsed button controls an existing hidden answer panel')
assert.equal(await evaluate('new Set([...document.querySelectorAll(".public-qna__answer-toggle")].map((button) => button.getAttribute("aria-controls"))).size'), 2, 'answered items have independent answer panel IDs')
await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan yang sudah dijawab"))?.querySelector(".public-qna__answer-toggle")?.click()')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan yang sudah dijawab"))?.querySelector(".public-qna__answer-toggle")?.getAttribute("aria-expanded")'), 'true', 'clicking one answer toggle opens that answer')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan yang sudah dijawab"))?.querySelector(".public-qna__answer")?.hidden'), false, 'opened answer is shown directly under its question')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan kedua yang sudah dijawab."))?.querySelector(".public-qna__answer-toggle")?.getAttribute("aria-expanded")'), 'false', 'opening an answer does not open a different question')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan yang sudah dijawab"))?.querySelector(".public-qna__answer-toggle")?.textContent.trim()'), 'Sembunyikan jawaban')
await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan kedua yang sudah dijawab."))?.querySelector(".public-qna__answer-toggle")?.click()')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan kedua yang sudah dijawab."))?.querySelector(".public-qna__answer-toggle")?.getAttribute("aria-expanded")'), 'true', 'each answer can be opened independently')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan yang sudah dijawab"))?.querySelector(".public-qna__answer-toggle")?.getAttribute("aria-expanded")'), 'true', 'opening a second answer leaves the first answer open')
await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan yang sudah dijawab"))?.querySelector(".public-qna__answer-toggle")?.click()')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan yang sudah dijawab"))?.querySelector(".public-qna__answer-toggle")?.getAttribute("aria-expanded")'), 'false', 'clicking an open answer hides it again')
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan kedua yang sudah dijawab."))?.querySelector(".public-qna__answer-toggle")?.getAttribute("aria-expanded")'), 'true', 'hiding one answer does not hide a different question')
await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan kedua yang sudah dijawab."))?.querySelector(".public-qna__answer-toggle")?.focus()')
await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13 })
await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
assert.equal(await evaluate('[...document.querySelectorAll(".public-qna__item")].find((item) => item.textContent.includes("Pertanyaan kedua yang sudah dijawab."))?.querySelector(".public-qna__answer-toggle")?.getAttribute("aria-expanded")'), 'false', 'answer toggle supports keyboard activation')
assert.equal(await evaluate('window.__qnaRequests.filter((item) => item.path === "/api/questions/config").length'), 0, 'Turnstile config is not fetched until the form opens')

await evaluate('document.querySelector(".public-qna__toggle").focus()')
assert.equal(await evaluate('document.activeElement === document.querySelector(".public-qna__toggle")'), true, 'question toggle can receive keyboard focus')
await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13 })
await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
await waitFor('Boolean(document.querySelector("#public-qna-form-panel") && document.querySelector("[data-widget-ready=true]"))', 'form and conditional Turnstile widget')
assert.equal(await evaluate('document.querySelector(".public-qna__toggle").getAttribute("aria-expanded")'), 'true')
assert.equal(await evaluate('window.__turnstileOptions.appearance'), 'interaction-only')
assert.equal(await evaluate('window.__turnstileOptions.execution'), 'execute')
assert.equal(await evaluate('document.querySelector(".public-qna__disclaimer").textContent.includes("dapat langsung dibaca")'), true)
assert.equal(await evaluate('/moderasi|pending|versi publik|disetujui/i.test(document.querySelector("[data-public-qna]").textContent)'), false, 'public copy avoids internal status vocabulary')

await evaluate(`(() => {
  const input = document.querySelector('.public-qna__field textarea');
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
  setter.call(input, 'Apa yang dapat saya tanyakan kepada bidan tentang hal ini?');
  input.dispatchEvent(new Event('input', {bubbles:true}));
  document.querySelector('.public-qna__consent input').click();
})()`)
await evaluate('document.querySelector(".public-qna__close").click()')
await waitFor('document.querySelector("#public-qna-form-panel") === null', 'form close control')
assert.equal(await evaluate('document.querySelector(".public-qna__toggle").getAttribute("aria-expanded")'), 'false')
await evaluate('document.querySelector(".public-qna__toggle").click()')
await waitFor('Boolean(document.querySelector("#public-qna-form-panel") && document.querySelector("[data-widget-ready=true]"))', 'reopened form')
await waitFor('document.querySelector(".public-qna__submit")?.disabled === false', 'ready submit control')
await evaluate('document.querySelector(".public-qna__submit").click()')
await waitFor('document.querySelector(".public-qna__form-message--error")?.textContent.includes("kedaluwarsa")', 'expired token feedback')
assert.equal(await evaluate('window.__qnaRequests.filter((item) => item.method === "POST").length'), 0, 'expired Turnstile token is not sent to the API')
await evaluate('document.querySelector(".public-qna__submit").click()')
await waitFor('document.querySelector(".public-qna__form-message[role=status]")?.textContent.includes("langsung tampil")', 'success confirmation')
await waitFor('document.querySelector("#public-qna-form-panel") === null', 'form closes after successful submission')
const result = await evaluate(`(() => {
  const request = window.__qnaRequests.find((entry) => entry.method === 'POST');
  return { request, visibleQuestion: [...document.querySelectorAll('.public-qna__item')].some((item) => item.textContent.includes('Apa yang dapat saya tanyakan')), unanswered: document.querySelector('.public-qna__unanswered')?.textContent, formClosed: document.querySelector('#public-qna-form-panel') === null, disclaimerNotRendered: document.querySelector('.public-qna__disclaimer') === null, getCount: window.__qnaRequests.filter((entry) => entry.method === 'GET' && entry.path.startsWith('/api/questions?')).length, executeCount: window.__turnstileExecuteCount, resetCount: window.__turnstileResetCount };
})()`)
assert.ok(result.request, 'form submits to public question API only after Turnstile callback')
assert.equal(result.request.path, '/api/questions')
const body = JSON.parse(result.request.body)
assert.equal(body.articleSlug, 'nyeri-punggung-kehamilan', 'submission relates to the current article')
assert.equal(body.displayName, undefined, 'display name is omitted when optional field is blank')
assert.equal(body.consentToPublicDisplay, true)
assert.equal(body.turnstileToken, 'synthetic-turnstile-token')
assert.equal(result.visibleQuestion, true, 'new question appears without a page refresh')
assert.equal(result.unanswered, 'Belum dijawab')
assert.equal(result.formClosed, true, 'form remains closed after successful send')
assert.equal(result.disclaimerNotRendered, true, 'closed form does not keep its disclaimer panel open')
assert.equal(result.getCount, initialQuestionListGetCount, 'successful submission updates the current list without a follow-up GET or page reload')
assert.equal(result.executeCount, 2, 'expired verification can be retried')
assert.equal(result.resetCount, 1)

for (const width of [360, 375, 390, 430]) {
  await cdp('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: true })
  assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true, `no horizontal overflow at ${width}px`)
}
await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true, 'no horizontal overflow at 1440px desktop')
assert.deepEqual(errors, [], `no browser runtime errors: ${errors.join('; ')}`)
console.log('QA: public Q&A direct publication, independent answer toggles, collapsed form, keyboard, Turnstile interaction-only/execute/expiry retry, immediate list update, and mobile/desktop overflow (synthetic API/widget fixtures)')
socket.close()
