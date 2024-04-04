import type { RefObject } from 'react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkMath from 'remark-math'
import RemarkGfm from 'remark-gfm'
import 'katex/dist/katex.min.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark, coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

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
  console.log(456, escapedContent)

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
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')

          const theme = {
            light: coldarkDark,
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
        p: pProps => <p {...pProps} dir="auto" />,
        a: (aProps) => {
          const href = aProps.href || ''
          const isInternal = /^\/#/i.test(href)
          const target = isInternal ? '_self' : aProps.target ?? '_blank'
          return <a {...aProps} target={target} />
        },
      }}
    >
      {props.content}
    </ReactMarkdown>
  )
}

export const MarkdownContent = React.memo(_MarkDownContent)

export function Markdown(
  props: {
    content: string
    loading?: boolean
    fontSize?: number
    parentRef?: RefObject<HTMLDivElement>
    defaultShow?: boolean
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="markdown-body"
      ref={mdRef}
      dir="auto"
    >
      <MarkdownContent content={props.content} />
    </div>
  )
}
