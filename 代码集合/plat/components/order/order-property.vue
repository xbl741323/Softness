<template>
  <div class="order_pay_property">
    <div class="order_pay_frame">
      <div class="order-head">
        <p class="order_page">结算页<span>填写并核对订单信息</span></p>
        <div class="time-line">
          <div class="now-line">
            <p class="line success-line"></p>
            <p class="num success-num">1</p>
            <p style="color:#CAECB6">选择产品</p>
          </div>
          <div class="now-line">
            <p class="line active-line"></p>
            <p class="num now-num">2</p>
            <p style="color:#7ABD54">确认订单信息</p>
          </div>
          <div class="now-line">
            <p class="line"></p>
            <p class="num">3</p>
            <p style="color: #CCCCCC">支付款项</p>
          </div>
          <div class="now-line">
            <p class="line"></p>
            <p class="num">4</p>
            <p style="color: #CCCCCC">交易成功，开始服务</p>
          </div>
        </div>
      </div>
      <p class="order-no" v-if="$route.query.source == 'pay-detail'">订单编号：{{orderDetail.orderNo}}</p>
      <div class="order_info">
        <!-- 订单信息 -->
        <p class="title">订单信息</p>
        <div class="product_info_title">
          <p>产品</p>
          <p>单价</p>
          <p>官费</p>
          <p>数量</p>
        </div>
        <!-- 订单详情->支付页 -->
        <div class="product_info" v-if="$route.query.source == 'pay-detail' && orderDetail.orderDetailVO">
          <div class="name">
            <!-- 1-专利，2-商标，3-版权，4-其他 -->
            <img v-if="orderDetail.orderDetailVO.productSubType ==1" src="~/assets/images/order/pic_zl@2x.png" />
            <img v-if="orderDetail.orderDetailVO.productSubType ==2" src="~/assets/images/order/pic_sb@2x.png" />
            <img v-if="orderDetail.orderDetailVO.productSubType ==3" src="~/assets/images/order/pic_bq@2x.png" />
            <img v-if="orderDetail.orderDetailVO.productSubType ==4" src="~/assets/images/order/pic_qt@2x.png" />
            <!-- <img :src="imgUrl+orderDetail.orderDetailVO.coverUrl" > -->
            <div class="product_type">
              <p>{{orderDetail.orderDetailVO.productName}}</p>
              <p>订单类型：{{orderDetail.orderType | orderType}}</p>
            </div>
          </div>
          <p class="price">￥{{orderDetail.orderDetailVO.feeType == 2 ? 0 : orderDetail.orderDetailVO.nowFee/100}}</p>
          <p v-if="orderDetail.orderDetailVO.feeType == 2" class="price" >￥{{orderDetail.orderDetailVO.governmentFee/100}}</p>
          <p v-else-if="orderDetail.orderDetailVO.governmentFeeId >= 0" class="price">￥{{orderDetail.orderDetailVO.governmentReduceFee/100}}</p>
          <p v-else class="price">￥0.00</p>
          <!-- <p>{{orderDetail.orderDetailVO.productCount}}</p> -->
        </div>
        <!-- 产品详情下单->支付页 -->
        <div class="product_info" v-else>
          <div class="name">
            <!-- 1-专利，2-商标，3-版权，4-其他 -->
            <!-- <img :src="imgUrl+orderDetail.coverUrl" > -->
            <img v-if="orderDetail.type ==1" src="~/assets/images/order/pic_zl@2x.png" />
            <img v-if="orderDetail.type ==2" src="~/assets/images/order/pic_sb@2x.png" />
            <img v-if="orderDetail.type ==3" src="~/assets/images/order/pic_bq@2x.png" />
            <img v-if="orderDetail.type ==4" src="~/assets/images/order/pic_qt@2x.png" />
            <div class="product_type">
              <p>{{orderDetail.name}}</p>
              <p>订单类型：{{orderType | orderType}}</p>
            </div>
          </div>
          <p class="price">￥{{orderDetail.feeType == 2 ? 0 : orderDetail.nowFee/100}}</p>
          <p v-if="orderDetail.governmentFee" class="price" >￥{{orderDetail.governmentFee/100}}</p>
          <p v-else-if="goverFeeListLength > 0" class="price" >￥{{orderDetail.governmentFeeTypeList[goverFeeType].typeFee/100}}</p>
          <p v-else class="price" >￥0.00</p>
          <div class="product-num">
            <el-input-number class="num-input" v-model="productNum" :min="1" :max="99" :step="1" step-strictly></el-input-number>
          </div>
        </div>
        <!-- 收件地址 -->
        <div class="address">
          <div>
            <p class="address_title">收件地址</p>
            <div v-for="item in receiveList" :key="item.id"> 
              <el-radio v-model="receive" :label="item.id">
                <span class="namelimit">{{item.receiverName}}</span>
                <span class="namelimit">{{item.areaName}}</span>
                <span class="namelimit">{{item.detailAddress}}</span>
                <span class="namelimit">{{item.mobilePhoneNumber}}</span>
              </el-radio>
              <span class="default-area" v-if="item.isDefault == 1">默认地址</span>
            </div>
          </div>
          <div v-if="receiveList.length >= 0 && receiveList.length <10">
            <p class="add_address" @click="addressDialog = true, dialogStatus = true">新增收件地址</p>
          </div>
        </div>
        <!-- 支付方式 -->
        <div class="address">
            <div>
                <p class="address_title">支付方式</p>
                <div class="payment_type">
                <div :class="[payType==1?'active':'','pay_zfb']" @click="payType = 1">
                    <img class="pay_type" v-if="payType == 1" src="~/assets/images/order/zhuanzhang_icon_bright@2x.png" />
                    <img class="pay_type" v-else src="~/assets/images/order/zhuanzhang_icon@2x.png" />
                    <p class="zfb">线下对公转账</p>
                    <img class="choose" v-if="payType==1" src="~assets/images/order/dui_icon.png" />
                </div>
                <div :class="[payType==0?'active':'','pay_zfb']" @click="payType = 0">
                    <img class="pay_type" v-if="payType == 0" src="~/assets/images/order/zhifubao_icon@2x.png" />
                    <img class="pay_type" v-else src="~/assets/images/order/zhifubao_icon_dark@2x.png" />
                    <p class="zfb">支付宝支付</p>
                    <img class="choose" v-if="payType==0" src="~assets/images/order/dui_icon.png" />
                </div>
                <div :class="[payType==2?'active':'','pay_zfb']" @click="payType = 2" v-if="showWeixinBtn == true">
                    <img class="pay_type" v-if="payType == 2" src="~/assets/images/order/wxzf_icon@2x.png" />
                    <img class="pay_type" v-else src="~/assets/images/order/wxzf_hui_icon@2x.png" />
                    <p class="zfb">微信支付</p>
                    <img class="choose" v-if="payType==2" src="~assets/images/order/dui_icon.png" />
                </div>
                </div>
          </div>
        </div>
      </div>
      <!-- 价格合计 -->
      <div class="settlement">
        <!-- 订单详情=>支付页 -->
        <div class="price_total order-pay" v-if="$route.query.source == 'pay-detail' && orderDetail.orderDetailVO">
          <div class="total_grid">
            <p><span style="color: red" >{{orderDetail.orderDetailVO.productCount}}</span> 件商品，总商品金额：</p>
            <!-- 仅官费 不统计单价 -->
            <p v-if="orderDetail.orderDetailVO.governmentReduceFee" >￥{{orderDetail.orderDetailVO.feeType == 2 ? Number(orderDetail.orderDetailVO.governmentReduceFee)*productNum/100 : Number(Number(Number(orderDetail.orderDetailVO.nowFee)+Number(orderDetail.orderDetailVO.governmentReduceFee))*productNum)/100}}</p>
            <!-- 非仅官费 并添加了官费 -->
            <p v-else-if="orderDetail.orderDetailVO.governmentFeeId >= 0" >￥{{Number(Number(orderDetail.orderDetailVO.nowFee)+Number(orderDetail.orderDetailVO.governmentReduceFee))*productNum/100}}</p>
            <!-- 非仅官费未添加官费 -->
            <p v-else>￥{{Number(orderDetail.orderDetailVO.nowFee)*productNum/100}}</p>
            <p>优惠：</p>
            <p>￥{{0.00}}</p>
            <p>应付总额：</p>
            <!-- 区别同上 -->
            <p v-if="orderDetail.orderDetailVO.governmentReduceFee" style="color: #FB0400" >￥{{orderDetail.orderDetailVO.feeType == 2 ? Number(orderDetail.orderDetailVO.governmentReduceFee)*productNum/100 : Number(Number(Number(orderDetail.orderDetailVO.nowFee)+Number(orderDetail.orderDetailVO.governmentReduceFee))*productNum)/100}}</p>
            <p v-else-if="orderDetail.orderDetailVO.governmentFeeId >= 0" style="color: #FB0400" >￥{{Number(Number(orderDetail.orderDetailVO.nowFee)+Number(orderDetail.orderDetailVO.governmentReduceFee))*productNum/100}}</p>
            <p v-else style="color: #FB0400">￥{{Number(orderDetail.orderDetailVO.nowFee)*productNum/100}}</p>
          </div>
        </div>
        <!-- 产品详情下单=>支付页 -->
        <div class="price_total" v-else>
          <div class="total_grid">
            <p><span style="color: red" >{{productNum}}</span> 件商品，总商品金额：</p>
            <!-- 仅官费 不统计单价 -->
            <p v-if="orderDetail.governmentFee" >￥{{orderDetail.feeType == 2 ? Number(orderDetail.governmentFee)*productNum/100 : Number(Number(Number(orderDetail.nowFee)+Number(orderDetail.governmentFee))*productNum)/100}}</p>
            <!-- 非仅官费 并添加了官费 -->
            <p v-else-if="goverFeeListLength > 0" >￥{{Number(Number(orderDetail.nowFee)+Number(orderDetail.governmentFeeTypeList[goverFeeType].typeFee))*productNum/100}}</p>
            <!-- 非仅官费未添加官费 -->
            <p v-else>￥{{Number(orderDetail.nowFee)*productNum/100}}</p>
            <p>优惠：</p>
            <p>￥{{0.00}}</p>
            <p>应付总额：</p>
            <!-- 区别同上 -->
            <p v-if="orderDetail.governmentFee" style="color: red">￥{{orderDetail.feeType == 2 ? Number(orderDetail.governmentFee)*productNum/100 : Number(Number(orderDetail.nowFee)+Number(orderDetail.governmentFee))*productNum/100}}</p>
            <p v-else-if="goverFeeListLength > 0" style="color: red">￥{{Number(Number(orderDetail.nowFee) + Number(orderDetail.governmentFeeTypeList[goverFeeType].typeFee))*productNum/100}}</p>
            <p v-else style="color: red">￥{{Number(orderDetail.nowFee)*productNum/100}}</p>
          </div>
          <el-checkbox v-model="read" class="agreement"><span>我已阅读并同意<a style="text-decoration:none;color: #409EFF" href="/agreement/jyfwxy" target="block">《卧涛交易服务协议》</a></span></el-checkbox>
          <p v-if="!hasRead && !read" class="warning-text">请阅读并勾选《卧涛交易服务协议》</p>
        </div>
        <!-- 提交 -->
        <div class="submit_btn" v-if="$route.query.source == 'pay-detail'" @click="submit()">去付款</div>
        <div class="submit_btn" v-else @click="submit()" >提交订单</div>
      </div>
    </div>
    <div v-html="alipay" v-if="showAlipay"></div>
    <!-- 新增地址 -->
    <el-dialog title="填写收件地址" :visible.sync='addressDialog' :close-on-click-modal="false" center :show-close='false' width="597px">
      <div v-if="dialogStatus">
        <el-form :model="areaForm" ref="areaForm" :rules="areaRules" label-width="110px" class="add_area">
          <el-form-item label="选择地区：" prop="area">
            <el-cascader v-model="areaForm.area" :options="areaList" :props="{ value: 'id', label: 'areaName'}" placeholder="请选择地区"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input placeholder="请输入详细地址信息，如道路、楼栋、单元号、门牌号等" maxlength="100" v-model="areaForm.address" />
          </el-form-item>
          <el-form-item label="收件人姓名：" prop="receiverName">
            <el-input v-model="areaForm.receiverName" maxlength="50" />
          </el-form-item>
          <el-form-item label="手机号码：" prop="mobilePhone">
            <el-input v-model="areaForm.mobilePhone" />
          </el-form-item>
          <el-form-item label="" prop="defaultArea">
            <el-checkbox v-model="isDefaultArea">设为默认收件地址</el-checkbox>
          </el-form-item>
          <div style="text-align: center">
            <el-button type="primary" @click="submitArea()">确定</el-button>
            <el-button @click="cancel()">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
</div>
</template>

<script>
import Encrypt from '~/plugins/Encrypt'
import { getAreaList, receiveList, addAddress, submitOrder } from '~/api/member'
import { getPropertyDetail } from '~/api/order'
import  orderData from '~/pages/member/order/productOrder/order-data'
import Vue from 'vue'
export default {
  head() {
    return {
      title: '订单结算',
      meta: [
        { name: 'keywords', content: '订单结算' },
        {
          hid: 'description',
          name: 'description',
          content:'订单结算'
        }
      ]
    }
  },
  data(){
    return {
      imgUrl: process.env.CDN_BASE_URL,
      orderDetail: {},
      productNum: '',
      payType: 1,//支付方式 0-支付宝 1-对公转账 2-微信
      read: false,
      areaList: [],//地区
      receiveList:[],//收件地址
      orderType:'',//0-知产 1-项目
      goverFeeType: '',//费减类型
      goverFeeListLength:'',
      receive:'',
      areaForm:{},
      userInfo:{},
      dialogStatus: false,
      addressDialog: false,
      isDefaultArea: false,
      hasDefault: false,
      hasRead: true,
      showAlipay: false,
      alipay:'',
      areaRules:{
        area:[{required: true, message:'请选择地区',trigger:'change'}],
        address:[{required: true, message:'请输入详细地址',trigger:'blur'}],
        receiverName:[{required: true, message:'请输入收件人姓名',trigger:'blur'}],
        mobilePhone:[{required: true, pattern:/^1[3456789]\d{9}$/, message:'请输入正确的手机号码',trigger:'blur'}]
      }
    }
  },
  filters:{
    orderType(val){
      return orderData.orderType(val);
    },
  },
  computed:{
     showWeixinBtn(){
         if(this.$route.query.source == 'pay-detail' && this.orderDetail.orderDetailVO){ // 我的订单
             if(this.orderDetail.orderDetailVO.governmentReduceFee){
                 return (this.orderDetail.orderDetailVO.feeType == 2 ? Number(this.orderDetail.orderDetailVO.governmentReduceFee)*this.productNum/100 : Number(Number(Number(this.orderDetail.orderDetailVO.nowFee)+Number(this.orderDetail.orderDetailVO.governmentReduceFee))*this.productNum)/100) > 6000 ? false :true
             }else if(this.orderDetail.orderDetailVO.governmentFeeId >= 0){
                 return (Number(Number(this.orderDetail.orderDetailVO.nowFee)+Number(this.orderDetail.orderDetailVO.governmentReduceFee))*this.productNum/100) >6000 ? false :true
             }else{
                 return (Number(this.orderDetail.orderDetailVO.nowFee)*this.productNum/100) >6000 ? false :true
             }
         }else{ // 产品详情下单
             if(this.orderDetail.governmentFee){
                 return (this.orderDetail.feeType == 2 ? Number(this.orderDetail.governmentFee)*this.productNum/100 : Number(Number(this.orderDetail.nowFee)+Number(this.orderDetail.governmentFee))*this.productNum/100) >6000 ? false :true
             }else if(this.goverFeeListLength > 0){
                 return (Number(Number(this.orderDetail.nowFee) + Number(this.orderDetail.governmentFeeTypeList[this.goverFeeType].typeFee))*this.productNum/100) >6000 ? false :true
             }else{
                 return (Number(this.orderDetail.nowFee)*this.productNum/100) >6000 ? false :true
             }
         }
     }
  },
  mounted(){
    /* decrypt解密 密钥自己设置加密解密保持一致*/
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo){
      this.getReceiveList();
      this.getArea();
      if(this.$route.query.source == 'pay-detail'){
        this.orderDetail = JSON.parse(Encrypt.decrypt(this.$route.query.data,'Y2FsdGVkX184Asts'));
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
    };
  },
  methods:{
    propertyDetail(obj){
      getPropertyDetail(Object.assign(obj,{accountId: this.userInfo.accountId})).then((res) => {
        if(res.data.code == 1000){
          this.orderDetail = res.data.data;
          this.goverFeeListLength = this.orderDetail.governmentFeeTypeList.length;
        }
      })
    },
    submit(){
      if(this.receive == ''){
        this.$message({
          type:'warming',
          message:'为了后期方便给您提供更好的服务，请添加您的收货件地址',
          offset: 80,
          duration: 2000
        })
      }else{
        if(this.read ||this.$route.query.source == 'pay-detail'){
          this.$store.state.loading = true;
          let param = {
            orderSource: 1,//线上
            platformSource: 0,//PC
            orderStatus: 6,//待付款
            productCount: this.productNum,
            receiveAddressId: this.receive,
            accountId: this.userInfo.accountId,
            paymentType: this.payType,
          }
          /* 订单详情=>支付页 */
          if(this.$route.query.source == 'pay-detail'){
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
            if(this.orderDetail.orderDetailVO.governmentReduceFee){
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
              param.governmentFeeId = this.orderDetail.governmentFeeTypeList[this.goverFeeType].id;
              param.governmentName = this.orderDetail.governmentFeeTypeList[this.goverFeeType].typeName;
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
          if(this.$route.query.source == 'pay-detail'){
            if(this.payType ==  1){ // 对公
            this.$store.state.loading = false;
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
                if(res.data.code == 50000){
                  this.$store.state.loading = false;
                  this.$message({
                    type: 'error',
                    message: res.data.msg,
                    offset: 80,
                    duration: 3000
                  })
                }else{
                  this.$store.state.loading = false;
                  this.$router.push({
                    path:'/order/pay',
                    query:{
                      data: Encrypt.encrypt(JSON.stringify(Object.assign(param,this.orderDetail)),'v4kgOl8v7SKJlxXM')
                    }
                  })
                }
              })
            }else{ // 微信
                this.$store.state.loading = false
                Vue.delete(this.orderDetail,'gmtModified');
                Vue.delete(this.orderDetail,'paymentType');
                submitOrder(Object.assign(param,this.orderDetail)).then(res=>{
                 if(res.data.code == 0){
                    this.$router.push({
                            path: '/order/wechat',
                            query: {
                                data: Encrypt.encrypt(JSON.stringify(Object.assign(param,this.orderDetail)),'v4kgOl8v7SKJlxXM'),
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
            submitOrder(param).then(res=>{
              if(this.payType ==  1){//对公
                this.$store.state.loading = false;
                var encrypt = Encrypt.encrypt(JSON.stringify(param),'v4kgOl8v7SKJlxXM');//密钥自定义 加密解密时保持一致即可
                this.$router.push({
                  path: '/order/publicTransfer',
                  query: {
                    data: encrypt,
                    orderNo: res.data.data.orderNo
                  }
                })
              }else if(this.payType == 0){//支付宝
                param.id = res.data.data.id
                param.orderDetailVO = res.data.data.orderDetailVO
                param.orderNo = res.data.data.orderNo
                if(res.data.code == 0){
                  this.$store.state.loading = false;
                  this.$router.push({
                    path:'/order/pay',
                    query:{
                      data:Encrypt.encrypt(JSON.stringify(Object.assign(param)),'v4kgOl8v7SKJlxXM')
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
              }else{ //微信
                 this.$store.state.loading = false
                    if(res.data.code == 0){ 
                      param.id = res.data.data.id
                      param.orderDetailVO = res.data.data.orderDetailVO
                      param.orderNo = res.data.data.orderNo
                      this.$router.push({
                            path: '/order/wechat',
                            query: {
                                data: Encrypt.encrypt(JSON.stringify(param),'v4kgOl8v7SKJlxXM'),
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
          };
        }else{
          this.hasRead = false;
        };
      };
    },
    cancel(){
      this.addressDialog = false;
    },
    submitArea(){
      let param={
        accountId: this.userInfo.accountId,
        areaNo: this.areaForm.area.join(','),
        detailAddress: this.areaForm.address,
        receiverName: this.areaForm.receiverName,
        mobilePhoneNumber: this.areaForm.mobilePhone,
        isDefault: this.isDefaultArea ? 1 : 0
      }
      this.$refs.areaForm.validate(valid=>{
        if(valid){
          addAddress(param).then(res=>{
            if(res.data.code == 0){
              this.$message({
                type:'success',
                message: '收件地址新增成功！',
                offset: 300
              })
              this.areaForm = {};
              this.dialogStatus = false;
              this.addressDialog = false;
              this.getReceiveList();
            }else{

            };
          })
        }else{
          return false;
        };
      })
    },
    getReceiveList(){
      receiveList({accountId:this.userInfo.accountId}).then(res=>{
        if(res.data.code == 0){
          this.receiveList = res.data.data;
          this.receiveList.forEach(item => {
            if(item.isDefault == 1){
              this.receive = item.id;
              this.hasDefault = true;
            }else{

            };
          });
          if(this.hasDefault == false){//如果没有设置默认收件地址
            this.receiveList[0].isDefault = 1;
            this.receive = this.receiveList[0].id;
          }
          if(this.$route.query.source == 'pay-detail'){
            this.receive = this.orderDetail.receiveAddressId;
          }else{

          };
        }
      })
    },
    getArea(){
      getAreaList().then(res=>{
        this.areaList = res.data.data;
      }).catch(err=>{
        return err;
      });
    },
  }
}
</script>

<style lang="stylus" scoped>
.order_pay_property{
  border-bottom 1px solid #e8f5fc
  .order_pay_frame{
    width 1190px
    min-height 800px
    margin 0 auto
    color #666666
    .order-head{
      display grid
      grid-template-columns repeat(2, 1fr)
    }
    .order_page{
      margin-top 46px
      font-size 18px
      font-weight 550
      color #333333
    }
    .order_page span{
      font-size 12px
      color #666666
      font-weight 500
      margin-left 5px
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
    .order-no{
      font-size 16px
      color #333333
      margin-top 20px
      margin-bottom -28px
    }
    .order_info{
      width 100%
      height 510px
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
            margin-top 35px
            font-weight 500
            font-size 14px
            line-height 19px
          }
          .product_type :nth-child(1){
            font-weight 550
          }
        }
        .price{
          color #fb0400
          font-weight 550
        }
        .product-num{
          display flex
          margin 0 auto
          .num-input{
            text-align center
            margin auto 0
          }
        }
      }
      .product_info img{
        width 118px
        height 84px
        float left
        margin 16px
      }
      .address{
        display grid
        grid-template-columns 90% 10%
        margin 0 30px
        .namelimit{
          display: inline-block;
          max-width 200px
          font-size 12px
          overflow hidden
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .address_title{
          font-size 16px
          font-weight 550
          color #333333
          margin 30px 0 11px 0
        }
        .default-area{
          font-size 12px
          padding 2px 6px
          background #fe9819
          color #FFFFFF
          border-radius 4px
        }
        .add_address{
          font-size 14px
          margin 30px 0 11px 0
          cursor pointer
          border: 1px solid #36a6fe;
          padding: 6px;
          text-align: center;
          color: #36a6fe;
          border-radius: 5px;
        }
        .pay_type{
          width 20px
          height 20px
        }
        .payment_type{
          display flex
        }
        .pay_zfb{
          position relative
          display flex
          max-width 150px
          padding 5px 10px
          border 1px solid #999999
          border-radius 6px
          margin-right 30px
          text-align center
          cursor pointer
          .choose{
            position absolute
            width 17px
            height 19px
            right 0
            bottom 0
          }
        }
        .pay_zfb:hover{
          border 1px solid #36a6fe
        }
        .active{
          border 1px solid #36a6fe
          color #333333
        }
        .zfb{
          line-height 20px
          margin 0 5px
        }
      }
    }
    .settlement{
      width 416px
      margin-left 774px
      margin-bottom 30px
      .price_total{
        margin 10px 0
        width 416px
        height 158px
        border-radius 5px
        border 1px solid #36a6fe
        .total_grid{
          display grid
          grid-template-columns 50% 50%
          line-height 35px
          text-align right
          padding-right 30px
          color #333333
          font-family Microsoft YaHei, Microsoft YaHei-Regular
          font-size 14px
        }
        .agreement{
          float right
          margin-right 30px
          color #333333
          margin-top 10px
        }
        .warning-text{
          font-size 12px
          float right
          color red
          margin-right 100px
        }
      }
      .order-pay{
        height 110px
      }
      .submit_btn{
        width 202px
        height 48px
        margin-left 214px
        background #36a6fe
        border-radius 5px
        text-align center
        color #FFFFFF
        font-weight 550
        line-height 48px
        cursor pointer

      }
    }
    .title{
      font-size 16px
      font-weight 550
      color #333333
      margin 30px 0 11px 30px
    }
  }
  .add_area{
    padding 20px
  }
  .add_area >>> .el-input__inner{
    width 400px
  }
  .add_area >>> .el-button{
    width 120px
    height 34px
    line-height 34px
    padding 0
  }
}
</style>