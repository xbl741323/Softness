import request from '@/router/axios'
//开票审批列表
export function getList(param) {
    return request({
    url: '/wtcrm/task/invoice/getTaskInvoice',
    method: 'post',
    data: param
    })
}

//开票审批状态列表
export function getStateList(param) {
    return request({
    url: '/wtcrm/task/statistical',
    method: 'get',
    params:param
    })
}

// 快递公司
export function getCompany() {
    return request({
        url: '/wtcrm/invoice/getCourierServices',
        method: 'get'
    })
}

// 开票审批详情
export function getpersoninvoicingdDetail(data) {
    return request({
    url: '/wtcrm/task/getInvoiceDetail?taskNo='+data,
    method: 'get'
    })
}

// 开票审核
export function audit(obj) {
    return request({
      url: '/wtcrm/invoice/auditSuccess',
      method: 'post',
      data: obj
    })
}

//  开票审核不通过
export function auditFail(obj) {
    return request({
      url: '/wtcrm/invoice/auditFailure',
      method: 'post',
      data: obj
    })
}


export function countStateOfMy(){
    return request({
        url: '/wtorder/invoice/countStateOfMy',
        method: 'get',
    })
}

export function getTaskInvoiceOfMy(obj){
    return request({
        url: '/wtorder/invoice/getTaskInvoiceOfMy',
        method: 'post',
        data:obj
    })
}


//  我的审核
// export function myaudit(obj) {
//     return request({
//       url: '/wtcrm/personal/task/refund/auditSuccess',
//       method: 'post',
//       data: obj
//     })
// }



//  我的审核不通过
// export function myauditFail(obj) {
//     return request({
//       url: '/wtcrm/personal/task/refund/auditFailure',
//       method: 'post',
//       data: obj
//     })
// }


// 修改发票
export function editInvoicing(obj) {
    return request({
      url: '/wtcrm/invoice/updateInvoiceByTaskNo',
      method: 'post',
      data: obj
    })
}

// 我的修改发票
export function editPersonInvoicing(obj) {
    return request({
      url: '/wtcrm/invoice/personal/updateInvoiceByTaskNo',
      method: 'post',
      data: obj
    })
}



