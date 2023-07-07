import request from '@/router/axios'

/**
 * 视频库相关接口
 */

// 视频库添加视频
export function addVideo(params) {
  return request({
    url: '/wttalk/video/add',
    method: 'post',
    data: params
  })
}

// 视频库编辑视频
export function editVideo(params) {
  return request({
    url: '/wttalk/video/mod',
    method: 'put',
    data: params
  })
}

// 视频库删除视频
export function deleteVideo(params) {
  return request({
    url: '/wttalk/video/del?id=' + params.id,
    method: 'delete',
  })
}

// 视频库视频列表
export function getVideoList(params) {
  return request({
    url: '/wttalk/video/page',
    method: 'get',
    params: params
  })
}

// 视频库关联课程章节
export function getRelateClass(params) {
  return request({
    url: '/wttalk/video/listClassByVideoId',
    method: 'get',
    params: params
  })
}


/**
 * 卧涛课堂相关接口
 */

// 添加课程
export function addClass(params) {
  return request({
    url: '/wttalk/info/add',
    method: 'post',
    data: params
  })
}

// 编辑课程
export function editClass(params) {
  return request({
    url: '/wttalk/info/mod',
    method: 'post',
    data: params
  })
}

// 课程详情页
export function getClassDetail(params) {
  return request({
    url: '/wttalk/info/get',
    method: 'get',
    params: params
  })
}

// 课程列表
export function getClassList(params, senior) {
  return request({
    url: '/wttalk/info/page',
    method: 'post',
    data: params
  })
}

// 列表-批量删除
export function batchDelClass(params) {
  let str = ''
  params.classIds.forEach((item, index) => {
    if (index == 0) {
      str = str + 'classIds=' + item
    } else {
      str = str + '&classIds=' + item
    }
  })
  console.log(str, "rtr")
  return request({
    url: '/wttalk/info/delBatch?' + str,
    method: 'delete'
  })
}

// 列表-批量修改显示状态
export function batchModStatus(params) {
  let str = 'state=' + params.state
  params.classIds.forEach((item) => {
    str = str + '&classIds=' + item
  })
  console.log(params, "d")
  return request({
    url: '/wttalk/info/modBatchShowState?' + str,
    method: 'put'
  })
}

// 产品分类下拉框列表
export function getOptionList() {
  return request({
    url: '/wtprod/category/tree',
    method: 'post',
    data:{
      parentId:0
    }
  })
}

//获取板块信息
export function listAllPlates() {
  return request({
    url: '/wttalk/plate/listAllPlates',
    method: 'get',
  })
}

// 关联产品列表
export function getProductList(params) {
  return request({
    url: '/wtprod/product/pageByCategoryId',
    method: 'get',
    params: params
  })
}

// 关联产品列表（重构完成）
export function getRelatedProducts(params) {
  return request({
    url: '/wtprod/spu/pageSimpleSpu',
    method: 'post',
    data: params
  })
}

// 卧涛课堂操作日志
export function getClassLog(params) {
  return request({
    url: '/wttalk/oplog/page',
    method: 'get',
    params: params
  })
}

/**
 * 课程章节
 */
// 添加课程章节
export function addChapter(params) {
  return request({
    url: '/wttalk/section/add',
    method: 'post',
    data: params
  })
}

// 修改课程章节
export function editChapter(params) {
  return request({
    url: '/wttalk/section/mod',
    method: 'put',
    data: params
  })
}

// 删除课程章节
export function deleteChapter(params) {
  return request({
    url: '/wttalk/section/del?id=' + params.id + '&classId=' + params.classId,
    method: 'delete'
  })
}

// 获取课程章节信息
export function getChapterInfo(params) {
  return request({
    url: '/wttalk/section/get',
    method: 'get',
    params: params
  })
}

// 获取课程章节树数据
export function getChapterTree(params) {
  return request({
    url: '/wttalk/section/tree',
    method: 'get',
    params: params
  })
}

// 删除课程章节视频
export function delChapterVideo(params) {
  return request({
    url: '/wttalk/section/delSectionVideoRel?id=' + params.id + '&classId=' + params.classId,
    method: 'delete'
  })
}

/**
 * 短视频接口合集
 */
// 获取短视频列表
export function getSVideoList(params) {
  return request({
    url: '/wttalk/shortVideo/pageShortVideo',
    method: 'get',
    params: params
  })
}

// 添加短视频
export function addSVideo(params) {
  return request({
    url: '/wttalk/shortVideo/saveShortVideo',
    method: 'post',
    data: params
  })
}

// 编辑短视频
export function updateSVideo(params) {
  return request({
    url: '/wttalk/shortVideo/updateShortVideo',
    method: 'put',
    data: params
  })
}

// 删除短视频
export function deleteSVideo(params) {
  return request({
    url: '/wttalk/shortVideo/deleteShortVideoById?shortVideoId=' + params.id,
    method: 'delete'
  })
}

// 获取员工信息
export function getEmpInfo(userId) {
  return request({
    url: '/wtcrm/user/' + userId,
    method: 'get'
  })
}

/**
 * 会员设置接口合集
 */

// 获取会员设置信息
export function getMemberInfo() {
  return request({
    url: '/wttalk/vipProduct/getVipProductById?id=' + 1,
    method: 'get'
  })
}

// 修改会员设置信息
export function updateMemberInfo(params) {
  return request({
    url: '/wttalk/vipProduct/updateVipProduct',
    method: 'put',
    data: params
  })
}

/**
 * 板块设置接口合集
 */
// 获取板块列表接口
export function getPlateList(params) {
  return request({
    url: '/wttalk/plate/pagePlate',
    method: 'get',
    params: params
  })
}

// 添加板块
export function addPlate(params) {
  return request({
    url: '/wttalk/plate/savePlate',
    method: 'post',
    data: params
  })
}

// 修改板块
export function updatePlate(params) {
  return request({
    url: '/wttalk/plate/updatePlate',
    method: 'put',
    data: params
  })
}

// 删除板块
export function deletePlate(params) {
  return request({
    url: '/wttalk/plate/deletePlate',
    method: 'delete',
    data: params
  })
}

// 关联课程列表
export function getPlateRelate(params) {
  return request({
    url: '/wttalk/plateClass/pageClassByPlate',
    method: 'get',
    params: params
  })
}

// 关联课程-添加关联课程
export function addRelateClass(params) {
  return request({
    url: '/wttalk/plateClass/batchInsert',
    method: 'post',
    data: params
  })
}

// 关联课程-批量取消关联课程
export function batchDelRelateClass(params) {
  return request({
    url: '/wttalk/plateClass/batchDelete',
    method: 'delete',
    data: params
  })
}

// 课堂统计
export function courseStatistics(params) {
  return request({
    url: '/wttalk/courseStatistics/page',
    method: 'post',
    data: params
  })
}

// 删除video视频
export function delVideoFile(videoId) {
  return request({
    url: `/wttalk/video/deleteVideo/${videoId}`,
    method: 'delete'
  })
}






