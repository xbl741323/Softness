import request from '../utils/common/request'

// 发送短信
export function sendcode(data) {
  return request({
    url: '/msg/sms/' + data,
    method: 'get'
  })
};

// 注册
export function userRegister(param) {
  return request({
    url: '/login/userRegister',
    method: 'post',
    data: param
  })
}

// 手机号登录
export function newLogin(param) {
  return request({
    url: '/login/loginBySMS',
    method: 'post',
    data: param
  })
};

// 账户名登录
export function accountLogin(param) {
  return request({
    url: '/login/loginByPwd',
    method: 'post',
    data: param
  })
};

// 退出登录
export function logOut() {
  return request({
    url: '/login/logOut',
    method: 'post',
  });
};

// 选择登录账户
export function chooseAccount(param) {
  return request({
    url: '/login/chooseAccount',
    method: 'post',
    data: param
  })
};

// 检测账号名是否存在
export function checkUsernameExist(username) {
  return request({
    url: '/login/duplicatesCheck/' + username,
    method: 'get'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/appTmUser/getMyAccountInfo',
    method: 'get',
  })
}

// 获取用户信息加课堂会员vip信息
export function getMyAccountAndVipInfo() {
  return request({
    url: '/appTmUser/getMyAccountAndVipInfo',
    method: 'get',
  })
}

// 获取图形验证码
export function getImgCode() {
  return request({
    url: '/login/getCode',
    method: 'get'
  })
}

// 微信登录判断状态
export function wxLogin(param) {
  return request({
    url: '/login/wxLogin',
    method: 'post',
    data: param
  })
}

// 获取关联账号信息
export function getAccountList(param) {
  return request({
    url: '/login/wxBind/getAccountList',
    method: 'post',
    data: param
  })
}

// 绑定账号登录
export function wxBindLogin(param) {
  return request({
    url: '/login/wxBindLogin',
    method: 'post',
    data: param
  })
}

// 忘记密码查验账号
export function forgetPwdCheck(param) {
  return request({
    url: '/appTmUser/forgetPwdCheck',
    method: 'post',
    data: param
  })
}

// 忘记密码修改密码
export function forgetPwdReset(param) {
  return request({
    url: '/appTmUser/forgetPwdReset',
    method: 'post',
    data: param
  })
}

