import request from '~/utils/request'
//所有产品
export function getTree(data){
    return request({
        url:'/product/category/tree',
        method:'POST',
        data
    })
}

//产品列表
export function getProductList(data){
    return request({
        url:'/product/spu/pageGlobalSpu',
        method:'POST',
        data
    })
}

//属性集
export function getAttributeList(data){
    return request({
        url:'/product/attribute/listAttribute',
        method:'post',
        data
    })
}

//类目
export function getLeimu(){
    return request({
        url:'/policy/selection/4',
        method:'get'
    })
}


export function getListPage(data){
    return request({
        url:'/property/getListPage',
        method:'GET',
        params:data
    })
}

export function getOtherList(data){
    return request({
        url:'/serviceClass/getOtherList',
        method:'GET',
        params:data
    })
}

export function getNewProject(data){
    return request({
        url:'/policy/index/list',
        method:'post',
        data:data
    })
}


