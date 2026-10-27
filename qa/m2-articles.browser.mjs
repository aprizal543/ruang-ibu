import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Chromium DevTools Protocol fallback for environments where the Agent Browser daemon is unavailable.
const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
const cdpOrigin = process.env.RUANG_IBU_CDP_ORIGIN ?? 'http://localhost:9339'
const viewportSizes = [[360, 800], [375, 812], [390, 844], [430, 932], [1440, 900]]
const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms))
const targets = await fetch(`${cdpOrigin}/json/list`).then((r) => r.json())
const target = targets.find((item) => item.type === 'page')
assert.ok(target?.webSocketDebuggerUrl, 'A local Chrome DevTools Protocol page is available')
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
await new Promise((resolveSocket, reject) => {
  socket.addEventListener('open', resolveSocket, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

function cdp(method, params = {}) {
  const id = ++nextId
  return new Promise((resolveCommand, rejectCommand) => {
    pending.set(id, { resolve: resolveCommand, reject: rejectCommand })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
  const value = result.result.value
  if (typeof value === 'string') {
    try { return JSON.parse(value) } catch { return value }
  }
  return value
}

async function open(url) {
  await cdp('Page.navigate', { url })
  const path = new URL(url).pathname
  const selector = path === '/terapi'
    ? '.therapy-page'
    : path.startsWith('/terapi/')
      ? '.therapy-detail-page'
      : path === '/relaksasi'
        ? '.relaxation-track__play'
        : path === '/sumber'
          ? '.information-source-list'
          : path.startsWith('/panduan/')
            ? '.maternity-guide__sources'
            : path === '/evaluasi'
              ? 'main'
              : 'body'
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await evaluate(`location.pathname === ${JSON.stringify(path)} && Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return
    await sleep(150)
  }
  throw new Error(`Timed out waiting for ${path}`)
}

async function waitForSourceVisible(referenceId, viewportHeight = 844) {
  const targetId = `section-referensi-${referenceId}`
  let state
  for (let attempt = 0; attempt < 40; attempt += 1) {
    state = await evaluate(`(() => {
      const target = document.getElementById(${JSON.stringify(targetId)})
      const rect = target?.getBoundingClientRect()
      return {
        open: Boolean(target?.closest('details')?.open),
        top: rect?.top ?? -1,
        bottom: rect?.bottom ?? -1,
        scrollY: window.scrollY,
        sourceUrl: target?.querySelector('a')?.href ?? '',
        visible: Boolean(rect && rect.top >= 0 && rect.top < ${viewportHeight} && rect.bottom > 0),
      }
    })()`)
    if (state.open && state.visible) return state
    await sleep(50)
  }
  assert.fail(`Source ${referenceId} did not become visible after its hash navigation: ${JSON.stringify(state)}`)
}

await cdp('Page.enable')
await cdp('Runtime.enable')
await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await open(`${origin}/terapi`)
let rowCount = 0
for (let attempt = 0; attempt < 12 && rowCount !== 11; attempt += 1) {
  rowCount = await evaluate('document.querySelectorAll(".therapy-row").length')
  if (rowCount !== 11) await sleep(250)
}
assert.equal(rowCount, 11, `Catalog contains all 11 articles at ${await evaluate('location.href')}`)
await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
await evaluate(`Promise.all([...document.querySelectorAll('.therapy-row img')].map((image) => {
  image.loading = 'eager'
  return image.decode()
}))`)
const catalogMobileState = await evaluate(`(() => ({
  images: [...document.querySelectorAll('.therapy-row img')].map((image) => ({ src: image.currentSrc || image.src, complete: image.complete, width: image.naturalWidth })),
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
}))()`)
assert.equal(catalogMobileState.images.length, 11, 'Catalog provides a thumbnail for every article')
assert.ok(catalogMobileState.images.every((image) => image.complete && image.width > 0), 'All catalog thumbnails load successfully')
assert.equal(catalogMobileState.overflow, false, 'Catalog has no horizontal overflow at 390px')
const routes = []
for (let i = 0; i < rowCount; i += 1) routes.push(await evaluate(`new URL(document.querySelectorAll('.therapy-row')[${i}].href).pathname`))
const evidenceDir = 'docs/evidence/m2-content/m2.3'
await mkdir(resolve(evidenceDir), { recursive: true })
await evaluate('window.scrollTo(0, 0)')
const catalogMobile = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
await writeFile(resolve(`${evidenceDir}/catalog-mobile-390x844.png`), Buffer.from(catalogMobile.data, 'base64'))

for (const [width, height] of viewportSizes) {
  await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 })
  for (const route of routes) {
    await open(`${origin}${route}`)
    await evaluate(`new Promise((resolveImage, rejectImage) => {
      const image = document.querySelector('.therapy-article-figure img')
      image.loading = 'eager'
      if (image.complete && image.naturalWidth > 0) resolveImage(true)
      else {
        image.addEventListener('load', () => resolveImage(true), { once: true })
        image.addEventListener('error', () => rejectImage(new Error('Article figure failed to load')), { once: true })
        setTimeout(() => rejectImage(new Error('Timed out loading article figure')), 5000)
      }
    })`)
    await evaluate('window.scrollTo(0, 0)')
    const state = await evaluate(`(() => {
      const image = document.querySelector('.therapy-article-figure img')
      const ids = [...document.querySelectorAll('[id]')].map((node) => node.id)
      return {
        title: document.querySelector('#therapy-detail-title')?.textContent.trim(),
        titleTop: document.querySelector('#therapy-detail-title')?.getBoundingClientRect().top,
        scrollY: window.scrollY,
        imageComplete: image?.complete,
        imageWidth: image?.naturalWidth,
        imageHeight: image?.naturalHeight,
        renderedImageWidth: image?.getBoundingClientRect().width,
        caption: image?.closest('figure')?.querySelector('figcaption')?.textContent.trim(),
        guide: document.querySelector('#practice-heading')?.textContent.trim(),
        guideSteps: document.querySelectorAll('[data-source-guide] li').length,
        refs: [...document.querySelectorAll('.therapy-detail__step-sources a')].every((a) => {
          const targetId = decodeURIComponent(new URL(a.href, location.href).hash.slice(1))
          return Boolean(targetId && document.getElementById(targetId))
        }),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
        bottomClearance: document.querySelector('.therapy-detail__catalog-link')?.getBoundingClientRect().bottom <= document.querySelector('.therapy-article').getBoundingClientRect().bottom,
      }
    })()`)
    assert.ok(state.title, `${route} has an article title`)
    assert.ok(state.titleTop > 0 && state.titleTop < height, `${route} heading is visible at ${width}px`)
    assert.ok(state.scrollY <= 1, `${route} direct visit starts at the top`)
    assert.ok(state.imageComplete && state.imageWidth > 0 && state.imageHeight > 0 && state.renderedImageWidth > 0, `${route} figure loads and renders at ${width}px (${JSON.stringify(state)})`)
    assert.ok(state.caption, `${route} figure includes a caption`)
    assert.equal(state.guide, 'Yang Bisa Ibu Lakukan', `${route} shows practical guidance`)
    assert.ok(state.guideSteps >= 3, `${route} has at least three source-based steps`)
    assert.equal(state.refs, true, `${route} step source IDs point to source entries`)
    assert.equal(state.overflow, false, `${route} has no horizontal overflow at ${width}px`)
    assert.deepEqual(state.duplicateIds, [], `${route} has unique IDs`)
    await evaluate('window.scrollTo(0, document.documentElement.scrollHeight)')
    const footerClearance = await evaluate(`(() => {
      const link = document.querySelector('.therapy-detail__catalog-link').getBoundingClientRect()
      const tabs = document.querySelector('.bottom-tabs').getBoundingClientRect()
      return { safe: link.bottom <= tabs.top, linkBottom: link.bottom, tabsTop: tabs.top, scrollY, pageHeight: document.documentElement.scrollHeight, viewport: innerHeight }
    })()`)
    assert.equal(footerClearance.safe, true, `${route} final link clears the bottom navigation at ${width}px (${JSON.stringify(footerClearance)})`)
    await evaluate('window.scrollTo(0, 0)')
    if (width === 390) {
      const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      await writeFile(resolve(`${evidenceDir}/${route.split('/').at(-1)}-390x844.png`), Buffer.from(shot.data, 'base64'))
      await evaluate(`document.querySelector('.therapy-article-figure').scrollIntoView({ block: 'center' })`)
      await sleep(100)
      const figureShot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      await writeFile(resolve(`${evidenceDir}/${route.split('/').at(-1)}-figure-390x844.png`), Buffer.from(figureShot.data, 'base64'))
    }
  }
}

await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
await open(`${origin}/terapi/nyeri-persalinan#section-referensi-S8`)
const directReference = await waitForSourceVisible('S8')
assert.equal((await evaluate('location.hash')), '#section-referensi-S8', 'Direct source URL keeps the individual source hash')
assert.ok(directReference.sourceUrl.startsWith('https://'), 'The individual source remains clickable as an external source')
assert.equal(await evaluate(`document.getElementById('section-referensi-S8').querySelector('a').target`), '_blank', 'The external reference opens separately from the article')
const directHistory = await cdp('Page.getNavigationHistory')
const directEntry = directHistory.entries[directHistory.currentIndex]
if (directHistory.currentIndex > 0) {
  await cdp('Page.navigateToHistoryEntry', { entryId: directHistory.entries[directHistory.currentIndex - 1].id })
  await sleep(200)
  await cdp('Page.navigateToHistoryEntry', { entryId: directEntry.id })
  const forwardReference = await waitForSourceVisible('S8')
  assert.ok(forwardReference.visible, 'Browser Forward restores the individual source target')
}

await open(`${origin}/terapi/nyeri-punggung-kehamilan`)
await evaluate(`document.querySelector('.therapy-article__contents a:last-child').click()`)
let sectionSourcesOpen = false
for (let attempt = 0; attempt < 40 && !sectionSourcesOpen; attempt += 1) {
  sectionSourcesOpen = await evaluate(`document.querySelector('#section-referensi details')?.open === true`)
  if (!sectionSourcesOpen) await sleep(50)
}
assert.equal(sectionSourcesOpen, true, 'The section Sources anchor opens its disclosure')
assert.ok((await evaluate('location.hash')) === '#section-referensi', 'The section Sources anchor changes the fragment')

await open(`${origin}/terapi/nyeri-punggung-kehamilan`)
const keyboardState = await evaluate(`(() => {
  const link = document.querySelector('.therapy-detail__step-sources a')
  link?.focus()
  return { focused: document.activeElement === link, tabIndex: link?.tabIndex, href: link?.href }
})()`)
assert.equal(keyboardState.focused, true, 'Source links accept keyboard focus')
assert.ok(keyboardState.tabIndex >= 0 && keyboardState.href.includes('#section-referensi-S26'), 'Source links remain in the natural tab order and expose their anchor destination')
await evaluate(`document.querySelector('.therapy-detail__step-sources a').click()`)
const clickedSource = await waitForSourceVisible('S26')
assert.equal(await evaluate('location.hash'), '#section-referensi-S26', 'Activating an individual source opens its exact anchor')
assert.ok(clickedSource.visible && clickedSource.open, 'The individual source is visible and its disclosure is open')
const sourceHistory = await cdp('Page.getNavigationHistory')
const sourceEntry = sourceHistory.entries[sourceHistory.currentIndex]
assert.ok(sourceHistory.currentIndex > 0, 'The individual source link creates navigable browser history')
await cdp('Page.navigateToHistoryEntry', { entryId: sourceHistory.entries[sourceHistory.currentIndex - 1].id })
await sleep(150)
assert.equal(await evaluate('location.hash'), '', 'Browser Back returns from the individual source anchor')
await cdp('Page.navigateToHistoryEntry', { entryId: sourceEntry.id })
const restoredSource = await waitForSourceVisible('S26')
assert.ok(restoredSource.visible, 'Browser Forward returns to the visible individual source anchor')

await open(`${origin}/terapi`)
await evaluate(`window.scrollTo(0, document.documentElement.scrollHeight)`)
const priorY = await evaluate('window.scrollY')
assert.ok(priorY > 300, 'Catalog scrolls to lower cards')
await evaluate(`[...document.querySelectorAll('a')].filter((a) => a.classList.contains('therapy-row'))[7].click()`)
await sleep(150)
assert.ok((await evaluate('window.scrollY')) <= 1, 'Opening a card resets detail to the top')
await cdp('Page.navigateToHistoryEntry', { entryId: (await cdp('Page.getNavigationHistory')).entries.slice(-2)[0].id })
await sleep(350)
assert.ok((await evaluate('window.scrollY')) > 250, 'Browser Back restores catalog position')

await open(`${origin}/sumber`)
const publicSourceState = await evaluate(`(() => {
  const rows = [...document.querySelectorAll('.information-source-list > li')]
  const text = document.querySelector('.information-source-list')?.textContent ?? ''
  return {
    count: rows.length,
    categorized: rows.every((row) => row.querySelector('.information-source__category')?.textContent.trim()),
    hasGuideline: text.includes('Pedoman WHO'),
    hasOfficialHealthInfo: text.includes('ACOG'),
    exposesOldCochrane: text.includes('Cochrane: Teknik relaksasi saat persalinan') || text.includes('Cochrane: Pijat dan metode manual saat persalinan'),
    sourceLinks: rows.every((row) => row.querySelector('a[href^="https://"]')),
  }
})()`)
assert.ok(publicSourceState.count > 0 && publicSourceState.categorized && publicSourceState.sourceLinks, 'Public source directory lists categorized sources with working external URLs')
assert.equal(publicSourceState.hasGuideline, true, 'WHO guideline remains public')
assert.equal(publicSourceState.hasOfficialHealthInfo, true, 'ACOG information remains public')
assert.equal(publicSourceState.exposesOldCochrane, false, 'Historical Cochrane reviews are excluded from the public source directory')

for (const guidePath of ['/panduan/hamil', '/panduan/bersalin']) {
  await open(`${origin}${guidePath}`)
  const guideState = await evaluate(`(() => {
    const ids = [...document.querySelectorAll('.content-disclosure__source-id')].map((node) => node.textContent.trim())
    const sourceRows = [...document.querySelectorAll('.content-disclosure__sources > li')]
    return {
      heading: document.querySelector('h1')?.textContent.trim(),
      ids,
      categories: sourceRows.every((row) => row.querySelector('.content-disclosure__source-category')?.textContent.trim()),
    }
  })()`)
  assert.ok(guideState.heading, `${guidePath} renders its guide title`)
  assert.ok(guideState.ids.length > 0 && guideState.categories, `${guidePath} shows categorized sources`)
  assert.equal(guideState.ids.some((id) => ['S3', 'S4', 'S28'].includes(id)), false, `${guidePath} omits historical sources as current evidence`)
}

await open(`${origin}/evaluasi`)
assert.ok(await evaluate('Boolean(document.querySelector("main"))'), 'Evaluation route remains available')

await open(`${origin}/relaksasi`)
const audioState = await evaluate(`({ tracks: document.querySelectorAll('audio').length, controls: document.querySelectorAll('audio[controls]').length })`)
assert.ok(audioState.tracks >= 1, 'Relaxation page keeps its audio player available')
assert.deepEqual(pageErrors, [], 'No uncaught JavaScript exceptions')

await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await open(`${origin}/terapi`)
const catalogDesktopState = await evaluate(`(() => ({
  images: [...document.querySelectorAll('.therapy-row img')].every((image) => image.complete && image.naturalWidth > 0),
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
}))()`)
assert.equal(catalogDesktopState.images, true, 'Catalog thumbnails load at desktop width')
assert.equal(catalogDesktopState.overflow, false, 'Catalog has no horizontal overflow at desktop width')
const catalogDesktop = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
await writeFile(resolve(`${evidenceDir}/catalog-desktop-1440x900.png`), Buffer.from(catalogDesktop.data, 'base64'))
await cdp('Page.navigate', { url: pathToFileURL(resolve(`${evidenceDir}/photo-contact-sheet.html`)).href })
await sleep(300)
await evaluate(`Promise.all([...document.images].map((image) => image.decode()))`)
const metrics = await cdp('Page.getLayoutMetrics')
const contentHeight = Math.ceil(metrics.cssContentSize.height)
const contactSheet = await cdp('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width: 1440, height: contentHeight, scale: 1 },
})
await writeFile(resolve(`${evidenceDir}/photo-contact-sheet-final-1440.png`), Buffer.from(contactSheet.data, 'base64'))
await cdp('Emulation.clearDeviceMetricsOverride')
socket.close()
console.log(`M2 Chromium CDP QA passed: ${routes.length} articles × ${viewportSizes.length} viewport sizes, reduced motion, figures, captions, guidance, source anchors, Back restoration, audio route, no overflow or JS exceptions.`)
console.log('Keyboard source links were verified as focusable semantic anchors. This CDP session did not deliver synthetic Tab/Enter input to page content; real key activation remains manual QA.')
