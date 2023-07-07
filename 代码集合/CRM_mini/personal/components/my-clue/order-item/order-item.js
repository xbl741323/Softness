// personal/components/my-clue/order-item/order-item.js
const app = getApp();
import {
  getClueDetail
} from "../../../../utils/api/clue"
import {
  arrToObj
} from "../../../../utils/order/order"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
      type: Object
    },
    pageFrom: { // 来源页面 0-产品列表 3-待生效订单列表 4-订单详情
      type: Number,
      value: 0
    },
    disabled: { // 是否失效 true-失效 false-正常
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageUrl: app.globalData.imageURL,
    permissions: {},
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
    toOrderDetail() {
      let pageFrom = this.data.pageFrom
      if (pageFrom == 0 || pageFrom == 3) {
        let orderInfo = this.data.orderInfo
        let pageFrom = this.data.pageFrom
        if (this.data.permissions.bt_sys_order_detail_product_my) {
          wx.navigateTo({
            url: `/personal/pages/my-order/detail/product-order/product-order?orderId=${orderInfo.id}&&orderType=${pageFrom}`,
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: '权限不足',
          })
        }
        
      }
    },
    // 获取线索详情
    getDetail() {
      let orderInfo = this.data.orderInfo
      let clueType = orderInfo.clueType
      let params = clueType == 1 ? {
        cluePersonId: orderInfo.clueId
      } : {
        clueCompanyId: orderInfo.clueId
      }
      getClueDetail(params, clueType, true).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          let data = JSON.stringify(res.data)
          wx.navigateTo({
            url: `/personal/pages/my-order/generate-order/edit/edit?clueType=${clueType}&&clueInfo=${data}&orderId=${orderInfo.id}`,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.msg,
          })
        }
      })
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        permissions: arrToObj()
      })
    }
  }
})
