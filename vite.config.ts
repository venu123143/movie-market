import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist', // Explicit output directory
  },
  preview: {
    host: '0.0.0.0', // Allow access from external networks
    port: 4173,
    strictPort: true,
    allowedHosts: [
      'moviemarket.nerchuko.in', // your custom domain
      'localhost',
      '127.0.0.1',
      '168.119.56.55', // your server’s IP
    ],
  },
})
