// 排查完成
import request from 'axios'

export function getReceiveList(obj, operate) {
  return request(
    Object.assign(
      {
        url: operate == 'export' ? '/wtcrm/receive/export' : '/wtcrm/receive/page',
        method: 'get',
        params: obj
      },
      operate == 'export' ? { responseType: 'blob' } : {}
    )
  )
}

export function orderReceiveList(obj) {
  return request({
    url: '/wtcrm/receive/orderReceivePage',
    method: 'get',
    params: obj
  })
}

export function getFeeStatistical() {
  return request({
    url: '/wtcrm/receive/statusStatistical',
    method: 'post',
  })
}

export function getOrgNameLikeList(obj) {
  return request({
    url: '/wtcrm/wtclueaccount/orgNameLikeList',
    method: 'get',
    params: obj
  })
}

export function getToReceiveList(param) {//汇款去向
  return request({
    url: '/wtcrm/constantcatagory/list?no=' + param,
    method: 'get'
  })
}

export function getNormalClue(obj) {
  return request({
    url: '/wtcrm/wtclueaccount/myNormalList',
    method: 'get',
    params: obj
  })
}

export function getApprovedClue(obj) {
  return request({
    url: '/wtcrm/wtcontract/myListByClueId',
    method: 'get',
    params: obj
  })
}

export function commit(obj, commitType) {//录入-post 编辑-put 
  return request({
    url: '/wtcrm/receive',
    method: commitType,
    data: commitType == 'post' ? obj.list : obj.list[0]
  })
}

export function claimFee(obj) {//认领回款
  return request({
    url: '/wtcrm/receive/claim',
    method: 'post',
    data: obj.list
  })
}

export function uploadBatchFile(obj) {//批量录入回款
  return request({
    url: '/wtcrm/receive/batchImport',
    method: 'put',
    data: obj
  })
}

export function getProjectEngineer() {//可选的项目工程师
  return request({
    url: '/wtcrm/cycli/getProjectEngineer',
    method: 'get',
  })
}

export function getPropertyEngineer() {//可选的知产工程师
  return request({
    url: '/wtcrm/cycli/getPropertyEngineer',
    method: 'get',
  })
}

export function getFinancialEngineer() {//可选的财务辅导
  return request({
    url: '/wtcrm/cycli/getfinancial',
    method: 'get',
  })
}

export function deleteReceive(obj) {//线下回款删除
  return request({
    url: '/wtorder/receive/deleteById',
    method: 'delete',
    params: obj
  })
}

//线下回款导出进度条
export function getOfflineExportProgress() {
  return request({
    url: '/wtorder/receive/exportExcelProgress',
    method: 'get',
  })
}

//回款导出进度条
export function getExportProgress(data) {
  return request({
    url: '/wtorder/receive/exportReceiveExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

//支付记录导出进度条 1-产品订单 2课堂会员订单 3-课程订单
export function getPayExportProgress(data, type) {
  return request({
    url: type == 1 ? '/wtorder/orderPayment/exportExcel' : type == 2 ? '/wttalk/vipOrderPayment/exportExcel':'/wttalk/courseOrderPayment/exportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

//获取回款明细认领记录
export function getClaimRecord(params) {
  return request({
    url: '/wtorder/trReceivePayment/listClaimCancelRecords',
    method: 'get',
    params: params
  })
}