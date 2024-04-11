import React from 'react'
import { useNavigate } from 'react-router-dom'

const ChatAddPanel: React.FC = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex flex-col flex-1 bg-red">
      <button onClick={handleBack}>返回</button>

    </div>
  )
}

export default ChatAddPanel
