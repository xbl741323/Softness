

import request from '@/plugins/request'

// 提交单位认证
export function submitUnitAuth(params, resetStatus) {
  let url = resetStatus == true ? 'againAddAuthCompany' : 'addAuthCompany'
  return request({
    url: `/pcfddAut/${url}`,
    method: 'post',
    data: params
  })
}
// 后台发起订单-单位授权
export function addCompanyAuthorizer(params) {
  return request({
    url: '/pcfddAut/addCompanyAuthorizer',
    method: 'post',
    data: params
  })
}

// 提交个人认证
export function submitPersonAuth(params, resetStatus) {
  let url = resetStatus == true ? 'againAddAuthPerson' : 'addAuthPerson'
  return request({
    url: `/pcfddAut/${url}`,
    method: 'post',
    data: params
  })
}

// 获取认证状态
export function getAuthStatus() {
  return request({
    url: '/pcfddAut/getAutStatus',
    method: 'get'
  })
}

// 继续认证
export function getAuthUrl() {
  return request({
    url: '/pcfddAut/getAuthUrl',
    method: 'get'
  })
}

// 修改单位信息
export function modCompany(params) {
  return request({
    url: '/pcfddAut/modCompanyAuth',
    method: 'PUT',
    data: params
  })
}


// 修改个人信息
export function modPerson(params) {
  return request({
    url: '/pcfddAut/modPersonAuth',
    method: 'PUT',
    data: params
  })
}

export function essAddAuthPerson(params) {
  return request({
    url: '/pcfddAut/essAddAuthPerson',
    method: 'post',
    data: params
  })
}

export function essAddAuthCompany(params) {
  return request({
    url: '/pcfddAut/essAddAuthCompany',
    method: 'post',
    data: params
  })
}

// 已认证单位更新认证
export function updateCompanyAuth(params) {
  return request({
    url: '/pcfddAut/updateCompanyAuth',
    method: 'post',
    data: params
  })
}

// 已认证个人更新认证
export function updatePersonAuth(params) {
  return request({
    url: '/pcfddAut/updatePersonAuth',
    method: 'post',
    data: params
  })
}

// 已认证单位重新更新认证
export function againUpdateCompanyAuth(params) {
  return request({
    url: '/pcfddAut/againUpdateCompanyAuth',
    method: 'post',
    data: params
  })
}

// 已认证个人重新更新认证
export function againUpdatePersonAuth(params) {
  return request({
    url: '/pcfddAut/againUpdatePersonAuth',
    method: 'post',
    data: params
  })
}