import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  shortcuts: {
    'switch-animation': 'transition duration-300',
    /** app bg base */
    'bg-base': 'bg-#fff dark:bg-[#1e1e1e] switch-animation',
    /** chatroom side bg base */
    'siderbar-bg-base': 'bg-[#f0f0f0] dark:bg-[#121212] switch-animation',
    /** app text base */
    'text-base': 'text-black dark:text-white switch-animation',
  },
  rules: [
    [/^jc-([a-z])/, ([, d]) => {
      const map = {
        a: 'space-around',
        b: 'space-between',
        c: 'center',
        e: 'end',
        s: 'start',
      }
      return ({ 'justify-content': `${map[d]}` })
    }],
  ],
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
