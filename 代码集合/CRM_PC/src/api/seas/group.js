import request from '@/router/axios'

//集团公海详情
export function getGroupDetail(id) {
  return request({
    url: '/wtcrm/publicClient/jt/' + id,
    method: 'get'
  })
}

//集团领取
export function groupReceive(id, no) {
  return request({
    url: '/wtcrm/publicClient/jt/receive/' + id + '/' + no,
    method: 'put'
  })
}


// 部门公海列表-重构
export function getSeaList(param, clueType) {
  let url = clueType == 1 ? "seasCompany/pageGroupSeas" : "seasPerson/pageGroupSeas"
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
    data: param
  })
}
