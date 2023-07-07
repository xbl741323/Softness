// personal/pages/perAuthentication/skipPage/skipPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skipType: "", // 1：支付宝 2：阿里刷脸（不行）
    skipUrl: ""
  },
  setSkipUrl(options) {
    this.setData({
      skipType: options.skipType
    })
    if (wx.getStorageSync('authent-result')) {
      let authentInfo = JSON.parse(wx.getStorageSync('authent-result'))
      this.setData({
        skipUrl: authentInfo.certifyUrl
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setSkipUrl(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (wx.getStorageSync('authent-result')) {
      wx.removeStorageSync('authent-result')
    }
    wx.navigateTo({
      url: '/personal/pages/authentication/authentication',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})