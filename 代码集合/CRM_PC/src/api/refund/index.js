import request from 'axios'

export function getRefundReason() {
  return request({
    url: '/wtcrm/refund/getRefundReason ',
    method:'get'
  })
}

export function applyRefund(obj, url){
  return request({
    url: url,
    method:'post',
    data: obj
  })
}

export function getRefundDetail(obj,url){
  return request({
    url: url,
    method:'get',
    params: obj
  })
}

export function refundRevoke(obj){
  return request({
    url: '/wtcrm/refund/refundRevoke',
    method:'put',
    params: obj
  })
}

export function getAuditor(){
  return request({
    url: '/wtcrm/refund/getAuditors',
    method:'get'
  })
}