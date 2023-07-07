import request from '@/plugins/request'

export function orderList(obj){
    return request({
        url:'/tmOrder/innerPageTmOrder',
        method:'post',
        data: obj
    })
}

export function updateOrder(obj){
    return request({
        url: obj.orderStatus == 6 ? '/tmOrder/cancelOrder/'+obj.id : '/tmOrder/'+obj.id,
        method: obj.orderStatus == 6 ? 'PUT' : 'DELETE',
        data: obj
    })
}

export function getOrderDetail(obj){
    return request({
        url:'/tmOrder/getOrderInfo/'+obj.id,
        method:'get'
    })
}

export function getOnlineOrdersStatistics(obj){
    return request({
        url:'tmOrder/statisticsOrderNumForFront',
        method:'post',
        data: obj
    })
}

export function publicTransfer(obj){//对公转账-支付凭证提交
    return request({
        url:'/tmOrder/payForOffline',
        method:'post',
        data: obj
    })
}

export function getPropertyDetail(obj) {//知产详情
    return request({
        url: '/property/detail',
        method: 'get',
        params: obj
    })
};

// export function getTaskProcessList(obj) {//任务进度
//     return request({
//         url: '/order/getTaskProcessList',
//         method: 'get',
//         params: obj
//     })
// };
// 获取任务进度
export function getTaskProcessList(obj) {
    return request({
        url: '/ttTaskProcess/innerGetProgressById',
        method: 'get',
        params: obj
    })
  }

export function getStatus(obj) {//获取对公转账状态
    return request({
        url: '/pagehome/getOrderStatus/'+obj.orderNo,
        method: 'get',
    })
};

export function getOrderTime(obj) {//订单进度
    return request({
        url: '/tmOrder/getOrderProgressInfo/'+ obj.orderId,
        method: 'get',
    })
};

export function getRefundReason(obj) { // 退款原因字典项
    return request({
        url: '/refund/getRefundReason',
        method: 'get',
        params: obj
    })
};

export function applyRefund(obj) { // 申请退款
    return request({
        url: '/tmRefund/saveRefund',
        method: 'post',
        data: obj
    })
};

export function getRefundList(obj){   //退款售后列表
    return request({
        url:'/tmRefund/pageTmRefundSpuVo',
        method:'post',
        data: obj
    })
}

export function cancelRefund(obj){    //撤销申请
    return request({
        url:'/tmRefund/revokeRefund/'+obj.refundId,
        method:'put',
    })
}

export function getRefundDetail(obj){    //退款详情
    return request({
        url:'/tmRefund/getTmRefundSpuVoByRefundId/'+obj.refundId,
        method:'GET',
    })
}

export function isApply(obj){     // 是否申请
    return request({
        url:'/refund/getTaskNo',
        method:'GET',
        params: obj
    })
}

export function getWeiXinResult(obj){     // 查询微信支付结果
    return request({
        url:'/tmOrder/getPaymentInfoById',
        method:'get',
        params: obj
    })
}

export function getWxFocus(params){
    return request({
        url:'/msg/wx/qrcode/subscribe?accountId='+params.accountId,
        method:'get'
    })
}


export function saveOrder(obj, initStatus){//提交订单
    return request({
        url: initStatus ? '/tmOrder/confirmOrder' : '/tmOrder/saveOrder',
        method:'post',
        data: obj
    })
}

export function orderPay(obj){//订单支付
    return request({
        url:'/tmOrder/payForPc',
        method:'post',
        data: obj
    })
}

export function getOrderUsrerInfo(obj){//订单支付
    return request({
        url:'/pcTmUser/getConfirmOrderUserInfo',
        method:'get',
        params: obj
    })
}

export function getInitOrderDetail(obj){//订单支付
    return request({
        url:'/tmOrder/getIneffectiveOrderInfo/'+obj.id,
        method:'get',
    })
}


export function signSelf(obj){//签约
    return request({
        url: '/ess/signSelf',
        method:'post',
        data: obj
    })
}

export function changeContractType(obj){//修改签约方式
    return request({
        url: '/tmOrder/changeContractType',
        method:'put',
        data: obj
    })
}

export function getTaskByTaskNo(obj){//获取支付状态
    return request({
        url: '/tmOrder/getTaskByTaskNo/'+obj.tradeNo,
        method:'get',
    })
}


export function getEssAuthStatus(){//获取支付状态
    return request({
        url: '/pcfddAut/getEssAuthStatus',
        method: 'get',
    })
}


export function listContractByOrderId(obj){//获取合同列表
    return request({
        url: '/ess/listContractByOrderId',
        method:'get',
        params: obj
    })
}


