import request from '@/plugins/request'

export function getBannerList() {
    return request({
        url: '/program',
        method: 'GET'
    })
}

export function getRightContent(data) {
    return request({
        url: '/program/page',
        method: 'GET',
        params: data
    })
}

export function getRightdetail(data) {
    return request({
        url: '/program/getById?id=' + data,
        method: 'GET'
    })
}

// 浏览量
export function getView(data) {
    return request({
        url: '/program/add?id=' + data,
        method: 'GET'
    })
}