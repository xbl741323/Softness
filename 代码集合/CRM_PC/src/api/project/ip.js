import request from '@/router/axios'

export function addProduct(params) {
    return request({
        url: '/wtcrm/property',
        method: 'post',
        data: params
    })
}

export function editTradeInfo(params) {
    return request({
        url: '/wtcrm/property/editTransactionInfo',
        method: 'put',
        data: params
    })
}
export function editPojectTradeInfo(params) {
    return request({
        url: '/wtcrm/project/editTransactionInfo',
        method: 'put',
        data: params
    })
}

export function getProductImg() {
    return request({
        url: '/wtcrm/property/cover',
        method: 'get'
    })
}

export function getProductList(params) {
    return request({
        url: '/wtcrm/property/list',
        method: 'get',
        params:params
    })
}

export function getProductDetail(id) {
    return request({
        url: '/wtcrm/property/'+id,
        method: 'get'
    })
}

export function editContent(params) {
    return request({
        url: '/wtcrm/property/detailInfo',
        method: 'put',
        data:params
    })
}

export function editProduct(params) {
    return request({
        url: '/wtcrm/property/baseInfo',
        method: 'put',
        data:params
    })
}

export function getOperateLog(params) {
    return request({
        url: '/wtcrm/property/propertyLog',
        method: 'get',
        params:params
    })
}


export function checkProductName(params) {
    return request({
        url: '/wtcrm/property/checkName',
        method: 'get',
        params:params
    })
}

export function setStatus(params) {
    return request({
        url: '/wtcrm/property/editStatus',
        method: 'put',
        data:params
    })
}
