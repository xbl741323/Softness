// personal/pages/my-process/detail/contract-detail/index.js
import {
  getchangePriceDetail,
  auditLog,
  auditChangeContract
} from "../../../../../utils/api/process";
import {
  filterArea
} from "../../../../../utils/clue/clue"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contractUrl: app.globalData.fadadaUrl,
    index: 0,
    userId: "",
    type: null,
    queenType: null,
    buyNum: 0,
    infoBuyNum: 0,
    contractInfo: {},
    contractDetailTabList: ['订单信息', '操作记录'],
    cTabIndex: 0,
    taskId: null,
    auditType: null,
    auditRemark: '',
    auditDialog: false,
    Dialog: false,
    operate: '',
    auditRequired: false,
    orderList: [],
    auditLogsList: [],
    totalAmount: 0,
    taskNo: '',
    imageUrl: app.globalData.imageURL,
    contractUrl: app.globalData.fadadaUrl,
    contractFileInfo: [],
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
    frontlist: [{
      payTypeId: null
    }],
    queenList: [{
      payTypeId: null
    }],
  },

  getdetail(id) {
    getchangePriceDetail(id).then(res => {
      // res.data.orderInfo.area = filterArea(res.data.orderInfo.orgAddress);
      this.setData({
        contractInfo: res.data,
        frontlist: res.data.productInfo.skuPayTypeList,
        queenList: res.data.priceInfo.payTypeVoList,
        type: res.data.productInfo.skuPayTypeList[0].payTypeId,
        queenType: res.data.priceInfo.payTypeVoList[0].payTypeId,
        buyNum: res.data.orderInfo.buyNum,
        infoBuyNum: res.data.priceInfo.buyNum
      })
      if (res.data.contractAllVoList) {
        this.setData({
          contractFileInfo: res.data.contractAllVoList
        })
      }
      console.log(this.data.contractFileInfo, 'ddddddd');
    })
  },

  changeTab(e) {
    switch (e.detail.index) {
      case 0:
        // this.getdetail()
        break;
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
      taskId: this.data.taskId,
      type: 5
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
        console.log(this.data.auditLogsList);
      }
    })
  },



  getAuditRemark(e) {
    this.setData({
      auditRemark: e.detail.value
    })
  },

  confirmRemark(e) {
    console.log(Number(e.currentTarget.dataset.operate));
    if (Number(e.currentTarget.dataset.operate) == 2) {
      this.setData({
        operate: Number(e.currentTarget.dataset.operate),
        // auditRemark: '',
        auditDialog: true
      })
    } else {
      this.setData({
        operate: Number(e.currentTarget.dataset.operate),
        // auditRemark: '',
        Dialog: true
      })
    }

    // this.confirmAudit()
  },

  onClose() {
    this.setData({
      auditRemark: '',
      auditRequired: false
    })
  },

  confirmAuditretuer() {
    this.setData({
      auditDialog: true
    })
  },
  confirmAudit() {
    if (this.data.auditRemark.length == 0 && this.data.operate == 3) {
      this.setData({
        auditRequired: true
      })
    } else {
      if (this.data.operate == 2) {
        let param = {
          id: this.data.taskId,
          flowStatus: 2, //合同审核状态 2 审核通过 3 审核不通过
          handleMessage: this.data.auditRemark == "" ? "审批同意" : this.data.auditRemark,
        }
        auditChangeContract(param).then(res => {
          if (res.code == 0) {
            wx.showToast({
              icon: "none",
              title: '审核通过',
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '/personal/pages/my-process/list/list?num=2',
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
          id: this.data.taskId,
          flowStatus: 3, //合同审核状态 2 审核通过 3 审核不通过
          handleMessage: this.data.auditRemark == "" ? "审批不同意" : this.data.auditRemark,

        }
        auditChangeContract(param).then(res => {
          if (res.code == 0) {
            wx.showToast({
              icon: "none",
              title: '审核不通过',
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '/personal/pages/my-process/list/list?num=2',
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
    let item = e.currentTarget.dataset.item
    let contractFileUrl = item.contractType == 1 ? item.signDownloadUrl : item.signDownloadUrl
    if (contractFileUrl.indexOf('https://testapi.fadada.com:8443') != -1) {
      let newUrl = contractFileUrl.replace('https://testapi.fadada.com:8443', this.data.contractUrl)
      this.downloadContract(newUrl, 'pdf')
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
      userId: wx.getStorageSync('userInfo').number,
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
  bindchange(e) {
    console.log(e);
    let index = e.detail.current
    console.log(index);
    this.setData({
      index: index
    })
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