// personal/pages/my-process/detail/transfer-detail/transfer-detail.js
import { getDetailByTaskId, getAuditLogList, getTransferCode, postTransferFail, constantcatagory, auditOfflineSuccess } from "../../../../../utils/api/process";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transferDetail: {},
    userInfo: null,
    showMobile: null,
    cTabIndex: 0,
    tabList: [ '订单信息', '转账凭证', '操作记录' ],
    orderList: [],
    feeInfo:{},
    currentPriceInfo: [],
    voucherUrl: "",
    imageUrl: app.globalData.imageURL,
    logsList: [],
    noShow: false,
    yesShow: false,
    noCode: "",
    yesCode: "",
    noSug: "",
    yesSug: "",
    num: 0,
    btnCode: "获取验证码",
    codeDisabled: false,
    defaultTime:'请选择到账时间',
    currentDate: new Date().getTime(),
    minDate: new Date(2021, 1, 1).getTime(),
    maxDate: new Date().getTime(),
    showDate: false,
    returnList: {},
    returnInfo: "",
    taskId: "",
    fileType: null,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
  },
  getReturnList() {
    constantcatagory().then(res => {
      if (res.code == 0) {
        this.setData({
          returnList: res.data[0].constants
        })
      }
    })
  },
  changeFollowType(e) {
    this.setData({
      returnInfo: this.data.returnList[e.detail.value]
    })

  },
  previewImg(e) {
    wx.previewImage({
      urls: [this.data.imageUrl+this.data.voucherUrl],
    })
  },
  // 提交通过审核
  confirmYes() {
    console.log(this.data.currentDate);
    if (!this.data.currentDate || this.data.defaultTime == '请选择到账时间') {
      wx.showToast({
        title: '请选择到账时间',
        icon: 'error'
      })
    } else if (!this.data.returnInfo.constantValue) {
      wx.showToast({
        title: '请选择回款去向',
        icon: 'error'
      })
    } else if (!this.data.yesCode) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'error'
      })
    } else {
      let params ={
        payTime: this.data.currentDate,
        auditMessage: this.data.yesSug,
        receiveDirectionName: this.data.returnInfo.constantValue,
        code: this.data.yesCode,
        taskId: this.data.taskId,
      }
      auditOfflineSuccess(params).then(res => {
        if (res.code == 0) {
          wx.showToast({
            icon: "none",
            title: "操作成功！",
          })
          this.setData({
            yesShow: false,
          })
          this.onLoad({taskId: this.data.taskId})
        } else {
          wx.showToast({
            icon: "error",
            title: res.msg,
          })
        }
      })
    }
  },
  // 提交未通过审核
  confirmNo() {
    if (!this.data.noCode) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'error'
      })
    } else if (!this.data.noSug) {
      wx.showToast({
        title: '请填写审批意见',
        icon: 'error'
      })
    } else {
      let params = {
        auditMessage: this.data.noSug,
        code: this.data.noCode,
        taskId: this.data.taskId,
      }
      postTransferFail(params).then(res => {
        if (res.code == 0) {
          wx.showToast({
            icon: "none",
            title: "操作成功！",
          })
          this.setData({
            noShow: false,
          })
          this.onLoad({taskId: this.data.taskId})
        } else {
          wx.showToast({
            icon: "error",
            title: res.msg,
          })
        }
      })
    }
    
  },
  showDateFn() {
    this.setData({
      showDate: true,
    })
  },
  cancel() {
    this.setData({
      showDate: false,
    })
  },
  // 时间格式操作
  formatDate(date) {
    date = new Date(date);
    let year = date.getFullYear()
    let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    return `${year}-${month}-${day} ${hour}:${minute}:00`;
  },
  confirm(e) {
    let date = e.detail
    let currentDate = this.data.currentDate
    currentDate = this.formatDate(date)
    this.setData({
      currentDate: currentDate,
      defaultTime: currentDate
    })
    this.cancel()
    console.log(this.data.currentDate);
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
  changeTab(e) {
    this.setData({
      cTabIndex: e.detail.name
    })
  },
  getTransfeDetail(options) {
    this.setData({
      taskId: options.taskId
    })
    this.getAllDetail()
  },
  //获取列表
  getAllDetail() {
    getDetailByTaskId(this.data.taskId).then(res => {
      if (res.code == 0) {
        this.setData({
          orderList: [res.data.priceInfo.data],
          currentPriceInfo: res.data.currentPriceInfo,
          voucherUrl: res.data.taskInfo.voucherUrl,
          transferDetail: res.data.taskInfo,
          showMobile: res.data.taskInfo.taskCurrentEmpMobile.substring(res.data.taskInfo.taskCurrentEmpMobile.length-4),
          fileType: res.data.taskInfo.voucherUrl.substring(res.data.taskInfo.voucherUrl.length - 3)
        })
        this.filterPrice();
      }
    })
  },
   //过滤价格列表
   filterPrice(){
    let fee = this.data.orderList[0].orderFeeVoList;
    let agents =  fee.filter(idx => idx.costType == 1);
    let num = this.data.orderList[0].buyNum;
    let feeInfo = this.data.feeInfo
    feeInfo.agents = agents.length==0 ? 0:agents.length==1?agents[0].price*num:agents.reduce((n,m) => n.price + m.price)*num;//代理费总计
    let thirds =  fee.filter(idx => idx.costType == 2);
    feeInfo.thirds = thirds.length==0 ? 0:thirds.length==1?thirds[0].price*num:thirds.reduce((n,m) => n.price + m.price)*num;//第三方费用总计          
    let officials =  fee.filter(idx => idx.costType == 3);
    feeInfo.officials = officials.length==0 ? 0 : officials[0].price*num
    let type = this.data.currentPriceInfo[0].payType;
    feeInfo.payType = type;//判断订单支付类型定金或一口价
    this.setData({
      feeInfo: feeInfo
    })
    this.filterFeeType(this.data.currentPriceInfo);   
  },
  // 过滤定金尾款费用
  filterFeeType(data){
      let types = {};
      data.forEach(i => {
        if(i.costType==1){ //代理费
          types.agentFee = i.price * i.buyNum
        }
        if(i.costType==2){ //第三方费用
          types.thirdFee = i.price * i.buyNum
        }
        if(i.costType==3){ //官费费用
          types.officialFee = i.price * i.buyNum
        }
      });
      let feeInfo = this.data.feeInfo
      feeInfo.fees = types;
      this.setData({
        feeInfo: feeInfo,
      })
  },
  handleBtn(e) {
    if (e.currentTarget.dataset.name == 0) {
      this.setData({
        noShow: true
      });
    } else {
      this.setData({
        yesShow: true
      });
    }
  },
  handleClose(e) {
    if (e.currentTarget.dataset.name == 0) {
      this.setData({
        noShow: false
      });
    } else {
      this.setData({
        yesShow: false
      });
    }
  },
  getAuditLogList() {
    let params = {
      type: 2,
      taskId: this.data.taskId
    }
    getAuditLogList(params).then(res => {
      if (res.code == 0) {
        this.setData({
          logsList: Object.values(res.data).map(item => Object.values(item)[0])
        })
      }
    })
  },
  yesCodeChange(e) {
    this.setData({
      yesCode: e.detail
    })
  },
  yesSugChange(e) {
    this.setData({
      yesSug: e.detail
    })
  },
  noCodeChange(e) {
    this.setData({
      noCode: e.detail
    })
  },
  noSugChange(e) {
    this.setData({
      noSug: e.detail
    })
  },
  //获取验证码
  getCode() {
    let params = {
      dealId: this.data.transferDetail.taskCurrentEmpId,
      taskNo: this.data.transferDetail.taskNo,
    }
    getTransferCode(params).then(res => {
      if (res.code == 0) {
        wx.showToast({
          icon: "none",
          title: "发送成功，5分钟内有效！",
        })
        this.data.num = 60;
        this.timer();
      }
    })
  },
  timer() {
    if (this.data.num > 0) {
      let num = this.data.num - 1
      let btnCode = this.data.num + "s后重试"
      this.setData({
        codeDisabled: true,
        btnCode: btnCode,
        num: num,
      })
      setTimeout(() => {
          this.timer();
      }, 1000);
    } else {
      this.setData({
        btnCode: "获取验证码",
        num: 60,
        codeDisabled: false,
      })
    }
  },

  // 查看pdf
  checkPdf() {
    let pdfUrl = this.data.transferDetail.voucherUrl
    let fileType = pdfUrl.slice(pdfUrl.indexOf('.') + 1)
    this.downloadContract(this.data.imageUrl + pdfUrl,fileType)
  },

  // 下载pdf
  downloadContract(url,fileType) {
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
    this.getTransfeDetail(options)
    this.getAuditLogList()
    this.getReturnList()
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
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });
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