import request from '~/utils/request'

// 添加收藏
export function addColl(obj){
    return request({
        url:'/collection/addCollection',
        method:'post',
        data:obj
    })
}

// 取消收藏
export function cancelCollect(obj){
    return request({
        url:'/collection/cancelCollection',
        method:'post',
        data:obj
    })
}


// 服务产品列表
export function getCollList(params) {
    return request({
        url: '/collection/getCollectionList',
        method: 'post',
        data: params
    })
};

// 统计数量
export function getCount(params) {
    return request({
        url: '/collection/getCollectionNumbers',
        method: 'post',
        data: params
    })
};

// 服务产品批量删除
export function batchDeleteColl(params) {
    return request({
        url: '/collection/batchDeleteCollection',
        method: 'post',
        data: params
    })
}


// 取消收藏
export function cancelcollect(data){
    return request({
        url:'/product/collect/delBatch',
        method:'DELETE',
        data
    })
}