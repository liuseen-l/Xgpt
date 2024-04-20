import path from 'node:path'
import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },

  },
  plugins: [
    UnoCSS(),
    React(),
  ],
})
