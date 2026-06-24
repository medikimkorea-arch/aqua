import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindPlugin from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
  }
})
