import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Served from https://flexfightmaster.github.io/meal-planner/ on GitHub Pages,
// so every asset URL has to start with /meal-planner/.
export default defineConfig({
  base: '/meal-planner/',
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC'),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Meal Planner',
        short_name: 'Meals',
        description: 'Four-week meal plans from your calendars, calories and the recipes you like.',
        theme_color: '#e9c46a',
        background_color: '#1d1d1f',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/meal-planner/',
        scope: '/meal-planner/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
