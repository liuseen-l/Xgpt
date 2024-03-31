import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  shortcuts: {
    'switch-animation': 'transition duration-300',
    'bg-base': 'bg-#fff dark:bg-[#1e1e1e] switch-animation',
    'siderbar-bg-base': 'bg-[#f0f0f0] dark:bg-[#121212] switch-animation',
    'text-base': 'text-black dark:text-white switch-animation',
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetWebFonts(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'min-width': '1.2em',
      },
    }),
  ],
})
