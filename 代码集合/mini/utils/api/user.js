import {
  request
} from "../common/request.js"
module.exports = {
  // 注册
  userRegister: (data) => {
    return request('post', '/appletLoginUser/userRegister', data)
  },
  // 老用户注册
  completeOldUserInfo: (data) => {
    return request('post', '/appletTmUser/completeOldUserInfo', data)
  },
  // 验证码登录
  loginBySMS: (data) => {
    return request('post', '/appletLoginUser/loginBySMS', data)
  },
  // 选择账号登录
  chooseAccount: (data) => {
    return request('post', '/appletLoginUser/chooseAccount', data)
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
  // 获取继续认证url
  getAuthUrl: () => {
    return request('get', '/appletFddAut/getAuthUrl')
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
  // 新增单位授权人
  addCompanyAuthorizer: (data) => {
    return request('post', '/appletFddAut/addCompanyAuthorizer', data)
  },
  // 修改用户基本信息
  updateAccountBaseInfo: (data) => {
    return request("put", "/appletTmUser/updateAccountBaseInfo", data)
  },
  // 获取用户基本信息
  getMyAccountInfo: () => {
    return request("get", "/appletTmUser/getMyAccountInfo")
  },
  // 获取用户基本信息
  getMyAccountAndVipInfo: () => {
    return request("get", "/appletTmUser/getMyAccountAndVipInfo")
  },
  // 更新用户信息，data传wx.login>code
  updateAccountInfo: (data) => {
    return request("put", "/appletLoginUser/updateAccountInfo", data, true)
  },
  // 电子签约单位认证接口
  essAddAuthCompany: (data) => {
    return request('post', '/appletFddAut/essAddAuthCompany', data)
  },
  // 电子签约个人认证接口
  essAddAuthPerson: (data) => {
    return request('post', '/appletFddAut/essAddAuthPerson', data)
  },
  // 电子签约判断是否需要签约
  getEssAuthStatus: () => {
    return request('get', '/appletFddAut/getEssAuthStatus')
  },
  //管理员-个人身份真实性验证
  authByOnlyPerson: (data) => {
    return request('post', '/appletFddAut/authByOnlyPerson', data)
  },
  //主体账户名校验
  userNameCheck: (data) => {
    return request('get', `/appletTmUser/userNameCheck/${data}`)
  },  
  // 身份认证重置密码
  updatePwdByAuth: (data) => {
    return request("put", "/appletTmUser/updatePwdByAuth", data)
  },
  // 根据交易号获取身份认证状态
  getAuthPersonStatus: (data) => {
    return request("get", `/appletFddAut/getAuthPersonStatus/${data}`)
  },
  //发送短信给管理员手机号
  smsToManager: (data) => {
    return request("get", `/appletTmUser/smsToManager/${data}`)
  },
  //已认证个人更新认证
  updatePersonAuth: (data) => {
    return request('post', '/appletFddAut/updatePersonAuth', data)
  },
  //已认证单位更新认证
  updateCompanyAuth: (data) => {
    return request('post', '/appletFddAut/updateCompanyAuth', data)
  },
}