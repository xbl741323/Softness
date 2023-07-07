import request from 'axios'

// 纸质合同保存草稿和提交审核
export function saveContactDraft(obj){
  return request({
    url: '/wtess/paperContract/savePaperContract',
    method: 'post',
    data: obj
  })
}

// 上传合同文件接口 
export function uploadContactFile(obj){
  return request({
    url: '/wtess/paperContract/upLoadClueFollowFile',
    method: 'post',
    data: obj
  })
}

export function getClueContractDetail(id){
  return request({
    url: '/wtcrm/wtclueaccount/clue/contract/detail?id='+id,
    method: 'get'
  })
}

export function addContract(obj){
  return request({
    url: '/wtcrm/wtcontract',
    method: 'post',
    data: obj
  })
}
export function personalAddContract(obj){
  return request({
    url: '/wtcrm/wtcontract/personal/save',
    method: 'post',
    data: obj
  })
}

export function saveDraft(obj){//合同列表-录入
  return request({
    url: '/wtcrm/wtcontract/saveDraft',
    method: 'post',
    data: obj
  })
}

export function personalSaveDraft(obj){//我的合同-录入
  return request({
    url: '/wtcrm/wtcontract/personal/saveDraft',
    method: 'post',
    data: obj
  })
}

export function contractInfo(id,type){
  if(type == 'list'){//合同列表
    return request({
      url: '/wtcrm/wtcontract/detail/'+id,
      method: 'get',
    })
  }else{//我的合同
    return request({
      url: '/wtcrm/personal/wtcontract/'+id,
      method: 'get',
    })
  }
}

export function delContract(obj){
  return request({
    url: '/wtcrm/wtcontract/del',
    method: 'delete',
    params: obj
  })
}

export function updateInfo(obj){
  return request({
    url: '/wtcrm/wtcontract/synchr',
    method: 'post',
    data: obj
  })
}

export function getContactNO(id){
  return request({
    url: '/wtcrm/drop/getByType?type='+id,
    method: 'get',
  })
}

export function saveOnLion(obj){
  return request({
    url: '/wtcrm/wtcontract/personal/saveOnLion',
    method: 'post',
    data: obj
  })
}

export function getCfo(obj){//获取法人财务
  return request({
    url: '/wtcrm/wtcontract/getCfo',
    method: 'get',
    params: obj
  })
}

export function editOnLion(obj){//编辑线上合同
  return request({
    url: '/wtcrm/wtcontract/personal/editOnLion',
    method: 'post',
    data: obj
  })
}