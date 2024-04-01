function SideItem() {
  return (
    <div
      tabIndex={1}
      className="hover:bg-neutral-200 dark:hover:bg-neutral-700 p-10px relative box-border flex flex-col mr-10px bg-base b-2-transparent focus:b-2-#1d93ab border-rounded-3 cursor-pointer  mb-10px group"
    >
      <div className="i-typcn:delete-outline absolute right-0 top-0 transition-all opacity-0 hover:opacity-100 group-hover:opacity-50 group-hover:translate-x-[-4px]"></div>
      <span className="mb-10px font-700 fs-14">新的聊天</span>
      <div className="w-100% flex jc-b sub-text-base fs-12">
        <span>4条对话</span>
        <span className="">2024/03/12 13:23:31</span>
      </div>
    </div>
  )
}

export default SideItem
