// personal/pages/my-order/detail/class-member/class-member.js
import {
  getClassMemberDetail
} from "../../../../../utils/api/order"
import * as CodeMsg from "../../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: "", // 订单id
    pageForm: "", // 来源页面 1-课程订单列表 2-会员订单列表 
    orderInfo: {}
  },
  // 复制链接
  copyText(e) {
    let text = e.currentTarget.dataset.text
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  // 获取订单详情数据
  getOrderData() {
    let pageForm = this.data.pageForm
    let params = {
      id: this.data.orderId
    }
    getClassMemberDetail(params, pageForm).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          orderInfo: res.data
        })
        console.log(this.data.orderInfo, "orderInfo")
      }
    })
  },
  // 初始值赋值
  setOriginalData(options) {
    if (options.data) {
      let data = JSON.parse(options.data)
      this.setData({
        orderId: data.id,
        pageForm: data.pageFrom
      })
      this.getOrderData()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setOriginalData(options)
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