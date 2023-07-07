const app = getApp();
Page({

  data: {
    url: '',
  },

  /** 初始打开实名认证页面 */
  onLoad(options) {
    if (wx.getStorageSync('fadaUrl')) {
      let newUrl = wx.getStorageSync('fadaUrl')
      this.setData({
        url: decodeURIComponent(newUrl),
      })
    }
  },
  onUnload() {
    wx.removeStorageSync('fadaUrl')
  },

  /** 刷脸完成后重新加载实名认证页面 */
  reloadPage(url) {
    console.log('---webview reloadPage', url)
    this.setData({
      url,
    })
  },
})