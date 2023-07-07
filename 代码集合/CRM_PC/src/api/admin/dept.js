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

export function fetchTree(query) {
  return request({
    url: '/admin/dept/tree',
    method: 'get',
    params: query
  })
}

export function ccFetchTree(query) {
  return request({
    url: '/admin/sysbusinessgroup/list',
    method: 'get',
    params: query
  })
}

export function fetchNewTree(query) {
  return request({
    url: '/admin/dept/tree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/dept/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/dept/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/dept/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/dept/',
    method: 'put',
    data: obj
  })
}

export function getDeptList() {
  return request({
    url: '/wtcrm/dept/list',
    method: 'get'
  })
}

export function getCenterList() {
  return request({
    url: '/wtcrm/dept/oneDept',
    method: 'get'
  })
}

export function getEmployees() {
  return request({
    url: '/wtcrm/emp/allEmp',
    method: 'get'
  })
}

export function editDeptData(data) {
  return request({
    url: '/wtcrm/dept/edit',
    method: 'put',
    data:data
  })
}

export function addDeptData(data) {
  return request({
    url: '/wtcrm/dept/add',
    method: 'post',
    data:data
  })
}

export function getEmpList() {
  return request({
    url: '/admin/user/allByDept',
    method: 'get',
  })
}

//新增岗位
export function addPost(data) {
  return request({
    url: '/admin/tmStation/add',
    method: 'post',
    data:data
  })
}

//删除岗位
export function deletePost(data) {
  return request({
    url: '/admin/tmStation/deleteById',
    method: 'delete',
    params:data
  })
}

//编辑岗位
export function editPost(data) {
  return request({
    url: '/admin/tmStation/edit',
    method: 'put',
    data:data
  })
}

//岗位列表
export function getPostList() {
  return request({
    url: '/admin/tmStation/list',
    method: 'get',
  })
}

//岗位使用人数 分页
export function getPostUserCount(data) {
  return request({
    url: '/admin/tmStation/pageRelatedSysUserCount',
    method: 'get',
    params: data
  })
}

//新增/编辑员工-岗位管理搜索列表
export function getStationList(data) {
  return request({
    url: '/admin/tmStation/listSearch',
    method: 'get',
    params: data
  })
}