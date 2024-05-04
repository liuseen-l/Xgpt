import type { RefObject } from 'react'
import React, { useContext, useMemo, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkMath from 'remark-math'
import RemarkGfm from 'remark-gfm'
import 'katex/dist/katex.min.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { coldarkDark, gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button, Image } from 'antd'
import parseUrl from 'parse-url'
import { ThemeInitContext, useMessage } from '~/utils'

const { success } = useMessage()

function escapeDollarNumber(text: string) {
  let escapedText = ''

  for (let i = 0; i < text.length; i += 1) {
    let char = text[i]
    const nextChar = text[i + 1] || ' '

    if (char === '$' && nextChar >= '0' && nextChar <= '9')
      char = '\\$'

    escapedText += char
  }

  return escapedText
}

function escapeBrackets(text: string) {
  const pattern
    = /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g
  return text.replace(
    pattern,
    (match, codeBlock, squareBracket, roundBracket) => {
      if (codeBlock)
        return codeBlock
      else if (squareBracket)
        return `$$${squareBracket}$$`
      else if (roundBracket)
        return `$${roundBracket}$`

      return match
    },
  )
}

function _MarkDownContent(props: { content: string }) {
  const escapedContent = useMemo(
    () => escapeBrackets(escapeDollarNumber(props.content)),
    [props.content],
  )

  const { isDark } = useContext(ThemeInitContext)

  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        RehypeKatex,
      ]}
      components={{
        /**
         * match
         *  1. ````lang-type ```
         *  2. ` `
         */
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')

          const theme = {
            light: isDark ? gruvboxDark : coldarkDark,
          }

          return !inline && match
            ? (
              <SyntaxHighlighter
                showLineNumbers={false}
                style={theme.light}
                language={match[1]}
                PreTag="div"
                className="border-rounded-2"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
              )
            : (
              <code className={className} {...props}>
                {children}
              </code>
              )
        },
        p: pProps => <p {...pProps} className="break-all" dir="auto" />,
        a: (aProps) => {
          const href = aProps.href || ''
          const isInternal = /^\/#/i.test(href)
          const target = isInternal ? '_self' : aProps.target ?? '_blank'

          const pathname = parseUrl(href).pathname
          if (pathname.endsWith('jpg') || pathname.endsWith('png'))
            return <Image width={400} src={href} />

          if (href.endsWith('pptx')) {
            const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
              const btn = (e.target as HTMLSpanElement).parentNode!
              const root = btn?.parentNode
              const dom = document.createElement('iframe')
              dom.setAttribute('src', `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(href)}`)
              dom.setAttribute('width', '800px')
              dom.setAttribute('height', '600px')
              root?.insertBefore(dom, btn)
              root?.removeChild(btn)
            }
            return (
              <div>
                <Button onClick={handleClick} className="fs-12 important:text-white fw-700 flex ai-c jc-b p-8px gap-5px card-text-base session-btn-base">
                  一键生成PPT
                </Button>
              </div>
            )
          }

          return <a {...aProps} className="dark:color-blue" target={target} />
        },

      }}
    >
      {escapedContent}
    </ReactMarkdown>
  )
}

export const MarkdownContent = React.memo(_MarkDownContent)

export function Markdown(
  props: {
    content: string
    loading?: boolean
    fontSize?: number
    isUser?: boolean
    parentRef?: RefObject<HTMLDivElement>
    defaultShow?: boolean
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null)
  const handleCopy = async () => {
    const text = mdRef.current!.innerText
    await navigator.clipboard.writeText(text)
    success('复制成功')
  }

  return (
    <>
      <div
        ref={mdRef}
      >
        <MarkdownContent content={props.content} />
      </div>
      {
        !props.isUser && (
          <div className="mt-[-10px] mb-5px flex jc-e h-20px ">
            <div onClick={handleCopy} className="i-ri:file-copy-2-line fs-16 cursor-pointer  sub-text-base"></div>
          </div>
        )
      }
    </>
  )
}
