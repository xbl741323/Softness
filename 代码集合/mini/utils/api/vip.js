import { request } from "../common/request.js"
module.exports = {
  getVipProductById: (data) => {
    return request('get', '/vipProduct/getVipProductById', data)
  },
  saveVipOrder: (data) => {
    return request('post', '/vipOrder/saveVipOrder', data)
  },
  payVipOrderWxMini: (data) => {
    return request('post', '/vipOrder/payVipOrderWxMini', data,true)
  },
  payVipOrderWxMiniWithAli: (data) => {
    return request('post', '/vipOrder/payVipOrderWxMiniWithAli', data,true)
  },
  getVipInfo: (data) => {
    return request('get', '/vip/getVipInfo', data)
  },
  pageVipOrder: (data) => {
    return request('post', '/vipOrder/pageVipOrder', data)
  },
  saveCourseOrder: (data) => {
    return request('post', '/courseOrder/saveCourseOrder', data)
  },
  payCourseOrderWxMini: (data) => {
    return request('post', '/courseOrder/payCourseOrderWxMini', data,true)
  },
  payCourseOrderWxMiniWithAli: (data) => {
    return request('post', '/courseOrder/payCourseOrderWxMiniWithAli', data,true)
  },
}
