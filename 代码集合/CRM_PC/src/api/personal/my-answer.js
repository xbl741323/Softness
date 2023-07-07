import request from "@/router/axios";
/**
 * @param bool  true 我的我的问答 false 非我的我的问答
 *
 * ***/
// 获取问答列表
export function getQuestionList(data, bool) {
  if (bool) {
    return request({
      url: '/wtcrm/tmQuestion/pageJoinQuestion',
      method: 'post',
      data
    })
  } else {
    return request({
      url: '/wtcrm/tmQuestion/pageQuestion',
      method: 'post',
      data
    })
  }
}

// 删除问答item
export function removeAnswerById(answerId, bool) {
  if (bool) {
    return request({
      url: `/wtcrm/tmAnswer/removeMyAnswerById/${answerId}`,
      method: 'DELETE',
    })
  } else {
    return request({
      url: `/wtcrm/tmAnswer/removeAnswerById/${answerId}`,
      method: 'DELETE',
    })
  }
}
// 管理里面删除
export function deleteQuestion(data) {
  return request({
    url: `/wtcrm/tmQuestion/deleteQuestion`,
    method: 'DELETE',
    data
  })

}
// 保存问题回答
export function submitSaveAnswer(data, bool) {
  if (bool) {
    return request({
      headers: {
        'content-type': 'application/json'
      },
      url: `/wtcrm/tmAnswer/saveMyAnswer`,
      method: 'POST',
      data
    })
  } else {
    return request({
      headers: {
        'content-type': 'application/json'
      },
      url: `/wtcrm/tmAnswer/saveAnswer`,
      method: 'POST',
      data
    })
  }
}
// 获取详情根据id
export function getDetailById(questionId, bool) {
  if (bool) {
    return request({
      url: `/wtcrm/tmQuestion/getMyById/${questionId}`,
      method: 'GET',
    })
  } else {
    return request({
      url: `/wtcrm/tmQuestion/getById/${questionId}`,
      method: 'GET',
    })
  }
}
// 获取详情分页问题回答
export function getDetailPaging(data, bool) {
  if (bool) {
    return request({
      url: '/wtcrm/tmQuestion/pageTmAnswerVo',
      method: 'POST',
      data
    })
  } else {
    return request({
      url: '/wtcrm/tmQuestion/pageTmAnswerVo',
      method: 'POST',
      data
    })
  }
}
// 修改前台展示
export function updateAnswer(data, bool) {
  if (bool) {
    return request({
      url: '/wtcrm/tmAnswer/updateMyAnswer',
      method: 'PUT',
      data
    })
  } else {
    return request({
      url: '/wtcrm/tmAnswer/updateAnswer',
      method: 'PUT',
      data
    })
  }
}
// // es同步
// export function syncMapping(type) {
//   if (type == 1) {
//     return request({
//       url: '/wtcrm/tmQuestion/syncMapping',
//       method: 'post',
//     })
//   } else {
//     return request({
//       url: '/wtcrm/tmQuestion/syncData',
//       method: 'post',
//     })
//   }
// }
