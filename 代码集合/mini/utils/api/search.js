import {
  request
} from "../common/request.js"
module.exports = {
  switchProvincePC: () => {
    return request('get', '/area/switchProvincePC')
  },
  selection: (data) => {
    return request('get', `/area/selection/${data}`)
  },
  getDistrict: () => {
    return request('get', `/tcRegion/tree`)
  },
  searchCity: (data) => {
    return request('post', `/tcRegion/getAreaByCityName`, data)
  },
  // 资讯广场通知公告列表
  esPagePolicy: (data) => {
    return request('post', `/esPolicy/esPagePolicy`, data)
  },
  // 资讯广场行业资讯列表
  esPageIndustry: (data) => {
    return request('post', `/esIndustryInfo/esPageIndustryInfo`, data)
  },
  //获取归口数据
  getSelection: (data) => {
    return request('get', `/policy/selectionByType/${data}`)
  },
  // 获取通知公告详情
  getNoticeDetail: (data) => {
    return request('get', `/policy/detailByNumber?number=${data.number}&type=${data.type}&id=${data.id}`)
  },
  // 获取行业资讯详情
  getIndustryDetail: (number) => {
    return request('get', `/esIndustryInfo/getDetail/${number}`)
  },
  // 获取通知公告详情推荐产品
  recommendProducts: (data) => {
    return request('get', `/product/spu/listRecommendedProducts?spuIds=${data.spuIds}`)
  },
  // 取消收藏
  delCollect: (data) => {
    return request('delete', `/info/collect/delBatch`, data)
  },
  // 添加收藏
  addCollect: (data) => {
    return request('post', `/info/collect/add`, data)
  },
  // 查询是否已收藏
  selectIsCollect: (data) => {
    return request('post', `/info/collect/isCollected`, data)
  }
}