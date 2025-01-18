import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/auth": {
        target: "http://localhost:8081", // Проксируем запросы аутентификации
        changeOrigin: true,
        secure: false,
      },
      "/api/notes": {
        target: "http://localhost:8080", // Проксируем запросы к заметкам
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
