import {
  request
} from "../common/request.js"

module.exports = {
  // 个人校验
  checkPersonalAuth: (data) => {
    return request('post', '/authentication/checkPersonalAuth', data)
  },
  // 提交支付宝认证返回url
  getzfbUrl: (data) => {
    return request('post', '/authentication/startAuthPhone', data)
  },
  // 获取支付宝认证结果
  getzfbResult: (data) => {
    return request('post', '/authentication/getAuthPhone', data)
  },
  // 提交开启阿里认证
  getAliUrl: (data) => {
    return request('post', '/authentication/getMetaInfoPhone', data)
  },
  // 获取阿里认证结果
  getAliResult: (data) => {
    return request('post', '/authentication/getAliResult', data)
  },
  // 获取阿里刷脸认证结果
  getAliFaceResult: (data) => {
    return request('post', '/authentication/getAliFaceResult', data)
  },
  // 添加单位认证
  addAuthCompany: (data) => {
    return request('post', '/appletfddAut/addAuthCompany', data)
  },
}