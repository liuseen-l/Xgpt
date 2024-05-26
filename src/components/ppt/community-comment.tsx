import { Avatar, Button, Divider, Empty, Image, Modal, Rate, Skeleton, Spin } from 'antd'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import styles from './ppt-community.module.scss'
import { fetchComment, fetchReply, fetchReplyList, fetchScors } from '~/api/ppt'
import type { ResponseCommentList, ResponsePPTList, ResponseReplyList } from '~/api/ppt/types'
import { useCommentList } from '~/utils'

type MakePropertyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
interface CommentItemProps {
  info: MakePropertyOptional<ResponseCommentList['data']['list'][number], 'replyAmount'>
  size?: number
  handleReply?: (p: Record<string, string>) => void
  className?: string
}
const CommentItem: React.FC<CommentItemProps> = ({ info, size = 50, className, handleReply }) => {
  return (
    <div className={clsx('flex my-15px', className)}>
      <Avatar className="mr-10px" size={size} src={info.headshot} />
      <div className="flex flex-1 flex-col">
        <div className="text-neutral-5">{info.username}</div>
        <div className="text-#0a0a0a">
          {info.content}
        </div>
        <div className="text-neutral-5">{info.createTime}</div>
        {
          handleReply
          && (
            <div className="flex gap-10px ai-c">
              <div className="flex gap-3px jc-c ai-c text-neutral-6 cursor-pointer">
                <div className="i-iconamoon-comment-light"></div>
                <div>{info.replyAmount}</div>
              </div>
              <span
                className="fs-12 text-blue-4 cursor-pointer"
                onClick={() => {
                  handleReply && handleReply({
                    commentCode: info.commentCode,
                    pptCode: info.pptCode,
                    userName: info.username,
                    commentContent: info.content,
                  })
                }}
              >
                回复
              </span>
            </div>
          )
        }
      </div>
    </div>
  )
}

interface ReplyProps {
  commentCode: string
  replyInfo: Record<string, any>
}
const Reply: React.FC<ReplyProps> = ({ commentCode, replyInfo }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<ResponseReplyList['data']>({ list: [], hasMore: true } as any)

  if (replyInfo.commentCode === commentCode && replyInfo.replyRes?.replyCode && !data.list?.find(i => i.replyCode === replyInfo.replyRes.replyCode)) {
    setData({
      ...data,
      list: [replyInfo.replyRes, ...data.list],
    })
  }

  const handleLoad = async (page: number, size: number, load?: boolean) => {
    setIsLoading(true)
    const res = await fetchReplyList({
      page,
      size,
      commentCode,
    })
    setData({
      ...res,
      list: load ? [...res.list] : [...data.list, ...res.list],
    })
    setIsLoading(false)
  }

  useEffect(() => {
    handleLoad(1, 1)
  }, [])

  const handleLoadMore = () => {
    handleLoad(page, 5, page === 1)
    setPage(page + 1)
  }

  if (!data.list?.length)
    return

  return (
    <div className="ml-50px">
      {
        data.list?.map((i, idx) => {
          return (
            <div key={idx}>
              <CommentItem className="important:my-5px" size={35} info={i}></CommentItem>
            </div>
          )
        })
      }
      {
        data.hasMore
        && (isLoading
          ? <div className="flex jc-c"><Spin></Spin></div>
          : (
            <div className="lh-32px text-blue-4 fs-14 cursor-pointer" onClick={handleLoadMore}>
              {
                page === 1
                  ? `展开 ${data.total - 1} 回复`
                  : '展开更多回复'
              }
            </div>
            ))
      }
    </div>
  )
}

interface CommentProps {
  currentPPT: ResponsePPTList['data']['list'][number]
  handleUpdatePPTDetail: (pptCode: string) => Promise<void>
  setOpenComment: React.Dispatch<React.SetStateAction<boolean>>
}

// 评论组件
const Comment: React.FC<CommentProps> = ({ currentPPT, setOpenComment, handleUpdatePPTDetail }) => {
  const comRef = useRef(null)
  const { useFn, data, isLoading, isInit } = useCommentList(currentPPT.pptCode)

  useEffect(() => {
    (comRef.current as any).addEventListener('scroll', useFn)
    return () => {
      window.removeEventListener('scroll', useFn)
    }
  }, [])

  const inputRef = useRef(null)

  const [isComment, setIsComment] = useState(false)
  const [replyInfo, setReplyInfo] = useState<Record<string, any>>({ replyUserName: '', content: '', isReply: false, commentCode: '', replyRes: {} })
  const handleComment = async () => {
    const content = (inputRef.current as any).textContent
    setIsComment(true)
    if (!replyInfo.isReply) {
      const res = await fetchComment({
        pptCode: currentPPT.pptCode,
        content,
      })
      if (res)
        data.current.list?.unshift(res)
    }
    else {
      const res = await fetchReply({
        pptCode: currentPPT.pptCode,
        content,
        commentCode: replyInfo.commentCode,
      })
      if (res) {
        setReplyInfo({
          ...replyInfo,
          isReply: false,
          replyRes: res,
        })
      }
    }
    setIsComment(false);
    (inputRef.current as any).textContent = ''
  }

  const handleReply = (p: Record<string, string>) => {
    setReplyInfo({
      content: p.commentContent,
      replyUserName: p.userName,
      commentCode: p.commentCode,
      isReply: true,
    })
  }

  const [isScoreOpen, setIsScoreOpen] = useState(false)
  const scores = useRef([0, 0, 0])
  const handlePushStars = async () => {
    const [score1, score2, score3] = scores.current
    await fetchScors({
      score1,
      score2,
      score3,
      pptCode: currentPPT.pptCode,
    })
    await handleUpdatePPTDetail(currentPPT.pptCode)
    setIsScoreOpen(false)
    scores.current = [0, 0, 0]
  }

  return (
    <>
      <Modal
        title="您对PPT满意吗？"
        open={isScoreOpen}
        onOk={() => {
          handlePushStars()
        }}
        okText="确定"
        cancelText="取消"
        onCancel={() => setIsScoreOpen(false)}
      >
        <div className="flex flex-col gap-5px">
          <div>
            <span>内容质量：</span>
            <Rate
              allowHalf
              defaultValue={0}
              onChange={(e) => {
                scores.current[0] = e
              }}
            />
          </div>
          <div>
            <span>主题风格：</span>
            <Rate
              allowHalf
              defaultValue={0}
              onChange={(e) => {
                scores.current[1] = e
              }}
            />
          </div>
          <div>
            <span>视觉效果：</span>
            <Rate
              allowHalf
              defaultValue={0}
              onChange={(e) => {
                scores.current[2] = e
              }}
            />
          </div>
        </div>
      </Modal>
      <div
        onClick={() => {
          setOpenComment(false)
        }}
        className="absolute z-300 left-[-80px] top-[0px] bg-[rgba(64,64,64,0.25)] w-40px h-40px rounded-50% flex jc-c ai-c cursor-pointer"
      >
        <div className="i-ic-outline-close text-#fff fs-20"></div>
      </div>
      <div className="relative h-[calc(100vh-140px)] flex flex-col">
        <div
          ref={comRef}
          className="flex-1 w-100% of-auto scroll-bar-none"
        >
          {/* header */}
          <div className="w-100% flex flex-col">
            <div className="flex">
              <Avatar className="cursor-pointer mr-15px" size={50} src={currentPPT.headshot} />
              <div className="flex flex-1 jc-b ai-c fs-18">
                <span className="fw-700">{currentPPT.username}</span>
                <Button
                  type="primary"
                  onClick={() => {
                    requestAnimationFrame(() => {
                      const dom = document.createElement('a')
                      dom.setAttribute('href', currentPPT.pptUrl)
                      dom.click()
                    })
                  }}
                >
                  下载PPT
                </Button>
              </div>
            </div>
            <div className="flex gap-10px fs-14 text-neutral-5 h-35px ai-c ">
              <div className="flex jc-c ai-c gap-5px">
                <div className="i-line-md-watch"></div>
                <span>{`阅读量 ${currentPPT.seeAmount}`}</span>
              </div>
              <div className="flex jc-c ai-c gap-5px">
                <div className="i-fluent-star-checkmark-24-regular"></div>
                <span>{`被${currentPPT.collectAmount}个专栏收藏`}</span>
              </div>
            </div>
            {/* descri */}
            <div>
              <div className="lh-6">这是一个很好看的模板</div>
              <div className="lh-8 flex gap-10px">
                {
                  [currentPPT.firstKind, currentPPT.secondKind].map((i, idx) => {
                    return (
                      <a className="text-#4a8fde" key={idx}>
                        #
                        {i}
                      </a>
                    )
                  })
                }
              </div>
            </div>
            <div className="flex jc-b">
              <Image
                className="rounded-8px"
                width={480}
                src={currentPPT.coverUrl}
              >
              </Image>
              <div className="mr-20px">
                <span className="mr-10px">综合得分</span>
                <Rate disabled value={currentPPT.score} className="fs-14" />
                {
                  !currentPPT.haveScored && (
                    <div className="flex ai-c mt-20px jc-e gap-5px">
                      <div className="i-material-symbols-family-star-outline-sharp text-yellow-3"></div>
                      <span className="fs-14 text-blue-4 cursor-pointer" onClick={() => setIsScoreOpen(true)}>快来评价吧</span>
                    </div>
                  )
                }
              </div>
            </div>
            <div className="text-neutral-5 lh-8">
              {`发布于 ${currentPPT.createTime}`}
            </div>
          </div>
          {/* footer */}
          <Divider className="my-10px"></Divider>
          <div className="bg-#fff box-border p-20px rounded-20px">
            <div className="fs-14 text-neutral-5">{`共 ${currentPPT.commentAmount} 条评论`}</div>
            <div>
              {
                data.current.list.length === 0 && !data.current.hasMore
                && (
                  <div>
                    <Empty description="暂无评论，快来评论吧" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                )

              }
              {data.current.list?.map((i) => {
                return (
                  <div key={i.commentCode}>
                    <CommentItem info={i} handleReply={handleReply}></CommentItem>
                    <Reply replyInfo={replyInfo} commentCode={i?.commentCode}></Reply>
                  </div>
                )
              })}
              {
                isInit && <Skeleton className="mt-50px" avatar paragraph={{ rows: 4 }} />
              }
              {
                isLoading && <div className="flex jc-c"><Spin /></div>
              }
              {
                !!data.current.list.length && !data.current.hasMore && (
                  <div>
                    <Empty description="暂无更多消息~" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="w-100% mt-15px box-border bt-1-#ccc flex flex-col jc-a p-16px pb-0 gap-10px box-border">
          {
            replyInfo.isReply && (
              <div className="flex flex-col fs-14 w-100%">
                <span className=" text-neutral-5">
                  {`回复 ${replyInfo.replyUserName}`}
                </span>
                <span className="mt-5px text-hidden">
                  {replyInfo.content}
                </span>
              </div>
            )
          }
          <div className={styles['input-bg']}>
            <p ref={inputRef} contentEditable={true} className={clsx(styles['comment-input'], 'scroll-bar-none')}></p>
          </div>
          <div className="flex jc-e ai-c ">
            <Button loading={isComment} type="primary" className="mr-10px w-80px h-40px rounded-44px" onClick={handleComment}>发送</Button>
            <Button className="mr-10px w-80px h-40px rounded-44px" onClick={() => setOpenComment(false)}>取消</Button>
          </div>
        </div>
      </div>
    </>

  )
}

export default Comment
