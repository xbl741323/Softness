<template>
  <div class="transfer-box">
    <div class="order-head">
      <img src="~/assets/images/home/back@2x.png" @click="goback()" />
      <p>卧涛收银台</p>
    </div>
    <!-- <div>
      <div class="transfer-info">
        <div class="pay-info">
          <div style="display: flex">订单号：{{orderNo}}
            <img src="~assets/images/order/copy_icon@2x.png" class="orderNo" :data-clipboard-text="orderNo" @click="copyOrder()" />
          </div>
          <div v-if="orderInfo.orderType == 1">
            <p class="pay-info-name" v-if="tailstatusPayFlag">应付: <span class="pay-info-price">￥{{orderInfo.tailAmount/100}}</span></p>
            <p class="pay-info-name" v-else>应付: <span class="pay-info-price">￥{{(Number(orderInfo.earnestMoney)+Number(orderInfo.governmentFee || 0))*orderInfo.productCount/100}}</span></p>
          </div>
          <p class="pay-info-name" v-if="orderInfo.orderType == 0">应付: <span class="pay-info-price">￥{{orderInfo.totalAmount/100}}</span></p>
        </div>
      </div>
    </div> -->

    <!-- <div class="result" v-else>
      <div class="result-box">
        <img src="~/assets/images/order/shz_icon@2x.png" >
        <p class="result-title">您的对公转账正在审核中</p>
        <p class="result-content">你可以随时进入“<span @click="jump('/member/order')" >我的订单</span> ”查看订单详情</p>
      </div>
    </div> -->
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
        <p @click="handleAgain">继续付款</p>
      </div>
    </div>
  </div>
</template>

<script>
import AraleQRCode from 'arale-qrcode'
import Encrypt from '~/plugins/Encrypt'
import { saveOrder,getWeiXinResult } from '@/api/order'
export default {
  components: { 
    // uploadFile 
  },
  head() {
    return {
      title: '微信支付',
      meta: [
        { name: 'keywords', content: '微信支付' },
        {
          hid: 'description',
          name: 'description',
          content:'微信支付'
        }
      ]
    }
  },
  data(){
    return {
      commonDialog: false,
      alertDialog: false,
      orderNo:'',
      id:'',
      orderInfo: {},
      userInfo: {},
      closePage: false,
      tailstatusPayFlag: false,//是否为尾款
      WeichatSrc:null,
      showResult:false,
      count:60,
      timer:null,
      resulttimer:null
    }
  },
  mounted(){
    if(window.history && window.history.pushState){
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goback, false);
    }
    // this.tailstatusPayFlag = this.$route.query.tailstatusPayFlag
    this.orderNo = this.$route.query.orderNo
    // this.id = this.$route.query.id
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if(this.userInfo){
      // this.orderInfo = JSON.parse(Encrypt.decrypt(this.$route.query.data,'v4kgOl8v7SKJlxXM'))
      this.getWechatInfo()
    }else{
      this.$router.push({path:'/login'})
    }
  },
  methods:{
       // 查询微信支付结果
    getOzhifuStatus(){
      getWeiXinResult({id: this.id,orderNo:this.orderNo,tailstatusPayFlag:this.tailstatusPayFlag}).then(res=>{
        if(res.code==0){
            this.showResult = true
            clearInterval(this.resulttimer)
            this.resulttimer = null
        }
      })
    },
    getWechatInfo(){
        this.count = 60
        this.timer = null
        this.resulttimer = null
        clearInterval(this.resulttimer)
        clearInterval(this.timer)
        // submitPay(this.orderInfo).then(res=>{
            // if(res.data.code == 0){
                const result = new AraleQRCode({
                    render:  "svg",  /*  生成的类型 'svg' or 'table dom元素类型 */
                    text: this.$route.query.codeUrl, /* 二维码的链接*/
                    size: 210,  /* 二维码的大小 */
                    image: ''
                })
                const svgXml = new XMLSerializer().serializeToString(result);
                this.WeichatSrc = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml)))
                this.timer = setInterval(()=>{
                     if(this.count ==0){
                         clearInterval(this.timer)
                     }else{
                         this.count--
                     }
                },1000)
                this.resulttimer = setInterval(()=>{
                   this.getOzhifuStatus()
                },1000)
                this.$once('hook:beforeDestroy',()=>{
                    clearInterval(this.timer)
                    clearInterval(this.resulttimer)
                })
            // }else{
            //      this.$message({
            //         type: 'error',
            //         message: res.data.msg,
            //         offset: 80,
            //         duration: 3000
            //      })
            // }
        // })
    },
    // getWechatInfo(){
    //     saveOrder(this.orderInfo).then(res=>{
    //         if(res.code == 0){
    //            this.onBridgeReady(res.data.wxPaymentParams)
    //         }
    //     })
    // },  
    // 调取支付 
    onBridgeReady(res){
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
          "appId": res.appId,   //公众号ID，由商户传入    
          "timeStamp": res.timeStamp,   //时间戳，自1970年以来的秒数    
          "nonceStr": res.nonceStr,      //随机串    
          "package": res.package,
          "signType": res.signType,     //微信签名方式：    
          "paySign": res.paySign //微信签名
      },
      function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
          }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
              
          }else if(res.err_msg == "get_brand_wcpay_request:fail"){
          }
      })
    },
    handleAgain(){
       this.commonDialog = false
       this.alertDialog = false
       this.getWechatInfo()
    },
    copyOrder(){
      new ClipboardJS('.orderNo')
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
        this.$router.push({
          path: '/member/order'
        })
      }
    },
    goback(){
      this.commonDialog = true;
      this.alertDialog = true;
    }
  },
  beforeDestroy() {
    if(this.closePage){
        window.removeEventListener('popstate', this.goback, false);
    }else{
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goback, false);
    }
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
  grid-template-columns: 28% 72%;
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