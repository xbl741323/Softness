import {
  request
} from "../common/request.js"

module.exports = {
  // 公海类型 highSeasType 2-集团公海 highSeasType 1-地区公海
  getseasList(param, contractType, highSeasType) {
    if (highSeasType == 2) {
      if (contractType == 1) { // 个人
        return request('post', '/wtcrm/seasPerson/pageGroupSeas', param)
      } else { // 单位
        return request('post', '/wtcrm/seasCompany/pageGroupSeas', param)
      }
    } else {
      if (contractType == 1) { // 个人
        return request('post', '/wtcrm/seasPerson/pageSectorSeas', param)
      } else { // 单位
        return request('post', '/wtcrm/seasCompany/pageSectorSeas', param)
      }
    }
  },

  // 公海详情
  getSeasClueDetail(id, contractType, highSeasType) {
    if (highSeasType == 2) { // 集团
      if (contractType == 1) { // 个人
        return request('get', `/wtcrm/seasPerson/getGroupSeas?cluePersonId=${id}`)
      } else { // 单位
        return request('get', `/wtcrm/seasCompany/getGroupSeas?clueCompanyId=${id}`)
      }
    } else { //  地区公海详情
      if (contractType == 1) { // 个人
        return request('get', `/wtcrm/seasPerson/getSectorSeas?cluePersonId=${id}`)
      } else { // 单位
        return request('get', `/wtcrm/seasCompany/getSectorSeas?clueCompanyId=${id}`)
      }
    }
  },

  // 订单记录
  getRetorderRecord(id, contractType) {
    if (contractType == 1) { // 个人
      return request('get', `/wtcrm/seasPerson/getCluePerson?cluePersonId=${id}`)
    } else { // 单位
      return request('get', `/wtcrm/seasCompany/getClueCompany?clueCompanyId=${id}`)
    }
  },

  // 集团公海单位
  getGroupUnit(id, contractType) {
    if (contractType == 1) { // 个人
      return request('get', `/wtcrm/seasPerson/getCluePerson?cluePersonId=${id}`)
    } else { // 单位
      return request('get', `/wtcrm/seasCompany/getClueCompany?clueCompanyId=${id}`)
    }
  },

  getParticulars(param) {
    return request('post', '/wtorder/tmOrder/page', param)
  },

  // 公海客户跟进
  getFollowUp(param, highSeasType) {
    let url = highSeasType == 2 ? 'listClueFollowByUserId' : 'listClueFollowByClueId'
    return request('post', `/wtcrm/clueFollow/${url}`, param)
  },

  // 获取头像
  getUserImg(id) {
    return request('get', `/admin/user/getUserAvatarByUserId?userId=${id}`)
  },

  getClueRecords(obj, clueType) { //成交客户详情-线索记录
    if (clueType == 2) {
      return request('get', '/wtcrm/transactionCompany/listBindCompanyClue', obj)
    } else {
      return request('get', '/wtcrm/transactionPerson/listBindPersonClue', obj)
    }
  }
}