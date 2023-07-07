// components/personal/myorder/projectorder/projectorder.js
const app = getApp();
var common = require('../../../../utils/common/userDeal')
import { cancelRefund } from "../../../../utils/api/refund"
import { getEssAuthStatus } from "../../../../utils/api/user"
// import { common } from "../../../../utils/common/userDeal"
import { cancelOrder,deleteOrder,getTaskByTaskNo,signSelf,changeContractType } from "../../../../utils/api/orders.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propertyitem: {
      type: Object,
      value: {}
    },
    whichIndex: {
      type: Number,
      value: 0
    },
    refundStatus: { // true:是退款状态订单 false:不是
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    imageUrl: app.globalData.imageURL,
    videoControl: false,
    feeInfo:{}, 
    signList:[{
      value: 1,
      title: '电子合同',
      desc: '线上签约，安全高效省心'
    },{
      value: 2,
      title: '纸质合同',
      desc: '面签，扫描，邮寄等流程'
    }],
    signIndex:1,
    signOrderId:'',
    mask:true,
    payTail:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fixOrignalFee() {
      let propertyitem = this.data.propertyitem
      if (propertyitem.orderDetailVO.governmentFeeId !== null) {
        return ((Number(propertyitem.orderDetailVO.earnestMoney) + Number(propertyitem.orderDetailVO.governmentReduceFee)) * propertyitem.orderDetailVO.productCount) / 100
      } else {
        return (Number(propertyitem.orderDetailVO.earnestMoney) * propertyitem.orderDetailVO.productCount) / 100
      }
    },
    closeMask(){
      this.setData({
        mask: true,
      })
    },
    refreshList(){
      this.triggerEvent('refresh', {
        whichIndex: this.data.whichIndex
      })
    },
    //检查老用户签约授权状态
    checkOldAuth(e){
      let order = e.currentTarget.dataset.order      
      let refundStatus = [1,2,3,4];
      // 有退款不可签约
      if(refundStatus.includes(order.refundStatus)&&order.orderStatus>=1) return;
      
      // if(order.contractType == 2) return this.chooseSign(e);
      // let url = wx.getStorageSync('userInfo').userType=='1'?essAddAuthPerson : essAddAuthCompany;  
      if(wx.getStorageSync('userInfo').certifiedType == 1) return app.modalBox('','电子签约前需要您更新为高级认证，请先去完成认证','',function(response){
        let para = {
          from: 'senior-approve',
        }
        let data = JSON.stringify(para)
        let authUrl = wx.getStorageSync('userInfo').userType=='2'?`/personal/pages/orgAuthentication/orgAuthentication?data=${data}`: `/personal/pages/perAuthentication/operatePage/operatePage?data=${data}`
        if(response){
          app.toGoalUrl(authUrl)          
        }
      })
      let that = this;
      getEssAuthStatus().then(res=>{
        if(res.code == 0){
          // let status = 0;
          if(res.data.status=='2'|| res.data.status=='5' || res.data.status=='6') return this.chooseSign(e);
          // if(res.data.status == '0') return app.toGoalUrl(`/personal/pages/authentication/authentication`) 0 未激活
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
    changeSign(e){
      let order = e.currentTarget.dataset.order
      let refundStatus = [1,2,3,4];
      if(refundStatus.includes(order.refundStatus)&&order.orderStatus>=1) return;
      console.log(order);
      this.setData({
        signOrderId: order.id,
        signIndex: order.contractType
      })
      this.setData({
        mask: false,
      })
    },
    chooseSign(e){
      let order = e.currentTarget.dataset.order
      let that = this;
      this.setData({
        signOrderId: order.id
      })
      // if(order.contractScope == 3 ) return this.setData({
      //   mask: false,
      // })
      common.chooseSign(order,function(res){
        if(res=='paper'){
          //that.refreshList()
        }
      })      
    },
    //弹框选择签约方式
    chooseOne(e){
      let index = e.currentTarget.dataset.item;
      this.setData({
        signIndex: index
      })
    },
    changeContract() {
      let that = this;
      let certifiedType = wx.getStorageSync('userInfo').certifiedType; //0：未认证；1：初级认证；2：高级认证
      // 选择电子签约身份只有初级认证
      if(this.data.signIndex == 1 && certifiedType == 1) return wx.showModal({
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
            }, 1000)
          }
        }
      });    
      that.closeMask();
      let order = {
        contractType: this.data.signIndex,
        id: this.data.signOrderId,
      }
      common.changeContract(order,function(res){
        console.log(res,'common-选择合同方法');
        if( res.code == 0 || res== 'success' ){          
          that.refreshList();
        }
      },function(err){
        console.log(err);
      });
    },    
    // 去订单详情
    toDeatil(e) {
      if (this.data.refundStatus) {
        // 退款状态订单点击进入退款详情
        this.toRefundDetail()
      } else {
        let id = e.currentTarget.dataset.id
        let info = JSON.stringify(this.data.feeInfo)        
        wx.navigateTo({
          url: '/personal/pages/orderprojectDetail/orderprojectDetail?id=' + id + '&info=' + info ,
        })
      }
    },
    // 计算totalPrice
    fixTotalPrice() {
      let order = this.data.propertyitem
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
      let info = this.data.feeInfo;
      if(info.payStatus == 1) return;
      let order = this.data.propertyitem;      
      let refundStatus = [1,2,3];
      if(refundStatus.includes(order.refundStatus)&&order.orderStatus>=1) return;
      // 项目申报跳转提交订单页面传参
      let finalPrice = '';
      let fee = this.data.feeInfo;
      if(fee.isDue){
        finalPrice = order.totalAmount
      } else if(order.tailStatus && order.orderStatus ==2){
        finalPrice = fee.tailPrice
      } else {
        finalPrice = fee.depositShould
      }
      let params = {
        pageFrom: 0, // 0 代表从订单列表及详情进
        id: order.id, // 产品id
        orderNo: order.orderNo,
        goodsId: this.data.feeInfo.paymentId,//商品id
        coverUrlInfo: order.url, // 封面对象
        productName: order.spuName, // 产品名称
        categoryName: order.categoryName,//产品类型
        type: order.categoryId,
        productCount: order.buyNum, // 选择的产品数量
        totalPrice: finalPrice,
        totalAmount: order.totalAmount,
        feeInfo: this.data.feeInfo,
        spec:order.spec,
        tailstatusPayFlag: order.tailStatus == 1 && order.orderStatus == 2 ? true : false // 是否支付尾款 true-支付 false-不支付
      }
      console.log(params);
      let data = JSON.stringify(params)
      wx.navigateTo({
        url: `/order/pages/submitOrder/projectOrder/projectOrder?data=${encodeURIComponent(data)}`,//防止值出现特殊字符如?、&、=等，导致转换不了报错
      })
    },
    // 取消订单确认弹框
    cancelOperete(e) {
      let that = this
      let order = e.currentTarget.dataset.order
      wx.showModal({
        title: order.orderStatus == 6 ? "确定删除订单？" : "确定取消订单？",
        cancelColor: "#36A6FE",
        cancelText: "再想想",
        confirmColor: "#999999",
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            that.delOrder(order)
          } else if (res.cancel) {}
        }
      })
    },
    // 取消订单操作
    delOrder(val) {
      let params = {
        id: val.id,
      }      
      let status = this.data.propertyitem.orderStatus;
      let url = status==6 ? deleteOrder : cancelOrder;
      url(params).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '操作成功！',
            icon:'success'
          })
          this.triggerEvent('refresh', {
            whichIndex: this.data.whichIndex
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
          wx.showModal({
            title: `审核不通过原因：${res.data.auditMessage}`,
            content: "对公转账审核不通过，您可点击“立即支付”按钮， 再次提交正确的转账凭证或选择其他方式付款。",
            showCancel: false,
          })
        }
      })      
    },
    // 撤销退款申请弹窗
    cancelRefundOperate() {
      let that = this
      wx.showModal({
        title: "撤销退款申请",
        content: "您将撤销本次申请，如果问题未解决，您还可以再次发起。确定撤销吗？",
        cancelColor: "#999999",
        cancelText: "再想想",
        confirmColor: "#36A6FE",
        confirmText: "撤销申请",
        success(res) {
          if (res.confirm) {
            that.cancelRefund()
          } else if (res.cancel) {}
        }
      })
    },
    // 撤销退款接口调用
    cancelRefund() {
      let propertyitem = this.data.propertyitem
      let data = {
        refundNo: propertyitem.taskNo
      }
      cancelRefund(data).then(res => {
        if (res.code == 0) {
          this.triggerEvent('refresh', {
            whichIndex: this.data.whichIndex
          })
        } else if (res.code == 1) {
          wx.showToast({
            icon: "none",
            title: res.msg,
          })
        }
      })
    },
    // 跳转到退款详情页面
    toRefundDetail() {
      let refundNo = this.data.propertyitem.taskNo
      wx.navigateTo({
        url: `/order/pages/refund/refundDetail/refundDetail?refundNo=${refundNo}&pageFrom=${1}`,
      })
    },
    filterPrice(){
      let item = this.data.propertyitem;
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
        payTail: item.orderStatus==2&&item.tailStatus==1 || item.orderStatus==3&&item.tailStatus==1?true:false
      });
      console.log(this.data.feeInfo,'-----feeInfo');
    }
  },
  lifetimes:{
    attached: function () {
      if (wx.getStorageSync('userInfo')) {
        this.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
      }
      this.filterPrice();
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    hide: function() {
      // 页面被隐藏
      this.closeMask();
      console.log('hide-closeMask');
    },
  }
})