import request from '@/router/axios'
//退款审批列表
// export function getList(param) {
//     return request({
//     url: '/wtcrm/task/refund/page',
//     method: 'post',
//     params: param
//     })
// }
export function getList(param) {
  return request({
    url: '/wtorder/refund/pageRefund',
    method: 'post',
    data:param
  })
}
// 流程管理退款列表
export function pageTmRefundVo(param,mine) {
  return request({
    url: mine != null ? '/wtorder/tmRefund/pageMyTmRefundVo' : '/wtorder/tmRefund/pageTmRefundVo',
    method: 'post',
    data:param
  })
}
// 我的-流程管理退款列表
export function pageMyTmRefundVo(param) {
  return request({
    url: '/wtorder/tmRefund/pageMyTmRefundVo',
    method: 'post',
    data:param
  })
}
// 流程管理流程状态统计数据
export function statisticsRefund() {
  return request({
  url: '/wtorder/tmRefund/statisticsRefund',
  method: 'get',
  })
}
// 我的-退款审批-流程状态统计数据
export function statisticsMyRefund() {
  return request({
  url: '/wtorder/tmRefund/statisticsMyRefund',
  method: 'get',
  })
}
// 退款id获取退款详情信息
export function getDetailInfoByRefundId(obj,mine) {
  return request({
    url: mine ? '/wtorder/tmRefund/getMyDetailInfoByRefundId/'+obj : '/wtorder/tmRefund/getDetailInfoByRefundId/'+obj,
    method: 'get',
  })
}
// 根据退款id获取退款费用信息
export function getRefundFeeByRefundId(obj) {
  return request({
    url: '/wtorder/tmRefund/getRefundFeeByRefundId/'+obj,
    method: 'get',
  })
}
// 根据退款id获取退款任务信息
export function getRefundTaskByRefundId(obj) {
  return request({
    url: '/wtorder/tmRefund/getRefundTaskByRefundId/'+obj,
    method: 'get',
  })
}
// 根据对公转账流水号转账凭证
export function getTrTaskOrderByTaskNo(obj) {
  return request({
    url: '/wtcrm/rebuild/getTrTaskOrderByTaskNo/'+obj,
    method: 'get',
  })
}

//退款业务员操作根据订单id获取任务信息
export function listTmOrderTaskByOrderId(obj) {
  return request({
    url: '/wtorder/tmOrderTask/listTmOrderTaskByOrderId/'+obj,
    method: 'get',
  })
}

// 退款审批操作业务员审核
export function saleManApproval(param,mine) {
  return request({
    url: mine ? '/wtorder/tmRefundApproval/my/saleManApproval':'/wtorder/tmRefundApproval/saleManApproval',
    method: 'post',
    data:param
  })
}

// 退款审批操作财务审核
export function financeApproval(param,mine) {
  return request({
    url: mine ? '/wtorder/tmRefundApproval/my/financeApproval':'/wtorder/tmRefundApproval/financeApproval',
    method: 'post',
    data:param
  })
}

// 财务第二次审核拒绝
export function financeApprovalRefuse(param) {
  return request({
    url: '/wtorder/tmRefundApproval/financeApprovalRefuse',
    method: 'post',
    data: param
  })
}

// 获取退款财务处理人的手机号码
export function getRefundFinanceMobile(obj) {
  return request({
    url: '/wtorder/tmRefundApproval/getRefundFinanceMobile/'+obj,
    method: 'get',
  })
}

// 对公转账退款回调
export function offlineNotify(param){
  return request({
    url: '/wtorder/tmRefundRequest/offlineNotify',
    method: 'post',
    data: param
  })
}
//混合支付退款回调
export function dealRefund(param,para){
  return request({
    url: '/wtorder/tmRefundApproval/dealRefund/'+para.refundId+'/'+para.code,
    method: 'post',
    data: param
  })
}
// 获取部门负责人列表数据
export function listRefundDeptHead() {
  return request({
    url: '/wtcrm/permission/listRefundDeptHead',
    method: 'get',
  })
}

// 列出工程师退款任务 管理员
export function listEngineerTasks(obj,mine) {
  return request({
    url: mine ? '/wtorder/tmRefund/listMyTasks/'+obj : '/wtorder/tmRefund/listEngineerTasks/'+obj,
    method: 'get',
  })
}

// 列出工程师退款任务 我的
export function listMyTasks(obj) {
  return request({
    url: '/wtorder/tmRefund/listMyTasks/'+obj,
    method: 'get',
  })
}

// 退款审批操作工程师审核
export function engineerApproval(param, mine) {
  return request({
    url: mine ? '/wtorder/tmRefundApproval/my/engineerApproval':'/wtorder/tmRefundApproval/engineerApproval',
    method: 'post',
    data:param
  })
}

// 退款审批操作部门领导审核
export function deptHeadApproval(param, mine) {
  return request({
    url: mine ? '/wtorder/tmRefundApproval/my/deptHeadApproval':'/wtorder/tmRefundApproval/deptHeadApproval',
    method: 'post',
    data:param
  })
}

// 退款审批操作财务第二部审核发送验证码
export function sendRefundSmsCode(obj) {
  return request({
    url: '/wtorder/tmRefundApproval/sendRefundSmsCode/'+obj,
    method: 'post', 
  })
}

//我的退款审批列表
export function pageRefundOfMy(param) {
  return request({
    url: '/wtorder/refund/pageRefundOfMy',
    method: 'post',
    data:param
  })
}

//工程师进行退款审核
export function refundAuditByEngineer(obj) {
  return request({
    url: '/wtorder/refund/refundAuditByEngineer',
    method: 'post',
    data: obj
  })
}

//财务进行退款审核
export function refundAuditByFinance(obj) {
  return request({
    url: '/wtorder/refund/refundAuditByFinance',
    method: 'post',
    data: obj
  })
}

//业务进行退款审核
export function refundAuditBySaleMan(obj) {
  return request({
    url: '/wtorder/refund/refundAuditBySaleMan',
    method: 'post',
    data: obj
  })
}

//我的流程财务第二步提交退款
export function startRefundOfMy(obj) {
  return request({
    url: '/wtorder/refund/startRefundOfMy',
    method: 'post',
    data: obj
  })
}

//退款状态列表
export function getRefundStateList(param) {
    return request({
    // url: '/wtcrm/task/statistical',
    url: '/wtorder/refund/countState',
    method: 'get',
    params:param
    })
}


// 查看退款审批详情
export function getrefundDetail(data) {
    return request({
    url: '/wtcrm/refund/getRefundDetail?no='+data,
    method: 'get',
    })
}

// 查看退款金额
export function getRefundBill(data) {
  return request({
  url: '/wtorder/refundBill/getRefundBill?refundId='+data,
  method: 'get',
  })
}

export function getOnlineRefundDetail(obj) {
  return request({
    url: '/wtorder/refund/getRefund',
    method: 'get',
    params: obj
  })
}
export function getOnlineRefundRecords(obj) {
  return request({
    url: '/wtorder/refund/listRefundLog',
    method: 'get',
    params: obj
  })
}

export function getRefundOrderInfo(obj) {
  return request({
    url: '/wtorder/refund/getRefundOrderAndFee',
    method: 'get',
    params: obj
  })
}

//获取退款状态
export function getRefundStatus(obj) {
  return request({
    url: '/wtorder/refund/getRefundStatus/'+obj,
    method: 'get',
  })
}

//退款审批操作
export function refundAudit(obj) {
  return request({
    url: '/wtorder/refund/refundAuditByOther',
    method: 'post',
    data: obj
  })
}

//财务提交退款
export function startRefund(obj) {
  return request({
    url: '/wtorder/refund/startRefund',
    method: 'post',
    data: obj
  })
}

//获取财务手机号码
export function getFinancePhone(data) {
  return request({
  url: '/wtorder/refund/getFinancePhone',
  method: 'get',
  params:data,
  })
}

//获取财务手机号码
export function sendFinanceSms(data) {
  return request({
  url: '/wtorder/refund/sendFinanceSms',
  method: 'get',
  params:data,
  })
}

// 我的退款审批详情
export function getpersonrefundDetail(data) {
    return request({
    url: '/wtcrm/personal/task/refund/detail?no='+data,
    method: 'get',
    })
}
// 撤销退款申请
export function refundRevoke(obj) {
    return request({
      url: '/wtcrm/refund/refundRevoke?taskNo='+obj.taskNo,
      method: 'put',
      data: obj
    })
  }


  //  审核
export function audit(obj) {
    return request({
      url: '/wtcrm/refund/auditSuccess',
      method: 'post',
      data: obj
    })
}

  //  我的审核
  export function myaudit(obj) {
    return request({
      url: '/wtcrm/personal/task/refund/auditSuccess',
      method: 'post',
      data: obj
    })
}


  //  审核不通过
  export function auditFail(obj) {
    return request({
      url: '/wtcrm/refund/auditFailure',
      method: 'post',
      data: obj
    })
}

//  我的审核不通过
export function myauditFail(obj) {
    return request({
      url: '/wtcrm/personal/task/refund/auditFailure',
      method: 'post',
      data: obj
    })
}
  //  发送验证码
  export function sendCode(obj) {
    return request({
      // url: '/wtcrm/refund/sendCode?taskCurrentEmpId='+obj.taskCurrentEmpId+'&taskNo='+obj.taskNo,
      url: '/wtcrm/refund/sendCode',
      method: 'get',
      params: obj
    })
}

//  发送验证码权限
export function permissSendCode(obj) {
    return request({
      url: '/wtcrm/refund/personal/sendCode?taskCurrentEmpId='+obj.taskCurrentEmpId+'&taskNo='+obj.taskNo,
      method: 'get',
      data: obj
    })
}

 //  获取手机号
 export function getMobile(obj) {
    return request({
      url: '/wtcrm/refund/getAuditorPhone?taskCurrentEmpId='+obj.taskCurrentEmpId,
      method: 'get',
      data: obj
    })
}

// 退款单关联的所有任务列表
export function getTasks(obj) {
  return request({
    url: '/wtorder/refund/getTasks',
    method: 'get',
    params: obj
  })
}

 // 根据退款ID和处理人查询任务列表
export function listRefundTask(obj) {
  return request({
    url: '/wtorder/refund/listRefundTask',
    method: 'get',
    params: obj
  })
}

 // 订单列表后台发起退款
 export function insertRefund(obj) {
  return request({
    url: '/wtorder/tmRefund/insertRefund',
    method: 'post',
    data: obj
  })
}



