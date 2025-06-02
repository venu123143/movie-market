import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist'  // This is default, just be explicit
  },
  preview: {
    host: '0.0.0.0', // Ensure the server listens on all interfaces
    port: 4173,
    strictPort: true,
    allowedHosts: [
      'moviemarket.nerchuko.in',
      'localhost',
      '127.0.0.1'
    ]
  }
})