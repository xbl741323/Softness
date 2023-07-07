import {
  request
} from "../common/request.js"

module.exports = {
  getMyLogList(params) {
    return request(
      "get", '/wtcrm/journal/pageList', params
    )
  },
  editLog(data) {
    return request('put', '/wtcrm/journal/edit', data)
  },
  addLog(params) {
    return request('post', '/wtcrm/journal/add', params)
  },
  getStateList(params) {
    return request('get', '/wtcrm/journal/listState/?time='+ params,)
  },
  getLogInfoData(params) {
    return request('post', '/wtcrm/journal/getInfo', params)
  }
}