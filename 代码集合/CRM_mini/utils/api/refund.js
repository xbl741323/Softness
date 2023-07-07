import {request} from "../common/request.js"
module.exports = {
  // 退款审批列表
  pageMyTmRefundVo(param) {
    return request('post', '/wtorder/tmRefund/pageMyTmRefundVo', param)
  },
  //退款审批基本信息详情
  getDetailInfoByRefundId: (data) => {
    return request('get', `/wtorder/tmRefund/getMyDetailInfoByRefundId/${data}`)
  },
  //退款审批任务详情
  getRefundTaskByRefundId: (data) => {
    return request('get', `/wtorder/tmRefund/getRefundTaskByRefundId/${data}`)
  },
  //退款审批退款信息详情
  
  getRefundFeeByRefundId: (data) => {
    return request('get', `/wtorder/tmRefund/getRefundFeeByRefundId/${data}`)
  },
  //操作记录
  auditLog: (data) => {
    return request('post', '/admin/auditLog/list', data)
  },
}
