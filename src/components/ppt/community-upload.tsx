import React, { useEffect, useState } from 'react'
import { Content } from './community-center'
import LayOut from './content-layout'
import { fetchDeleteUpload, fetchMyUpload } from '~/api/ppt'

const ComUpload: React.FC = () => {
  const [list, setList] = useState([] as any)
  const [total, setTotal] = useState(0)

  const [currentPageSize, setCurrentSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setLoading] = useState(false)
  const handleChange = async (page: number, pageSize: number) => {
    setLoading(true)
    setCurrentPage(page)
    setCurrentSize(pageSize)
    const data = await fetchMyUpload({
      page,
      size: pageSize,
    })
    setList(data.list)
    setTotal(data.total)
    setLoading(false)
  }

  useEffect(() => {
    handleChange(1, 10)
  }, [])

  const handleDeleteUpload = async (pptCode: string) => {
    await fetchDeleteUpload({
      pptCode,
    })
    handleChange(1, currentPageSize)
  }

  return (
    <LayOut>
      <div className="overflow-y-auto pb-10px">
        <Content isLoading={isLoading} total={total} list={list} currentPageSize={currentPageSize} currentPage={currentPage} handleDeleteUpload={handleDeleteUpload} handleChange={handleChange}></Content>
      </div>
    </LayOut>

  )
}

export default ComUpload
