// vite.config.ts
import path, { resolve } from 'node:path'
import { defineConfig, mergeConfig } from 'file:///F:/forProjects/Xgpt/node_modules/.pnpm/vite@5.2.4_@types+node@20.12.2_sass@1.72.0/node_modules/vite/dist/node/index.js'
import React from 'file:///F:/forProjects/Xgpt/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.2.4/node_modules/@vitejs/plugin-react/dist/index.mjs'
import UnoCSS from 'file:///F:/forProjects/Xgpt/node_modules/.pnpm/unocss@0.58.6_postcss@8.4.38_vite@5.2.4/node_modules/unocss/dist/vite.mjs'

const __vite_injected_original_dirname = 'F:\\forProjects\\Xgpt'
const modeResolver = {
  app: () => ({
    build: {
      outDir: resolve(__vite_injected_original_dirname, 'server/public'),
      rollupOptions: {
        input: resolve(__vite_injected_original_dirname, 'app/index.html'),
      },
    },
    base: './',
  }),
  web: () => ({}),
}
const vite_config_default = defineConfig(({ mode }) => {
  const baseConfig = modeResolver[mode]()
  return mergeConfig(baseConfig, {
    resolve: {
      alias: {
        '~': path.resolve(__vite_injected_original_dirname, 'src'),
      },
    },
    plugins: [
      UnoCSS(),
      React(),
    ],
  })
})
export {
  vite_config_default as default,
}
// # sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxmb3JQcm9qZWN0c1xcXFxYZ3B0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxmb3JQcm9qZWN0c1xcXFxYZ3B0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9mb3JQcm9qZWN0cy9YZ3B0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGgsIHsgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCB0eXBlIHsgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIG1lcmdlQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBSZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnXG5cbmludGVyZmFjZSBNb2RlUmVzb2x2ZXIge1xuICBhcHA6ICgpID0+IFVzZXJDb25maWdcbiAgd2ViOiAoKSA9PiBVc2VyQ29uZmlnXG59XG5cbmNvbnN0IG1vZGVSZXNvbHZlcjogTW9kZVJlc29sdmVyID0ge1xuICBhcHA6ICgpID0+ICh7XG4gICAgYnVpbGQ6IHtcbiAgICAgIG91dERpcjogcmVzb2x2ZShfX2Rpcm5hbWUsICdzZXJ2ZXIvcHVibGljJyksXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIGlucHV0OiByZXNvbHZlKF9fZGlybmFtZSwgJ2FwcC9pbmRleC5odG1sJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYmFzZTogJy4vJyxcbiAgfSksXG4gIHdlYjogKCkgPT4gKHt9KSxcbn1cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgYmFzZUNvbmZpZyA9IG1vZGVSZXNvbHZlclttb2RlIGFzIGtleW9mIE1vZGVSZXNvbHZlcl0oKVxuICByZXR1cm4gbWVyZ2VDb25maWcoYmFzZUNvbmZpZywge1xuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICd+JzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIFVub0NTUygpLFxuICAgICAgUmVhY3QoKSxcbiAgICBdLFxuICB9KVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVAsT0FBTyxRQUFRLGVBQWU7QUFFL1EsU0FBUyxjQUFjLG1CQUFtQjtBQUMxQyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBSm5CLElBQU0sbUNBQW1DO0FBV3pDLElBQU0sZUFBNkI7QUFBQSxFQUNqQyxLQUFLLE9BQU87QUFBQSxJQUNWLE9BQU87QUFBQSxNQUNMLFFBQVEsUUFBUSxrQ0FBVyxlQUFlO0FBQUEsTUFDMUMsZUFBZTtBQUFBLFFBQ2IsT0FBTyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLE1BQzVDO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLEtBQUssT0FBTyxDQUFDO0FBQ2Y7QUFDQSxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLGFBQWEsYUFBYSxJQUEwQixFQUFFO0FBQzVELFNBQU8sWUFBWSxZQUFZO0FBQUEsSUFDN0IsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLE1BQ3BDO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGLENBQUM7QUFDSCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
