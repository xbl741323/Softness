import request from '@/router/axios'

// 部门公海列表
export function getSeaList(param, clueType) {
  let url = clueType == 1 ? "seasCompany/pageSectorSeas" : "seasPerson/pageSectorSeas"
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
    data: param
  })
}
