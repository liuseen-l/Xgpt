import { fetchImageGen, fetchImageUnd, fetchPPTGen, fetchPushTextSession } from '~/api'
import { functionCodeType } from '~/api/chat/types'

export const apiMap: Record<string, Record<string, any>> = {
  /**
   * 文心
   */
  gpt_1: {

  },
  /**
   * 讯飞
   */
  gpt_2: {
    /**
     * 文本问答
     */
    [functionCodeType.function1]: fetchPushTextSession,
    /**
     * 图片生成
     */
    [functionCodeType.function2]: fetchImageGen,
    /**
     * 图片理解
     */
    [functionCodeType.function3]: fetchImageUnd,
    /**
     * ppt生成
     */
    [functionCodeType.function4]: fetchPPTGen,
  },
  /**
   * 通义千问
   */
  gpt_4: {

  },
}
