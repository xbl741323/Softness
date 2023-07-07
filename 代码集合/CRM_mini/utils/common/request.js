const app = getApp();
import * as CodeMsg from "../../utils/common/codeMsg";
let unloginStatus = 0
// 请求接口request封装
const request = (method, url, data, header, isLogin) => {
  var token = 'Basic Y3JtLW1pbmk6Y3JtLW1pbmk='
  var tenantId = ''
  if (wx.getStorageSync('accessInfo')) {
    token = 'Bearer' + wx.getStorageSync('accessInfo').access_token
    tenantId = wx.getStorageSync('userInfo').tenantId
  }
  let _url = app.globalData.baseURL + url;
  return new Promise((resolve, reject) => {
    var headObj = {
      'content-type': header ? 'application/x-www-form-urlencoded' : 'application/json',
      'Accept': 'application/json, text/plain',
      'Authorization': token,
      'TENANT-ID': tenantId // 租户ID
    }
    if (isLogin) {
      headObj = {
        'isToken': 'false',
        'TENANT-ID': '1',
        'content-type': header ? 'application/x-www-form-urlencoded' : 'application/json',
        'Accept': 'application/json, text/plain',
        'Authorization': token,
      }
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