// order/pages/orderPay/wxPay/wxPay.js
import weappJwt from './weapp-jwt.js'
import {
  layout
} from "../../../../utils/api"
import { innerGetDetailInfoById } from '../../../../utils/api/orders'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payInfo: {},
    types: null,
    urls: '',
    fileId: null,
    leftStatus: false,
    from: null
  },
  wxPay() {
    let payInfo = this.data.payInfo
    console.log(payInfo, "wxPay数据")
    let token = wx.getStorageSync('token');
    let jwtRes = weappJwt(token) //解析token    
    let account = JSON.parse(jwtRes.sub).accountInfo
    console.log(account, '解析token数据');
    if (!account.miniOpenId) return this.layoutAccount();
    let that = this;
    wx.requestPayment({
      nonceStr: payInfo.nonceStr,
      package: payInfo.package,
      paySign: payInfo.paySign,
      timeStamp: payInfo.timeStamp,
      signType: payInfo.signType,
      success: function (res) {
        wx.disableAlertBeforeUnload();
        if(that.data.fileId){
          innerGetDetailInfoById(that.data.fileId).then(res=>{
          })
        } 
        that.checkSkip()
      },
      fail: function (res) {
        wx.showModal({
          title: '是否放弃本次支付？',
          cancelColor: "#999999",
          cancelText: "放弃",
          confirmColor: "#fe3939",
          confirmText: "继续支付",
          content: '',
          complete: (res) => {
            if (res.cancel) {
              that.checkSkip()
            }
        
            if (res.confirm) {
              that.wxPay()
            }
          }
        })
      },
      complete: function (res) {}
    })
  },
  // 注销退出
  layoutAccount() {
    console.log('提交订单时登录异常强制退出-----微信购买订单');
    app.modalBox('', '登录超时，请重新登录！', true, function (res) {
      if (res) {
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
      }
    })
  },
  // 离开页面弹框（手势离开）
  leaveEnable() {
    wx.enableAlertBeforeUnload({
      message: '正在使用微信支付功能，确定放弃此次付款？',
    })
  },
  // 判断页面来源
  judgeUrl() {
    let pages = getCurrentPages();
    let currPage = null;
    if (pages.length) {
      currPage = pages[pages.length - 2]
    };
    let route = currPage.route;
    console.log(route);
    if (route == 'personal/pages/openVip/openVip') return this.setData({
      types: 4,
      urls: `/personal/pages/class/member?buy=${1}`
    });
    if (route == 'classRoom/pages/order/order') return this.setData({
      types: 5,
      urls: `/personal/pages/orderIndex/order?type=${0}&index=${1}`,
      from: 'class'
    });
    if(route == 'personal/pages/orderFile/payDetail/payDetail') return this.setData({
      types: 3,
      urls: `/personal/pages/orderIndex/order?fileType=${0}&index=${2}`
    });
    if (route != 'personal/pages/openVip/openVip' && route != 'classRoom/pages/order/order') return this.setData({
      types: 3,
      urls: `/personal/pages/orderIndex/order?type=${0}&index=${0}`
    });
  },
  // 判断跳转方式
  checkSkip() {
    if (this.data.types == 4) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.redirectTo({
        url: this.data.urls,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'======');
    if (options.buy) {
      this.setData({
        from: 'vip'
      })
    };
    if(options.fileId){
      this.setData({
        fileId: options.fileId
      })
    };
    if (wx.getStorageSync('wxPay')) {
      this.setData({
        payInfo: wx.getStorageSync('wxPay')
      })
    };
    this.leaveEnable()
    this.wxPay()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.judgeUrl()
  },
  // 点击左上角返回键返回时
  leavePage(e) {
    console.log(e, "点击左上角返回键返回时")
    this.setData({
      leftStatus: !e.detail
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (wx.getStorageSync('wxPay')) {
      wx.removeStorageSync('wxPay')
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 离开页面移除wxpay参数
    let leftStatus = this.data.leftStatus
    if (!leftStatus) {
      this.checkSkip()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})