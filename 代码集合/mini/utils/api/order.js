import {
  request
} from "../common/request.js"

module.exports = {
  // 获取订单列表数据
  getOrderList: (data) => {
    return request('get', '/order/getOnlineOrders', data)
  },
  // 获取订单列表统计数据
  getOrderStatistics: (data) => {
    return request('get', '/order/getOnlineOrdersStatistics', data)
  },
  // 获取订单详情数据
  getOrderDetail: (data) => {
    return request('get', '/order/getOnlineOrderDetail', data)
  },
  // 取消删除订单（取消-7 删除-8）
  cancelOrder: (data) => {
    return request('post', '/order/updateOnlineOrderStatus', data)
  },
  // 对公转账支付接口
  transferPay: (data) => {
    return request('post', '/order/voucher', data)
  },
  // 提交订单
  submitOrder: (data) => {
    return request('post', '/order/submit', data)
  },
  // 待支付状态去支付
  submitToPay: (data) => {
    return request('post', '/order/payOrder', data)
  },
  // 获取订单进度条数据
  getOrderProgress: (data) => {
    return request('get', '/order/getOrderTime', data)
  },
  // 获取任务进度条数据
  getTaskProgress: (data) => {
    return request('get', '/order/getTaskProcessList', data)
  },
  // 用于获取未认证状态的项目订单数据  1-有 0-没有
  getUncertifiedOrder: (data) => {
    return request('get', '/accounts/selectAuthByAccountId', data)
  },
  // 获取二维码
  getWxFocus: (data) => {
    return request('get', '/msg/wx/qrcode/subscribe?accountId=' + data.accountId, data)
  },
  // 获取课堂订单列表数据
  pageCourseOrder: (data) => {
    return request('post', '/courseOrder/pageCourseOrder', data)
  },
  // 取消订单列表数据
  cancleCourseOrder: (data) => {
    return request('put', `/courseOrder/${data.id}`)
  },
   // 取消订单列表数据
   deleteCourseOrder: (data) => {
    return request('delete', `/courseOrder/${data.id}`)
  },
}