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

/**
 * 收藏数展示
 * @param c
 */
export function getAmountStr(c: number) {
  if (c <= 10)
    return c
  if (c > 10 && c < 100)
    return '10+'
  if (c > 100 && c < 1000)
    return '100+'

  if (c > 1000 && c < 10000)
    return '1k+'

  if (c > 10000 && c < 100000)
    return '1w+'
}
