<template>
  <div class="order_pay wrap">
    <mt-header title="确认订单" />      
    <div class="product-info">
      <p class="title p-size-14" v-if="$route.query.source == 'pay-list'">订单编号 {{orderDetail.orderNo}}</p>
      <p class="title p-size-14" v-else>商品信息</p>
      <!-- 订单详情->支付页 -->
      <div class="orderinfo" @click="handleGoDetail">
        <div>
            <img class="project_img" :src="imgPath + orderDetail.url" v-if="filterType(orderDetail.url)"/>
            <video class="project_img" :src='imgPath + orderDetail.url' v-if="!filterType(orderDetail.url)" />
        </div>
        <div>
          <p class="product_name">{{orderDetail.spuName}}</p>
          <p class="product_name">{{orderDetail.pageFrom == 0 ? orderDetail.spec:orderDetail.attributeText}}</p>
          <p class="product-type">类型：{{orderDetail.categoryName}}</p>
        </div>
        <div>
          <p class="price">￥{{orderDetail.pageFrom == 0 ? orderDetail.totalAmount/orderDetail.buyNum : orderDetail.pageFrom == 1 ? totalSingle : orderDetail.pageFrom == 2 ? orderDetail.totalAmount/orderDetail.productCount : orderDetail.totalAmount/orderDetail.buyNum}}</p>
          <p class="product-num">x {{orderDetail.buyNum}}</p>
        </div>
      </div>
      <!-- 订单详情->支付页 -->
      <div class="service-fee-contain">
        <div class="service-title">服务费</div>
        <div v-if="serviceFee.length==2&&serviceFee[1].title!='尾款' || serviceFee.length<2">
          <div class="service-item" v-for="(item,index) in serviceFee" :key="index">
            <div class="service-item-desc">
              <span :class="['item-name', item.payProcess == false?'service-gray-sty':'']">{{item.title}}</span>
              <span :class="[item.payProcess == false?'service-gray-sty':'']">￥</span>
              <span :class="[item.payProcess == false?'service-gray-sty':'']">{{item.value}}</span>
            </div>
            <div :class="[item.payProcess == false?'dark-fee':'bright-fee']">{{item.status == 0 ? '待付款' : item.status == 1 ? '待开始' : item.status == 2 ? '已付款' : ''}}</div>
          </div>
        </div>
      <div v-else>
          <div class="service-item" v-for="(item, index) in serviceFee" :key="index">
            <div class="service-item-desc">
              <div class="service-img" v-if="item.title!='官费'">
                <img v-if="item.payProcess" class="bright-img" :src="require('~/assets/images/order/yifu_icon@2x.png')">
                <img v-else class="dark-img" :src="require('~/assets/images/order/weifu_icon@2x.png')">
                <span :class="['lang-sty',item.payProcess?'':'lang-default-sty']" v-if="index == 0"></span>
              </div>
              <span :class="[item.payProcess?'':'dark-fee']">{{item.title}}</span>
              <!-- <span :class="[item.payProcess?'':'dark-fee']"></span> -->
              <span v-if="item.value=='wait'&& item.title=='尾款'" :class="[item.payProcess?'':'dark-fee']"> ￥待定</span>
              <span v-else :class="[item.payProcess?'':'dark-fee']">￥{{item.value == 0 ? '待定' : item.value }}</span>
            </div>
            <div :class="[item.payProcess?'bright-fee':'dark-fee']">{{item.status == 0 ? '待付款' : item.status == 1 ? '待开始' : item.status == 2 ? '已付款' : ''}}</div>
          </div>
        </div>
        <div>
          <span>购买数量</span>
          <span style="float:right;display: flex;align-items:center">
            <img src="@/assets/images/order/jian_icon@2x.png" v-if="$route.query.source != 'pay-list'" style="height: 20px;width:20px" @click="productNum > 1 ? productNum-- : ''"> 
            <span style="width: 25px; display: inline-block; text-align: center;">{{productNum}}</span> 
            <img src="@/assets/images/order/jia_icon@2x.png" v-if="$route.query.source != 'pay-list'" style="height: 20px;width:20px" @click="productNum < 99 ? productNum++ : ''">
            </span>
        </div>
      </div>
      <!-- 产品详情下单->支付页 -->
      <!-- <div class="price-num" v-else> -->
      <div v-if="$route.query.source == 'product-detail'">
        <p class="service-title">服务费</p>
        <div class="pay-progress">
          <div>
            <img src="~/assets/images/order/yifu_icon@2x.png" class="bright-img" />
            <div class="pay-line"></div>
            <img src="~/assets/images/order/weifu_icon@2x.png" class="dark-img" />
          </div>
          <div class="service-fee">
            <p class="bright-fee">定金 ￥{{ feeInfo.deposit || 0.00}}</p>
            <p class="final-fee dark-fee">尾款 ￥{{orderDetail.tailPrice ? '待定' : feeInfo.tailPrice}}</p>
          </div>
          <div class="pay-status">
            <p class="bright-fee">待付款</p>
            <p class="final-fee dark-fee">未开始</p>
          </div>
        </div>
        <div class="unit-price">
          <p v-if="orderDetail.feeType != 2" class="bright-fee">官费 
            <span v-if="policyGovfeeTypeListLength > 0" >￥{{orderDetail.policyGovfeeTypeList[govermentFeeType].typeFee/100}}</span>
            <span v-else >￥0.00</span>
          </p>
          <p class="bright-fee">待付款</p>
          <p>购买数量</p>
          <div v-if="$route.query.source == 'pay-list'">
            <p class="order-num">{{productNum}}</p>
          </div>
          <div class="count" v-else>
             <!-- 高企  -->
            <template v-if="orderDetail.number =='XM20201015001'">
                 <img src="~/assets/images/zscq/jian_icon@2x.png">
                 <p class="num">{{productNum}}</p>
                 <img src="~/assets/images/zscq/jia_icon@2x.png">
            </template>
             <template v-else>
                 <img src="~/assets/images/zscq/jian_icon@2x.png" @click="subtract()">
                 <p class="num">{{productNum}}</p>
                 <img src="~/assets/images/zscq/jia_icon@2x.png" @click="plus()">
            </template>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="center-foot">
        <template v-for="(item,index) in totalPriceList">
          <div class="center-item" :key="index" v-if="index==2">
            <span style="font-weight: 550">本次应支付金额</span>
            <span style="color: #FD651C;float: right;font-size: 16px">￥{{$route.query.source == 'pay-list' ? totalPrice : item.value*productNum}}</span>
          </div>
        </template>
    </div>
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
      <div class="pay">
        <img class="pay-img" src="~/assets/images/order/wxzf_icon@2x.png" alt="">
        <p>微信支付</p>
        <img class="radio-img" src="~/assets/images/order/yixuan_icon@2x.png" v-if="payType == 2">
        <img class="radio-img" src="~/assets/images/order/weixuan_icon@2x.png"  @click="payType = 2" v-else>
      </div>
    </div>
    <!-- 收件信息 -->
    <div class="pay-type" v-if="pageFrom != 0">
      <p class="title">收件信息</p>
      <div class="pay">
        <img class="pay-img location" src="~/assets/images/order/dgzz@2x.png" alt="">
        <div v-if="showReceive">
          <p style="display: flex">
            <span class="receiver-name">{{showReceive.receiverName}}</span>
            <span style="color:#999999;font-size:12px;margin: 0 .1rem;">{{showReceive.mobilePhoneNumber}}</span>
            <span v-if="showReceive.isDefault==1" class="default">默认</span>
          </p>
          <p class="area">{{showReceive.areaName}}{{showReceive.detailAddress}}</p>
        </div>
        <div class="add-receive" @click="toAddress()" v-else> 新增收件地址</div>
        <!-- <img class="right" src="~/assets/images/order/into_icon@2x.png" v-if="receiveList.length > 0" @click="toAddress(showReceive.id)"> -->
        <img class="right" src="~/assets/images/order/into_icon@2x.png" v-if="receiveList.length > 0" @click="chooseAddress(showReceive.id)" />
      </div>
    </div>
    <div class="order-footer">
      <!-- 订单详情->支付页 -->
      <div v-if="$route.query.source == 'pay-list' && orderDetail " class="product-pay">   
        <div :class="[tailstatusPayFlag ? 'line-center' : '']">
          <div class="bootom-left-info">
            <span style="color: #999999;">共{{productNum}}件，</span>
            <span class="title-bold-14">小计:</span>
            <span v-if="$route.query.source != 'pay-list'||($route.query.source == 'pay-list' && !$route.query.tailstatusPayFlag)" class="bright-fee p-size-14">￥{{totalPrice}}</span>
            <span v-if="$route.query.source == 'pay-list' && $route.query.tailstatusPayFlag" class="bright-fee p-size-14">￥{{feeInfo.tailShould}}</span>
          </div>
          <div class="protocol-box" v-if="!tailstatusPayFlag" @click="read = !read">
            <img class="radio-img protocol-img" src="~/assets/images/order/weixuan_icon@2x.png" v-if="!read"  >
            <img class="radio-img protocol-img" src="~/assets/images/order/yixuan_icon@2x.png"  v-else>
            <p class="p-size-12">请阅读并同意<span class="protocol" @click="agreement()">《卧涛网交易服务协议》</span> </p>
          </div>
          <p v-if="!hasRead && !read" class="warning-text">请阅读并勾选《卧涛网交易服务协议》</p>
        </div>
        <p class="submit"  @click="payType == 1 ? offlinePay() : pay()">立即支付</p>      
      </div>
      <!-- 产品详情下单->支付页 -->
      <div v-else class="product-pay">
        <div>
          <div style="padding: .32rem;padding-bottom: 5px;">
            <span style="color: #999999;">共{{productNum}}件，</span>
            <span class="title-bold-14">小计:</span>
            <span v-if="$route.query.source != 'pay-list'||($route.query.source == 'pay-list' && !$route.query.tailstatusPayFlag)" class="bright-fee p-size-14">￥{{totalPriceList[2].value * productNum}}</span>
            <span v-if="$route.query.source == 'pay-list' && $route.query.tailstatusPayFlag" class="bright-fee p-size-14">￥{{feeInfo.tailShould}}</span>
            <!-- 仅官费 不统计单价 -->
            <!-- <span v-if="orderDetail.governmentFee" style="color:#FF6D27;font-size:14px;">￥{{orderDetail.feeType == 2 ? Number(orderDetail.governmentFee)*productNum/100 : Number(Number(Number(orderDetail.nowFee)+Number(orderDetail.governmentFee))*productNum)/100}}</span> -->
            <!-- 非仅官费 并添加了官费 -->
            <!-- <span v-else-if="policyGovfeeTypeListLength > 0" style="color:#FF6D27;font-size:14px;">￥{{Number(Number(orderDetail.nowFee)+Number(orderDetail.governmentFeeTypeList[govermentFeeType].typeFee))*productNum/100}}</span> -->
            <!-- 非仅官费未添加官费 -->
            <!-- <span v-else style="color:#FF6D27;font-size:14px;">￥{{Number(orderDetail.nowFee)*productNum/100}}</span> -->
          </div>
          <div class="protocol-box" v-if="$route.query.source != 'pay-list'" @click="read = !read">
            <img class="radio-img protocol-img" src="~/assets/images/order/weixuan_icon@2x.png" v-if="!read">
            <img class="radio-img protocol-img" src="~/assets/images/order/yixuan_icon@2x.png"  v-else>
            <p class="p-size-12">请阅读并同意<span class="protocol" @click="agreement()">《卧涛网交易服务协议》</span> </p>
          </div>
          <p v-if="!hasRead && !read && $route.query.source != 'pay-list'" class="warning-text">请阅读并勾选《卧涛网交易服务协议》</p>
        </div>
        <p class="submit" v-if="$route.query.source == 'pay-list' && !this.$route.query.areaSelect" @click="payType == 1 ? offlinePay() : pay()">立即支付</p>
        <p class="submit" v-else @click="submit()">提交订单</p>
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
import { getWeixinOpenid } from '~/api/weixinpay'
import { Toast } from "mint-ui"
import { receiveList, saveOrder,getAreaList,getOrderUsrerInfo, orderPay} from '@/api/order'
import { getArtcleDetail } from "@/api/policySquare"
import { getProductInfo } from '@/api/productdetails'
import orderData from '@/pages/order/order-data'
import mtHeader from '~/components/common/mtHeader'
import Encrypt from '~/plugins/Encrypt'
import Vue from 'vue'
export default {
  components: {
    mtHeader,
  },
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
      earnestMoney:0,
      governmentFee:0,
      tailAmount:0,
      govermentFeeType:'',
      receiveList:[],
      gray:true,            
      receive:'',
      policyGovfeeTypeListLength:'',
      showReceive:null,//显示的收件地址
      commonDialog: false,
      alertDialog: false,
      hasRead: true,
      read:true,
      closePage: false,
      title:'确定取消当前订单吗？',
      btn:'确定',
      queryId:null,
      paymentId: '',
      imgType:'.jpg,.png,.jpeg,.gif',
      videoType: '.mp4,.avi,.mov',
      imgPath: process.env.CDN_BASE_URL,
      tailstatusPayFlag: false,//是否为尾款
      orderStatus:'',
      openid:null,
      baseInfo: {}, //产品基本信息  
      tradeInfo: {},
      isDue: false,
      unitDeposit: 0, //定金单价
      unitOfficial: 0, //官费单价
      unitFinal: 0, //尾款单价
      finalFeePending: false, //尾款是否待定
      attrFirst: '',
      categoryId:'',
      productNum: this.$route.query.productNum,
      coverUrl: '',
      orderDetail: JSON.parse(Encrypt.decrypt(this.$route.query.data,'Y2FsdGVkX184Asts')),
      feeInfo: this.$route.query.feeInfo ? JSON.parse(this.$route.query.feeInfo) : '',
      totalPrice: '',
      totalSingle: '',
      pageFrom: this.$route.query.pageFrom,
      serviceFee: [{
        title: "定金",
        value: "",
        status: 0,
        payProcess: true
      },{
        title: "尾款",
        value: "",
        status: 1,
        payProcess: false
      },{
        title: "官费",
        value: "",
        status: 0,
        payProcess: true
      }],
      totalPriceList: [{
        title: "定金总计",
        value: ""
      },
      {
        title: "官费总计",
        value: ""
      },
      {
        title: "本次应支付金额",
        value: ""
      },
    ],
    }
  },
  filters:{
      orderStatus(val){
          return orderData.orderStatus(val);
      },
    categoryType(val){
      return val == 1 ? '项目申报' : val == 2 ? '知识产权' : val == 3 ? '专利' : val == 4 ? '版权' : val == 5 ? '商标' : val == 6 ? '其他' : val == 7 ? '工商注册' : val == 8 ? '财税服务' : val == 9 ? '融资上市' : val == 10 ? '法律服务' : val == 11 ? '软件开发' : ''; 
    }
  },
  computed:{
    showCoversList(){
      return this.orderDetail.coverUrls.filter((item)=>{
        return item.isCover;
      })
    },
    showCoversItem(){
      return this.orderDetail.orderDetailVO.coverUrls.filter((item)=>{
        return item.isCover;
      })
    }
  },
  mounted(){
    this.productNum = this.$route.query.skuNum;
    if(this.$route.query.spuId){
      this.getSpuInfo(this.$route.query.spuId);
    };
    if(this.$route.query.tailstatusPayFlag){
      this.tailstatusPayFlag = this.$route.query.tailstatusPayFlag;
    };
    /* decrypt解密 密钥自己设置加密解密保持一致*/
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(this.$route.query.source == 'pay-list'){
      this.orderDetail = JSON.parse(Encrypt.decrypt(this.$route.query.data,'Y2FsdGVkX184Asts'));
      console.log("000000",this.orderDetail);
      this.categoryId = this.orderDetail.categoryId;
      this.getConfirmOrderUserInfo(this.orderDetail.id);
      this.payType = 1;
      this.productNum  = this.orderDetail.payNum;
      this.orderDetail.orderPaymentVoList.forEach(item => {
        if(item.payType == 1){  //定金
          this.$set(this.orderDetail,'hasDeposit',true);
          this.$set(this.orderDetail,'depositPrice', 0);
          item.orderFeeList.forEach( fee => {
            if(fee.costType == 3){  //定金官费
              this.$set(this.orderDetail,'hasOffical',true); 
              this.$set(this.orderDetail,'officalPrice',fee.price); //官费单价
            }else{
              this.orderDetail.depositPrice += fee.price;
            }
          });
        };
        if(item.payType == 3){ //一口价
          this.$set(this.orderDetail,'isDue',true);
          this.$set(this.orderDetail,'dueDepositPrice',0);
          item.orderFeeList.forEach( fee => {
            if(fee.costType == 3){  //定金官费
              this.$set(this.orderDetail,'hasOffical',true); 
              this.$set(this.orderDetail, 'officalPrice', fee.price); //官费单价
            }else{
              this.orderDetail.dueDepositPrice += fee.price;
            }
          });

        };
        if(item.payType == 2){ //尾款
          if(this.orderDetail.tailStatus == 0){
            this.$set(this.orderDetail,'hasOffical',false);
          }else{
            this.$set(this.orderDetail,'finalPrice', 0);
            if(item.orderFeeList){
              item.orderFeeList.forEach(fee => {
                this.orderDetail.finalPrice += fee.price;
              });
            }
          }
        };
      });
      
      if(this.$route.query.tailstatusPayFlag){
        this.orderDetail.orderPaymentVoList.forEach(item => {
          if(item.payType == 2){//尾款
            this.paymentId = item.id;
            this.payAmount = item.payAmount;
          }
        });
      }else if(this.orderDetail.orderPaymentVoList){
        this.orderDetail.orderPaymentVoList.forEach(item => {
          if(item.payType == 1){//尾款
            this.paymentId = item.id;
            this.payAmount = item.payAmount;
          }else if(item.payType == 3){
            this.paymentId = item.id
            this.payAmount = item.payAmount;
          };
        });
      };
    }else{

    };
    if(this.userInfo){
      this.getReceiveList();
      this.getArea();
    }else{
      this.$router.push({path:'/login'});
    };
    ///
    if(window.history && window.history.pushState){
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goback, false);
    }
    if(this.$route.query.tailstatusPayFlag){
      this.tailstatusPayFlag = this.$route.query.tailstatusPayFlag;
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
        console.log(" this.orderDetail this.orderDetail", this.orderDetail)
        this.orderStatus = this.orderDetail.orderStatus;
        this.productNum  = this.orderDetail.buyNum;
        this.tailAmount = this.orderDetail.tailStatus == 0 ? '待定' : this.feeInfo.tailPrice;
      }else{
        this.productNum = this.$route.query.productNum;
        this.orderType = this.$route.query.orderType;
        this.govermentFeeType = this.$route.query.govermentFeeType;
        // this.projectDetail({number: this.$route.query.projectNo,screen: this.$route.query.screenType,type:4,app:'app'});
      };
    }else{
      this.$router.push({path:'/login'});
    }
    if(this.userInfo && this.userInfo.openid){
        this.openid = this.userInfo.openid
    }
    // 判断浏览器
    if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && this.userInfo && this.payType == 3 && this.openid==null ){
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
    this.getDetail()
    if (this.$route.query.source == 'pay-list') {
      this.orderListFee(); 
    }
  },
  methods:{
     getConfirmOrderUserInfo(orderId){
      getOrderUsrerInfo({orderId: orderId}).then(res=>{
        this.orderUserInfo = res.data.data;
        // this.$store.state.phone = this.orderUserInfo.mobile;
      })
    },
    getArea(){
      getAreaList().then(res=>{
        this.areaList = res.data.data;
      }).catch(err=>{
        return err;
      });
    },
    offlinePay(obj){
      if((this.userInfo.status == 2 || this.userInfo.status == 5)){
        this.$router.push({
          path: '/order/publicTransfer',
          query:Object.assign( {
            categoryId: this.categoryId,
            payChannel: this.payType,
            unitDeposit: this.unitDeposit || this.orderDetail.depositPrice || this.orderDetail.dueDepositPrice,
            unitOfficial: this.unitOfficial || this.orderDetail.officalPrice,
            unitFinal: this.unitFinal || this.orderDetail.finalPrice,
            payNum: this.productNum || this.orderDetail.buyNum,
            tailstatusPayFlag: this.$route.query.tailstatusPayFlag || false,
          },obj || {
            orderNo: this.orderDetail.orderNo,
            id: this.paymentId,
            payAmount: this.payAmount
          })
        })
      }else{
        this.message = this.userInfo.status == 3 ? '您当前的主体正在授权中，请先登录后查看认证结果' :''
        this.AuthenticationDialog = true;
      };
    },
    pay(res) {
      if((this.userInfo.status == 2 || this.userInfo.status == 5)){
        if(this.$route.query.source == 'pay-list'){
          var obj = {
            payChannel: this.payType,
            id: this.paymentId,
            orderPort: 'H5',
          }
        }else{
          var obj = {
            orderId: res.data.id,
            id: res.data.tmOrderPayment.id,
            payChannel: this.payType,
            orderPort: 'H5',
          }
        }
          this.offlinePay();
          
          //==================暂时只有对公转账====================

        // if(this.payType == 1){//线下对公
          // let orderObj = {
          //   orderNo: res.data.orderNo,
          //   id: res.data.tmOrderPayment.id,
          //   payType: res.data.tmOrderPayment.payType,  //(1:定金；2:尾款；3:一口价)
          //   payAmount: res.data.tmOrderPayment.payAmount
          // }
          // this.offlinePay(orderObj);
        // }else{
          // orderPay(obj).then(response=>{
          //   if(response.code == 0){
          //     if(this.payType == 0){ //支付宝
          //       this.$router.push({
          //         path:'/order/pay',
          //         query:{
          //           zfbData: response.data
          //         }
          //       })
          //     };
          //     if(this.payType == 2){ //微信
          //       let codeObj = JSON.parse(response.data);
          //       this.$router.push({
          //         path: '/order/wechat',
          //         query: {
          //           id: obj.id,
          //           codeUrl: codeObj.code_url,
          //           orderNo: res ? res.data.orderNo : this.orderDetail.orderNo,
          //           totalAmount: res ? (this.isDue ? ((this.unitDeposit || 0) + (this.unitFinal || 0) + (this.unitOfficial || 0)) : (this.$route.query.tailstatusPayFlag ? (this.unitFinal || 0) : ((this.unitDeposit || 0) + (this.unitOfficial || 0))))
          //           :(this.isDue ? (((this.orderDetail.dueDepositPrice || 0) + (this.orderDetail.officalPrice || 0))) : (this.tailstatusPayFlag ? (this.orderDetail.finalPrice || 0) : ((this.orderDetail.depositPrice || 0) + (this.orderDetail.officalPrice || 0))))
          //       }
          //       })
          //     };
          //   }else{
          //     this.$message({
          //       type:'warning',
          //       message:response.msg,
          //       offset:100,
          //       duration:2000
          //     })
          //     setTimeout(()=>{
          //       this.$router.push({
          //         path:'/member/order'
          //       })
          //     },1000)
          //   };
          // })
        // }
      }else{
        this.AuthenticationDialog = true;
      };
    },
    getDetail() {
      let finalPrice = '';
      let fee = this.feeInfo;
      if(fee.payStatus == 1) return;
      if(fee.isDue){
        finalPrice = this.orderDetail.totalAmount
      } else if(this.orderDetail.tailStatus==1 && this.orderDetail.orderStatus ==2){
        finalPrice = fee.tailPrice
      } else {
        finalPrice = fee.depositShould
      }
      this.totalPrice = finalPrice
      getProductInfo({spuId: this.orderDetail.spuId}).then(res=>{
        if(res.code==0){
          let [coverInfo] = res.data.baseInfo.imageList.filter( item => {
          return item.isDefault;
        })
        this.coverUrl = coverInfo.mediaUrl.length > 0 ? coverInfo.mediaUrl : coverInfo.imageUrl;   //视频取media 否则取image
        this.baseInfo = res.data.baseInfo;   //基本信息
        this.categoryId = this.baseInfo.categoryId;
        this.tradeInfo = res.data.tradeInfo;    //交易信息
        if (this.$route.query.activeKey) {
          this.attrFirst = Object.values(this.tradeInfo.dynamicAttributeList[0])[0][parseInt(this.$route.query.activeKey.match(/\w*(?=_)/))];
          if(this.tradeInfo.dynamicAttributeList.length > 1){
            this.attrSecond = Object.values(this.tradeInfo.dynamicAttributeList[1])[0][parseInt(this.$route.query.activeKey.match(/(?<=_)\w*/))];
          }
          let [skuInfo] = this.tradeInfo.skuList.filter( item => {
            return item.skuIndex ==  this.$route.query.activeKey;
          })
          let skuPayInfo = skuInfo.skuPayTypeList;   //费用信息
          this.skuId = skuInfo.id;
          this.isDue = Object.keys(skuPayInfo)[0].match(/due/) ? true : false; //是否是一口价
          let epositFee = [];
          let officialFee = [];
          let finalFee = [];
          Object.keys(skuPayInfo).forEach(item =>{
            if(item.match(/Official/)){       // 官费
              officialFee.push(skuPayInfo[item]);
            }else if(item.match(/final/)){     //尾款
              if(item == 'finalTypePendingFee'){    //尾款待定
                this.finalFeePending = true;
              }else{
                finalFee.push(skuPayInfo[item]); //尾款非待定
              };
            }else{
              epositFee.push(skuPayInfo[item]);
            };
          })
          epositFee.forEach( item => this.unitDeposit += item);
          officialFee.forEach(item => this.unitOfficial += item);
          finalFee.forEach( item => this.unitFinal += item);
          if (this.$route.query.pageFrom == 1) {
            this.fixTotalPay()
          }
        }
        } else {
          this.$message({
              message:res.msg,
              type:'error',
              offset:300
          })
        }
      })
    },
    getServiceFeeSty() {
      let info = this.orderDetail
      let serviceFee = this.serviceFee
      if (this.$route.query.pageFrom == 1) {
        // 从产品页面进入此页面或者从订单列表和详情（前提tailstatusPayFlag必须为false）进入此页面
        if(info.priceType == 'due-price'){
          serviceFee[0].title ='服务费'
        }
        serviceFee[0].value = this.unitDeposit;
        serviceFee[0].status = info.tailstatusPayFlag == true ? 2 : 0
        serviceFee[0].payProcess = true
        serviceFee[1].value = this.finalIndex == -1 ? '待定':this.unitFinal
        serviceFee[1].status = info.tailstatusPayFlag == true ? 0 : 1
        serviceFee[1].payProcess = false
        serviceFee[2].value = this.unitOfficial ? this.unitOfficial : 0
        serviceFee[2].status = info.tailstatusPayFlag == true ? 2 : 0
        serviceFee[2].payProcess = true
        this.serviceFee= serviceFee.filter((item, i) => { return item.value != 0 && item.value != ''&& item.value != undefined || item.value == 0 && i==1 && this.orderDetail.priceType=='wait-tail'})
      }
      let arr = this.serviceFee.map(obj => {return obj.value})
      let amount = arr.reduce((n,m) => n + m)
      this.totalSingle = amount
    },
    fixTotalPay() {
      let info = this.orderDetail
      let totalPriceList = this.totalPriceList
      let priceType = 'orderInfo.priceType';
      let choiceAttribute = info.choiceAttribute;
      if(choiceAttribute.dueTypeAgencyFee||choiceAttribute.dueTypeOfficialFee||choiceAttribute.dueTypeThirdPartyFee){
          totalPriceList[0].title = '服务费总计'
          totalPriceList[0].value = Number(choiceAttribute.dueTypeAgencyFee || 0) + Number(choiceAttribute.dueTypeThirdPartyFee || 0)
          totalPriceList[1].value = Number(choiceAttribute.dueTypeOfficialFee) || 0
          totalPriceList[2].value = totalPriceList[0].value + totalPriceList[1].value
            priceType = 'due-price', //一口价
            this.totalPriceList =  totalPriceList,
            this.thirdFee = choiceAttribute.dueTypeOfficialFee 
      } else if(choiceAttribute.finalTypePendingFee==0){
          totalPriceList[0].value = Number(choiceAttribute.depositTypeAgencyFee || 0)+Number(choiceAttribute.depositTypeThirdPartyFee || 0)
          totalPriceList[1].value = Number(choiceAttribute.depositTypeOfficialFee || 0)
          totalPriceList[2].value = totalPriceList[0].value + totalPriceList[1].value
          // this.setData({
            priceType = 'wait-tail', //尾款待定
            this.totalPriceList =  totalPriceList,
            this.thirdFee =  choiceAttribute.depositTypeOfficialFee         
          // })
      } else {
          let finalIndex = String(Object.keys(choiceAttribute)).indexOf("final");//防止数据结构有问题，尾款未设置情况  
          totalPriceList[0].value = Number(choiceAttribute.depositTypeAgencyFee || 0)+Number(choiceAttribute.depositTypeThirdPartyFee || 0)
          totalPriceList[1].value = Number(choiceAttribute.depositTypeOfficialFee || 0)
          totalPriceList[2].value = totalPriceList[0].value + totalPriceList[1].value
          // this.setData({
            priceType = 'tail-price', //有尾款,
            this.totalPriceList =  totalPriceList,
            this.finalIndex = finalIndex,
            this.thirdFee =  choiceAttribute.depositTypeOfficialFee,   
            this.tailAmount =  Number(choiceAttribute.finalTypeAgencyFee || 0)+Number(choiceAttribute.finalTypeThirdPartyFee || 0)      
          // })
      }
      let price = 'orderInfo.totalPrice';
        price = this.totalFix(this.orderDetail.productCount)
      if (this.orderDetail.totalPrice && this.checkedIndex == 2) {
          this.checkedIndex =  0
      }
      this.getServiceFeeSty();
    },
    orderListFee(){
      let fee = this.feeInfo;
      let serviceFee = this.serviceFee;
      let totalPriceList = this.totalPriceList
      if(this.$route.query.tailstatusPayFlag){ //支付尾款修改列表状态
        serviceFee[0].payProcess = serviceFee[2].payProcess = false
        serviceFee[0].status = serviceFee[2].status = 2
        serviceFee[1].payProcess = true
        serviceFee[1].status = 0
      }
      if(fee.isDue){
        serviceFee[0].title = '服务费';
        serviceFee[0].value = fee.dueDeposit;
        totalPriceList[0].value = fee.dueDeposit;
      };
      if(fee.hasDeposit){
        serviceFee[0].value = fee.deposit
        totalPriceList[0].value = fee.deposit;
        serviceFee[1].value = fee.tailPrice ? fee.tailPrice:fee.tailStatus
      };
      if(fee.hasOffical){
        serviceFee[2].value = fee.offical
        totalPriceList[1].value = fee.offical
      }
      totalPriceList[2].value = totalPriceList[0].value+totalPriceList[1].value
        this.serviceFee = serviceFee.filter((item, i) => { return item.value != 0 && item.value != ''});
        // this.orderListNo = this.orderInfo.orderNo + '_' +fee.payType,
        this.totalPriceList = totalPriceList;
    },
    // 总价计算
    totalFix(count) {
      let goverment = this.totalPriceList[1].value // 官费价格
      let deposit = this.totalPriceList[0].value // 定金
      return count * (Number(deposit) + Number(goverment))
    },
    handleGoDetail() {
      this.$router.push({
        path:'/productdetails/details?spuId='+this.orderDetail.spuId
      })
    },
    filterType(url){
      if(url.match(/(jpeg|png|jpg|gif)/)){
        return true
      }else{
        return false
      };
    },
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
      this.$router.push('/agreement/xmjy');
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
          this.$router.go(-1)
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
    projectDetail(obj){
      getArtcleDetail(Object.assign(obj)).then((res) => {
        this.orderDetail = res.data.detail;
        this.policyGovfeeTypeListLength = res.data.detail.policyGovfeeTypeList.length;
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
      if((this.userInfo.status == 2 || this.userInfo.status == 5)){
        if(this.receive == ''){
          this.$message({
            type:'warning',
            message:'为了后期方便给您提供更好的服务，请添加您的收件地址',
            offset: 80,
            duration: 2000
          })
        }else{
          if(this.read || this.$route.query.source == 'pay-list'){
            this.$store.state.loading = true;//显示loading
            if(this.$route.query.areaSelect){
              var param = {
                id: this.orderDetail.id,
                addressId: this.receive
              }
            }else{
              var param = {
                buyNum: this.productNum,
                goodsSkuId: this.skuId,
                inviteCode: sessionStorage.getItem('link') || null,
                addressId: this.receive,
                orderPort: 'H5',
                orderSource: 1,   //1-自主下单；2-后台发起
                totalAmount: (this.unitDeposit + this.unitFinal + this.unitOfficial) * this.productNum
              }
            };
            saveOrder(param,this.$route.query.areaSelect).then(res=>{
              if(res.code == 0){
                this.pay(res);
              }else{
                this.$message({
                  type:'warning',
                  message: res.msg,
                  offset: 100
                })
                setTimeout(()=>{
                  this.$router.push({
                    path: '/member/order',
                    query:{
                      orderNo: this.orderDetail.orderNo || null
                    }
                  });
                },1000)
              }
              this.$store.state.loading = false;//关闭loading
            })
          }else{
            this.hasRead = false;
          };
        };
      }else{
        this.AuthenticationDialog = true;
      };
      // if(this.receive == ''){
      //   this.$message({
      //     type:'warning',
      //     message:'为了后期方便给您提供更好的服务，请添加您的收件地址',
      //     offset: 80,
      //     duration: 2000
      //   })
      // }else if(orderData.throttle(3000)){
      //   if(this.read || this.tailstatusPayFlag){
      //     let param = {
      //       orderSource: 1,//线上
      //       platformSource: 1,//0-PC 1-手机端
      //       orderStatus: 6,//待付款
      //       productCount: this.productNum,
      //       receiveAddressId: this.receive,
      //       accountId: this.userInfo.userId,
      //       paymentType: this.payType,
      //     }
      //     /* 订单详情=>支付页 */
      //     if(this.$route.query.source == 'pay-list'){
      //       if((!this.tailstatusPayFlag && (Number(this.orderDetail.orderDetailVO.earnestMoney)+Number(this.orderDetail.orderDetailVO.governmentFee || 0))/100 == 0) || (this.tailstatusPayFlag && this.orderDetail.tailAmount ==0)){//支付金额是否为0
      //        param.zeroPayAmountFlag = true;
      //       }else{
      //       }
      //       param.orderType = this.orderDetail.orderType;
      //       param.productName = this.orderDetail.orderDetailVO.productName;
      //       param.productNo = this.orderDetail.orderDetailVO.productNo;
      //       param.productId = this.orderDetail.orderDetailVO.productId;
      //       param.agencyFee = Number(this.orderDetail.orderDetailVO.agencyFee)+Number(this.orderDetail.orderDetailVO.thirdPartyFee);
      //       param.governmentFee = this.orderDetail.orderDetailVO.governmentReduceFee ? this.orderDetail.orderDetailVO.governmentReduceFee : '';
      //       param.tailAmount = this.orderDetail.tailAmount;
      //       if(this.orderDetail.orderDetailVO.governmentFeeId >= 0){
      //         param.governmentFeeId = this.orderDetail.orderDetailVO.governmentFeeId;
      //       };
      //       if(this.orderDetail.orderDetailVO.governmentFee){
      //         param.totalAmount = this.orderDetail.orderDetailVO.feeType == 2 ? Number(this.orderDetail.orderDetailVO.governmentFee)*this.productNum : Number(Number(this.orderDetail.orderDetailVO.nowFee)+Number(this.orderDetail.orderDetailVO.governmentFee))*this.productNum;
      //       }else if(this.orderDetail.orderDetailVO.governmentFeeId >= 0){
      //         param.totalAmount = Number(Number(this.orderDetail.orderDetailVO.nowFee) + Number(this.orderDetail.orderDetailVO.governmentReduceFee))*this.productNum;
      //       }else{
      //         param.totalAmount = Number(this.orderDetail.orderDetailVO.nowFee)*this.productNum;
      //       };
      //       if(this.$route.query.tailstatusPayFlag){
      //         param.tailstatusPayFlag = this.$route.query.tailstatusPayFlag;
      //       }
      //     }else{
      //       /* 产品详情下单=>支付页 */
      //       param.orderType = this.orderType;
      //       param.productName = this.orderDetail.title;
      //       param.productNo = this.orderDetail.number;
      //       param.productId = this.orderDetail.id;
      //       param.agencyFee = this.orderDetail.agencyFee ? Number(this.orderDetail.agencyFee)+Number(this.orderDetail.thirdPartyFee) : '';
      //       param.tailAmount = (Number(this.orderDetail.nowFee) - Number(this.orderDetail.earnestMoney)) * this.productNum;
      //       if(this.policyGovfeeTypeListLength > 0){
      //         param.governmentFeeId = this.orderDetail.policyGovfeeTypeList[this.govermentFeeType].id;
      //         param.governmentName = this.orderDetail.policyGovfeeTypeList[this.govermentFeeType].typeName;
      //         param.governmentFee = this.orderDetail.policyGovfeeTypeList[this.govermentFeeType].typeFee;
      //         if(Number(Number(this.orderDetail.earnestMoney) + Number(this.orderDetail.policyGovfeeTypeList[this.govermentFeeType].typeFee)) == 0){//支付金额是否为0
      //           param.zeroPayAmountFlag = true;
      //         }
      //       }else if(Number(this.orderDetail.earnestMoney) == 0){
      //         param.zeroPayAmountFlag = true;
      //       };
      //       if(this.orderDetail.governmentFee){
      //         param.totalAmount = this.orderDetail.feeType == 2 ? Number(this.orderDetail.governmentFee)*this.productNum : Number(Number(this.orderDetail.nowFee)+Number(this.orderDetail.governmentFee))*this.productNum;
      //       }else if(this.policyGovfeeTypeListLength > 0){
      //         param.totalAmount = Number(Number(this.orderDetail.nowFee) + Number(this.orderDetail.policyGovfeeTypeList[this.govermentFeeType].typeFee))*this.productNum;
      //       }else{
      //         param.totalAmount = Number(this.orderDetail.nowFee)*this.productNum;
      //       };
      //     }
      //     // 支付
      //     if(this.$route.query.source == 'pay-list'){
      //      if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && this.payType == 2){   //JSAPI支付
      //           param.isMiniPayApi = true
      //           param.openid = this.openid
      //       }else if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != 'micromessenger' && this.payType == 2){  //H5支付
      //           param.isMiniPayApi = false
      //       }
      //       if(this.payType ==  1){ // 对公
      //         var encrypt = Encrypt.encrypt(JSON.stringify(param),'v4kgOl8v7SKJlxXM');//密钥自定义 加密解密时保持一致即可
      //         this.$router.push({
      //           path: '/order/publicTransfer',
      //           query: {
      //             data: encrypt,
      //             orderNo: this.orderDetail.orderNo,
      //             orderId: this.orderDetail.id,
      //             tailstatusPayFlag : this.$route.query.tailstatusPayFlag,
      //           }
      //         })
      //       }else if(this.payType ==  0){ // 支付宝
      //         Vue.delete(this.orderDetail,'gmtModified');
      //         Vue.delete(this.orderDetail,'paymentType');
      //         saveOrder(Object.assign(param,this.orderDetail)).then(res=>{
      //           if(res.code == 50000){//已付款
      //             this.$message({
      //               type: 'error',
      //               message: res.data.msg,
      //               offset: 80,
      //               duration: 3000
      //             })
      //           }else if(res.code == 8888){//付款金额为0
      //             this.$message({
      //               type: 'success',
      //               message:'订单支付成功！',
      //               offset: 80,
      //               duration: 2000
      //             })
      //             this.$router.push('/member/order');
      //           }else{
      //             this.$router.push({
      //               path:'/order/pay',
      //               query:{
      //                  data:Encrypt.encrypt(JSON.stringify(Object.assign(param,this.orderDetail)),'v4kgOl8v7SKJlxXM')
      //               }
      //             })
      //           };
      //         })
      //       }else{ // 微信
      //         Vue.delete(this.orderDetail,'gmtModified');
      //         Vue.delete(this.orderDetail,'paymentType');
      //         saveOrder(Object.assign(param,this.orderDetail)).then(res=>{
      //               if(res.code == 0){
      //                 let encrypt = Encrypt.encrypt(JSON.stringify(Object.assign(param,this.orderDetail)),'v4kgOl8v7SKJlxXM')
      //                 this.$router.push({
      //                       path: '/order/wechat',
      //                       query: {
      //                           tailstatusPayFlag : this.$route.query.tailstatusPayFlag,
      //                           data: encrypt,
      //                           orderNo: this.orderDetail.orderNo,
      //                           id:this.paymentId
      //                       }
      //                   })
      //               }else{
      //                   this.$message({
      //                       type: 'error',
      //                       message: res.data.msg,
      //                       offset: 80,
      //                       duration: 3000
      //                   })
      //               }
      //         })
      //       }
      //     }else{
      //       if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && this.payType == 2){   //JSAPI支付
      //           param.isMiniPayApi = true
      //           param.openid = this.openid
      //       }else if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != 'micromessenger' && this.payType == 2){  //H5支付
      //           param.isMiniPayApi = false
      //       }
      //       saveOrder(param).then(res=>{              
      //         if(this.payType ==  1){//对公
      //           this.$router.push({
      //               path: '/order/publicTransfer',
      //               query:Object.assign( {
      //                 categoryId: this.categoryId,
      //                 payChannel: this.payType,
      //                 unitDeposit: this.unitDeposit || this.orderDetail.depositPrice || this.orderDetail.dueDepositPrice,
      //                 unitOfficial: this.unitOfficial || this.orderDetail.officalPrice,
      //                 unitFinal: this.unitFinal || this.orderDetail.finalPrice,
      //                 payNum: this.productNum || this.orderDetail.buyNum,
      //                 tailstatusPayFlag: this.$route.query.tailstatusPayFlag || false,
      //               },obj || {
      //                 orderNo: this.orderDetail.orderNo,
      //                 id: this.paymentId,
      //                 payAmount: this.payAmount
      //               })
      //             })
      //         }else if(this.payType ==0){//支付宝
      //           param.id = res.data.id
      //           param.orderDetailVO = res.data.orderDetailVO
      //           param.orderNo = res.data.orderNo
      //           if(res.code == 0){
      //             this.$router.push({
      //               path:'/order/pay',
      //               query:{
      //                 data:Encrypt.encrypt(JSON.stringify(Object.assign(param)),'v4kgOl8v7SKJlxXM')
      //               }
      //             })
      //           }else if(res.code == 8888){
      //             this.$message({
      //               type: 'success',
      //               message:'订单支付成功！',
      //               offset: 80,
      //               duration: 2000
      //             })
      //             this.$router.push('/member/order');
      //           }else{
      //               this.$message({
      //                   type: 'error',
      //                   message: res.data.msg,
      //                   offset: 80,
      //                   duration: 3000
      //               })
      //           }
      //         }else{//微信
      //           if(res.code == 0){
      //               param.id = res.data.id
      //               param.orderDetailVO = res.data.orderDetailVO
      //               param.orderNo = res.data.orderNo
      //               let encrypt = Encrypt.encrypt(JSON.stringify(param),'v4kgOl8v7SKJlxXM')
      //               this.$router.push({
      //                   path: '/order/wechat',
      //                   query: {
      //                       tailstatusPayFlag : this.$route.query.tailstatusPayFlag,
      //                       data: encrypt,
      //                       orderNo: res.data.data.orderNo,
      //                       id:res.data.data.id
      //                   }
      //               })
      //           }else{
      //               this.$message({
      //                   type: 'error',
      //                   message: res.data.msg,
      //                   offset: 80,
      //                   duration: 3000
      //               })
      //           }
      //         }
      //       })
      //     };
      //   }else{
      //     this.hasRead = false;
      //   };
      // };
    },
  },
  destroyed() {
    window.removeEventListener('popstate', this.goback, false);
  },
}
</script>


<style lang="stylus" scoped>
    @import '~assets/css/order/orderPay.styl'
</style>