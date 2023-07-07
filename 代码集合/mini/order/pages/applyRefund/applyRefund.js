// personal/pages/orderprojectDetail/orderprojectDetail.js
const app = getApp();
import { getOrderInfo } from "../../../utils/api/orders"
import { saveRefund } from "../../../utils/api/refund"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:null,
    imageUrl: app.globalData.imageURL,
    orderInfo: {},
    maskBox:null,
    inputText: '',
    inputTextLen: 0,
    refundNum: 0,
    radio:null,
    dialogList:[{
      title:'下错单了',
      val:1
    },{
      title:'付款金额错误',
      val:2
    },{
      title:'付款方式错误',
      val:3
    },{
      title:'服务终止',
      val:4
    },{
      title:'其他',
      val:5
    }],
    showDialog: false,
    radioStatus: false,
    amountError: 1,
    amountErrorTxt: null,
    reasonIndex: null,
    refundAmount: null,
    payAmount: null,
    payAmountSingle:null,
    feeInfo: null,
  },    
  handleDialog() {
    this.setData({
      showDialog: !this.data.showDialog,
    })
  },
  // 选择退款原因
  chooseReason(){
    this.setData({
      radioStatus:true,
      reasonIndex: this.data.radio
    });
    this.handleDialog();
  },
  changeRadio(e){
    this.setData({
      radio: e.currentTarget.dataset.index
    })
  },
   //金额校验
   checkAmount() {
    let reg = /^[1-9]\d*$/;
    if (!reg.test(this.data.refundAmount)) {
      this.setData({
        amountError: 0,
        amountErrorTxt: '请输入正整数不可含小数点和0！'
      })
    } else if(this.data.refundAmount>this.data.payAmountSingle*this.data.refundNum) {
      this.setData({
        amountError: -1,
        amountErrorTxt:'输入的金额超出实际支付金额！'
      })
    } else {
      this.setData({
        amountError: 1,
      })
    }
  },
  // 获取输入金额
  getInputValue(e){
    this.setData({
      refundAmount: e.detail.value,
    })
  },
  // 跳转产品详情
  toProductDetail() {
    let info = this.data.orderInfo;
    let url = `/search/pages/productdetails/productdetails?id=${info.spuId}&type=${info.categoryId}`
    app.toGoalUrl(url)
  },
  setCount(e){
    let status = e.currentTarget.dataset.status
    if(status && this.data.refundNum == this.data.orderInfo.buyNum) return app.toastBox('数量已达退款上限','none',1500)
    if(!status && this.data.refundNum == 1) return app.toastBox('数量不得小于1','none',1500)
    this.setData({
      refundNum: status ? this.data.refundNum + 1 : this.data.refundNum - 1,
      refundAmount: status ?  Number(this.data.refundNum + 1)*this.data.payAmountSingle : Number(this.data.refundNum - 1)*this.data.payAmountSingle
    });
    if(this.data.amountError!=1){
      this.checkAmount();
    }
  },
  getInputText (e) {
    let inputText = e.detail.value;
    if (e.detail.value.length > 200) {
      inputText = inputText.substring(0, 200);
    }
    this.setData({
      inputText: inputText,
      inputTextLen: 0 || inputText.length
    })
  },
  // 显示loading效果
  showLoading(flag) {
    if (flag) {
      wx.showLoading({
        title: '加载中！',
      })
    } else {
      wx.hideLoading({
        success: (res) => {
          // this.setData({
          //   loading: false
          // })
        },
      })
    }
  },
  // 复制订单编号
  copyText() {
    let that = this
    wx.setClipboardData({
      data: that.data.orderInfo.orderNo,
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
  // 提交退款
  submitRefund(){
    let order =  this.data.orderInfo;
    let index = this.data.reasonIndex;
    if(index==null) return app.toastBox('请选择退款原因！','none',1500);
    if(!this.data.refundAmount) return this.checkAmount();
    if(this.data.amountError!=1) return;
    let para = {
      orderId: order.id,
      refundAmount: this.data.refundAmount,
      refundNum: this.data.refundNum,
      refundReason: this.data.dialogList[index].val,
      description: this.data.inputText,
      cashFlag: 1,
    };
    saveRefund(para).then(res=>{
      if(res.code == 0){
        app.toastBox('申请成功！','success',1000);
        setTimeout(()=>{
          app.toReUrl('/personal/pages/orderIndex/order?type=4')
        },1000)
      } else {
        app.toastBox(res.msg,'warning',1500)
      }
    })
  },
  // 获取订单详情信息
  getData(id) {
    this.showLoading(true)
    // 获取订单相关信息
    getOrderInfo(id).then(res => {
        if (res.code == 0) {
        // this.dealPayAmount(res.data.orderStatus,res.data.orderFeeVoList);
        console.log(this.data.payAmount,this.data.feeInfo);
        if(this.data.feeInfo){this.computePayAmount(res.data)};
        this.setData({
          orderInfo: res.data,
          refundNum: res.data.buyNum,
          payAmountSingle: this.data.payAmount ? this.data.payAmount/res.data.buyNum : null,
        })
        this.showLoading(false)
      }
    })
  },   
  dealPayAmount(status, list){
    console.log(status);
    if(status==1){
      let idx = list.findIndex(item=>item.payStatus == 2);
      this.setData({
        refundAmount: list[idx].payAmount
      })
      console.log(list[idx].payAmount);
    }
  },  
  computePayAmount(order){
    let fee = this.data.feeInfo;
    if(fee.isDue || order.tailStatus == 2) {
      this.setData({
        payAmount: order.totalAmount,
        payAmountSingle: order.totalAmount/order.buyNum,
        refundAmount: order.totalAmount,
      })
    } else {
      this.setData({
        payAmount: fee.depositShould,
        payAmountSingle: fee.depositShould/order.buyNum,
        refundAmount: fee.depositShould,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(options.data)
    console.log(data);
    this.setData({
      orderId: data.orderId,
      feeInfo: data.feeInfo ? data.feeInfo : null,
      payAmount: data.payAmount ? data.payAmount : null,
      refundAmount:data.payAmount ? data.payAmount : null,
    })
    this.getData(data.orderId)
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    };
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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