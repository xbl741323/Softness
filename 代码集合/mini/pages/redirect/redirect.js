// pages/redirect/redirect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options,'============');    
    this.setData({
      from: options.root
    })
    wx.showLoading({
      title: '跳转中...',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.hideLoading();
    console.log(this.data.from,'--------------111');
    if(this.data.from == 'order') return wx.navigateTo({
      url: '/personal/pages/orderIndex/order?type=2'
    })
    if(this.data.from == 'find') return wx.navigateTo({
      url: '/account/pages/approveFind/approveFind'
    })
    wx.navigateTo({
      url: '/personal/pages/authentication/authentication',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})