import { Avatar, Divider, Empty, Image, Input, Modal, Pagination, Rate, Skeleton, Spin } from 'antd'
import type { SearchProps } from 'antd/es/input'
import clsx from 'clsx'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './ppt-community.module.scss'
import LayOut from './content-layout'
import { fetchCommentList, fetchPPTClassify, fetchPPTCollect, fetchPPTCreateFolder, fetchPPTFolders, fetchPPTList, fetchReplyList, fetchViewPPT } from '~/api/ppt'
import type { ResponseCommentList, ResponsePPTClassify, ResponsePPTFolders, ResponsePPTList, ResponseReplyList } from '~/api/ppt/types'
import { useCommentList, useMessage, useScrollBottom } from '~/utils'
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
            <div className="fs-14 absolute right-10px cursor-pointer flex ai-c jc-c" onClick={() => setIsfold(!isfold)}>
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

interface CommentItemProps {
  info: ResponseCommentList['data']['list'][number]
  size?: number
  className?: string
}
const CommentItem: React.FC<CommentItemProps> = ({ info, size = 50, className }) => {
  return (
    <div className={clsx('flex my-15px', className)}>
      <Avatar className="mr-10px" size={size} src={info.headshot} />
      <div className="flex flex-1 flex-col">
        <div className="text-neutral-5">{info.username}</div>
        <div className="text-#0a0a0a">
          {info.content}
          12312321312312dawd撒大大231212都112312321312312dawd撒大大231212都112312321312312dawd撒大大231212都112312321312312dawd撒大大231212都112312321312312dawd撒大大231212都112312321312312dawd撒大大231212都112312321312312dawd撒大大231212都112312321312312dawd撒大大231212都1
        </div>
        <div className="text-neutral-5">{info.createTime}</div>
        {
          info.replyAmount !== undefined
          && (
            <div className="flex gap-10px ai-c">
              <div className="flex gap-3px jc-c ai-c text-neutral-6 cursor-pointer">
                <div className="i-iconamoon-comment-light"></div>
                <div>{info.replyAmount}</div>
              </div>
              <span className="fs-12 text-blue-4 cursor-pointer">回复</span>
            </div>
          )
        }
      </div>
    </div>
  )
}

interface ReplyProps {
  commentCode: string
}
const Reply: React.FC<ReplyProps> = ({ commentCode }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<ResponseReplyList['data']>({ list: [], hasMore: true } as any)
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
  setOpenComment: React.Dispatch<React.SetStateAction<boolean>>
}

// 评论组件
const Comment: React.FC<CommentProps> = ({ currentPPT, setOpenComment }) => {
  const comRef = useRef(null)
  const { useFn, data, isLoading, isInit } = useCommentList(currentPPT.pptCode)

  useEffect(() => {
    (comRef.current as any).addEventListener('scroll', useFn)
    // handleFetch()
    return () => {
      window.removeEventListener('scroll', useFn)
    }
  }, [])

  return (
    <>
      <div
        onClick={() => {
          setOpenComment(false)
        }}
        className="absolute z-300 left-[-80px] top-[0px] bg-[rgba(64,64,64,0.25)] w-40px h-40px rounded-50% flex jc-c ai-c cursor-pointer"
      >
        <div className="i-ic-outline-close text-#fff fs-20"></div>
      </div>
      <div className="relative h-[calc(100vh-140px)] flex flex-col">
        <div ref={comRef} className="flex-1 w-100% of-auto">
          {/* header */}
          <div className="w-100% flex flex-col">
            <div className="flex">
              <Avatar className="cursor-pointer mr-20px" size={50} src={currentPPT.headhost} />
              <div className="flex flex-col fs-18">
                <span className="fw-700">{currentPPT.username}</span>
                <span></span>
              </div>
            </div>
            <div className="flex gap-10px fs-14 text-neutral-5 lh-8">
              <span>
                {currentPPT.seeAmount}
                人浏览过此模板
              </span>
              <span>
                {currentPPT.collectAmount}
                人收藏过此模板
              </span>
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
            <Image
              className="rounded-8px"
              width={480}
              src={currentPPT.coverUrl}
            >
            </Image>
            <div className="text-neutral-5 lh-8">
              发布于
              {currentPPT.createTime}
            </div>
          </div>
          {/* footer */}
          <Divider className="my-10px"></Divider>
          <div className="fs-14 text-neutral-5">{`共 ${currentPPT.commentAmount} 条评论`}</div>
          <div>
            {
              data.list.length === 0 && !data.hasMore
              && (
                <div>
                  <Empty description="暂无评论，快来评论吧" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              )

            }
            {data.list?.map((i, idx) => {
              return (
                <div key={idx}>
                  <CommentItem info={i}></CommentItem>
                  <Reply commentCode={i.commentCode}></Reply>
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
              !!data.list.length && !data.hasMore && (
                <div>
                  <Empty description="暂无更多消息~" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              )
            }
          </div>
        </div>
        <div className="w-100% h-50px box-border">
          <p contentEditable={true} className={styles['comment-input']}></p>
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
  size: number
  handleDeleteUpload?: (c: string) => Promise<void>
}
const { confirm } = Modal

export const Content: React.FC<ContentProps> = ({ handleChange, size, list, total, isLoading, handleDeleteUpload }) => {
  const [folders, setFolders] = useState<ResponsePPTFolders['data']>([])
  const [item, setItem] = useState<ResponsePPTList['data']['list'][number]>({} as any)
  const [folderName, setFolderName] = useState('')

  const [open, setOpen] = useState(false)
  const handleCollect = async (folderCode: string) => {
    const data = await fetchPPTCollect({
      pptCode: item.pptCode,
      folderCode,
    })
    success(data)
    setOpen(false)
    handleChange(1, size)
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
  const handleCreateFolder = async () => {
    // 创建
    setIsCreateLoading(true)
    await fetchPPTCreateFolder({
      folder: folderName,
    })

    // 创建完重新拉数据
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

  return (
    <>
      <Modal destroyOnClose title={currentPPT.title} footer={null} className={styles.comment} closable={false} centered open={openComment} width={1100} onOk={() => setOpenComment(false)} onCancel={() => setOpenComment(false)}>
        <Comment currentPPT={currentPPT} setOpenComment={setOpenComment}></Comment>
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
                    list.map((i, idx) => {
                      return (
                        <div key={idx} className="w-250px flex flex-col b-1-#f1f1f1 rounded-2 ">
                          <Image
                            width="100%"
                            height={200}
                            src={i.coverUrl}
                            className="rounded-2"
                          />
                          <div className="flex-1 flex flex-col box-border p-15px ">
                            <div className="fs-14 flex ai-c jc-b">
                              <span>{i.title}</span>
                              <span
                                // href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(i.pptUrl)}`}
                                className="p-0 flex ai-c jc-c cursor-pointer text-blue-4"
                                onClick={() => {
                                  setOpenComment(true)
                                  setCurrentPPT(i)
                                  // fetchViewPPT({
                                  //   pptCode: i.pptCode,
                                  // })
                                }}
                                rel="noreferrer"
                              >
                                查看
                              </span>
                            </div>
                            <div className="flex ai-c jc-s gap-5px mt-15px">
                              <span className="fs-14">综合得分:</span>
                              <Rate disabled defaultValue={i.score} className="fs-14" />
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
                              {/* <span className="fs-12 mr-5px">
                                上传日期:
                                {i.createTime}
                              </span> */}
                              <div className="flex gap-10px">
                                <div className="flex gap-5px">
                                  <div className="i-ph-eye bg-#999"></div>
                                  <span className="text-neutral-5">{getAmountStr(i.seeAmount)}</span>
                                </div>
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
                  <Pagination onChange={handleChange} showSizeChanger={true} defaultPageSize={10} defaultCurrent={1} total={total} />
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
  const size = useRef(10)

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
    const data = await fetchPPTList(params)
    size.current = pageSize
    setList(data.list)
    setTotal(data.total)
    setLoading(false)
  }

  const handleActive = (kinds: string) => {
    setActive(kinds)

    handleChange(1, 10, { kinds })
  }

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
      <div className="flex-1 of-y-auto">
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
        <Divider dashed />
        <Content handleChange={handleChange} total={total} size={size.current} isLoading={isLoading} list={list}></Content>
      </div>
    </LayOut>
  )
}

export default ComCenter
