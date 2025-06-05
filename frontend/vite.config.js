import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  publicDir: 'public',
  server: {
    // Configuração para redirecionar todas as rotas para index.html (SPA)
    historyApiFallback: {
      disableDotRule: true,
      index: '/',
    },
    port: 3000,
    open: true,
  },  // Configuração para produção
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
      },
    },
  },
})
