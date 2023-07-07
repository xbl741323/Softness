import request from '@/router/axios'

export function addBanner(params) {
    return request({
        url: '/hfxl/jsbanner/add',
        method: 'post',
        data: params
    })
}

export function editBanner(params) {
    return request({
        url: '/hfxl/jsbanner/change',
        method: 'put',
        data: params
    })
}

export function changeOne(params) {
    return request({
        url: '/hfxl/jsbanner/changeOne',
        method: 'put',
        data: params
    })
}

export function deleteBanner(params) {
    return request({
        url: '/hfxl/jsbanner/delete',
        method: 'delete',
        data: params
    })
}

export function getBannerList(params) {
    return request({
        url: `/hfxl/jsbanner/list?substationId=${params.substationId}&type=${params.type}`,
        method: 'get',
    })
}

export function moveBanner(params) {
    return request({
        url: '/hfxl/jsbanner/move',
        method: 'put',
        data: params
    })
}

export function getBannerRecords(params) {
    return request({
        url: '/hfxl/jsbanner/operate',
        method: 'post',
        data: params
    })
}

export function getBannerNav(id) {
    return request({
        url: '/hfxl/column/getBannerTypeList?substationId='+ id,
        method: 'get'
    })
}