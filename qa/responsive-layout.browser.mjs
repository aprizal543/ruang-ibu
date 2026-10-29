import assert from 'node:assert/strict'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
const cdpOrigin = process.env.RUANG_IBU_CDP_ORIGIN ?? 'http://127.0.0.1:9339'
const targets = await fetch(`${cdpOrigin}/json/list`).then((response) => response.json())
const target = targets.find((item) => item.type === 'page' && item.url.startsWith(origin))
assert.ok(target?.webSocketDebuggerUrl, 'QA Chromium exposes the local Ruang Ibu page over CDP')

const socket = new WebSocket(target.webSocketDebuggerUrl)
let nextId = 0
const pending = new Map()
const runtimeErrors = []
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text)
  if (!message.id) return
  const waiter = pending.get(message.id)
  if (!waiter) return
  pending.delete(message.id)
  message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result)
})
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

function cdp(method, params = {}) {
  const id = ++nextId
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timed out: ${method}`)) }, 10000)
    pending.set(id, { resolve: (value) => { clearTimeout(timeout); resolve(value) }, reject: (error) => { clearTimeout(timeout); reject(error) } })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
  return result.result.value
}

async function open(path, selector) {
  await cdp('Page.navigate', { url: `${origin}${path}` })
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await evaluate(`location.pathname === ${JSON.stringify(new URL(path, origin).pathname)} && Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  assert.fail(`Route did not render expected content: ${path}`)
}

async function viewport(width, height) {
  await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
  await new Promise((resolve) => setTimeout(resolve, 80))
}

await cdp('Page.enable')
await cdp('Runtime.enable')
await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await open('/terapi', '.therapy-page')
const articleRoutes = await evaluate(`(() => [...document.querySelectorAll('.therapy-row')].map((row) => row.getAttribute('href')))()`)
assert.equal(articleRoutes.length, 11, 'Catalog provides all 11 article routes for responsive coverage')

const sizes = [
  [320, 844], [375, 812], [390, 844], [430, 932], [767, 844],
  [768, 1024], [820, 1180], [912, 1368], [1023, 768], [1024, 768],
  [1280, 800], [1366, 768], [1440, 900], [1920, 1080],
]

const routes = [
  ['/', '.home-shell'], ['/terapi', '.therapy-page'],
  ['/panduan/hamil', '.maternity-guide'], ['/panduan/bersalin', '.maternity-guide'],
  ['/relaksasi', '.relaxation-experience'], ['/relaksasi/rain', '.immersive-player__play'], ['/evaluasi', '.evaluation-page'],
  ['/tentang', '.information-page'], ['/faq', '.information-page'], ['/sumber', '.information-page'], ['/tanda-bahaya', '.information-page'],
  ['/admin/login', '[data-admin-login]'],
]

routes.splice(2, 0, ...articleRoutes.map((path) => [path, '.therapy-detail-page']))

for (const [path, selector] of routes) {
  await open(path, selector)
  if (path.startsWith('/terapi/') && path !== '/terapi') {
    await evaluate(`(() => { const image=document.querySelector('.therapy-article-figure img'); if(image) image.loading='eager'; return image?.decode().then(()=>image.naturalWidth) })()`)
  }
  for (const [width, height] of sizes) {
    await viewport(width, height)
    const state = await evaluate(`(() => ({
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      nav: document.querySelector('.bottom-tabs') ? getComputedStyle(document.querySelector('.bottom-tabs')).display : null,
      navTop: document.querySelector('.bottom-tabs') ? getComputedStyle(document.querySelector('.bottom-tabs')).top : null,
      articleImage: document.querySelector('.therapy-article-figure img')?.complete ? document.querySelector('.therapy-article-figure img').naturalWidth : null,
    }))()`)
    assert.equal(state.documentWidth <= state.viewportWidth, true, `${path} has no horizontal overflow at ${width}px (${JSON.stringify(state)})`)
    if (width < 768 && state.nav) assert.equal(state.nav, 'grid', `Mobile navigation keeps its locked presentation at ${width}px`)
    if (width >= 768 && state.nav) {
      assert.equal(state.nav, 'flex', `Wide navigation is horizontal at ${width}px`)
      assert.equal(state.navTop, '0px', `Wide navigation is pinned at the top at ${width}px`)
    }
    if (path.startsWith('/terapi/') && path !== '/terapi') {
      assert.ok(await evaluate('Boolean(document.querySelector("[data-public-qna]"))'), `${path} retains its Q&A section`)
      assert.ok(state.articleImage > 0, `${path} photo is available at ${width}px`)
    }
  }
}

await open('/terapi', '.therapy-page')
await viewport(820, 1024)
assert.equal(await evaluate('getComputedStyle(document.querySelector(".therapy-results")).gridTemplateColumns.split(" ").length'), 2, 'Tablet catalog uses two columns')
await viewport(1024, 768)
assert.equal(await evaluate('getComputedStyle(document.querySelector(".therapy-results")).gridTemplateColumns.split(" ").length'), 3, 'Desktop catalog uses three columns when space allows')

assert.deepEqual(runtimeErrors, [], `Responsive routes have no JavaScript errors: ${runtimeErrors.join('; ')}`)
socket.close()
console.log(`Responsive browser QA passed: ${routes.length} public/admin-entry routes x ${sizes.length} viewports; no overflow or runtime errors.`)
