import clsx from 'clsx'
import React from 'react'
import styles from './ppt-community.module.scss'

interface LayOutProps {
  children: React.ReactNode
}
const LayOut: React.FC<LayOutProps> = ({ children }) => {
  return (
    <div className={clsx('flex-1 flex')}>
      <div className={clsx('h-100% flex-1 flex flex-col rounded-24px ', styles.layout)}>
        {children}
      </div>
    </div>
  )
}

export default LayOut
