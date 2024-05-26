import { Divider, Input, Skeleton } from 'antd'
import type { SearchProps } from 'antd/es/input'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import Content from './community-content'
import LayOut from './content-layout'
import styles from './ppt-community.module.scss'
import type { ResponsePPTClassify, ResponsePPTList } from '~/api/ppt/types'
import { fetchPPTClassify, fetchPPTList } from '~/api/ppt'

interface ClassfiyProps {
  title: string
  subTitle: string[]
  handleActive: (c: string) => void
  active: string
}

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
