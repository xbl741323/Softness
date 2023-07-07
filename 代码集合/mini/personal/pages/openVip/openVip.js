// personal/pages/openVip/openVip.js
const app = getApp();
import {
  getVipProductById,
  saveVipOrder,
  payVipOrderWxMini,
  payVipOrderWxMiniWithAli,
  getVipInfo
} from "../../../utils/api/vip"
import {
  getOpenId,
  layout
} from "../../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    wxInfo: {},
    vipInfo: {},
    useful: false, //有效期判断
    orderNo: '',
    imageUrl: app.globalData.imageURL,
    checkedIndex: 2,
    checkDeal: true,
    throttle: true,
    orderId: null,
    startTime: null,
    endTime: null,
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
  // 获取购买会员信息
  getCourseOrder() {
    let para = {
      id: 1
    }
    getVipProductById(para).then(res => {
      this.setData({
        info: res.data
      });
      this.computeTime();
    })
  },
  //获取用户vip信息
  getInfo() {
    getVipInfo().then(res => {
      if (res.data) {
        this.setData({
          vipInfo: res.data,
        })
        let end = new Date(res.data.vipExpireDate);
        if (Date.now() < end.getTime()) {
          this.setData({
            useful: true
          })
        }
      };
      this.getCourseOrder();
    });
  },
  //计算会员时间
  computeTime() {
    let info = this.data.info;
    let date = this.data.useful ? new Date(this.data.vipInfo.vipExpireDate) : new Date();
    if (info.validityPeriodUnit == 'Years') {
      date.setYear(date.getFullYear() + info.validityPeriod)
    };
    if (info.validityPeriodUnit == 'Months') {
      date.setMonth(date.getMonth() + info.validityPeriod)
    };
    if (info.validityPeriodUnit == 'Days') {
      date.setDate(date.getDate() + info.validityPeriod)
    };
    this.setData({
      endTime: this.jointTime(date),
      startTime: this.jointTime(new Date()),
    })
  },
  //拼接时间
  jointTime(data) {
    var year = data.getFullYear();
    var month = data.getMonth() + 1;
    var day = data.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return data = year + "-" + month + "-" + day;
  },
  checkLogin() {
    if (!this.data.throttle) return wx.showToast({
      title: '请勿重复提交',
      icon: 'none',
      duration: 1000,
    });
    let that = this;
    wx.login({
      success: function (res) {
        let params = {
          code: res.code,
          accountId: wx.getStorageSync('accountId')
        }
        getOpenId(params).then(res => {
          if (res.code == 0) {
            that.handleOrder()
          } else {
            // 调用注销接口强制退出
            that.layoutAccount()
          }
        })
      }
    })
  },
  // 注销退出
  layoutAccount() {
    console.log('提交订单时登录异常强制退出-----开通会员');
    wx.login({
      success: function (res) {
        layout({
          code: res.code
        }).then(res => {
          if (res.code == 0) {
            // 清除所有storageSync
            wx.clearStorageSync()
            wx.setStorageSync('hasLogo', false);
            wx.redirectTo({
              url: "/personal/pages/wxLogin/wxLogin"
            })
          }
        })
      }
    })
  },
  // 提交订单
  handleOrder() {
    if (!this.data.checkDeal) return wx.showToast({
      title: '请勾选交易协议',
      icon: 'none',
      duration: 2000,
    });
    let para = {
      vipProductId: this.data.info.id,
      orderSource: 'APPLET',
      accountId: wx.getStorageSync('userInfo').accountId,
      payType: this.data.checkedIndex
    }
    if (wx.getStorageSync('memberId')) {
      para.inviteCode = wx.getStorageSync('memberId')
    }
    saveVipOrder(para).then(res => {
      this.setData({
        throttle: false,
      })
      if (res.code == 0) {
        this.setData({
          orderId: res.data.id,
          orderNo: res.data.orderNo,
        });
        setTimeout(() => {
          if (para.payType == 0) return this.toAliPay();
          if (para.payType == 2) return this.toWxPay();
        }, 300)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  // 微信支付
  toWxPay() {
    payVipOrderWxMini({
      orderId: this.data.orderId
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          wxInfo: JSON.parse(res.data),
          throttle: true
        })
        wx.setStorageSync('wxPay', this.data.wxInfo)
        wx.navigateTo({
          url: `/order/pages/orderPay/wxPay/wxPay?buy=${'vip'}`,
        })
      }
    })
  },
  // 支付宝支付
  toAliPay(no) {
    payVipOrderWxMiniWithAli({
      orderId: this.data.orderId
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          throttle: true
        })
        wx.navigateTo({
          url: `/order/pages/orderPay/baoPay/baoPay?orderNo=${this.data.orderNo}`,
        })
      }
    })
  },
  // 改变支付方式 0：支付宝 1：线下对公转账支付 2:微信支付
  changePay(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      checkedIndex: index
    })
  },
  //切换勾选服务协议
  changeDeal() {
    this.setData({
      checkDeal: !this.data.checkDeal
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.getInfo();
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