import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src/pwa',
      filename: 'service-worker.ts',
      registerType: 'prompt',
      injectRegister: 'auto',
      manifest: {
        id: '/',
        name: 'Ruang Ibu',
        short_name: 'Ruang Ibu',
        description: 'Ruang edukasi untuk perjalanan kehamilan dan persalinan.',
        lang: 'id',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#f8f4ee',
        background_color: '#f8f4ee',
        icons: [
          {
            src: '/pwa-icons/ruang-ibu-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-icons/ruang-ibu-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-icons/ruang-ibu-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{html,js,css,svg,png,webp,woff2}'],
        globIgnores: ['**/AdminLayout-*.js', '**/AdminLayout-*.css', '**/AdminPages-*.js', '**/AdminLoginPage-*.js', '**/authApi-*.js', '**/auth-context-*.js', '**/admin-*.css'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
  ],
})
