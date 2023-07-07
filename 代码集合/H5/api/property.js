import request from '~/utils/request'

export function getPropertyList() {
    return request({
        url: '/property/list',
        method: 'get',
    })
};

export function getPropertyDetail(params) {
    return request({
        url: '/property/detail',
        method: 'get',
        params: params
    })
};

export function addPropertyCollect(params) {
    return request({
        url: '/collectionProperty/addPropertyCollect',
        method: 'post',
        data: params
    })
};

export function cancelPropertyCollect(params) {
    return request({
        url: '/collectionProperty/cancelPropertyCollect',
        method: 'post',
        data: params
    })
};

export function getProCollectList(params) {
    return request({
        url: '/collectionProperty/propertyCollectionList',
        method: 'post',
        data: params
    })
};

export function cancelMultiPropertyCollect(params) {
    return request({
        url: '/collectionProperty/cancelPropertyCollectiontBatch',
        method: 'post',
        data: params
    })
};