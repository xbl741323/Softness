// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: 'https://www.xzycshouce.com/api/file/picture/',
    info: {
      title: '',
      imgUrl: ''
    }
  },
  // 预览图片
  previewImg() {
    wx.previewImage({
      urls: [this.data.baseUrl + this.data.info.imgUrl],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.info) {
      let info = JSON.parse(options.info)
      this.setData({
        info: info
      })
      console.log(this.data.info, 'ddd');
    }
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