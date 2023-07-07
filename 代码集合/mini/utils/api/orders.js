import { request } from "../common/request.js"
module.exports = {
  //提交订单
  saveOrder: (data) => {
    return request('post', '/tmOrder/saveOrder',data)
  },
  //确认订单
  confirmOrder: (data) => {
    return request('post', '/tmOrder/confirmOrder',data)
  },
  //获取订单流程
  getOrderProgressInfo: (data) => {
    return request('get', `/tmOrder/getOrderProgressInfo/${data}`)
  },
  //获取合同列表
  listContractByOrderId: (data) => {
    return request('get', '/ess/listContractByOrderId',data)
  },
  // 对公转账支付
  payForOffline: (data) => {
    return request('post', '/tmOrder/payForOffline',data)
  },
  // 微信、支付宝支付
  payForApplet: (data) => {
    return request('post', '/tmOrder/payForApplet',data)
  },
  // 微信、支付宝支付
  innerPageTmOrder: (data) => {
    return request('post', '/tmOrder/innerPageTmOrder',data)
  },
   // 取消订单
   cancelOrder: (data) => {
    return request('put', `/tmOrder/cancelOrder/${data.id}`)
  },
  // 删除订单
  deleteOrder: (data) => {
    return request('delete', `/tmOrder/delete/${data.id}`)
  },
  // 获取对公转账失败原因
  getTaskByTaskNo: (data) => {
    return request('get', `/tmOrder/getTaskByTaskNo/${data}`)
  },
  // 获取订单详情数据
  getOrderInfo: (data) => {
    return request('get', `/tmOrder/getOrderInfo/${data}`)
  },
  // 订单去签约-电子合同
  signSelf: (data) => {
    return request('post', '/ess/signSelf',data)
  },
   // 订单去签约-更改合同类型
   changeContractType: (data) => {
    return request('put', '/tmOrder/changeContractType',data)
  },
  //获取订单统计数据
  statisticsOrderNum: () => {
    return request('get', '/tmOrder/statisticsOrderNum')
  },
  //获取产品订单统计数据
  statisticsProductOrderNum: () => {
    return request('get', '/tmOrder/statisticsProductOrderNum')
  },
  //获取课堂订单统计数据
  statisticsCourseOrderNum: () => {
    return request('get', '/tmOrder/statisticsCourseOrderNum')
  },
  //获取订单统计数据2
  statisticsOrderNumForFront: () => {
    return request('post', '/tmOrder/statisticsOrderNumForFront')
  },
  // 发起订单获取主体信息
  getConfirmOrderUserInfo: (data) => {
    return request('get', '/appletTmUser/getConfirmOrderUserInfo',data)
  },
  // 发起订单获取订单信息
  getIneffectiveOrderInfo: (data) => {
    return request('get', `/tmOrder/getIneffectiveOrderInfo/${data}`,)
  },
    // 文档订单
  //获取待付款订单数量
  getMyWaitPayCountForFront: () => {
    return request('get', '/tmFileOrder/getMyWaitPayCountForFront')
  },
  //根据id，获取订单详情信息
  innerGetDetailInfoById: (data) => {
    return request('get', `/tmFileOrder/innerGetDetailInfoById/${data}`)
  },
  // 分页订单列表
  innerPageTmFileOrder: (data) => {
    return request('post', '/tmFileOrder/innerPageTmFileOrder', data)
  },
  //取消订单
  documentCancelOrder: (data) => {
    return request('put', `/tmFileOrder/cancelOrder/${data}`)
  },
  //删除订单
  documentDeleteOrder: (data) => {
    return request('put', `/tmFileOrder/deleteOrder/${data}`)
  },
}