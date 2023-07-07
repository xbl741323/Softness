import request from '@/router/axios'
//参数设置
export function addParam(params) {
    return request({
        url: '/wtcrm/classSet/add',
        method: 'post',
        data: params
    })
}

export function editParam(params) {
    return request({
        url: '/wtcrm/classSet/edit',
        method: 'put',
        data: params
    })
}

export function getParamList(typeId) {
    return request({
        url: '/wtcrm/classSet/all/' + typeId,
        method: 'get'
    })
}

export function addOption(params) {
    return request({
        url: '/wtcrm/option/add',
        method: 'post',
        data: params
    })
}

export function deleteOption(params) {
    return request({
        url: 'wtcrm/option/del/' + params.number + "/" + params.id,
        method: 'delete'
    })
}

export function editOption(params) {
    return request({
        url: 'wtcrm/classSet/edit/',
        method: 'put',
        data: params
    })
}


export function editSoleOption(params) {
    return request({
        url: 'wtcrm/classSet/editSearch',
        method: 'put',
        data: params
    })
}

//热点
export function getHotList(type) {
    return request({
        url: 'wtcrm/hotspotSet/all/' + type,
        method: 'get'
    })
}

export function editHotParam(params) {
    return request({
        url: 'wtcrm/hotspotSet/edit',
        method: 'put',
        data: params
    })
}

//新的通知公告地区下拉框
export function getAreaSelect() {
    return request({
        url: '/wtcrm/classSet/areaDrop',
        method: 'get'
    })
}

export function getNuticeList() {
    return request({
        url: 'wtcrm/drop/0',
        method: 'get'
    })
}

//参数设置需求新接口

export function paramAdd(params) {
    return request({
        url: 'wtcrm/factor',
        method: 'post',
        data: params
    })
}
export function NewparamAdd(params) {
    return request({
        url: 'wtcrm/squareFactor',
        method: 'post',
        data: params
    })
}
export function paramEdit(params) {
    return request({
        url: 'wtcrm/factor',
        method: 'put',
        data: params
    })
}
export function NewparamEdit(params) {
    return request({
        url: 'wtcrm/squareFactor',
        method: 'put',
        data: params
    })
}
export function paramDel(id) {
    return request({
        url: 'wtcrm/factor?id=' + id,
        method: 'delete'
    })
}
export function NewparamDel(id) {
    return request({
        url: 'wtcrm/squareFactor?id=' + id,
        method: 'delete'
    })
}
export function getParamArr(type) {
    return request({
        url: 'wtcrm/factor?type=' + type,
        method: 'get'
    })
}
export function getParamClass() {
    return request({
        url: 'wtcrm/category/drop',
        method: 'get'
    })
}



