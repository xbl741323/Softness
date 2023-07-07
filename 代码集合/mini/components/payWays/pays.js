// components/payWays/pays.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checkedIndex:{
      type: Number,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {    
    payList: [{
      url: "/image/orders/weixin_icon.png",
      title: "微信支付",
      index: 2,
    },
    // {
    //   url: "/image/orders/bao_pay.png",
    //   title: "支付宝支付",
    //   index: 0,
    // }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
  // 改变支付方式 0：支付宝 1：线下对公转账支付 2:微信支付
  changePay(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      checkedIndex: index
    });
    this.triggerEvent('chooseIndex',index) 
  },
  }
})
