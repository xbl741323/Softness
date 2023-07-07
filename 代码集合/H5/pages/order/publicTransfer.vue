<template>
  <div class="transfer-box">
    <div class="order-head">
      <img src="~/assets/images/home/back@2x.png" @click="goback()" />
      <p>卧涛收银台</p>
    </div>
    <div v-if="nonPayment">
      <div v-if="empty"></div>
      <div class="transfer-info" v-else>
        <div class="pay-info">
          <div style="display: flex">订单号：{{orderNo}}
            <img src="~assets/images/order/copy_icon@2x.png" class="orderNo" :data-clipboard-text="orderNo" @click="copyOrder()" />
            <!-- <p class="orderNo" :data-clipboard-text="orderNo" @click="copyOrder()">复制</p> -->
          </div>
          <div v-if="orderInfo.orderType == 1">
            <p class="pay-info-name" v-if="tailstatusPayFlag">应付: <span class="pay-info-price">￥{{orderInfo.tailAmount/100}}</span></p>
            <p class="pay-info-name" v-else>应付: <span class="pay-info-price">￥{{(Number(orderInfo.earnestMoney)+Number(orderInfo.governmentFee || 0))*orderInfo.productCount/100}}</span></p>
          </div>
          <p class="pay-info-name" v-if="orderInfo.orderType == 0">应付: <span class="pay-info-price">￥{{orderInfo.totalAmount/100}}</span></p>
        </div>
        <div class="account">
          <p class="label-title">转账银行账户信息</p>
          <div class="account-info">
            <p class="account-label">收款人户名</p>
            <p class="account-content">卧涛科技有限公司</p>
            <p class="account-label">银 行 卡 号</p>
            <p class="account-content">12086401040008150 <img src="~assets/images/order/copy_icon@2x.png" class="accountNo" data-clipboard-text="12086401040008150" @click="copyAccount()" /></p>
            <p class="account-label">开 &nbsp;&nbsp;户&nbsp;&nbsp; 行</p>
            <p class="account-content">中国农业银行合肥市新政务区支行</p>
            <p class="account-label">备 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</p>
            <p class="account-content">订单号：{{orderNo}}<img src="~assets/images/order/copy_icon@2x.png" class="copyOrder" :data-clipboard-text="orderNo" @click="copyOrder()" /></p>
          </div>
        </div>
        <div class="credentials">
          <p class="label-file"><span style="color:#FF6D27" v-if="!tailstatusPayFlag">*</span> 上传对公转账凭证</p>
          <upload-file :width="8.72" :height="4.77" @file="getPaymentFile" :fileType="'点击上传文件'" />
        </div>
        <div class="prompt">
          <p class="label-title">温馨提示：</p>
          <p>1.下单后请尽快转账，务必保证转账金额与订单金额一致，请勿多转、少转和分次转账，否则影响转账审核进度 ;</p>
          <p>2.汇款时将订单号填写至汇款单“用途/备注/摘要”等栏 ;</p>
          <p>3.对公转账需上传银行转账凭证截图，格式png、jpg等常用图片格式，大小为5M;</p>
          <p>4.提交凭证截图后1-2个工作日内完成审核，若超出时间订单仍为“待付款”状态，请联系客服进行处理。</p>
          <p>5、支付金额为0时,可以不上传支付凭证。</p>
        </div>
      </div>
      <div class="submitbtn" @click="submitPublicTransfer()" v-if="!empty">提 交</div>
    </div>

    <div class="result" v-else>
      <div class="result-box">
        <img src="~/assets/images/order/shz_icon@2x.png" >
        <p class="result-title">您的对公转账正在审核中</p>
        <p class="result-content">你可以随时进入“<span @click="jump('/member/order')" >我的订单</span> ”查看订单详情</p>
      </div>
    </div>
    <!-- 返回上一级弹框 -->
    <!-- 遮罩层 -->
    <el-dialog :visible.sync="commonDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <div v-if="alertDialog" class="alert">
      <div style="height: 102px">
        <p style="font-weight:550;padding-top:25px;">正在使用对公转账功能</p>
        <p>确定取消当前订单吗？</p>
      </div>
      <div class="alert-btn">
        <p @click="closePage = true; back()">放弃</p>
        <p @click="commonDialog = false;alertDialog = false">继续付款</p>
      </div>
    </div>
  </div>
</template>

<script>
import Encrypt from '~/plugins/Encrypt'
import uploadFile from './upload-file.vue'
import { getStatus, publicTransfer } from '@/api/order'
import orderData from '@/pages/order/order-data'
import ClipboardJS from 'clipboard'
export default {
  components: { 
    uploadFile 
  },
  head() {
    return {
      title: '对公转账',
      meta: [
        { name: 'keywords', content: '对公转账' },
        {
          hid: 'description',
          name: 'description',
          content:'对公转账'
        }
      ]
    }
  },
  data(){
    return {
      commonDialog: false,
      alertDialog: false,
      fileUrl:'',
      orderNo:'',
      orderId:'',
      orderInfo: {},
      userInfo: {},
      nonPayment: true,
      empty: true,
      closePage: false,
      tailstatusPayFlag: false,//是否为尾款
    }
  },
  beforeDestroy() {
    if(this.closePage){
      window.removeEventListener('popstate', this.goback, false);
    }else{
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goback, false);
    }
  },
  mounted(){
    if(window.history && window.history.pushState){
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goBack, false);
    }
    this.tailstatusPayFlag = JSON.parse(this.$route.query.tailstatusPayFlag);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.categoryId = JSON.parse(this.$route.query.categoryId)
    if(this.userInfo){
      this.orderInfo = {};
      this.orderNo = this.$route.query.orderNo;
      this.orderId = this.$route.query.orderId;
      if(!this.tailstatusPayFlag){
        this.getOrderStatus(this.orderNo);
      }else{
        this.empty = false;
      };
    }else{
      this.$router.push({
        path:'/login',
        param:{
          orderNo : this.orderNo
        }
      });
    };
  },
  methods:{
    copyOrder(){
      new ClipboardJS('.orderNo');
      this.$message({
        type:'success',
        message:'复制成功',
        offset: 80,
        duration: 1000
      })
    },
    copyAccount(){
      new ClipboardJS('.accountNo');
      this.$message({
        type:'success',
        message:'复制成功',
        offset: 80,
        duration: 1000
      })
    },
    copyOrder(){
      new ClipboardJS('.copyOrder');
      this.$message({
        type:'success',
        message:'复制成功',
        offset: 80,
        duration: 1000
      })
    },
    jump(path){
      this.$router.push({
        path: path
      });
    },
    back(){
      if(this.closePage){
        // window.open('/member/order')
        this.$router.push({
          path: '/member/order'
        })
      }
    },
    goback(){
      this.commonDialog = true;
      this.alertDialog = true;
    },
    getPaymentFile(val){
      this.fileUrl = val;
      console.log(this.fileUrl);
    },
    getOrderStatus(orderNo){
      getStatus({orderNo : orderNo}).then(res=>{
        if(res.data.status == 0){
          this.nonPayment = false;
          this.empty = true;
        }else if(res.data.status == 1 ){
          this.nonPayment = true;
          this.empty = true;
          this.$router.push({
            path: '/member/order'
          });
        }else{
          this.empty = false;
        };
      })
    },
    submitPublicTransfer(){
      let param = {
        paymentId: this.$route.query.id,
        voucherUrl: this.fileUrl,
      }
      if(this.fileUrl){
        if(orderData.throttle(3000)){
          publicTransfer(param).then(res=>{
            console.log(res);
            if(res.code == 0){
              this.$store.state.loading = false;
              this.nonPayment = false;
            }else if(res.code == -1){
              this.$store.state.loading = false;
              this.$message({
                type:'warning',
                message:res.msg,
                offset: 80,
                duration: 2000
              })
            }else if(res.code == 8888){
              this.$store.state.loading = false;
              this.$message({
                type: 'success',
                message:'订单支付成功！',
                offset: 80,
                duration: 2000
              })
              this.$router.push('/member/order');
            }else if(res.code == 50000){
              this.$store.state.loading = false;
              this.$message({
                type: 'warning',
                message: res.data,
                offset: 80,
                duration: 2000
              })
              this.$router.push('/member/order');
            }else {

            };
          })
        }
      }else{
        this.$message({
          type:'warning',
          message:'请先上传您的对公转账凭证!',
          offset: 80,
          duration: 2000
        })
      };
    },
  }
}
</script>

<style scoped>
.transfer-box{
  width: 100%;
  color: #333333;
  font-size: .37333rem;
  background: #F4F4F4;
  height: 100%;
  padding-top: 50px;
  padding-bottom: 1.8rem;
}
.order-head{
  display: flex;
  line-height: 50px;
  height: 50px;
  background: #FFFFFF;
  position: fixed;
  width: 100%;
  top: 0;
}
.order-head p{
  margin: 0 auto;
  font-size: .427rem;
}
.order-head img{
  margin: auto 0;
  width: 15px;
  height: 15px;
  margin-left: 15px;
}
.transfer-info{
  width: 95%;
  margin: 0 auto;
  background: #FFFFFF;
  border-radius: 10px;
  margin-top: 10px;
}
.pay-info{
  /* display: grid;
  grid-template-columns: 59% 41%; */
  line-height: 1.2rem;
  padding: 0 .32rem;
  border-bottom: 1px solid #F4F4F4;
}
.pay-info img{
  width: 16px;
  height: 16px;
  margin: auto 10px;
}
.pay-info-name{
  font-weight: 550;
  text-align: left;
  margin: 0;
}
.pay-info-price{
  color: #FF6D27;
}
.account{
  padding: .32rem;
}
.account-info{
  display: grid;
  grid-template-columns: 25% 75%;
  border: 1px solid #E5E5E5;
  border-bottom: 0;
  line-height: .746rem;
}
.label-title{
  font-weight: 550;
  margin-bottom: .266rem;
}
.account-label{
  font-weight: 550;
  text-align: center;
  border-bottom: 1px solid #E5E5E5;
  border-right: 1px solid #E5E5E5;
}
.account-content{
  display: flex;
  padding-left: .12rem;
  border-bottom: 1px solid #E5E5E5;
  font-size: .32rem;
}
.account-content img{
  width: 16px;
  height: 16px;
  margin: auto 10px;
}
.credentials{
  text-align: center;
}
.label-file{
  text-align: left;
  font-weight: 550;
  margin-left: .32rem;
  margin-bottom: .266rem;
}
.prompt{
  padding: .32rem;
  font-size: .32rem;
  line-height: .5rem;
}
.submitbtn{
  width: 351px;
  height: 34px;
  background: linear-gradient(126deg,#82d6f6 0%, #0c89e9 98%);
  border-radius: 17px;
  text-align: center;
  margin: 0 auto;
  line-height: 34px;
  margin-top: 1rem;
  color: #FFFFFF;
}
.alert{
  width: 90%;
  position: fixed;
  top: 45%;
  left: 5%;
  border-radius: 10px;
  background: #FFFFFF;
  font-size: .426rem;
  line-height: 30px;
  z-index: 9999;
  text-align: center;
}
.alert-btn{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  line-height: 60px;
}
.alert-btn :nth-child(1){
  color: #999999; 
  font-size: .53rem;
  border-top: 1px solid #E5E5E5;
  border-right: 1px solid #E5E5E5;
}
.alert-btn :nth-child(2){
  color: #36A6FE; 
  font-size: .53rem;
  border-top: 1px solid #E5E5E5;
}
.result{
  height: 90vh;
  background: #FFFFFF;
  padding-bottom: 50px;
}
.result-box{
  height: 4rem;
  text-align: center;
  margin: 0 auto;
  padding-top: 35%;
}
.result-box img{
  width: 1.866rem;
  height: 2.29333rem;
}
.result-box span{
  color: #36A6FE;
}
.result-title{
  font-size: .426666rem;
  font-weight: 550;
  margin-top: 20px;
  margin-bottom: 10px;
}
.result-content{
  font-size: .32rem;
}
</style>