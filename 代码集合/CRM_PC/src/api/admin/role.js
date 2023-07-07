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

export function roleList() {
  return request({
    url: '/admin/role/roleList',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/admin/role/page',
    method: 'get',
    params: query
  })
}

export function deptRoleList() {
  return request({
    url: '/admin/role/list',
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/role',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/role',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'delete'
  })
}

export function permissionUpd(data) { //根据菜单获取数据权限
  return request({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: '/admin/tmRole/getDataRole',
    method: 'post',
    data
  })
}

export function roleUpdate(param) { //更新角色权限
  return request({
    url: '/admin/tmRole/roleUpdate',
    method: 'put',
    data: param
  })
}
// export function permissionUpd(roleId, menuIds) {
//   return request({
//     url: '/admin/role/menu',
//     method: 'put',
//     data: {
//       roleId: roleId,
//       menuIds: menuIds
//     }
//   })
// }

export function fetchRoleTree(roleId) {
  return request({
    url: '/admin/menu/tree/' + roleId,
    method: 'get'
  })
}

//角色更新接口
//角色用户列表
export function getRoleList(params) {
  return request({
    url: '/admin/role/getUserList',
    method: 'get',
    params: params
  })
}

//添加使用角色员工
export function addRoleEmp(params) {
  return request({
    url: '/admin/role/addUserRole',
    method: 'post',
    data: params
  })
}

//取消使用角色员工
export function delRoleEmp(params) {
  return request({
    url: '/admin/role/delUserRole',
    method: 'post',
    data: params
  })
}

//获取未拥有特定角色的员工
export function getRoleData(params) {
  return request({
    url: '/admin/role/getAllUser',
    method: 'get',
    params: params
  })
}

//获取角色列表新接口
export function getNewRoleList(params) {
  return request({
    url: '/admin/role/vaGuSelectRoleList',
    method: 'get',
    params: params
  })
}

//获取数据权限列表
export function getDataPower(params) {
  return request({
    url: '/admin/roledata/list?roleId=' + params.roleId,
    method: 'get'
  })
}

//添加数据权限
export function addDataPower(params) {
  return request({
    url: '/admin/roledata',
    method: 'post',
    data: params
  })
}

//编辑数据权限
export function editDataPower(params) {
  return request({
    url: '/admin/roledata',
    method: 'put',
    data: params
  })
}

//删除数据权限
export function delDataPower(params) {
  return request({
    url: '/admin/roledata',
    method: 'delete',
    params: params
  })
}

//获取
export function getRoleNameList(params) {
  return request({
    url: '/admin/datamenu/listByRoleId?roleId=' + params.roleId,
    method: 'get'
  })
}
// 获取权限
export function getJurisdiction(id) {
  return request({
    url: '/admin/tmRole/listRoleByRoleId?roleId=' + id,
  })
}
