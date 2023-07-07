import request from '@/router/axios'

// 创建/编辑线索-重构 status：true-编辑 false-创建 clueType：0-个人线索 1-单位线索 combineStatus：true-合并 false-不合并
export function operateClue(params, status, clueType) {
  let unitUrl = status == false ? 'addClueCompanyOfMy' : 'modClueCompanyOfMy'
  let soloUrl = status == false ? 'addCluePersonOfMy' : 'modCluePersonOfMy'
  let object = {
    method: 'post',
    data: params
  }
  object.url = clueType == 1 ? `/wtcrm/clueCompany/${unitUrl}` : `/wtcrm/cluePerson/${soloUrl}`
  return request(object)
}

//任务编辑财务信息
export function operateTaskClue(params, status, clueType) {
  return request({
    url: clueType == 1 ? '/wtcrm/clueCompany/modClueCompanyOfTask' : '',
    method: 'post',
    data: params
  })
}

// 用户转化线索+合并-重构
export function translateUser(params, clueType, combineStatus) {
  let object = {
    method: 'post',
    data: params
  }
  if (combineStatus) {
    object.url = clueType == 1 ? `/wtuims/tmuser/mergeClueCompany` : `/wtuims/tmuser/mergeCluePerson`
  } else {
    object.url = clueType == 1 ? `/wtuims/tmuser/convertClueCompany` : `/wtuims/tmuser/convertCluePerson`
  }
  return request(object)
}

// 获取线索列表-重构 clueType：1-单位列表 0-个人列表
export function getClueList(params, clueType) {
  let url = clueType == 1 ? 'clueCompany/pageClueCompanyOfMy' : 'cluePerson/pageCluePersonOfMy'
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
    data: params
  })
}

// 获取线索详情 clueType：1-单位（线索/客户） 0-个人（线索/客户
export function getClueDetail(params, clueType, isPerson) {
  if (isPerson) {
    let url = clueType == 1 ? 'clueCompany/getClueCompanyOfMy' : 'cluePerson/getCluePersonOfMy'
    return request({
      url: `/wtcrm/${url}`,
      method: 'get',
      params: params
    })
  } else {
    let url = clueType == 1 ? 'clueCompany/getClueCompany' : 'cluePerson/getCluePerson'
    return request({
      url: `/wtcrm/${url}`,
      method: 'get',
      params: params
    })
  }
}

// 分配归属 0-分配线索归属 1-分配业务员 clueType：1-单位（线索/客户） 0-个人（线索/客户
export function allotBelong(params, type, clueType, isPerson) {
  if (isPerson) {
    let pUrl = clueType == 1 ? 'clueCompany' : 'cluePerson'
    let url = type == 0 ? 'allocClueAttributionEmpBatchOfMy' : 'allocClueSalesmanEmpBatchOfMy'
    return request({
      url: `/wtcrm/${pUrl}/${url}`,
      method: 'post',
      data: params
    })
  } else {
    let pUrl = clueType == 1 ? 'clueCompany' : 'cluePerson'
    let url = type == 0 ? 'allocClueAttributionEmpBatch' : 'allocClueSalesmanEmpBatch'
    return request({
      url: `/wtcrm/${pUrl}/${url}`,
      method: 'post',
      data: params
    })
  }

}

// 获取跟进产品列表
export function getFollowProduct(params) {
  return request({
    url: '/wtprod/spu/pageSimpleSpuOfMy',
    method: 'post',
    data: params
  })
}

// 获取跟进产品类型下拉框
export function getProType(params) {
  return request({
    url: '/wtprod/category/treeOfMy',
    method: 'post',
    data: params
  })
}

// 跟进操作
export function followOperate(params, operateType) {
  let url = operateType == 0 ? 'addClueFollowOfMy' : 'modClueFollow'
  return request({
    url: `/wtcrm/clueFollow/${url}`,
    method: 'post',
    data: params
  })
}

// 跟进批量上传文件
export function upLoadFollowFile(params) {
  return request({
    url: '/wtcrm/clueFollow/upLoadClueFollowFileOfMy',
    method: 'post',
    data: params
  })
}

// 获取公海线索详情 clueType：1-单位 0-个人 seasType 0：部门公海 1：集团公海
export function getSeaDetail(params, clueType, seasType) {
  if (seasType == 1) {
    let url = clueType == 1 ? 'seasCompany/getGroupSeas' : 'seasPerson/getGroupSeas'
    return request({
      url: `/wtcrm/${url}`,
      method: 'get',
      params: params
    })
  } else {
    let url = clueType == 1 ? 'seasCompany/getSectorSeas' : 'seasPerson/getSectorSeas'
    return request({
      url: `/wtcrm/${url}`,
      method: 'get',
      params: params
    })
  }

}
// 发起认证选择用户
export function listAuthCompanyUserVoByMobile(params) {
  return request({
    url: '/wtuims/tmuser/listAuthCompanyUserVoByMobile?mobile=' + params,
    method: 'get',
    // params: params
  })
}
// 获取发起认证信息
export function getCreateCompanyAuthVo(params) {
  return request({
    url: '/wtcrm/tmClueCompanyAuthRecord/getCreateCompanyAuthVo?clueId=' + params,
    method: 'get',
    // params: params
  })
}
// 个人中心-获取发起认证信息
export function getMyCreateCompanyAuthVo(params) {
  return request({
    url: '/wtcrm/tmClueCompanyAuthRecord/getMyCreateCompanyAuthVo?clueId=' + params.clueId +'&clueType='+params.clueType,
    method: 'get',
    // params: params
  })
}
// 发起认证审核人下拉数据
export function listCertifiedAuthorized() {
  return request({
    url: '/wtcrm/permission/listCertifiedAuthorized',
    method: 'get',
  })
}
// 发起授权根据信用代码获取认证信息
export function getAuthCompanyUserVoByOrganization(params) {
  return request({
    url: '/wtuims/tmuser/getAuthCompanyUserVoByOrganization?organization=' + params,
    method: 'get',
  })
}
// 根据clueId取信用代码
export function getOrganizationByClueId(params) {
  return request({
    url: '/wtcrm/tmClueCompanyAuthRecord/getOrganizationByClueId?clueId=' + params,
    method: 'get',
  })
}
//我的线索发起认证
export function saveCertified(params) {
  return request({
    url: '/wtcrm/tmClueCompanyAuthRecord/saveCertified',
    method: 'post',
    data: params
  })
}
//我的线索详情发起授权
export function saveAuthorized(params) {
  return request({
    url: '/wtcrm/tmClueCompanyAuthRecord/saveAuthorized',
    method: 'post',
    data: params
  })
}

// 领取公海客户 seasType 0：部门公海 1：集团公海
export function receive(params, clueType, seasType) {
  if (seasType == 1) {
    let url = clueType == 1 ? 'seasCompany/receiveGroupClueCompanyBatch' : 'seasPerson/receiveGroupCluePersonBatch'
    return request({
      url: `/wtcrm/${url}`,
      method: 'put',
      data: params
    })
  } else {
    let url = clueType == 1 ? 'seasCompany/receiveSectorClueCompanyBatch' : 'seasPerson/receiveSectorCluePersonBatch'
    return request({
      url: `/wtcrm/${url}`,
      method: 'put',
      data: params
    })
  }
}

// 领取公海客户
export function receiveForMy(params, clueType) {
  let url = clueType == 1 ? 'seasCompany/receiveClueCompanyBatchOfMy' : 'seasPerson/receiveCluePersonBatchOfMy'
  return request({
    url: `/wtcrm/${url}`,
    method: 'put',
    data: params
  })
}

// 删除失效线索
export function delClue(params, clueType) {
  let url = clueType == 1 ? `clueCompany/removeClueCompany?clueCompanyId=${params.id}` : `cluePerson/removeCluePerson?cluePersonId=${params.id}`
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
    data: params
  })
}

// 通过信用代码查询认证信息
export function getOrgAuth(obj) {
  return request({
    url: '/wtuims/tmuser/getByOrganization',
    method: 'get',
    params: obj
  })
}

// 通过身份证号查询认证信息
export function getPersonalAuth(obj) {
  return request({
    url: '/wtuims/tmuser/getByMobile',
    method: 'get',
    params: obj
  })
}

// 修改备注 clue
export function updateRemark(obj, clueType) {
  let url = clueType == 1 ? `/clueCompany/remarkClueCompanyOfMy` : `/cluePerson/remarkCluePersonOfMy`
  return request({
    url: `/wtcrm/${url}`,
    method: 'put',
    data: obj
  })
}

// 获取线索详情 clueType：1-单位（线索/客户） 0-个人（线索/客户）
export function getClientDetail(params, clueType, status) {
  if (status) {
    let url = clueType == 1 ? '/transactionCompany/getTransactionCompanyOfMy' : '/transactionPerson/getTransactionPersonOfMy'
    return request({
      url: `/wtcrm/${url}`,
      method: 'get',
      params: params
    })
  } else {
    let url = clueType == 1 ? '/transactionCompany/getTransactionCompany' : '/transactionPerson/getTransactionPerson'
    return request({
      url: `/wtcrm/${url}`,
      method: 'get',
      params: params
    })
  }
}

// 发起订单判断 clueType：1-单位（线索/客户） 0-个人（线索/客户）
export function validateCreateOrder(params, clueType) {
  let url = clueType == 1 ? 'createOrderCheckForCompany' : 'createOrderCheckForPerson'
  return request({
    url: `/wtuims/${url}`,
    method: 'get',
    params: params
  })
}

// 获取合作机构下拉框
export function getPartnerList() {
  return request({
    url: `/admin/tmPartner/option`,
    method: 'get'
  })
}

// 获取对接人
export function getConnectEmp(partnerId) {
  return request({
    url: `/admin//tmPartner/getConnectEmpByPartnerId?partnerId=` + partnerId,
    method: 'get'
  })
}

// 查询我的公海线索列表-仅用于分页展示
export function getPersonalSeas(params, clueType) {
  let url = clueType == 1?'clueCompany/pageSeasClueCompanyOfMy':'cluePerson/pageSeasCluePersonOfMy'
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
    data: params
  })
}

// 公海线索全部数据-领取
export function receiveAllSeas(clueType) {
  let url = clueType == 1?'clueCompany/receiveAllSeasClueCompanyOfMy':'cluePerson/receiveAllSeasCluePersonOfMy'
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
  })
}

// 获取线索详情财务和人员信息 type 1-列表 0-我的
export function getTtClueCompanyUnit(params,type) {
  let url = type == 1?'transactionCompany/getTtClueCompanyUnit':'transactionCompany/getMyTtClueCompanyUnit'
  return request({
    url: `/wtcrm/${url}`,
    method: 'get',
    params: params
  })
}











