import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare global {
  interface Window {
    __WB_MANIFEST: Array<string | { revision: string | null; url: string }>
  }
}

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// The SPA shell is precached, so a direct navigation to a known client route
// can load its route data from the bundled application code while offline.
const appShellHandler = createHandlerBoundToURL('/index.html')
registerRoute(
  new NavigationRoute(appShellHandler, {
    denylist: [/^\/audio\//, /^\/images\//, /^\/pwa-icons\//],
  }),
)
