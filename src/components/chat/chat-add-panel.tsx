import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Skeleton } from 'antd'
import { fetchCreateChat, fetchPresetList } from '~/api'
import { useChatStore } from '~/stores/chat'
import type { RequestAddChat } from '~/api/chat/types'

const ChatAddPanel: React.FC = () => {
  const navigate = useNavigate()
  const handleBack = () => {
    navigate(-1)
  }
  const [search] = useSearchParams()
  const gptCode = search.get('gptCode')!

  const { handleGetChatList, handleCheckSession } = useChatStore(state => ({
    handleGetChatList: state.handleGetChatList,
    handleCheckSession: state.handleCheckSession,
  }))

  const { data, isLoading } = fetchPresetList({
    gptCode,
  })

  const handleCreateChat = async (params: RequestAddChat) => {
    const res = await fetchCreateChat(params)
    // 游客不支持创建，res返回为空
    if (res) {
      const data = await handleGetChatList()
      handleCheckSession(data[0])
      handleBack()
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-base box-border">
      <div className="w-100% p-18px flex ai-c box-border" onClick={handleBack}>
        <div className="flex ai-c fs-12 text-base hover:cursor-pointer">
          <div className="i-material-symbols:arrow-back-ios-new-rounded"></div>
          <span className="ml-5px">返回</span>
        </div>
      </div>
      <div className="flex flex-col px-20px leading-6 text-base">
        <span className="fs-20 fw-700">选择预设</span>
        <span className="fs-14">
          {`${data?.data.length || 0} 个预设定义`}
        </span>
      </div>
      <div className="flex-1 text-base p-20px of-auto">
        {

          isLoading ? <Skeleton active paragraph={{ rows: 4 }}></Skeleton>
            : data?.data.map((i, idx) => {
              return (
                <div key={idx} className="flex p-16px ai-c jc-b border-base">
                  <div className="flex">
                    <div className="flex flex-col">
                      <span className="fs-14 leading-6 fw-700">{i.name}</span>
                      <div className="fs-12">
                        <span>{`包含${i.total}条预设对话 / `}</span>
                        <span>{i.name}</span>
                      </div>
                    </div>
                  </div>
                  {/* rigjt */}
                  <div className="flex">
                    <div
                      className="flex fs-12 hover:cursor-pointer"
                      onClick={() => {
                        handleCreateChat({
                          chatName: i.name,
                          gptCode,
                          functionCode: i.functionCode,
                          content: i.content,
                          replication: i.replication,
                        })
                      }}
                    >
                      <div className="i-material-symbols:add-circle-outline mr-1"></div>
                      <span>对话</span>
                    </div>
                  </div>
                </div>
              )
            })
        }
      </div>
    </div>
  )
}

export default ChatAddPanel
