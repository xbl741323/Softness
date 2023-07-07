import {
  request
} from "../common/request.js"

module.exports = {
  // 板块
  getPlateList: (data) => {
    return request('get', `/wttalk/plate/pagePlate?pageNo=${data.pageNo}&pageSize=${data.pageSize}`, data)
  },
  // 根据板块Id获取课程列表
  getPlateClass: (data) => {
    return request('get', `/wttalk/plateClass/pageClassByPlate?plateId=${data.plateId}&pageNo=${data.pageNo}&pageSize=${data.pageSize}`, data)
  },
  // 课程专业分类列表
  getOptionList: (data) => {
    return request('get', '/wtprod/category/list', data)
  },
  // 课程列表
  getClassList: (data) => {
    return request('post', '/wttalk/info/page', data)
  },
  // 课程详情
  getClassDetail: (data) => {
    return request('get', '/wttalk/info/get', data)
  },
  //课程目录树结构
  getClassTree: (data) => {
    return request('get', '/wttalk/section/tree', data)
  },
  // 课程章节信息
  getChapterInfo: (data) => {
    return request('get', '/wttalk/section/get', data)
  },
  // 获取视频url
  getVideoUrl: (data) => {
    return request('post', '/wtcrm/vod/getPlayInfo', data, true)
  },
  // 获取微信邀请码
  getWxInviteCode() {
    return request('get', '/admin/user/getInviteCode')
  }
}