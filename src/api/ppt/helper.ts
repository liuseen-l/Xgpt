import type { ResponsePPTClassify, ResponsePPTOutline } from './types'

export function resolvePPTOutline(data: ResponsePPTOutline['data']) {
  if (!data)
    return
  const { content, outline: { chapters } } = data
  const list = chapters.reduce((pre, cur) => {
    const { chapterTitle, chapterContents, id } = cur
    pre.push({
      subTitle: chapterTitle,
      isSub: true,
      id,
    })
    chapterContents.reduce((_pre, _cur) => {
      const { chapterTitle, id } = _cur
      _pre.push({
        subTitle: chapterTitle,
        isSub: false,
        id,
      })
      return _pre
    }, pre)
    return pre
  }, [] as any)

  const res = {
    title: content,
    list,
    origin: data,
  }

  return res
}

interface RecoverPPTOutline {
  origin: ResponsePPTOutline['data']
  title: string
  list: {
    id: number
    subTitle: string
    isSub: boolean
  }[]
}

export function recoverPPTOutline(data: RecoverPPTOutline) {
  const { origin, list, title } = data
  const chapters = []
  let item: any = {}

  for (let i = 0; i < list.length; i++) {
    const { id, subTitle, isSub } = list[i]

    if (isSub && item.chapterTitle) {
      chapters.push(item)
      item = {}
    }

    if (isSub) {
      item.chartFlag = false
      item.searchFlag = false
      item.chapterTitle = subTitle
      item.id = id
      item.fileUrl = ''
      item.fileType = 0
      item.chapterContents = []
      continue
    }

    item.chapterContents.push({
      chartFlag: 'false',
      searchFlag: 'false',
      fileUrl: '',
      id,
      chapterTitle: subTitle,
      fileType: 0,
    })
  }

  origin.outline.chapters = chapters
  origin.content = title

  return origin
}

export function resolvePPTKinds(list: ResponsePPTClassify['data']) {
  const info: any = {
    firstKinds: [],
    secondKinds: {},
  }

  for (const item of list) {
    info.firstKinds.push(item.firstKind)
    info.secondKinds[item.firstKind] = item.secondKinds
  }

  return info
}
