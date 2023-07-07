import {
  fixRequest
} from "../common/fixRequest.js"
module.exports = {
  // 员工推广码解码
  checkEmpCode: (data) => {
    return fixRequest('get', '/appletTmUser/getInviteUserIdByCode', data)
  },
}