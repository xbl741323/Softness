<template>
  <div class="order_pay_project">
    <div class="order_pay_frame">
      <div class="order-head">
        <p class="order_page">结算页<span>填写并核对订单信息</span></p>
      </div>
      <p class="order-no" v-if="$route.query.source == 'pay-detail'">订单编号：{{orderDetail.orderNo}}</p>
      <div :class="[$route.query.source != 'pay-detail' ? 'order_info order_infoH' : 'order_info']">
        <!-- 订单信息 -->
        <p class="title">订单信息</p>
        <div class="product_info_title">
          <p>产品</p>
          <p>服务费</p>
          <p>官费</p>
          <p>数量</p>
        </div>
        <!-- 订单详情->支付页 -->
        <div class="product_info" v-if="$route.query.source == 'pay-detail' && orderDetail.orderPaymentVoList">
          <div class="name">
            <!-- <img class="project_img" :src='imgPath+orderDetail.url' /> -->
            <img class="project_img" :src="imgPath + orderDetail.url" v-if="filterType(orderDetail.url)"/>
            <video class="project_img" :src='imgPath + orderDetail.url' v-if="!filterType(orderDetail.url)" />
            <div class="product_type">
              <p class="product_name">{{orderDetail.spuName}}</p>
              <p class="product_name">{{orderDetail.spec}}</p>
              <p>订单类型：{{orderDetail.categoryId | categoryType}}</p>
            </div>
          </div>
          <!-- <p class="price">￥{{orderDetail.orderDetailVO.feeType == 2 ? 0 : orderDetail.orderDetailVO.nowFee/100}}</p> -->
          <div class="deposit" v-if="!orderDetail.isDue">
            <p :class="tailstatusPayFlag ? 'deposit-final' : 'deposit-nowfee'"><span >定金</span> ￥{{orderDetail.depositPrice || '0.00'}}</p>
            <p :class="tailstatusPayFlag ? 'deposit-nowfee' : 'deposit-final'"><span>尾款</span> <a v-if="orderDetail.finalPrice">￥</a>{{ orderDetail.finalPrice || ' 待定'}}</p>
          </div>
          <div v-if="orderDetail.isDue">
            <p :class="tailstatusPayFlag ? 'deposit-final' : 'deposit-nowfee'"> ￥{{orderDetail.dueDepositPrice  || '0.00'}}</p>
          </div>
          <p :class="tailstatusPayFlag ? 'price final' : 'price'" >￥{{orderDetail.officalPrice || '0.00'}}</p>
          <!-- <p v-else-if="orderDetail.orderDetailVO.governmentFeeId >= 0" :class="tailstatusPayFlag ? 'price final' : 'price'">￥{{orderDetail.orderDetailVO.governmentReduceFee/100}}</p> -->
          <!-- <p v-else :class="tailstatusPayFlag ? 'price final' : 'price'">￥0.00</p> -->
          <p>{{orderDetail.buyNum}}</p>
        </div>
        <!-- 产品详情下单->支付页 -->
        <div class="product_info" v-if="$route.query.source != 'pay-detail' && orderDetail">
          <div class="name">
            <img class="project_img" :src="imgPath + coverUrl" v-if="filterType(coverUrl)" />
            <video class="project_img" :src='imgPath + coverUrl' v-if="!filterType(coverUrl)" />
            <div class="product_type">
              <p class="product_name">{{baseInfo.spuTitle}}</p>
              <p class="product_name">{{attrFirst}} <a v-if="attrSecond" class="attr">+{{attrSecond}}</a> </p>
              <p>订单类型：{{categoryId | categoryType}}</p>
            </div>
          </div>
          <div class="deposit">
            <p class="deposit-nowfee"><span v-if="!isDue">定金</span> ￥{{ unitDeposit || '0.00'}}</p>
            <p class="deposit-final" v-if="!isDue"><span>尾款</span><a v-if="unitFinal">￥</a>{{ unitFinal || ' 待定'}}</p>
          </div>
          <!-- <p v-if="orderDetail.governmentFee" class="price" >￥{{orderDetail.governmentFee/100}}</p> -->
          <p class="price" >￥{{unitOfficial || '0.00' }}</p>
          <!-- <p v-else class="price" >￥0.00</p> -->
          <div class="product-num">
            <el-input-number class="num-input" v-model="productNum" :min="1" :max="99" :step="1" step-strictly></el-input-number>
          </div>
        </div>
        <!-- 收件地址 -->
        <div class="address" v-if="$route.query.source == 'pay-detail'">
          <div>
            <p class="address_title">收件地址</p>
            <div v-for="item in receiveList" :key="item.id" class="area">
              <el-radio v-model="receive" :label="item.id" :disabled="($route.query.source == 'pay-detail') && tailstatusPayFlag">
                <span class="namelimit">{{item.receiverName}}</span>
                <span class="namelimit">{{item.areaName}}</span>
                <span class="namelimit">{{item.detailAddress}}</span>
                <span class="namelimit">{{item.mobilePhoneNumber}}</span>
              </el-radio>
              <span class="default-area" v-if="item.isDefault == 1">默认地址</span>
            </div>
          </div>
          <div v-if="(receiveList.length >= 0 && receiveList.length <10 && $route.query.source != 'pay-detail') || !tailstatusPayFlag">
            <p class="add_address" @click="addressDialog = true, dialogStatus = true">新增收件地址</p>
          </div>
        </div>
        <!-- 支付方式 -->
        <div class="address" v-if="$route.query.source == 'pay-detail'">
          <div>
            <p class="address_title">支付方式</p>
            <div class="payment_type">
              <div :class="[payType==1?'active':'','pay_zfb']" @click="payType = 1">
                <img class="pay_type" v-if="payType == 1" src="~/assets/images/order/zhuanzhang_icon_bright@2x.png" />
                <img class="pay_type" v-else src="~/assets/images/order/zhuanzhang_icon@2x.png" />
                <p class="zfb">线下对公转账</p>
                <img class="choose" v-if="payType==1" src="~assets/images/order/dui_icon.png" />
              </div>
              <div :class="[payType==0?'active':'','pay_zfb']" @click="payType = 0" v-if="categoryId != 3">
                <img class="pay_type" v-if="payType == 0" src="~/assets/images/order/zhifubao_icon@2x.png" />
                <img class="pay_type" v-else src="~/assets/images/order/zhifubao_icon_dark@2x.png" />
                <p class="zfb">支付宝支付</p>
                <img class="choose" v-if="payType==0" src="~assets/images/order/dui_icon.png" />
              </div>
             <div :class="[payType==2?'active':'','pay_zfb']" @click="payType = 2" v-if="showWeixinBtn == true && categoryId != 3">
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
        <!-- 订单详情/列表=>支付页-付尾款 -->
        <div class="price_total order-pay" v-if="$route.query.source == 'pay-detail' && orderDetail.orderPaymentVoList && tailstatusPayFlag">
          <div class="total_grid">
            <p><span style="color: red" >{{orderDetail.buyNum}}</span> 件商品，总商品金额：</p>

            <!-- 仅官费 不统计单价 -->
            <!-- <p v-if="orderDetail.orderDetailVO.governmentFee" >￥{{orderDetail.orderDetailVO.feeType == 2 ? Number(orderDetail.orderDetailVO.governmentReduceFee)*productNum/100 : Number(Number(Number(orderDetail.orderDetailVO.nowFee)+Number(orderDetail.orderDetailVO.governmentReduceFee))*productNum)/100}}</p> -->
            <!-- 非仅官费 并添加了官费 -->
            <!-- <p v-else-if="orderDetail.orderDetailVO.governmentFeeId >= 0" >￥{{Number(Number(orderDetail.orderDetailVO.nowFee)+Number(orderDetail.orderDetailVO.governmentReduceFee))*productNum/100}}</p> -->
            <!-- 非仅官费未添加官费 -->
            <p>￥{{Number(orderDetail.totalAmount)}}</p>
            <p style="color:#999999">定金总计(已付款)：</p>
            <p style="color:#999999">￥{{(orderDetail.depositPrice) * orderDetail.buyNum}}</p>
            <p style="color:#999999">官费总计(已付款)：</p>
            <p style="color:#999999">￥{{orderDetail.officalPrice * orderDetail.buyNum || '0.00'}}</p>
            <p>尾款总计：</p>
            <p>￥{{orderDetail.finalPrice* orderDetail.buyNum || '待定'}}</p>
            <p style="font-weight: 550;font-size: 16px">本次应付总额：</p>
            <!-- 区别同上 -->
            <p style="color: #FB0400;font-weight: 550;font-size: 16px">￥{{ orderDetail.finalPrice* orderDetail.buyNum || '待定'}}</p>
          </div>
        </div>
        <!-- 订单详情/列表=>支付页 => 非尾款-->
        <div class="price_total" v-else-if="$route.query.source == 'pay-detail' && orderDetail.orderPaymentVoList && !tailstatusPayFlag">
          <div class="total_grid">
            <p><span style="color: red" >{{orderDetail.buyNum}}</span> 件商品，总商品金额：</p>
            <p>￥{{(((orderDetail.depositPrice || 0) || (orderDetail.dueDepositPrice || 0)) + (orderDetail.officalPrice || 0) + (orderDetail.finalPrice || 0)) * orderDetail.buyNum}}</p>
            <p>定金总计：</p>
            <p>￥{{(orderDetail.depositPrice || orderDetail.dueDepositPrice) * orderDetail.buyNum || '0.00'}}</p>
            <p >官费总计：</p>
            <p>￥{{orderDetail.officalPrice * orderDetail.buyNum || '0.00'}}</p>
            <!-- <p v-else>￥0.00</p> -->
            <p style="color:#999999" v-if="!orderDetail.isDue">尾款总计(未开始)：</p>
            <p style="color:#999999" v-if="!orderDetail.isDue"> <a v-if="orderDetail.finalPrice">￥</a>{{orderDetail.finalPrice * orderDetail.buyNum || '待定'}}</p>
            <p style="font-weight: 550">应付总额：</p>
            <p style="color: red;font-weight: 550">￥{{ ((orderDetail.depositPrice || orderDetail.dueDepositPrice) + (orderDetail.officalPrice || 0)) * orderDetail.buyNum}}</p>
          </div>
          <el-checkbox v-model="read" class="agreement"><span>我已阅读并同意<a style="text-decoration:none;color: #409EFF" href="/agreement/xmjy" target="block">《卧涛交易服务协议》</a></span></el-checkbox>
          <p v-if="!hasRead && !read" class="warning-text">请阅读并勾选《卧涛交易服务协议》</p>
        </div>
        <!-- 产品详情下单=>支付页 -->
        <div :class="[$route.query.source != 'pay-detail' ? 'price_total price_totalH' : 'price_total']" v-else>
          <div class="total_grid">
            <p><span style="color: red" >{{productNum}}</span> 件商品，总商品金额：</p>
            <p>￥{{((unitDeposit || 0) + (unitFinal || 0) + (unitOfficial || 0)) * productNum }}</p>
            <p>定金总计：</p>
            <p>￥{{unitDeposit * productNum}}</p>
            <p>官费总计：</p>
            <p>￥{{ unitOfficial * productNum }}</p>
            <p style="color:#999999" v-if="!isDue">尾款总计(未开始)：</p>
            <p style="color:#999999" v-if="!isDue"><a v-if="unitFinal">￥</a>{{ unitFinal * productNum || '待定'}}</p>
            <p style="font-weight: 550">应付总额：</p>
            <p style="color: red;font-weight: 550" v-if="isDue">￥{{ ((unitDeposit || 0) + (unitFinal || 0) + (unitOfficial || 0)) * productNum }}</p>
            <p style="color: red;font-weight: 550" v-if="!isDue && $route.query.tailstatusPayFlag">￥{{ unitFinal * productNum }}</p>
            <p style="color: red;font-weight: 550" v-if="!isDue && !$route.query.tailstatusPayFlag">￥{{ (unitDeposit + unitOfficial) * productNum }}</p>
          </div>
        </div>
        <!-- 提交 -->
        <div class="submit_btn" v-if="$route.query.source == 'pay-detail' && !this.$route.query.areaSelect" @click="payType == 1 ? offlinePay() : pay()">立即支付</div>
        <div class="submit_btn" v-else @click="signOrder(baseInfo.contractScope)" >立即签约下单</div>
      </div>
    </div>
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
    <!-- 订阅消息 -->
    <focusTip></focusTip>
    
    <!-- 认证提示 -->
    <el-dialog :visible.sync="AuthenticationDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <div v-if="AuthenticationDialog" class="del-box">
      <p class="del-title">认证提醒</p>
      <img v-if="mouseOver" @mouseover="mouseOver = false" src="~/assets/images/order/guanbi_icon_dark@2x.png" />
      <img v-else @mouseleave="mouseOver = true" src="~/assets/images/order/guanbi_icon@2x.png" @click="AuthenticationDialog = false" />
      <p class="cancel-content">由于您的身份未认证，暂时无法进行签约操作</p>
      <p class="cancel-tip">为了给您提供更好的服务，请尽快完成认证</p>
      <p></p>
      <div class="del-btn">
        <div class="cancel-del-btn confirm-del-btn" @click="AuthenticationDialog = false">放弃认证</div>
        <div class="cancel-del-btn" @click="goAuthentication">去认证</div>
      </div>
    </div>
    <el-dialog :visible.sync="AuthingDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <div v-if="AuthingDialog" class="del-box">
      <p class="del-title">认证提醒</p>
      <img v-if="mouseOver" @mouseover="mouseOver = false" src="~/assets/images/order/guanbi_icon_dark@2x.png" />
      <img v-else @mouseleave="mouseOver = true" src="~/assets/images/order/guanbi_icon@2x.png" @click="AuthenticationDialog = false" />
      <p class="cancel-content">由于您的身份未认证，暂时无法进行签约操作</p>
      <p class="cancel-tip">为了给您提供更好的服务，请尽快完成认证</p>
      <p></p>
      <div class="del-btn">
        <div class="cancel-del-btn confirm-del-btn" @click="AuthingDialog = false">取消</div>
        <div class="cancel-del-btn" @click="goAuthentication">去认证</div>
      </div>
    </div>
    <!-- 签约选择-->
    <el-dialog
      :visible.sync="signDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
    <div v-if="signDialog" class="del-box">
      <p class="sign-title">选择签约方式</p>
      <i class="el-icon-close close" @click="signDialog = false" />
      <div class="change-contract">
        <el-radio v-model="signType" :label="1">电子合同</el-radio>
        <span>线上签约，安全高效省心</span>
      </div>
      <div class="change-contract">
        <el-radio v-model="signType" :label="2">纸质合同</el-radio>
        <span>面签，扫描，邮寄等流程</span>
      </div>
      <div class="sign-btn" @click="signType == 1 && (userInfo.authorizedType != 2 && userInfo.autType == 2) || (userInfo.autType == 1 && userInfo.certifiedType != 2) ? (AuthenticationDialog = true, signDialog = false) : (signDialog = false, signOrder(signType))">确认</div>
    </div>
    <!-- 纸质签约-->
    <el-dialog
      :visible.sync="paperDialog"
      width="0"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    ></el-dialog>
    <div v-if="paperDialog" class="del-box">
      <p class="sign-title">温馨提示</p>
      <div style="margin-top: 20px; text-align: center;">
        <span>您已选择纸质合同，请待业务经理上传纸质合同</span>
      </div>
      <div class="sign-btn" @click="paperDialog = false, submit()">确认</div>
    </div>
</div>
</template>

<script>
import Encrypt from '~/plugins/Encrypt'
import { getAreaList, receiveList, addAddress, submitOrder } from '~/api/member'
import { getArtcleDetail } from '@/api/announcement'
import { getInfo } from '@/api/productdetails'
import { getOrderUsrerInfo } from '~/api/order'
import  orderData from '~/pages/member/order/productOrder/order-data'
import focusTip from "@/components/order/focus-tip"
import { sign } from "~/mixins/signing-mixin";
import { saveOrder, orderPay } from "@/api/order";
export default {
  components:{ focusTip },
  mixins: [sign],
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
      coverUrl:'',
      imgUrl: process.env.CDN_BASE_URL,
      baseInfo: {}, //产品基本信息
      tradeInfo: {},
      signDialog: false,
      paperDialog: false,
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
      AuthenticationDialog: false,
      AuthingDialog: false,
      mouseOver: true,
      orderUserInfo: {},
      categoryId:'',
      siteUrl: process.env.PC_URL,
      signType: 2,
      orderDetail: {},
      productNum: '',
      payType: 1,//支付方式 0-支付宝 1-对公转账 2-微信
      read: false,
      areaList: [],//地区
      receiveList:[],//收件地址
      goverFeeType: 0,//费减类型
      policyGovfeeTypeListLength:'',
      lastTime: new Date(),
      receive:'',
      areaForm:{},
      userInfo:{},
      dialogStatus: false,
      addressDialog: false,
      isDefaultArea: false,
      hasDefault: false,
      hasRead: true,
      areaRules:{
        area:[{required: true, message:'请选择地区',trigger:'change'}],
        address:[{required: true, message:'请输入详细地址',trigger:'blur'}],
        receiverName:[{required: true, message:'请输入收件人姓名',trigger:'blur'}],
        mobilePhone:[{required: true, pattern:/^1[3456789]\d{9}$/, message:'请输入正确的手机号码',trigger:'blur'}]
      },
      productNum: 1,
      tailstatusPayFlag: false,//是否为尾款
      imgPath: process.env.CDN_BASE_URL,
      imgType:'.jpg,.png,.jpeg,.gif',
      videoType: '.mp4,.avi,.mov',
    }
  },
  computed:{
    showCoversList(){
      return this.orderDetail.coverUrls.filter((item)=>{
        return item.isCover;
      })
    },
    showWeixinBtn(){
      if(this.$route.query.source == 'pay-detail' && this.orderDetail.orderPaymentVoList && this.tailstatusPayFlag){        // 我的订单付尾款
        return  this.orderDetail.finalPrice* this.orderDetail.buyNum > 6000 ? false:true
      }else if(this.$route.query.source == 'pay-detail' && this.orderDetail.orderPaymentVoList && !this.tailstatusPayFlag){          // 我的订单付定金
        return  (this.orderDetail.depositPrice || this.orderDetail.dueDepositPrice + this.orderDetail.officalPrice) * this.orderDetail.buyNum > 6000 ? false : true
        // if(this.orderDetail.orderDetailVO.governmentFeeId > 0){
        //   return (Number(Number(this.orderDetail.orderDetailVO.governmentReduceFee) + Number(this.orderDetail.orderDetailVO.earnestMoney)) * this.orderDetail.orderDetailVO.productCount/100) > 6000 ? false:true
        // }else{
        //   return (Number(this.orderDetail.orderDetailVO.earnestMoney) * this.orderDetail.orderDetailVO.productCount/100) > 6000 ? false:true
        // }
      }else{  // 产品下单
        // if(this.policyGovfeeTypeListLength > 0){
          if(this.isDue){
            return (this.unitDeposit + this.unitOfficial )*this.productNum > 6000 ? false : true
          }else{
            if(this.$route.query.tailstatusPayFlag){
              return (this.unitDeposit + this.unitOfficial + this.unitFinal)*this.productNum > 6000 ? false : true
            }else{
              return (this.unitDeposit + this.unitOfficial )*this.productNum > 6000 ? false : true
            };
          }
        // }else{
        //   return (Number(this.orderDetail.earnestMoney)*this.productNum/100) > 6000 ? false : true
        // }
      }
    }
  },
  filters:{
    orderType(val){
      return orderData.orderType(val);
    },
    categoryType(val){
      return val == 1 ? '项目申报' : val == 2 ? '知识产权' : val == 3 ? '专利' : val == 4 ? '版权' : val == 5 ? '商标' : val == 6 ? '其他' : val == 7 ? '工商注册' : val == 8 ? '财税服务' : val == 9 ? '融资上市' : val == 10 ? '法律服务' : val == 11 ? '软件开发' : ''; 
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
    if(this.$route.query.source == 'pay-detail'){
      this.orderDetail = JSON.parse(Encrypt.decrypt(this.$route.query.data,'Y2FsdGVkX184Asts'));
      console.log(this.orderDetail);
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
  },
  methods:{
    filterType(url){
      const suffix = url.substring(url.lastIndexOf('.'),url.length).toLowerCase();
      if('jpeg|png|jpg|gif'.match(suffix)){
        return true
      }else{
        return false
      };
    },
    getConfirmOrderUserInfo(orderId){
      getOrderUsrerInfo({orderId: orderId}).then(res=>{
        this.orderUserInfo = res.data.data;
        this.$store.state.phone = this.orderUserInfo.mobile;
      })
    },
    goAuthentication(){
      if(this.$route.query.areaSelect){
        if(this.orderUserInfo.userType == 1){
          this.$router.push('/member/authentication/authentication-personal');
        }else{
          this.$router.push('/member/authentication/authentication-unit');
        };
      }else{
        sessionStorage.setItem('orderPath',this.siteUrl+this.$route.fullPath);
        this.$router.push('/member/authentication');
      };
    },
    getSpuInfo(spuId){
      getInfo({spuId: spuId}).then(res=>{
        let [coverInfo] = res.data.data.baseInfo.imageList.filter( item => {
          return item.isDefault;
        })
        this.coverUrl = coverInfo.mediaUrl && coverInfo.mediaUrl.length > 0 ? coverInfo.mediaUrl : coverInfo.imageUrl;   //视频取media 否则取image
        this.baseInfo = res.data.data.baseInfo;   //基本信息
        this.categoryId = this.baseInfo.categoryId;
        this.tradeInfo = res.data.data.tradeInfo;    //交易信息
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
        
      })
    },
    projectDetail(obj){
      getArtcleDetail(Object.assign(obj)).then((res) => {
        this.orderDetail = res.data.data.detail;
        this.policyGovfeeTypeListLength = res.data.data.detail.policyGovfeeTypeList.length;
      })
    },
    throttle(fun){
      //函数执行时的时间
      let now = new Date()
      //两次调用的时间差
      if (now - this.lastTime > 3000){
          fun()
        //调用成功，上一次调用时间值修改
          this.lastTime = now
      }
    },
    //点击签约下单
    signOrder(type) {
      switch(type) {
        case 1:
          this.signType = 1
          var param = {
            buyNum: this.productNum,
            goodsSkuId: this.skuId,
            contractType: this.signType,
            inviteCode: this.$route.query.code || null,
            orderPort: 'PC',
            orderSource: 1,   //1-自主下单；2-后台发起
            totalAmount: (this.unitDeposit + this.unitFinal + this.unitOfficial) * this.productNum
          }
          if ((this.userInfo.authorizedType == 2 && this.userInfo.autType == 2) || (this.userInfo.autType == 1 && this.userInfo.certifiedType == 2)) {
            this.throttle(() => {
              //3000ms内无论点击多少下，只会调用一次
              saveOrder(param).then(res=>{
                if(res.data.code == 0){
                  this.essAuth(res.data.data, this.userInfo, 0)
                }else{
                  this.$message({
                    type:'warning',
                    message: res.data.msg,
                  })
                }
              })
            })
          } else {
            this.AuthenticationDialog = true
          }
          break;
          
        case 2:
          this.signType = 2
          this.paperDialog = true
          break;

        case 3:
          this.signDialog = true
          break;

        default:
          break
      }
    },
    //订单提交
    submit(){
      var param = {
        buyNum: this.productNum,
        goodsSkuId: this.skuId,
        contractType: this.signType,
        inviteCode: this.$route.query.code || null,
        orderPort: 'PC',
        orderSource: 1,   //1-自主下单；2-后台发起
        totalAmount: (this.unitDeposit + this.unitFinal + this.unitOfficial) * this.productNum
      }
      this.$store.state.loading = true;//显示loading
      saveOrder(param).then(res=>{
        if(res.data.code == 0){
          setTimeout(()=>{
            this.$router.push({
              path: '/member/order',
              query:{
                orderNo: this.orderDetail.orderNo || null,
                statusValue: 1
              }
            });
          },1000)
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg,
            offset: 100
          })
        }
        this.$store.state.loading = false;//关闭loading
      })
    },
    pay(res){
      if(this.receive == ''){
        return this.$message({
          type:'warning',
          message:'为了后期方便给您提供更好的服务，请添加您的收件地址',
          offset: 80,
          duration: 2000
        })
      }
      if(!this.read && !this.tailstatusPayFlag) {
        return this.hasRead = false;
      }
      if((this.userInfo.status == 2 || this.userInfo.status == 5 || this.userInfo.status == 6) || (this.userInfo.certifiedType == 1 || this.userInfo.certifiedType == 2)){
        if(this.$route.query.source == 'pay-detail'){
          var obj = {
            payChannel: this.payType,
            addressId: this.receive,
            id: this.paymentId,
            orderPort: 'PC',
            inviteCode: this.$route.query.code || null,
          }
        }else{
          var obj = {
            orderId: res.data.data.id,
            id: res.data.data.tmOrderPayment.id,
            addressId: this.receive,
            payChannel: this.payType,
            orderPort: 'PC',
            inviteCode: this.$route.query.code || null,
          }
        }
        
        if(this.payType == 1){//线下对公
          let orderObj = {
            orderNo: res.data.data.orderNo,
            id: res.data.data.tmOrderPayment.id,
            payType: res.data.data.tmOrderPayment.payType,  //(1:定金；2:尾款；3:一口价)
            payAmount: res.data.data.tmOrderPayment.payAmount
          }
          this.offlinePay(orderObj);
        }else{
          orderPay(obj).then(response=>{
            if(response.data.code == 0){
              if(this.payType == 0){ //支付宝
                this.$router.push({
                  path:'/order/pay',
                  query:{
                    zfbData: response.data.data
                  }
                })
              };
              if(this.payType == 2){ //微信
                let codeObj = JSON.parse(response.data.data);
                this.$router.push({
                  path: '/order/wechat',
                  query: {
                    id: obj.id,
                    codeUrl: codeObj.code_url,
                    orderNo: res ? res.data.data.orderNo : this.orderDetail.orderNo,
                    totalAmount: res ? (this.isDue ? ((this.unitDeposit || 0) + (this.unitFinal || 0) + (this.unitOfficial || 0)) : (this.$route.query.tailstatusPayFlag ? (this.unitFinal || 0) : ((this.unitDeposit || 0) + (this.unitOfficial || 0))))
                    :(this.isDue ? (((this.orderDetail.dueDepositPrice || 0) + (this.orderDetail.officalPrice || 0))) : (this.tailstatusPayFlag ? (this.orderDetail.finalPrice || 0) : ((this.orderDetail.depositPrice || 0) + (this.orderDetail.officalPrice || 0))))
                }
                })
              };
            }else{
              this.$message({
                type:'warning',
                message:response.data.msg,
                offset:100,
                duration:2000
              })
              setTimeout(()=>{
                this.$router.push({
                  path:'/member/order'
                })
              },1000)
            };
          })
        }
      }else{
        this.AuthenticationDialog = true;
      };
    },
    offlinePay(obj){
      if(this.receive == ''){
        return this.$message({
          type:'warning',
          message:'为了后期方便给您提供更好的服务，请添加您的收件地址',
          offset: 80,
          duration: 2000
        })
      }
      if(!this.read && !this.tailstatusPayFlag) {
        return this.hasRead = false;
      }
      if((this.userInfo.status == 2 || this.userInfo.status == 5 || this.userInfo.status == 6)|| (this.userInfo.certifiedType == 1 || this.userInfo.certifiedType == 2)){
        this.$store.state.loading = false;//关闭loading
        this.$router.push({
          path: '/order/publicTransfer',
          query:Object.assign( {
            categoryId: this.categoryId,
            addressId: this.receive,
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
          if(this.$route.query.source == 'pay-detail' && !this.$route.query.areaSelect){
            this.receive = JSON.parse(this.orderDetail.orderAddress.sourceId);
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
@import '~/pages/index/productdetails/details.stylus'
@import '~/components/member/components/myorder/index.stylus';
.order_pay_project{
  border-bottom 1px solid #e8f5fc
  min-height 800px
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
    .order_infoH{
      height: 270px !important;
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
            margin-top 15px
            font-weight 500
            font-size 14px
            line-height 19px
          }
          .product_type :nth-child(1){
            font-weight 550
          }
          .product_name{
            width: 120px;
            margin-bottom: 10px;
            display: -webkit-box;
            overflow: hidden;
            white-space: normal !important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical
          }
          .attr{
            color: #666666;
            font-weight: 400 !important;
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
      .address{
        display grid
        grid-template-columns 90% 10%
        margin 0 30px
        .namelimit{
          display: inline-block;
          font-size 12px
          max-width 200px
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
        .area{
          height: 30px;
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
      .price_totalH{
        min-height: 150px !important;
      }
      .price_total{
        margin 10px 0
        width 416px
        min-height 225px
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