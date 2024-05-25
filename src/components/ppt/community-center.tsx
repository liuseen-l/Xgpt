import { Avatar, Button, Divider, Empty, Image, Input, Modal, Pagination, Rate, Skeleton, Spin } from 'antd'
import type { SearchProps } from 'antd/es/input'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import styles from './ppt-community.module.scss'
import LayOut from './content-layout'
import { fetchComment, fetchPPTClassify, fetchPPTCollect, fetchPPTCreateFolder, fetchPPTDetail, fetchPPTFolders, fetchPPTList, fetchReply, fetchReplyList, fetchScors, fetchViewPPT } from '~/api/ppt'
import type { ResponseCommentList, ResponsePPTClassify, ResponsePPTFolders, ResponsePPTList, ResponseReplyList } from '~/api/ppt/types'
import { useCommentList, useMessage } from '~/utils'
import { getAmountStr } from '~/utils/common'

interface ClassfiyProps {
  title: string
  subTitle: string[]
  handleActive: (c: string) => void
  active: string
}

const { success } = useMessage()

const Classfiy: React.FC<ClassfiyProps> = ({ title, subTitle, handleActive, active }) => {
  const [isfold, setIsfold] = useState(false)

  const handleCheck = (str: string) => {
    handleActive(active === str ? '-' : str)
  }

  return (
    <div className="lh-10 w-100% flex ai-s min-h-35px relative">
      <h4
        className={clsx('whitespace-nowrap text-#999  hover:text-blue  cursor-pointer  important:pm-0', active === `${title}-` && 'fw-700 text-blue')}
        onClick={() => {
          const str = `${title}-`
          handleCheck(str)
        }}
      >
        {title}
        :
      </h4>
      <ul className="flex pm-0 ml-10px flex-wrap">
        {
          subTitle.slice(0, 13).map((j, _idx) => {
            return (
              <li
                key={j}
                onClick={() => {
                  const str = `${title}-${j}`
                  handleCheck(str)
                }}
                className={clsx(' list-none cursor-pointer mx-16px box-border text-black hover:text-blue fs-14', active === `${title}-${j}` && 'fw-700 text-blue')}
              >
                {j}
              </li>
            )
          })
        }
        {
          isfold && subTitle.slice(13).map((j, _idx) => {
            return (
              <li
                key={j}
                onClick={() => {
                  const str = `${title}-${j}`
                  handleCheck(str)
                }}
                className={clsx('list-none cursor-pointer mx-16px box-border text-black hover:text-blue fs-14', active === `${title}-${j}` && 'fw-700 text-blue')}
              >
                {j}
              </li>
            )
          })
        }
        {
          subTitle.length > 13 && (
            <div className="fs-14 absolute right-10px cursor-pointer flex ai-c jc-c text-blue-4" onClick={() => setIsfold(!isfold)}>
              {isfold
                ? (
                  <>
                    <span>收起</span>
                    <div className="i-material-symbols-light-keyboard-arrow-up fs-12"></div>
                  </>
                  )
                : (
                  <>
                    <span>展开</span>
                    <div className="i-material-symbols-light-keyboard-arrow-down fs-12"></div>
                  </>
                  )}

            </div>
          )
        }
      </ul>
    </div>
  )
}

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

interface ContentProps {
  // 创建文件夹
  handleChange: (page: number, pageSize: number, config?: any) => void
  list: ResponsePPTList['data']['list']
  total: number
  isLoading: boolean
  currentPageSize: number
  currentPage: number
  handleDeleteUpload?: (c: string) => Promise<void>
}
const { confirm } = Modal

export const Content: React.FC<ContentProps> = ({ handleChange, currentPageSize, currentPage, list, total, isLoading, handleDeleteUpload }) => {
  const [folders, setFolders] = useState<ResponsePPTFolders['data']>([])
  const [item, setItem] = useState<ResponsePPTList['data']['list'][number]>({} as any)
  const [folderName, setFolderName] = useState('')

  const [open, setOpen] = useState(false)
  // 收藏ppt
  const handleCollect = async (folderCode: string) => {
    const data = await fetchPPTCollect({
      pptCode: item.pptCode,
      folderCode,
    })
    success(data)
    setOpen(false)
    // 重新拉数据
    handleChange(currentPage, currentPageSize)
  }

  const [isFolderLoading, setIsFolderLoding] = useState(false)
  const handleOpen = async (item: ResponsePPTList['data']['list'][number]) => {
    setOpen(true)
    setIsFolderLoding(true)
    const res = await fetchPPTFolders({
      pptCode: item.pptCode,
    })
    setIsFolderLoding(false)
    setItem(item)
    setFolders(res)
  }

  const [openCreate, setOpenCreate] = useState(false)
  const [isCreateLoading, setIsCreateLoading] = useState(false)
  // 新建文件夹
  const handleCreateFolder = async () => {
    // 创建
    setIsCreateLoading(true)
    await fetchPPTCreateFolder({
      folder: folderName,
    })

    // 创建完重新拉收藏夹数据
    const res = await fetchPPTFolders({
      pptCode: item.pptCode,
    })

    setFolderName('')
    setFolders(res)
    setOpenCreate(false)
    setIsCreateLoading(false)
  }

  const showConfirm = (pptCode: string) => {
    confirm({
      title: '确认删除上传的文档？',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        handleDeleteUpload?.(pptCode)
      },
      onCancel() { },
    })
  }

  const [openComment, setOpenComment] = useState(false)

  const [currentPPT, setCurrentPPT] = useState<ResponsePPTList['data']['list'][number]>({} as any)

  const handleUpdatePPTDetail = async (pptCode: string) => {
    const res = await fetchPPTDetail({
      pptCode,
    })
    setCurrentPPT(res)
    handleChange(currentPage, currentPageSize)
  }

  return (
    <>
      <Modal destroyOnClose title={currentPPT.title} footer={null} className={styles.comment} closable={false} centered open={openComment} width={1100} onOk={() => setOpenComment(false)} onCancel={() => setOpenComment(false)}>
        <Comment handleUpdatePPTDetail={handleUpdatePPTDetail} currentPPT={currentPPT} setOpenComment={setOpenComment}></Comment>
      </Modal>
      <Modal
        title="添加收藏夹"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Modal title="创建文件夹" cancelText="取消" okText="确认" closable={false} open={openCreate} onCancel={() => setOpenCreate(false)} onOk={handleCreateFolder}>
          <Spin spinning={isCreateLoading}>
            <Input value={folderName} placeholder="请输入文件夹名称" onChange={e => (setFolderName(e.currentTarget.value))} />
          </Spin>
        </Modal>
        <div className="bg-#f5f6f7 mt-15px my-10px cursor-pointer text-#555666 px-10px box-border flex ai-c h-40px gap-6px rounded-2" onClick={() => setOpenCreate(true)}>
          <div className="i-material-symbols-add-circle-outline-rounded fs-16"></div>
          <span className="mb-2px">创建收藏夹</span>
        </div>
        <div className="h-310px of-y-auto of-x-hidden">
          {
            isFolderLoading
              ? <Skeleton active paragraph={{ rows: 6 }} />
              : folders.map((i, idx) => {
                return (
                  <div key={idx} className="h-60px flex ai-c px-10px cursor-pointer jc-b box-border bb-1-#f0f0f5 hover:bg-#f5f6f7" onClick={() => { handleCollect(i.folderCode) }}>
                    <div className="flex flex-col">
                      <span className="text-#555666 fs-14">{i.folder}</span>
                      <span className="fs-12 text-#999aaa">
                        {i.amount || 0}
                        条内容
                      </span>
                    </div>
                    <span className={clsx('text-#555666 w-64px h-30px b-1-#ccccd8 flex jc-c ai-c fs-14 rounded-20px', i.isCollected && 'bg-#e8e8ed4d b-1-#e8e8ed text-#999aaa')}>
                      {
                        i.isCollected ? '已收藏' : '收藏'
                      }
                    </span>
                  </div>
                )
              })
          }
        </div>
      </Modal>
      <Spin spinning={isLoading}>
        {
          total
            ? (
              <>
                <div className="w-100% flex flex-wrap box-border p-20px gap-20px">
                  {
                    list.map((i) => {
                      return (
                        <div key={i.pptCode} className="w-250px flex flex-col b-1-#f1f1f1 rounded-2 ">
                          <Image
                            width="100%"
                            height={200}
                            src={i.coverUrl}
                            className="rounded-2"
                          />
                          <div className="flex-1 flex flex-col box-border p-15px ">
                            <div className="fs-14 flex ai-c gap-10px jc-b">
                              <span className="flex-1 text-hidden">{i.title}</span>
                              <span
                                // href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(i.pptUrl)}`}
                                className="p-0 flex ai-c jc-c cursor-pointer text-blue-4"
                                onClick={() => {
                                  setOpenComment(true)
                                  setCurrentPPT(i)
                                  fetchViewPPT({
                                    pptCode: i.pptCode,
                                  })
                                }}
                                rel="noreferrer"
                              >
                                查看
                              </span>
                            </div>
                            <div className="flex ai-c jc-s gap-5px mt-15px">
                              <span className="fs-14">综合得分:</span>
                              <Rate disabled value={i.score} className="fs-14" />
                            </div>
                            <div className={clsx('fs-14 flex ai-c fs-12 text-#999 mt-15px', handleDeleteUpload ? 'jc-b' : 'jc-e')}>
                              {
                                handleDeleteUpload && (
                                  <a
                                    className="m-0"
                                    type="link"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      showConfirm(i.pptCode)
                                    }}
                                  >
                                    删除
                                  </a>
                                )
                              }
                              <div className="flex gap-10px">
                                <div className="flex gap-5px">
                                  <div className="i-ph-eye bg-#999"></div>
                                  <span className="text-neutral-5">{getAmountStr(i.seeAmount)}</span>
                                </div>
                                {/* 收藏 */}
                                <div className="flex gap-5px">
                                  {
                                    i.isCollected
                                      ? <div className="i-material-symbols-favorite cursor-pointer bg-yellow" onClick={() => handleOpen(i)}></div>
                                      : <div className="i-material-symbols-favorite-outline cursor-pointer bg-#999" onClick={() => handleOpen(i)}></div>
                                  }
                                  <span className="text-neutral-5">{getAmountStr(i.collectAmount)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                <div className="w-100% text-center mb-20px">
                  <Pagination current={currentPage} pageSize={currentPageSize} onChange={handleChange} showSizeChanger={true} defaultPageSize={10} defaultCurrent={1} total={total} />
                </div>
              </>
              )
            : <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
      </Spin>
    </>
  )
}

const { Search } = Input
const ComCenter: React.FC = () => {
  const [classfiy, setClassify] = useState<ResponsePPTClassify['data']>([])
  const [active, setActive] = useState('')
  const [list, setList] = useState<ResponsePPTList['data']['list']>([] as any)
  const [total, setTotal] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const keword = useRef('')
  const [currentPageSize, setCurrentSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const handleInit = async () => {
    fetchPPTClassify().then((data) => {
      setClassify(data)
    })
    setLoading(true)
    const data = await fetchPPTList({
      page: 1,
      size: 10,
      firstKind: '',
      secondKind: '',
      keyword: '',
    })
    setList(data.list)
    setTotal(data.total)
    setLoading(false)
  }

  useEffect(() => {
    handleInit()
  }, [])

  // 分页查询，分类查询，搜索查询都会触发
  const handleChange = async (page: number, pageSize: number, config = {}) => {
    const { keyword, kinds } = config as any

    const [firstKind, secondKind] = (kinds || active).split('-')
    setLoading(true)
    const params = {
      page,
      size: pageSize,
      firstKind,
      secondKind,
      keyword: keword.current,
    }
    keyword && (params.keyword = keyword)
    setCurrentPage(page)
    setCurrentSize(pageSize)
    const data = await fetchPPTList(params)
    setList(data.list)
    setTotal(data.total)
    setLoading(false)
  }
  // 分类触发
  const handleActive = (kinds: string) => {
    setActive(kinds)
    handleChange(1, 10, { kinds })
  }

  // 搜索触发
  const handleSearch: SearchProps['onSearch'] = (value) => {
    keword.current = value
    handleChange(1, 10, {
      keyword: value,
    })
  }

  return (
    <LayOut>
      <div className={clsx('h-56px box-border flex ai-c pl-20px mt-10px', styles.search)}>
        <Search
          style={{
            width: 600,
          }}
          placeholder="搜索文档"
          size="large"
          onSearch={handleSearch}
        />
      </div>
      <div className="flex-1 of-y-auto scroll-bar-none">
        <div className="w-100% pt-10px px-40px box-border">
          {
            !classfiy.length
              ? <Skeleton active />
              : classfiy.map((i) => {
                return (
                  <Classfiy key={i.firstKind} title={i.firstKind} subTitle={i.secondKinds} active={active} handleActive={handleActive}></Classfiy>
                )
              })
          }
        </div>
        <Divider className="my-10px" dashed />
        <Content handleChange={handleChange} total={total} currentPage={currentPage} currentPageSize={currentPageSize} isLoading={isLoading} list={list}></Content>
      </div>
    </LayOut>
  )
}

export default ComCenter
