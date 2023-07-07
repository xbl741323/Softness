import request from '@/router/axios'
// 添加工作流（重构完成） type:0-添加 1-编辑
export function operateWorkFlow(params, type) {
  let url = type == 0 ? 'saveWorkFlow' : 'updateWorkFlow'
  return request({
    url: `/wtcrm/tmWorkflow/${url}`,
    method: type == 1 ? 'put' : 'post',
    data: params
  })
}

// 工作流列表分页查询（重构完成）
export function getWorkList(params) {
  return request({
    url: '/wtcrm/tmWorkflow/page',
    method: 'post',
    data: params
  })
}

// 删除工作流（重构完成）
export function delWorkFlow(id) {
  return request({
    url: '/wtcrm/tmWorkflow/removeWorkFlowById/' + id,
    method: 'delete'
  })
}

// 关联产品列表（重构完成）
export function getRelatedProducts(params) {
  return request({
    url: '/wtprod/spu/pageSimpleSpu',
    method: 'post',
    data: params
  })
}

// 添加关联产品（重构完成）
export function addRealtedProduct(params) {
  return request({
    url: '/wtprod/spu/modWorkflowBatch',
    method: 'put',
    data: params
  })
}

// 工作流下拉框（重构完成）
export function getAllFlow() {
  return request({
    url: '/wtcrm/tmWorkflow/listAllWorkFlows',
    method: 'get',
  })
}

export function getWorkDetail(params) {
  return request({
    url: '/wtcrm/workpolicy/selectWorkId',
    method: 'post',
    data: params
  })
}

//获取工作流信息
export function getWorkFlowInfo(params) {
  return request({
    url: '/wtcrm/tmWorkflow/getWorkFlowInfoById/' + params.workFlowId,
    method: 'get',
  })
}





