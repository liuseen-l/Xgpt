import clsx from 'clsx'
import styles from './index.module.scss'
import Nav from '~/components/home/home-nav'
import Content from '~/components/home/home-content'

function Home() {
  return (
    <div className={clsx('w-100% of-x-hidden h-100vh relative')}>
      <div className={clsx('w-100% h-100vh absolute left-0 top-0 z-[-1]', styles.wrapper)}></div>
      <Nav></Nav>
      <Content></Content>
    </div>
  )
}

export default Home
