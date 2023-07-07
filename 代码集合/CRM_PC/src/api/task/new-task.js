import request from 'axios'

// 提交进度 type 0-单个提交 1-批量提交
export function submitProgress(params, type, listType, apiInfo) {
  let url = '';
  if (listType == 'personal') {
    url = type == 0 ? '/tmMyOrderTask/commitProgressOfMy' : '/tmMyOrderTask/batchCommitProgressOfMy'
  } else {
    url = type == 0 ? apiInfo.commitProgressApi : apiInfo.batchCommitProgressApi
  }
  return request({
    url: `/wtorder${url}`,
    method: 'post',
    data: params
  })
}

// 获取任务进度
export function getProgressList(params) {
  return request({
    url: `/wtcrm/ttFlowStep/getByFlowIdAndVersion/${params.flowId}/${params.flowId}`,
    method: 'get',
    data: params
  })
}

// 任务批量分配工程师
export function batchAllot(params, listType, apiInfo) {
  let url = '';
  if (listType == 'personal') {
    url = '/tmMyOrderTask/batchAllocateEngineerOfMy';
  } else {
    url = apiInfo.batchAllocateEngineerApi
  }
  return request({
    url: '/wtorder' + url,
    method: 'put',
    data: params
  })
}

// 获取任务进度
export function getTaskFlow(params) {
  return request({
    url: `/wtcrm/ttFlowStep/getByFlowIdAndVersion/${params.flowId}/${params.version}`,
    method: 'get',
  })
}

// 获取任务进行中状态
export function getPrrocessStatus() {
  return request({
    url: `/wtcrm/ttFlowStep/listAllMiddleStepName`,
    method: 'get',
  })
}

// 修改专利申请号
export function editPatentNo(params) {
  return request({
    url: `/wtorder/tmIntellectualTask/editPatentNo`,
    method: 'put',
    data: params
  })
}

// 0-下载修改专利申请号模板 1-下载修改专利申请结果模板
export function downloadPatentDemo(type) {
  let url = type == 0?'downloadImportPatentDemo':'downloadImportResultDemo'
  return request({
    url: `/wtorder/tmIntellectualTask/${url}`,
    method: 'get',
    responseType: "blob"
  })
}

// 0-批量导入修改专利申请号 1-批量导入修改专利申请结果
export function batchImportPatentDemo(params,type) {
  let url = type == 0?'batchImportPatent':'batchImportResult'
  return request({
    url: `/wtorder/tmIntellectualTask/${url}`,
    method: 'post',
    data: params
  })
}

// 更新知产证书
export function saveIntellectualProperty(params, isPerson) {
  let url = isPerson? 'saveMyIntellectualProperty':'saveIntellectualProperty'
  return request({
    url: `/wtcrm/tmCustomerResource/${url}`,
    method: 'post',
    data: params
  })
}

// 删除知产证书
export function deleteIntellectualProperty(id, isPerson) {
  let url = isPerson? 'deleteMyIntellectualProperty':'deleteIntellectualProperty'
  return request({
    url: `/wtcrm/tmCustomerResource/${url}/${id}`,
    method: 'delete'
  })
}






