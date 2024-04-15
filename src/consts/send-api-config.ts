import { fetchImageGen, fetchPPTGen, fetchPushTextSession } from '~/api'

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
    function_1: fetchPushTextSession,
    /**
     * 图片生成
     */
    function_2: fetchImageGen,
    /**
     * 图片理解
     */
    function_3: fetchPPTGen,
    /**
     * ppt生成
     */
    function_4: fetchPPTGen,
  },
  /**
   * 通义千问
   */
  gpt_4: {

  },
}
