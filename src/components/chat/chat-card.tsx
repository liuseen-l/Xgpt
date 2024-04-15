import clsx from 'clsx'
import React from 'react'
import { Markdown } from './chat-markdown'
import styles from './chat-room.module.scss'

interface ChatCardItemProps {
  content: string
  isUser?: boolean
  createTime: string
}

const ChatCardItem: React.FC<ChatCardItemProps> = ({ content, createTime, isUser }) => {
  return (
    <div className={clsx('w-100% flex mb-25px card-text-base', isUser && 'jc-e', styles['chat-message'])}>
      <div className={clsx('max-w-80% flex flex-col gap-8px', isUser && 'ai-e')}>
        {/* header icon */}
        <div className="h-30px w-30px flex ai-c jc-c border-base border-rounded-2">
          {
            isUser
              ? <div className="i-emojione:blond-haired-person-medium-light-skin-tone fs-20" />
              : <div className="i-arcticons:openai-chatgpt fs-20" />
          }
        </div>
        {/* content */}
        <div className={clsx('border-base fs-14 leading-5 border-rounded-2 px-10px', isUser ? 'bubble-bg-base-user' : 'bubble-bg-base')}>
          <Markdown
            content={content}
          >
          </Markdown>
        </div>
        <div className="fs-12 sub-text-base">{createTime}</div>
      </div>
    </div>

  )
}

interface ChatCardProps {
  question: string
  replication: string
  createTime: string
}

const ChatCard: React.FC<ChatCardProps> = ({ question, replication, createTime }) => {
  return (
    <>
      { !!question.length && <ChatCardItem content={question} isUser createTime={createTime}></ChatCardItem>}
      { !!replication.length && <ChatCardItem content={replication} createTime={createTime}></ChatCardItem>}
    </>
  )
}
export default ChatCard
// const content = `\`\`\`js
// import React from 'react'
// import ReactDOM from 'react-dom'
// import Markdown from 'react-markdown'
// import rehypeHighlight from 'rehype-highlight'

// const markdown = \`
// # Your markdown here
// \`

// ReactDOM.render(
//   <Markdown rehypePlugins={[rehypeHighlight]}>{markdown}</Markdown>,
//   document.querySelector('#content')
// )
// \`\`\``
//   const content = `
//   *React-Markdown* now supports ~strikethrough~. Thanks to gfm plugin.
//   ## GitHub flavored markdown (GFM)

// For GFM, you can *also* use a plugin:
// [\`remark-gfm\`](https://github.com/remarkjs/react-markdown#use).
// It adds support for GitHub-specific extensions to the language:
// tables, strikethrough, tasklists, and literal URLs.

// These features **do not work by default**.
// 👆 Use the toggle above to add the plugin.

// | Feature    | Support              |
// | ---------: | :------------------- |
// | CommonMark | 100%                 |
// | GFM        | 100% w/ \`remark - gfm\` |

// ~~strikethrough~~

// * [ ] task list
// * [x] checked item

// https://example.com

// ## HTML in markdown

// ⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can
// use [\`rehype-raw\`](https://github.com/rehypejs/rehype-raw).
// You should probably combine it with
// [\`rehype-sanitize\`](https://github.com/rehypejs/rehype-sanitize).

// <blockquote>
//   👆 Use the toggle above to add the plugin.
// </blockquote>
// `

// const content = `A paragraph with *emphasis* and **strong importance**.

// > A block quote with ~strikethrough~ and a URL: https://reactjs.org.

// * Lists
// * [ ] todo
// * [x] done

// A table:

// | a | b |
// | - | - |
// `

// https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fbjcdn.openstorage.cn%2Fxinghuo-privatedata%2F%252Ftmp%2FapiTempFile713fa63451bf488f83ac61102b4e191d746542160662978924%2F%25E6%25AF%2595%25E4%25B8%259A%25E8%25AE%25BE%25E8%25AE%25A1%25E6%2588%2590%25E6%259E%259C%25E5%25B1%2595%25E7%25A4%25BA.pptx&wdOrigin=BROWSELINK
// https://bjcdn.openstorage.cn/xinghuo-privatedata/%2Ftmp/apiTempFile713fa63451bf488f83ac61102b4e191d746542160662978924/%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A1%E6%88%90%E6%9E%9C%E5%B1%95%E7%A4%BA.pptx
