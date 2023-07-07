import {
  request
} from "../common/request.js"

module.exports = {
  // 见面拜访专用跟进接口
  addMeetVisit: (params) => {
    return request('put', '/wtcrm/tmClueMeetVisit/save', params)
  },
  // 见面拜访查询获取客户列表
  getVisitClue: (params) => {
    return request('get', '/wtcrm/tmClueMeetVisit/getClueByName', params)
  },
}