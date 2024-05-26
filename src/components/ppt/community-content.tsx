import { Empty, Image, Input, Modal, Pagination, Rate, Skeleton, Spin } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import Comment from './community-comment'
import styles from './ppt-community.module.scss'
import { fetchPPTCollect, fetchPPTCreateFolder, fetchPPTDetail, fetchPPTFolders, fetchViewPPT } from '~/api/ppt'
import type { ResponsePPTFolders, ResponsePPTList } from '~/api/ppt/types'
import { useMessage } from '~/utils'
import { getAmountStr } from '~/utils/common'

const { success } = useMessage()

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

const Content: React.FC<ContentProps> = ({ handleChange, currentPageSize, currentPage, list, total, isLoading, handleDeleteUpload }) => {
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
export default Content
