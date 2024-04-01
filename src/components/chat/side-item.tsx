import styles from './side-item.module.scss'

function SideItem() {
  return (
    <div
      tabIndex={1}
      className={`${styles['chat-item']} hover:bg-neutral-200 dark:hover:bg-neutral-700 p-10px relative box-border flex flex-col mr-10px bg-base b-2-transparent transition-all focus:b-2-#1d93ab border-rounded-3 hover:cursor-pointer mb-10px`}
    >
      <div className={`${styles['chat-item-delete']} i-typcn:delete-outline absolute right-0 top-0 transition-all opacity-0 hover:opacity-100 cursor-pointer`}></div>
      <span className="mb-10px font-700 fs-14">新的聊天</span>
      <div className="w-100% flex jc-b sub-text-base fs-12">
        <span>4条对话</span>
        <span>2024/03/12 13:23:31</span>
      </div>
    </div>
  )
}

export default SideItem
