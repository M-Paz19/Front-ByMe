/// <reference types="vitest" />
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
        headers: {
          origin: 'https://front-by-me.vercel.app',
        },
      },
      '/api/v1': {
        target: 'https://dz5rvnxq1a.execute-api.us-east-2.amazonaws.com',
        changeOrigin: true,
        secure: true,
        headers: {
          origin: 'https://front-by-me.vercel.app',
        },
      },
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.*',
        '**/*.d.ts',
        'src/main.tsx',
        'src/app/data/mockData.ts',
      ],
    },
  },
})