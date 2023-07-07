import request from 'axios'

//会员订单管理列表数据
export function getVipOrder(params){
  return request({
    url: '/wttalk/vipOrder/pageVipOrder',
    method: 'post',
    data: params
  })
}
//会员订单管理详情数据
export function getVipOrderDetail(id,bool){
  if (bool) {
    return request({
      url: '/wttalk/vipOrder/my/'+id,
      method: 'get',
    })
  }else{
    return request({
      url: '/wttalk/vipOrder/'+id,
      method: 'get',
    })
  }
}

// 获取员工信息
export function getEmpInfo(userId) {
  return request({
    url: '/wtcrm/user/getInfoByNumber/' + userId,
    method: 'get'
  })
}

// 获取VIP订单待支付数量
export function getWaitPayCount() {
  return request({
    url: '/wttalk/vipOrder/getWaitPayCount',
    method: 'get'
  })
}

// 获取用户详情VIP订单待支付数量
export function getUnpaidCount(accountId) {
  return request({
    url: '/wttalk/vipOrder/getWaitPayCountWithAccountId/'+accountId,
    method: 'get'
  })
}


// 会员订单数据导出
export function dataExport(obj){
  return request({
    url: '/wttalk/vipOrder/exportExcel',
    method: 'post',
    data: obj,
    responseType: 'blob'
  })
}

// 会员订单数据导出进度条
export function dataExportProgress(){
  return request({
    url: '/wttalk/vipOrder/exportExcelProgress',
    method: 'get',
  })
}

