import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Reactor Theory',
        short_name: 'RT',
        theme_color: '#02040a',
        background_color: '#02040a',
        display: 'standalone'
      }
    })
  ]
})
