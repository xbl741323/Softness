// personal/pages/transferPay/transferPay.js
const app = getApp();
import { payForOffline } from "../../../../utils/api/orders"
import {
  throttle
} from "../../../../utils/common/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 34,
    imgUrl: app.globalData.imageURL,
    count: 0,
    transferInfo: {},
    userInfo: {},
    submitStatus: true,
    fileType: null,
    transferImg: "",
    remindText: "1.下单后请尽快转账，务必保证转账金额与订单金额一致，请勿多转、少转和分次转账，否则影响转账审核进度;2.汇款时将订单号填写至汇款单“用途/备注/摘要”等栏;3.对公转账需上传银行转账凭证截图，格式png、jpg等常用图片格式，大小为5M;4.提交凭证截图后1-2个工作日内完成审核，若超出时间订单仍为“待付款”状态，请联系客服进行处理;5.支付金额为0时,可以不上传支付凭证。",
    backList: [{
        title: "收款人户名",
        value: "卧涛科技有限公司"
      },
      {
        title: "银 行 卡 号",
        value: "12086401040008150"
      },
      {
        title: "开 户 行",
        value: "中国农业银行合肥市新政务区支行"
      },
      {
        title: "备 注",
        value: "订单号：81121092780001801"
      }
    ]
  },
  // 上传转账凭证
  upTransferImg() {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const url = res.tempFilePaths[0]
        console.log(url,"输出url")
        // 上传对公转账凭证到服务器上
        wx.uploadFile({
          url: app.globalData.baseURL + "/authentication/upload",
          filePath: url,
          name: 'file',
          formData: {},
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            'Authorization': wx.getStorageSync('token'),
          },
          success: function (res) {
            let result = JSON.parse(res.data)
            if (result.code == 0) {
              // 本地回显
              _this.setData({
                transferImg: result.data,
                fileType: result.data.substring(result.data.length-3)
              })
              wx.showToast({
                title: '上传成功！',
              })
            }
          },
          fail: function (res) {
            console.log(res)
          }
        });
      }
    })
  },
  // 提交支付
  submitPay: throttle(function () {
    if (this.data.transferImg !== "" || this.data.transferInfo.totalPrice == 0) {
      this.payOrder()
    } else {
      wx.showToast({
        icon: "none",
        title: '请上传对公转账凭证！',
      })
    }
  }, 5000),
  skipToOrders(code) {
    setTimeout(() => {
      wx.navigateTo({
        url: code == 0 ? `/order/pages/orderPay/paySuccess/paySuccess` : code == 8888 ? `/personal/pages/orderIndex/order?type=${0}` : ``,
      })
    }, 1200)
  },
  // 对公转账支付
  payOrder() {    
    if(!this.data.submitStatus) return;
    this.setData({
      submitStatus:false,
    })
    let that = this;
    wx.showToast({
      title: '请稍后...',
    })
    let transferInfo = this.data.transferInfo
    let params = {
      payChannel: 1,
      addressId: transferInfo.addressId,
      paymentId: transferInfo.paymentId,
      voucherUrl: this.data.transferImg,
    }
    if (transferInfo.tailstatusPayFlag) {
      params.tailstatusPayFlag = true
    }
    if (transferInfo.totalPrice == 0) {
      params.zeroPayAmountFlag = true
    }
    payForOffline(params).then(res => {
      if (res.code == 0 || res.code == 8888) {
        this.setData({
          submitStatus: true,
        });
        wx.hideLoading({
          success: (res) => {},
        });
        wx.showToast({
          title: '支付成功！',
        });
        this.skipToOrders(res.code)
      } else if (res.code == 50000) {
        wx.showToast({
          icon: "warning",
          title: res.data,
        })
      } else {
        app.modalBox('','服务出错，请刷新订单详情查看支付状态！',false,function(res){
          if(res){
            that.skipToOrders(8888)
          }
        })
      }
    })
  },
  // 进入本页面赋值
  setTransferInfo(val) {
    this.setData({
      transferInfo: val
    });
    if(val.categoryId==3){
      let list = this.data.backList
      list[0].value = '上海恩凡知识产权代理有限公司';
      list[1].value = '454681983746';
      list[2].value = '中国银行股份有限公司上海市航华支行';
      this.setData({
        backList: list
      })
    }
  },
  // 离开页面弹框（手势离开）
  leaveEnable() {
    wx.enableAlertBeforeUnload({
      message: '正在使用对公转账功能，确定放弃此次付款？',
    })
  },
  // 复制订单编号
  copyText(e) {
    let number = e.currentTarget.dataset.number
    console.log("点击了！", number)
    wx.setClipboardData({
      data: number,
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
  onLoad: function (options) {
    let data = JSON.parse(options.data)
    console.log(data);
    this.setTransferInfo(data)
    this.leaveEnable()
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("监听页面隐藏")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.redirectTo({
      url: `/personal/pages/orderIndex/order?type=${1}`,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})