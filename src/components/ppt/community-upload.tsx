import React, { useEffect, useRef, useState } from 'react'
import { Content } from './community-center'
import { fetchDeleteUpload, fetchMyUpload } from '~/api/ppt'

const ComUpload: React.FC = () => {
  const [list, setList] = useState([] as any)
  const [total, setTotal] = useState(0)
  const size = useRef(10)
  const [isLoading, setLoading] = useState(false)
  const handleChange = async (page: number, pageSize: number) => {
    setLoading(true)
    const data = await fetchMyUpload({
      page,
      size: pageSize,
    })
    size.current = pageSize
    setList(data.list)
    setTotal(data.total)
    setLoading(false)
  }

  useEffect(() => {
    handleChange(1, size.current)
  }, [])

  const handleDeleteUpload = async (pptCode: string) => {
    await fetchDeleteUpload({
      pptCode,
    })
    handleChange(1, size.current)
  }

  return (
    <div className="flex-1 h-[calc(100vh-64px)] flex flex-col">
      <div className="overflow-y-auto pb-10px">
        <Content isLoading={isLoading} total={total} list={list} size={size.current} handleDeleteUpload={handleDeleteUpload} handleChange={handleChange}></Content>
      </div>
    </div>
  )
}

export default ComUpload
