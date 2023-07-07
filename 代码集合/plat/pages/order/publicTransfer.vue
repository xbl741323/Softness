<template>
  <div class="transfer">
    <div class="transfer-frame">
      <div class="public-transfer">
        <div class="bar">
          <img @click="toHome" src="~assets/images/order/WT_logo@2x.png" />
          <p class="title">收银台</p>
        </div>
        <div class="user"><p @click="jump('/member')" class="name">{{userInfo.username}}</p> &nbsp;|&nbsp; <p @click="jump('/member/order')" class="my-order">我的订单</p></div>
      </div>
      <div v-if="nonPayment">
        <div v-if="!empty">
          <div class="public-transfer order-info">
            <p>订单已生成，请尽快完成付款！订单号：{{orderNo}}</p>
            <div>
              <p class="pay-amount" v-if="tailstatusPayFlag">应付 <span>{{(Number($route.query.unitFinal) || Number($route.query.finalPrice)) * Number($route.query.payNum)}}</span> 元</p>
              <p class="pay-amount" v-else>应付 <span>{{ (Number($route.query.unitDeposit || 0) + Number($route.query.unitOfficial || 0))* Number($route.query.payNum) || 0 }}</span> 元</p>
            </div>
            <!-- <p v-else class="pay-amount">应付 <span>{{ $route.query.payAmount }}</span> 元</p> -->
          </div>
          <div class="transfer-box">
            <div class="transfer-info">
              <p class="">转账银行信息</p>
              <div class="info-table" v-if="!'2,3,4,5,6'.match(categoryId)">
                <p class="table-bar left-bar head">收款人户名</p>
                <p class="table-bar right-bar head">卧涛科技有限公司</p>
                <p class="table-bar left-bar">银 行 卡 号</p>
                <p class="table-bar right-bar">12086401040008150</p>
                <p class="table-bar left-bar">开 户 行</p>
                <p class="table-bar right-bar">中国农业银行合肥市新政务区支行</p>
                <p class="table-bar left-bar">备 注</p>
                <p class="table-bar right-bar">订单号：{{orderNo}}</p>
              </div>
              <div class="info-table" v-if="'2,3,4,5,6'.match(categoryId)">
                <p class="table-bar left-bar head">收款人户名</p>
                <p class="table-bar right-bar head">上海恩凡知识产权代理有限公司</p>
                <p class="table-bar left-bar">银 行 卡 号</p>
                <p class="table-bar right-bar">454681983746</p>
                <p class="table-bar left-bar">开 户 行</p>
                <p class="table-bar right-bar">中国银行股份有限公司上海市航华支行</p>
                <p class="table-bar left-bar">备 注</p>
                <p class="table-bar right-bar">订单号：{{orderNo}}</p>
              </div>
              <p class="upload-file" ><span style="color:red">*</span> 上传支付凭证</p>
              <upload-file :width="538" :height="245" @file="getPaymentFile" :fileType="'本地文件'"  />
            </div>
            <div class="attention">
              <p class="attention-title">注意事项</p>
              <p>1、下单后请尽快转账，务必保证转账金额与订单金额一致，请勿多转、少转和分次转账，否则影响转账审核进度；</p>
              <p>2、汇款时将订单号填写至汇款单“用途/备注/摘要”等栏。</p>
              <p>3、对公转账需上传银行转账凭证截图，格式为png、jpg、pdf等常用图片格式，大小为5M。</p>
              <p>4、提交凭证截图后1-2个工作日内完成审核，若超出时间订单仍为“待付款”状态，请联系客服进行处理。</p>
              <p>5、支付金额为0时,可以不上传支付凭证。</p>
            </div>
          </div>
          <div class="submit_btn" @click="submitPublicTransfer()">提 交</div>
        </div>
        <div v-else></div>
      </div>
      <div class="pay-result" v-else>
        <p class="result-title">支付结果</p>
        <div class="result-box">
          <img src="~/assets/images/member/shenhe@2x.png" />
          <p class="content-title">您的对公转账正在审核中</p>
          <p class="content">你可以随时进入“<span @click="jump('/member/order')">我的订单</span> ”查看订单详情</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Encrypt from '~/plugins/Encrypt'
import uploadFile from '~/components/member/components/authentication/upload-file.vue'
import { publicTransfer, getStatus } from '~/api/order'
import  orderData from '~/pages/member/order/productOrder/order-data'
export default {
  components:{
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
      userInfo: {},
      orderInfo: {},
      orderNo: '',
      orderId:'',
      fileUrl: '',
      nonPayment: true,
      empty: true,
      tailstatusPayFlag: false,//是否为尾款
    }
  },
  destroyed(){
    window.removeEventListener('popstate', this.goBack, false);
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
    toHome(){
      this.$router.push('/');
    },
    goBack(){
      history.pushState(null, null, document.URL);
      this.$router.push({
        path: '/member/order',
        query:{
          orderNo: this.orderNo
        }
      });
    },
    getOrderStatus(orderNo){
      getStatus({orderNo : orderNo}).then(res=>{
        if(res.data.data.status == 0){
          this.nonPayment = false;
          this.empty = true;
        }else if(res.data.data.status == 1 ){
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
    getPaymentFile(val){
      this.fileUrl = val;
    },
    submitPublicTransfer(){
      let param = {
        orderPort: "PC",
        paymentId: this.$route.query.id,
        addressId: this.$route.query.addressId,
        voucherUrl: this.fileUrl,
      }
      if(this.fileUrl){
        if(orderData.throttle(3000)){
          publicTransfer(param).then(res=>{
            if(res.data.code == 0){
              this.$store.state.loading = false;
              this.nonPayment = false;
            }else if(res.data.code == -1){
              this.$store.state.loading = false;
              this.$message({
                type:'warning',
                message:res.data.msg,
                offset: 80,
                duration: 2000
              })
            }else if(res.data.code == 8888){
              this.$store.state.loading = false;
              this.$message({
                type: 'success',
                message:'订单支付成功！',
                offset: 80,
                duration: 2000
              })
              this.$router.push('/member/order');
            }else if(res.data.code == 50000){
              this.$store.state.loading = false;
              this.$message({
                type: 'warning',
                message: res.data.data,
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
    jump(route){
      this.$router.push({
        path: route
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
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
        .content-title{
          font-size 18px
          font-weight 550
          margin 20px 0
        }
        .content{
          font-size 18px
        }
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
      margin 39px 0
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
</style>