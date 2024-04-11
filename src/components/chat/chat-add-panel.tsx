import React from 'react'
import { useNavigate } from 'react-router-dom'

const ChatAddPanel: React.FC = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/chat/session')
  }

  return (
    <div className="flex flex-col flex-1 bg-base box-border">
      <div className="w-100% p-20px flex ai-c box-border" onClick={handleBack}>
        <div className="flex ai-c fs-12 text-base hover:cursor-pointer">
          <div className="i-material-symbols:arrow-back-ios-new-rounded"></div>
          <span className="ml-5px">返回</span>
        </div>
      </div>

    </div>
  )
}

export default ChatAddPanel
