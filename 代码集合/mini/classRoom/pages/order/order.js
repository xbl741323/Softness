// classRoom/pages/order/order.js
const app = getApp();
import {
  getClassDetail
} from "../../../utils/api/wtClass"
import {
  saveCourseOrder,
  payCourseOrderWxMini,
  payCourseOrderWxMiniWithAli
} from "../../../utils/api/vip"
import {
  getOpenId,
  layout
} from "../../../utils/api"
import {
  getUserInfo
} from "../../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId: '',
    courseInfo: {},
    orderId: '',
    imageUrl: app.globalData.imageURL,
    throttle: true,
    checkDeal: true,
    checkedIndex: 2,
    finalPrice: null,
    totalPrice: null,
    vipStatus: null,
    from: null,
    orderAmount: null,
  },
  // 获取商品信息
  getDetailData() {
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      id: this.data.courseId
    }
    getClassDetail(params).then(res => {
      if (res.code == 0) {
        this.setData({
          courseInfo: res.data
        })
        wx.hideLoading({})
        this.computePrice();
      }
    });
  },
  // 计算价格
  computePrice() {
    // 订单列表过来的价格直接计算
    if (this.data.orderAmount) return this.setData({
      finalPrice: this.data.orderAmount
    });
    if (!wx.getStorageSync('userInfo')) return this.layoutAccount()
    let vipInfo = wx.getStorageSync('vipInfo') ? wx.getStorageSync('vipInfo') : null;
    console.log(vipInfo, '计算价格前获取vip用户信息');
    let info = this.data.courseInfo;
    let thirdFee = info.tradingThirdFeeState == '1' ? info.tradingThirdFee : 0; // 判断第三方费用：1有0无
    // 会员价格    
    if (vipInfo) {
      let vipDate = new Date(vipInfo.vipExpireDate); // 到期时间
      let useful = Date.now() < vipDate.getTime() + 24 * 60 * 60 * 1000 - 1 ? true : false; //VIP时间是否到期    
      if (useful) { //会员在有效期内
        this.setData({
          finalPrice: info.tradingChargeType == 2 ? 0 : info.tradingVipPrice + thirdFee,
          vipStatus: true,
        })
      } else {
        this.setData({
          finalPrice: info.tradingCurrentPrice + thirdFee
        })
      }
    };
    // 非会员价格
    if (!vipInfo) return this.setData({
      finalPrice: info.tradingCurrentPrice + thirdFee,
    })
  },
  // 改变支付方式
  chooseIndex(val) {
    this.setData({
      checkedIndex: val.detail
    })
  },
  // 跳转交易服务协议
  toAgreement() {
    wx.navigateTo({
      url: '/order/pages/tsAgreement/propertyTa/propertyTa',
    })
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
            that.submit()
          } else {
            // 调用注销接口强制退出
            // that.layoutAccount()
          }
        })
      }
    })
  },
  // 注销退出
  layoutAccount() {
    console.log('提交订单时登录异常强制退出-----购买课堂订单');
    wx.showToast({
      title: '账号登录异常，请重新登录！',
      icon: "error",
      duration: 1000,
    })
    setTimeout(() => {
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
    }, 1500)
  },
  // 提交订单
  submit() {
    if (!this.data.checkDeal) return wx.showToast({
      title: '请勾选交易协议',
      icon: 'none',
      duration: 2000,
    });
    let para = {
      courseId: this.data.courseId,
      orderAmount: this.data.finalPrice,
      orderSource: 'APPLET',
      accountId: wx.getStorageSync('userInfo').accountId,
      payType: this.data.checkedIndex,
    }
    if (wx.getStorageSync('courseLinkId') && wx.getStorageSync('courseIdArr')) {
      let courseIdArr = wx.getStorageSync('courseIdArr')
      if (courseIdArr.indexOf(Number(this.data.courseId)) != -1) {
        para.inviteCode = wx.getStorageSync('courseLinkId')
      }
    }
    saveCourseOrder(para).then(res => {
      this.setData({
        throttle: false,
      });
      if (res.code == 0) {
        // 支付金额为0直接支付成功
        if (this.data.finalPrice == 0) return this.payWithoutMoney();
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
  // 无需付款支付
  payWithoutMoney() {
    wx.showToast({
      title: '支付成功！',
      icon: 'none',
      duration: 800,
    })
    setTimeout(() => {
      wx.navigateTo({
        url: `/personal/pages/orderIndex/order?index=${1}`,
      });
    }, 900)
  },
  // 订单过来立即支付
  payNow() {
    if (this.data.checkedIndex == 0) return this.toAliPay();
    if (this.data.checkedIndex == 2) return this.toWxPay();
  },
  // 微信支付
  toWxPay() {
    payCourseOrderWxMini({
      orderId: this.data.orderId
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          wxInfo: JSON.parse(res.data),
          throttle: true
        })
        wx.setStorageSync('wxPay', this.data.wxInfo)
        wx.navigateTo({
          url: `/order/pages/orderPay/wxPay/wxPay`,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        });
        // setTimeout(() => {
        //   wx.navigateBack({
        //     delta: 1,
        //   })
        // }, 2000)
      }
    })
  },
  // 支付宝支付
  toAliPay(no) {
    payCourseOrderWxMiniWithAli({
      orderId: this.data.orderId
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          throttle: true
        })
        wx.redirectTo({
          url: `/order/pages/orderPay/baoPay/baoPay?orderNo=${this.data.orderNo}&type=${'class'}`,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 2000)
      }
    })
  },
  // 勾选协议
  changeDeal() {
    this.setData({
      checkDeal: !this.data.checkDeal
    })
  },
  judgeUrl() {
    let pages = getCurrentPages();
    let currPage = null;
    if (pages.length) {
      currPage = pages[pages.length - 2]
    };
    let route = currPage.route;
    if (route == 'personal/pages/orderIndex/order') return this.setData({
      from: 'order'
    });
    if (route == 'classRoom/pages/detail/course/course') return this.setData({
      from: 'class'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.setData({
      courseId: id,
    })
    if (options.no) {
      this.setData({
        orderNo: options.no,
        orderId: options.orderId,
        orderAmount: options.orderAmount
      })
    }
    this.getDetailData();
    this.judgeUrl();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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