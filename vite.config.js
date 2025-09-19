import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

/**
 * BACKEND_URL:
 * - En dev pon en .env.local: VITE_BACKEND_URL=https://maps-backend-ep03.onrender.com
 * - Si quieres usar local:   VITE_BACKEND_URL=http://localhost:3000
 */
const BACKEND = process.env.VITE_BACKEND_URL || 'https://maps-backend-ep03.onrender.com'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,           // puedes usar 8081 si prefieres
    cors: true,
    proxy: {
      // REST API
      '/api': {
        target: BACKEND,
        changeOrigin: true,
        secure: BACKEND.startsWith('https'), // true para Render
        // si usas cookies y necesitas que el dominio sea localhost:
        // cookieDomainRewrite: 'localhost',
        // timeout opcional
        // timeout: 60 * 1000,
      },
      // Socket.IO (WebSocket + fallback)
      '/socket.io': {
        target: BACKEND,
        ws: true,
        changeOrigin: true,
        secure: BACKEND.startsWith('https'), // true para Render
        // timeout opcional
        // timeout: 60 * 1000,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          maps: ['@googlemaps/js-api-loader'],
          socket: ['socket.io-client'],
        },
      },
    },
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
})
