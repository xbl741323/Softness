// personal/components/seas-region/follow-records/follow-records.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectProduct: [],
    fileList: [],
    followInfo: {},
    env: __wxConfig.envVersion,
    imageURL: app.globalData.imageURL,
    isPermission: false, // 位置权限是否授权
    defaultInfo: {}, // 业务员当前位置信息
    chooseInfo: {}, // 业务员选择的位置信息
    locationInfo: { // 定位打卡info
      addressName: '',
      addressDetail: '',
      imgUrl: ''
    },
  },

  // 查看打卡图片
  checkTakePhoto() {
    let locationInfo = this.data.locationInfo
    if (locationInfo.imgUrl != '') {
      wx.previewImage({
        urls: [this.data.imageURL + locationInfo.imgUrl] // 需要预览的图片http链接列表
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.followInfo) {
      let locationInfo = this.data.locationInfo
      let r = JSON.parse(options.followInfo)
      let selectProduct = this.data.selectProduct
      if (r.clueFollowSpuList != null && r.clueFollowSpuList != '') {
        r.clueFollowSpuList.forEach(item => {
          selectProduct.push({
            id: item.spuId,
            spuCode: item.followSpuCode,
            spuTitle: item.followSpuName
          })
        })
      }
      let clueFollowFileList = []
      r.clueFollowFileList.forEach(item => {
        clueFollowFileList.push({
          followId: item.followId,
          name: item.name,
          url: app.globalData.imageURL + item.url
        })
      })
      console.log(r, 'rrrrrrrr')
      locationInfo.addressName = r.locationName
      locationInfo.addressDetail = r.locationDetail
      locationInfo.imgUrl = r.pictureUrl
      this.setData({
        followInfo: r,
        selectProduct: selectProduct,
        locationInfo: locationInfo,
        fileList: clueFollowFileList,
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