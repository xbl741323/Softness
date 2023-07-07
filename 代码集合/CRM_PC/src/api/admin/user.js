/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import request from '@/router/axios'
import qs from 'qs'

// 获取用户收藏列表
export function getUserFollow(params) {
  return request({
    url: '/wtprod/collect/page',
    method: 'post',
    data: params
  })
}

// 获取用户跟进列表
export function getFollowList(params) {
  return request({
    url: '/wtuims/tmuserfollow/list',
    method: 'get',
    params: params
  })
}

// 获取用户编辑列表
export function getUserEdit(params) {
  return request({
    url: '/admin/opLog/page',
    method: 'post',
    data: params
  })
}

// 用户跟进编辑
export function getEditList(params) {
  return request({
    url: '/wtuims/tmuserfollow/edit',
    method: 'put',
    data: params
  })
}

// 获取用户关注列表
export function getDownloadList(params) {
  return request({
    url: '/wtuims/tmDownLoadFile/pageByUserId',
    method: 'get',
    params: params
  })
}

// 获取我的产品订单列表--无数据权限
export function getMyProductOrder(params) {
  return request({
    url: '/wtorder/tmOrder/pageOrderByUserId',
    method: 'post',
    data: params
  })
}
import { filterPort }  from "../../util/filtration_permission";
// 获取产品订单列表
export function getProductList(params,str) {
  return request({
    url: filterPort(1,str,'/wtorder/tmOrder/page',-4) ,
    method: 'post',
    data: params
  })
  // return request({
  //   url: '/wtorder/tmOrder/page',
  //   method: 'post',
  //   data: params
  // })
}

// 线索详情-查询订单记录
export function getClueProduct(params) {
  return request({
    url: '/wtorder/tmOrder/page',
    method: 'post',
    data: params
  })
}

// 查询客户-查询订单
export function getProductListByClue(params) {
  return request({
    url: '/wtorder/tmOrder/pageOrderByClueIdGlobal',
    method: 'post',
    data: params
  })
}
export function getOptionList() {
  return request({
    url: '/admin/tmPartner/option',
    method: 'get',
  })
}
// 获取我的产品订单列表
export function getMyProductList(params) {
  return request({
    url: '/wtorder/tmOrder/pageMyOrder',
    method: 'post',
    data: params
  })
}

// 获取我的产品订单统计数据
export function getMyStatusCount(params) {
  return request({
    url: '/wtorder/tmOrder/statisticsMyOrderNum',
    method: 'post',
    data: params
  })
}

// 获取订单状态数目
export function getStatusCount(params) {
  return request({
    url: '/wtorder/tmOrder/statisticsOrderNum',
    method: 'post',
    data: params
  })
}

export function fetchList(query) {
  return request({
    url: '/admin/user/page',
    method: 'get',
    params: query
  })
}

export function changeUserStatus(para) {
  return request({
    url: '/wtcrm/account/updateStatus',
    method: 'post',
    params: para
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function getDropdownData(type) {
  return request({
    url: '/wtcrm/drop/' + type,
    method: 'get'
  })
}

export function getAccountDetail(id) {
  return request({
    url: '/wtcrm/account/detailB/' + id,
    method: 'get'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: obj
  })
}

export function getDetails(obj) {
  return request({
    url: '/admin/user/details/' + obj,
    method: 'get'
  })
}

// 更改个人信息
export function editInfo(obj) {
  return request({
    url: '/admin/user/edit',
    method: 'put',
    data: obj
  })
}

// 后台添加员工用户信息
export function addEmp(params) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: params
  })
}

// 后台编辑员工用户信息
export function editEmp(params) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: params
  })
}

// 获取验证码
export function getMessage(phone) {
  return request({
    url: 'wtcrm/smsCode/send/' + phone,
    method: "get"
  })
}

// 校验验证码
export function checkMessage(params) {
  return request({
    url: 'wtcrm/smsCode/checkCode/' + params.phone + '/' + params.code,
    method: 'get'
  })
}

export function getUserDetail(username) {
  return request({
    url: '/admin/user/details/' + username,
    method: 'get'
  })
}

//获取用员工列表
export function getEmpList() {
  return request({
    url: 'wtcrm/emp/list',
    method: 'get'
  })
}

//修改员工密码-新
export function setEmpPwd(params) {
  return request({
    url: 'admin/user/edit',
    method: 'PUT',
    data: params
  })
}

//获取用员工详情
export function getEmpDetail(name) {
  return request({
    url: 'wtcrm/personal/emp/allInfo/' + name,
    method: 'get'
  })
}

//编辑员工手机号（换新手机号）
export function changePhone(params) {
  return request({
    url: 'wtcrm/emp/phone',
    method: 'put',
    data: params
  })
}


export function getEmpLog(params) {
  return request({
    url: 'admin/log/page?descs=create_time' + '&current=' + params.currentPage + '&size=' + params.pageSize + "&token=login" + '&createBy=' + params.username,
    method: 'get'
  })
}

//获取员工操作记录
export function getEmpOperate(params) {
  return request({
    url: 'wtcrm/opLog/info',
    method: 'post',
    data: params
  })
}

export function getInfoByUsername(params) {
  return request({
    url: 'wtcrm/opLog/infoByUsername',
    method: 'post',
    data: params
  })
}

export function changeEmpStatus(params) {
  return request({
    url: 'wtcrm/emp/status',
    method: 'put',
    data: params
  })
}

export function getHistory(number) {
  return request({
    url: 'wtcrm/emp/history?userNumber=' + number,
    method: 'get'
  })
}

export function getUserList(params) {
  return request({
    url: 'wtcrm/account/pageList',
    method: 'get',
    params: params
  })
}

export function getLogList(params) {
  return request({
    url: 'wtcrm/account/log/page',
    method: 'get',
    params: params
  })
}

export function getDropdownAccountType(type) {
  return request({
    url: '/wtcrm/drop/account/' + type,
    method: 'get'
  })
}

export function getEmployRole(roleId) {
  return request({
    url: '/admin/role/showPerms?roleId=' + roleId,
    method: 'get'
  })
}

//活动记录列表接口
export function getActList(params) {
  return request({
    url: '/wtcrm/wtclueaccountacitvity/page',
    method: 'get',
    params: params
  })
}


export function getDeptService() {
  return request({
    url: '/admin/user/allByDept',
    method: 'get'
  })
}

export function batchAllotService(params) {
  return request({
    url: '/wtcrm/account/batchAllot',
    method: 'post',
    data: params
  })
}

export function downFile(params) {
  return request({
    url: '/wtcrm/wtcluefile/download?url=' + params.url + "&filename=" + params.filename,
    method: 'get',
    responseType: "blob"
  })
}

export function getNewEmpDetail() {
  return request({
    url: '/admin/user',
    method: 'get'
  })
}

export function getStaffEmpDetail(params) {
  return request({
    url: '/admin/user/' + params.id,
    method: 'get'
  })
}

//员工禁用
export function setEmpStatus(params) {
  return request({
    url: '/admin/user/disableEmp',
    method: 'put',
    data: params
  })
}

//判断是否可以禁用
export function getTaskPending(id) {
  return request({
    url: '/wtcrm/user/getTaskPending?id=' + id,
    method: 'get',
  })
}

//员工启用
export function newsetEmpStatus(params) {
  return request({
    url: '/admin/user/enableEmp',
    method: 'put',
    data: params
  })
}

//获取登录用户信息
export function getLoginInfo() {
  return request({
    url: '/admin/user/login/detail',
    method: 'get'
  })
}

//获取二维码
export function getWx(params) {
  return request({
    url: '/wtcrm/msg/wx/qrcode',
    method: 'get',
    params: params
  })
}

//昵称查重
export function checkNickname(name) {
  return request({
    url: '/admin/user/check/nickname?nickname=' + name,
    method: 'get'
  })
}

//修改昵称
export function setNickname(params) {
  return request({
    url: '/admin/user/edit/nickname',
    method: 'put',
    data: params
  })
}

//修改任务用户补充信息
export function updateUserInfo(params) {
  return request({
    url: '/wtcrm/account/updateMyTaskAccountInfo',
    method: 'post',
    data: params
  })
}

//修改用户详情补充信息
export function updateUserData(params) {
  return request({
    url: '/wtcrm/account/updateAccount',
    method: 'post',
    data: params
  })
}

//获取用户详情操作记录
export function getUserOperateRecords(params) {
  return request({
    url: '/wtcrm/account/getAccountEditRecord',
    method: 'post',
    params: params
  })
}

//用户详情订单记录
export function getUserOrder(params){
  return request({
    url: '/wtcrm/wtorder/page',
    method: 'get',
    params: params
  })
}

//订单管理数据统计
export function getOrderCount(params){
  return request({
    url: '/wtcrm/wtorder/statistical',
    method: 'post',
    data: params
  })
}

export function repeatDeptList(){//查重部门列表
  return request({
    url: '/admin/sysbusinessgroup/list',
    method: 'get',
  })
}

//获取微信二维码链接
export function getWxUrl(data){
  return request({
    url: '/admin/sysUserWx/getWxAuthorizeUrl',
    method: 'get',
    params: data
  })
}

//微信登录判断是否绑定
export function judgeIsBind(state,code){
  const grant_type = 'mobile'
  return request({
    url: '/auth/mobile/token/social',
    method: 'post',
    headers:{
      "Content-Type": "application/x-www-form-urlencoded",
      isToken: false,
      'TENANT-ID': '1',
      'Authorization': 'Basic Y3JtLXBjOmNybS1wYw==',
    },
    params: {mobile:state + '@' + code, grant_type}
  })
}

//微信绑定
export function wxBind(data){
  return request({
    url: '/admin/sysUserWx/wxBind',
    method: 'post',
    data: data
  })
}

//员工工号密码校验
export function verifyNum(data){
  return request({
    url: '/admin/sysUserWx/numPwdVer',
    method: 'post',
    data: data
  })
}

// 获取短信验证码
export function getCode(mobile){
  return request({
    url: '/admin/mobile/sms/'+mobile,
    method: 'get',
  })
}

//手机号短信验证码校验
export function mobileVer(data){
  return request({
    url: '/admin/sysUserWx/mobileVer',
    method: 'post',
    data: data
  })
}

// 微信换绑
export function changeWxBind(data){
  return request({
    url: '/admin/sysUserWx/changeWxBind',
    method: 'post',
    data: data
  })
}

// 个人中心-账户设置-微信绑定
export function myWxBind(data){
  return request({
    url: '/admin/sysUserWx/myWxBind',
    method: 'post',
    data: data
  })
}

// 个人中心-账户设置-微信解绑
export function myWxUnBind(){
  return request({
    url: '/admin/sysUserWx/myWxUnBind',
    method: 'put',
  })
}

// 职位职级关联tree
export function listPositionTree(deptId){
  return request({
    url: '/admin/tmPosition/listPositionTree?deptId='+deptId,
    method: 'get',
  })
}

// 工作台我的产品订单列表
export function getMyProductListGlobal(params) {
  return request({
    url: '/wtorder/tmOrder/pageOrderGlobal',
    method: 'post',
    data: params
  })
}

// 工作台服务产品推广链接
export function getMySpuLinkList(params) {
  return request({
    url: '/wtprod/spu/pagePromote',
    method: 'get',
    data: params
  })
}

// 工作台卧涛课堂推广链接
export function getMyClassLinkList(params) {
  return request({
    url: '/wttalk/info/pagePromote',
    method: 'get',
    data: params
  })
}


// 工作台行业资讯推广链接
export function getMyIndustryLinkList(params) {
  return request({
    url: '/wtcrm/industry/pagePromote',
    method: 'get',
    data: params
  })
}

// 工作台通知公告推广链接
export function getMyNoticeLinkList(params) {
  return request({
    url: '/wtcrm/notice/pagePromote',
    method: 'get',
    data: params
  })
}

// 工作台文件管理推广链接
export function getMyDocLinkList(params) {
  return request({
    url: '/wtcrm/doc/pagePromote',
    method: 'get',
    data: params
  })
}
