<template>
  <div class="transfer">
    <div class="transfer-frame">
        <div class="public-transfer">
            <div class="bar">
                <img src="~assets/images/order/WT_logo@2x.png" />
                <p class="title">收银台</p>
            </div>
            <div class="user"><p @click="jump('/member')" class="name">{{userInfo.username}}</p> &nbsp;|&nbsp; <p @click="jump('/member/order')" class="my-order">我的订单</p></div>
        </div>
        <div class="public-transfer order-info" v-if="showResult==false">
            <p>订单已生成，请尽快完成付款！订单号：{{$route.query.orderNo}}</p>
            <!-- <div v-if="orderInfo.orderType == 1">
                <p class="pay-amount" v-if="tailstatusPayFlag">应付 <span>{{orderInfo.tailAmount/100}}</span> 元</p>
                <p class="pay-amount" v-else>应付 <span>{{(Number(orderInfo.earnestMoney)+Number(orderInfo.governmentFee || 0))*orderInfo.productCount/100}}</span> 元</p>
            </div> -->
            <p class="pay-amount">应付 <span>{{$route.query.totalAmount}}</span> 元</p>
        </div>
        <div class="cotent">
            <template v-if="showResult==false">
                <div class="left">
                    <template v-if="count>0">
                        <p>请在<span class="redtip">{{count}}秒</span>内完成支付,</p>
                        <p>过期后请刷新页面重新获取二维码。</p>
                    </template>
                    <div class="weixinborder">
                        <img v-if="WeichatSrc" :src="WeichatSrc" alt="" />
                        <div v-if="count==0" class="timeout" @click="getWechatInfo">点击重新获取二维码</div>
                    </div>
                    <p style="margin-left:45px">打开微信 [ 扫一扫 ]</p>
                    <div class="weitip">
                        <img src="~/assets/images/weixin/weixinzhifudatu@2x.png" width="63px" height="63px" />
                        <span class="logtitle">微信支付</span>
                    </div>  
                </div>
                <div class="right">
                    <img src="~/assets/images/weixin/weixinzhifu_pic@2x.png" width="435px" height="499px" />
                </div>
            </template>
            <template v-if="showResult==true">
                <div class="contentresult">
                    <img src="~/assets/images/member/success@2x.png" />
                    <p class="content-title">您的订单已成功支付!</p>
                    <p class="content-tip">你可以随时进入“<span @click="jump('/member/order')" class="blue">我的订单</span> ”查看订单详情</p>
                </div>
            </template>
        </div>
    </div>
  </div>
</template>

<script>
import AraleQRCode from 'arale-qrcode'
import Encrypt from '~/plugins/Encrypt'
import { getDetailInfoById } from '~/api/fileorder'
export default {
  head() {
    return {
      title: '',
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
      userInfo: {},
      orderInfo: {},
      orderNo: '',
      id:'',
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
      window.addEventListener('popstate', this.goBack, false);
    }
    // this.tailstatusPayFlag = this.$route.query.tailstatusPayFlag
    // this.orderNo = this.$route.query.orderNo
    this.id = this.$route.query.orderId
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if(this.userInfo){
      // this.orderInfo = JSON.parse(Encrypt.decrypt(this.$route.query.data,'v4kgOl8v7SKJlxXM'))
      this.getWechatInfo()
    }else{
      this.$router.push({
        path:'/login'
      });
    }
  },
  destroyed(){
    window.removeEventListener('popstate', this.goBack, false);
  },
  methods:{
    goBack(){
      history.pushState(null, null, document.URL);
      this.$router.push({
        path: '/member/order',
        query:{
          orderNo: this.orderNo
        }
      });
    },
    jump(route){
      this.$router.push({
        path: route
      })
    },
    // 查询微信支付结果
    getOzhifuStatus(){
      getDetailInfoById(this.id).then(res=>{
        if(res.data.code==0){
          if(res.data.data.orderStatus == 1){
            this.showResult = true
            clearInterval(this.resulttimer)
            this.resulttimer = null
          }
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.blue {
  color: #36a6fe;
  cursor: pointer;
}
.timeout{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: #000;
    opacity: 0.85;
    z-index: 999;
    text-align: center;
    color: #fff;
    line-height: 228px;
    cursor: pointer;
}
.cotent{
    width:1190px;
    height: 570px;
    border: 2px solid #e8f5fc;
    padding: 66px 194px 45px 200px;
    display: flex;
}
.weixinborder{
    width:240px;
    height: 240px;
    border: 1px solid #c2c2c2;
    border-radius: 8px;
    padding:15px;
    margin: 10px 0;
    position: relative;
}
.weitip{
    margin-top: 15px;
    display: flex;
    align-items: center;
}
.logtitle{
    font-size: 38px;
    font-weight: 400;
    color: #333333;
    margin-left: 11px;
}
.right{
    margin-left: 100px;
    position: relative;
    top: -40px;
}
 .content-title{
    font-size 18px
    font-weight 550
    margin 20px 0
}
.content-tip{
    font-size 18px
}
.contentresult{
    text-align: center;
    position: relative;
    top: 12%;
    left: 50%;
    transform: translateX(-50%);
}
.transfer{
  border-bottom 1px solid #e8f5fc
  .transfer-frame{
    width 1190px
    min-height 760px
    margin 0 auto
    margin-bottom 0
    color #333333
    .pay-result{
      border 1px solid #E8F5FC
      border-bottom 0
      min-height 680px
      .result-title{
        background #F3FBFE
        line-height 54px
        color #333333
        font-size 18px
        font-weight 550
        padding-left 30px
      }
      .result-box{
        width 350px
        margin 0 auto
        margin-top 20%
        text-align center
      }
      .result-box img{
        width 64px
        height 64px
        margin 0 auto
      }
      .result-box span{
        color #36A6FE
        cursor pointer
      }
    }
    .public-transfer{
      display grid
      grid-template-columns 80% 20%
      margin 39px 0 10px 0
      .bar{
        display flex
      }
      .bar img{
        width 148px
        height 42px
      }
      .user{
        display flex
        text-align right
        cursor pointer
        font-size 14px
        line-height 42px
      }
      .name{
        width 220px
        overflow hidden
        white-space nowrap
        -o-text-overflow ellipsis
        text-overflow ellipsis
      }
      .my-order{
        width 80px
      }
      .title{
        font-size 20px
        font-weight 550
        line-height 42px
        margin-left 20px
      }
    }
    .order-info{
      line-height 81px
      padding 0 30px
      background #f3fbfe
      font-size 16px
      .pay-amount{
        text-align right
      }
    }
    .order-info span{
      color #fb0400
      font-size 18px
      font-weight 550
    }
    .transfer-box{
      display grid
      grid-template-columns repeat(2, 1fr)
      padding 30px
      .transfer-info{
        .info-table{
          margin 10px 0 30px 0
          width 538px
          line-height 42px
          display grid 
          grid-template-columns 20% 80%
          border-right 1px solid #e8f5fc
          border-top 1px solid #e8f5fc
          .table-bar{
            border-bottom 1px solid #e8f5fc
            border-left 1px solid #e8f5fc
          }
          .left-bar{
            font-size 14px
            font-weight 550
            text-align center
          }
          .right-bar{
            text-align none
            padding-left 23px
          }
          .head{
            background #f3fbfe
          }
        }
        .upload-file{
          margin-bottom 10px
        }
      }
      .attention{
        width 483px
        height 236px
        margin-top 30px
        background #f3fbfe
        border-radius 5px
        padding 20px
        font-size 14px
        line-height 23px
        .attention-title{
          font-weight 550
        }
      }
    }
    .submit_btn{
      margin-left 208px
      width 182px
      height 40px
      margin-bottom 30px
      background #36a6fe
      border-radius 5px
      text-align center
      color #FFFFFF
      font-weight 550
      line-height 40px
      cursor pointer
    }
  }
}
.redtip{
    color: red;
}
</style>