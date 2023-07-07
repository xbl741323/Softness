import { request } from "../common/request.js"

module.exports = {
  // 提交退款接口
  saveRefund: (data) => {
    return request('post', '/tmRefund/saveRefund', data)
  },
  // 获取新退款列表接口
  pageTmRefundSpuVo: (data) => {
    return request('post', '/tmRefund/pageTmRefundSpuVo', data)
  },
  // 获取新退款列表接口
  getTmRefundSpuVoByRefundId: (data) => {
    return request('get', `/tmRefund/getTmRefundSpuVoByRefundId/${data}`)
  },
  // 撤销退款新接口
  revokeRefund: (data) => {
    return request('put', `/tmRefund/revokeRefund/${data}`)
  },
  // 获取退款原因接口
  getRefundReason: (data) => {
    return request('get', '/refund/getRefundReason', data)
  },
  // 获取退款详情数据
  getRefundDetail: (data) => {
    return request('get', '/refund/getRefundDetail', data)
  },
  // 撤销退款接口
  cancelRefund: (data) => {
    return request('get', '/refund/cancelRefund', data)
  },
  // 获取退款列表接口
  getRefundList: (data) => {
    return request('post', '/refund/getRefundList', data, true)
  },
  // 用于获取退款状态判断是否显示再次提交退款按钮
  getShowSubmitBtn: (data) => {
    return request('get', '/refund/getTaskNo', data)
  }
}