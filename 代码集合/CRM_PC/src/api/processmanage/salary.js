import request from '@/router/axios'

// 流程管理-薪酬审批列表
export function getSalaryList(params) {
  return request({
    url: '/admin/salaryFlow/pageList',
    method: 'get',
    params: params
  })
}

// 流程管理-薪酬审批列表统计
export function getSalaryCount(params) {
  return request({
    url: '/admin/salaryFlow/processStateCount/' + params.assessedDate,
    method: 'get'
  })
}

// 我的流程-薪酬审批列表
export function getMySalaryList(params) {
  return request({
    url: '/admin/salaryFlow/pageListOfMy',
    method: 'get',
    params: params
  })
}

// 我的流程-薪酬审批列表统计
export function getMySalaryCount(params) {
  return request({
    url: '/admin/salaryFlow/handlerStateCount/' + params.assessedDate,
    method: 'get'
  })
}

/* 操作记录-结果值记录 */
export function getResultLog(flowId) {
  return request({
    url: '/admin/salaryFlow/listIndexChangeRecord/' + flowId,
    method: 'get',
  })
}

/* 操作记录-审核记录 */
export function getAuditLog(obj) {
  return request({
    url: '/admin/auditLog/list',
    method: 'post',
    data: obj
  })
}

/* 薪酬考核-添加备注 */
export function remark(obj) {
  return request({
    url: '/admin/salaryFlow/addRemark',
    method: 'post',
    data: obj
  })
}

/* 薪酬考核-查看备注 */
export function getReamrk(indexValId) {
  return request({
    url: '/admin/salaryFlow/remark/' + indexValId,
    method: 'get'
  })
}

/* 薪酬考核-审批通过 */
export function approved(obj) {
  return request({
    url: '/admin/salaryFlow/approved',
    method: 'post',
    data: obj
  })
}

/* 薪酬考核-审批不通过 */
export function approvalReject(obj, source) {
  return request({
    url: source != 'list' ? '/admin/salaryFlow/approvalRejectOfMy' : '/admin/salaryFlow/approvalReject',
    method: 'post',
    data: obj
  })
}

/* 获取当前流程录入阶段的方案处理人 */
export function getInputHandlers(obj) {
  return request({
    url: '/admin/salaryFlow/getInputHandlers',
    method: 'get',
    params: obj
  })
}

/* 薪酬下载模板 */
export function downloadTemplate() {
  return request({
    responseType: "blob",
    url: '/admin/indexImport/downloadTemplate',
    method: 'get',
  })
}
/* 导出财务数据 */
// export function exportFinancialData(params) {
//   return request({
//     responseType: "blob",
//     url: '/admin/indexImport/exportFinancialData',
//     method: 'get',
//     params
//   })
// }
/* 批量录入指标项 */
export function batchImportIndex(data) {
  return request({
    url: '/admin/indexImport/batchImportIndex',
    method: 'post',
    data
  })
}

/* 获取导入结果 */
export function indexImportGetResult(params) {
  return request({
    url: '/admin/indexImport/getResult',
    method: 'get',
    params
  })
}
