// personal/pages/orderFile/payDetail/payDetail.js
const app = getApp()
import {
  docDetail,
  saveFileOrder,
  miniPayWx
} from '../../../../utils/api/file'
import {
  getOpenId,
} from "../../../../utils/api"
import {
  getUserInfos
} from "../../../../utils/common/userDeal";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDetail: {},
    orderId: null,
    imageUrl: app.globalData.imageURL,
    checkDeal: true,
    throttle: true,
    id: null,
    checkedIndex: 2,
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

  checkLogin() {
    if (!this.data.checkDeal) return wx.showToast({
      title: '请勾选交易协议',
      icon: 'none',
      duration: 2000,
    });
    if (!this.data.throttle) return wx.showToast({
      title: '请勿重复提交',
      icon: 'none',
      duration: 1000,
    });
    let that = this;
    wx.login({
      success: function (res) {
        let params = {
          code: res.code,
          accountId: wx.getStorageSync('accountId')
        }
        getOpenId(params).then(res => {
          if (res.code == 0) {
            that.submit()
          }
        })
      }
    })
  },
  // 提交订单
  submit() {
    let userInfo = wx.getStorageSync('userInfo')
    let fileLinkId = wx.getStorageSync('fileLinkId')
    let fileInfo = wx.getStorageSync('fileInfo')
    let params = {
      userId: userInfo.userId,
      fileId: this.data.fileDetail.id,
      price: this.data.fileDetail.amount,
    }
    if (wx.getStorageSync('fileLinkId') && wx.getStorageSync('fileInfoArr')) {
      let fileInfoArr = wx.getStorageSync('fileInfoArr')
      let result = fileInfoArr.filter(item => {
        return item.id == this.data.fileDetail.id
      })
      if (result.length > 0) {
        params.inviteCode = wx.getStorageSync('fileLinkId')
      }
    }
    saveFileOrder(params).then(res => {
      if (res.code == 0) {
        this.toWxPay(res.data.id)
      }
    })
  },
  // 微信支付
  toWxPay(id) {
    let openId = null
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo.miniOpenId) {
      openId = userInfo.miniOpenId
    } else {
      getUserInfos('openId');
      userInfo = wx.getStorageSync('userInfo')
      openId = userInfo.miniOpenId
    }
    let params = {
      tmFileOrderId: this.data.orderId ? this.data.orderId : id,
      openId: openId,
    }
    console.log(params);
    miniPayWx(params).then(res => {
      if (res.code == 0) {
        this.setData({
          wxInfo: JSON.parse(res.data),
          throttle: true
        })
        wx.setStorageSync('wxPay', this.data.wxInfo)
        let fileId = this.data.orderId ? this.data.orderId : id;
        wx.navigateTo({
          url: `/order/pages/orderPay/wxPay/wxPay?fileId=` + fileId,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  //文档详情
  getDocDetail() {
    let params = {
      id: this.data.id
    }
    docDetail(params).then(res => {
      if (res.code == 0) {
        let fileDetail = res.data
        fileDetail.createTime = fileDetail.createTime.slice(0,10)
        fileDetail.areaName = fileDetail.areaName.slice(0,10)
        this.setData({
          fileDetail: res.data
        })
      }
    })
  },
  changeDeal() {
    this.setData({
      checkDeal: !this.data.checkDeal
    })
  },
  toAgreement() {
    wx.navigateTo({
      url: '/order/pages/tsAgreement/projectTa/projectTa',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.id) return this.setData({
      id: options.id
    })
    let data = JSON.parse(options.data,'---1');
    this.setData({
      id: data.id,
      orderId: data.orderId
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
    this.getDocDetail()
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