import request from '~/utils/request'

// 资讯广场-分页获取问题
export function getQuestionList(data){
  return request({
      url:`/tmQuestionAnswer/innerPageQuestion`,
      method:'post',
      data: data
  })
}
// 资讯广场-卧涛问答-取消采纳问题回答
export function acceptAnswer(data){
  return request({
      url:'/tmQuestionAnswer/acceptAnswer',
      method:'post',
      data: data
  })
}
// 资讯广场-卧涛问答-点赞，点low
export function likeAnswer(data){
  return request({
      url:'/tmQuestionAnswer/click',
      method:'post',
      data: data
  })
}

// 资讯广场-卧涛问答-分页获取问题回答
export function getQAList(data){
  return request({
      url:'/tmQuestionAnswer/innerPageTmAnswerVo',
      method:'post',
      data: data
  })
}

// 资讯广场-卧涛问答-删除问题
export function deleteQuestion(data){
  return request({
      url:'/tmQuestionAnswer/removeQuestion',
      method:'delete',
      data: data
  })
}

// 根据问题id获取问题详情
export function getQuestionDetail(questionId){
  return request({
      url:`/tmQuestionAnswer/innerGetById/${questionId}`,
      method:'get',
  })
}