import type { UploadFile, UploadProps } from 'antd'
import { Button, Image, Input, Upload } from 'antd'
import React, { useState } from 'react'
import ChatAction from './chat-action'
import styles from './antd.module.scss'
import { ACTIONS_CONFIGS } from '~/consts/action-configs.tsx'
import { useChatStore } from '~/stores/chat'
import type { FileType } from '~/utils/common'
import { getBase64 } from '~/utils/common'
import { FunctionCodeType } from '~/api/chat/types'

interface Props {
  scrollDomToBottom: () => void
  changeTheme: () => void
}

const ChatInput: React.FC<Props> = ({ scrollDomToBottom, changeTheme }) => {
  const [userInput, setUserInput] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const { handleSendSeesion, currentSession, isSendLoading } = useChatStore(state => ({
    handleSendSeesion: state.handleSendSeesion,
    currentSession: state.currentSession,
    isSendLoading: state.isSendLoading,
  }))

  const handleSend = async () => {
    try {
      await handleSendSeesion(userInput, fileList)
      setUserInput('')
      setFileList([])
      scrollDomToBottom()
    }
    catch (error) {

    }
  }

  const onInput = (text: string) => {
    setUserInput(text)
  }

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview)
      file.preview = await getBase64(file.originFileObj as FileType)

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  return (
    <div className="w-100% p-20px pt-10px tborder-base box-border relative">
      <div className="flex flex-col">
        <div className="mb-10px flex gap-6px">
          <ChatAction text={ACTIONS_CONFIGS.scroll.text} icon={ACTIONS_CONFIGS.scroll.inco} onClick={scrollDomToBottom} />
          <ChatAction text={ACTIONS_CONFIGS.theme.text} icon={ACTIONS_CONFIGS.theme.inco} onClick={changeTheme} />
          {

            currentSession.functionCode === FunctionCodeType.function3
            && (
              <>
                <Upload
                  action=""
                  maxCount={1}
                  listType="picture"
                  onPreview={handlePreview}
                  onChange={handleChange}
                  className={styles.upload}
                  fileList={fileList}
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
          onInput={e => onInput(e.currentTarget.value)}
          placeholder="请输入内容......"
          className="bg-base hover:border-[#d9d9d9] dark:hover:border-[#ffffff31] dark:border-[#ffffff31] focus:border-[#1d93ab] dark:focus:border-[#1d93ab] dark:placeholder:text-neutral-600 text-base "
          style={{ minHeight: 150, maxHeight: 300 }}
        >
        </Input.TextArea>
        <Button onClick={handleSend} className="bg-[#1d93ab] border-none text-white important:hover:bg-[#1d93ab] hover:filter-brightness-90 important:hover:text-white fs-12 absolute z-100 bottom-10px right-10px" loading={isSendLoading}>
          发送
        </Button>
      </div>
    </div>
  )
}

export default ChatInput
