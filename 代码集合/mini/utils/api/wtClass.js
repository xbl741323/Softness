import {
  request
} from "../common/request.js"

module.exports = {
  // 卧涛课堂二级首页-短视频列表
  getSVideoList: (data) => {
    return request('post', '/shortVideo/pageShortVideo', data)
  },
  // 卧涛课堂二级首页-短视频列表-不登录状态
  getSVideoNonLogin: (data) => {
    return request('post', '/shortVideo/pageShortVideo/nonLogin', data)
  },
  // 卧涛课堂二级首页-板块列表
  getPlateList: () => {
    return request('get', '/plate/listAllPlates')
  },
  // 卧涛课堂二级首页-获取对应板块关联课程数据
  getPlateRelateClass: (data) => {
    return request('post', '/plateClass/pageClassByPlate', data)
  },
  // 卧涛课堂二级首页-课程-完全免费-vip免费-单独收费
  getClassList: (data) => {
    return request('post', '/class/page', data)
  },
  // 不登录状态
  getClassNonLogin: (data) => {
    return request('post', '/class/page/nonLogin', data)
  },
  // 卧涛课堂-课程详情
  getClassDetail: (data) => {
    return request('post', '/info/get', data)
  },
  // 卧涛课堂-课程详情-课程目录树结构
  getClassTree: (data) => {
    return request('post', '/section/getClassSectionTree', data)
  },
  // 卧涛课堂详情-添加收藏
  addClass: (data) => {
    return request('post', '/classCollect/addClassCollect', data)
  },
  // 卧涛课堂详情-取消收藏
  cancelClass: (data) => {
    return request('post', '/classCollect/cancelClassCollect', data)
  },
  // 卧涛课堂详情-收藏状态
  getCollectStatus: (data) => {
    return request('post', '/classCollect/isCollected', data)
  },
  // 卧涛课堂-获取短视频url
  getShortVideoUrl: (data) => {
    return request('post', '/classVideo/getPlayInfo', data, true)
  },
  // 卧涛课堂-获取视频url
  getVideoUrl: (data) => {
    return request('post', '/classVideo/getCourseVideoPlayInfo', data, true)
  },
  // 卧涛课堂-获取课程章节信息
  getChapterInfo: (data) => {
    return request('post', '/classVideo/getVideoInfoById', data)
  },
  // 个人中心课堂学习
  pageStudyCourse: (data) => {
    return request('post', '/class/pageStudyCourse', data)
  },
  // 免费课程报名
  freeCourseStudy: (data) => {
    return request('post', '/courseStudy/signUp', data)
  },
  // 记录课堂学习进度
  recordStudyProgress: (data) => {
    return request('post', '/courseStudy/recordStudyProgress', data)
  },
  // 获取课堂学习浏览记录
  getBrowseRecords: (data) => {
    return request('post', '/courseBrowse/pageBrowseHistory', data)
  },
  // 添加播放记录
  addPlayNum: (data) => {
    return request('put', '/courseStatistics/increasePlayNumber/' + data.courseId)
  },
  // 添加浏览记录
  addBrowseNum: (data) => {
    return request('post', '/courseBrowse/record', data)
  }

}