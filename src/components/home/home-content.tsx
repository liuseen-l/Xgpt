// import type { MouseEvent } from 'react'
import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { Button, ConfigProvider } from 'antd'
import { TinyColor } from '@ctrl/tinycolor'
import { RightCircleTwoTone } from '@ant-design/icons'
import { useInViewport } from 'ahooks'
import styles from './home-content.module.scss'
import { fetchPresetList } from '~/api'

interface BlockProps {
  title: string
  subTitle: string
  children?: React.ReactNode
  className?: string
}

const colors1 = ['#6253E1', '#04BEFE']

function getHoverColors(colors: string[]) {
  return colors.map(color => new TinyColor(color).lighten(5).toString())
}
function getActiveColors(colors: string[]) {
  return colors.map(color => new TinyColor(color).darken(5).toString())
}

const ppt_config = [
  {
    title: {
      pre: '智能PPT，',
      suf: '一键生成',
    },
    subTitle: '智能PPT，一键生成，轻松打造专业演示文稿。智能系统快速响应，高效生成精美内容，让您在会议、报告等场合脱颖而出。',
  },
  {
    title: {
      pre: '受众广泛，',
      suf: '灵活适用',
    },
    subTitle: '受众广泛，灵活适用，无论学生还是职场员工，都能轻松利用我们的平台。满足不同需求，让演示更专业，沟通更高效。',
  },
  {
    title: {
      pre: '丰富模板，',
      suf: '随选随用',
    },
    subTitle: '我们平台提供丰富多样的模板，满足您各种场景需求。同时，用户也可以上传模板共享，让选择更自由，创意无限。随选随用，轻松打造个性化演示。',
  },
  {
    title: {
      pre: '文档上传，',
      suf: '互鉴共享',
    },
    subTitle: '我们平台支持用户上传文档，实现资源共享。同时，用户还可以对模板进行评分，促进优秀作品的展示与交流，实现真正的互鉴共进。',
  },

]

const Block: React.FC<BlockProps> = ({ title, subTitle, children, className }) => {
  return (
    <div className={clsx('w-100% flex flex-col px-65 mt-10 box-border', className)}>
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

const ContentPPT: React.FC = () => {
  const viewRef = useRef(null)
  const [inViewport] = useInViewport(viewRef)
  const hasShow = useRef(false)

  if (inViewport)
    hasShow.current = true

  return (
    <Block title="PPT应用" className={clsx('mt-20 important:px-0 pt-10', styles.ppt)} subTitle="PPT生成主题板块，多样模板，轻松发布，助力高效演示与分享">
      <CSSTransition
        in={hasShow.current}
        timeout={1000}
        classNames="ppt-animate"
      >
        <div ref={viewRef}>
          <div className={clsx('flex mt-10px gap-4 flex-wrap jc-a px-60')}>
            {
              ppt_config.map((i, idx) => {
                return (
                  <div className={clsx('h-342px w-271px pt-54px box-border pr-25px pl-30px', styles[`ppt-card${idx}`])} key={idx}>
                    <div className="fs-22 fw-700">
                      <span>{i.title.pre}</span>
                      <span className="text-#2f82ff">{i.title.suf}</span>
                    </div>
                    <div className="lh-28px text-#4b5b76 fs-14 px-10px mt-27px">{i.subTitle}</div>
                  </div>
                )
              })
            }
          </div>
          <div className="text-center my-10">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                    colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
                    colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
                    lineWidth: 0,
                  },
                },
              }}
            >
              <Button type="primary" size="large" icon={<RightCircleTwoTone />}>
                立即前往
              </Button>
            </ConfigProvider>
          </div>
        </div>
      </CSSTransition>
    </Block>
  )
}

function ContentUtils() {
  const navigate = useNavigate()
  const handleJump = (g: string) => {
    navigate(`/chat/session?gptCode=${g}`)
  }

  return (
    <Block title="集成工具" subTitle="集成多平台ChatGPT，智能交互无界，畅享高效沟通新体验">
      <div className="flex w-100% jc-b box-border">
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
  )
}

const ContentPreset: React.FC = () => {
  const { data } = fetchPresetList({
    gptCode: 'gpt_2',
  })
  return (
    <Block title="预设市场" className="mt-20" subTitle="集成丰富预设，全场景覆盖，开箱即用大模型，轻松应对各类需求">
      <div className="flex mt-10px gap-4 flex-wrap jc-a">
        {
        data?.data.map((i, idx) => {
          const key = idx % 5
          return (
            <div
              key={idx}
              className={clsx('w-179px h-178px relative rounded-2 flex ai-c jc-c', styles[`preset${key}`])}
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

  return (
    <>
      <main className="w-100vw box-border mt-15">
        <div className={clsx(styles['slide-enter-content'], 'lh-10 px-90 ')}>
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
        <ContentUtils></ContentUtils>
        <ContentPreset></ContentPreset>
        <ContentPPT></ContentPPT>
      </main>
    </>

  )
}

export default Content
