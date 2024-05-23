import { resolvePPTOutline } from './helper'
import type { RequestComment, RequestCommentList, RequestCreatePPT, RequestDeleteUpload, RequestFolderDelete, RequestFolderRename, RequestMyUpload, RequestPPTCollect, RequestPPTCollectList, RequestPPTCreateFolder, RequestPPTFolders, RequestPPTList, RequestPPTOutline, RequestReplyList, RequestViewPPT, ResponseComment, ResponseCommentList, ResponseCreatePPT, ResponseDeleteUpload, ResponseMyUpload, ResponsePPTClassify, ResponsePPTCollect, ResponsePPTCollectList, ResponsePPTFolders, ResponsePPTList, ResponsePPTOutline, ResponsePPTTheme, ResponseReplyList } from './types'
import request from '~/utils/request'

const API_URL = {
  PPT_OUTLINE: '/ppt/outline/create',
  PPT_CREATE: '/ppt/create/by/outline',
  PPT_CLASSIFY: '/ppt/kind/list',
  PPT_LIST: '/ppt/list/by/kind',
  PPT_COLLECT: '/ppt/collect',
  PPT_FOLDERS: '/ppt/collect/folder/list',
  PPT_FOLDER_CREATE: '/ppt/folder/create',
  PPT_COLLECT_LIST: '/ppt/collect/list',
  PPT_FOLDER_DELETE: '/ppt/folder/delete',
  PPT_FOLDER_RENAME: '/ppt/folder/update',
  PPT_MY_UPLOAD: '/ppt/me/list',
  PPT_UPLOAD: '/ppt/upload',
  PPT_UPLOAD_DELETE: '/ppt/delete',
  PPT_THEME: '/ppt/color/list',
  PPT_VIEW: '/ppt/see',
  PPT_COMMENT_LIST: '/ppt/comment/list',
  PPT_REPLY_LIST: '/ppt/reply/list',
  PPT_COMMENT: '/ppt/comment',
}
const obj = {
  outline: {
    subTitle: ' 如何有效提升公众演说力',
    chapters: [
      {
        chartFlag: false,
        searchFlag: false,
        chapterContents: [
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763175,
            chapterTitle: '主题背景阐述',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763176,
            chapterTitle: '主题重要性分析',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763177,
            chapterTitle: '主题相关数据展示',
            fileType: 0,
          },
        ],
        fileUrl: '',
        id: 64763152,
        chapterTitle: '演讲主题介绍',
        fileType: 0,
      },
      {
        chartFlag: false,
        searchFlag: false,
        chapterContents: [
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763235,
            chapterTitle: '个人背景概述',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763236,
            chapterTitle: '职业经历亮点',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763237,
            chapterTitle: '与主题的关联性',
            fileType: 0,
          },
        ],
        fileUrl: '',
        id: 64763155,
        chapterTitle: '演讲者自我介绍',
        fileType: 0,
      },
      {
        chartFlag: false,
        searchFlag: false,
        chapterContents: [
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763209,
            chapterTitle: '演讲主题核心',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763210,
            chapterTitle: '关键信息提炼',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763211,
            chapterTitle: '内容逻辑梳理',
            fileType: 0,
          },
        ],
        fileUrl: '',
        id: 64763154,
        chapterTitle: '演讲内容概览',
        fileType: 0,
      },
      {
        chartFlag: false,
        searchFlag: false,
        chapterContents: [
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763178,
            chapterTitle: '第一部分核心概念',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763179,
            chapterTitle: '第一部分详细解析',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763180,
            chapterTitle: '第一部分实际应用',
            fileType: 0,
          },
        ],
        fileUrl: '',
        id: 64763156,
        chapterTitle: '第一部分详解',
        fileType: 0,
      },
      {
        chartFlag: false,
        searchFlag: false,
        chapterContents: [
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763212,
            chapterTitle: '第二部分核心内容',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763213,
            chapterTitle: '分点阐述关键信息',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763214,
            chapterTitle: '实例解析加深理解',
            fileType: 0,
          },
        ],
        fileUrl: '',
        id: 64763158,
        chapterTitle: '第二部分详解',
        fileType: 0,
      },
      {
        chartFlag: false,
        searchFlag: false,
        chapterContents: [
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763215,
            chapterTitle: '第三部分核心概念',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763216,
            chapterTitle: '关键内容深入剖析',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763217,
            chapterTitle: '实例应用与效果展示',
            fileType: 0,
          },
        ],
        fileUrl: '',
        id: 64763153,
        chapterTitle: '第三部分详解',
        fileType: 0,
      },
      {
        chartFlag: false,
        searchFlag: false,
        chapterContents: [
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763206,
            chapterTitle: '问题一的深度解析',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763207,
            chapterTitle: '解答关键问题二',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763208,
            chapterTitle: '针对问题三的讨论',
            fileType: 0,
          },
        ],
        fileUrl: '',
        id: 64763157,
        chapterTitle: '关键问题解答',
        fileType: 0,
      },
      {
        chartFlag: false,
        searchFlag: false,
        chapterContents: [
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763218,
            chapterTitle: '回顾演讲要点',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763219,
            chapterTitle: '表达诚挚感谢',
            fileType: 0,
          },
          {
            chartFlag: 'false',
            searchFlag: 'false',
            fileUrl: '',
            id: 64763220,
            chapterTitle: '期待后续交流',
            fileType: 0,
          },
        ],
        fileUrl: '',
        id: 64763159,
        chapterTitle: '结束语及致谢',
        fileType: 0,
      },
    ],
    fileUrl: '',
    end: '',
    id: 64763109,
    title: ' 演讲技巧与表达艺术',
    fileType: 0,
  },
  sid: '2e2becd3740545e1aec01c2ac1247062',
  content: '演讲模板PPT',
}

/**
 * 获取ppt大纲
 * @param params
 * @returns
 */
export async function fetchPPTOutline(params: RequestPPTOutline) {
  const res = await request.post<ResponsePPTOutline>(API_URL.PPT_OUTLINE, params)
  const data = res.data?.data
  return resolvePPTOutline(data)
}

/**
 * 生成ppt
 * @param params
 * @returns
 */
export async function fetchCreatePPT(params: RequestCreatePPT) {
  const res = await request.post<ResponseCreatePPT>(API_URL.PPT_CREATE, params)
  console.log(res)

  const r = {
    code: 200,
    data: {
      userHeadshot: null,
      userCode: '123',
      username: null,
      question: '授课模板PPT',
      replication: 'https://bjcdn.openstorage.cn/xinghuo-privatedata/%2Ftmp/apiTempFilec7fac625ccd943d9899c4f177cd4aedd1668730078262484467/%E6%8E%88%E8%AF%BE%E6%A8%A1%E6%9D%BF%E8%AE%BE%E8%AE%A1%E8%A6%81%E7%82%B9.pptx',
      coverUrl: 'https://bjcdn.openstorage.cn/xinghuo-privatedata/2x8wv4xs.jpg',
      createTime: '2024/04/30 15:42:33',
      replyTime: '2024/04/30 15:42:33',
    },
    message: 'ok',
  }
  return r.data
  // return res.data?.data
}

/**
 * ppt分类
 * @param params
 * @returns
 */
export async function fetchPPTClassify() {
  const res = await request.get<ResponsePPTClassify>(API_URL.PPT_CLASSIFY)
  return res.data?.data
}

/**
 * ppt列表
 * @param params
 * @returns
 */
export async function fetchPPTList(params: RequestPPTList) {
  const res = await request.get<ResponsePPTList>(API_URL.PPT_LIST, {
    params,
  })
  return res.data?.data
}

/**
 * 收藏ppt
 * @param params
 * @returns
 */
export async function fetchPPTCollect(params: RequestPPTCollect) {
  const res = await request.get<ResponsePPTCollect>(API_URL.PPT_COLLECT, {
    params,
  })
  return res.data?.data
}

/**
 * 收藏时获取文件夹列表
 * @param params
 * @returns
 */
export async function fetchPPTFolders(params?: RequestPPTFolders) {
  const res = await request.get<ResponsePPTFolders>(API_URL.PPT_FOLDERS, {
    params,
  })
  return res.data?.data
}

/**
 * 创建文件夹
 * @param params
 * @returns
 */
export async function fetchPPTCreateFolder(params: RequestPPTCreateFolder) {
  return request.get(API_URL.PPT_FOLDER_CREATE, {
    params,
  })
}

/**
 * 获取单个文件夹下的ppt
 * @param params
 * @returns
 */
export async function fetchPPTCollectList(params: RequestPPTCollectList) {
  const res = await request.get<ResponsePPTCollectList>(API_URL.PPT_COLLECT_LIST, {
    params,
  })
  return res.data?.data
}

/**
 * 删除文件夹
 * @param params
 * @returns
 */
export async function fetchFolderDelete(params: RequestFolderDelete) {
  return request.get(API_URL.PPT_FOLDER_DELETE, {
    params,
  })
}

/**
 * 重命名文件夹
 * @param params
 * @returns
 */
export async function fetchFolderRename(params: RequestFolderRename) {
  return request.get(API_URL.PPT_FOLDER_RENAME, {
    params,
  })
}

/**
 * 我的上传
 * @param params
 * @returns
 */
export async function fetchMyUpload(params: RequestMyUpload) {
  const res = await request.get<ResponseMyUpload>(API_URL.PPT_MY_UPLOAD, {
    params,
  })
  return res.data?.data
}

/**
 * 上传ppt
 * @param params
 * @returns
 */
export async function fetchPPTUpload(params: FormData) {
  const res = await request.post<ResponseMyUpload>(API_URL.PPT_UPLOAD, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data?.data
}

/**
 * 删除上传的文件
 * @param params
 * @returns
 */
export async function fetchDeleteUpload(params: RequestDeleteUpload) {
  const res = await request.get<ResponseDeleteUpload>(API_URL.PPT_UPLOAD_DELETE, {
    params,
  })
  return res.data?.data
}

/**
 * 获取ppt主题
 * @returns
 */
export async function fetchPPTTheme() {
  const res = await request.get<ResponsePPTTheme>(API_URL.PPT_THEME)
  return res.data?.data
}

/**
 * 记录浏览次数
 * @param params
 */
export async function fetchViewPPT(params: RequestViewPPT) {
  request.get(API_URL.PPT_VIEW, {
    params,
  })
}

/**
 * 获取一级评论数量
 * @param params
 * @returns
 */
export async function fetchCommentList(params: RequestCommentList) {
  const res = await request.get<ResponseCommentList>(API_URL.PPT_COMMENT_LIST, {
    params,
  })
  return res.data?.data
}

/**
 * 获取二级评论数量
 * @param params
 * @returns
 */
export async function fetchReplyList(params: RequestReplyList) {
  const res = await request.get<ResponseReplyList>(API_URL.PPT_REPLY_LIST, {
    params,
  })
  return res.data?.data
}

/**
 * 评论
 * @param params
 * @returns
 */
export async function fetchComment(params: RequestComment) {
  const res = await request.post<ResponseComment>(API_URL.PPT_COMMENT, params)
  return res.data?.data
}
