import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/auth': {
        target: 'https://dz5rvnxq1a.execute-api.us-east-2.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1': {
        target: 'https://dz5rvnxq1a.execute-api.us-east-2.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})