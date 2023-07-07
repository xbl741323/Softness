// personal/pages/my-order/detail/product-order/product-order.js
import {
  getMyOrderDetail,
  updateOrderStatus
} from "../../../../../utils/api/order"
import {
  filterArea
} from "../../../../../utils/clue/clue"
import {
  getClueDetail
} from "../../../../../utils/api/clue"
import * as CodeMsg from "../../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openData: {},
    auditStatus: false, // 是否对公转账审核中
    orderType: 0, // 订单类型 0-产品订单 3-待生效订单
    orderInfo: {},
    clueInfo: {},
    orderId: "",
    cTabIndex: 0,
  },
  // 生成订单
  generateNewOrder(params) {
    updateOrderStatus(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: '操作成功！',
        })
        this.selectComponent('#audit-tip').closeTip()
        this.getOrderDetal()
      }
    })
  },
  // 子组件回调显示弹窗
  showAudit() {
    this.showAuditTip()
  },
  // 提交审核回调
  submitAudit(val) {
    let auditManInfo = val.detail.auditManInfo
    let auditRemark = val.detail.auditRemark
    let params = {
      id: this.data.orderInfo.id, // 订单id
      handleBy: auditManInfo.userId, // 审核人userId
      handleByNo: auditManInfo.number, // 审核人number
      handleByName: auditManInfo.name, // 审核人name
      changePriceRemark: auditRemark, // 审核备注
    }
    this.generateNewOrder(params)
  },
  // 显示弹窗
  showAuditTip() {
    this.selectComponent('#audit-tip').showTip()
  },
  // 获取线索详情
  getClueDetailData() {
    let orderInfo = this.data.orderInfo
    let clueId = orderInfo.clueId
    let clueType = orderInfo.clueType
    let params = clueType == 1 ? {
      cluePersonId: clueId
    } : {
      clueCompanyId: clueId
    }
    getClueDetail(params, clueType, true).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          clueInfo: res.data
        })
      }
    })
  },
  // 刷新接口
  refresh() {
    wx.redirectTo({
      url: `/personal/pages/my-order/list/list?type=${3}`,
    })
  },
  // 改变tab栏
  onChange(e) {
    let value = e.detail.index
    this.setData({
      cTabIndex: value
    })
  },
  // 获取订单详情数据
  getOrderDetal() {
    let params = {
      orderId: this.data.orderId
    }
    getMyOrderDetail(params, this.data.orderType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let result = res.data
        result.orderFeeVoList.forEach(item => {
          if (item.payStatus == 1) {
            this.setData({
              auditStatus: true
            })
          }
        });
        if (result.orderAddress) {
          result.filterArea = filterArea(result.orderAddress.areaNo)
        }
        let payVoList = [
          [],
          [],
          []
        ]
        payVoList.forEach((item, index) => {
          let cList = result.orderFeeVoList.filter(cItem => {
            return cItem.payType == (index + 1)
          })
          payVoList[index] = cList.sort((a, b) => a.costType < b.costType ? -1 : a.costType > b.costType ? 1 : 0)
        })
        result.payVoList = payVoList;
        // console.log(result.payVoList);
        this.setData({
          orderInfo: result
        })
        this.getClueDetailData()
        // console.log("this.data.orderInfo",this.data.orderInfo)
      }
    })
  },
  // 初始化orderId赋值
  setOrderId(options) {
    this.setData({
      orderId: options.orderId,
      orderType: options.orderType,
    })
    this.getOrderDetal()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setOrderId(options)
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