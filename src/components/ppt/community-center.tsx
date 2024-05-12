import { Button, Divider, Empty, Image, Input, Modal, Pagination, Rate, Skeleton, Spin } from 'antd'
import type { SearchProps } from 'antd/es/input'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import styles from './ppt-community.module.scss'
import { fetchPPTClassify, fetchPPTCollect, fetchPPTCreateFolder, fetchPPTFolders, fetchPPTList } from '~/api/ppt'
import type { ResponsePPTClassify, ResponsePPTFolders, ResponsePPTList } from '~/api/ppt/types'
import { useMessage } from '~/utils'

interface ClassfiyProps {
  title: string
  subTitle: string[]
  handleActive: (c: string) => void
  active: string
}

const { success } = useMessage()

const Classfiy: React.FC<ClassfiyProps> = ({ title, subTitle, handleActive, active }) => {
  const [isfold, setIsfold] = useState(false)
  return (
    <div className="lh-10 w-100% flex ai-s min-h-35px  relative">
      <h4 className="whitespace-nowrap text-#999  important:pm-0">
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
                  handleActive(`${title}-${j}`)
                }}
                className={clsx(' list-none cursor-pointer px-16px box-border text-black hover:text-blue fs-14', active === `${title}-${j}` && 'fw-700 text-blue')}
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
                  handleActive(`${title}-${j}`)
                }}
                className={clsx(' list-none cursor-pointer px-16px box-border text-black hover:text-blue fs-14', active === `${title}-${j}` && 'fw-700 text-blue')}
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
  return (
    <>
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
                <div className="w-100% grid grid-cols-4 box-border p-20px gap-20px">
                  {
                    list.map((i, idx) => {
                      return (
                        <div key={idx} className=" flex flex-col bg-#fff b-1-#f1f1f1 rounded-b-2 ">
                          <Image
                            width="100%"
                            height={250}
                            src={i.coverUrl}
                            className="rounded-2"
                          />
                          <div className="flex-1 flex flex-col box-border p-10px ">

                            <div className="fs-14 flex ai-c jc-b">
                              <span>{i.title}</span>
                              <div className="flex">
                                {
                                  i.isCollected
                                    ? <div className="i-material-symbols-favorite cursor-pointer bg-yellow" onClick={() => handleOpen(i)}></div>
                                    : <div className="i-material-symbols-favorite-outline cursor-pointer bg-#999" onClick={() => handleOpen(i)}></div>
                                }
                              </div>
                            </div>
                            <div className="flex ai-c jc-s gap-5px mt-10px">
                              <span className="fs-14">综合得分:</span>
                              <Rate disabled defaultValue={1} />
                            </div>
                            <div className="mt-10px text-end">
                              <Button type="link" href={i.pptUrl} className="p-0">
                                前往查看
                              </Button>
                            </div>
                            <div className={clsx('fs-14 flex ai-c fs-12 text-#999', handleDeleteUpload ? 'jc-b' : 'jc-e')}>
                              {
                                handleDeleteUpload && (
                                  <Button
                                    type="link"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      showConfirm(i.pptCode)
                                    }}
                                  >
                                    删除
                                  </Button>
                                )
                              }
                              <span className="fs-12 mr-5px">
                                上传日期:
                                {i.createTime}
                              </span>

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
    const data = await fetchPPTClassify()
    setClassify(data)
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
    if (kinds === active)
      return
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

    <div className="flex-1 h-[calc(100vh-64px)] flex flex-col">
      <div className={clsx('h-56px box-border flex ai-c pl-20px', styles.search)}>
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
    </div>

  )
}

export default ComCenter
