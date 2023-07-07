// components/personal/myorder/propertyorder/propertyorder.js
import {
  cancelOrder,
} from "../../../../utils/api/order.js"
import {
  cancelRefund,
} from "../../../../utils/api/refund"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propertyitem: {
      type: Object,
      value: {}
    },
    whichIndex: {
      type: Number,
      value: 0
    },
    refundStatus: { // true:是退款状态订单 false:不是
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    // 去订单详情
    toDeatil(e) {
      if (this.data.refundStatus) {
        // 退款状态订单点击进入退款详情
        this.toRefundDetail()
      } else {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/personal/pages/orderPropertyDetail/orderPropertyDetail?id=' + id,
        })
      }
    },
    // 跳转提交订单页面
    submitPay(e) {
      let order = e.currentTarget.dataset.order
      console.log(order, "order")
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
    // 取消订单确认弹框
    cancelOperete(e) {
      let that = this
      let order = e.currentTarget.dataset.order
      wx.showModal({
        title: order.orderStatus == 7 ? "确定删除？" : "确定取消？",
        cancelColor: "#36A6FE",
        cancelText: "再想想",
        confirmColor: "#999999",
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            that.delOrder(order)
          } else if (res.cancel) {}
        }
      })
    },
    // 取消订单操作
    delOrder(val) {
      let params = {
        id: val.id,
        orderStatus: val.orderStatus == 7 ? 8 : 7,
        accountId: this.data.userInfo.accountId,
        orderNo: val.orderNo,
        productName: val.orderDetailVO.productName
      }
      cancelOrder(params).then(res => {
        if (res.code == 0) {
          this.triggerEvent('refresh', {
            whichIndex: this.data.whichIndex
          })
        }
      })
    },
    // 审核不通过原因
    showAudit() {
      wx.showModal({
        title: `审核不通过原因：${this.data.propertyitem.voucher.refuseReason}`,
        content: "对公转账审核不通过，您可点击“立即支付”按钮， 再次提交正确的转账凭证或选择其他方式付款。",
        showCancel: false,
      })
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
      let propertyitem = this.data.propertyitem
      let data = {
        refundNo: propertyitem.taskNo
      }
      cancelRefund(data).then(res => {
        if (res.code == 0) {
          this.triggerEvent('refresh', {
            whichIndex: this.data.whichIndex
          })
        } else if (res.code == 1) {
          wx.showToast({
            icon: "none",
            title: res.msg,
          })
        }
      })
    },
    // 跳转到退款详情页面
    toRefundDetail() {
      let refundNo = this.data.propertyitem.taskNo
      wx.navigateTo({
        url: `/order/pages/refund/refundDetail/refundDetail?refundNo=${refundNo}&pageFrom=${1}`,
      })
    },
    // 跳转到退款详情页面
    toRefundDetail() {
      let refundNo = this.data.propertyitem.taskNo
      wx.navigateTo({
        url: `/order/pages/refund/refundDetail/refundDetail?refundNo=${refundNo}&pageFrom=${1}`,
      })
    },
  },
  lifetimes:{
    attached: function () {
      if (wx.getStorageSync('userInfo')) {
        this.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
      }
      console.log(11111,'----------');
    }
  }
})