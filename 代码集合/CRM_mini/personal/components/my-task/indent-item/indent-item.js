// personal/components/my-task/indent-item/indent-item.js
const app = getApp();
import {
  getSignInfo,
  getuser
} from "../../../../utils/api/mytask"


Component({
  /**
   * 组件的属性列表
   */
  properties: {

    taskInfo: {
      type: Object
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    clueType: {},
    indentList: {},
    imageUrl: app.globalData.imageURL,
    contractUrl: app.globalData.fadadaUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 查看合同
    checkContract() {
      // 电子合同
      if (this.data.indentList.contractType == 1) {
        let contractFileUrl = this.data.indentList.attachmentUrl
        console.log(contractFileUrl);
        let newUrl = contractFileUrl.replace('https://testapi.fadada.com:8443', this.data.contractUrl)
        this.downloadContract(newUrl, 'pdf')
      } else {
        let contractFileUrl = this.data.indentList.attachmentUrl
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
    getList() {
      let obj = {
        id: this.properties.taskInfo.id,
        // clueId: this.properties.taskInfo.clueId,
        // listType: 'personal'
      }
      getSignInfo(obj).then(async res => {
        if (res.code == 0) {
          await getuser(res.data.clueAttributionEmpId).then(data => {
            if (data.code == 0) {
              this.setData({
                indentList: res.data,
                clueType: data.data
              })
            }
          })
        }
      })
    }
  }
})