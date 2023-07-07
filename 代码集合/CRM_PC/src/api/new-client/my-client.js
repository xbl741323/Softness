import request from '@/router/axios'

// 获取我的客户列表-重构 clueType：1-单位列表 0-个人列表
export function getClientList(params, clueType) {
  let url = clueType == 1 ? 'transactionCompany/pageTransactionCompanyOfMy' : 'transactionPerson/pageTransactionPersonOfMy'
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
    data: params
  })
}