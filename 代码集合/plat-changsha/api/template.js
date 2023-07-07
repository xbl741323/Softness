import request from '@/plugins/request'

export function getNavList(params) {
    return request({
        url: '/hfxl/jsnavigation/getListByColumnId',
        method: 'get',
        params: params
    })
}

export function getNavDetail(params) {
    return request({
        url: '/jsnavigation/getDetail',
        method: 'post',
        data:params
    })
}

export function getClassifyList() {
    return request({
        url: '/jsnavigation/getAreaList',
        method: 'get',
    })
}

export function addCommonView(number) {
    return request({
        url: '/jsnavigation/addPageView/'+number,
        method: 'get',
    })
}

// 搜索
export function globalSearch(data) {
    return request({
        url: '/hfxl/esJsNavigation/getListByColumnId',
        method: 'post',
        data: data
    })
}