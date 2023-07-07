import request from "axios";

//文档订单列表
export function pageTmFileOrder(param, mine) {
    return request({
      url: mine ? '/wtcrm/tmFileOrder/pageMy':'/wtcrm/tmFileOrder/page',
      method: 'post',
      data: param
    })
}
//文档订单详情
export function getDetailInfoById(orderId,mine) { 
    return request({
      url: mine ? '/wtcrm/tmFileOrder/getMyDetailInfoById/' + orderId : '/wtcrm/tmFileOrder/getDetailInfoById/'+orderId,
      method: 'get'
    })
}
// 文档订单操作记录
export function getTmFileOrderLogByOrderId(orderId) { 
    return request({
      url:  '/wtcrm/tmFileOrder/getTmFileOrderLogByOrderId/' + orderId,
      method: 'get'
    })
}
//获取待付款订单数
export function getWaitPayCount(mine) { 
  return request({
    url: mine ? '/wtcrm/tmFileOrder/getMyWaitPayCount' : '/wtcrm/tmFileOrder/getWaitPayCount',
    method: 'get'
  })
}