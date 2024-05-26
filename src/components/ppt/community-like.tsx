import { Breadcrumb, Divider, Input, Modal, Popover, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import Content from './community-content'
import LayOut from './content-layout'
import styles from './ppt-community.module.scss'
import type { ResponsePPTCollectList, ResponsePPTFolders } from '~/api/ppt/types'
import { fetchFolderDelete, fetchFolderRename, fetchPPTCollectList, fetchPPTCreateFolder, fetchPPTFolders } from '~/api/ppt'

const { confirm } = Modal
const ComLike: React.FC = () => {
  const [folderCode, setFolderCode] = useState('')

  const [showFolder, setShowFolder] = useState(true)
  const [list, setList] = useState<ResponsePPTCollectList['data']['list']>([] as any)
  const [total, setTotal] = useState(0)

  const [currentPageSize, setCurrentSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [bread, setBread] = useState([
    {
      title: '我的资料库',
    },
    {
      title: '我的收藏',
      className: 'hover:cursor-pointer',
      onClick: () => {
        setBread((state) => {
          return [...state.splice(0, 2)]
        })
        setShowFolder(true)
      },
    },
  ])

  const [isLoading, setLoading] = useState(false)
  const handleChange = async (page: number, pageSize: number, fc?: string) => {
    setLoading(true)
    setCurrentPage(page)
    setCurrentSize(pageSize)
    const data = await fetchPPTCollectList({
      page,
      size: pageSize,
      folderCode: fc || folderCode,
    })
    setList(data.list)
    setTotal(data.total)
    setLoading(false)
  }

  // 查询某个文件当中的ppt列表
  const handleCheckFolder = (folderName: string, folderCode: string) => {
    bread[2] = { title: `${folderName}` }
    setBread([...bread])
    setShowFolder(false)
    setFolderCode(folderCode)
    handleChange(1, currentPageSize, folderCode)
  }

  const [folders, setFolders] = useState<ResponsePPTFolders['data']>([])
  const [isFolderLoading, setIsFolderLoding] = useState(false)
  // 获取文件夹列表
  const handleInit = async () => {
    setIsFolderLoding(true)
    const res = await fetchPPTFolders()
    setIsFolderLoding(false)
    setFolders(res)
  }

  useEffect(() => {
    handleInit()
  }, [])

  const showConfirm = () => {
    confirm({
      title: '内部文档也将被删除，确认删除？',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        await fetchFolderDelete({
          folderCode,
        })
        await handleInit()
      },
      onCancel() { },
    })
  }

  const [open, setOpen] = useState(false)
  const [createName, setCreateName] = useState('')
  const [isCreateLoading, setIsCreateLoading] = useState(false)
  const handleCreateFolder = async () => {
    setIsCreateLoading(true)
    await fetchPPTCreateFolder({
      folder: createName,
    })
    // 创建完重新拉数据
    await handleInit()
    setCreateName('')
    setOpen(false)
    setIsCreateLoading(false)
  }

  const [renameOpen, setRenameOpen] = useState(false)
  const [rename, setRename] = useState('')
  const handleRenameFolder = async () => {
    setIsCreateLoading(true)
    await fetchFolderRename({
      folderCode,
      folder: rename,
    })

    await handleInit()
    setRename('')
    setRenameOpen(false)
    setIsCreateLoading(false)
  }

  return (

    <LayOut>
      {/* todo */}
      <Modal title="创建文件夹" cancelText="取消" okText="确定" closable={false} open={open} onCancel={() => setOpen(false)} onOk={handleCreateFolder}>
        <Spin spinning={isCreateLoading}>
          <Input value={createName} placeholder="请输入文件夹名称" onChange={e => (setCreateName(e.currentTarget.value))} />
        </Spin>
      </Modal>
      {/* todo */}
      <Modal
        title="重命名收藏夹"
        cancelText="取消"
        okText="确定"
        closable={false}
        open={renameOpen}
        onOk={handleRenameFolder}
        onCancel={() => setRenameOpen(false)}
      >
        <Spin spinning={isCreateLoading}>
          <Input value={rename} placeholder="请输入文件夹名称" onChange={e => (setRename(e.currentTarget.value))} />
        </Spin>
      </Modal>
      <div className="flex-1 of-y-auto p-20px box-border">
        <div className="flex">
          <div className="flex h-98px w-248px jc-c gap-5px ai-c box-border bg-[rgba(100,210,255,.15)] rounded-24px cursor-pointer" onClick={() => setOpen(true)}>
            <div className={styles.folder}></div>
            <div className="flex flex-col">
              <span className="fs-16 fw-600 text-#333 mb-5px">新建文件夹</span>
              <span className="text-#333333b3 fs-12">创建文件夹，收藏中意模板</span>
            </div>
          </div>
        </div>
        <Divider dashed />
        <Breadcrumb
          separator=">"
          items={bread}
        />
        <Divider dashed />
        {
          showFolder
            ? (
              <Spin spinning={isFolderLoading}>
                <div className="w-100% flex box-border flex-wrap gap-10px p-20px">
                  {
                    folders.map((i, idx) => {
                      return (
                        <>
                          <div key={idx} className="flex relative flex-col ai-c jc-c cursor-pointer group hover:bg-#f7f7f7 py-30px px-35px  rounded-5" onClick={() => { handleCheckFolder(i.folder, i.folderCode) }}>
                            <div className="i-material-symbols-folder bg-#a8daff fs-58"></div>
                            <span className="fs-13">{i.folder}</span>
                            <Popover
                              placement="bottom"
                              content={(
                                <>
                                  <div
                                    className="lh-8 px-10px hover:text-blue cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setFolderCode(i.folderCode)
                                      showConfirm()
                                    }}
                                  >
                                    删除
                                  </div>
                                  <div
                                    className="lh-8 px-10px hover:text-blue cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setFolderCode(i.folderCode)
                                      setRenameOpen(true)
                                    }}
                                  >
                                    重命名
                                  </div>
                                </>
                              )}
                            >
                              <div className="i-ri-more-fill absolute right-10px top-10px group-hover:visible invisible"></div>
                            </Popover>
                          </div>

                        </>
                      )
                    })
                  }
                </div>
              </Spin>
              )
            : <Content isLoading={isLoading} total={total} list={list} currentPageSize={currentPageSize} currentPage={currentPage} handleChange={handleChange}></Content>
        }
      </div>
    </LayOut>

  )
}

export default ComLike
