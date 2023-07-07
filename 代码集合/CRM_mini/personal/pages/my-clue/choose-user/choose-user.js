// personal/pages/my-clue/choose-user/choose-user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: []
  },
  setValue(e){
    let data = e.currentTarget.dataset.item
    let userList = this.data.userList
    userList.forEach(item => {
      if(data.userId == item.userId){
        item.checked = true
      }else{
        item.checked = false
      }
    })
    this.setData({
      userList: userList
    })
    let newdata = JSON.stringify([data])
    console.log(newdata)
    wx.setStorageSync('chooseUserList', newdata)
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.data){
      this.setData({
        userList: JSON.parse(options.data)
      })
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