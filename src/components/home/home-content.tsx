import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { Button, ConfigProvider } from 'antd'
import { TinyColor } from '@ctrl/tinycolor'
import { RightCircleTwoTone } from '@ant-design/icons'
import { useInViewport } from 'ahooks'
import RINGS from 'vanta/dist/vanta.rings.min'
import styles from './home-content.module.scss'
import { fetchGetFunction, fetchPresetList } from '~/api'
import { PPT_CONFIG, UTILS_CONFIG } from '~/consts/home-config'
import type { GptFunctionItem } from '~/api/chat/types'

interface BlockProps {
  title: string
  subTitle: string
  children?: React.ReactNode
  className?: string
  titleClass?: string
}

const colors1 = ['#6253E1', '#04BEFE']

function getHoverColors(colors: string[]) {
  return colors.map(color => new TinyColor(color).lighten(5).toString())
}
function getActiveColors(colors: string[]) {
  return colors.map(color => new TinyColor(color).darken(5).toString())
}

const Block: React.FC<BlockProps> = ({ title, subTitle, children, className, titleClass }) => {
  return (
    <div className={clsx('w-100% flex flex-col px-65 box-border of-hidden', className)}>
      <div className={clsx('text-center fs-30 mt-20px mb-40px fw-700', titleClass)}>
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

  const navigate = useNavigate()

  return (
    <Block title="PPT应用" className={clsx('important:px-0 pt-10px h-700px', styles.ppt)} subTitle="PPT生成主题板块，多样模板，轻松发布，助力高效演示与分享">
      <CSSTransition
        in={hasShow.current}
        timeout={1000}
        classNames="ppt-animate"
      >
        <div ref={viewRef} className={clsx('flex mt-10px gap-4 flex-wrap jc-a px-60')}>
          {
            PPT_CONFIG.map((i, idx) => {
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
      </CSSTransition>
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
          <Button type="primary" size="large" onClick={() => navigate(`/ppt`)} icon={<RightCircleTwoTone />}>
            立即前往
          </Button>
        </ConfigProvider>
      </div>
    </Block>
  )
}

function ContentUtils() {
  const navigate = useNavigate()
  const handleJump = (g: string) => {
    navigate(`/chat/session?gptCode=${g}`)
  }

  const { data } = fetchGetFunction()
  const viewRef = useRef(null)
  const [inViewport] = useInViewport(viewRef)
  const hasShow = useRef(false)

  if (inViewport)
    hasShow.current = true
  return (
    <Block title="集成工具" className={clsx(styles.utils, 'important:mt-0')} titleClass="mt-60px" subTitle="集成多平台ChatGPT，智能交互无界，畅享高效沟通新体验">
      <div className="flex w-100% pb-80px jc-b">
        {
          UTILS_CONFIG.map((i, idx) => {
            return (
              <CSSTransition
                key={idx}
                in={hasShow.current}
                timeout={1000}
                classNames={`home-card${idx + 1}`}
              >
                <div ref={viewRef}>
                  <div className={clsx('h-346px w-358px rounded-5 hover:scale-105 transition-all relative cursor-pointer', styles[`card${idx + 1}`])} onClick={() => handleJump(i.url)}>
                    <span className="fs-20 fw-600">{i.title}</span>
                    <p className="text-#4b5b76 lh-7">{i.intro}</p>
                    <div className="absolute gap-col-8 gap-row-3 grid mt-10px grid-cols-2 grid-rows-2">

                      {
                        (data?.data as Record<string, GptFunctionItem[]>)?.[i.url]?.map((i, idx) => {
                          return (
                            <div key={idx} className="flex ai-c">
                              <div className="i-material-symbols:fitbit-check-small fs-20 text-#1975FF"></div>
                              <div className="text-#252B3A fs-14 fw-400">{i.functionName}</div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
              </CSSTransition>
            )
          })
        }

      </div>
    </Block>
  )
}

const ContentPreset: React.FC = () => {
  const { data } = fetchPresetList({
    gptCode: 'gpt_2',
  })

  return (
    <Block title="预设市场" className={clsx('important:px-0', styles.preset)} subTitle="集成丰富预设，全场景覆盖，开箱即用大模型，轻松应对各类需求">
      <div className="flex mt-10px gap-4 flex-wrap pb-100px jc-a mx-65 relative z-20">
        {
          data?.data.map((i, idx) => {
            const key = idx % 5
            return (
              <div
                key={idx}
                className={clsx('w-179px h-178px relative rounded-2 flex ai-c jc-c', styles[`preset${key}`])}
              >
                <span className="absolute left-0 top-0 h-25px lh-23px w-50px b-1-#f8faff fs-13 jc-c ai-c flex tracking-[2px] text-#fff ">{i.kind}</span>
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
  const [vantaEffect, setVantaEffect] = useState(null)
  const myRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(RINGS({
        el: myRef.current,
        backgroundColor: '#e5f1ff',
      }))
    }
    return () => {
      if (vantaEffect)
        (vantaEffect as any).destroy()
    }
  }, [vantaEffect])
  return (
    <>
      <main className="w-100vw box-border">
        <div className={clsx('lh-10 w-100%')}>
          <div ref={myRef} className="w-100% h-100vh relative z-20">
            <div className={clsx(styles['slide-enter-content'], 'text-black pt-80px pl-200px')}>
              <div className="fs-30">欢迎来到我们的大模型融合平台与PPT智能创意社区！</div>
              <div className="fs-20">一站式体验多种GPT技术魅力。</div>
              <div>高效对话，让交流更轻松自在。</div>
              <div>智能创作，激发无限创意火花</div>
              <div>安全稳定，保障您的数据安全。</div>
              <div>专业团队，提供贴心技术支持。</div>
              <div>精准推荐，个性化服务触手可及</div>
              <div>实时互动，共享智慧生活新体验。</div>
              <div>加入我们，一起探索AI的无限可能！</div>
            </div>
          </div>
        </div>
        <ContentUtils></ContentUtils>
        <ContentPreset></ContentPreset>
        <ContentPPT></ContentPPT>
        <section className="h-100px flex flex-col ai-c jc-c bg-#1a1a1a gap-10px text-neutral-2">
          <span className="fs-14">版权所有 @liujiahao @chenzhenyu</span>
          <span className="fs-14">反馈邮箱 773890440@qq.com 947219346@qq.com</span>
        </section>
      </main>
    </>

  )
}

export default Content
