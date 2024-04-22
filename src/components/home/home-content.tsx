// import type { MouseEvent } from 'react'
import React, { Children } from 'react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import styles from './home-content.module.scss'
import { fetchPresetList } from '~/api'
import { HOME_PRESET_CONFIG } from '~/consts/home-config'

interface BlockProps {
  title: string
  subTitle: string
  children?: React.ReactNode
  className?: string
}

const Block: React.FC<BlockProps> = ({ title, subTitle, children, className }) => {
  return (
    <div className={clsx('w-100% flex flex-col px-35 mt-10 box-border', className)}>
      <div className={clsx('text-center fs-30 mb-40px fw-700')}>

        <div className={clsx(styles.title, 'flex text-#252525 tracking-[2.33px] flex pt-30px pb-60px ai-c jc-c lh-42px')}>
          <div className="i-teenyicons:left-outline fw-700 fs-20 mr-12 text-blue-6"></div>
          <span>{title}</span>
          <div className="i-teenyicons:right-outline fw-700 fs-20 ml-12 text-blue-6"></div>
        </div>
        <div className="text-[#4b5b76] fw-500 fs-14 tracking-[1.58px] mt-[-35px] ">{subTitle}</div>
      </div>
      {
        children && children
      }
    </div>
  )
}

const Content: React.FC = () => {
  // const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
  //   const target = e.target as HTMLDivElement
  //   target.classList.add(styles.active)
  //   // e.target?.classList?.add(styles.active)
  // }

  // const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
  //   const target = e.target as HTMLDivElement
  //   target.classList.remove(styles.active)
  //   // e.target?.classList?.add(styles.active)
  // }
  const navigate = useNavigate()
  const handleJump = (g: string) => {
    navigate(`/chat/session?gptCode=${g}`)
  }

  const { data } = fetchPresetList({
    gptCode: 'gpt_2',
  })

  console.log(data)

  return (
    <>
      <main className="w-100vw px-120px box-border mt-10 ">
        <div className={clsx(styles['slide-enter-content'], 'lh-10 px-30 mb-[-20px]')}>
          <div className="fs-30">欢迎来到我们的ChatGPT集成平台！</div>
          <div className="fs-20">一站式体验多种GPT技术魅力。</div>
          <div>高效对话，让交流更轻松自在。</div>
          <div>智能创作，激发无限创意火花</div>
          <div>安全稳定，保障您的数据安全。</div>
          <div>专业团队，提供贴心技术支持。</div>
          <div>精准推荐，个性化服务触手可及</div>
          <div>实时互动，共享智慧生活新体验。</div>
          <div>加入我们，一起探索AI的无限可能！</div>
        </div>
        <Block title="集成工具" subTitle="集成多平台ChatGPT，智能交互无界，畅享高效沟通新体验">
          <div className="flex w-100% jc-b box-border ">
            <CSSTransition
              in={true}
              timeout={1000}
              appear={true}
              classNames="home-card1"
            >
              <div className="transition-delay-1000">
                <div className={clsx('h-346px w-358px rounded-5 cursor-pointer hover:scale-105 transition-all', styles.card1)} onClick={() => handleJump('gpt_1')}>
                  <span className="fs-20 fw-600">文心一言</span>
                  <p className="text-#4b5b76 lh-7">文心一言是百度推出的生成式对话产品，基于文心大模型技术，具备深度语义理解与生成能力，为用户提供智能对话体验。</p>
                </div>
              </div>
            </CSSTransition>
            <CSSTransition
              in={true}
              timeout={1000}
              appear={true}
              classNames="home-card2"
            >
              <div>
                <div className={clsx('h-346px w-358px rounded-5 cursor-pointer hover:scale-105 transition-all', styles.card2)} onClick={() => handleJump('gpt_2')}>
                  <span className="fs-20 fw-600">讯飞星火</span>
                  <p className="text-#4b5b76 lh-7">讯飞星火是科大讯飞发布的大模型，具备文本生成、语言理解等7大核心能力，通过先进技术实现智能交互，为用户提供高效便捷的AI体验。</p>
                </div>
              </div>
            </CSSTransition>
            <CSSTransition
              in={true}
              timeout={1000}
              appear={true}
              classNames="home-card3"
            >
              <div>
                <div className={clsx('h-346px w-358px rounded-5 cursor-pointer hover:scale-105 transition-all', styles.card3)} onClick={() => handleJump('gpt_4')}>
                  <span className="fs-20 fw-600">通义千问</span>
                  <p className="text-#4b5b76 lh-7">通义千问是阿里云推出的超大规模语言模型，具备多轮对话、文案创作等能力，为用户提供精准、高效的问题解答和创作支持。</p>
                </div>
              </div>
            </CSSTransition>
          </div>
        </Block>
        <Block title="丰富预设" className="mt-20" subTitle="集成丰富预设，全场景覆盖，开箱即用大模型，轻松应对各类需求">
          <div className="flex mt-10px gap-4 flex-wrap jc-a">
            {
              data?.data.map((i, idx) => {
                const key = idx % 5
                return (
                  <div
                    key={idx}
                    className={clsx('w-179px h-178px relative cursor-pointer rounded-2 flex ai-c jc-c', styles[`preset${key}`])}
                  >
                    <span className="absolute left-0 top-0 h-25px lh-23px w-50px b-1-#f8faff fs-22 tracking-[2px] text-#fff">1</span>
                    {
                      i.name
                    }
                  </div>
                )
              })
            }

          </div>
        </Block>

        {/* <div className="w-100% flex jc-b box-border bg-green">
          <div className={clsx('h-450px bg-red', styles.card)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>1</div>
          <div className={clsx('h-450px bg-blue', styles.card)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>2</div>
          <div className={clsx('h-450px bg-yellow', styles.card)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>3</div>
        </div> */}
      </main>
    </>

  )
}

export default Content
