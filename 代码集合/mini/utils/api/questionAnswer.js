import {
  request
} from "../common/request.js"

module.exports = {
  // 获取问答列表数据
  getQuestionList: (data) => {
    return request('post', '/tmQuestionAnswer/innerPageQuestion', data)
  },
  // 获取我的问答列表数据
  getMyQuestionList: (data) => {
    return request('post', '/tmQuestionAnswer/pageMyQuestion', data)
  },
  // 保存问题
  saveQuestion: (data) => {
    return request('post', '/tmQuestionAnswer/saveQuestion', data)
  },
  // 问题回答数量统计
  getStatisticMyQuestion: (data) => {
    return request('post', '/tmQuestionAnswer/statisticMyQuestion', data)
  },
  // 分页获取问题回答
  getAllAnswer: (data) => {
    return request('post', '/tmQuestionAnswer/innerPageTmAnswerVo', data)
  },
  // 点赞 点low
  thumbsUpAnswer: (data) => {
    return request('post', '/tmQuestionAnswer/click', data)
  },
  // 采纳/取消采纳 问题回答
  acceptAnswer: (data) => {
    return request('post', '/tmQuestionAnswer/acceptAnswer', data)
  },
  // 采纳/取消采纳 问题回答
  removeQuestion: (data) => {
    return request('delete', '/tmQuestionAnswer/removeQuestion', data)
  },
  // 根据questionId 获取问题详情
  getQuestionDetail: (data) => {
    return request('get', `/tmQuestionAnswer/innerGetById/${data}`, )
  },
}