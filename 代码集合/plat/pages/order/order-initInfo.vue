<template>
  <div class="order_pay_project">
    <div class="order_pay_frame">
      <div class="order-head">
        <img class="logo" @click="toHome" src="@/assets/images/home/wotao@2x.png" alt="">
        <div class="time-line">
          <div class="now-line">
            <!-- <p class="line success-line"></p> -->
            <p class="line active-line"></p>
            <!-- <p class="num success-num">1</p> -->
            <p class="num now-num">1</p>
            <p style="color:#CAECB6">确认产品信息</p>
          </div>
          <div class="now-line">
            <p class="line"></p>
            <p class="num">2</p>
            <!-- <p style="color:#7ABD54">登录/授权</p> -->
            <p style="color: #CCCCCC">登录/授权</p>
          </div>
          <div class="now-line">
            <p class="line"></p>
            <p class="num">3</p>
            <p style="color: #CCCCCC">再次确认信息</p>
          </div>
          <div class="now-line">
            <p class="line"></p>
            <p class="num">4</p>
            <p style="color: #CCCCCC">提交订单</p>
          </div>
        </div>
      </div>
      <div class="order_info">
        <!-- 订单信息 -->
        <p class="title">订单信息</p>
        <div class="product_info_title">
          <p>产品</p>
          <p>服务费</p>
          <p>官费</p>
          <p>数量</p>
        </div>
        <!-- 订单详情->支付页 -->
        <div class="product_info" v-if=" orderDetail.orderFeeVoList ">
          <div class="name">
            <!-- <img class="project_img" :src='imgPath+orderDetail.url' /> -->
            <img class="project_img" :src="imgPath + orderDetail.url" v-if="filterType(orderDetail)"/>
            <video class="project_img" :src='imgUrl + orderDetail.url' v-if="!filterType(orderDetail)" />
            <div class="product_type">
              <p class="product_name">{{orderDetail.spuName}}</p>
              <p class="product_name">{{orderDetail.spec}}</p>
              <p>订单类型：{{orderDetail.categoryName}}</p>
            </div>
          </div>
          <!-- <p class="price">￥{{orderDetail.orderDetailVO.feeType == 2 ? 0 : orderDetail.orderDetailVO.nowFee/100}}</p> -->
          <div class="deposit" v-if="!orderDetail.isDue">
            <p :class="tailstatusPayFlag ? 'deposit-final' : 'deposit-nowfee'"><span >定金</span> ￥{{orderDetail.depositPrice || '0.00'}}</p>
            <p :class="tailstatusPayFlag ? 'deposit-nowfee' : 'deposit-final'"><span>尾款</span> ￥{{ orderDetail.finalPrice || '待定'}}</p>
          </div>
          <div v-if="orderDetail.isDue">
            <p :class="tailstatusPayFlag ? 'deposit-final' : 'deposit-nowfee'"> ￥{{orderDetail.dueDepositPrice  || '0.00'}}</p>
          </div>
          <p :class="tailstatusPayFlag ? 'price final' : 'price'" >￥{{orderDetail.officalPrice || '0.00'}}</p>
          <p>{{orderDetail.buyNum}}</p>
        </div>
        <div class="subject-info">
          <p class="title">主体信息</p>
          <div class="subject-info-list">
            <p v-if="orderUserInfo.userType == 2">公司名称：{{orderUserInfo.companyName}}</p>
            <p v-if="orderUserInfo.userType == 2">统一社会信用代码：{{orderUserInfo.organizationSensitive}}
              <span class="user-tag">{{orderUserInfo.organizationStatus}}</span>
            </p>
            <p v-if="orderUserInfo.userType == 1">签约人姓名：{{orderUserInfo.personName}}</p>
            <p v-if="orderUserInfo.idCard">身份证号码：{{orderUserInfo.idCardSensitive}}
              <span class="user-tag">{{orderUserInfo.personNameStatus}}</span>
            </p>
            <p>签约人手机号：{{orderUserInfo.mobileSensitive}}
              <span class="user-tag">{{orderUserInfo.mobileStatus}}</span>
            </p>
            <p v-if="orderUserInfo.username">主体账号：{{orderUserInfo.username}}</p>
          </div>
        </div>
      </div>
    </div>
    <el-popconfirm
      confirm-button-text='好的'
      cancel-button-text='不用了'
      icon-color="#f90"
      placement="top"
      width="250"
      heigth="100"
      :title="orderUserInfo.msg"
      @confirm="orderLogin()"
    >
      <div slot="reference" class="confirm">确 认</div>
    </el-popconfirm>
    <p class="prompt-content">请确保订单信息的正确性，方可正常下单支付</p>
    
    <!-- 失效链接 -->
    <el-dialog :visible.sync="failureDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <div v-if="failureDialog" class="failure-box">
      <p class="del-title">订单失效</p>
      <p class="failure-content">抱歉，该链接已失效无法正常下单，请看看其他产品吧~</p>
      <div class="del-btn"> 
        <div class="failure-close-btn browse" @click="toHome()">去逛逛</div>
      </div>
    </div>
  </div>
</template>

<script>
import  orderData from '~/pages/member/order/productOrder/order-data'
import { logOut } from "@/api/login"
import { getInitOrderDetail, getOrderUsrerInfo } from '~/api/order'

export default {
  head() {
    return {
      title: '发起订单',
      meta: [
        { name: 'keywords', content: '发起订单' },
        {
          hid: 'description',
          name: 'description',
          content:'发起订单'
        }
      ]
    }
  },
  data(){
    return {
      coverUrl:'',
      imgUrl: process.env.CDN_BASE_URL,
      baseInfo: {}, //产品基本信息
      tradeInfo: {},
      isDue: false,
      unitDeposit: 0, //定金单价
      unitOfficial: 0, //官费单价
      unitFinal: 0, //尾款单价
      finalFeePending: false, //尾款是否待定
      skuId: '', //商品id
      attrFirst: '', 
      attrSecond: '',
      paymentId: '',
      payAmount: '',
      imgPath: process.env.CDN_BASE_URL,
      orderDetail: {},
      orderId:'',
      orderUserInfo: {},
      tailstatusPayFlag:'',
      failureDialog: false
    }
  },
  filters:{
    orderType(val){
      return orderData.orderType(val);
    },
  },
  mounted(){
    this.orderId = this.$route.query.id;
    this.getDetail();
    this.getConfirmOrderUserInfo(this.orderId);
  },
  methods:{
    filterType(item){
      const suffix = item.url.substring(item.url.lastIndexOf('.'),item.url.length).toLowerCase();
      if('jpeg|png|jpg|gif'.match(suffix)){
        return true
      }else{
        return false
      };
    },
    toHome(type){
      window.open('/','_self');
    },
    orderLogin(){
      let codeList = JSON.parse(sessionStorage.getItem('orderCode')) || [];
      let staffIdlist = codeList.filter( item =>{
        return item.orderId == this.orderId
      })
      if(this.orderUserInfo.step == 4){
        this.$router.push({
          path:'/order/initorder-auth',
          query: Object.assign({
            id: this.orderId
          }, staffIdlist.length > 0 ? {
            code: staffIdlist[0].code
          }: {})
        })
      }else if(this.orderUserInfo.step == 0){
        window.open(this.orderUserInfo.authUrl,'_self');
      }else{
        this.$router.push({
          path:'/order/initorder-login',
          query: Object.assign({
            id: this.orderId,
            registerStatus: this.orderUserInfo.step == 2 ? true : false,
            status: this.orderUserInfo.status
          }, staffIdlist.length > 0 ? {
            code: staffIdlist[0].code
          }: {})
        })
      };
    },
    getConfirmOrderUserInfo(orderId){
      getOrderUsrerInfo({orderId: orderId}).then(res=>{
        this.orderUserInfo = res.data.data;
        this.$store.state.phone = this.orderUserInfo.mobile;
        if(this.orderUserInfo.status != 2){
          sessionStorage.setItem('personName',JSON.stringify(this.orderUserInfo.personName));
          sessionStorage.setItem('unitInfo',JSON.stringify(this.orderUserInfo));
        }
      })
    },
    getDetail(){
      logOut().then(res=>{
        localStorage.removeItem('userInfo');
      })
      getInitOrderDetail({id: this.orderId}).then(res=>{
        if(res.data.data.orderStatus == 8){
          this.$router.push({
            path:'/member/order'
          })
        }else{
          this.orderDetail = res.data.data;
          this.$set(this.orderDetail,'dueDepositPrice',0);
          this.$set(this.orderDetail,'depositPrice',0);
          this.$set(this.orderDetail,'finalPrice',0);
          this.orderDetail.orderFeeVoList.forEach(item => {
            if(item.payType == 1){  //定金
              this.$set(this.orderDetail,'hasDeposit',true);
              if(item.costType == 3){  //定金官费
                this.$set(this.orderDetail,'hasOffical',true); 
                this.$set(this.orderDetail,'officalPrice',item.price); //官费单价
              }else{
                this.orderDetail.depositPrice += item.price;
              }
              //payStatus 支付状态：0待付款 1支付中 2支付成功  3支付失败  payChannel支付渠道(0-支付宝，1-对公转账 2-微信)
              if(item.payStatus == 1 && item.payChannel == 1){
                this.$set(this.orderDetail, 'waitingAudit', true);
              }else if(item.payStatus == 3 && item.payChannel == 1){
                this.$set(this.orderDetail, 'transferFailure', true);
              };
              if(item.tradeNo){
                this.$set(this.orderDetail, 'tradeNo', item.tradeNo);
              }
            };
            if(item.payType == 3){ //一口价
              this.$set(this.orderDetail,'isDue',true);
              if(item.costType == 3){  //定金官费
                this.$set(this.orderDetail,'hasOffical',true); 
                this.$set(this.orderDetail, 'officalPrice', item.price); //官费单价
              }else{
                this.orderDetail.dueDepositPrice += item.price;
              };
              if(item.payStatus == 1 && item.payChannel == 1){
                this.$set(this.orderDetail, 'waitingAudit', true);
              }else if(item.payStatus == 3 && item.payChannel == 1){
                this.$set(this.orderDetail, 'transferFailure', true);
              };
              if(item.tradeNo){
                this.$set(this.orderDetail, 'tradeNo', item.tradeNo);
              }
            };
            if(item.payType == 2){ //尾款
              if(this.orderDetail.tailStatus == 0){
                this.$set(this.orderDetail,'hasOffical',false);
              }else{
                this.orderDetail.finalPrice += item.price;
              };
              // if(item.payStatus == 1 && item.payChannel == 1){
              //   this.$set(this.orderDetail, 'waitingAudit', true);
              // }else if(item.payStatus == 3 && item.payChannel == 1){
              //   this.$set(this.orderDetail, 'transferFailure', true);
              // };
            };
          });
          if(this.orderDetail.orderStatus == -3){
            this.failureDialog = true;
          }
        };
      });
    },
  }
}
</script>

<style lang="stylus" scoped>
.order_pay_project{
  border-bottom 1px solid #e8f5fc
  min-height 500px
  .failure-box{
    position: fixed
    width: 457px
    height: 250px
    background: #FFFFFF
    border 1px solid #CCCCCC
    top: 200px
    left: 40%
    z-index: 9999
    color: #333333
    .del-title{
      font-size 20px
      width: 457px;
      margin-left: -1px;
      margin-top: -1px;
      line-height 40px
      background #3DA1FF
      color: #FFFFFF;
      text-align center
    }
    .failure-content{
      margin: 30px 20px;
      font-size: 16px;
    }
    .del-btn{
      // width: 300px;
      margin-top: 70px;
      text-align: center;
    }
    .failure-close-btn{
      margin: 0 auto;
      width: 90px;
      height: 36px;
      line-height: 30px;
      padding: 2px 4px;
      border-radius: 3px;
      cursor: pointer;
      border: 1px solid #eeeeee;
    }
    .browse{
      background: #3DA1FF;
      color: #FFFFFF;
    }
  }
  .confirm{
    width 202px
    height 48px
    margin: 0 auto;
    margin-top: 30px;
    text-align: center
    background #36a6fe
    border-radius 5px
    color #FFFFFF
    font-weight 550
    line-height 48px
    cursor pointer
  }
  .prompt-content{
    max-width: 300px;
    margin: 10px auto;
    color: #cbcbcb;
  }
  .order_pay_frame{
    width 1190px
    min-height 400px
    margin 0 auto
    color #666666
    .order-head{
      display grid
      grid-template-columns repeat(2, 1fr)
    }
    .logo{
      width: 206px;
      height: 60px;
      margin-top: 20px;
      cursor: pointer;
    }
    .time-line{
      display flex
      margin-top 46px
      font-size 14px
      .now-line{
        text-align center
        .line{
          width 131px
          border 1px solid #CCCCCC
        }
        .success-line{
          border 1px solid #CAECB6
        }
        .active-line{
          border 1px solid #7ABD54
        }
        .num{
          width 19px
          height 19px
          line-height 19px
          margin 0 auto
          margin-top -10px
          color #FFFFFF
          border-radius 50%
          background #CCCCCC
        }
        .success-num{
          background #CAECB6
        }
        .now-num{
          background #7ABD54
        }
      }
    }
    .order_info{
      width 100%
      height 380px
      margin-top 48px
      border 1px solid #e8f5fc
      border-radius 5px
      .product_info_title{
        display grid
        grid-template-columns repeat(4, 1fr)
        text-align center 
        border 1px solid #d7ebfb
        border-bottom 0
        line-height 41px
        background #f3fbfe
        margin 0 30px
      }
      .subject-info{
        .subject-info-list{
          margin: 0 30px;
          display: flex;
          .user-tag{
            border-radius: 3px;
            background: #36A6FE;
            color: #FFFFFF;
            padding: 2px 5px;
            font-size: 12px;
          }
          p{
            max-width: 330px;
            margin-right: 30px;
            margin-top: 10px;
          }
        }
      }
      .product_info{
        display grid
        grid-template-columns repeat(4, 1fr)
        text-align center 
        border 1px solid #d7ebfb
        background #f3fbfe
        line-height 112px
        margin 0 30px
        .name{
          display flex
          .product_type{
            text-align left
            height 40px
            margin-top 15px
            font-weight 500
            font-size 14px
            line-height 19px
          }
          .product_type :nth-child(1){
            font-weight 550
          }
          .product_name{
            width: 126px;
            margin-bottom: 10px;
            display: -webkit-box;
            overflow: hidden;
            white-space: normal !important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical
          }
        }
        .price{
          font-size 14px
          color #fb0400
          font-weight 550
        }
        .final{
          color #999999
        }
        .product-num{
          display flex
          margin 0 auto
          img{
            width 24px
            height 24px
            margin auto 0
            cursor pointer
          }
          p{
            margin 0 10px
          }
          .num-input{
            margin auto 0
          }
        }
        .deposit{
          margin auto 0
          line-height 30px
          font-size 14px
          .deposit-nowfee{
            width 60px
            margin 0 auto
            text-align left
            color #E2231A
            white-space nowrap
            span{
              padding 1px 6px
              font-size 12px
              background #E2231A
              color #FFFFFF
            }
          }
          .deposit-final{
            color #999999
            width 60px
            margin 0 auto
            text-align left
            white-space nowrap
            span{
              padding 1px 6px
              font-size 12px
              background #999999
              color #FFFFFF
            }
          }
        }
      }
      .product_info img,video{
        width 118px
        height 84px
        float left
        margin 16px
      }
    }
    .title{
      font-size 16px
      font-weight 550
      color #333333
      margin 30px 0 11px 30px
    }
  }
}
</style>