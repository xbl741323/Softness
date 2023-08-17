import {
  request
} from "../common/request.js"

module.exports = {
  // 获取列表
  getInfoList(params) {
    return request('get', `/prod/pageProdByKey`, params)
  },

  // 获取详情
  getInfo: (id) => {
    return request('get', `/prod/getProd/${id}`)
  },
}