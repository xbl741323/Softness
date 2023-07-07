// personal/pages/orderPropertyDetail/orderPropertyDetail.js
const app = getApp();
import {
  getOrderDetail,
  getOrderProgress,
  cancelOrder,
} from "../../../utils/api/order"
import {
  getAddressList
} from "../../../utils/api/address"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultAddress: {},
    endOriginal: 0,
    endIndex: 3,
    taskMore: ['查看更多', '收起'],
    processList: [],
    taskList: [],
    loading: true,
    imageUrl: app.globalData.imageURL,
    userInfo: {},
    transfer: {
      stataus: true
    },
    progressList: [{
        title: "提交订单",
        stataus: 2,
        langStatus: true,
        time: ""
      },
      {
        title: "支付订单",
        stataus: 0,
        langStatus: true,
        time: ""
      },
      {
        title: "待签约", // 数据待对接
        stataus: 0,
        langStatus: false,
        time: ""
      },
      {
        title: "提供服务",
        stataus: 0,
        langStatus: true,
        time: ""
      },
      {
        title: "服务完成",
        stataus: 0,
        langStatus: true,
        time: ""
      }
    ],
    orderInfo: {},
  },
  // 查看合同
  checkContract() {
    wx.showLoading({
      title: '加载中...',
    })
    let url = this.data.imageUrl + this.data.orderInfo.attachmentUrl
    wx.downloadFile({
      url: url,
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          fileType: "pdf",
          showMenu: true,
          success: () => {
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      }
    })
  },
  // 去签约
  toSign() {
    let userInfo = this.data.userInfo
    let that = this
    if (userInfo.certificationStatus !== '1') {
      wx.showModal({
        title: "认证提醒",
        content: "由于您的身份未认证，暂时无法进行签约操作。 为了给您提供更好的服务，请尽快完成认证",
        cancelColor: "#999999",
        cancelText: "放弃认证",
        confirmColor: "#36A6FE",
        confirmText: "去认证",
        success(res) {
          if (res.confirm) {
            that.toCertify()
          } else if (res.cancel) {}
        }
      })
    } else {
      // 去签约-待对接
    }
  },
  // 跳转去认证页面
  toCertify() {
    let userInfo = this.data.userInfo
    wx.navigateTo({
      url: '/personal/pages/authentication/authentication?accountType=' + userInfo.accountType + '&status=' + userInfo.accountType,
    })
  },
  // 跳转知产详情
  toProductDetail() {
    let id = this.data.orderInfo.orderDetailVO.productId
    wx.navigateTo({
      url: `/search/pages/propertyDetail/propertyDetail?propertyId=${id}`,
    })
  },
  // 1:任务列表收起，0:查看更多
  changeTask(e) {
    let index = e.currentTarget.dataset.index
    if (index == 0) {
      this.setData({
        endOriginal: this.data.endOriginal + 10,
        endIndex: this.data.endOriginal + 10
      })
    } else {
      this.setData({
        endIndex: 3,
        endOriginal: 0
      })
    }
  },
  // 显示任务进度弹窗
  showTask(e) {
    let val = e.currentTarget.dataset.task
    let params = {
      id: val.id,
      workflowName: val.workflowName,
      taskStatus: val.taskStatus,
      productName: this.data.orderInfo.orderDetailVO.productName
    }
    let data = JSON.stringify(params)
    wx.navigateTo({
      url: `/personal/pages/taskProgress/taskProgress?data=${data}`,
    })
  },

  // 筛选订单状态状态
  filterProgress(index, time, finishTime) {
    let progressList = this.data.progressList
    progressList[index].time = time
    if (index == 2) {
      // 待对接状态待对接
      progressList[index].stataus = finishTime == '' ? 0 : time == '' ? 1 : 2
      progressList[index].langStatus = finishTime == '' ? false : true
    } else if (index == 3) {
      progressList[index].stataus = time == '' ? 0 : finishTime == '' ? 1 : 2
      progressList[index].title = time == '' ? '提供服务' : "服务中"
      progressList[index].langStatus = time == '' ? false : true
    } else {
      progressList[index].stataus = time == '' ? 0 : 2
      progressList[index].langStatus = time == '' ? false : true
    }
    return progressList[index]
  },
  // 显示loading效果
  showLoading(flag) {
    if (flag) {
      wx.showLoading({
        title: '加载中！',
      })
    } else {
      wx.hideLoading({
        success: (res) => {
          this.setData({
            loading: false
          })
        },
      })
    }
  },
  // 获取订单详情信息
  getData(id) {
    this.showLoading(true)
    let params = {
      orderId: id
    }
    // 获取订单相关信息
    getOrderDetail(params).then(res => {
      if (res.code == 0) {
        this.setData({
          orderInfo: res.data,
          taskList: res.data.taskList !== null ? res.data.taskList : [],
          tabIndex: res.data.taskList !== null ? (res.data.taskList.length > 0 ? 0 : 1) : 1
        })
      }
    })
    // 获取订单进度条信息
    getOrderProgress(params).then(res => {
      if (res.code == 0) {
        let result = res.data
        let progressList = this.data.progressList
        progressList[0] = this.filterProgress(0, result.submit)
        progressList[1] = this.filterProgress(1, result.pay)
        progressList[2] = this.filterProgress(2, result.signTime, result.pay)
        progressList[3] = this.filterProgress(3, result.taskTime, result.finsh)
        progressList[4] = this.filterProgress(4, result.finsh)
        this.setData({
          progressList: progressList
        })
        this.showLoading(false)
      }
    })
  },
  // 取消订单确认弹框
  cancelOperete() {
    let order = this.data.orderInfo
    let that = this
    wx.showModal({
      title: order.orderStatus == 7 ? "确定删除？" : "确定取消？",
      cancelColor: "#36A6FE",
      cancelText: "再想想",
      confirmColor: "#999999",
      confirmText: "确定",
      success(res) {
        if (res.confirm) {
          that.delOrder()
        } else if (res.cancel) {}
      }
    })
  },
  // 取消订单操作
  delOrder() {
    let order = this.data.orderInfo
    let params = {
      id: order.id,
      orderStatus: order.orderStatus == 7 ? 8 : 7,
      accountId: this.data.userInfo.accountId,
      orderNo: order.orderNo,
      productName: order.orderDetailVO.productName
    }
    cancelOrder(params).then(res => {
      if (res.code == 0) {
        wx.navigateTo({
          url: `/personal/pages/orderIndex/order?type=${0}`,
        })
      }
    })
  },
  // 跳转提交订单页面
  submitPay() {
    let order = this.data.orderInfo
    let params = {
      pageFrom: 0, // 0 代表从订单列表及详情进
      paymentType: order.paymentType, // 支付方式
      orderNo: order.orderNo, // 订单编号
      orderId: order.id, // 订单id
      id: order.orderDetailVO.id, // 产品id
      number: order.orderDetailVO.productNo, // 产品number
      agencyFee: order.orderDetailVO.agencyFee, // 产品agencyFee
      thirdPartyFee: order.orderDetailVO.thirdPartyFee, // 产品thirdPartyFee
      trustGmFee: order.orderDetailVO.governmentFee, // 产品governmentFee
      trustGmFeeTypeId: order.orderDetailVO.governmentFeeId, // 官费代缴id
      trustGmFeeTypeName: order.orderDetailVO.governmentName, // 官费代缴name
      coverUrl: order.orderDetailVO.coverUrl, // 封面
      productName: order.orderDetailVO.productName, // 产品名称
      nowFee: order.orderDetailVO.nowFee, // 现价
      feeType: order.orderDetailVO.feeType, // 费用类型
      productCount: order.orderDetailVO.productCount, // 选择的产品数量
      productType: order.orderDetailVO.productType, // 产品类型
      governmentFee: order.orderDetailVO.governmentReduceFee,
      hasPublicExpense: order.orderDetailVO.governmentFee !== null ? 0 : 1, // 是否添加官费
      totalPrice: order.totalAmount // 总价
    }
    wx.setStorageSync('addressId', order.receiveAddressId)
    let data = JSON.stringify(params)
    wx.navigateTo({
      url: `/order/pages/submitOrder/propertyOrder/propertyOrder?data=${data}`,
    })
  },
  // 判断选择当前订单收件地址
  filterAddresss(list) {
    let orderInfo = this.data.orderInfo
    let result = list.filter((item) => {
      return item.id == orderInfo.receiveAddressId
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
  },
  // 获取收件地址信息
  getAddressData() {
    let id = this.data.userInfo.accountId
    let params = {
      accountId: id
    }
    getAddressList(params).then(res => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          this.filterAddresss(res.data)
        }
      }
    })
  },
  // 跳转到提交退款页面
  toSubmitRefund() {
    let orderInfo = this.data.orderInfo
    let data = {
      orderId: orderInfo.id,
      orderNo: orderInfo.orderNo,
      productName: orderInfo.orderDetailVO.productName,
      productCount: orderInfo.orderDetailVO.productCount,
      payType: orderInfo.paymentType, // 支付方式 0-支付宝 1-对公转账
      productSubType: orderInfo.orderDetailVO.productSubType, // 知产分类类型，用于判断封面
      nowFee: orderInfo.orderDetailVO.nowFee, // 单价（不包含官费）
      governmentFee: orderInfo.orderDetailVO.governmentReduceFee, // 官费单价
      isWaitSign: orderInfo.orderStatus == 9 ? true : false, // 是否是待签约状态 true-是 false-否
    }
    if (orderInfo.orderDetailVO.governmentFeeId) {
      data.isHaveGover = Number(orderInfo.orderDetailVO.governmentFeeId) == 0 ? false : true // 是否有官费 true-有 false-没有
    } else {
      data.isHaveGover = false
    }
    let refundInfo = JSON.stringify(data)
    wx.navigateTo({
      url: `/order/pages/refund/property/submitRefund/submitRefund?data=${refundInfo}`,
    })
  },
  // 跳转到退款详情页面
  toRefundDetail() {
    let refundNo = this.data.orderInfo.taskNo
    wx.navigateTo({
      url: `/order/pages/refund/refundDetail/refundDetail?refundNo=${refundNo}&pageFrom=${1}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id)
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
    if (this.selectComponent("#wx")) {
      this.selectComponent("#wx").getUserData()
    }
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