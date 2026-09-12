import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'

import { templateCompilerOptions } from '@tresjs/core'
import tailwindcss from '@tailwindcss/vite'

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      ...templateCompilerOptions,
    }),
    glsl(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['vue', 'three'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
