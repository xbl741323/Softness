import {
  request
} from "../common/request.js"

module.exports = {
  // 获取五大类新产品列表数据
  getProductList: (data) => {
    // 2:gs工商 3:rz融资 4:fl法律 5:cs财税 6:软件开发
    return request('get', '/otherProduct/getOtherList', data)
  },
  // 获取五大类新产品详情数据
  getProductDetail: (data, type) => {
    let url = ""
    // 2:gs工商 3:rz融资 4:fl法律 5:cs财税 6:软件开发
    switch (type) {
      case 2:
        url = `/otherProduct/gsDetail/${data.id}`
        break
      case 3:
        url = `/otherProduct/csDetail/${data.id}`
        break
      case 4:
        url = `/otherProduct/rzDetail/${data.id}`
        break
      case 5:
        url = `/otherProduct/flDetail/${data.id}`
        break
      case 6:
        url = `/otherProduct/getSoftwareDevDetail/${data.id}`
        break
    }
    return request('get', url)
  },
  // 添加浏览量
  addPageViews: (data) => {
    return request('get', `/otherProduct/addPageView/${data.id}/${data.type}`)
  },
  // 搜索关键词
  appletSearch: (data) => {
    return request('post', '/product/spu/pageGlobalSpu', data)
  },
  // 获取首页项目申报数据
  getProjectList: (data) => {
    return request('get', '/policy/index/list', data, true)
  },
  // 获取首页知识产权数据
  getPropertyList: (data) => {
    return request('get', '/property/getListPage', data)
  },
  // 获取重构后的分类栏列表数据
  getNewClassify: (data) => {
    return request('post', '/product/category/tree', data)
  },
  // 获取重构后的产品列表数据
  getNewProduct: (data) => {
    return request('post', '/product/spu/pageGlobalSpu', data)
  },
  // 获取重构后的产品属性数据
  getAttributeList: (data) => {
    return request('post', '/product/attribute/listAttribute', data)
  },
  // 获取重构后的项目申报属性数据
  getProjectAttribute: (data) => {
    return request('get', '/area/selection/4', data)
  },
  // 获取热搜词
  getHotWords: (data) => {
    return request('get', `/appletHotSearch/${data}`)
  },
  // 全局搜索
  globalSearch: (data) => {
    return request('post', '/esSearch/miniSearchGlobal', data)
  },
  // 获取课程、视频列表
  getAllCourseList: (data) => {
    return request('post', '/esSearch/pageClassAndShortVideo', data)
  },
  // 获取课程列表
  getCourseList: (data) => {
    return request('post', '/esSearch/pageClassVideo', data)
  },
  // 获取视频列表
  getVideoList: (data) => {
    return request('post', '/esSearch/pageShortVideo', data)
  },
  pageWeightSpu: (data) => {
    return request('post', '/product/spu/pageWeightSpu', data)
  },
  pageInfo: (data) => {
    return request('post', '/product/spu/pageInfo', data)
  },
}