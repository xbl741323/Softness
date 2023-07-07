// personal/pages/my-order/modify-price/modify-price.js
import {
  getModifyOrderDetail,
  getModifyOrderStatus,
  modifyOrder,
  validateAudit
} from "../../../../utils/api/order"
import {
  throttle
} from "../../../../utils/common/utils"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: "", // 订单编号
    payDepositStatus: 0, // 定金支付状态
    payFootStatus: 0, // 尾款支付状态
    cFootIndex: 0, // 尾款状态下标 0-尾款待定 1-尾款正常
    footStatusList: [{
        title: "尾款待定",
        value: 0
      },
      {
        title: "尾款正常",
        value: 1
      },
    ],
    orderModifyInfo: {
      totalAmount: 0, // 订单总价
      buyNum: 0 // 产品数量
    },
    orderType: 0, // 产品类型 0-产品订单
    cPayIndex: 0, // 0-定金尾款型 1-一次性付款型
    orderInfo: {},
    payDepositInfo: { // 定金
      payTypeId: 1,
      payTypeAmount: 0,
      payCostList: []
    },
    payFootInfo: { // 尾款
      payTypeId: 2,
      payTypeAmount: 0,
      payCostList: []
    },
    payDisposableInfo: { // 一次性付款
      payTypeId: 3,
      payTypeAmount: 0,
      payCostList: []
    },
    payWayList: [{
        title: "定金+尾款",
        value: 0
      },
      {
        title: "一次性付款",
        value: 1
      }
    ]
  },
  // 提交审核回调
  submitAudit(val) {
    let auditManInfo = val.detail.auditManInfo
    let auditRemark = val.detail.auditRemark
    let params = this.returnParams(true)
    params.handleBy = auditManInfo.userId // 审核人userId
    params.handleByNo = auditManInfo.number // 审核人number
    params.handleByName = auditManInfo.name // 审核人name
    params.changePriceRemark = auditRemark // 审核备注
    this.finalModifyOrderPrice(params)
  },
  // 显示弹窗
  showAuditTip() {
    this.selectComponent('#audit-tip').showTip()
  },
  // 尾款待定时修改尾款状态
  changeFootStatus(e) {
    let index = Number(e.detail.value)
    this.setData({
      cFootIndex: index
    })
    this.modifyTotalAmount()
  },
  // 定金-修改价格
  changeDepositPrice(e) {
    this.comonFixVal(1, e)
  },
  // 尾款-修改价格
  changeFootPrice(e) {
    this.comonFixVal(2, e)
  },
  // 一次性付款-修改价格
  changeDisposablePrice(e) {
    this.comonFixVal(3, e)
  },
  // 修改产品数量
  changeNum(e) {
    let orderModifyInfo = this.data.orderModifyInfo
    orderModifyInfo.buyNum = e.detail
    this.setData({
      orderModifyInfo: orderModifyInfo
    })
    this.modifyTotalAmount()
  },
  // 公共设置价格 1-定金 2-尾款 3-一次性付款
  comonFixVal(type, e) {
    let index = e.currentTarget.dataset.index
    let val = Number(e.detail.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')) // 保留两位小数
    if (type == 1) {
      let payDepositInfo = this.data.payDepositInfo
      payDepositInfo.payCostList[index].costAmount = val
      this.setData({
        payDepositInfo: payDepositInfo
      })
    }
    if (type == 2) {
      let payFootInfo = this.data.payFootInfo
      payFootInfo.payCostList[index].costAmount = val
      this.setData({
        payFootInfo: payFootInfo
      })
    }
    if (type == 3) {
      let payDisposableInfo = this.data.payDisposableInfo
      payDisposableInfo.payCostList[index].costAmount = val
      this.setData({
        payDisposableInfo: payDisposableInfo
      })
    }
    this.modifyTotalAmount()
  },
  // 修改总价
  modifyTotalAmount() {
    let cFootIndex = this.data.cFootIndex // 0-尾款待定 1-尾款确定
    let cPayIndex = this.data.cPayIndex
    let orderModifyInfo = this.data.orderModifyInfo
    let payDepositInfo = this.data.payDepositInfo
    let payFootInfo = this.data.payFootInfo
    let payDisposableInfo = this.data.payDisposableInfo
    let depositAmount = payDepositInfo.payCostList[0].costAmount + payDepositInfo.payCostList[1].costAmount + payDepositInfo.payCostList[2].costAmount
    let footAmount = payFootInfo.payCostList[0].costAmount + payFootInfo.payCostList[1].costAmount
    let disposableAmount = payDisposableInfo.payCostList[0].costAmount + payDisposableInfo.payCostList[1].costAmount + payDisposableInfo.payCostList[2].costAmount
    payDepositInfo.payTypeAmount = depositAmount
    payFootInfo.payTypeAmount = footAmount
    payDisposableInfo.payTypeAmount = disposableAmount
    orderModifyInfo.totalAmount = cPayIndex == 0 ? ((orderModifyInfo.buyNum) * (cFootIndex == 0 ? depositAmount : depositAmount + footAmount)) : (orderModifyInfo.buyNum) * (disposableAmount)
    this.setData({
      orderModifyInfo: orderModifyInfo,
      payDepositInfo: payDepositInfo,
      payFootInfo: payFootInfo,
      payDisposableInfo: payDisposableInfo,
    })
  },
  // 修改支付方式
  changePayWay(e) {
    this.setData({
      cPayIndex: Number(e.detail.value)
    })
    this.modifyTotalAmount()
  },
  // 数组筛选判断数值是否大于0
  filterArr(list) {
    let result = list.payCostList.filter(item => {
      return item.costAmount != 0
    })
    return result
  },
  // 价格判断-一次性付款型
  validateTotalAmount() {
    let payDisposableInfo = this.data.payDisposableInfo
    let resultDisposable = this.filterArr(payDisposableInfo)
    if (resultDisposable.length > 0) {
      this.modifyOrderPrice()
    } else {
      wx.showToast({
        icon: "none",
        title: '总价必须大于0！',
      })
    }
  },
  // 价格判断-定金尾款型
  validateConfirmAmount() {
    let cFootIndex = this.data.cFootIndex // 0-尾款待定 1-尾款确定
    let payDepositInfo = this.data.payDepositInfo
    let payFootInfo = this.data.payFootInfo
    let resulteposit = this.filterArr(payDepositInfo)
    let resultFoot = this.filterArr(payFootInfo)
    if ((cFootIndex == 0 && resulteposit.length > 0) || (cFootIndex == 1 && (resulteposit.length > 0 && resultFoot.length > 0))) {
      this.modifyOrderPrice()
    } else {
      wx.showToast({
        icon: "none",
        title: resulteposit.length == 0 ? '请输入定金！' : '请输入尾款！',
      })
    }
  },
  // 价格判断
  validateModifyAmount() {
    let cPayIndex = this.data.cPayIndex // 0-定金尾款型 1-一次性付款型
    cPayIndex == 0 ? this.validateConfirmAmount() : this.validateTotalAmount()
  },
  // 发起订单-防重复提交
  validateModify: throttle(function () {
    this.checkModifyStatus()
  }, 2000),
  // 尾款值返回
  getFootReturn() {
    let cFootIndex = this.data.cFootIndex // 0-尾款待定 1-尾款确定
    let payDepositInfo = this.data.payDepositInfo
    let payFootInfo = this.data.payFootInfo
    let cFootValue = {
      payTypeId: 2,
      payTypeAmount: 0,
      payCostList: [{
          costTypeId: 1,
          costAmount: 0
        },
        {
          costTypeId: 2,
          costAmount: 0
        }
      ]
    }
    if (cFootIndex == 0) {
      return [payDepositInfo, cFootValue]
    } else {
      return [payDepositInfo, payFootInfo]
    }
  },
  // 计算总价
  fixCheckTotal(list) {
    let totalAmount = 0
    list.forEach(item => {
      totalAmount = totalAmount + item.costAmount
    })
    console.log(totalAmount, "totalAmounttotalAmount")
    return totalAmount
  },
  // 检查定金项是否改动
  checkPriceStatus() {
    let payDepositInfo = this.data.payDepositInfo
    let orderInfo = this.data.orderInfo
    let originalInfo = orderInfo.payTypeVoList.filter(item => {
      return item.payTypeId == 1
    })
    let status = false
    if (originalInfo.length > 0) {
      let originalTotal = this.fixCheckTotal(originalInfo[0].payCostList)
      let updateTotal = this.fixCheckTotal(payDepositInfo.payCostList)
      payDepositInfo.payCostList.forEach(item => {
        originalInfo[0].payCostList.forEach(cItem => {
          if ((item.costTypeId == cItem.costTypeId) && (item.costAmount != cItem.costAmount) && (originalTotal != updateTotal)) {
            status = true
          }
        })
      })
    }
    return status
  },
  // 改价时当前订单状态
  checkModifyStatus() {
    let params = {
      orderId: this.data.orderId
    }
    getModifyOrderStatus(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let r = res.data
        let cPayIndex = this.data.cPayIndex
        let filterList = r.filter(item => {
          // 定金尾款型定金对公转账支付审核中
          return (item.payStatus == 1) && (item.payChannel == 1)
        })
        console.log(this.data.orderInfo, "orderInfo")
        let status = this.checkPriceStatus()
        if (filterList.length > 0) {
          // if ((status && cPayIndex == 0) || cPayIndex == 1) {
          //   wx.showToast({
          //     icon: "none",
          //     title: '修改失败，客户已支付定金！',
          //   })
          // } else {
            this.passCheck()
          // }
        } else {
          this.passCheck()
        }
      }
    })
  },
  // 订单状态检查通过
  passCheck() {
    let orderInfo = this.data.orderInfo
    let cPayIndex = this.data.cPayIndex // 0-定金尾款型 1-一次性付款型
    let payDepositStatus = this.data.payDepositStatus
    if (cPayIndex == 1 && orderInfo.orderStatus == 0 && payDepositStatus == 1) {
      wx.showToast({
        icon: "none",
        title: '对公转账审核中，不可改价！',
      })
    } else {
      this.validateModifyAmount()
    }
  },
  // 返回参数
  returnParams(status) {
    let cPayIndex = this.data.cPayIndex // 0-定金尾款型 1-一次性付款型
    let orderInfo = this.data.orderInfo
    let orderModifyInfo = this.data.orderModifyInfo
    let payDisposableInfo = this.data.payDisposableInfo
    let params = {
      id: orderInfo.id,
      subjectName: orderInfo.subjectName,
      orderStatus: orderInfo.orderStatus,
      originalPrice: orderInfo.totalAmount,
      currentPrice: orderModifyInfo.totalAmount,
      buyNum: orderModifyInfo.buyNum,
      payTypeVoList: cPayIndex == 0 ? this.getFootReturn() : [payDisposableInfo]
    }
    if (status) {
      params.orderNo = orderInfo.orderNo
      params.goodsSkuId = orderInfo.goodsSkuId
    }
    return params
  },
  // 最终订单改价
  finalModifyOrderPrice(params) {
    let that = this
    that.lastfinalModifyOrderPrice(params)
  },
  // 最终订单改价
  lastfinalModifyOrderPrice(params) {
    modifyOrder(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: '修改完成！',
        })
        setTimeout(() => {
          wx.redirectTo({
            url: `/personal/pages/my-order/list/list?type=${0}`,
          })
        }, 500)
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  },
  // 订单改价判断是否需要审核人
  modifyOrderPrice() {
    let params = this.returnParams(true)
    let newParams = {
      tmOrderVoList: [params],
    }
    validateAudit(newParams).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let status = res.data // 是否通过校验 true没通过 false通过
        if (status) {
          this.showAuditTip() // 没通过弹窗
        } else {
          let that = this
          wx.showModal({
            title: "确定保存修改？",
            cancelColor: "#A5A5A5",
            cancelText: "取消",
            confirmColor: "#0082FC",
            confirmText: "确定",
            success(res) {
              if (res.confirm) {
                that.finalModifyOrderPrice(params) // 通过校验直接调用改价接口
              } else if (res.cancel) {}
            }
          })
        }
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  },
  // 费用赋值 payType-支付类型 1:定金；2:尾款；3:一口价 
  // costType-费用类型 1:代理费；2:第三方费用；3:官费；4:待定
  filterCostList(payCostList) {
    let costList = [{
        costTypeId: 1,
        costAmount: 0
      },
      {
        costTypeId: 2,
        costAmount: 0
      },
      {
        costTypeId: 3,
        costAmount: 0
      }
    ]
    payCostList.forEach(item => {
      item.costTypeId == 1 ? costList[0].costAmount = item.costAmount : ""
      item.costTypeId == 2 ? costList[1].costAmount = item.costAmount : ""
      item.costTypeId == 3 ? costList[2].costAmount = item.costAmount : ""
    })
    return costList
  },
  // 获取订单详情数据
  getOrderDetal() {
    let temCostList = [{
        costTypeId: 1,
        costAmount: 0
      },
      {
        costTypeId: 2,
        costAmount: 0
      },
      {
        costTypeId: 3,
        costAmount: 0
      }
    ]
    let orderModifyInfo = this.data.orderModifyInfo
    let payDepositInfo = this.data.payDepositInfo
    let payFootInfo = this.data.payFootInfo
    let payDisposableInfo = this.data.payDisposableInfo
    payDepositInfo.payCostList = temCostList
    payFootInfo.payCostList = [{
        costTypeId: 1,
        costAmount: 0
      },
      {
        costTypeId: 2,
        costAmount: 0
      },
    ]
    payDisposableInfo.payCostList = temCostList
    let params = {
      orderId: this.data.orderId
    }
    getModifyOrderDetail(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let result = res.data
        orderModifyInfo.buyNum = result.buyNum
        orderModifyInfo.totalAmount = result.totalAmount
        result.payTypeVoList.forEach((item) => {
          item.payTypeId == 1 ? payDepositInfo.payCostList = this.filterCostList(item.payCostList) : ""
          item.payTypeId == 2 ? payFootInfo.payCostList = this.filterCostList(item.payCostList).slice(0, 2) : ""
          item.payTypeId == 3 ? payDisposableInfo.payCostList = this.filterCostList(item.payCostList) : ""
          if (result.orderStatus == 0) {
            if (item.payTypeId == 1) {
              this.setData({
                payDepositStatus: item.payStatus
              })
            }
          } else {
            if (item.payTypeId == 2) {
              this.setData({
                payFootStatus: item.payStatus
              })
            }
          }
          if (item.payTypeId == 3) {
            this.setData({
              payDepositStatus: item.payStatus
            })
          }
        })
        this.setData({
          orderInfo: result,
          cPayIndex: result.payTypeVoList.length == 1 ? 1 : 0,
          payDepositInfo: payDepositInfo,
          payFootInfo: payFootInfo,
          payDisposableInfo: payDisposableInfo,
          orderModifyInfo: orderModifyInfo,
          cFootIndex: result.tailStatus == 0 ? 0 : 1
        })
        this.modifyTotalAmount()
      }
    })
  },
  // 设置orderId信息
  setOrderInfo(options) {
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      })
      this.getOrderDetal()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setOrderInfo(options)
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

  }
})