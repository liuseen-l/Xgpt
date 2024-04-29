import type { GetProp, UploadProps } from 'antd'

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

/**
 * file 转 base64
 * @param file
 * @returns
 */
export function getBase64(file: FileType): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file as Blob)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

/**
 * 获取当前时间时间戳
 */
export function getTimeUnixStr() {
  return `${Date.now()}`
}

/**
 * 睡眠
 * @param time
 * @returns
 */
export function sleep(time: number) {
  return new Promise(r => setTimeout(() => r(true), time))
}
