import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // For dev server
    allowedHosts: ['moviemarket.nerchuko.in']
  },
  preview: {
    // For vite preview command
    allowedHosts: ['moviemarket.nerchuko.in']
  }
})
