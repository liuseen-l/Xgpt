import clsx from 'clsx'

function ChatCard() {
  const isTarget = true

  return (
    <div className={clsx('w-100% flex', isTarget && 'jc-e')}>
      <div className={clsx('max-w-80% flex flex-col gap-8px', isTarget && 'ai-e')}>
        {/* header icon */}
        <div className="h-30px w-30px flex ai-c jc-c border-base border-rounded-2">
          <div className="i-emojione:blond-haired-person-medium-light-skin-tone fs-20" />
        </div>
        {/* content */}
        <div className="border-base fs-14 leading-5 border-rounded-2 p-10px siderbar-bg-base">
          我怕我怕我怕我怕我怕我怕我怕我怕我怕我怕我怕我怕我怕我怕我怕
        </div>
      </div>
    </div>

  )
}
export default ChatCard
