// personal/pages/my-process/detail/contract-detail/index.js
import {
  auditLog,
  auditPaperContract,
  getTaskOpenInfo,
  changeTaskOpenCheck
} from "../../../../../utils/api/process";

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleStr: '',
    orderFeeInfo: [],
    orderId: null,
    userInfo: {},
    contractDetailTabList: ['订单信息', '操作记录'],
    cTabIndex: 0,
    taskId: null,
    auditRemark: '',
    auditDialog: false,
    hintDialog: false,
    operate: '',
    auditRequired: false,
    orderList: [],
    auditLogsList: [],
    totalAmount: 0,
    taskNo: '',
    imageUrl: app.globalData.imageURL,
    contractUrl: app.globalData.fadadaUrl,
    onBeforeClose(action) {
      const pages = getCurrentPages()
      let page = pages[pages.length - 1]
      if (action == "confirm") {
        if (page.data.auditRequired) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
  },

  getdetail() {
    getTaskOpenInfo(this.data.taskNo).then(res => {
      this.setData({
        myTaskInfo: res.data,
        orderFeeInfo: res.data.orderFeeInfo
      })
    })
  },
  changeTab(e) {
    switch (e.detail.index) {
      case 1:
        this.getOperateLog();
        break;
      default:
        break;
    }
    this.setData({
      cTabIndex: e.detail.index,
    })
  },

  getOperateLog() {
    let param = {
      taskId: this.data.orderId,
      type: 8
    }
    auditLog(param).then(res => {
      if (res.code == 0) {
        let data = [];
        let arr = [];
        for (const i in res.data) {
          data.push(res.data[i])
        }
        data.forEach(el => {
          arr.push(el[0])
        });
        this.setData({
          auditLogsList: arr
        })
      }
    })
  },
  getAuditRemark(e) {
    this.setData({
      auditRemark: e.detail.value
    })
  },

  confirmRemark(e) {
    this.setData({
      operate: Number(e.currentTarget.dataset.operate),
      titleStr: Number(e.currentTarget.dataset.operate) == 0 ? '确定审核不通过？' : "审核通过后，该笔未付款的订单将先生成任务，确定审核通过？",
      auditRemark: '',
      hintDialog: true
    })
  },

  onClose() {
    this.setData({
      auditRemark: '',
      auditRequired: false
    })
  },
  onShut() {
    this.setData({
      auditRemark: '',
      hintDialog: false
    })
  },
  submitAudit() {
    if (this.data.auditRemark.length == 0 && this.data.operate == 0) {
      this.setData({
        auditRequired: true
      })
    } else {
      if (this.data.operate == 1) {
        let param = {
          id: this.data.myTaskInfo.taskInfo.id,
          orderId: this.data.myTaskInfo.taskInfo.orderId,
          flowStatus: 1, //合同审核状态 1 审核通过 2 审核不通过
          auditReason: this.data.auditRemark,
        }
        changeTaskOpenCheck(param).then(res => {
          if (res.code == 0) {
            wx.showToast({
              icon: "none",
              title: '审核通过',
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          } else {
            wx.showToast({
              icon: 'none',
              title: res.msg,
            })
          }
        })
      } else {
        let param = {
          id: this.data.myTaskInfo.taskInfo.id,
          orderId: this.data.myTaskInfo.taskInfo.orderId,
          flowStatus: 2, //合同审核状态 1 审核通过 2 审核不通过
          auditReason: this.data.auditRemark,
        }
        changeTaskOpenCheck(param).then(res => {
          if (res.code == 0) {
            wx.showToast({
              icon: "none",
              title: '流程已驳回',
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          } else {
            wx.showToast({
              icon: 'error',
              title: res.msg,
            })
          }
        })
      }
    }
  },
  confirmAudit() {
    this.setData({
      auditDialog: true
    })
  },

  /* 复制链接 */
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      taskId: Number(options.taskId),
      taskNo: options.taskNo,
      orderId: options.orderId,
    })
    this.getdetail(options.id);
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