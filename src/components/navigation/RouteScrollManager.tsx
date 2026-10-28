import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

type ScrollPosition = { x: number; y: number }
type ScrollPositions = Record<string, ScrollPosition>

const STORAGE_KEY = 'ruang-ibu:route-scroll:v1'
const MAX_STORED_POSITIONS = 40

function readPositions(): ScrollPositions {
  try {
    const value: unknown = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? '{}')
    return value && typeof value === 'object' ? value as ScrollPositions : {}
  } catch {
    return {}
  }
}

function savePosition(key: string, position: ScrollPosition) {
  try {
    const positions = readPositions()
    positions[key] = position
    const recentPositions = Object.entries(positions).slice(-MAX_STORED_POSITIONS)
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(recentPositions)))
  } catch {
    // Scroll restoration remains best effort when storage is unavailable.
  }
}

function getPosition(key: string): ScrollPosition | undefined {
  const position = readPositions()[key]
  if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) return undefined
  return position
}

function scrollToAnchor(hash: string, pathname: string): (() => void) | null {
  if (!hash) return null

  let id = hash.slice(1)
  try {
    id = decodeURIComponent(id)
  } catch {
    // Keep the literal hash when it is not valid URI encoding.
  }

  let active = true
  let observer: MutationObserver | undefined
  let alignmentTimer: number | undefined
  const timeout = window.setTimeout(() => {
    if (!active) return
    cleanup()
    if (window.location.pathname === pathname && window.location.hash === hash) window.scrollTo(0, 0)
  }, 5000)
  const cleanup = () => {
    active = false
    window.clearTimeout(timeout)
    if (alignmentTimer !== undefined) window.clearTimeout(alignmentTimer)
    observer?.disconnect()
  }

  const alignWhenReady = () => {
    if (!active || window.location.pathname !== pathname || window.location.hash !== hash) {
      cleanup()
      return
    }
    const currentTarget = document.getElementById(id)
    if (!currentTarget) {
      return
    }

    observer?.disconnect()
    const disclosure = currentTarget.closest<HTMLDetailsElement>('details') ?? currentTarget.querySelector<HTMLDetailsElement>('details')
    if (disclosure) disclosure.open = true

    // Wait for fonts and force layout before aligning; this also avoids depending on a throttled rAF
    // when a direct URL is opened in a backgrounded browser tab.
    void document.fonts.ready.then(() => {
      if (!active || window.location.pathname !== pathname || window.location.hash !== hash) return
      // Let React's disclosure update and the browser's native fragment handling settle first.
      alignmentTimer = window.setTimeout(() => {
        if (!active || window.location.pathname !== pathname || window.location.hash !== hash) {
          cleanup()
          return
        }
        const target = document.getElementById(id)
        if (target) {
          target.getBoundingClientRect()
          target.scrollIntoView({ block: 'start', behavior: 'auto' })
        }
        cleanup()
      }, 50)
    })
  }

  observer = new MutationObserver(alignWhenReady)
  observer.observe(document.documentElement, { childList: true, subtree: true })
  alignWhenReady()
  return cleanup
}

function restorePosition(position: ScrollPosition | undefined) {
  if (position) window.scrollTo(position.x, position.y)
  else window.scrollTo(0, 0)
}

export default function RouteScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousLocation = useRef<typeof location | null>(null)

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  useLayoutEffect(() => {
    const previous = previousLocation.current

    if (!previous) {
      previousLocation.current = location
      const cancelAnchorAlignment = scrollToAnchor(location.hash, location.pathname)
      if (cancelAnchorAlignment) return cancelAnchorAlignment
      window.scrollTo(0, 0)
      return
    }

    const entryChanged = previous.key !== location.key
    const pathChanged = previous.pathname !== location.pathname
    const hashChanged = previous.hash !== location.hash

    if (entryChanged) savePosition(previous.key, { x: window.scrollX, y: window.scrollY })
    previousLocation.current = location

    if (location.hash && (hashChanged || pathChanged || entryChanged)) {
      return scrollToAnchor(location.hash, location.pathname) ?? undefined
    }

    if (!entryChanged && !pathChanged && !hashChanged && previous.search === location.search) {
      // React StrictMode replays layout-effect setup after cleanup. Re-arm a pending initial
      // deep link on that replay so its cancelled observer cannot leave the page at the top.
      if (location.hash) return scrollToAnchor(location.hash, location.pathname) ?? undefined
      return
    }

    if (pathChanged) {
      if (navigationType === 'POP') {
        restorePosition(getPosition(location.key))
      } else {
        window.scrollTo(0, 0)
      }
      return
    }

    if (navigationType === 'POP') {
      restorePosition(getPosition(location.key))
    }
  }, [location, navigationType])

  return null
}
