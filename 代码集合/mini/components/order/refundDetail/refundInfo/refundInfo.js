// components/order/refundDetail/refundInfo/refundInfo.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    refundInfo: {
      type: Object,
      value: {}
    },
    orderInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageUrl: app.globalData.imageURL,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 复制退款编号
    copyText() {
      let that = this
      wx.setClipboardData({
        data: that.data.refundInfo.orderNo,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
    }
  }
})