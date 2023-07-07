import request from '@/router/axios'
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
        url: '/wtcrm/classSet/drop/' + typeId,
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





