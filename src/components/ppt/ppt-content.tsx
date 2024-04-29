import { escape } from 'node:querystring'
import clsx from 'clsx'
import type { ChangeEvent, MouseEventHandler } from 'react'
import React, { useState } from 'react'
import { Button, Input } from 'antd'
import styles from './ppt-card.module.scss'
import { getTimeUnixStr, sleep } from '~/utils/common'
import { fetchPPTOutline } from '~/api/ppt'

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
  }[]
}

interface OutlineProps {
  info: OutlineInfo
  hanldeChange: (idx: number, item: OutlineInfo['list'][number]) => void
  handleAddOrRemove: (idx: number, isSub?: boolean) => void
}

const Outline: React.FC<OutlineProps> = ({ info, handleAddOrRemove, hanldeChange }) => {
  const { list, title } = info
  console.log(info)

  const renderInput = (item: OutlineInfo['list'][number], idx: number) => {
    const { isSub, subTitle } = item

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

const Content: React.FC = () => {
  const [showRec, setShowRec] = useState(true)

  const [search, setSearch] = useState('')

  const [isLoading, setLoading] = useState(false)

  const [hasSend, setHasSend] = useState(false)
  const hanldeSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setShowRec(!value.length)
    setSearch(value)
  }

  const [outline, setOutline] = useState({} as OutlineInfo)

  const handleSend = async () => {
    if (isLoading)
      return
    setLoading(true)
    setHasSend(true)
    const data = await fetchPPTOutline({
      content: search,
      isRebuild: false,
      cid: getTimeUnixStr(),
    })
    console.log(data)

    setOutline(data)

    setLoading(false)
  }

  const handleClick = (content: string) => {
    setSearch(content)
    handleSend()
  }

  const handleAddOrRemove = (idx: number, isSub?: boolean) => {
    const temp = [...outline.list]

    if (isSub !== undefined) {
      temp.splice(idx + 1, 0, {
        subTitle: '',
        isSub,
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
    const { subTitle, isSub } = info
    temp[idx] = {
      isSub,
      subTitle,
    }
    setOutline({
      ...outline,
      list: temp,
    })
  }

  return (
    <>
      <CardItem>
        <div className="flex ai-c gap-8px jc-c overflow-hidden">
          <div className="i-streamline-emojis-robot-face-1 fs-16 "></div>
          <div className="mt-3px">Hi👋我是你的百度 AI 小助手，今天你想创作什么主题的 PPT 呢？我都可以帮到你哦~</div>
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
            <Button disabled={!search.length} type="link" onClick={handleSend} className="p-0">
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

            <CardItem isUser className="rounded-bl-0">
              {
                (isLoading && !outline.title)
                  ? <div className="i-svg-spinners-3-dots-scale fs-22 color-#a7ccf3"></div>
                  : (
                    <div>
                      <div className="text-#666 fs-14 mb-16px">您可以编辑此大纲，或按原样继续</div>
                      <Outline handleAddOrRemove={handleAddOrRemove} hanldeChange={hanldeChange} info={outline}></Outline>
                    </div>
                    )
              }
            </CardItem>
          </>
        )
      }
    </>
  )
}

export default Content
