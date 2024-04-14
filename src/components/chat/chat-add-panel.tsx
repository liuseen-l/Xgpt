import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Skeleton } from 'antd'
import { fetchCreateChat, fetchGetFunction } from '~/api'
import { useGlobalStore } from '~/stores/global'
import { useChatStore } from '~/stores/chat'
import type { RequestAddChat } from '~/api/chat/types'

const ChatAddPanel: React.FC = () => {
  const navigate = useNavigate()
  const handleBack = () => {
    navigate('/chat/session')
  }

  const { gptCode } = useGlobalStore(state => ({
    gptCode: state.gptCode,
  }))

  const { data, isLoading } = fetchGetFunction({
    gptCode,
  })

  const { handleGetChatList } = useChatStore(state => ({
    handleGetChatList: state.handleGetChatList,
  }))

  const handleCreateChat = async (params: RequestAddChat) => {
    await fetchCreateChat(params)
    await handleGetChatList(gptCode)
    handleBack()
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
      <div className="flex-1 text-base p-20px  overflow-auto">
        {

          isLoading ? <Skeleton paragraph={{ rows: 4 }}></Skeleton>
            : data?.data.map((i, idx) => {
              return (
                <div key={idx} className="flex p-16px ai-c jc-b border-base">
                  <div className="flex">
                    <div className="flex flex-col">
                      <span className="fs-14 leading-6 fw-700">{i.functionName}</span>
                      <span className="fs-12">{i.gptName}</span>
                    </div>
                  </div>
                  {/* rigjt */}
                  <div className="flex">
                    <div
                      className="flex fs-12 hover:cursor-pointer"
                      onClick={() => {
                        handleCreateChat({
                          chatName: i.functionName,
                          gptCode,
                          functionCode: i.functionCode,
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
