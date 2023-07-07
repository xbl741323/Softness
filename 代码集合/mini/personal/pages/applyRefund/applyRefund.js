// personal/pages/orderprojectDetail/orderprojectDetail.js
const app = getApp();
var common = require('../../../utils/common/userDeal')
import { getOrderInfo } from "../../../utils/api/orders"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:null,
    imageUrl: app.globalData.imageURL,
    orderInfo: {},
    maskBox:null,
    inputText: '',
    inputTextLen: 0,
    refundNum: 0,
    radio:null,
    dialogList:[{
      title:'下错单了',
      val:1
    },{
      title:'付款金额错误',
      val:2
    },{
      title:'付款方式错误',
      val:3
    },{
      title:'服务终止',
      val:4
    },{
      title:'其他',
      val:5
    }],
    showDialog:false,
    radioStatus:false,
    reasonIndex:null,
    customAmount: 0
  },    
  handleDialog() {
    this.setData({
      showDialog: !this.data.showDialog,
    })
  },
  chooseReason(){
    this.setData({
      radioStatus:true,
      reasonIndex: this.data.radio
    });
    this.handleDialog();
  },
  changeRadio(e){
    this.setData({
      radio: e.currentTarget.dataset.index
    })
  },
  // 跳转项目详情
  toProductDetail() {
    let info = this.data.orderInfo;
    let url = `/search/pages/productdetails/productdetails?id=${info.spuId}&type=${info.categoryId}`
    app.toGoalUrl(url)
  },
  setCount(e){
    let status = e.currentTarget.dataset.status
    if(status && this.data.refundNum == this.data.orderInfo.buyNum) return app.toastBox('数量已达退款上限','none',1500)
    if(!status && this.data.refundNum == 1) return app.toastBox('数量必须大于1','none',1500)
    this.setData({
      refundNum: status ? this.data.refundNum + 1 : this.data.refundNum - 1
    })
  },
  getInputText (e) {
    let inputText = e.detail.value;
    if (e.detail.value.length > 200) {
      inputText = inputText.substring(0, 200);
    }
    this.setData({
      inputText: inputText,
      inputTextLen: 0 || inputText.length
    })
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
          // this.setData({
          //   loading: false
          // })
        },
      })
    }
  },
  // 复制订单编号
  copyText() {
    let that = this
    wx.setClipboardData({
      data: that.data.orderInfo.orderNo,
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
  // 获取订单详情信息
  getData(id) {
    this.showLoading(true)
    // 获取订单相关信息
    getOrderInfo(id).then(res => {
      let time = 'progressList[0].time';
      if (res.code == 0) {
        this.setData({
          orderInfo: res.data,
          refundNum: res.data.buyNum,
          [time]: res.data.createTime,
        })
        this.showLoading(false)
      }
    })
  },     
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: 6637
    })
    this.getData(6637)
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    };
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