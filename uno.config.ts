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

function resolveBtnBase(s: string | string[]) {
  const atr = ['hover', 'focus']
  if (Array.isArray(s)) {
    return s.reduce((_pre, _cur) =>
      (_pre + atr.reduce((pre, cur) => `important:${cur}:${_cur} ${pre}`, '')), '')
  }
  return atr.reduce((pre, cur) => `important:${cur}:${s} ${pre}`, '')
}

export default defineConfig({
  shortcuts: [
    {
      'switch-animation': 'transition duration-300',
      /** app bg base */
      'bg-base': 'bg-[#fff] dark:bg-[#1e1e1e] switch-animation',
      'logo-bg-base': 'fill-[#8bcae0] dark:fill-[#3c5159] switch-animation',
      /** chatroom side bg base */
      'siderbar-bg-base': 'bg-[#e7f8ff] dark:bg-[#1b262a] switch-animation',
      'bubble-bg-base': 'bg-[rgba(0,0,0,.05)] dark:bg-neutral-900 switch-animation',
      'bubble-bg-base-user': 'bg-[#e7f8ff] dark:bg-[#1b262a] switch-animation',
      /** app text base */
      'text-base': 'text-black dark:text-neutral-200 switch-animation',
      'action-base': 'hover:bg-[#f2f2f2] dark:hover:bg-neutral-700 switch-animation',
      'sub-text-base': 'text-neutral-400 dark:text-neutral-500 switch-animation',
      'btn-base': `border-none hover:filter-brightness-95 ${resolveBtnBase(['text-[#1d93ab]', 'dark:bg-[#1e1e1e]'])} dark:bg-[#1e1e1e] bg-[#fff] switch-animation`,
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
