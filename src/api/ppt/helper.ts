import type { ResponsePPTOutline } from './types'

export function resolvePPTOutline(data: ResponsePPTOutline['data']) {
  const { content, outline: { chapters } } = data

  const list = chapters.reduce((pre, cur) => {
    const { chapterTitle, chapterContents } = cur
    pre.push({
      subTitle: chapterTitle,
      isSub: true,
    })
    chapterContents.reduce((_pre, _cur) => {
      const { chapterTitle } = _cur
      _pre.push({
        subTitle: chapterTitle,
        isSub: false,
      })
      return _pre
    }, pre)
    return pre
  }, [] as any)

  const res = {
    title: content,
    list,
  }

  return res
}
