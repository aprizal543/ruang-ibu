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
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#f8f4ee',
        background_color: '#f8f4ee',
        icons: [],
      },
      injectManifest: {
        globPatterns: ['**/*.{html,js,css,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
  ],
})
