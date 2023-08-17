const app = getApp();
import * as CodeMsg from "../../utils/common/codeMsg";
let unloginStatus = 0
// 请求接口request封装
const request = (method, url, data, header) => {
  let _url = app.globalData.baseURL + url;
  return new Promise((resolve, reject) => {
    var headObj = {
      'content-type': header ? 'application/x-www-form-urlencoded' : 'application/json',
      'Accept': 'application/json, text/plain',
    }
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: headObj,
      success(res) {
        if ((res.data.code == CodeMsg.CODE_401 || res.statusCode == CodeMsg.CODE_401) && (unloginStatus == 0)) {
          unloginStatus = unloginStatus + 1
          wx.showToast({
            icon: "none",
            title: '用户凭证已过期，请重新登录！',
          })
          setTimeout(() => {
            wx.clearStorageSync()
            wx.navigateTo({
              url: "/personal/pages/login/login"
            })
          }, 500)
        } else if (res.statusCode == CodeMsg.CODE_403) {
          wx.showToast({
            icon: "none",
            title: res.data.msg,
          })
        } else {
          resolve(res.data)
        }
      },
      fail(err) {
        wx.showModal({
          title: '提示',
          content: '网络请求失败',
          showCancel: false
        })
      }
    })
  })
}

module.exports = {
  request: request
}