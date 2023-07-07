// order/pages/submitOrder/propertyOrder/propertyOrder.js
const app = getApp();
import {
  getOpenId,
  layout
} from "../../../../utils/api"
import {
  submitOrder,
  submitToPay
} from "../../../../utils/api/order"
import {
  getAddressList
} from "../../../../utils/api/address"
import {
  throttle
} from "../../../../utils/common/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 微信支付参数
    wxInfo: {},
    dialogStatus: true,
    orderNo: "",
    // 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 10,
    // 跳转到对公转账支付页要带的信息
    transferInfo: {},
    defaultAddress: {},
    userInfo: {},
    orderInfo: {},
    imageUrl: app.globalData.imageURL,
    agreementStatus: false,
    checkedIndex: 1,
    payList: [{
        url: "/order/image/orders/transfar_pay.png",
        title: "线下对公转账支付",
        index: 1
      },
      {
        url: "/order/image/orders/bao_pay.png",
        title: "支付宝支付",
        index: 0
      },
      {
        url: "/order/image/orders/weixin_icon.png",
        title: "微信支付",
        index: 2
      }
    ]
  },
  // 总价计算
  totalFix(count) {
    let cOrderInfo = this.data.orderInfo
    let type = cOrderInfo.feeType // type 产品价格类型 2：仅官费  否则：其他
    let governmentFee = cOrderInfo.governmentFee // governmentFee 此处仅表示官费代缴费用
    let nowFee = cOrderInfo.nowFee // nowFee 现单价
    if (type == 2) {
      return count * (Number(nowFee))
    } else {
      return count * (Number(nowFee) + Number(governmentFee))
    }
  },
  // 修改产品数量
  setCount(val) {
    console.log(val)
    let status = val.detail
    let cOrderInfo = this.data.orderInfo
    if (status) {
      if (cOrderInfo.productCount < 99) {
        cOrderInfo.productCount += 1
        cOrderInfo.totalPrice = this.totalFix(cOrderInfo.productCount)
        this.setData({
          orderInfo: cOrderInfo
        })
        if (cOrderInfo.totalPrice > 600000 && this.data.checkedIndex == 2) {
          this.setData({
            checkedIndex: 0
          })
        }
      }
    } else {
      if (cOrderInfo.productCount > 1) {
        cOrderInfo.productCount -= 1
        cOrderInfo.totalPrice = this.totalFix(cOrderInfo.productCount)
        this.setData({
          orderInfo: cOrderInfo
        })
        if (cOrderInfo.totalPrice > 600000 && this.data.checkedIndex == 2) {
          this.setData({
            checkedIndex: 0
          })
        }
      }
    }
  },
  againPay() {
    if (this.data.checkedIndex == 1) {
      // 选择对公转账支付
      this.skipToPay();
    } else if (this.data.checkedIndex == 0) {
      // 选择支付宝支付
      this.checkPayWay()
    } else {
      // 跳转微信支付
      this.checkPayWay()
    }
  },
  // 跳转对公转账支付页
  toPay: throttle(function () {
    if (this.data.defaultAddress.id) {
      if (this.data.agreementStatus) {
        if (this.data.orderInfo.pageFrom == 0) {
          // 从订单页面过来分两种情况判断
          this.againPay();
        } else {
          // 从产品页面过来先提交订单再跳转支付页面
          this.checkPayWay()
        }
      } else {
        wx.showToast({
          icon: "none",
          title: '请勾选《卧涛网交易服务协议》！',
        })
      }
    } else {
      wx.showToast({
        icon: "none",
        title: '请添加收件地址！',
      })
    }
  }, 3000),
  // 改变支付方式 0：支付宝 1：线下对公转账支付
  changePay(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      checkedIndex: index
    })
  },
  // 是否同意《卧涛网交易服务协议》 true：同意 false：不同意
  changeAgreement(e) {
    let status = e.currentTarget.dataset.status
    console.log(status)
    this.setData({
      agreementStatus: status
    })
  },
  // 从产品详情页（订单页）进入本页面时对orderInfo赋值
  setOrderInfo(data) {
    this.setData({
      orderInfo: data
    })
    // console.log(this.data.orderInfo, "输出订单信息！")
  },
  // 判断选择地址
  filterAddresss(list) {
    // 判断是否存储地址id，是则取用
    if (wx.getStorageSync('addressId')) {
      let id = wx.getStorageSync('addressId')
      console.log(id, "输出存储的id")
      let result = list.filter((item) => {
        return item.id == id
      })
      console.log(result, "输出result")
      this.setData({
        defaultAddress: result[0]
      })
      // 不是取用数组isDefault为1的数据
    } else {
      let result = list.filter((item) => {
        return item.isDefault == 1
      })
      if (result.length > 0) {
        this.setData({
          defaultAddress: result[0]
        })
      } else {
        this.setData({
          defaultAddress: list[0]
        })
      }
    }
  },
  // 获取收件地址
  getAddressData() {
    let params = {
      accountId: wx.getStorageSync('userInfo').accountId
    }
    getAddressList(params).then(res => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          this.filterAddresss(res.data)
        }
      }
    })
  },
  // 跳转到支付页
  skipToPay() {
    if (this.data.checkedIndex == 1) {
      // 跳转对公转账支付页
      let data = JSON.stringify(this.data.transferInfo)
      wx.navigateTo({
        url: `/order/pages/orderPay/transferPay/transferPay?data=${data}`,
      })
    } else if (this.data.checkedIndex == 0) {
      // 跳转支付宝支付页
      let pageFrom = this.data.orderInfo.pageFrom
      let orderNo = pageFrom == 0 ? this.data.orderNo : this.data.transferInfo.orderNo
      wx.navigateTo({
        url: `/order/pages/orderPay/baoPay/baoPay?orderNo=${orderNo}`,
      })
    } else {
      // 跳转微信支付
      let wxInfo = this.data.wxInfo
      wx.setStorageSync('wxPay', wxInfo)
      wx.navigateTo({
        url: `/order/pages/orderPay/wxPay/wxPay`,
      })
    }
  },
  // 判断支付方式 0-支付宝 1-对公转账 2-微信支付
  checkPayWay() {
    let checkedIndex = this.data.checkedIndex
    let that = this
    if (checkedIndex == 2) {
      wx.login({
        success: function (res) {
          let params = {
            code: res.code,
            accountId: wx.getStorageSync('accountId')
          }
          getOpenId(params).then(res => {
            if (res.code == 0) {
              that.submitOrderData()
            } else {
              // 调用注销接口强制退出
              that.layoutAccount()
            }
          })
        }
      })
    } else {
      this.submitOrderData()
    }
  },
  // 注销退出
  layoutAccount() {
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
  submitOrderData() {
    let id = this.data.userInfo.accountId
    let orderInfo = this.data.orderInfo
    let params = {
      orderSource: 1, // 线上
      platformSource: 2, // 0：PC端，1：移动端，2：小程序，3：App
      orderStatus: 6, // 待付款
      productCount: orderInfo.productCount,
      receiveAddressId: this.data.defaultAddress.id,
      accountId: id,
      paymentType: this.data.checkedIndex, // 0-支付宝 1-对公转账 2-微信支付
      orderType: 0, // 订单类型 0 知识产权 1 项目申报
      productName: orderInfo.productName,
      productSubType: orderInfo.productType, // 1-专利 2-商标 3-版权 4-其他 
      productNo: orderInfo.number,
      productId: orderInfo.id,
      agencyFee: Number(orderInfo.agencyFee) !== 0 ? Number(orderInfo.agencyFee) + Number(orderInfo.thirdPartyFee) : "",
      governmentFee: Number(orderInfo.governmentFee) !== 0 ? Number(orderInfo.governmentFee) : "",
      totalAmount: orderInfo.totalPrice,
    }
    // 从订单页面过来采用支付宝支付传订单编号orderNo
    if (this.data.orderInfo.pageFrom == 0) {
      params.orderNo = orderInfo.orderNo
      params.id = orderInfo.orderId
    }
    if (orderInfo.trustGmFeeTypeId !== "") {
      params.governmentFeeId = orderInfo.trustGmFeeTypeId
      params.governmentName = orderInfo.trustGmFeeTypeName
    }
    if (this.data.orderInfo.pageFrom == 1) {
      // 首次提交订单
      this.firstToPayOroder(params)
    } else {
      // 待付款去支付
      this.submitToPayOrder(params)
    }
  },
  // 首次提交订单
  firstToPayOroder(params) {
    submitOrder(params).then(res => {
      if (res.code == 0) {
        let r = res.data
        let orderInfo = this.data.orderInfo
        let info = {
          orderNo: r.orderNo,
          productName: orderInfo.productName,
          totalPrice: orderInfo.totalPrice,
        }
        let newParams = params
        newParams.orderNo = r.orderNo
        newParams.id = r.id
        this.setData({
          transferInfo: info
        })
        this.submitToPayOrder(newParams)
      } else if (res.code == 50000) {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
        setTimeout(() => {
          wx.navigateTo({
            url: `/personal/pages/orderIndex/order?type=${0}`,
          })
        }, 1000)
      }
    })
  },
  // 待付款去支付
  submitToPayOrder(params) {
    submitToPay(params).then(res => {
      if (res.code == 0) {
        let r = res.data
        wx.showToast({
          title: '提交成功！',
        })
        if (this.data.checkedIndex == 2) {
          this.setData({
            wxInfo: r.wxPaymentParams
          })
        }
        setTimeout(() => {
          this.skipToPay()
        }, 100)
      } else if (res.code == 50000) {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
        setTimeout(() => {
          wx.navigateTo({
            url: `/personal/pages/orderIndex/order?type=${0}`,
          })
        }, 100)
      }
    })
  },
  // 回显支付方式
  getPayInfo(data) {
    if (data.pageFrom == 0) {
      let info = {
        orderNo: data.orderNo,
        productName: data.productName,
        totalPrice: data.totalPrice,
        categoryId: data.categoryId?data.categoryId:data.type,
      }
      this.setData({
        orderNo: data.orderNo,
        transferInfo: info,
        checkedIndex: data.paymentType
      })
    }
  },
  closeDialog(e) {
    this.setData({
      dialogStatus: e.detail
    })
    if (!e.detail) {
      wx.disableAlertBeforeUnload({
        success: (res) => {},
      })
    } else {
      let pageFrom = this.data.orderInfo.pageFrom
      let msg = pageFrom == 1 ? '是否取消订单' : '是否放弃支付'
      wx.enableAlertBeforeUnload({
        message: `${msg}，返回上一级页面？`,
      })
    }
  },
  // 离开页面弹框（手势离开）
  leaveEnable() {
    let pageFrom = this.data.orderInfo.pageFrom
    let msg = pageFrom == 1 ? '是否取消订单' : '是否放弃支付'
    wx.enableAlertBeforeUnload({
      message: `${msg}，返回上一级页面？`,
    })
  },
  // 跳转知产交易服务协议
  toAgreement() {
    wx.navigateTo({
      url: '/order/pages/tsAgreement/propertyTa/propertyTa',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(options.data)
    this.getPayInfo(data)
    this.setOrderInfo(data)
    if (this.data.dialogStatus) {
      this.leaveEnable();
    }
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
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
    this.getAddressData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('生命周期函数--监听页面隐藏')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('addressId')
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