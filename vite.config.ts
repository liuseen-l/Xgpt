import path, { resolve } from 'node:path'
import type { UserConfig } from 'vite'
import { defineConfig, mergeConfig } from 'vite'
import React from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'

interface ModeResolver {
  app: () => UserConfig
  web: () => UserConfig
}

const modeResolver: ModeResolver = {
  app: () => ({
    build: {
      outDir: resolve(__dirname, 'server/dist'),
      rollupOptions: {
        input: resolve(__dirname, 'h5/index.html'),
      },
    },
    base: './',
  }),
  web: () => ({}),
}
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const baseConfig = modeResolver[mode as keyof ModeResolver]()
  return mergeConfig(baseConfig, {
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
})
