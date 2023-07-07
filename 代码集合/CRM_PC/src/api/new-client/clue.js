import request from '@/router/axios'

// 创建/编辑线索-重构 status：true-编辑 false-创建 clueType：0-个人线索 1-单位线索 combineStatus：true-合并 false-不合并
export function operateClue(params, status, clueType) {
  let unitUrl = status == false ? 'addClueCompany' : 'modClueCompany'
  let soloUrl = status == false ? 'addCluePerson' : 'modCluePerson'
  let object = {
    method: 'post',
    data: params
  }
  object.url = clueType == 1 ? `/wtcrm/clueCompany/${unitUrl}` : `/wtcrm/cluePerson/${soloUrl}`
  return request(object)
}

// 用户转化线索+合并-重构
export function translateUser(params, clueType, combineStatus) {
  let object = {
    method: 'post',
    data: params
  }
  if (combineStatus) {
    object.url = clueType == 1 ? `/wtcrm/clueCompany/mergeClueCompany` : `/wtcrm/cluePerson/mergeCluePerson`
  } else {
    object.url = clueType == 1 ? `/wtcrm/clueCompany/convertClueCompany` : `/wtcrm/cluePerson/convertCluePerson`
  }
  return request(object)
}

// 获取线索列表-重构 clueType：1-单位列表 0-个人列表
export function getClueList(params, clueType) {
  let url = clueType == 1 ? 'clueCompany/pageClueCompany' : 'cluePerson/pageCluePerson'
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
    data: params
  })
}

// 获取线索详情 clueType：1-单位（线索/客户） 0-个人（线索/客户
export function getClueDetail(params, clueType) {
  let url = clueType == 1 ? 'clueCompany/getClueCompany' : 'cluePerson/getCluePerson'
  return request({
    url: `/wtcrm/${url}`,
    method: 'get',
    params: params
  })
}

// 分配归属 0-分配线索归属 1-分配业务员 clueType：1-单位（线索/客户） 0-个人（线索/客户
export function allotBelong(params, type, clueType) {
  let pUrl = clueType == 1 ? 'clueCompany' : 'cluePerson'
  let url = type == 0 ? 'allocClueAttributionEmpBatch' : 'allocClueSalesmanEmpBatch'
  return request({
    url: `/wtcrm/${pUrl}/${url}`,
    method: 'post',
    data: params
  })
}

// 获取跟进产品列表
export function getFollowProduct(params) {
  return request({
    url: '/wtprod/spu/pageSimpleSpu',
    method: 'post',
    data: params
  })
}

// 获取跟进产品类型下拉框
export function getProType(params) {
  return request({
    url: '/wtprod/category/tree',
    method: 'post',
    data: params
  })
}

// 跟进操作
export function followOperate(params) {
  return request({
    url: '/wtcrm/clueFollow/addClueFollow',
    method: 'post',
    data: params
  })
}

// 跟进批量上传文件
export function upLoadFollowFile(params) {
  return request({
    url: '/wtcrm/clueFollow/upLoadClueFollowFile',
    method: 'post',
    data: params
  })
}

// 获取线索列表-重构 clueType：1-单位列表 0-个人列表
export function getGlobalClueList(params, clueType) {
  let url = clueType == 1 ? 'clueCompany/pageClueCompanyGlobal' : 'cluePerson/pageCluePersonGlobal'
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
    data: params
  })
}









