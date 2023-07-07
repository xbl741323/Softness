// personal/pages/my-order/pay-voucher/pay-voucher.js
const app = getApp();
import {
  launchTransferAudit
} from '../../../../utils/api/order'
import {
  throttle
} from "../../../../utils/common/utils"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    system: app.globalData.system,
    imageUrl: app.globalData.imageURL,
    accessInfo: {},
    categoryId: '', // 产品类型编号
    // 恩凡收款账户信息-用于专利产品
    enFanInfo: {
      payeeAccountName: "上海恩凡知识产权代理有限公司",
      bankCardNo: "454681983746",
      backName: "中国银行股份有限公司上海市航华支行",
    },
    // 卧涛收款账户信息-用于项目申报和其他产品
    wotaoInfo: {
      payeeAccountName: "卧涛科技限公司",
      bankCardNo: "12086401040008150",
      backName: "中国农业银行合肥市新政务区支行",
    },
    payForm: {
      paymentId: '',
      orderPort: '',
      addressId: null,
      orderNo: "", // 订单编号
      payAmount: 0, // 应付金额
      remarks: "", // 备注
      payVoucherFileType: "", // 支付凭证文件类型
      payVoucherUrl: "", // 支付凭证url
    },
  },
  // 预览支付凭证
  previewImg() {
    let payForm = this.data.payForm
    if (payForm.payVoucherFileType != 'pdf') {
      wx.previewImage({
        urls: [this.data.imageUrl + payForm.payVoucherUrl] // 需要预览的图片http链接列表
      })
    }
  },
  // 删除支付凭证
  delVoucherUrl() {
    let that = this
    wx.showModal({
      title: "确定删除？",
      cancelColor: "#36A6FE",
      cancelText: "再想想",
      confirmColor: "#999999",
      confirmText: "确定",
      success(res) {
        if (res.confirm) {
          let payForm = that.data.payForm
          payForm.payVoucherFileType = ''
          payForm.payVoucherUrl = ''
          that.setData({
            payForm: payForm
          })
        } else if (res.cancel) {}
      }
    })
  },
  // 合同附件选择文件
  chooseFile() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success(res) {
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        let file = res.tempFiles[0]
        let startIndex = file.path.indexOf('.')
        let fileName = file.name
        let fileType = file.path.slice(startIndex + 1)
        let fileSize = file.size
        let suitType = ['png', 'jpg', 'jpeg', 'pdf']
        console.log(fileType, 'fileType')
        if (suitType.includes(fileType)) {
          if (fileSize <= 5 * (1024 * 1024)) {
            that.uploadImage(file, fileName, fileType)
          } else {
            wx.showToast({
              icon: 'none',
              title: '文件大小不能超过5M！',
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '请选择格式为png、jpg、pdf等常用文件及图片格式！',
          })
        }
      }
    })
  },
  uploadImage(item, fileName, fileType) {
    wx.showLoading({
      title: '上传中，请稍等',
    })
    let that = this
    wx.uploadFile({
      filePath: item.path,
      name: 'file', //后台接收图片的字段
      url: app.globalData.baseURL + "/wtcrm/file/upload",
      method: "post",
      header: {
        "Content-Type": "multipart/form-data",
        'Authorization': 'Bearer ' + that.data.accessInfo.access_token,
      },
      success(res) {
        let result = JSON.parse(res.data)
        if (result.code == CodeMsg.CODE_0) {
          let payForm = that.data.payForm
          payForm.payVoucherFileType = fileType
          payForm.payVoucherUrl = result.data
          that.setData({
            payForm: payForm
          })
          wx.hideLoading({
            success: (res) => {},
          })
        } else {
          wx.showToast({
            icon: "none",
            title: result.msg,
          })
        }
      }
    })
  },
  // 取消返回上一页
  handleCancle() {
    wx.navigateBack({
      delta: 1,
    })
  },
  // 提交上传凭证
  submitPay: throttle(function () {
    let payForm = this.data.payForm
    if (payForm.payVoucherUrl != '') {
      this.launchOperate()
    } else {
      wx.showToast({
        icon: "none",
        title: '请上传支付凭证！',
      })
    }
  }, 2000),
  // 上传对公转账审核
  launchOperate() {
    let payForm = this.data.payForm
    let params = {
      orderPort: payForm.orderPort,
      paymentId: payForm.paymentId,
      voucherUrl: payForm.payVoucherUrl,
      addressId: payForm.addressId
    }
    launchTransferAudit(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "none",
          title: '操作成功！',
        })
        let that = this
        setTimeout(() => {
          that.handleCancle()
        }, 500)
      } else {
        wx.showToast({
          icon: "none",
          title: `${res.msg}`,
        })
      }
    })
  },
  setDefaultInfo(options) {
    if (options.orderInfo) {
      let r = JSON.parse(options.orderInfo)
      let payForm = this.data.payForm
      payForm.paymentId = r.paymentId
      payForm.orderPort = r.orderPort
      payForm.addressId = r.addressId
      payForm.orderNo = r.orderNo
      payForm.payAmount = r.payAmount
      payForm.paymentId = r.paymentId
      this.setData({
        payForm: payForm,
        categoryId: r.categoryId
      })
      console.log(r, '订单信息')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      accessInfo: wx.getStorageSync('accessInfo'),
    })
    this.setDefaultInfo(options)
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