import request from 'axios'

export function getNavList(params) {
    return request({
        url: '/wtcrm/jsnavigation/list',
        method: 'post',
        data:params
    })
}

export function getDraftList(params) {
    return request({
        url: '/wtcrm/jsnavigation/cglist',
        method: 'post',
        data:params
    })
}

export function addNav(params) {
    return request({
        url: '/wtcrm/jsnavigation/add',
        method: 'post',
        data: params
    })
}

export function editNav(params) {
    return request({
        url: '/wtcrm/jsnavigation/edit',
        method: 'put',
        data: params
    })
}

export function fastEditNav(params) {
    return request({
        url: '/wtcrm/jsnavigation/rapidChange',
        method: 'put',
        data: params
    })
}

export function deleteNav(number) {
    return request({
        url: '/wtcrm/jsnavigation/delete/' + number,
        method: 'delete'
    })
}

export function multiDeleteNav(params) {
    return request({
        url: '/wtcrm/jsnavigation/batchDelete',
        method: 'delete',
        data: params
    })
}

export function getNavDetail(number) {
    return request({
        url: '/wtcrm/jsnavigation/getDetail/' + number,
        method: 'get'
    })
}

export function getRecords(params) {
    return request({
        url: '/wtcrm/jsnavigation/record',
        method: 'post',
        data: params
    })
}

export function changeNavStatus(params) {
    return request({
        url: '/wtcrm/jsnavigation/changeShowStatus',
        method: 'put',
        data: params
    })
}

export function checkTitle(params) {
    return request({
        url: '/wtcrm/jsnavigation/checkTitle',
        method: 'post',
        data: params
    })
}

export function getNavBar() {
    return request({
        url: '/wtcrm/jsnavigation/getTypeList',
        method: 'get'
    })
}

