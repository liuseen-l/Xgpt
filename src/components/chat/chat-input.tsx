import type { UploadFile, UploadProps } from 'antd'
import { Button, Image, Input, Upload } from 'antd'
import React, { useState } from 'react'
import ChatAction from './chat-action'
import styles from './antd.module.scss'
import { ACTIONS_CONFIGS } from '~/consts/action-configs.tsx'
import { useChatStore } from '~/stores/chat'
import type { FileType } from '~/utils/common'
import { getBase64, sleep } from '~/utils/common'
import { FunctionCodeType } from '~/api/chat/types'
import { fetchStopSend } from '~/api'
import { useMessage } from '~/utils'

interface Props {
  scrollDomToBottom: () => void
  changeTheme: () => void
}

const { error } = useMessage()
const ChatInput: React.FC<Props> = ({ scrollDomToBottom, changeTheme }) => {
  const [userInput, setUserInput] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [isStopLoading, setStopLoading] = useState(false)

  const { handleSendSeesion, currentSession, isSendLoading, cid } = useChatStore(state => ({
    handleSendSeesion: state.handleSendSeesion,
    currentSession: state.currentSession,
    isSendLoading: state.isSendLoading,
    cid: state.cid,
  }))

  const handleSend = async () => {
    try {
      await handleSendSeesion(userInput, fileList)
      setUserInput('')
      setStopLoading(false)
      setFileList([])
      scrollDomToBottom()
    }
    catch (error) {

    }
  }

  const handleCancel = async () => {
    setStopLoading(true)
    await fetchStopSend({
      cid,
    })
    setStopLoading(false)
  }

  const onInput = (text: string) => {
    setUserInput(text)
  }

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const uploadProps: UploadProps = {
    fileList,
    maxCount: 1,
    beforeUpload: (file) => {
      console.log(file)

      const isPic = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isPic)
        error(`请上传以png,jpg结尾的文件`)
      return isPic || Upload.LIST_IGNORE
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList)
    },
    onPreview: async (file: UploadFile) => {
      if (!file.url && !file.preview)
        file.preview = await getBase64(file.originFileObj as FileType)

      setPreviewImage(file.url || (file.preview as string))
      setPreviewOpen(true)
    },
    listType: 'picture',
    customRequest: async (file: any) => {
      file.onProgress({
        percent: 20,
      })
      await sleep(1000)
      file.onProgress({
        percent: 100,
      })
      await sleep(200)
      file.onSuccess()
    },
  }
  return (
    <div className="w-100% p-20px pt-10px tborder-base box-border relative">
      {
        isSendLoading && <Button type="link" loading={isStopLoading} onClick={handleCancel} className="absolute left-50% translate-x-[-50%] top-[-30px]">停止生成</Button>
      }
      <div className="flex flex-col">
        <div className="mb-10px flex gap-6px">
          <ChatAction text={ACTIONS_CONFIGS.scroll.text} icon={ACTIONS_CONFIGS.scroll.inco} onClick={scrollDomToBottom} />
          <ChatAction text={ACTIONS_CONFIGS.theme.text} icon={ACTIONS_CONFIGS.theme.inco} onClick={changeTheme} />
          {

            currentSession.functionCode === FunctionCodeType.function3
            && (
              <>
                <Upload
                  {...uploadProps}
                  className={styles.upload}
                >
                  <ChatAction text={ACTIONS_CONFIGS.picture.text} icon={ACTIONS_CONFIGS.picture.inco} />
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: visible => setPreviewOpen(visible),
                      afterOpenChange: visible => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
              </>
            )
          }
        </div>
      </div>
      <div className="relative">
        <Input.TextArea
          value={userInput}
          disabled={isSendLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          onInput={e => onInput(e.currentTarget.value)}
          placeholder="请输入内容......，可以通过shift+回车换行"
          className="input-bg-base hover:border-[#d9d9d9] dark:hover:border-[#ffffff31] dark:border-[#ffffff31] focus:border-[#1d93ab] dark:focus:border-[#1d93ab] dark:placeholder:text-neutral-600 text-base "
          style={{ minHeight: 150, maxHeight: 300 }}
        >
        </Input.TextArea>
        <Button onClick={handleSend} type="primary" className="dark:bg-[#1d93ab] border-none important:dark:hover:bg-[#1d93ab] hover:filter-brightness-90 important:dark:hover:text-white fs-12 absolute z-100 bottom-10px right-10px" loading={isSendLoading}>
          发送
        </Button>
      </div>
    </div>
  )
}

export default ChatInput
