// order/pages/refund/refundDetail/refundDetail.js
import {
  getRefundDetail,
  cancelRefund,
  getShowSubmitBtn
} from "../../../../utils/api/refund"
import {
  getOrderDetail
} from "../../../../utils/api/order"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showReStatus: false, // 是否显示重新提交退款按钮 true-显示 false-不显示
    showFlag: false,
    pageFrom: "", // 0：从其它页面来 1：从订单列表来
    refundInfo: {},
    orderInfo: {}
  },
  // 撤销退款申请弹窗
  cancelRefundOperate() {
    let that = this
    wx.showModal({
      title: "撤销退款申请",
      content: "您将撤销本次申请，如果问题未解决，您还可以再次发起。确定撤销吗？",
      cancelColor: "#999999",
      cancelText: "再想想",
      confirmColor: "#36A6FE",
      confirmText: "撤销申请",
      success(res) {
        if (res.confirm) {
          that.cancelRefund()
        } else if (res.cancel) {}
      }
    })
  },
  // 撤销退款接口调用
  cancelRefund() {
    let refundInfo = this.data.refundInfo
    let data = {
      refundNo: refundInfo.taskNo
    }
    cancelRefund(data).then(res => {
      if (res.code == 0) {
        this.getRefundData(this.data.refundNo)
      } else if (res.code == 1) {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  },
  // 获取订单详情信息
  getData(id) {
    let params = {
      orderId: id
    }
    // 获取订单相关信息
    getOrderDetail(params).then(res => {
      if (res.code == 0) {
        this.setData({
          orderInfo: res.data,
          showFlag: true
        })
      }
    })
  },
  // 重新申请退款-跳转到提交退款页面
  toSubmitRefund() {
    if (this.data.orderInfo.orderType == 1) {
      this.refundProject()
    } else {
      this.refundProperty()
    }
  },
  refundProject() {
    let orderInfo = this.data.orderInfo
    let payMessageList = orderInfo.payMessageList
    let payTypeList = []
    let result1 = payMessageList.filter(item => {
      return item.policyFeeType == 0
    })
    let result2 = payMessageList.filter(item => {
      return item.policyFeeType == 1
    })
    if (result1.length > 0) {
      payTypeList.push(result1[0])
    }
    if (result2.length > 0) {
      payTypeList.push(result2[0])
    }
    let data = {
      orderId: orderInfo.id,
      orderNo: orderInfo.orderNo,
      productName: orderInfo.orderDetailVO.productName,
      productCount: orderInfo.orderDetailVO.productCount,
      coverUrl: orderInfo.orderDetailVO.coverUrl,
      earnestMoney: orderInfo.orderDetailVO.earnestMoney,
      nowFee: orderInfo.orderDetailVO.nowFee,
      payTypeList: payTypeList, // 返回支付方式信息
      refundType: orderInfo.orderDetailVO.tailStatus, // 0:只能退定金 1:能退定金和尾款
      governmentFee: orderInfo.orderDetailVO.governmentReduceFee, // 官费单价
      isHaveGover: Number(orderInfo.orderDetailVO.governmentFeeId) == 0 ? false : true, // 是否有官费 true-有 false-没有
      isWaitSign: orderInfo.orderStatus == 9 ? true : false, // 是否是待签约状态 true-是 false-否
    }
    let refundInfo = JSON.stringify(data)
    wx.navigateTo({
      url: `/order/pages/refund/project/submitRefund/submitRefund?data=${refundInfo}`,
    })
  },
  refundProperty() {
    let orderInfo = this.data.orderInfo
    let data = {
      orderId: orderInfo.id,
      orderNo: orderInfo.orderNo,
      productName: orderInfo.orderDetailVO.productName,
      productCount: orderInfo.orderDetailVO.productCount,
      payType: orderInfo.paymentType, // 支付方式 0-支付宝 1-对公转账
      productSubType: orderInfo.orderDetailVO.productSubType, // 知产分类类型，用于判断封面
      nowFee: orderInfo.orderDetailVO.nowFee, // 单价（不包含官费）
      governmentFee: orderInfo.orderDetailVO.governmentReduceFee, // 官费总价
      isHaveGover: Number(orderInfo.orderDetailVO.governmentFeeId) == 0 ? false : true, // 是否有官费 true-有 false-没有
      isWaitSign: true, // 是否是待签约状态 true-是 false-否
    }
    let refundInfo = JSON.stringify(data)
    wx.navigateTo({
      url: `/order/pages/refund/property/submitRefund/submitRefund?data=${refundInfo}`,
    })
  },
  // 获取退款详情数据
  getRefundData(refundNo) {
    wx.showLoading();
    let data = {
      refundNo: refundNo
    }
    getRefundDetail(data).then(res => {
      if (res.code == 0) {
        this.setData({
          refundInfo: res.data,
          refundNo: refundNo
        })
        // 获取订单信息
        this.getData(res.data.orderId)
        this.getRefundStatus(res.data.orderNo)
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  getRefundStatus(orderNo) {
    let params = {
      orderNo: orderNo
    }
    getShowSubmitBtn(params).then(res => {
      if (res.code == 0) {
        if (res.data.taskStatus == '1' || res.data.taskStatus == '5') {
          this.setData({
            showReStatus: true
          })
        }
        console.log(this.data.showReStatus, "showReStatus")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRefundData(options.refundNo)
    this.setData({
      pageFrom: options.pageFrom
    })
    console.log(options)
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.pageFrom !== '1') {
      wx.navigateTo({
        url: `/personal/pages/orderIndex/order?type=${3}`,
      })
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