import request from '~/utils/request'

export function getWeixinOpenid(data) {
  return request({
    url: '/weChat/getOpenIdByCode',
    method: 'get',
    params:data
  })
}