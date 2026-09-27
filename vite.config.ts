import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/analyzeContour': {
        target: 'http://10.1.75.53:3213',
        changeOrigin: true
      },
      '/findCatchment': {
        target: 'http://10.1.75.53:3213',
        changeOrigin: true
      }
    }
  }
})
