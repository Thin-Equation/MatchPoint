import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: true,
    host: true,
    port: 80
    ,
    proxy: {
      '/api': {
        target: 'https://freematchpoint.com',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
  }
})
