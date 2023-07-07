import request from 'axios'

export function getNavList(params) {
    return request({
        url: '/hfxl/jsnavigation/list',
        method: 'post',
        data:params
    })
}

export function getDraftList(params) {
    return request({
        url: '/hfxl/jsnavigation/cglist',
        method: 'post',
        data:params
    })
}

export function addNav(params) {
    return request({
        url: '/hfxl/jsnavigation/add',
        method: 'post',
        data: params
    })
}

export function editNav(params) {
    return request({
        url: '/hfxl/jsnavigation/edit',
        method: 'put',
        data: params
    })
}

export function fastEditNav(params) {
    return request({
        url: '/hfxl/jsnavigation/rapidChange',
        method: 'put',
        data: params
    })
}

export function deleteNav(obj) {
    return request({
        url: `/hfxl/jsnavigation/delete?number=${obj.number}&substationId=${obj.substationId}`,
        method: 'delete'
    })
}

export function multiDeleteNav(params) {
    return request({
        url: '/hfxl/jsnavigation/batchDelete',
        method: 'delete',
        data: params
    })
}

export function getNavDetail(number) {
    return request({
        url: '/hfxl/jsnavigation/getDetail/' + number + "/1",
        method: 'get'
    })
}

export function getNewNavDetail(number, substationId) {
    return request({
        url: `/hfxl/jsnavigation/getDetail/${number}/${substationId}`,
        method: 'get'
    })
}

export function getRecords(params) {
    return request({
        url: '/hfxl/jsnavigation/record',
        method: 'post',
        data: params
    })
}

export function changeNavStatus(params) {
    return request({
        url: '/hfxl/jsnavigation/changeShowStatus',
        method: 'put',
        data: params
    })
}

export function checkTitle(params) {
    return request({
        url: '/hfxl/jsnavigation/checkTitle',
        method: 'post',
        data: params
    })
}

export function getNavBar(params) {
    return request({
        url: '/hfxl/jsnavigation/getTypeList?substationId=' + params,
        method: 'get'
    })
}

