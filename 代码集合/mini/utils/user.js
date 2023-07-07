import {
  request
} from "./common/request.js"
module.exports = {
  // 注册
  userRegister: (data) => {
    return request('post', '/appletLoginUser/userRegister', data)
  },
  // 验证码登录
  loginBySMS: (data) => {
    return request('post', '/appletLoginUser/loginBySMS', data)
  },
  // 选择账号登录
  chooseAccount: (data) => {
    return request('post', '/appletLoginUser/chooseAccount', data)
  },
  // 账号名密码登录
  accountLogin: (data) => {
    return request('post', '/appletLoginUser/loginByPwd', data)
  },
  // 获取用户信息
  accountInfo: () => {
    return request("get", "/appletLoginUser/accountInfo")
  },
  // 微信登录判断状态
  wxLogin: (data) => {
    return request('post', '/appletLoginUser/wxLogin', data)
  },
  // 获取关联账号信息
  getAccountList: (data) => {
    return request('post', '/appletLoginUser/wxBind/getAccountList', data)
  },
  // 绑定账号登录
  wxBindLogin: (data) => {
    return request('post', '/appletLoginUser/wxBindLogin', data)
  },
  // 退出登录
  logOut: (data) => {
    return request('post', '/appletLoginUser/logOut', data)
  },
  // 获取用户认证状态
  getAutStatus: () => {
    return request('get', '/appletFddAut/getAutStatus')
  },
  // 申请个人认证
  addAuthPerson: (data) => {
    return request('post', '/appletFddAut/addAuthPerson', data)
  },
  // 申请单位认证
  addAuthCompany: (data) => {
    return request('post', '/appletFddAut/addAuthCompany', data)
  },
  // 重新申请个人认证
  againAddAuthPerson: (data) => {
    return request('post', '/appletFddAut/againAddAuthPerson', data)
  },
  // 重新申请单位认证
  againAddAuthCompany: (data) => {
    return request('post', '/appletFddAut/againAddAuthCompany', data)
  },
  // 修改用户基本信息
  updateAccountBaseInfo: (data) => {
    return request("put", "/appletTmUser/updateAccountBaseInfo", data)
  },
  // 获取用户基本信息
  getMyAccountInfo: () => {
    return request("get", "/appletTmUser/getMyAccountInfo")
  },
  updateAccountInfo: (data) => {
    return request("put", "/appletLoginUser/updateAccountInfo", data)
  },
  // 忘记密码手机号验证码校验
  forgetPwdCheck: (data) => {
    return request('post', '/appletTmUser/forgetPwdCheck', data)
  },
  forgetPwdReset: (data) => {
    return request('post', '/appletTmUser/forgetPwdReset', data)
  },
  // 账号名密码登录
  accountLogin: (data) => {
    return request('post', '/appletLoginUser/loginByPwd', data)
  },
  // 获取图形验证码
  getCode: (data) => {
    return request('get', '/appletLoginUser/getCode', data)
  },
}