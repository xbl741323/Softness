import request from '@/router/axios'

export function addBanner(params) {
    return request({
        url: '/wtcrm/jsbanner/add',
        method: 'post',
        data: params
    })
}

export function editBanner(params) {
    return request({
        url: '/wtcrm/jsbanner/change',
        method: 'put',
        data: params
    })
}

export function changeOne(params) {
    return request({
        url: '/wtcrm/jsbanner/changeOne',
        method: 'put',
        data: params
    })
}

export function deleteBanner(params) {
    return request({
        url: '/wtcrm/jsbanner/delete',
        method: 'delete',
        data: params
    })
}

export function getBannerList(type) {
    return request({
        url: '/wtcrm/jsbanner/list/' + type,
        method: 'get'
    })
}

export function moveBanner(params) {
    return request({
        url: '/wtcrm/jsbanner/move',
        method: 'put',
        data: params
    })
}

export function getBannerRecords(params) {
    return request({
        url: '/wtcrm/jsbanner/operate',
        method: 'post',
        data: params
    })
}

export function getBannerNav() {
    return request({
        url: '/wtcrm/column/getBannerTypeList',
        method: 'get'
    })
}