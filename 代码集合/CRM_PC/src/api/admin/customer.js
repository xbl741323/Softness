import request from '@/router/axios'

export function getClientList(params) {
  return request({
    url: 'wtcrm/wtclueaccountemp/page',
    method: 'get',
    params: params
  })
}

export function getSoleClient(params) {
    return request({
      url: 'wtcrm/PersonalClueaccountemp/page',
      method: 'get',
      params: params
    })
  }

export function getSignList(params,status) {
  if(status){
    return request({
      url: 'wtcrm/sign/my',
      method: 'get',
      params: params
    })
  }else{
    return request({
      url: 'wtcrm/sign',
      method: 'get',
      params: params
    })
  }
}

export function getClueRecords(obj, clueType, type) {// 成交客户详情-线索记录
  let url = ''
  if(type == 0){
    url = clueType == 1 ? '/wtcrm/transactionCompany/listBindCompanyClueOfMy' : '/wtcrm/transactionPerson/listBindPersonClueOfMy'
  }else{
    url = clueType == 1 ? '/wtcrm/transactionCompany/listBindCompanyClue' : '/wtcrm/transactionPerson/listBindPersonClue'
  }
    return request({
      url: url,
      method: 'get',
      params: obj
    })
}

export function getClueList(params) {
    return request({
      url: 'wtcrm/wtclueaccount/sameClue',
      method: 'get',
      params: params
    })
}

export function getClientDetail(params) {
    return request({
      url: 'wtcrm/wtclueaccountemp',
      method: 'get',
      params: params
    })
}

export function getPersonalDetail(params,status) {
  if(status){
    return request({
      url: 'wtcrm/PersonalClueaccountemp/my',
      method: 'get',
      params: params
    })
  }else{
    return request({
      url: 'wtcrm/PersonalClueaccountemp',
      method: 'get',
      params: params
    })
  }
}


// 跟进统计详情
export function getGjtjDetail(params) {
  return request({
    url: 'wtcrm/wtclueaccountemp/getGjtjById',
    method: 'get',
    params:params
  })
}

export function getBelong(params) {
  return request({
    url: 'wtcrm/wtclueaccount/tips',
    method: 'get',
    params: params
  })
}


