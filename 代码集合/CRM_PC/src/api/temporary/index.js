import request from 'axios'

export function gogogo(obj) {
  return request({
    url: '/hfxl/jsnavigation/getListByColumnId',
    method: 'get',
    params: obj
  })
}