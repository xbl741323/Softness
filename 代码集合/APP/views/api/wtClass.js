import request from '../utils/common/request'

// 卧涛课堂二级首页-短视频列表
export function getSVideoList(params) {
  return request({
    url: '/shortVideo/pageShortVideo',
    method: 'post',
    data: params
  })
};

// 卧涛课堂二级首页-板块列表
export function getPlateList() {
  return request({
    url: '/plate/listAllPlates',
    method: 'get'
  })
};

// 卧涛课堂二级首页-获取对应板块关联课程数据
export function getPlateRelateClass(params) {
  return request({
    url: '/plateClass/pageClassByPlate',
    method: 'post',
    data: params
  })
};

// 卧涛课堂二级首页-课程-完全免费-vip免费-单独收费
export function getClassList(params) {
  return request({
    url: '/class/page',
    method: 'post',
    data: params
  })
};

// 卧涛课堂-课程详情
export function getClassDetail(params) {
  return request({
    url: '/info/get',
    method: 'post',
    data: params
  })
};

// 卧涛课堂-课程详情-课程目录树结构
export function getClassTree(params) {
  return request({
    url: '/section/getClassSectionTree',
    method: 'post',
    data: params
  })
};

// 卧涛课堂详情-添加收藏
export function addClass(params) {
  return request({
    url: '/classCollect/addClassCollect',
    method: 'post',
    data: params
  })
};

// 卧涛课堂详情-取消收藏
export function cancelClass(params) {
  return request({
    url: '/classCollect/cancelClassCollect',
    method: 'post',
    data: params
  })
};

// 卧涛课堂详情-收藏状态
export function getCollectStatus(params) {
  return request({
    url: '/classCollect/isCollected',
    method: 'post',
    data: params
  })
};

// 卧涛课堂-获取短视频url-formdata
export function getShortVideoUrl(params) {
  return request({
    url: '/classVideo/getPlayInfo',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
};

// 卧涛课堂-获取视频url-formdata
export function getVideoUrl(params) {
  return request({
    url: '/classVideo/getCourseVideoPlayInfo',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
};

// 卧涛课堂-获取课程章节信息
export function getChapterInfo(params) {
  return request({
    url: '/classVideo/getVideoInfoById',
    method: 'post',
    data: params
  })
};

// 个人中心课堂学习
export function pageStudyCourse(params) {
  return request({
    url: '/class/pageStudyCourse',
    method: 'post',
    data: params
  })
};

// 免费课程报名
export function freeCourseStudy(params) {
  return request({
    url: '/courseStudy/signUp',
    method: 'post',
    data: params
  })
};

// 记录课堂学习进度
export function recordStudyProgress(params) {
  return request({
    url: '/courseStudy/recordStudyProgress',
    method: 'post',
    data: params
  })
};

// 获取课堂学习浏览记录
export function getBrowseRecords(params) {
  return request({
    url: '/courseBrowse/pageBrowseHistory',
    method: 'post',
    data: params
  })
};

// 添加播放记录
export function addPlayNum(params) {
  return request({
    url: '/courseStatistics/increasePlayNumber/' + params.courseId,
    method: 'put'
  })
};

// 添加浏览记录
export function addBrowseNum(params) {
  return request({
    url: '/courseBrowse/record',
    method: 'post',
    data: params
  })
};
