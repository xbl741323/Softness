// order/pages/refund/submitRefund/submitRefund.js
const app = getApp();
import {
  submitRefund,
  getRefundReason
} from "../../../../../utils/api/refund"
import {
  throttle
} from "../../../../../utils/common/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundCount: 1, // 选择的退款数量
    imageUrl: app.globalData.imageURL,
    userInfo: {},
    refundInfo: {},
    cReasonIndex: "",
    cReasonDesc: "",
    refundDesc: "", // 退款说明
    show: true,
    serviceList: [{
      title: "服务费-定金",
      maxValue: 0,
      value: 0,
      checked: false,
    }, {
      title: "服务费-尾款",
      maxValue: 0,
      value: 0,
      checked: false,
    }],
    govermentInfo: {
      title: "官费",
      maxValue: 0,
      value: 0,
      checked: false,
    },
    optionList: []
  },
  // 退款选择操作
  selectFee(e) {
    let refundInfo = this.data.refundInfo
    // 待签约状态不能更改退款价格
    if (!refundInfo.isWaitSign) {
      let index = e.currentTarget.dataset.index
      let serviceList = this.data.serviceList
      serviceList[index].checked = !serviceList[index].checked
      this.setData({
        serviceList: serviceList
      })
    }
  },
  // 显示选择弹窗
  showAction() {
    this.setData({
      show: false
    })
  },
  // 关闭选择弹窗
  closeAction() {
    this.setData({
      show: true
    })
  },
  // 选择退款原因
  selectOption(e) {
    let index = e.currentTarget.dataset.index
    let optionList = this.data.optionList
    optionList.forEach((item) => {
      item.checked = false
    })
    optionList[index].checked = true
    this.setData({
      optionList: optionList,
      cReasonIndex: index,
      cReasonDesc: optionList[index].dropdownValue,
    })
  },
  // 点击确定时显示退款原因
  submitReasonSelect() {
    let cReasonIndex = this.data.cReasonIndex
    if (cReasonIndex !== "") {
      this.setData({
        show: true
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请选择退款原因！',
      })
    }

  },
  // 获取退款说明数据
  changeDesc(e) {
    let refundDesc = e.detail.value
    this.setData({
      refundDesc: refundDesc
    })
  },
  // 校验必填项
  validateSubmit: throttle(function () {
    let serviceList = this.data.serviceList
    let cReasonIndex = this.data.cReasonIndex
    let checkedList = serviceList.filter(item => {
      return item.checked == true
    })
    if (checkedList.length > 0) {
      if (cReasonIndex !== "") {
        // 调用申请退款接口
        this.submitRefund()
      } else {
        wx.showToast({
          icon: "none",
          title: '请选择退款原因！',
        })
      }
    } else {
      wx.showToast({
        icon: "none",
        title: '请选择退款选择项！',
      })
    }
  }, 3000),
  // 提交退款
  submitRefund() {
    let refundInfo = this.data.refundInfo
    let userInfo = this.data.userInfo
    let cReasonIndex = this.data.cReasonIndex
    let refundDesc = this.data.refundDesc
    let refundReason = this.data.optionList[cReasonIndex].dropdownKey
    let serviceList = this.data.serviceList
    let refundMessages = []
    // policyFeeType 0-定金包含官费 1-尾款 2-官费 
    if (serviceList[0].checked) {
      refundMessages.push({
        payType: refundInfo.payTypeList[0].payType,
        policyFeeType: 0,
        refundAmount: serviceList[0].value
      })
    }
    if (refundInfo.payTypeList.length > 0 && serviceList.length > 1 && serviceList[1].checked && !refundInfo.isWaitSign) {
      refundMessages.push({
        payType: refundInfo.payTypeList[1].payType,
        policyFeeType: 1,
        refundAmount: serviceList[1].value
      })
    }
    // 有官费
    if (refundInfo.isHaveGover) {
      refundMessages.push({
        payType: refundInfo.payTypeList[0].payType,
        policyFeeType: 2,
        refundAmount: serviceList[serviceList.length - 1].value
      })
    }
    let data = {
      orderId: refundInfo.orderId,
      userNo: userInfo.userNo,
      questionDescription: refundDesc,
      refundCount: this.data.refundCount, // 选择的退款数量
      refundReason: refundReason,
      refundMessages: refundMessages
    }
    console.log(data)
    submitRefund(data).then(res => {
      if (res.code == 0) {
        wx.showToast({
          icon: "success",
          title: '提交成功！',
        })
        setTimeout(() => {
          this.toRefundDetail(res.data.refundNo)
        }, 1200)
      } else if (res.code == 1) {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      } else if (res.code == -1) {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  },
  // 跳转到退款详情页面
  toRefundDetail(refundNo) {
    wx.redirectTo({
      url: `/order/pages/refund/refundDetail/refundDetail?refundNo=${refundNo}&pageFrom=${0}`,
    })
  },
  // 修改退款金额
  changeFee(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    let value = e.detail.value * 100
    let serviceList = this.data.serviceList
    serviceList[index].value = value
    if ((value == "") || (value == 0) || (value > serviceList[index].maxValue)) {
      wx.showToast({
        icon: "none",
        title: '修改值应大于0且不大于各付款金额！',
        duration: 3000
      })
      serviceList[index].value = serviceList[index].maxValue
      this.setData({
        serviceList: serviceList
      })
    } else {
      this.setData({
        serviceList: serviceList
      })
    }
  },
  // 进入页面时回显订单信息和退款选择方式
  getRefundInfo(options) {
    let refundInfo = JSON.parse(options.data)
    let serviceList = this.data.serviceList
    let govermentInfo = this.data.govermentInfo
    if (refundInfo.refundType == 0 || refundInfo.isWaitSign) {
      serviceList = serviceList.slice(0, 1)
      serviceList[0].value = (Number(refundInfo.earnestMoney) * refundInfo.productCount)
      serviceList[0].maxValue = (Number(refundInfo.earnestMoney) * refundInfo.productCount)
      serviceList[0].checked = refundInfo.isWaitSign == true ? true : false
    } else if (refundInfo.refundType == 1 || refundInfo.refundType == 4) {
      serviceList = serviceList.slice(0, 2)
      serviceList[0].value = (Number(refundInfo.earnestMoney) * refundInfo.productCount)
      serviceList[0].maxValue = (Number(refundInfo.earnestMoney) * refundInfo.productCount)
      serviceList[0].checked = refundInfo.isWaitSign == true ? true : false
      serviceList[1].value = ((Number(refundInfo.nowFee) - Number(refundInfo.earnestMoney)) * refundInfo.productCount)
      serviceList[1].maxValue = ((Number(refundInfo.nowFee) - Number(refundInfo.earnestMoney)) * refundInfo.productCount)
      serviceList[1].checked = refundInfo.isWaitSign == true ? true : false
    }
    // 有官费时
    if (refundInfo.isHaveGover) {
      govermentInfo.value = (Number(refundInfo.governmentFee) * refundInfo.productCount)
      govermentInfo.maxValue = (Number(refundInfo.governmentFee) * refundInfo.productCount)
      govermentInfo.checked = refundInfo.isWaitSign == true ? true : false
      serviceList.push(govermentInfo)
    }
    this.setData({
      refundInfo: refundInfo,
      serviceList: serviceList,
      refundCount: refundInfo.productCount
    })
    console.log(this.data.refundInfo)
  },
  // 获取退款原因数据
  getRefundReasonList() {
    let param = {
      type: 1
    }
    getRefundReason(param).then(res => {
      if (res.code == 0) {
        let optionList = res.data
        optionList.forEach(item => {
          item.checked = false
        })
        this.setData({
          optionList: optionList
        })
      }
    })
  },
  // 该表数量时修改max值
  fixMaxValue() {
    let refundInfo = this.data.refundInfo
    let serviceList = this.data.serviceList
    let refundCount = this.data.refundCount
    let govermentInfo = this.data.govermentInfo
    if (refundInfo.refundType == 0) {
      serviceList = serviceList.slice(0, 1)
      serviceList[0].value = (Number(refundInfo.earnestMoney) * refundCount)
      serviceList[0].maxValue = (Number(refundInfo.earnestMoney) * refundCount)
    } else if (refundInfo.refundType == 1 || refundInfo.refundType == 4) {
      serviceList = serviceList.slice(0, 2)
      serviceList[0].value = (Number(refundInfo.earnestMoney) * refundCount)
      serviceList[0].maxValue = (Number(refundInfo.earnestMoney) * refundCount)
      serviceList[1].value = ((Number(refundInfo.nowFee) - Number(refundInfo.earnestMoney)) * refundCount)
      serviceList[1].maxValue = ((Number(refundInfo.nowFee) - Number(refundInfo.earnestMoney)) * refundCount)
    }
    // 有官费时
    if (refundInfo.isHaveGover) {
      govermentInfo.value = (Number(refundInfo.governmentFee) * refundCount)
      govermentInfo.maxValue = (Number(refundInfo.governmentFee) * refundCount)
      serviceList.push(govermentInfo)
    }
    this.setData({
      refundInfo: refundInfo,
      serviceList: serviceList,
    })
  },
  // 减少数量
  reduceCount() {
    if (this.data.refundCount > 1) {
      this.setData({
        refundCount: this.data.refundCount - 1
      })
      this.fixMaxValue()
    }
  },
  // 添加数量
  addCount() {
    let maxCount = this.data.refundInfo.productCount
    if (this.data.refundCount < maxCount) {
      this.setData({
        refundCount: this.data.refundCount + 1
      })
      this.fixMaxValue()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRefundInfo(options)
    this.getRefundReasonList();
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