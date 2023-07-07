// search/pages/nodata/nodata.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toIndex(){
    wx.switchTab({       
      url:"/pages/index/index",
    })
  },
   // 转发给朋友
   onShareAppMessage(res) {
    return {
      title: app.globalData.shareTitle,//默认小程序标题
      path: app.globalData.sharePath
    }
  },
  //分享到朋友圈
  onShareTimeline(){
    return {
      title: app.globalData.shareTitle,//默认小程序标题
      path: app.globalData.sharePath
    }
  },

})