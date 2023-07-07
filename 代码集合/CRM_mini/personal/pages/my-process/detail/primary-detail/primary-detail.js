// personal/pages/my-process/detail/contract-detail/index.js
const app = getApp();
import {
  getchangePriceDetail,
  auditLog,
  auditChangeContract,
  getByOrganization,
  getClueCompId,
  auditPaperContractAuditOfMy
} from "../../../../../utils/api/process";
import {
  filterArea
} from "../../../../../utils/clue/clue"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictures: [],
    headInfo: {},
    index: 0,
    userId: "",
    type: null,
    queenType: null,
    clueType: null,// 1-个人 2-单位
    buyNum: 0,
    infoBuyNum: 0,
    contractInfo: {},
    contractDetailTabList: ['认证信息', '操作记录'],
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
  checkContract(e) {
    let url = e.target.dataset.url
    // // 电子合同

    if (url.indexOf('https://testapi.fadada.com:8443') != -1) {
      let contractFileUrl = e.target.dataset.url
      let newUrl = contractFileUrl.replace('https://testapi.fadada.com:8443', url)
      this.downloadContract(newUrl, 'pdf')
    } else {
      let contractFileUrl = e.target.dataset.url
      let url = this.data.imageUrl + contractFileUrl
      let fileType = contractFileUrl.slice(contractFileUrl.indexOf('.') + 1)
      console.log(url.slice(url.length - 3, url.length) == 'pdf');
      if (url.slice(url.length - 3, url.length) == 'pdf') {
        this.downloadContract(url, fileType)
      } else {
        console.log('png,jpg');
        this.setData({
          pictures: [url]
        })
        this.previewImage(url)
      }
    }
  }, // 下载合同
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
  previewImage: function (e) {
    var current = e
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.pictures, // 需要预览的图片http链接列表
    })
  },
  getdetail(id, params) {
    getClueCompId(id).then(res => {
      this.setData({
        contractInfo: res.data
      })
      getByOrganization(params, this.data.contractInfo.type).then(res => {
        if (res.code == 0) {
          this.setData({
            headInfo: res.data
          })
        }
      })
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
      taskId: this.data.contractInfo.id,
      type: 7
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
    console.log(Number(e.currentTarget.dataset.operate));
    if (Number(e.currentTarget.dataset.operate) == 1) {
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
    if (this.data.auditRemark.length == 0 && this.data.operate == 2) {
      this.setData({
        auditRequired: true
      })
    } else {
      if (this.data.operate == 1) {
        let param = {
          id: this.data.contractInfo.id,
          flowStatus: 1, //审核状态 1 审核通过 2 审核不通过
          auditOpinion: this.data.auditRemark
        }
        auditPaperContractAuditOfMy(param, this.data.contractInfo.type).then(res => {
          if (res.code == 0) {
            wx.showToast({
              icon: "none",
              title: '审核通过',
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/personal/pages/my-process/list/list?num=3',
              })
            }, 1000)
          } else {
            wx.showToast({
              icon: "none",
              title: res.msg,
            })
          }
        })
      } else {
        let param = {
          id: this.data.taskId,
          flowStatus: 2, //审核状态 1 审核通过 2 审核不通过
          auditOpinion: this.data.auditRemark
        }
        auditPaperContractAuditOfMy(param, this.data.contractInfo.type).then(res => {
          if (res.code == 0) {
            wx.showToast({
              icon: "none",
              title: '流程已驳回',
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/personal/pages/my-process/list/list?num=3',
              })
            }, 1000)
          } else {
            wx.showToast({
              icon: "none",
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



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let params = JSON.parse(options.params)
    this.setData({
      userId: wx.getStorageSync('userInfo').id,
      taskId: Number(options.id),
      auditType: Number(options.auditType),
      taskNo: options.taskNo,
      clueType: options.clueType
    })
    this.getdetail(options.id, params);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},
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
  onHide() {},

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