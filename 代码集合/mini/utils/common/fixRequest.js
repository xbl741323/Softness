const app = getApp();
// 请求接口request封装
const developUrl = 'http://192.168.1.11:6569'
const trialUrl = 'http://192.168.1.11:6569'
const releaseUrl = 'https://www.wotao.com/applet'
const fixRequest = (method, url, data, header) => {
  let token = wx.getStorageSync('token');
  var _url = ''
  var env = __wxConfig.envVersion;
  if (app && app.globalData) {
    _url = app.globalData.baseURL + url;
  } else {
    _url = env == 'develop' ? `${developUrl}` + url : env == 'trial' ? `${trialUrl}` + url : `${releaseUrl}` + url;
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'content-type': header ? 'application/x-www-form-urlencoded' : 'application/json',
        'Accept': 'application/json',
        'Authorization': token
      },
      success(res) {
        if (res.data.code == 401) {
          wx.showToast({
            title: '您还未登录,请先登录吧~',
            icon: 'none',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateTo({
              url: "/personal/pages/wxLogin/wxLogin"
            })
          }, 1000)
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
  fixRequest: fixRequest
}