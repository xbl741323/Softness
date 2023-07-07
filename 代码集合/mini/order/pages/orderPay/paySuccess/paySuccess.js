// personal/pages/paySuccess/paySuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toOdrder: true
  },
  toMe() {
    wx.switchTab({
      url: '/pages/me/me',
    })
  },
  toOrder() {
    this.setData({
      toOdrder: false
    })
    wx.navigateTo({
      url: `/personal/pages/orderIndex/order?type=${0}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (this.selectComponent("#wx")) {
      this.selectComponent("#wx").getUserData()
    }
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
    let toOdrder = this.data.toOdrder
    if (toOdrder) {
      wx.navigateTo({
        url: `/personal/pages/orderIndex/order?type=${0}`,
      })
    }
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