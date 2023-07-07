import {
  request
} from "../common/request.js"

module.exports = {
  getMyReturnedMoney(param, clueType) {
    // 线上回款
    if (clueType == 2) {
      // personal
      return request('post', '/wtorder/online/receive/pageMyReceive', param)
    } else {
      //  线下回款
      return request('get', '/wtcrm/personal/receive/page', param)
    }
  },
  //  查看图片
  getExamineImg(taskNo) {
    return request('get', `/wtcrm/rebuild/getTrTaskOrderByTaskNo/${taskNo}`)
  },
  // 我的回款
  getMyReceive(param) {
    return request('post', `/wtorder/receive/pageReceiveOfMine`, param)
  },
}