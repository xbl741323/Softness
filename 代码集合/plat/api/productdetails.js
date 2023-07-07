import request from '@/plugins/request'

// 产品列表
export function getProductList(data){
    return request({
        url:'/product/spu/pageInfo',
        method:'POST',
        data: data
    })
}

// 二级分类项目申报产品列表
export function getSecondProductList(data){
    return request({
        url:'/product/spu/pageGlobalSpu',
        method:'POST',
        data: data
    })
}

// 产品类目树
export function productList(data){
    return request({
        url:'/product/category/tree',
        method:'POST',
        data
    })
}

// 产品详情
export function getInfo(data){
    return request({
        url:'/product/spu/getInfo',
        method:'GET',
        params:data
    })
}

// 右侧推荐
export function getRightProduct(data){
    return request({
        url:'/product/spu/pageWeightSpu',
        method:'POST',
        data
    })
}

// 浏览量
export function getView(data){
    return request({
        url:'/product/view/spu',
        method:'GET',
        params:data
    })
}

// 添加收藏
export function addcollect(data){
    return request({
        url:'/product/collect/add',
        method:'POST',
        data
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

// 是否收藏
export  function isCollect(data){
    return request({
        url:'/product/collect/isCollected',
        method:'POST',
        data
    })
}

// 我的收藏列表
export function getcollectList(data){
    return request({
        url:'/product/collect/page',
        method:'POST',
        data
    })
}

//类目
export function getClassifyList() {
    return request({
        url: '/wtcrm/category',
        method: 'get'
    })
}

