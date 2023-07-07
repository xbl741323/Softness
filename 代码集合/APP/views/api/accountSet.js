import request from '../utils/common/request'

// 修改密码
export function changePassword(param) {
  return request({
    url: '/appTmUser/changePwd',
    method: 'put',
    data: param
  });
};

// 发送短信给管理员手机号
export function smsToManager(params) {
  return request({
    url: '/appTmUser/smsToManager',
    method: 'get',
    params: params
  })
}

// 管理员账户短信验证码校验
export function smsCheckForManager(authcode) {
  return request({
    url: '/appTmUser/smsCheckForManager/' + authcode,
    method: 'get',
  })
}

// 校验密码
export function checkPassword(params) {
  return request({
    url: '/appTmUser/checkPwd',
    method: 'post',
    data: params
  })
};

// 修改手机号
export function changePhone(params) {
  return request({
    url: '/appTmUser/changeMobile',
    method: 'put',
    data: params
  })
};

// 已认证用户修改单位信息
export function modCompany(params) {
  return request({
    url: '/pcfddAut/modCompanyAuth',
    method: 'put',
    data: params
  })
}

// 已认证用户修改个人信息
export function modPerson(params) {
  return request({
    url: '/pcfddAut/modPersonAuth',
    method: 'put',
    data: params
  })
}

// 校验验证码
export function checkPhoneCode(params) {
  return request({
    url: '/msg/sms/checkCode',
    method: 'post',
    params: params
  })
};