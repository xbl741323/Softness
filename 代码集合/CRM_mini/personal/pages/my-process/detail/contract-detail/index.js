// personal/pages/my-process/detail/contract-detail/index.js
import {
  getContractDetail,
  auditLog,
  auditPaperContract
} from "../../../../../utils/api/process";
import {
  contractStatus
} from "../../../../../utils/common/contract";
import {
  getOrderInfo
} from "../../../../../utils/api/contract";
import {
  filterArea
} from "../../../../../utils/clue/clue"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    contractInfo: {},
    contractDetailTabList: ['基本信息', '订单信息', '操作记录'],
    cTabIndex: 0,
    taskId: null,
    auditType: null,
    auditRemark: '',
    auditDialog: false,
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

  getdetail(id) {
    getContractDetail({
      taskId: id
    }).then(res => {
      res.data.contractStatus = contractStatus(res.data.taskStatus)
      res.data.area = filterArea(res.data.orgAddress);
      this.setData({
        contractInfo: res.data
      })
    })
  },

  changeTab(e) {
    switch (e.detail.index) {
      case 1:
        this.getOrderList();
        break;
      case 2:
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
      taskId: this.data.taskId,
      taskNo: this.data.taskNo,
      type: 1
    }
    auditLog(param).then(res => {
      console.log(res.data);
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

  getOrderList() {
    getOrderInfo(this.data.contractInfo.orderIdList).then(res => {
      if (res.code == 0) {
        let orderList = res.data
        var totalAmount = 0;
        orderList.forEach(el => {
          el.agentFee = 0;
          el.thirdFee = 0;
          el.govFee = 0;
          el.orderFeeVoList.forEach(fee => {
            if (fee.costType == 1) {
              el.agentFee += fee.buyNum * fee.price;
            } else if (fee.costType == 2) {
              el.thirdFee += fee.buyNum * fee.price;
            } else if (fee.costType == 3) {
              el.govFee += fee.buyNum * fee.price;
            }
          })
          totalAmount += el.totalAmount
        });
        this.setData({
          orderList: res.data,
          totalAmount: totalAmount
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
      auditRemark: '',
      auditDialog: true
    })
  },

  onClose() {
    console.log(2121212121);
    this.setData({
      auditRemark: '',
      auditRequired: false
    })
  },


  confirmAudit() {
    if (this.data.auditRemark.length == 0 && this.data.operate == 0) {
      this.setData({
        auditRequired: true
      })
    } else {
      if (this.data.operate == 1) {
        let param = {
          taskId: this.data.taskId,
          taskStatus: 1, //合同审核状态 1 审核通过 2 审核不通过
          auditReason: this.data.auditRemark == "" ? "审批同意" : this.data.auditRemark,
          auditType: this.data.auditType
        }
        auditPaperContract(param).then(res => {
          if (res.code == 0) {
            wx.showToast({
              icon: "none",
              title: '审核通过',
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/personal/pages/my-process/list/list',
              })
            }, 1000)
          } else {
            wx.showToast({
              icon: 'error',
              title: res.msg,
            })
          }
        })
      } else {
        let param = {
          taskId: this.data.taskId,
          taskStatus: 2, //合同审核状态 1 审核通过 2 审核不通过
          auditReason: this.data.auditRemark,
          auditType: this.data.auditType
        }
        auditPaperContract(param).then(res => {
          if (res.code == 0) {
            wx.showToast({
              icon: "none",
              title: '流程已驳回',
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/personal/pages/my-process/list/list',
              })
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

  // 查看合同
  checkContract(e) {
    let contractFileUrl = ''
    if (e.currentTarget.dataset.url == 'main') {
      contractFileUrl = this.data.contractInfo.mainContractSignUrl;
    }
    if (e.currentTarget.dataset.url == 'supplement') {
      contractFileUrl = this.data.contractInfo.signUrl;
    }

    if (contractFileUrl.indexOf('https://testapi.fadada.com:8443') != -1) {
      let newUrl = contractFileUrl.replace('https://testapi.fadada.com:8443', this.data.contractUrl)
      wx.setStorageSync('fadaUrl', newUrl)
      wx.navigateTo({
        url: `/pagesFace/pages/webview/webview`,
      })
    } else {
      let url = this.data.imageUrl + contractFileUrl
      let fileType = contractFileUrl.slice(contractFileUrl.indexOf('.') + 1)
      this.downloadContract(url, fileType)
    }
  },
  // 下载合同
  downloadContract(url, fileType) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.downloadFile({
      url: url,
      success: function (res) {
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          fileType: `${fileType}`,
          showMenu: true,
          success: () => {
            wx.hideLoading({
              success: (res) => {},
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
      taskId: Number(options.id),
      auditType: Number(options.auditType),
      taskNo: options.taskNo
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