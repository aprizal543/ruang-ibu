import assert from 'node:assert/strict'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
const cdpOrigin = process.env.RUANG_IBU_CDP_ORIGIN ?? 'http://127.0.0.1:9339'
const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms))
const targets = await fetch(`${cdpOrigin}/json/list`).then((response) => response.json())
const target = targets.find((item) => item.type === 'page')
assert.ok(target?.webSocketDebuggerUrl, 'QA Chromium exposes a page over CDP')
const socket = new WebSocket(target.webSocketDebuggerUrl)
let nextId = 0
const pending = new Map()
const pageErrors = []
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.method === 'Runtime.exceptionThrown') pageErrors.push(message.params.exceptionDetails.text)
  if (!message.id) return
  const waiter = pending.get(message.id)
  if (!waiter) return
  pending.delete(message.id)
  message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result)
})
await new Promise((resolveOpen, rejectOpen) => {
  socket.addEventListener('open', resolveOpen, { once: true })
  socket.addEventListener('error', rejectOpen, { once: true })
})

function cdp(method, params = {}) {
  const id = ++nextId
  return new Promise((resolveCommand, rejectCommand) => {
    const timeout = setTimeout(() => { pending.delete(id); rejectCommand(new Error(`CDP timed out: ${method}`)) }, 10000)
    pending.set(id, {
      resolve: (value) => { clearTimeout(timeout); resolveCommand(value) },
      reject: (error) => { clearTimeout(timeout); rejectCommand(error) },
    })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
  return result.result.value
}

async function waitFor(expression, label, attempts = 50) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (await evaluate(expression)) return
    await sleep(100)
  }
  assert.fail(`Timed out waiting for ${label}`)
}

async function open(path) {
  await cdp('Page.navigate', { url: `${origin}${path}` })
  const pathname = new URL(path, origin).pathname
  const selector = pathname === '/terapi'
    ? '.therapy-page'
    : pathname.startsWith('/terapi/')
      ? '.therapy-detail-page'
      : pathname === '/relaksasi'
        ? '.relaxation-track__open'
        : pathname === '/evaluasi'
          ? '#evaluation-submit'
          : '.bottom-tabs'
  await waitFor(`location.pathname === ${JSON.stringify(pathname)} && Boolean(document.querySelector(${JSON.stringify(selector)}))`, path)
  await sleep(180)
}

async function setViewport(width, height) {
  await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
  await sleep(120)
}

async function clickDom(selector) {
  const activated = await evaluate(`(() => { const element=document.querySelector(${JSON.stringify(selector)}); if(!element) return false; element.focus(); element.click(); return true })()`)
  assert.equal(activated, true, `Element can be activated: ${selector}`)
}

await cdp('Page.enable')
await cdp('Runtime.enable')
await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await setViewport(390, 844)

// Catalog → detail → Back restores the position from below the 8th row.
await open('/terapi')
assert.equal(await evaluate('document.querySelectorAll("a.therapy-row").length'), 11, 'The catalog has all 11 articles')
const routes = await evaluate('[...document.querySelectorAll("a.therapy-row")].map((row) => row.getAttribute("href"))')
for (const [width, height] of [[360, 800], [375, 812], [390, 844], [430, 932], [1440, 900]]) {
  await setViewport(width, height)
  assert.equal(await evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `Catalog has no overflow at ${width}px`)
}
await setViewport(390, 844)
await evaluate('window.scrollTo(0, document.documentElement.scrollHeight)')
const catalogY = await evaluate('window.scrollY')
assert.ok(catalogY > 300, 'The catalog is scrolled below the article list start')
await clickDom('a.therapy-row:nth-of-type(8)')
await waitFor('location.pathname.startsWith("/terapi/") && Boolean(document.querySelector("#therapy-detail-title"))', 'article detail after catalog click')
assert.ok(await evaluate('window.scrollY <= 1'), 'PUSH from a lower catalog position resets the detail to the top')
const detail = await evaluate(`({title:document.querySelector('#therapy-detail-title').innerText.trim(), top:document.querySelector('#therapy-detail-title').getBoundingClientRect().top})`)
assert.ok(detail.top >= 0 && detail.top < 180, 'Article heading is visible immediately')
await evaluate('history.back()')
await waitFor('location.pathname === "/terapi"', 'catalog on browser Back')
await waitFor(`Math.abs(window.scrollY - ${catalogY}) <= 4`, 'catalog scroll restoration')
assert.equal(await evaluate('document.querySelectorAll("a.therapy-row").length'), 11, 'Back restores the complete catalog')
console.log('QA: catalog detail and scroll restoration')

// Filter + search are carried by URL/history and survive opening an article.
await open('/terapi?kategori=hamil')
await clickDom('.therapy-header__control:nth-child(3)')
await waitFor('Boolean(document.querySelector("input[type=search]"))', 'catalog search control')
await evaluate(`(() => { const input=document.querySelector('input[type="search"]'); const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,'kompres'); input.dispatchEvent(new Event('input',{bubbles:true})); })()`)
await waitFor('new URL(location.href).searchParams.get("q") === "kompres" && document.querySelectorAll("a.therapy-row").length === 1', 'combined filter and search')
assert.ok(await evaluate('location.search.includes("kategori=hamil")'), 'The pregnancy filter remains in the URL')
await clickDom('a.therapy-row')
await waitFor('document.querySelector("#therapy-detail-title")?.innerText.includes("Kompres Hangat Saat Hamil")', 'matching filtered article')
await evaluate('history.back()')
await waitFor('location.pathname === "/terapi" && new URL(location.href).searchParams.get("q") === "kompres"', 'filtered catalog on browser Back')
await waitFor('document.querySelector("input[type=search]")?.value === "kompres"', 'search value restoration')
assert.equal(await evaluate('document.querySelector("button.therapy-filter[aria-pressed=true]")?.textContent.trim()'), 'Hamil', 'The active category is restored')
await evaluate('history.forward()')
await waitFor('location.pathname.includes("kompres-hangat-kehamilan")', 'article on browser Forward')
assert.ok(await evaluate('window.scrollY <= 1'), 'Forward returns to the detail at its saved top')
console.log('QA: filter, search, Back and Forward')

// All 11 real-photo figures load at a mobile viewport and all article routes retain layout.
await open('/terapi')
const articleState = []
for (const route of routes) {
  await open(route)
  await waitFor('Boolean(document.querySelector(".therapy-article-figure img"))', `article figure ${route}`)
  await evaluate(`new Promise((resolve, reject) => { const image=document.querySelector('.therapy-article-figure img'); image.loading='eager'; if(image.complete && image.naturalWidth) return resolve(true); image.addEventListener('load',()=>resolve(true),{once:true}); image.addEventListener('error',()=>reject(new Error('Article photo failed: '+image.currentSrc)),{once:true}); setTimeout(()=>reject(new Error('Photo load timeout: '+image.currentSrc)),6000) })`)
  const state = await evaluate(`(() => ({ title:document.querySelector('#therapy-detail-title')?.innerText.trim(), scrollY, photoWidth:document.querySelector('.therapy-article-figure img')?.naturalWidth, overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth }))()`)
  assert.ok(state.title, `${route} renders an article title`)
  assert.ok(state.photoWidth > 0, `${route} real photo loads`)
  assert.ok(state.scrollY <= 1, `${route} direct visit starts at the top`)
  assert.equal(state.overflow, false, `${route} has no horizontal overflow at 390px`)
  articleState.push(state.title)
}
assert.equal(articleState.length, 11, 'All 11 article routes were visited')
for (const [width, height] of [[360, 800], [375, 812], [390, 844], [430, 932], [1440, 900]]) {
  await setViewport(width, height)
  assert.equal(await evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `Article detail has no overflow at ${width}px`)
}
await setViewport(390, 844)
console.log('QA: all 11 article photos')

// Individual source link opens the enclosing disclosure and places its row in view.
await open('/terapi/nyeri-persalinan#section-referensi-S8')
await waitFor('Boolean(document.getElementById("section-referensi-S8")?.closest("details")?.open)', 'S8 disclosure open')
const sourceState = await evaluate(`(() => { const target=document.getElementById('section-referensi-S8'); const rect=target.getBoundingClientRect(); return {top:rect.top,bottom:rect.bottom,href:target.querySelector('a')?.href,visible:rect.top>=0 && rect.top<innerHeight && rect.bottom>0} })()`)
assert.equal(sourceState.visible, true, `The individual source row is visible: ${JSON.stringify(sourceState)}`)
assert.ok(sourceState.href?.startsWith('http'), 'The source row has an external publisher link')
console.log('QA: individual source hash')
await setViewport(360, 800)
assert.equal(await evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, 'Source deep link has no overflow at 360px')

// The public relaxation route, player UI, and local media asset remain available.
await setViewport(390, 844)
await open('/relaksasi')
await clickDom('.relaxation-track__open')
await waitFor('location.pathname === "/relaksasi/rain" && Boolean(document.querySelector(".immersive-player__play"))', 'relaxation player')
assert.equal(await evaluate('document.querySelector(".immersive-player__play").disabled'), false, 'The player control is enabled')
const audioUrl = await evaluate('document.querySelector("audio").src')
assert.ok(audioUrl.endsWith('/audio/soft-rain.mp3'), `The player resolves its local track: ${audioUrl}`)
const audioResponse = await fetch(audioUrl, { method: 'HEAD' })
assert.equal(audioResponse.status, 200, 'The selected audio file is served locally')
await evaluate('history.back()')
await waitFor('location.pathname === "/relaksasi"', 'relaxation catalog on Back')
console.log('QA: relaxation route, player and local audio asset (playback not exercised by CDP fallback)')

// Evaluation scores stay in component state and do not enter storage or network traffic.
await open('/evaluasi')
const beforeStorage = await evaluate('JSON.stringify({local:Object.entries(localStorage).sort(),session:Object.entries(sessionStorage).sort()})')
await evaluate(`(() => {
  window.__evaluationTraffic=[]
  const originalFetch=window.fetch.bind(window); window.fetch=(...args)=>{window.__evaluationTraffic.push(['fetch',String(args[0])]);return originalFetch(...args)}
  const originalOpen=XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open=function(method,url,...args){window.__evaluationTraffic.push(['xhr',String(url)]);return originalOpen.call(this,method,url,...args)}
  const originalBeacon=navigator.sendBeacon?.bind(navigator); Object.defineProperty(navigator,'sendBeacon',{configurable:true,value:(...args)=>{window.__evaluationTraffic.push(['beacon',String(args[0])]);return originalBeacon?.(...args)??false}})
  for(const [id,value] of [['comfort-score','6'],['anxiety-score','4']]) { const input=document.getElementById(id); const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,value); input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true})) }
})()`)
await clickDom('#evaluation-submit')
await waitFor('document.body.innerText.includes("6/10") && document.body.innerText.includes("4/10")', 'local evaluation result')
assert.equal(await evaluate('JSON.stringify({local:Object.entries(localStorage).sort(),session:Object.entries(sessionStorage).sort()})'), beforeStorage, 'Evaluation does not persist scores')
assert.deepEqual(await evaluate('window.__evaluationTraffic'), [], 'Evaluation sends no fetch, XHR or beacon')

// Six public navigation tabs still reach their intended routes at mobile width.
const publicTabs = [['/', 'Beranda'], ['/terapi', 'Jenis Terapi'], ['/hamil', 'Panduan Ibu Hamil'], ['/bersalin', 'Panduan Bersalin'], ['/relaksasi', 'Relaksasi'], ['/evaluasi', 'Evaluasi']]
for (const [path, label] of publicTabs) {
  await open('/')
  await clickDom(`.bottom-tabs__item[href="${path}"]`)
  await waitFor(`location.pathname === ${JSON.stringify(path)}`, `public tab ${label}`)
  assert.equal(await evaluate('document.querySelectorAll(".bottom-tabs__item[aria-current=page]").length'), 1, `${label} marks one active tab`)
}
await setViewport(390, 844)
assert.equal(await evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches"), true, 'Reduced motion remains enabled')
assert.equal(await evaluate("getComputedStyle(document.documentElement).scrollBehavior"), 'auto', 'Reduced motion avoids smooth scrolling')
assert.deepEqual(pageErrors, [], `No uncaught browser exceptions: ${pageErrors.join('; ')}`)
socket.close()
console.log('Public browser regression passed: catalog/detail Back and Forward, filter/search, 11 article photos, individual source hash, relaxation route and audio asset, ephemeral evaluation, six mobile tabs, reduced motion, and runtime errors.')
