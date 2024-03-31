import { useToggle } from '~/utils'

function SideBar() {
  return (
    <>
      <div className="w-300px h-100% siderbar-bg-base">
        <button onClick={useToggle}>change theme</button>
      </div>
    </>
  )
}

export default SideBar
