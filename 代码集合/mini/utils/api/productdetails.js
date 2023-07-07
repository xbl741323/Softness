import {
  request
} from "../common/request.js"

module.exports = {
  //产品详情
  getProductInfo: (data) => {
    return request('get', '/product/spu/getInfo', data)
  },
  //浏览量
  getView: (data) => {
    return request('get', '/product/view/spu', data)
  },
  //添加收藏
  addcollect: (data) => {
    return request('post', '/product/collect/add', data)
  },
  //取消收藏
  cancelcollect: (data) => {
    return request('delete', '/product/collect/delBatch', data)
  },
  //是否收藏
  isCollected: (data) => {
    return request('post', '/product/collect/isCollected', data)
  }
}