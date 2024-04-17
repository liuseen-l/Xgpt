import { fetchImageGen, fetchImageUnd, fetchPPTGen, fetchPushTextSession } from '~/api'
import { functionCodeType } from '~/api/chat/types'

export const GPT_URL: Record<string, Record<string, any>> = {
  /**
   * 文心
   */
  gpt_1: {
    /**
     * 文本问答
     */
    [functionCodeType.function1]: '/chat/wenXin/question',
    /**
     * 图片生成
     */
    [functionCodeType.function2]: '/chat/wenXin/image/create',
    /**
     * 图片理解
     */
    [functionCodeType.function3]: '/chat/wenXin/image/understand',
  },
  /**
   * 讯飞
   */
  gpt_2: {
    /**
     * 文本问答
     */
    [functionCodeType.function1]: '/chat/xf/question',
    /**
     * 图片生成
     */
    [functionCodeType.function2]: '/chat/xf/image/create',
    /**
     * 图片理解
     */
    [functionCodeType.function3]: '/chat/xf/image/understander',
    /**
     * ppt生成
     */
    [functionCodeType.function4]: '/chat/xf/ppt/create',
  },
  /**
   * 通义千问
   */
  gpt_4: {
    /**
     * 文本问答
     */
    [functionCodeType.function1]: '/chat/tongYi/question',
    /**
     * 图片生成
     */
    [functionCodeType.function2]: '/chat/tongYi/image/create',
    /**
     * 图片理解
     */
    [functionCodeType.function3]: '/chat/tongYi/image/understand',
  },
}

export const apiMap: Record<string, any> = {
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

}
