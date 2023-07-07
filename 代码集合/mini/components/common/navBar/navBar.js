// components/common/navBar/navBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value: 0
    },
    url: {
      type: String,
      value: ""
    },
    from: {
      type: String,
      value: ""
    },
    navTitle: {
      type: String,
      value: ""
    },
    cType: {
      type: Number,
      value: 0
    },
    bgColor:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 10,
    title: "",
    content: "",
    cancelColor: "#36A6FE",
    cancelText: "",
    confirmColor: "#999999",
    confirmText: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 路由分配
    translateUrl() {
      let type = this.data.type
      console.log(type);
      switch (Number(type)) {
        case 0: // 父组件是对公转账支付页面
          wx.navigateTo({
            url: '/personal/pages/orderIndex/order?type=2&index=0',
          })
          break;
        case 1: // 父组件是提交订单页面
          wx.navigateBack({
            delta: 1
          })
          break;
        case 2: // 父组件是订单列表页面
          wx.switchTab({
            url: '/pages/me/me'
          })
          break;
          case 3: // 父组件是微信支付页面
            let index = this.data.from=='class'? 1 : 0
            console.log(this.data.from);
            wx.redirectTo({
              url: this.data.url ? this.data.url : this.data.from=='vip'?`/personal/pages/class/member?buy=${1}`:`/personal/pages/orderIndex/order?type=${2}&index=${index}`
            })
          break;
        case 4: // 页面来源开通vip
          wx.navigateBack({
            delta: 2
          })
          break;
        case 5: // 页面来源课堂订单
          wx.redirectTo({
            url: `/personal/pages/orderIndex/order?type=${0}&index=${1}`
          })
          break;
      }
    },
    // 设置显示内容
    translateText() {
      let type = this.data.type
      switch (Number(type)) {
        case 0: // 父组件是对公转账支付页面
          this.setData({
            title: "正在使用对公转账功能",
            content: "确定放弃此次付款？",
            cancelText: "继续付款",
            confirmText: "放弃"
          })
          break;
        case 1: // 父组件是提交订单页面
          this.setData({
            title: this.data.cType == 0 ? "确定放弃支付吗？" : "确定取消订单么吗？",
            cancelText: "再想想",
            confirmText: "确定"
          })
          break;
        case 3: // 父组件是提交订单页面
        case 4: //页面来源vip购买
        case 5: //页面来源课堂订单
          this.setData({
            title: "正在使用微信支付功能",
            content: "确定放弃此次付款？",
            cancelText: "再想想",
            confirmText: "确定"
          });
          break;
      }
    },
    dialogLeave() {
      this.translateText()
      let that = this
      let _this = this.data
      wx.showModal({
        title: _this.title,
        content: _this.content,
        cancelColor: _this.cancelColor,
        cancelText: _this.cancelText,
        confirmColor: _this.confirmColor,
        confirmText: _this.confirmText,
        success(res) {
          if (res.confirm) {
            that.translateUrl()
          } else if (res.cancel) {
            that.triggerEvent('close-dialog', true)
          }
        },
      })
    },
    navLeave() {
      this.triggerEvent('close-dialog', false)
      if (this.data.type == 2) {
        this.translateUrl()
      } else {
        this.dialogLeave()
      }
    },
  },
  lifetimes:{
    attached: function () {
      console.log(this.data.from,'=====');
    }
  }
})