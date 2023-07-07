const app = getApp();

Page({
  data: {
    url: ''
  },

  inputUrl(e) {
    this.setData({
      url: e.detail.value,
    })
  },

  goScanCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success: ({result = ''}) => {
        if(!result) {
          wx.showToast({
            title: '扫码失败',
            icon: 'error'
          })
        }
        this.setData({
          url: result
        }, this.goUrl)
      }
    })
  },

  goUrl() {
    const url = this.data.url
    wx.navigateTo({
      url: '/pagesFace/pages/webview/webview?url=' + encodeURIComponent(url),
    })
  },

  clearUrl() {
    this.setData({
      url: '',
    })
  }
})
