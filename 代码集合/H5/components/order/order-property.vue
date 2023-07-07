<template>
  <div class="order_pay">
    <div class="order-head">
      <img src="~/assets/images/home/back@2x.png" @click="goback()" />
      <p>确认订单</p>
    </div>
    <div class="product-info">
      <p class="title">商品信息</p>
      <!-- 订单详情->支付页 -->
      <div class="orderinfo" v-if="$route.query.source == 'pay-list' && orderDetail.orderDetailVO">
        <!-- 1-专利，2-商标，3-版权，4-其他 -->
        <img v-if="orderDetail.orderDetailVO.productSubType ==1" src="~/assets/images/order/pic_zl@2x.png" />
        <img v-if="orderDetail.orderDetailVO.productSubType ==2" src="~/assets/images/order/pic_sb@2x.png" />
        <img v-if="orderDetail.orderDetailVO.productSubType ==3" src="~/assets/images/order/pic_bq@2x.png" />
        <img v-if="orderDetail.orderDetailVO.productSubType ==4" src="~/assets/images/order/pic_qt@2x.png" />
        <div >
          <p class="product-name">{{orderDetail.orderDetailVO.productName}}</p>
          <p class="product-type">类型：知识产权</p>
        </div>
        <div>
          <!-- <p class="price">￥2400</p> -->
          <p v-if="orderDetail.orderDetailVO.feeType == 2" class="price" >￥{{orderDetail.orderDetailVO.governmentFee/100}}</p>
          <p v-else-if="orderDetail.orderDetailVO.governmentFeeId >= 0" class="price">￥{{orderDetail.orderDetailVO.governmentReduceFee/100}}</p>
          <p class="price" v-else>￥{{orderDetail.orderDetailVO.feeType == 2 ? 0 : orderDetail.orderDetailVO.nowFee/100}}</p>
          <p class="product-num">x {{orderDetail.orderDetailVO.productCount}}</p>
        </div>
      </div>
        <!-- 产品详情下单->支付页 -->
      <div class="orderinfo" v-else>
        <!-- 1-专利，2-商标，3-版权，4-其他 -->
        <img v-if="orderDetail.type ==1" src="~/assets/images/order/pic_zl@2x.png" />
        <img v-if="orderDetail.type ==2" src="~/assets/images/order/pic_sb@2x.png" />
        <img v-if="orderDetail.type ==3" src="~/assets/images/order/pic_bq@2x.png" />
        <img v-if="orderDetail.type ==4" src="~/assets/images/order/pic_qt@2x.png" />
        <div >
          <p class="product-name">{{orderDetail.name}}</p>
          <p class="product-type">类型：知识产权</p>
        </div>
        <div>
          <!-- <p class="price">￥2400</p> -->
          <p v-if="orderDetail.feeType == 2" class="price" >￥{{orderDetail.governmentFee/100}}</p>
          <p v-else-if="goverFeeListLength > 0" class="price" >￥{{orderDetail.governmentFeeTypeList[goverFeeType].typeFee/100}}</p>
          <p class="price" v-else>￥{{orderDetail.feeType == 2 ? 0 : orderDetail.nowFee/100}}</p>
          <p class="product-num">x {{productNum}}</p>
        </div>
      </div>
      <!-- 订单详情->支付页 -->
      <div class="price-num" v-if="$route.query.source == 'pay-list' && orderDetail.orderDetailVO">
        <p v-if="orderDetail.orderDetailVO.feeType != 2">单价</p>
        <p v-if="orderDetail.orderDetailVO.feeType != 2">￥{{orderDetail.orderDetailVO.nowFee/100}}</p>
        <p v-if="orderDetail.orderDetailVO.feeType == 2 || orderDetail.orderDetailVO.governmentFeeId >= 0">官费</p>
        <p v-if="orderDetail.orderDetailVO.feeType == 2">￥{{orderDetail.orderDetailVO.governmentFee/100}}</p>
        <p v-else-if="orderDetail.orderDetailVO.governmentFeeId >= 0">￥{{orderDetail.orderDetailVO.governmentReduceFee/100}}</p>
        <p>购买数量</p>
        <div>
          <!-- <img src="~/assets/images/zscq/jian_icon@2x.png" alt=""> -->
          <p class="order-num">{{orderDetail.orderDetailVO.productCount}}</p>
          <!-- <img src="~/assets/images/zscq/jia_icon@2x.png" alt=""> -->
        </div>
      </div>
      <!-- 产品详情下单->支付页 -->
      <div class="price-num" v-else>
        <p v-if="orderDetail.feeType != 2">服务费</p>
          <p v-if="orderDetail.feeType != 2">￥{{ orderDetail.nowFee/100}}</p>
        <p v-if="orderDetail.governmentFee || goverFeeListLength > 0">官费</p>
        <p v-if="orderDetail.governmentFee">￥{{orderDetail.governmentFee/100}}</p>
        <p v-else-if="goverFeeListLength > 0">￥{{orderDetail.governmentFeeTypeList[goverFeeType].typeFee/100}}</p>
        <p>购买数量</p>
        <div class="count">
          <img src="~/assets/images/zscq/jian_icon@2x.png" @click="subtract()">
          <p class="num">{{productNum}}</p>
          <img src="~/assets/images/zscq/jia_icon@2x.png" @click="plus()">
        </div>
      </div>
      <!-- 订单详情->支付页 -->
      <p style="text-align: right" v-if="$route.query.source == 'pay-list' && orderDetail.orderDetailVO">
        <span style="color:#999999;font-size: .32rem">共{{orderDetail.orderDetailVO.productCount}}件</span>
        
        <span style="font-weight:550;">小计:</span>
        <!-- <span style="color:#FF6D27;">￥2400</span> -->
        <!-- 仅官费 不统计单价 -->
        <span v-if="orderDetail.orderDetailVO.governmentFee" style="color:#FF6D27;">￥{{orderDetail.orderDetailVO.feeType == 2 ? Number(orderDetail.orderDetailVO.governmentReduceFee)*productNum/100 : Number(Number(Number(orderDetail.orderDetailVO.nowFee)+Number(orderDetail.orderDetailVO.governmentReduceFee))*productNum)/100}}</span>
        <!-- 非仅官费 并添加了官费 -->
        <span v-else-if="orderDetail.orderDetailVO.governmentFeeId >= 0" style="color:#FF6D27;">￥{{Number(Number(orderDetail.orderDetailVO.nowFee)+Number(orderDetail.orderDetailVO.governmentReduceFee))*productNum/100}}</span>
        <!-- 非仅官费未添加官费 -->
        <span v-else style="color:#FF6D27;">￥{{Number(orderDetail.orderDetailVO.nowFee)*productNum/100}}</span>
      </p>
      <!-- 产品详情下单->支付页 -->
      <p style="text-align: right" v-else>
        <span style="color:#999999;font-size: .32rem">共{{productNum}}件</span>
        <span style="font-weight:550;">小计:</span>
        <!-- <span style="color:#FF6D27;">￥2400</span> -->
        <!-- 仅官费 不统计单价 -->
        <span v-if="orderDetail.governmentFee" style="color:#FF6D27;">￥{{orderDetail.feeType == 2 ? Number(orderDetail.governmentFee)*productNum/100 : Number(Number(Number(orderDetail.nowFee)+Number(orderDetail.governmentFee))*productNum)/100}}</span>
        <!-- 非仅官费 并添加了官费 -->
        <span v-else-if="goverFeeListLength > 0" style="color:#FF6D27;">￥{{Number(Number(orderDetail.nowFee)+Number(orderDetail.governmentFeeTypeList[goverFeeType].typeFee))*productNum/100}}</span>
        <!-- 非仅官费未添加官费 -->
        <span v-else style="color:#FF6D27;">￥{{Number(orderDetail.nowFee)*productNum/100}}</span>
      </p>
    </div>
    <!-- 支付方式 -->
    <div class="pay-type">
      <p class="title">支付方式</p>
      <div class="pay">
        <img class="pay-img" src="~/assets/images/order/dgzz_icon@2x.png" alt="">
        <p>线下对公转账支付</p>
        <img class="radio-img" src="~/assets/images/order/yixuan_icon@2x.png" v-if="payType == 1">
        <img class="radio-img" src="~/assets/images/order/weixuan_icon@2x.png"  @click="payType = 1" v-else>
      </div>
      <div class="pay">
        <img class="pay-img" src="~/assets/images/order/zhifubao_icon@2x.png" alt="">
        <p>支付宝支付</p>
        <img class="radio-img" src="~/assets/images/order/yixuan_icon@2x.png" v-if="payType == 0">
        <img class="radio-img" src="~/assets/images/order/weixuan_icon@2x.png"  @click="payType = 0" v-else>
      </div>
        <!-- <div class="pay">
        <img class="pay-img" src="~/assets/images/order/wxzf_icon@2x.png" alt="">
        <p>微信支付</p>
        <img class="radio-img" src="~/assets/images/order/yixuan_icon@2x.png" v-if="payType == 2">
        <img class="radio-img" src="~/assets/images/order/weixuan_icon@2x.png"  @click="payType = 2" v-else>
      </div> -->
    </div>
    <!-- 收货信息 -->
    <div class="pay-type">
      <p class="title">收货信息</p>
      <div class="pay">
        <img class="pay-img location" src="~/assets/images/order/dgzz@2x.png" alt="">
        <div v-if="showReceive">
          <p style="display: flex;">
            <span class="receiver-name">{{showReceive.receiverName}}</span>
            <span style="color:#999999;font-size:12px;margin:0 5px;">{{showReceive.mobilePhoneNumber}}</span>
            <span v-if="showReceive.isDefault==1" class="default">默认</span>
          </p>
          <p class="area">{{showReceive.areaName}}{{showReceive.detailAddress}}</p>
        </div>
        <div class="add-receive" @click="toAddress()" v-else> 新增收件地址</div>
        <!-- <img class="right" src="~/assets/images/order/into_icon@2x.png" v-if="receiveList.length > 0" @click="toAddress(showReceive.id)"> -->
        <img class="right" src="~/assets/images/order/into_icon@2x.png" v-if="receiveList.length > 0 " @click="chooseAddress(showReceive.id)" />
      </div>
    </div>
    <div class="order-footer">
      <!-- 订单详情->支付页 -->
      <p v-if="$route.query.source == 'pay-list' && orderDetail.orderDetailVO" style="line-height:1.85rem;text-align: right;">
        <span style="color: #999999;">共{{orderDetail.orderDetailVO.productCount}}件，</span>
        <span style="font-weight:550;">小计:</span>
        <!-- 仅官费 不统计单价 -->
        <span v-if="orderDetail.orderDetailVO.governmentReduceFee" style="color:#FF6D27;">￥{{orderDetail.orderDetailVO.feeType == 2 ? Number(orderDetail.orderDetailVO.governmentReduceFee)*productNum/100 : Number(Number(Number(orderDetail.orderDetailVO.nowFee)+Number(orderDetail.orderDetailVO.governmentReduceFee))*productNum)/100}}</span>
        <!-- 非仅官费 并添加了官费 -->
        <span v-else-if="orderDetail.orderDetailVO.governmentFeeId >= 0" style="color:#FF6D27;">￥{{Number(Number(orderDetail.orderDetailVO.nowFee)+Number(orderDetail.orderDetailVO.governmentReduceFee))*productNum/100}}</span>
        <!-- 非仅官费未添加官费 -->
        <span v-else style="color:#FF6D27;">￥{{Number(orderDetail.orderDetailVO.nowFee)*productNum/100}}</span>
        <span class="submit-pay" @click="submit">去付款</span>
      </p>
      <!-- 产品详情下单->支付页 -->
      <div v-else class="product-pay">
        <div>
          <div style="padding: .32rem;padding-bottom: 5px;">
            <span style="color: #999999;">共{{productNum}}件，</span>
            <span style="font-weight:550;font-size:14px;">小计:</span>
            <!-- 仅官费 不统计单价 -->
            <span v-if="orderDetail.governmentFee" style="color:#FF6D27;font-size:14px;">￥{{orderDetail.feeType == 2 ? Number(orderDetail.governmentFee)*productNum/100 : Number(Number(Number(orderDetail.nowFee)+Number(orderDetail.governmentFee))*productNum)/100}}</span>
            <!-- 非仅官费 并添加了官费 -->
            <span v-else-if="goverFeeListLength > 0" style="color:#FF6D27;font-size:14px;">￥{{Number(Number(orderDetail.nowFee)+Number(orderDetail.governmentFeeTypeList[goverFeeType].typeFee))*productNum/100}}</span>
            <!-- 非仅官费未添加官费 -->
            <span v-else style="color:#FF6D27;font-size:14px;">￥{{Number(orderDetail.nowFee)*productNum/100}}</span>
          </div>
          <div class="protocol-box" v-if="$route.query.source != 'pay-list'">
            <img class="radio-img protocol-img" src="~/assets/images/order/weixuan_icon@2x.png" v-if="!read"  @click="read = true" >
            <img class="radio-img protocol-img" src="~/assets/images/order/yixuan_icon@2x.png"  v-else @click="read = false" >
            <p>请阅读并同意<span class="protocol" @click="agreement()">《卧涛网交易服务协议》</span> </p>
          </div>
          <p v-if="!hasRead && !read && $route.query.source != 'pay-list'" class="warning-text">请阅读并勾选《卧涛网交易服务协议》</p>
        </div>
        <p class="submit" @click="submit">提交订单</p>
      </div>
    </div>
    <!-- 返回上一级弹框 -->
    <!-- 遮罩层 -->
    <el-dialog :visible.sync="commonDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <div v-if="alertDialog" class="alert">
      <p>{{title}}</p>
      <div class="alert-btn">
        <p @click="closePage = true; back()">{{btn}}</p>
        <p @click="commonDialog = false;alertDialog = false">再想想</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui"
import { getWeixinOpenid } from '~/api/weixinpay'
import { receiveList, getPropertyDetail, submitOrder } from '@/api/order'
import orderData from '@/pages/order/order-data'
import Encrypt from '~/plugins/Encrypt'
import Vue from 'vue'
export default {
  head() {
    return {
      title: '确认订单',
      meta: [
        { name: 'keywords', content: '确认订单' },
        {
          hid: 'description',
          name: 'description',
          content:'确认订单'
        }
      ]
    }
  },
  data(){
    return{
      orderDetail: {},
      payType: 1,//支付方式0-支付宝 1-对公转账
      agree: false,//是否勾选协议
      userInfo:{},
      productNum: 0,
      goverFeeType:'',
      receiveList:[],
      receive:'',
      goverFeeListLength:'',
      showReceive:null,//显示的收件地址
      commonDialog: false,
      alertDialog: false,
      hasRead: true,
      read:false,
      closePage: false,
      title:'确定取消当前订单吗？',
      btn:'确定',
      pathUrl:'',
      queryId:null,
      openid:null
    }
  },
  destroyed() {
      window.removeEventListener('popstate', this.goback, false)
  },
  mounted(){
    this.pathUrl = this.$route.query.pathUrl;
    if(window.history && window.history.pushState){
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goback, false);
    }
    if(sessionStorage['addId']){
      this.queryId = sessionStorage['addId'];
    }
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo){
      this.getReceiveList();
      if(this.$route.query.source == 'pay-list'){
        this.title = '确定放弃支付吗？';
        this.btn = '放弃支付';
        this.orderDetail = JSON.parse(Encrypt.decrypt(this.$route.query.data,'Y2FsdGVkX184Asts'));
        console.log("1111",this.orderDetail);
        this.payType = this.orderDetail.paymentType;
        this.productNum  = this.orderDetail.orderDetailVO.productCount;
      }else{
        this.productNum = this.$route.query.productNum;
        this.orderType = this.$route.query.orderType;
        this.goverFeeType = this.$route.query.goverFeeType;
        this.propertyDetail({id: this.$route.query.productId, browser: true });
      };
    }else{
      this.$router.push({path:'/login'});
    }
    if(this.userInfo && this.userInfo.openid){
        this.openid = this.userInfo.openid
    }
    // 判断浏览器
    if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && this.userInfo && this.payType == 3 && this.openid==null){
         // JSAPI支付(开发'https://www.airkonw.com/')
         const AppId = 'wx6ea2b65c38386eb0'  
         const code = this.getUrlParam()
         // 静默授权
         if(code == null){
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ AppId +'&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
         }else{
            this.getopenid(code)
         }
    }else{
        // H5支付
    }
  },
  methods:{
    // 截取回调页code(用code换取openid)
    getUrlParam(){
       let href = window.location.href
       if(href.split('code').length==2){   
           return href.split('code')[1].split('&state')[0].split('=')[1]
       }else{
           return null
       }
    },
    // 获取openid
    getopenid(code){
      getWeixinOpenid({code}).then(res=>{
          if(res.code==0){
              this.openid = res.data
          }else{
              Toast({
                message: res.msg.errmsg,
                position: "middle",
                duration: 3000
              })
          }
      })
    },  
    agreement(){
      this.$router.push('/agreement/jyfwxy');
    },
    chooseAddress(val){
      this.$router.push({
          path:'/order/pick-add',
          query:{ id: val },
          // name:'order-pick-add',
          // params:{ id: val }
      });
    },
    back(){
      if(this.closePage){
        if(this.$route.query.source == 'pay-list'){
          this.$router.push({
            path: this.$route.query.fullPath,
            // path: '/member/order'
          })
        }else{
          this.$router.push({
            path:'/zhichan/'+this.orderDetail.id+this.orderDetail.type
          })
        };
      }else{
        history.pushState(null, null, document.URL);
      }
    },
    goback(){
      this.commonDialog = true;
      this.alertDialog = true;
      sessionStorage.removeItem('addId')
    },
    getReceiveList(){
      receiveList({accountId:this.userInfo.userId}).then(res=>{
        if(res.code == 0){
          this.receiveList = res.data;
          if(this.queryId){
            this.receiveList.forEach(item => {
              if(item.id == this.queryId){
                this.receive = item.id;
                this.showReceive = item;
              };
            });
          } else {
            let index = this.receiveList.find((item) => {
              return item.isDefault == 1
            });
            if(index){
              this.receive = index.id;
              this.showReceive = index;
            } else {
              this.receive = this.receiveList[0].id;
              this.showReceive = this.receiveList[0]
            }
          }
        };
      });
    },
    propertyDetail(obj){
      getPropertyDetail(Object.assign(obj,{accountId: this.userInfo.userId})).then((res) => {
        if(res.code == 1000){
          this.orderDetail = res.data;
          console.log("2222", this.orderDetail)
          if(this.orderDetail.governmentFeeTypeList){
              this.goverFeeListLength = this.orderDetail.governmentFeeTypeList.length;
          }
        }
      })
    },
    subtract(){
      if(this.productNum>1){
        this.productNum--;
      };
    },
    plus(){
      if(this.productNum<99){
        this.productNum++;
      };
    },
    toAddress(id){
      this.$router.push({
        path:'/order/address',
        query:{
          data: this.$route.query,
          id: id,
          productId: this.$route.query.productId
        }
      })
    },
    submit(){
      if(this.receive == ''){
        this.$message({
          type:'warming',
          message:'为了后期方便给您提供更好的服务，请添加您的收件地址',
          offset: 80,
          duration: 2000
        })
      }else if(orderData.throttle(3000)){//防止重复提交
        if(this.read ||this.$route.query.source == 'pay-list'){
          let param = {
            orderSource: 1,//线上
            platformSource: 1,//0-PC 1-手机端
            orderStatus: 6,//待付款
            // totalAmount: this.orderDetail.governmentFee ? Number(Number(this.orderDetail.nowFee)+Number(this.orderDetail.governmentFee))*this.productNum : Number(this.orderDetail.nowFee)*this.productNum,
            // orderNote: ,
            productCount: this.productNum,
            receiveAddressId: this.receive,
            accountId: this.userInfo.userId,
            paymentType: this.payType,
          }
          /* 订单详情=>支付页 */
          if(this.$route.query.source == 'pay-list'){
            param.orderType = this.orderDetail.orderType;
            param.productName = this.orderDetail.orderDetailVO.productName;
            param.productSubType = this.orderDetail.orderDetailVO.productSubType;
            param.productNo = this.orderDetail.orderDetailVO.productNo;
            param.productId = this.orderDetail.orderDetailVO.productId;
            param.agencyFee = Number(this.orderDetail.orderDetailVO.agencyFee)+Number(this.orderDetail.orderDetailVO.thirdPartyFee);
            param.governmentFee = this.orderDetail.orderDetailVO.governmentFee ? this.orderDetail.orderDetailVO.governmentFee : '';
            if(this.orderDetail.orderDetailVO.governmentFeeId >= 0){
              param.governmentFeeId = this.orderDetail.orderDetailVO.governmentFeeId;
            };
            if(this.orderDetail.orderDetailVO.governmentFee){
              param.totalAmount = this.orderDetail.orderDetailVO.feeType == 2 ? Number(this.orderDetail.orderDetailVO.governmentReduceFee)*this.productNum : Number(Number(this.orderDetail.orderDetailVO.nowFee)+Number(this.orderDetail.orderDetailVO.governmentReduceFee))*this.productNum;
            }else if(this.orderDetail.orderDetailVO.governmentFeeId >= 0){
              param.totalAmount = Number(Number(this.orderDetail.orderDetailVO.nowFee) + Number(this.orderDetail.orderDetailVO.governmentReduceFee))*this.productNum;
            }else{
              param.totalAmount = Number(this.orderDetail.orderDetailVO.nowFee)*this.productNum;
            };
          }else{
            /* 产品详情下单=>支付页 */
            param.orderType = this.orderType;
            param.productName = this.orderDetail.name;
            param.productSubType = this.orderDetail.type;
            param.productNo = this.orderDetail.number;
            param.productId = this.orderDetail.id;
            param.agencyFee = this.orderDetail.agencyFee ? Number(this.orderDetail.agencyFee)+Number(this.orderDetail.thirdPartyFee) : '';
            param.governmentFee = this.orderDetail.governmentFee ? this.orderDetail.governmentFee : '';
            if(this.goverFeeListLength > 0){
              param.governmentFeeId = this.orderDetail.governmentFeeTypeList[this.goverFeeType].id
            };
            if(this.orderDetail.governmentReduceFee){
              param.totalAmount = this.orderDetail.feeType == 2 ? Number(this.orderDetail.governmentReduceFee)*this.productNum : Number(Number(this.orderDetail.nowFee)+Number(this.orderDetail.governmentReduceFee))*this.productNum;
            }else if(this.goverFeeListLength > 0){
              param.totalAmount = Number(Number(this.orderDetail.nowFee) + Number(this.orderDetail.governmentFeeTypeList[this.goverFeeType].typeFee))*this.productNum;
            }else{
              param.totalAmount = Number(this.orderDetail.nowFee)*this.productNum;
            };
          }
          // 支付
          if(this.$route.query.source == 'pay-list'){
             if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && this.payType == 2){   //JSAPI支付
                param.isMiniPayApi = true
                param.openid = this.openid
            }else if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != 'micromessenger' && this.payType == 2){  //H5支付
                param.isMiniPayApi = false
            }  
            if(this.payType ==  1){ // 对公
              var encrypt = Encrypt.encrypt(JSON.stringify(param),'v4kgOl8v7SKJlxXM');//密钥自定义 加密解密时保持一致即可
              this.$router.push({
                path: '/order/publicTransfer',
                query: {
                  data: encrypt,
                  orderNo: this.orderDetail.orderNo,
                  orderId: this.orderDetail.id
                }
              })
            }else if(this.payType == 0){ // 支付宝
              Vue.delete(this.orderDetail,'gmtModified');
              Vue.delete(this.orderDetail,'paymentType');
              submitOrder(Object.assign(param,this.orderDetail)).then(res=>{
                if(res.code == 50000){
                  this.$message({
                    type: 'error',
                    message: res.msg,
                    offset: 80,
                    duration: 3000
                  })
                }else{
                  this.$router.push({
                    path:'/order/pay',
                    query:{
                       data:Encrypt.encrypt(JSON.stringify(Object.assign(param,this.orderDetail)),'v4kgOl8v7SKJlxXM')
                    }
                  })
                };
              })
            }else{ // 微信支付
                Vue.delete(this.orderDetail,'gmtModified');
                Vue.delete(this.orderDetail,'paymentType');
                submitOrder(Object.assign(param,this.orderDetail)).then(res=>{
                    if(res.code == 0){
                        let encrypt = Encrypt.encrypt(JSON.stringify(Object.assign(param,this.orderDetail)),'v4kgOl8v7SKJlxXM')
                        this.$router.push({
                            path: '/order/wechat',
                            query: {
                                data: encrypt,
                                orderNo: this.orderDetail.orderNo,
                                id:this.orderDetail.id
                            }
                        })
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            offset: 80,
                            duration: 3000
                        })
                    }
                })
            }
          }else{
            if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && this.payType == 2){   //JSAPI支付
                param.isMiniPayApi = true
                param.openid = this.openid
            }else if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != 'micromessenger' && this.payType == 2){  //H5支付
                param.isMiniPayApi = false
            }  
            submitOrder(param).then(res=>{
              if(this.payType ==  1){//对公
                var encrypt = Encrypt.encrypt(JSON.stringify(param),'v4kgOl8v7SKJlxXM');//密钥自定义 加密解密时保持一致即可
                this.$router.push({
                  path: '/order/publicTransfer',
                  query: {
                    data: encrypt,
                    orderNo: res.data.orderNo,
                    orderId: this.orderDetail.id
                  }
                })
              }else if(this.payType == 0){//支付宝
                param.id = res.data.id
                param.orderDetailVO = res.data.orderDetailVO
                param.orderNo = res.data.orderNo
               if(res.code == 0){
                  this.$router.push({
                    path:'/order/pay',
                    query:{
                      data:Encrypt.encrypt(JSON.stringify(Object.assign(param)),'v4kgOl8v7SKJlxXM')
                    }
                  })
                }else if(res.code == 8888){
                  this.$message({
                    type: 'success',
                    message:'订单支付成功！',
                    offset: 80,
                    duration: 2000
                  })
                  this.$router.push('/member/order');
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.msg,
                        offset: 80,
                        duration: 3000
                    })
                }
              }else{ // 微信支付
                   if(res.code == 0){
                        param.id = res.data.id
                        param.orderDetailVO = res.data.orderDetailVO
                        param.orderNo = res.data.orderNo
                        let encrypt = Encrypt.encrypt(JSON.stringify(param),'v4kgOl8v7SKJlxXM')
                        this.$router.push({
                            path: '/order/wechat',
                            query: {
                                data: encrypt,
                                orderNo: res.data.data.orderNo,
                                id:res.data.data.id
                            }
                        })
                   }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            offset: 80,
                            duration: 3000
                        })
                  }
              }
            })
          }
        }else{
          this.hasRead = false;
        };
      }else{

      };
    },
  }
}
</script>

<style scoped>
.order_pay{
  background: #F4F4F4;
  color: #333333;
  font-size: .3733rem;
  min-height: 100vh;
  padding-top: 50px;
  padding-bottom: 1.8rem;
}
.order-head{
  display: flex;
  line-height: 50px;
  background: #FFFFFF;
  position: fixed;
  width: 100%;
  height: 50px;
  top: 0;
  z-index: 1;
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
.product-info{
  width: 95%;
  background: #FFFFFF;
  border-radius: 10px;
  margin: 10px auto;
  padding: 12px;
}
.orderinfo{
  display: grid;
  grid-template-columns: 30% 50% 18%;
  grid-gap: 8px;
  margin-top: 20px;
}
.orderinfo img{
  width: 2.56rem;
  height: 1.84rem;
}
.product-name{
  height: 1.067rem;
}
.product-type{
  color: #666666;
  font-size: .32rem;
  padding: 5px;
  border-radius: 4px;
}
.product-num{
  color: #999999;
  font-size: .32rem;
  text-align: right;
  margin-right: 5px;
}
.price{
  color: #999999;
  text-align: right;
  margin-right: 5px;
}
.price-num{
  display: grid;
  grid-template-columns: 75% 25%;
  padding: 5px;
  margin-top: 15px;
  line-height: .933rem;
}
.price-num :nth-child(2n){
  font-weight: 550;
  font-size: .32rem;
  text-align: right;
}
.price-num img{
  width: 20px;
  height: 20px;
}
.count{
  display: flex;
  margin: auto 0;
  margin-left: .3rem;
}
.num{
  margin: 0 .322rem;
  line-height: .533rem;
  font-weight: 500 !important;
}
.pay-type{
  width: 95%;
  margin: .32rem auto;
  padding: 5px;
  border-radius: 6px;
  background: #FFFFFF;
}
.pay{
  display: grid;
  margin: .533rem 0;
  grid-template-columns: 10% 80% 10%;
}
.pay-img{
  width: .64rem;
  height: .64rem;
}
.radio-img{
  width: .4267rem;
  height: .4267rem;
}
.title{
  font-size: 16px;
  font-weight: 550;
}
.right{
  width: 15px;
  height: 15px;
  margin:  auto 0;
  text-align: right;
}
.location{
  margin: auto 0;
}
.area{
  width: 96%;
  display: -webkit-box;
  overflow: hidden;
  white-space: normal !important;
  text-overflow: ellipsis;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical
}
.default{
  height: .5rem;
  font-size: .32rem;
  color:#FFFFFF;
  border-radius:.10667rem;
  padding: .05333rem .16rem;
  background:#36A6FE;
}
.protocol-box{
  width: 100%;
  margin: 0 auto;
  display: flex;
  padding-left: .32rem;
  font-size: .32rem;
  color: #999999;
}
.protocol{
  font-size: .32rem;
  color: #36A6FE;
}
.protocol-img{
  margin-right: .22rem;
}
.order-footer{
  position: fixed;
  bottom: 0;
  background: #FFFFFF;
  width: 100%;
  height: 1.85rem;
}
.product-pay{
  display: grid;
  grid-template-columns: 65% 35%;
  font-size: .32rem;
}

.receiver-name{
  font-weight:550;
  max-width: 3.8rem;
  max-height: .426rem;
  margin-bottom: .32rem;
  display: -webkit-box;
  overflow: hidden;
  white-space: normal !important;
  text-overflow: ellipsis;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical
}
.submit{
  font-size: .42667rem;
  background: #36A6FE;
  border-radius: .5333rem;
  color: #FFFFFF;
  width: 112px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
  margin-top: 15px;
  text-align: center;
}
.submit-pay{
  font-size: .42667rem;
  padding: .24rem .42667rem;
  background: #36A6FE;
  height: 40px;
  border-radius: 20px;
  color: #FFFFFF;
  margin: 0 .32rem;
}
.add-receive{
  width: 102px;
  height: 24px;
  background: #ffffff;
  color: #36A6FE;
  border: 1px solid #36a6fe;
  border-radius: 4px;
  padding: 0 5px;
  text-align: center;
  line-height: 24px;
}
.alert{
  width: 90%;
  position: fixed;
  top: 45%;
  left: 5%;
  border-radius: 10px;
  background: #FFFFFF;
  font-size: .426rem;
  line-height: 60px;
  z-index: 9999;
  text-align: center;
}
.alert-btn{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
.warning-text{
  font-size: .32rem;
  color:red;
  margin-left: .32rem;
}
.order-num{
  font-size: .32rem;
  text-align: right;
}
.long-name{
  margin: .12rem 0
}
</style>