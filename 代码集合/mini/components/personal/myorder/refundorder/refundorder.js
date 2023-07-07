// components/personal/myorder/projectorder/projectorder.js
const app = getApp();
var common = require('../../../../utils/common/userDeal');
var handles = require('../../../../utils/common/handles')
import { cancelRefund,revokeRefund } from "../../../../utils/api/refund"
import { getEssAuthStatus } from "../../../../utils/api/user"
import { cancelOrder,deleteOrder,getTaskByTaskNo} from "../../../../utils/api/orders.js"
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
      value:1,
      title:'电子合同',
      desc: '线上签约，安全高效省心'
    },{
      value:2,
      title:'纸质合同',
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
    toDetail(e){
      let id = e.currentTarget.dataset.order.tmRefundId;
      wx.navigateTo({
        url: '/order/pages/refundPage/refundDetail?id=' + id,
      })
    },
    refreshList(){
      this.triggerEvent('refresh', {
        whichIndex: 4
      })
    },   
    //弹框选择签约方式
    chooseOne(e){
      let index = e.currentTarget.dataset.item;
      this.setData({
        signIndex: index
      })
    },
    closeMask(){},
    changeContract() {
      this.closeMask()
      let that = this;
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
    //复制操作
    copyTap(e){
      handles.copyTap(e);
    },
    // 撤销退款申请弹窗
    cancelRefundOperate(e) {
      let that = this; 
      handles.cancelRefundOperate(e,function(res){
        if(res == 'success'){
          that.refreshList();             
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
  },
  lifetimes:{
    attached: function () {
      if (wx.getStorageSync('userInfo')) {
        this.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
      }
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