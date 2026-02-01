import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    // Garante minificação máxima
    minify: 'esbuild', 
    rollupOptions: {
      output: {
        // Separa bibliotecas de terceiros (vendor) do seu código
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
        },
      },
    },
  },
})