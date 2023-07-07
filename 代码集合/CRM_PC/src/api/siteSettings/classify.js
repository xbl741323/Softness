import request from '@/router/axios'

export function addClassify(params) {
    return request({
        url: '/wtcrm/category',
        method: 'post',
        data: params
    })
}

export function getClassifyList() {
    return request({
        url: '/wtcrm/category',
        method: 'get'
    })
}

export function delClassify(id) {
    return request({
        url: '/wtcrm/category?id=' + id,
        method: 'delete'
    })
}

export function editClassify(params) {
    return request({
        url: '/wtcrm/category',
        method: 'put',
        data: params
    })
}

export function getAreaClassify() {
    return request({
        url: '/wtcrm/category/area ',
        method: 'get'
    })
}
