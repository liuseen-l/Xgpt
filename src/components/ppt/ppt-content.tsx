import clsx from 'clsx'
import type { ChangeEvent } from 'react'
import React, { useRef, useState } from 'react'
import { Button, Input } from 'antd'
import styles from './ppt-card.module.scss'
import { getTimeUnixStr } from '~/utils/common'
import { fetchCreatePPT, fetchPPTOutline } from '~/api/ppt'
import { recoverPPTOutline } from '~/api/ppt/helper'
import { fetchStopSend } from '~/api'

const RECOMMEND_CONFIG = [
  {
    text: '四大名著读书报告',
  },
  {
    text: '英语语用学视角下的性别差异研究',
  },
  {
    text: '年终工作总结',
  },
  {
    text: '互联网+时代下的用户行为分析与营销策略',
  },
]

interface CardItemProps {
  isUser?: boolean
  children?: React.ReactNode
  className?: string
}

const CardItem: React.FC<CardItemProps> = ({ isUser, children, className }) => {
  return (
    <div className={clsx('max-w-720px mb-16px p-12px rounded-10px  text-#222 fs-14', !isUser ? 'rounded-bl-0 bg-#eff7ff w-fit float-left' : 'bg-#fff w-720px rounded-br-0 float-right', styles.wrapper, className)}>
      {
        children
      }
    </div>
  )
}

interface OutlineInfo {
  title: string
  list: {
    isSub: boolean
    subTitle: string
    id: number
  }[]
}

interface OutlineProps {
  info: OutlineInfo
  hanldeChange: (idx: number, item: OutlineInfo['list'][number]) => void
  handleAddOrRemove: (idx: number, isSub?: boolean) => void
}

const Outline: React.FC<OutlineProps> = ({ info, handleAddOrRemove, hanldeChange }) => {
  const { list, title } = info

  const renderInput = (item: OutlineInfo['list'][number], idx: number) => {
    const { isSub, subTitle, id } = item

    return (
      <Input
        value={subTitle}
        placeholder="请输入标题内容"
        className="border-transparent h-36px group"
        maxLength={100}
        onChange={(e) => {
          hanldeChange(idx, {
            subTitle: e.currentTarget.value,
            isSub,
            id,
          })
        }}
        prefix={
          isSub
            ? <div className="i-tabler-point-filled w-13px ml-5px bg-black fs-8 flex ai-c jc-c"></div>
            : <div className="i-tabler-point w-13px ml-16px bg-black fs-8 flex ai-c jc-c"></div>
        }
        suffix={(
          <div className="outline-suffix flex ai-c jc-c gap-5px invisible important-group-focus:visible important-group-hover:visible">
            <div className="i-material-symbols-remove cursor-pointer" onClick={() => handleAddOrRemove(idx)}></div>
            <div className="i-material-symbols-add cursor-pointer" onClick={() => handleAddOrRemove(idx, isSub)}></div>
            {

              isSub
                ? (
                  <div
                    className="i-bi-text-indent-left cursor-pointer"
                    onClick={() => {
                      hanldeChange(idx, {
                        subTitle,
                        isSub: false,
                        id,
                      })
                    }}
                  >
                  </div>
                  )
                : (
                  <div
                    className="i-bi-text-indent-right cursor-pointer"
                    onClick={() => {
                      hanldeChange(idx, {
                        subTitle,
                        isSub: true,
                        id,
                      })
                    }}
                  >
                  </div>
                  )
            }
          </div>
        )}
      >
      </Input>
    )
  }

  return (
    <>
      {
        list && (
          <>
            <Input
              value={title}
              placeholder="请输入标题内容"
              className="border-transparent h-36px fw-700"
              maxLength={100}
            >
            </Input>
            {
              list.map((i, idx) => {
                return (
                  <div key={idx}>
                    {
                      renderInput(i, idx)
                    }
                  </div>
                )
              })
            }
          </>
        )
      }

    </>
  )
}

const Content: React.FC = () => {
  const [showRec, setShowRec] = useState(true)
  const [search, setSearch] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [hasSend, setHasSend] = useState(false)
  const [isStop, setStop] = useState(false)
  const [isGen, setGen] = useState(false)

  const cid = useRef('')

  const hanldeSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setShowRec(!value.length)
    setSearch(value)
  }

  const [outline, setOutline] = useState({} as OutlineInfo)

  const handleSend = async (content?: string) => {
    if (isLoading)
      return
    setLoading(true)
    setHasSend(true)
    cid.current = getTimeUnixStr()
    const data = await fetchPPTOutline({
      content: content || search,
      isRebuild: false,
      cid: cid.current,
    })
    if (data)
      setOutline(data)
    setLoading(false)
    setStop(false)
  }

  const handleClick = (content: string) => {
    setSearch(content)
    handleSend(content)
  }

  const handleAddOrRemove = (idx: number, isSub?: boolean) => {
    const temp = [...outline.list]

    if (isSub !== undefined) {
      temp.splice(idx + 1, 0, {
        subTitle: '',
        isSub,
        id: 123456, // id值不影响，但是必须传
      })
    }
    else {
      temp.splice(idx, 1)
    }

    setOutline({
      ...outline,
      list: temp,
    })
  }

  const hanldeChange = (idx: number, info: OutlineInfo['list'][number]) => {
    const temp = [...outline.list]
    const { subTitle, isSub, id } = info
    temp[idx] = {
      isSub,
      subTitle,
      id,
    }
    setOutline({
      ...outline,
      list: temp,
    })
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLSpanElement>) => {
    setGen(true)
    const resolved = recoverPPTOutline(outline as any)
    const data = await fetchCreatePPT({
      ...resolved,
      cid: getTimeUnixStr(),
      isRebuild: false,
    })
    setGen(false)

    requestAnimationFrame(() => {
      const root = (e.target as HTMLSpanElement).parentNode!
      const dom = document.createElement('iframe')
      dom.setAttribute('src', `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(data.replication)}`)
      dom.setAttribute('width', '720px')
      dom.setAttribute('height', '600px')
      dom.setAttribute('style', 'margin-top:10px')
      root?.appendChild(dom)
      // root?.removeChild(btn)
    })
  }

  const handleCancel = async () => {
    setStop(true)
    await fetchStopSend({
      cid: cid.current,
    })
  }

  return (
    <>
      <div className="of-x-hidden">
        {
          isLoading && (
            <Button onClick={handleCancel} type="primary" loading={isStop} className="absolute left-50% top-90%">
              停止生成
            </Button>
          )
        }
        <CardItem>
          <div className="flex ai-c gap-8px jc-c overflow-hidden">
            <div className="i-streamline-emojis-robot-face-1 fs-16 "></div>
            <div className="mt-2px">Hi👋我是你的Xgpt AI 小助手，今天你想创作什么主题的 PPT 呢？我都可以帮到你哦~</div>
          </div>
        </CardItem>
        <CardItem isUser>
          <Input
            value={search}
            placeholder="请输入你想创作的主题"
            showCount
            onChange={hanldeSearchChange}
            maxLength={400}
            suffix={(
              <Button disabled={!search.length} type="link" onClick={() => handleSend()} className="p-0">
                <div className={`i-mingcute-send-plane-fill fs-20 ${search.length ? 'color-#468bd6' : 'color-#a7ccf3'}`}></div>
              </Button>
            )}
          />
          <div className="fs-12 text-#666 mt-12px lh-16px ">猜你想创作的PPT主题：</div>
          {
            showRec && (
              <div className="flex flex-wrap w-100% gap-10px mt-10px">
                {
                  RECOMMEND_CONFIG.map((i) => {
                    return <Button key={i.text} onClick={() => handleClick(i.text)} className="bg-#2182ac1a important:hover:bg-#2182ac1a important:hover:text-black hover:b-1-#2174ac b-1-transparent focus:b-1-#2174ac important:focus:fw-700 important:focus:text-#2174ac ">{i.text}</Button>
                  })
                }
              </div>
            )
          }
        </CardItem>
        {
          hasSend && (
            <>
              <CardItem>
                <div className="flex ai-c gap-8px jc-c overflow-hidden">
                  <div className="i-streamline-emojis-robot-face-1 fs-16"></div>
                  <div className="mt-3px">我会根据这个主题帮你生成一份大纲，大纲完成后可制作PPT，请稍等~</div>
                </div>
              </CardItem>
              {
                isLoading
                  ? (
                    <CardItem isUser className="rounded-bl-0">
                      <div className="i-svg-spinners-3-dots-scale fs-22 color-#a7ccf3"></div>
                    </CardItem>
                    )
                  : (outline?.list?.length
                  && (
                    <CardItem isUser className="rounded-bl-0">
                      <div className="text-#666 fs-14 mb-16px">您可以编辑此大纲，或按原样继续</div>
                      <Outline handleAddOrRemove={handleAddOrRemove} hanldeChange={hanldeChange} info={outline}></Outline>
                      <Button loading={isGen} onClick={handleSubmit} className="w-100% mt-10px" type="primary">生成PPT</Button>
                    </CardItem>
                  ))
              }
            </>
          )
        }
      </div>
    </>
  )
}

export default Content
