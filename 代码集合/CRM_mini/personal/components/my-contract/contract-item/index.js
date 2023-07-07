// personal/components/my-contract/contract-item/index.js

const app = getApp();
import {
  delContract
} from "../../../../utils/api/contract";
import * as CodeMsg from "../../../../utils/common/codeMsg";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    contractInfo: {
      type: Object
    },
    contractType: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    imageUrl: app.globalData.imageURL,
    contractUrl: app.globalData.fadadaUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转到录入合同编辑页面
    toEnterContract() {
      let id = this.data.contractInfo.id
      wx.navigateTo({
        url: `/personal/pages/my-contract/enter-contract/enter-contract?id=${id}`,
      })
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
      if (contractFileUrl.indexOf('https://testapi.fadada.com:8443') != -1) {
        let newUrl = contractFileUrl.replace('https://testapi.fadada.com:8443', this.data.contractUrl)
        // wx.setStorageSync('fadaUrl', newUrl)
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

    // 确认删除
    deleteContract() {
      let that = this
      wx.showModal({
        content: "确定删除该合同？",
        cancelColor: "#999999",
        cancelText: "取消",
        confirmColor: "#36A6FE",
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            that.confirmDelete()
          } else if (res.cancel) {

          }
        }
      })
    },
    // 确认删除
    confirmDelete() {
      let param = {
        contractId: this.data.contractInfo.id
      }
      delContract(param).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          wx.showToast({
            icon: "none",
            title: '合同删除成功！',
          })
          this.triggerEvent('refresh')
        }
      })
    },
    // 跳转到线索详情
    toContractDetail() {
      wx.navigateTo({
        url: '/personal/components/my-contract/contract-detail/index?id=' + this.data.contractInfo.id + '&contractType=' + this.data.contractType,
      })
    },
  },
  lifetimes: {
    attached: function () {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    },
  },
})