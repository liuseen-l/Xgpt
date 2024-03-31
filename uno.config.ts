import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts } from 'unocss'

const flexMap = {
  a: 'space-around',
  b: 'space-between',
  c: 'center',
  e: 'end',
  s: 'start',
}

const directionMap = {
  t: 'top',
  l: 'left',
  r: 'right',
  b: 'bottom',
}

export default defineConfig({
  shortcuts: [
    {
      'switch-animation': 'transition-all duration-300',
      /** app bg base */
      'bg-base': 'bg-[#fff] dark:bg-[#1e1e1e] switch-animation',
      /** chatroom side bg base */
      'siderbar-bg-base': 'bg-[#e7f8ff] dark:bg-[rgba(24,24,24,1)] switch-animation',
      /** app text base */
      'text-base': 'text-black dark:text-white switch-animation',
    },
    [/^([tlrb])?border-base$/, ([, d]) => `b${d || ''}-1-rgba(0,0,0,.1) dark:b${d || ''}-1-#a3a6a9 switch-animation`],
  ],
  rules: [
    /** justify-content: center */
    [/^jc-([a-z])$/, ([, d]) => ({ 'justify-content': `${flexMap[d]}` })],
    /** align-items: center */
    [/^ai-([a-z])$/, ([, d]) => ({ 'align-items': `${flexMap[d]}` })],
    /** font-size: 1px */
    [/^fs-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })],
    [/^text-hidden$/, ([, _d]) => ({
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    })],
    /** border-top: 1px solide red */
    [/^b([tlrb])?-(\d+)-(.+)$/, ([, d, s, c]) => {
      const key = `border${directionMap[d] ? `-${directionMap[d]}` : ''}`
      return ({ [key]: `${s}px solid ${c}` })
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
