import request from '@/router/axios'

export function getSeasCustomerList(params) {
  return request({
    url: 'wtcrm/publicClient/hf',
    method: 'get',
    params: params
  })
}
export function getIdleClueDetail(id) {
  return request({
    url: 'wtcrm/publicClient/hf/' + id,
    method: 'get',
  })
}

export function receive(id, no) {
  return request({
    url: 'wtcrm/publicClient/hf/receive/' + id + '/' + no,
    method: 'put',
  })
}

export function batchReceiveClue(params) {
  return request({
    url: 'wtcrm/publicClient/hf/receiveBatch',
    method: 'put',
    data: params
  })
}

export function getDepList(arr) {
  return request({
    url: 'admin/dept/publicClientDept',
    method: 'get',
  })
}

export function getRecords(params, status) {
  if (status) {
    return request({ // 线索
      url: 'wtcrm/sign/myClue',
      method: 'get',
      params: params
    })
  } else {
    return request({ // 客户
      url: 'wtcrm/sign/my',
      method: 'get',
      params: params
    })
  }
}

export function getSetttingList() {
  return request({
    url: '/wtcrm/publicClientSet',
    method: 'get',
  })
}

export function settingTime(obj) {
  return request({
    url: '/wtcrm/publicClientSet',
    method: 'put',
    data: obj
  })
}