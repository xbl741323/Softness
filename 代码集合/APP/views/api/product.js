import request from '../utils/common/request'

// 获取产品分类数据
export function getProTab(params) {
  return request({
    url: '/product/category/tree',
    method: 'post',
    data: params,
  })
}

// 获取产品列表
export function getProductList(params) {
  return request({
    url: '/product/spu/pageInfo',
    method: 'post',
    data: params
  })
}

// 获取产品属性信息
export function getAttributeList(params) {
  return request({
    url: '/product/attribute/listAttribute',
    method: 'post',
    data: params
  })
}

// 获取产品详情
export function getProDetail(data) {
  return request({
    url: '/product/spu/getInfo',
    method: 'get',
    params: data
  })
}


// 获取项目申报属性信息
export function getProjectAttribute() {
  return request({
    url: '/area/selection/4',
    method: 'get'
  })
}




