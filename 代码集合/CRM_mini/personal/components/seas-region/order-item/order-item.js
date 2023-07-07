// personal/components/seas-region/order-item/order-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
     // 复制链接
     copyText(e) {
      let text = e.currentTarget.dataset.text
      wx.setClipboardData({
        data: text,
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
    },
        // 跳转到订单详情
        // toOrderDetail() {
        //     let orderInfo = this.data.orderInfo
        //     wx.navigateTo({
        //       url: `/personal/pages/my-order/detail/product-order/product-order?orderId=${orderInfo.id}&&orderType=${0}`,
        //     })
        // },
  }
})
