import request from 'axios'

export function getAuditors(){
  return request({
    url: "/wtcrm/invoice/getAuditors",
    method: 'get',
  })
}

export function getInvoicingDetail(receiveNo){
  return request({
    url: '/wtcrm/invoice/getInvoiceMessage?receiveNo='+receiveNo,
    method: 'get',
  })
}

export function applyInvoice(obj){
  return request({
    url: '/wtcrm/invoice/appliInvoice',
    method: 'post',
    data: obj
  })
}

export function applyPersonalInvoice(obj){
  return request({
    url: '/wtcrm/invoice/personal/appliInvoice',
    method: 'post',
    data: obj
  })
}