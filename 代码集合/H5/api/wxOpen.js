import request from '~/utils/request'

export function getPayRes(orderNo) {
  return request({
    url: 'order/getPay/' + orderNo,
    method: 'post'
  })
}