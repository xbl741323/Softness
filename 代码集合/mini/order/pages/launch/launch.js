// order/pages/launch/launch.js
const app = getApp();
// import { asyncUserInfos } from "../../../utils/common/userDeal"
import {getConfirmOrderUserInfo,getIneffectiveOrderInfo} from '../../../utils/api/orders'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectInfos:{},
    orderInfo:{},
    imageUrl: app.globalData.imageURL,
    feeInfo:{},
  },
  toLogReg(){
    let info = this.data.subjectInfos;
    let para = {
      from: 'launch-order',
      mobile: info.mobile,
      orderId: this.data.orderInfo.id,
      userType: info.userType,
      accountId: info.accountId,
    }
    let data = JSON.stringify(para)
    let authentication =`/personal/pages/orgAuthentication/orgAuthentication?data=${data}`;
    let url = info.step=='2'?`/personal/pages/regist/regist?data=${data}`: info.step=='4'? authentication : `/personal/pages/phoneLogin/phoneLogin?data=${data}`
    if(!info.accountId&& info.mobileStatus=='授权中') return this.toFdd(info.authUrl)
    app.toGoalUrl(url)
  },
  toFdd(url){
    wx.setStorageSync('reloadUrl', url);
    wx.navigateTo({
      url: `/pagesFace/pages/webview/webview?root=user`
    })
  },
  //获取订单主体信息，订单信息
  getInfo(){
    let para = {
      orderId: wx.getStorageSync('orderId').orderId//197 //wx.getStorageSync('orderId')
    };
    getConfirmOrderUserInfo(para).then(res=>{
      if(res.code == 0){
        this.setData({
          subjectInfos:res.data
        });
        //step:1 去登陆 2 去注册(后登陆) 3 (登陆后)去认证单位 4 添加授权人(成功后登陆) 5 (登陆后)去认证个人
        wx.setStorageSync('launchUser', res.data)
      }
    });
    getIneffectiveOrderInfo(para.orderId).then(res=>{
      if(res.code ==0){
        this.setData({
          orderInfo: res.data
        });
        this.filterPrice();
      }
    })
  },
  //跳转提交订单页面
  toOrder(){
    let order = this.data.orderInfo;
    let finalPrice = '';
    let fee = this.data.feeInfo;
    if(fee.isDue){
      finalPrice = order.totalAmount
    } else if(order.tailStatus==1 && order.orderStatus ==2){
      finalPrice = fee.tailPrice
    } else {
      finalPrice = fee.depositShould
    }
    let params = {
      pageFrom: 2, // 2发起订单
      id: wx.getStorageSync('orderId').orderId, // 产品id
      orderNo: order.orderNo,
      goodsId: order.goodsSkuId,//商品id
      coverUrlInfo: order.url, // 封面对象
      productName: order.spuName, // 产品名称
      categoryName: order.categoryName,//产品类型
      categoryId: order.categoryId,//商品id
      productCount: order.buyNum, // 选择的产品数量
      totalPrice: finalPrice,
      totalAmount: order.totalAmount,
      feeInfo: fee,
      attributeText: order.spec,
      tailstatusPayFlag: false // 是否支付尾款 true-支付 false-不支付
    }
    let data = JSON.stringify(params)
    let url = `/order/pages/submitOrder/projectOrder/projectOrder?data=${data}`
    app.toGoalUrl(url)
  },
  //确认信息按钮
  confimInfo(){
    let localInfo = wx.getStorageSync('userInfo');
    let order = this.data.orderInfo;
    let user = this.data.subjectInfos;
    //step:1 去登陆 2 去注册(后登陆) 3 (登陆后)去认证单位 4 添加授权人(成功后登陆) 5 (登陆后)去认证个人
    if(user.mobileStatus=='授权中'){
      let para = {
        content:'您当前的主体正在授权中，查看授权结果',
        confirmText: '好的',
        cancelText:'关闭'
      }
      this.modalBox(para)
    } else if(user.step=="1" && user.status=='2' && !localInfo){
      let para = {
        content:'请先使用已授权的手机号登录该认证主体账号~',
        confirmText: '好的',
        cancelText:'关闭'
      }
      this.modalBox(para)
    } else if(order.orderStatus == -3){
      let para = {
        content:'抱歉，该链接已失效无法正常下单，请看看其他产品吧~',
        confirmText: '去逛逛',
        cancelText:'关闭'
      }
      this.modalBox(para)
    } else if(!localInfo || user.step=="2"){
      let para = {
        content:'该手机号码尚未授权对应主体，请先去授权一个吧~!',
        confirmText: '好的',
        cancelText:'不用了'
      }
      this.modalBox(para)
    } else if (localInfo&&user.status=="1"){
      let para = {
        content:'“您当前的主体正在授权中，无法进行下一步操作，请先完善认证流程再试~”',
        confirmText: '好的',
        cancelText:'不用了'
      }
      this.modalBox(para)
    } else {
      this.toOrder()
    }
    
  },
  //提示信息弹框
  modalBox(para){
    let that = this;
    wx.showModal({
      title: "操作提示",
      content: para.content,
      cancelColor: "#999999",
      cancelText: para.cancelText,
      confirmColor: "#36A6FE",
      confirmText: para.confirmText,
      success(res) {
        if (res.confirm) {
          if(that.data.orderInfo.orderStatus == -3) return app.toTabUrl('/pages/index/index')
          that.toLogReg();
        } else if (res.cancel) {}
      }
    })
  },
  // 价格信息过滤
  filterPrice(){
    let item = this.data.orderInfo;
    let list = item.orderPaymentVoList;
    let para = {};      
    list.forEach(i => {
      if(i.payType == 1){  //定金
        para.tradeNoDeposit = i.orderFeeList[0].tradeNo ? i.orderFeeList[0].tradeNo : '';
        if(item.orderStatus == 0){
          para.payType = i.payType;
          para.payStatus = i.payStatus;//支付状态
          para.paymentId = i.id;
        }
        para.hasDeposit = true;
        para.depositShould = i.payAmount;
        para.deposit = 0;
        if(i.orderFeeList[0].payChannel){ //获取支付方式
          para.depositChannel = i.orderFeeList[0].payChannel
        }
        i.orderFeeList.forEach( j => {
          if(j.costType == 3 && j.price!=0){  //定金官费
            para.hasOffical = true;
            para.offical = j.price; //官费单价
          } else {
            para.deposit += j.price
          }
        });
      };
      if(i.payType == 3){ //一口价
        para.tradeNoDue = i.orderFeeList[0].tradeNo ? i.orderFeeList[0].tradeNo : '';
        if(item.orderStatus == 0){
          para.payType =i.payType
          para.payStatus = i.payStatus;//支付状态
        }
        para.isDue = true;
        para.dueDeposit = 0;
        para.paymentId = i.id;    
        if(i.orderFeeList[0].payChannel){ //获取支付方式
          para.dueChannel = i.orderFeeList[0].payChannel
        }      
        i.orderFeeList.forEach( j => {
          if(j.costType == 3){  //定金官费
            para.hasOffical = true;
            para.offical = j.price; //官费单价
          }else{
            para.dueDeposit += j.price;
          }
        });
      };
      if(i.payType == 2){ //尾款
        para.tradeNoTail = i.orderFeeList && i.orderFeeList[0].tradeNo ? i.orderFeeList[0].tradeNo : '';
        if(item.orderStatus == 2 && item.tailStatus==1){
          para.payType =i.payType
          para.payStatus = i.payStatus;//支付状态
        }
        para.hasTail = true;
        para.tailId = i.id;
        if( i.orderFeeList && i.orderFeeList[0].payChannel){ //获取支付方式
          para.tailChannel = i.orderFeeList[0].payChannel
        }  
        if(item.orderStatus==2&&item.tailStatus==1){
          para.paymentId = i.id;
        }
        para.tailPrice = i.payAmount==0?'待定':i.payAmount/item.buyNum //此处payAmount为尾款总价非单价
      };
    });
    this.setData({
      feeInfo: para
    });
    console.log(this.data.feeInfo,'-----');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 首次进入页面清除登录信息
    if(!options.from){
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('token');
      wx.removeStorageSync('accountId');
    }    
    console.log(wx.getStorageSync('orderId'),'orderId');
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
    this.getInfo();
    // asyncUserInfos();
    // console.log(asyncUserInfos(),'------------------------******************');
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