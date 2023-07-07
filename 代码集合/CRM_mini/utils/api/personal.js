import {
  request
} from "../common/request.js"

module.exports = {
  // 登录接口
  empLogin: (params, data) => {
    return request('post', `/auth/oauth/token?randomStr=${params.randomStr}&code=${encodeURIComponent(params.code)}&grant_type=${params.grant_type}`, data, true, true)
  },
  // 退出接口
  empLogout: (data) => {
    return request('delete', `/auth/token/logout`, data)
  },
  // 滑动或者点选验证
  reqCheck: (data) => {
    return request('post', `/code/check?captchaType=${data.captchaType}&pointJson=${data.pointJson}&token=${data.token}`, data)
  },
  // 获取验证图片以及token
  reqGet: (data) => {
    return request('get', `/code`, data)
  },
  // 图片上传
  uploadMedia: (data) => {
    return request('post', `/wtcrm/file/upload`, data)
  },
  // 更改个人信息
  editInfo: (data) => {
    return request('put', `/admin/user/edit`, data)
  },
  // 微信绑定
  wxBind: (data) => {
    return request('post', `/admin/sysUserWx/wxBind`, data)
  },
  // 员工工号密码校验
  verifyNum: (data) => {
    return request('post', `/admin/sysUserWx/numPwdVer`, data)
  },
  // 获取短信验证码
  getCode: (mobile) => {
    return request('get', `/admin/mobile/sms/`+ mobile)
  },
  // 手机号短信验证码校验
  mobileVer: (data) => {
    return request('post', `/admin/sysUserWx/mobileVer`, data)
  },
  // 微信登录
  wxLogin: (params,data) => {
    return request('post', `/auth/mobile/token/social?mobile=${params.mobile}&grant_type=${params.grant_type}`, data, true,true)
  },
  // 微信换绑
  changeWxBind: (data) => {
    return request('post', `/admin/sysUserWx/changeWxBind`, data)
  },
  // 获取登录员工数据
  getUserDetail: (data) => {
    return request('get', `/admin/user`)
  },
  // 获取微信二维码
  getQrCode: (data) => {
    return request('get', `/wtcrm/msg/wx/qrcode`, data)
  },
  // 判断员工是否关注
  getWxFocus: (data) => {
    return request('get', `/wtcrm/msg/wx/focus`, data)
  }
}