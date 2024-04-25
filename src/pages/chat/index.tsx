import clsx from 'clsx'
import { Outlet } from 'react-router-dom'
import styles from './index.module.scss'
import SideBar from '~/components/chat/side-bar'
import { ThemeInitContext, useTheme } from '~/utils'

function Chat() {
  const { isDark, handleToggle } = useTheme()

  return (
    <div className={clsx('h-100vh w-100vw flex overflow-hidden bg-base relative', !isDark && styles.wrapper)}>
      <SideBar></SideBar>
      <ThemeInitContext.Provider value={{
        handleToggle,
        isDark,
      } as any}
      >
        <Outlet></Outlet>
      </ThemeInitContext.Provider>
    </div>
  )
}

export default Chat
