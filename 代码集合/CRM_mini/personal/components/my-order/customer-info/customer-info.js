// personal/components/my-order/customer-info/customer-info.js
import {
  updateRemark
} from "../../../../utils/api/order"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
      type: Object
    },
    clueInfo: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    remark: "",
    isEdit: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置备注可编辑
    showRemark() {
      this.setData({
        isEdit: false
      })
    },
    // 备注编辑提示
    changeRemark(e) {
      let that = this
      wx.showModal({
        content: "确定修改？",
        cancelColor: "#999999",
        cancelText: "取消",
        confirmColor: "#36A6FE",
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            that.setData({
              remark: e.detail.value,
              isEdit: true
            })
            that.updateOrderRemark()
          } else if (res.cancel) {}
        }
      })
    },
    // 修改订单备注
    updateOrderRemark() {
      let params = {
        id: this.data.orderInfo.id,
        remark: this.data.remark
      }
      updateRemark(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          wx.showToast({
            icon: "success",
            title: '修改成功！',
          })
          this.triggerEvent('refresh')
        }
      })
    },
  },
  lifetimes: {
    attached: function () {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    },
  },
})