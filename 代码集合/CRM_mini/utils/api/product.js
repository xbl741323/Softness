import {
  request
} from "../common/request.js"

module.exports = {
  // 获取产品列表数据
  getNewProduct: (data) => {
    return request('post', '/wtprod/spu/pageInfo', data)
  },
  // 获取项目申报属性数据
  getProjectAttribute: (data) => {
    return request('get', '/wtcrm/factor/selection?type=4', data)
  },
  // 获取产品属性数据
  getAttributeList: (data) => {
    return request('post', '/wtprod/attribute/listAttribute', data)
  },
  // 获取产品类型下拉框
  getProType: (data) => {
    return request('post', '/wtprod/category/tree', data)
  },
  // 获取产品列表（用于选择产品页）
  getProList: (data) => {
    return request('post', '/wtprod/spu/pageSimpleSpu', data)
  },
  // 查询产品交易信息
  getTradeInfo: (data) => {
    return request('get', '/wtprod/spu/getTradeInfo', data)
  },
  // 查询产品基本信息
  getDetailInfo: (data) => {
    return request('get', '/wtprod/spu/getDetailInfo', data)
  },
  // 查询产品详情信息
  getDetail: (data) => {
    return request('get', '/wtprod/spu/getBaseInfo', data)
  },
  // 获取省市区
  getNewArea: () => {
    return request('get', '/wtcrm/tcRegion/tree')
  }
}