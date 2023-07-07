import request from 'axios'

export function getPersonalSupplement(obj) {//补充协议分页-我的合同
  return request({
    url: '/wtess/contractSupplementary/pageContractSupplementaryOfMy',
    method: 'post',
    data: obj
  })
}


export function getListSupplement(obj) {//补充协议分页-合同管理
  return request({
    url: '/wtess/contractSupplementary/pageContractSupplementary',
    method: 'post',
    data: obj
  })
}


export function getPersonalContractList(obj) {//分页查询（电子+纸质合同列表）-我的
  return request({
    url: '/wtess/contractSupplementary/pageSignedContractAllTypeOfMy',
    method: 'post',
    data: obj
  })
}

export function getAllContractList(obj) {//分页查询（电子+纸质合同列表）-全部
  return request({
    url: '/wtess/contractSupplementary/pageSignedContractAllType',
    method: 'post',
    data: obj
  })
}

export function getAllsupplementStatus() {//获取合同补充协议进度-全部
  return request({
    url: '/wtess/contractSupplementary/getContractSupplementaryProcess',
    method: 'post',
  })
}

export function getMysupplementStatus() {//获取合同补充协议进度-全部
  return request({
    url: '/wtess/contractSupplementary/getContractSupplementaryProcessOfMy',
    method: 'post',
  })
}

export function saveContractSupplementary(obj, source) {//保存合同补充协议
  return request({
    url: source == 'personal'? '/wtess/contractSupplementary/saveContractSupplementaryOfMy' : '/wtess/contractSupplementary/saveContractSupplementary',
    method: 'post',
    data: obj
  })
}

export function saveContractSupplementaryDraft(obj, source) {//保存合同补充协议草稿
  return request({
    url: source == 'personal' ? '/wtess/contractSupplementary/saveContractSupplementaryDraftOfMy' : '/wtess/contractSupplementary/saveContractSupplementaryDraft',
    method: 'post',
    data: obj
  })
}


export function getSupplementDetail(obj, source) {//补充协议详情
  return request({
    url: source == 'personal' ? '/wtess/contractSupplementary/getContractSupplementaryOfMy' : '/wtess/contractSupplementary/getContractSupplementary',
    method: 'get',
    params: obj
  })
}


export function removePaperContract(obj, source) {//删除补充协议
  return request({
    url: source == 'personal' ? '/wtess/contractSupplementary/removePaperContractOfMy' : '/wtess/contractSupplementary/removePaperContract',
    method: 'delete',
    params: obj
  })
}


export function exportExcel(obj) {//数据导出
  return request({
    url: '/wtess/contractSupplementary/exportExcel',
    method: 'post',
    data: obj,
    responseType: 'blob'
  })
}

