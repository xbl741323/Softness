// components/personal/rzTip/rzTip.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toRz() {
      let userInfo = this.data.userInfo
      wx.navigateTo({
        url: '/personal/pages/authentication/authentication?accountType=' + userInfo.accountType + '&status=' + userInfo.accountType,
      })
    },
    cancel() {
      this.triggerEvent('cancel')
    }
  },
  lifetimes:{
    attached: function() {
      if (wx.getStorageSync('userInfo')) {
        this.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
      }
    }
  }
})