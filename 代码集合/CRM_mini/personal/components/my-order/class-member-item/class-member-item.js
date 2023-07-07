// personal/components/my-order/class-member-item/class-member-item.js
import {
  arrToObj
} from "../../../../utils/order/order"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
      type: Object
    },
    pageFrom: { // 来源页面 1-课程订单列表 2-会员订单列表 
      type: Number,
    },
    orderStatus: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    permissions: {}
  },
  attached() {
    // 开启任务
    this.setData({
      permissions: arrToObj()
    })
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
    // 跳转到课程、会员订单详情
    toOrderDetail() {
      let data = JSON.stringify({
        id: this.properties.orderInfo.id,
        pageFrom: this.properties.pageFrom
      })
      wx.navigateTo({
        url: `/personal/pages/my-order/detail/class-member/class-member?data=${data}`,
      })
    }
  }
})