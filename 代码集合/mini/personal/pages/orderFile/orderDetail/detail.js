// personal/pages/orderFile/orderDetail/detail.js
const app = getApp();
var handles = require('../../../../utils/common/handles')
import { innerGetDetailInfoById, documentCancelOrder, documentDeleteOrder } from '../../../../utils/api/orders'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    orderInfo: null,
    imageUrl: app.globalData.imageURL,
    progressList: [{
      title: "提交订单",
      status: 2,
      langStatus: true,
      time: ""
    },
    {
      title: "支付订单", // 数据待对接
      status: 1,
      langStatus: false,
      time: ""
    },
    {
      title: "已完成",
      status: 0,
      langStatus: true,
      time: ""
    }],
    iconUrl: {
      pdf: '../../../../image/file/icon_pdf.png',
      doc: '../../../../image/file/icon-word.png',
      docx: '../../../../image/file/icon-word.png',
      xls: '../../../../image/file/icon_xls.png',
      xlsx: '../../../../image/file/icon_xls.png',
      ppt: '../../../../image/file/icon_ppt.png',
      pptx: '../../../../image/file/icon_ppt.png',
    }
  },
  // 订单详情
  getDetail(){
    innerGetDetailInfoById(this.data.orderId).then(res =>{
      if(res.code == 0){
        let result = res.data;
        this.setData({
          orderInfo: res.data
        });
        this.filterProgress(result.orderStatus);
      }
    });
  },
  filterProgress(status){
    let list = this.data.progressList;
    list[0].time = this.data.orderInfo.createTime;
    if(status == 2){
      list[0].status = list[1].status = list[2].status = 0;
      list[0].langStatus = list[1].langStatus = list[2].langStatus = false;
    };
    if(status == 1){
      list[1].status = list[2].status = 2;
      list[1].langStatus = list[2].langStatus = true;
      list[1].time = this.data.orderInfo.tmFileOrderPayment.payTime;
      list[2].time = this.data.orderInfo.updateTime;
    };
    this.setData({
      progressList: list
    });
  },
  //支付页面
  submitPay() {
    let para ={
      id: this.data.orderInfo.fileId,
      orderId: this.data.orderId,
      from: 'list'
    };
    let data = JSON.stringify(para);
    wx.navigateTo({
      url: `/personal/pages/orderFile/payDetail/payDetail?data=${data}`,
    });
  },
  // 取消订单确认弹框
  cancelOperete() {
    let order = this.data.orderInfo
    let that = this
    wx.showModal({
      title: order.orderStatus == 2 ? "确定删除？" : "确定取消？",
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
    let url = order.orderStatus== 2 ? documentDeleteOrder : documentCancelOrder;
    url(order.id).then(res => {
      if (res.code == 0) {
        wx.navigateTo({
          url: `/personal/pages/orderIndex/order?type=${2}`,
        })
      }
    })
  },
  toProductDetail(){
    wx.navigateTo({
      url: `/personal/pages/wtFile/fileDetail/fileDetail?fileId=${this.data.orderInfo.fileId}`,
    })
  },
  copyText(e) {
    handles.copyTap(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      orderId: options.id
    });
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
    this.getDetail();
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