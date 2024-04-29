import { resolvePPTOutline } from './helper'
import type { RequestPPTOutline, ResponsePPTOutline } from './types'
import request from '~/utils/request'

const API_URL = {
  PPT_OUTLINE: '/ppt/outline/create',
}

/**
 * 获取ppt大纲
 * @param params
 * @returns
 */
export async function fetchPPTOutline(params: RequestPPTOutline) {
  // const res = await request.post<ResponsePPTOutline>(API_URL.PPT_OUTLINE, params)
  // return res.data?.data
  const obj = {
    outline: {
      subTitle: ' 探索经典文学的人性与智慧',
      chapters: [
        {
          chapterContents: [
            {
              chapterTitle: '《红楼梦》人物解析',
            },
            {
              chapterTitle: '情感世界探究',
            },
            {
              chapterTitle: '社会背景剖析',
            },
          ],
          chapterTitle: '《红楼梦》阅读心得',
        },
        {
          chapterContents: [
            {
              chapterTitle: '《西游记》主要情节',
            },
            {
              chapterTitle: '人物性格分析',
            },
            {
              chapterTitle: '主题思想解读',
            },
          ],
          chapterTitle: '《西游记》故事解析',
        },
        {
          chapterContents: [
            {
              chapterTitle: '宋江智谋与领导',
            },
            {
              chapterTitle: '武松的侠义精神',
            },
            {
              chapterTitle: '鲁智深的出世入世',
            },
          ],
          chapterTitle: '《水浒传》人物评述',
        },
      ],
      title: ' 四大名著的深度解读',
    },
    sid: '3536054b79b4481daac58625f9568fd5',
    content: '四大名著读书报告',
  }

  return resolvePPTOutline(obj)
}
