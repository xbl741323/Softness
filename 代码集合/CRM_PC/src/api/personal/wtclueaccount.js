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

export function getPersonalClues(obj,isPerson) {//获取个人线索
  let url = isPerson == true?`cluePerson/pageCluePersonOfMy`:`cluePerson/pageCluePerson`
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
    data: obj
  })
}

export function getUnitClues(obj,isPerson) {//获取单位线索
  let url = isPerson == true?`clueCompany/pageClueCompanyOfMy`:`clueCompany/pageClueCompany`
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
    data: obj
  })
}

export function fetchList(query) {//会员中心线索列表
  return request({
    url: '/wtcrm/personal/clueaccount/myPage',
    method: 'get',
    params: query
  })
}

export function clueList(query) {//客服管理线索列表
  return request({
    url: '/wtcrm/wtclueaccount/page',
    method: 'get',
    params: query
  })
}
export function clueOptionList(query) {//客服管理线索列表
  return request({
    url: '/wtcrm/wtclueaccount/option/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/wtcrm/wtclueaccount',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/wtcrm/wtclueaccount/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/wtcrm/wtclueaccount/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/wtcrm/wtclueaccount',
    method: 'put',
    data: obj
  })
}

export function getHomeClient(query) {//客服管理线索列表
  return request({
    url: '/wtcrm/wtclueaccount/fastSelect',
    method: 'get',
    params: query
  })
}

export function allClues(obj) {//获取所有线索
  return request({
    url: '/wtcrm/wtclueaccount/all',
    method: 'get',
    params: obj
  })
}

export function checkCreditCode(obj) {//检查信用代码
  return request({
    url: '/wtcrm/personal/clueaccount/check/'+obj.orgName+'/'+obj.creditCode+'/'+obj.clueNo,
    method: 'post',
  })
}
