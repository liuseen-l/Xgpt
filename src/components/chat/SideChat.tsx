import SideChatContent from './SideChatContent'
import SideChatHedaer from './SideChatHeader'
import SideChatInput from './SideChatInput'

function SideChat() {
  return (
    <>
      <div className="flex flex-col flex-1 h-100% bg-base text-base">
        <SideChatHedaer></SideChatHedaer>
        <SideChatContent></SideChatContent>
        <SideChatInput></SideChatInput>
      </div>
    </>
  )
}

export default SideChat
