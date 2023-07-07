import {
  request
} from "../common/request.js"

module.exports = {
  // 获取用户列表数据
  getMyUser: (data, type) => {
    let url = type == 2 ? '/wtuims/tmuser/myListAutCompanyUser' : type == 1 ? '/wtuims/tmuser/myListAutPersonUser' : type == 0 ? '/wtuims/tmuser/myListNotAutUser' : ''
    return request('post', `${url}`, data)
  },
  // 获取地区
  getArea: () => {
    return request('get', `/wtcrm/area/tree`)
  },
  // 跟进
  followOperate(data) {
    return request('post', `/wtuims/tmuserfollow/add`, data)
  },
  // 用户详情
  getUserDetail(data, type) {
    let url = type == 2 ? '/wtuims/tmuser/getMyCompanydetail' : type == 1 ? '/wtuims/tmuser/getMyPersonDetail' : type == 0 ? '/wtuims/tmuser/getMyNotAutUserDetail' : ''
    return request('get', `${url}?userId=${data}`)
  },
  // 编辑备注
  editRemark(data) {
    return request('put', `/wtuims/tmuser/editRemark`, data)
  },
  // 我的用户注册信息
  getMyRegister(data, type) {
    let url = type == 2 ? '/wtuims/tmuser/getMyRegCompanyUser' : type == 1 ? '/wtuims/tmuser/getMyRegPersonUser' : type == 0 ? '/wtuims/tmuser/getMyNotAutRegUser' : ''
    return request('get', `${url}/${data}`)
  },
  // 用户下载
  getUserDownload(data) {
    return request('get', `/wtuims/tmDownLoadFile/pageByUserId`, data)
  },
  // 用户收藏
  getUserFollow(data) {
    return request('post', `/wtprod/collect/page`, data)
  },
  // 用户跟进
  getUserFollowUp(data) {
    return request('get', `/wtuims/tmuserfollow/list`, data)
  },
  // 用户编辑
  getUserEdit(data) {
    return request('post', `/admin/opLog/page`, data)
  },
  // 获取客服列表
  getAllCustomer() {
    return request('get', `/wtcrm/cycli/getAllCustomer`)
  },
  // 分配客服
  userAllocationBatch(data) {
    return request('post', `/wtuims/tmuser/userAllocationBatch`, data)
  },
  // 用户跟进编辑
  userFollowEdit(data) {
    return request('put', `/wtuims/tmuserfollow/edit`, data)
  },
  // 用户禁用启用
  accountDisabled(data) {
    return request('put', `/wtuims/tmuser/accountDisabled`, data)
  }
}