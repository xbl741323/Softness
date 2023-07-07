// personal/components/my-contract/contract-detail/index.js
const app = getApp();
import {
  getDetail,
  getOrderInfo,
  getLogInfo
} from "../../../../utils/api/contract";
import * as CodeMsg from "../../../../utils/common/codeMsg";

import {
  filterArea
} from "../../../../utils/clue/clue"
import {
  category
} from "../../../../utils/order/order";
import {
  contractStatus
} from "../../../../utils/common/contract";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contractId: '',
    contractType: '',
    contractInfo: {},
    tabList: ['合同信息', '订单信息', '操作信息'],
    elecTabList: ['合同信息', '订单信息'],
    cTabIndex: 0,
    currentPage: 1,
    pageSize: 10,
    orderList: [],
    logsList: [],
    imageUrl: app.globalData.imageURL,
    contractUrl: app.globalData.fadadaUrl
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
  // 查看合同
  checkContract() {
    let contractFileUrl = this.data.contractType == 1 ? this.data.contractInfo.signDownloadUrl : this.data.contractInfo.signUrl
    if (contractFileUrl && contractFileUrl.indexOf('https://testapi.fadada.com:8443') != -1) {
      let newUrl = contractFileUrl.replace('https://testapi.fadada.com:8443', this.data.contractUrl)
      // wx.setStorageSync('fadaUrl', newUrl)
      // console.log(newUrl,'newUrl')
      // wx.navigateTo({
      //   url: `/pagesFace/pages/webview/webview`,
      // })
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

  changeTab(e) {
    this.setData({
      cTabIndex: e.detail.index,
    })
    if (this.data.cTabIndex == 1) {
      getOrderInfo(this.data.contractInfo.orderIdList || [this.data.contractInfo.orderId]).then(res => {
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
      })
    } else if (this.data.cTabIndex == 2) {
      let param = {
        keyId: this.data.contractId,
        pageNo: this.data.currentPage,
        pageSize: this.data.pageSize,
        type: 8
      }
      getLogInfo(param).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          this.setData({
            logsList: res.data.records
          })
        }
      })
    }
  },

  getContractDetail() {
    console.log(this.data.contractId);
    let param = {
      contractId: this.data.contractId,
    }
    getDetail(param, this.data.contractType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        res.data.contractStatus = contractStatus(res.data.taskStatus)
        res.data.categoryId = category(res.data.categoryId)
        res.data.area = filterArea(res.data.orgAddress);
        this.setData({
          contractInfo: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      contractId: options.id,
      contractType: options.contractType
    })
    if (wx.getStorageSync('userInfo')) {
      this.getContractDetail();
    }
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