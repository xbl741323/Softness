// order/pages/refundPage/refundDetail.js
var handles = require('../../../utils/common/handles');
import { getTmRefundSpuVoByRefundId } from "../../../utils/api/refund"
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    imageUrl: app.globalData.imageURL,
    orderId:null,
    loading: true,
    refundId:null,
    feeList:[{
      title:'服务费',
      amount: 0,
      has:false      
    },{
      title:'官费',
      amount: 0,
      has:false      
    },{
      title:'服务费-尾款',
      amount: 0,
      has:false      
    }]
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
   // 复制编号
   copyText(e) {
    console.log(e);
    let no = e.currentTarget.dataset.no
    wx.setClipboardData({
      data: no,
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
  getTmRefundSpuVoByRefundId(id).then(res => {
    if (res.code == 0) {
      let list = this.data.feeList;
      let data = res.data;
      // 退款信息费用列表处理
      if(data.depositRefundGovFee||data.govRefundFee||data.tailRefundGovFee){
        list[1].has = true;
        list[1].amount = data.depositRefundGovFee?data.depositRefundGovFee:data.govRefundFee?data.govRefundFee:data.tailRefundGovFee;
      }
      if(data.depositRefundServiceFee||data.serviceRefundFee){
        list[0].has = true;
        list[0].title = data.depositRefundServiceFee?'服务费-定金':'服务费'
        list[0].amount = data.depositRefundServiceFee?data.depositRefundServiceFee:data.serviceRefundFee
      }
      if(data.tailRefundServiceFee){
        list[2].has = true;
        list[2].amount = data.tailRefundServiceFee;
      }
      this.setData({
        orderInfo: res.data,
        feeList: list
      })
      this.showLoading(false)
    }
  })
},   
// 撤销退款申请弹窗
cancelRefundOperate(e) {
  let that = this; 
  handles.cancelRefundOperate(e,function(res){
    if(res == 'success'){
      that.getData(that.data.refundId)         
    }
  })
},
againRefund(){
  let orderInfo = this.data.orderInfo;
  let data = {
    orderId: orderInfo.orderId,
    payAmount: orderInfo.payAmount
  }
  let refundInfo = JSON.stringify(data)
  wx.navigateTo({
    url: `/order/pages/applyRefund/applyRefund?data=${refundInfo}`,
  })
},  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      refundId: options.id
    });
    this.getData(options.id)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})