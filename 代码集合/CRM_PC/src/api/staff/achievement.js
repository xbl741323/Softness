import request from 'axios'


//回款2
export function pageReceiveStatistics(obj) {
  return request({
    url: '/wtorder/receive/pageReceiveStatistics',
    method: 'post',
    data: obj
  });
}


// 合同
export function pageContractStatistics(obj) {
  return request({
    url: '/wtess/contract/pageContractStatistics',
    method: 'post',
    data: obj
  });
}

// 创建线索
export function pageClueStatistics(obj) {
  return request({
    url: '/wtcrm/clue/pageClueStatistics',
    method: 'post',
    data: obj
  });
}

// 跟进
export function pageClueFollowStatistics(obj) {
  return request({
    url: '/wtcrm/clueFollow/pageClueFollowStatistics',
    method: 'post',
    data: obj
  });
}

// 个人-回款
export function getMyPayment(obj) {
  return request({
    url: '/wtcrm/achievementCount/myPaymentCollection ',
    method: 'post',
    data: obj
  });
}

// 个人-回款2
export function getMyPaymentCollectionList(obj) {
  return request({
    url: '/wtorder/receive/getMyPaymentCollectionList',
    method: 'post',
    data: obj
  });
}


// 个人-合同
export function pageStatisticsContract(obj) {
  return request({
    url: '/wtess/contract/pageStatisticsContract',
    method: 'post',
    data: obj
  });
}

// 个人-创建线索
export function pageClueInfo(obj) {
  return request({
    url: '/wtcrm/clue/pageClueInfo',
    method: 'post',
    data: obj
  });
}

// 个人-跟进
export function pageClueFollowByOperateEmpId(obj) {
  return request({
    url: '/wtcrm/clueFollow/pageClueFollowByOperateEmpId',
    method: 'post',
    data: obj
  });
}

export function addClueReturnVisit(obj) {
  return request({
    url: '/wtcrm/return/addClueReturnVisit',
    method: 'post',
    data: obj
  });
}

export function modClueReturnVisit(obj) {
  return request({
    url: '/wtcrm/return/modClueReturnVisit',
    method: 'post',
    data: obj
  });
}

export function getReturnDirection(params) {
  return request({
    url: '/wtcrm/constantcatagory/list',
    method: 'get',
    params:params
  });
}