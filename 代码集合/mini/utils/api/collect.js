import {
  request
} from "../common/request.js"

module.exports = {
  // 添加收藏
  addCollect: (data) => {
    return request('post', '/product/collect/add', data)
  },
  // 批量取消收藏 {spuIds:[this.baseInfo.id],userId:JSON.parse(localStorage.getItem('userInfo')).id}
  batchDelCollect: (data) => {
    return request('delete', '/product/collect/delBatch', data)
  },
  getCollectList: (data) => {
    return request('post', '/product/collect/page', data)
  },
  isCollect: (data) => {
    return request('post', '/product/collect/isCollected', data)
  },
  getCourseList: (data) => {
    return request('post', '/classCollect/pageMyCollectClass', data)
  },
  batchCancelClassCollect: (data) => {
    return request('post', '/classCollect/batchCancelClassCollect', data)
  },
  getInfomationsCollect: (data) => {
    return request('post', '/info/collect/page', data)
  }
}