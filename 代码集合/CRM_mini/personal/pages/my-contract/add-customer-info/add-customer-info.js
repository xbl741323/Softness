// personal/pages/my-contract/add-customer-info/add-customer-info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      legalPersonName: "", // 法人姓名
      legalPersonPhone: "", // 法人手机号
      treasurerName: "", // 财务主管姓名
      treasurerPhone: "", // 财务主管姓名
    }
  },
  // 校验客户信息
  validSubmit() {
    let userInfo = this.data.userInfo
    let pattren = (/^\s*((0\d{2,3}-?\d{7,8})|(1[3456789]\d{9}))\s*$/)
    if ((userInfo.legalPersonName != '' && userInfo.legalPersonPhone != '') || (userInfo.treasurerName != '' && userInfo.treasurerPhone != '')) {
      if ((Number(userInfo.legalPersonPhone) != 0 && !pattren.test(userInfo.legalPersonPhone)) || (Number(userInfo.treasurerPhone) != 0 && !pattren.test(userInfo.treasurerPhone))) {
        wx.showToast({
          icon: 'none',
          title: '请输入正确的手机号！',
        })
      } else {
        wx.setStorageSync('fixCustomerInfo', userInfo)
        wx.navigateBack()
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '请将客户信息补充完整！',
      })
    }
  },
  // 修改客户信息 
  changeInfo(e) {
    let type = e.currentTarget.dataset.type
    let val = e.detail.value.trim()
    let userInfo = this.data.userInfo
    type == 0 ? userInfo.legalPersonName = val : ''
    type == 1 ? userInfo.legalPersonPhone = val : ''
    type == 2 ? userInfo.treasurerName = val : ''
    type == 3 ? userInfo.treasurerPhone = val : ''
    this.setData({
      userInfo: userInfo
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