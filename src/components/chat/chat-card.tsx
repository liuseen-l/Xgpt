import clsx from 'clsx'
import React from 'react'
import { Markdown } from './chat-markdown'

interface ChatCardItemProps {
  content: string
  isUser?: boolean
}

const ChatCardItem: React.FC<ChatCardItemProps> = ({ content, isUser }) => {
  return (
    <div className={clsx('w-100% flex mb-25px', isUser && 'jc-e')}>
      <div className={clsx('max-w-80% flex flex-col gap-8px', isUser && 'ai-e')}>
        {/* header icon */}
        <div className="h-30px w-30px flex ai-c jc-c border-base border-rounded-2">
          <div className="i-emojione:blond-haired-person-medium-light-skin-tone fs-20" />
        </div>
        {/* content */}
        <div className={clsx('border-base fs-14 leading-5 border-rounded-2 px-10px', isUser ? 'bubble-bg-base-user' : 'bubble-bg-base')}>
          <Markdown
            content={content}
          >
          </Markdown>
        </div>
        <div className="fs-12 sub-text-base">2024/03/12 13:23:31</div>
      </div>
    </div>

  )
}

const ChatCard: React.FC = () => {
  const item = {
    question: '我们一般有哪些?',
    replication: '好的，以下是一个简单的Java for循环示例：\n```css\nfor (int i = 0; i < 10; i++) {\n    System.out.println(i);\n}\n```\n\n在这个例子中，`i` 是计数器，从 `0` 开始，每次循环增加 `1`，直到达到 `10`。在每次循环中，都会执行缩进块中的代码（在这种情况下，只是打印出当前的 `i` 值）。',
  }

  return (
    <>
      <ChatCardItem content={item.question} isUser></ChatCardItem>
      <ChatCardItem content={item.replication}></ChatCardItem>
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
