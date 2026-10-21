import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

declare global {
  interface Window {
    __WB_MANIFEST: Array<string | { revision: string | null; url: string }>
  }
}

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)
