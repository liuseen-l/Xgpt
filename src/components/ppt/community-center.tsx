import { Button, Divider, Empty, Image, Pagination, Rate } from 'antd'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { fetchPPTClassify, fetchPPTCollect, fetchPPTList } from '~/api/ppt'
import type { ResponsePPTClassify, ResponsePPTList } from '~/api/ppt/types'
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
          subTitle.slice(0, 12).map((j, _idx) => {
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
          isfold && subTitle.slice(12).map((j, _idx) => {
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
          subTitle.length > 12 && <span className="fs-14 absolute right-10px cursor-pointer " onClick={() => setIsfold(!isfold)}>{isfold ? '收起' : '展开'}</span>
        }
      </ul>
    </div>
  )
}

const ComCenter: React.FC = () => {
  const [classfiy, setClassify] = useState<ResponsePPTClassify['data']>([])
  const [active, setActive] = useState('')
  const [list, setList] = useState<ResponsePPTList['data']['list']>([] as any)
  const [total, setTotal] = useState(0)
  const size = useRef(10)

  const handleInit = async () => {
    const data = await fetchPPTClassify()
    setClassify(data)
  }

  useEffect(() => {
    handleInit()
  }, [])

  const handleChange = async (page: number, pageSize: number, s?: string) => {
    const [firstKind, secondKind] = (s || active).split('-')

    const data = await fetchPPTList({
      page,
      size: pageSize,
      firstKind,
      secondKind,
    })
    size.current = pageSize
    setList(data.list)
    setTotal(data.total)
  }

  const handleActive = (s: string) => {
    setActive(s)
    handleChange(1, size.current, s)
  }

  const handleCollect = (pc: string, idx: number, isCollected: boolean) => {
    list[idx].isCollected = isCollected
    setList([...list])
    fetchPPTCollect({
      pptCode: pc,
    })
    success(isCollected ? '收藏成功' : '取消收藏成功')
  }

  return (
    <div className="flex-1 of-y-auto  ">
      <div className="w-100% pt-10px px-40px box-border">
        {
          classfiy.map((i) => {
            return (
              <Classfiy key={i.firstKind} title={i.firstKind} subTitle={i.secondKinds} active={active} handleActive={handleActive}></Classfiy>
            )
          })
        }
      </div>
      <Divider dashed />
      {
        total
          ? (
            <>
              <div className="w-100% grid grid-cols-4 box-border p-20px gap-20px">
                {
                  list.map((i, idx) => {
                    return (
                      <div key={i.coverUrl} className=" flex flex-col bg-#fff b-1-#f1f1f1 rounded-b-2 ">
                        <Image
                          width="100%"
                          height={250}
                          src={i.coverUrl}
                        />
                        <div className="flex-1 flex flex-col box-border p-10px ">
                          <div className="fs-14 flex ai-c jc-b">
                            <span>{i.title}</span>
                            <div className="flex">
                              {
                                i.isCollected
                                  ? <div className="i-material-symbols-favorite cursor-pointer bg-yellow" onClick={() => handleCollect(i.pptCode, idx, false)}></div>
                                  : <div className="i-material-symbols-favorite-outline cursor-pointer bg-#999" onClick={() => handleCollect(i.pptCode, idx, true)}></div>
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
                          <div className="fs-14 flex jc-e ai-c fs-12 text-#999">
                            <span className="fs-12 mr-5px">上传日期:</span>
                            {i.createTime}
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              <div className="w-100% text-center mb-20px">
                <Pagination onChange={handleChange} showSizeChanger={true} defaultPageSize={10} defaultCurrent={1} total={10} />
              </div>
            </>
            )
          : <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
    </div>
  )
}

export default ComCenter
