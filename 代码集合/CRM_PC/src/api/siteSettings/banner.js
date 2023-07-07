import request from '@/router/axios'

export function addBanner(params) {
    return request({
        url: '/wtcrm/banner/add',
        method: 'post',
        data: params
    })
}

export function editBanner(params) {
    return request({
        url: '/wtcrm/banner/change',
        method: 'put',
        data: params
    })
}

export function changeOne(params) {
    return request({
        url: '/wtcrm/banner/changeOne',
        method: 'put',
        data: params
    })
}

export function deleteBanner(params) {
    return request({
        url: '/wtcrm/banner/delete',
        method: 'delete',
        data: params
    })
}

export function getBannerList(type) {
    return request({
        url: '/wtcrm/banner/list/' + type,
        method: 'get'
    })
}

export function moveBanner(params) {
    return request({
        url: '/wtcrm/banner/move',
        method: 'put',
        data: params
    })
}

export function getBannerRecords(params) {
    return request({
        url: '/wtcrm/banner/operate',
        method: 'post',
        data: params
    })
}