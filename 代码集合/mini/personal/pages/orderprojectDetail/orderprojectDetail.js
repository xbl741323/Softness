// personal/pages/orderprojectDetail/orderprojectDetail.js
const app = getApp();
import {
  checkUrl
} from "../../../utils/common/utils"
var common = require('../../../utils/common/userDeal')
import { getEssAuthStatus } from "../../../utils/api/user"
import { getOrderInfo, getOrderProgressInfo, cancelOrder, deleteOrder,getTaskByTaskNo,listContractByOrderId } from "../../../utils/api/orders"
import {
  getAddressList
} from "../../../utils/api/address"
import { loadBox } from "../../../utils/common/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultAddress: {},
    orderId:null,
    endOriginal: 0,
    endIndex: 3,
    taskMore: ['查看更多', '收起'],
    processList: [],
    taskList: [],
    loading: true,
    mask: true,
    popTitle:'',
    popList:[],
    contractList:[{
      title:'合同1'
    },{
      title:'合同2'
    }],
    contractIndex:0,
    payTail:false,
    imageUrl: app.globalData.imageURL,
    userInfo: {},
    transfer: {
      status: true
    },
    progressList: [{
        title: "提交订单",
        status: 2,
        langStatus: true,
        time: ""
      },
      {
        title: "订单签约", // 数据待对接
        status: 0,
        langStatus: false,
        time: ""
      },
      {
        title: "支付订单",
        status: 1,
        langStatus: true,
        time: ""
      },
      {
        title: "提供服务",
        status: 0,
        langStatus: false,
        time: ""
      },
      {
        title: "服务完成",
        status: 0,
        langStatus: false,
        time: ""
      }
    ],
    orderInfo: {},
    feeInfo: {},
    auditMessage:'',
    signList:[{
      value: 1,
      title:'电子合同',
      desc: '线上签约，安全高效省心'
    },{
      value: 2,
      title:'纸质合同',
      desc: '面签，扫描，邮寄等流程'
    }],
    popIndex:0,
    maskBox:null,
  },  
  maskSubmit(e){
    if(this.data.maskBox == 'sign') return this.changeContract();
    this.checkContract(e);
  },
  // 查看合同
  checkContract(e) {
    let index = this.data.popIndex
    wx.showLoading({
      title: '加载中...',
    })
    let signUrl = this.data.popList[index].signDownloadUrl;
    let cuts = signUrl.indexOf('api/')
    // let electUrl = app.globalData.signUrl+signUrl.slice(cuts + 4) //电子合同换头
    // if(this.data.popList[index].contractType==1){      
    //   wx.setStorageSync('previewContractUrl', electUrl)
    // }
    let url = this.data.popList[index].contractType==2?this.data.imageUrl + signUrl : signUrl;
    // if(this.data.popList[index].contractType==1) return app.toGoalUrl(`/pagesFace/pages/webview/webview?root=preview`)
    wx.downloadFile({
      url: url,
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          fileType: "pdf",
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
   // 审核不通过原因
   showAudit() {
    let data = this.data.feeInfo;
    let no = data.payType==1 ? data.tradeNoDeposit : data.payType == 2 ? data.tradeNoTail : data.payType == 3 ? data.tradeNoDue : '';
    getTaskByTaskNo(no).then(res=>{
      if(res.code == 0){
        this.setData({
          auditMessage: res.data.auditMessage
        })
      }
    })      
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
  closeMask(){
    this.setData({
      mask: true,
    })
  },
  contractMask(){ //this.data.orderId
    listContractByOrderId({orderId:this.data.orderId}).then(res=>{
      if(res.code==0){
        let list = res.data
        if(list.length<1) return app.toastBox('暂无可查看的合同','none',1500);
        this.setData({
          popTitle: '查看合同',
          popList: list,
          mask: false,
          maskBox:'contract',
        })
      } else {
        app.toastBox(res.msg,'none',1500)
      }
    })
  },
  //检查老用户签约授权状态
  checkOldAuth(){
    let refundStatus = [1,2,3,4];
    if(refundStatus.includes(this.data.orderInfo.refundStatus)) return;
    let order = this.data.orderInfo;
    console.log(order);
    // if(order.contractType == 2) return this.toSign();
    let that = this;
    getEssAuthStatus().then(res=>{
      if(res.code == 0){
        if(res.data.status=='2') return this.toSign();
        // if(res.data.status == '0') return app.toGoalUrl(`/personal/pages/authentication/authentication`)
        let content = res.data.status=='3'?'签约授权中，点击查看授权结果' : '由于您首次使用签约功能，需要完成签约授权，请先去授权再来签约吧~'
        // let authUrl = '';
        if(res.data.status!='2') return app.modalBox('',content,'',function(response){
          if(response){
            that.toImpower(res.data.status,res.data.authUrl)
          }
        })
      }
    });
  },
  // 去授权查看授权结果
  toImpower(status,url){
    let para = {
      from: 'old-sign',
      authorizer: 'sq'
    }
    let data = JSON.stringify(para)
    let authUrl = wx.getStorageSync('userInfo').userType=='2'?`/personal/pages/orgAuthentication/orgAuthentication?data=${data}`: `/personal/pages/perAuthentication/operatePage/operatePage?data=${data}`
    console.log(authUrl);
    if(status==3){
      wx.setStorageSync('reloadUrl', url);
      app.toGoalUrl(`/pagesFace/pages/webview/webview?root=user`)
    } else {
      app.toGoalUrl(authUrl)
    }
  },
  changeSign(){
  // 检查是否退款中
    let refundStatus = [1,2,3,4];
    if(refundStatus.includes(this.data.orderInfo.refundStatus)) return;
    let type = this.data.orderInfo.contractType;
    let index = this.data.signList.findIndex(item=>item.value == type)
    this.setData({
      popTitle: '选择签约方式',
      popList: this.data.signList,
      popIndex: index,
      mask: false,
      maskBox:'sign',
    })
  },
  // 去签约
  toSign() {
    let order = this.data.orderInfo;
    let that = this;
    // if(order.contractScope == 3) return this.setData({
    //   popTitle: '选择签约方式',
    //   popList: that.data.signList,
    //   mask: false,
    //   maskBox:'sign',
    // })
    // console.log(this.data.popList);
    common.chooseSign(order,function(res){
      if(res=='paper'){
        that.getData(that.data.orderId)
      }
    })  
  },
  //弹框选择签约方式
  chooseOne(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      popIndex: index
    })
  },
  changeContract() {
    let that = this;
    let certifiedType = wx.getStorageSync('userInfo').certifiedType; //0：未认证；1：初级认证；2：高级认证
    // 选择电子签约身份只有初级认证
    if(this.data.signList[this.data.popIndex].value == 1 && certifiedType == 1) return wx.showModal({
      title: '操作提示',
      content: '由于您的身份未高级认证，无法进行电子签约操作，如需进行电子签约，请先完成高级认证，或者选择纸质合同！',
      showCancel:true,
      confirmText:'去认证',
      cancelText:'放弃认证',
      success (res) {
        if (res.confirm) {
          that.closeMask();
          let userInfo = wx.getStorageSync('userInfo');
          setTimeout(function () {
            wx.navigateTo({
              url: '/personal/pages/authentication/authentication?accountType=' + userInfo.accountType,
            })
          }, 200)
        }
      }
    });    
    this.closeMask()
    let order = {
      contractType: this.data.signList[this.data.popIndex].value,
      id: this.data.orderId,
    }
    common.changeContract(order,function(res){
      console.log(res,'common-选择合同方法');
      if( res.code==0 || res== 'success' ){
        that.getData(that.data.orderId)
      }      
    },function(err){
      console.log(err);
    });
  },
  // 跳转去认证页面
  toCertify() {
    let userInfo = this.data.userInfo
    wx.navigateTo({
      url: '/personal/pages/authentication/authentication?accountType=' + userInfo.accountType + '&status=' + userInfo.accountType,
    })
  },
  // 付尾款时检查用户是否认证，未认证用户给予弹窗提示
  checkCertify() {
    let userInfo = this.data.userInfo
    let that = this
    if (userInfo.certificationStatus !== '1') {
      wx.showModal({
        title: "认证提醒",
        content: "由于您的身份未认证，暂时无法进行付款操作。 为了给您提供更好的服务，请尽快完成认证",
        cancelColor: "#999999",
        cancelText: "放弃认证",
        confirmColor: "#36A6FE",
        confirmText: "去认证",
        success(res) {
          if (res.confirm) {
            that.toCertify()
          } else if (res.cancel) {}
        }
      })
    } else {
      this.submitPay()
    }
  },
  // 跳转产品详情
  toProductDetail() {
    let info = this.data.orderInfo;
    let url = `/search/pages/productdetails/productdetails?id=${info.spuId}&type=${info.categoryId}`
    app.toGoalUrl(url)
  },
  // 跳转退款详情
  toDetail(e){
    let info = this.data.orderInfo;
    wx.navigateTo({
      url: '/order/pages/refundPage/refundDetail?id=' + info.refundId,
    })
  },
  // 1:任务列表收起，0:查看更多
  changeTask(e) {
    let index = e.currentTarget.dataset.index
    if (index == 0) {
      this.setData({
        endOriginal: this.data.endOriginal + 10,
        endIndex: this.data.endOriginal + 10
      })
    } else {
      this.setData({
        endIndex: 3,
        endOriginal: 0
      })
    }
  },
  // 显示任务进度弹窗
  showTask(e) {
    let val = e.currentTarget.dataset.task
    let params = {
      id: val.id,
      workflowName: val.workflowName,
      taskStatus: val.taskStatus,
      productName: this.data.orderInfo.orderDetailVO.productName
    }
    let data = JSON.stringify(params)
    wx.navigateTo({
      url: `/personal/pages/taskProgress/taskProgress?data=${data}`,
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
  //过滤价格信息
  filterPrice(){
    let item = this.data.orderInfo;
    let list = item.orderPaymentVoList;
    let para = {};     
    list.forEach(i => {
      if(i.payType == 1){  //定金
        para.tradeNoDeposit = i.orderFeeList[0].tradeNo ? i.orderFeeList[0].tradeNo : '';
        if(item.orderStatus == 0 || item.orderStatus == 1){
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
        para.payType =i.payType
        para.tradeNoDue = i.orderFeeList[0].tradeNo ? i.orderFeeList[0].tradeNo : '';
        if(item.orderStatus <= 2){
          para.payStatus = i.payStatus;//支付状态
        }
        para.isDue = true;
        para.dueDeposit = 0;
        para.paymentId = i.id;    
        if(i.orderFeeList[0].payChannel){ //获取支付方式
          para.dueChannel = i.orderFeeList[0].payChannel
        }      
        i.orderFeeList.forEach( j => {
          if(j.costType == 3){  //官费
            para.hasOffical = true;
            para.offical = j.price; //官费单价
          }else{
            para.dueDeposit += j.price;
          }
        });
      };
      if(i.payType == 2){ //尾款
        para.tradeNoTail = i.orderFeeList && i.orderFeeList[0].tradeNo ? i.orderFeeList[0].tradeNo : '';
        if(item.orderStatus >= 2 && item.tailStatus==1){
          para.payType =i.payType
          para.payStatus = i.payStatus;//支付状态
        }
        para.tailId = i.id;
        if( i.orderFeeList && i.orderFeeList[0].payChannel){ //获取支付方式
          para.tailChannel = i.orderFeeList[0].payChannel
        }  
        if(item.orderStatus >= 2 && item.tailStatus==1){
          para.paymentId = i.id;
        }
        if(item.tailStatus == 0){
          para.tailStatus = 'wait';
        }else{
          para.tailPrice = i.payAmount/item.buyNum,
          para.tailShould = i.payAmount
        }
      };
    });
    this.setData({
      feeInfo: para,
      // payTail: item.orderStatus==2&&item.tailStatus==1 || item.orderStatus==3&&item.tailStatus==1?true:false
    });
    console.log(para,'-----');
  },
  // 获取订单详情信息
  getData(id) {
    this.showLoading(true)
    // 获取订单相关信息
    getOrderInfo(id).then(res => {
      let time = 'progressList[0].time';
      if (res.code == 0) {
        this.setData({
          orderInfo: res.data,
          [time]: res.data.createTime,
          taskList: res.data.taskList !== null ? res.data.taskList : [],
          payTail: res.data.orderStatus == 2 && res.data.tailStatus == 1 || res.data.orderStatus==3 && res.data.tailStatus == 1?true:false,
          // tabIndex: res.data.taskList !== null ? (res.data.taskList.length > 0 ? 0 : 1) : 1
        })
        this.showLoading(false);
        this.filterPrice()
      }
    })
    //获取订单进度条信息
    getOrderProgressInfo(id).then(res => {
      if (res.code == 0) {
        let result = res.data
        let progressList = this.data.progressList
        progressList[0] = this.filterProgress(0, result.orderStatus, result.orderTime)
        progressList[2] = this.filterProgress(2, result.orderStatus, result.payTime)
        progressList[1] = this.filterProgress(1, result.orderStatus, result.contractTime)
        progressList[3] = this.filterProgress(3, result.orderStatus, result.serviceTime)
        progressList[4] = this.filterProgress(4, result.orderStatus, result.completedTime)
        this.setData({
          progressList: progressList
        })
        console.log(progressList);
        this.showLoading(false)
      }
    })
  },
    // 筛选订单状态状态
    filterProgress(index,status, time) {
      let progressList = this.data.progressList
      progressList[index].time = time?time:''
      if (index == 1) {
        // 待对接状态待对接
        progressList[index].status = time || status>2 ? 2 : status == 1 ? 1 : 0
        progressList[index].title = time ? '已签约' : "待签约"
        progressList[index].langStatus = time || status > 2 ? true : false
      } else if (index == 3) {
        progressList[index].status = status==2 || status==3 ? 1 : status==4 ? 2 : 0
        progressList[index].title = status== 3 ? '服务中' : "提供服务"
        progressList[index].langStatus = time || status > 2 ? true : false
      } else {
        progressList[index].status = time ? 2 : index == 4 && status <= 3 || index == 2 && status == 1 ? 0 : 1
        progressList[index].langStatus = time ? true : false
      }
      return progressList[index]
    },
  // 取消订单确认弹框
  cancelOperete() {
    let order = this.data.orderInfo
    let that = this
    wx.showModal({
      title: order.orderStatus == 6 ? "确定删除？" : "确定取消？",
      cancelColor: "#36A6FE",
      cancelText: "再想想",
      confirmColor: "#999999",
      confirmText: "确定",
      success(res) {
        if (res.confirm) {
          that.delOrder()
        } else if (res.cancel) {}
      }
    })
  },
  // 取消订单操作
  delOrder() {
    let order = this.data.orderInfo
    let url = order.orderStatus== 6 ? deleteOrder : cancelOrder;
    url({id: order.id}).then(res => {
      if (res.code == 0) {
        wx.navigateTo({
          url: `/personal/pages/orderIndex/order?type=${0}`,
        })
      }
    })
  },
  // 计算totalPrice
  fixTotalPrice() {
    let order = this.data.orderInfo
    if (order.orderDetailVO.tailStatus == 0) {
      return order.tailAmount
    } else {
      if (order.orderDetailVO.governmentFeeId !== null) {
        return (order.orderDetailVO.productCount * (Number(order.orderDetailVO.earnestMoney) + Number(order.orderDetailVO.governmentReduceFee)))
      } else {
        return (order.orderDetailVO.productCount * Number(order.orderDetailVO.earnestMoney))
      }
    }
  },
  // 跳转提交订单页面
  submitPay() {
    let order = this.data.orderInfo    
    let refundStatus = [1,2,3];
    if(refundStatus.includes(order.refundStatus)&&order.orderStatus>=1) return;
    let finalPrice = '';
    let fee = this.data.feeInfo;
    if(fee.payStatus == 1) return;
    if(fee.isDue){
      finalPrice = order.totalAmount
    } else if(order.tailStatus==1 && order.orderStatus ==2){
      finalPrice = fee.tailPrice
    } else {
      finalPrice = fee.depositShould
    }
    // 项目申报跳转提交订单页面传参
    let params = {
      pageFrom: 0, // 0 代表从订单列表及详情进
      id: order.id, // 产品id
      orderNo: order.orderNo,
      spec: order.spec,
      goodsId: this.data.feeInfo.paymentId,//商品id
      coverUrlInfo: order.url, // 封面对象
      productName: order.spuName, // 产品名称
      categoryName: order.categoryName,//产品类型
      productCount: order.buyNum, // 选择的产品数量
      totalPrice: finalPrice,
      totalAmount: order.totalAmount,
      feeInfo: this.data.feeInfo,
      type: order.categoryId,
      tailstatusPayFlag: this.data.payTail ? true : false // 是否支付尾款 true-支付 false-不支付
    }
    let data = JSON.stringify(params)
    wx.navigateTo({
      url: `/order/pages/submitOrder/projectOrder/projectOrder?data=${data}`,
    })
  },
  // 判断选择当前订单收件地址
  filterAddresss(list) {
    let orderInfo = this.data.orderInfo
    let result = list.filter((item) => {
      return item.id == orderInfo.receiveAddressId
    })
    if (result.length > 0) {
      this.setData({
        defaultAddress: result[0]
      })
    } else {
      this.setData({
        defaultAddress: list[0]
      })
    }
  },
  viewContract(){
    let info = this.data.orderInfo;
    let that = this;
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: that.data.imageUrl+info.contractFileUrl,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType:'pdf',
          success: function (res) {
            console.log(res);
            console.log('打开文档成功')
          },
          fail: function (error) {
            console.log(error);
            wx.showToast({
                icon: 'none',
                title: '打开文件失败'
            });
          },
        })
      }
    })
  },
  // 获取收件地址信息
  getAddressData() {
    let id = wx.getStorageSync('userInfo').accountId
    let params = {
      accountId: id
    }
    getAddressList(params).then(res => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          this.filterAddresss(res.data)
        }
      }
    })
  },
  // 跳转到提交退款页面
  toRefund() {
    let orderInfo = this.data.orderInfo
    let data = {
      orderId: orderInfo.id, 
      feeInfo: this.data.feeInfo,
    }
    let refundInfo = JSON.stringify(data)
    console.log(refundInfo);
    wx.navigateTo({
      url: `/order/pages/applyRefund/applyRefund?data=${refundInfo}`,
    })
  },
  // 跳转到退款详情页面
  toRefundDetail() {
    let refundNo = this.data.orderInfo.taskNo
    wx.navigateTo({
      url: `/order/pages/refund/refundDetail/refundDetail?refundNo=${refundNo}&pageFrom=${1}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.info),'-------');
    this.setData({
      orderId: options.id
    })
    this.getData(options.id)
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    };
    if(options.info){
      // this.setData({
      //   feeInfo: JSON.parse(options.info)
      // });
      let info = JSON.parse(options.info);
      if(info.payStatus==3){
        setTimeout(()=>{
          this.showAudit()
        },300)
      }
      
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
    this.getAddressData()
    if (this.selectComponent("#wx")) {
      this.selectComponent("#wx").getUserData()
    }
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