import request from '@/utils/request'

export function upload(obj){
    return request({
        url: '/authentication/upload',
        method: 'post',
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
export function getAreaList() {
    return request({
        url: '/area/tree',
        method: 'get'
    })
};
export function receiveList(obj){//获取收件地址
    return request({
        url: '/receiveAddress/getList',
        method: 'get',
        params: obj
    })
}

export function deleteAdd(obj){//删除收件地址
    return request({
        url: '/receiveAddress/deleteReceiveAddressById',
        method: 'put',
        params: obj
    })
}

export function editAdd(obj){//编辑收件地址
    return request({
        url: '/receiveAddress/updateReceiveAddress',
        method: 'put',
        data: obj
    })
}

export function defaultAdd(obj){//设置默认收件地址
    return request({
        url: '/receiveAddress/setReceiveAddressDefault',
        method: 'put',
        params: obj
    })
}

export function addAddress(obj){//添加收件地址
    return request({
        url: '/receiveAddress/add',
        method: 'post',
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

export function getWeiXinResult(obj){     // 查询微信支付结果
    return request({
        url:'/order/getPayStatus',
        method:'post',
        data: obj
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

export function submitOrder(obj){//提交订单
    return request({
        url: '/order/submit',
        method: 'post',
        data: obj
    })
}

export function submitPay(obj){// 获取支付地址
    return request({
        url: '/order/payOrder',
        method: 'post',
        data: obj
    })
}
export function getStatus(obj) {//获取对公转账状态
    return request({
        url: '/pagehome/getOrderStatus/'+obj.orderNo,
        method: 'get',
    })
}
export function orderList(obj){//订单列表
    return request({
        url: "/tmOrder/innerPageTmOrder",
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
export function getOnlineOrdersStatistics(obj){
    return request({
        url:'tmOrder/statisticsOrderNumForFront',
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
};

export function getOrderTime(obj) {//订单进度
    return request({
        url: '/tmOrder/getOrderProgressInfo/'+ obj.orderId,
        method: 'get',
    })
};

export function getTaskProcessList(obj) {//任务进度
    return request({
        url: '/ttTaskProcess/innerGetProgressById',
        method: 'get',
        params: obj
    })
};

// export function getTaskByTaskNo(obj) {//根据任务编号获取任务信息
//     return request({
//         url: `/tmOrder/getTaskByTaskNo/${obj}`,
//         method: 'get',
//     })
// }
export function getTaskByTaskNo(obj){//根据任务编号获取任务信息
    return request({
        url: '/tmOrder/getTaskByTaskNo/'+obj.tradeNo,
        method:'get',
    })
}

export function getEssAuthStatus(){//获取支付状态
    return request({
        url: '/pcfddAut/getEssAuthStatus',
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