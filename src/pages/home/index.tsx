import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '~/stores/global'

function Home() {
  const navigate = useNavigate()
  const { token } = useGlobalStore(state => ({
    token: state.token,
  }))
  const handleJump = (g: string) => {
    navigate(`/chat/session?gptCode=${g}`)
  }

  console.log(token)

  return (
    <div className="h-100vh w-100vw flex">
      <button onClick={() => handleJump('gpt_1')}>去文心</button>
      <button onClick={() => handleJump('gpt_2')}>去讯飞</button>
      <button onClick={() => handleJump('gpt_4')}>去通义</button>
      <button onClick={() => navigate('/login')}>去登录</button>
      <button onClick={() => {
        localStorage.removeItem('globalStore')
      }}
      >
        init
      </button>
    </div>
  )
}

export default Home
