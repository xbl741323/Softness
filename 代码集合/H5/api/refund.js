import request from '~/utils/request'

export function getOrderDetail(obj){
    return request({
        url:'/order/getOnlineOrderDetail',
        method:'get',
        params: obj
    })
}

export function getRefundReason(obj) { // 退款原因字典项
    return request({
        url: '/refund/getRefundReason',
        method: 'get',
        params: obj
    })
};

export function applyRefund(obj) { // 申请退款
    return request({
        url: '/refund/applyRefund',
        method: 'post',
        data: obj
    })
};

export function getRefundList(obj){       //退款售后列表
    return request({
        url:'/refund/getRefundList',
        method:'post',
        params: obj
    })
}

export function cancelRefund(obj){       //撤销申请
    return request({
        url:'/refund/cancelRefund',
        method:'GET',
        params: obj
    })
}

export function getRefundDetail(obj){      //退款详情
    return request({
        url:'/refund/getRefundDetail',
        method:'GET',
        params: obj
    })
}

export function isApply(obj){      // 是否退款
    return request({
        url:'/refund/getTaskNo',
        method:'GET',
        params: obj
    })
}



