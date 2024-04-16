import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const handleJump = (g: string) => {
    navigate(`/chat/session?gptCode=${g}`)
  }

  return (
    <div className="h-100vh w-100vw flex">
      <button onClick={() => handleJump('gpt_1')}>去文心</button>
      <button onClick={() => handleJump('gpt_2')}>去讯飞</button>
      <button onClick={() => handleJump('gpt_4')}>去通义</button>
    </div>
  )
}

export default Home
