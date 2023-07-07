<template>
  <div class="order-detail">
    <special-header style="font-size: 18px; font-weight: 600" v-if="$route.query.source == 'pay-detail'" :gray="gray" :title="orderDetail.orderStatus | orderStatus" />
    <!-- <div class="order-title" v-if="orderDetail.orderStatus != 9">
      <span>{{orderDetail.orderStatus | orderStatus}}</span>
    </div> -->
    <div class="order-status" v-if="!orderDetail.refundStatus && orderDetail.orderStatus!=1">
      <div v-if="feeInfo.payStatus == 1">
        <img src="~/assets/images/member/shenhe@2x.png" />
        <p class="reason-title">对公转账审核中{{orderDetail.orderStatus==2 ? '(尾款)' : '(定金)'}}</p>
      </div>
      <div v-if="feeInfo.payStatus == 3">
        <img src="~/assets/images/member/cuowu@2x.png" />
        <p class="reason-title">对公转账审核未通过</p>
        <p class="reason-content">未通过原因：{{auditMessage}}</p>
      </div>      
      <div v-if="orderDetail.tailStatus == 1 && orderDetail.orderStatus==2" class="prompt-box">
        <div v-if="feeInfo.payStatus == 0||feeInfo.payStatus == 3">
          <span class="warning">!</span>
          <span>您的尾款未支付，请尽快支付! </span>
        </div>
      </div>
      <div v-if="orderDetail.orderStatus==1" class="prompt-box">
        <span class="warning">!</span>
        <span v-if="orderDetail.contractType == 2">待纸质合同上传中 </span>
        <span v-else>为了更好地保障您的权益，请您签订合同！</span>
      </div>
    </div>
    <!-- 进度条 -->
    <div class="steps" v-if="timeData">
      <div class="step-status">
        <img src="~assets/images/order/tijiao_icon@2x.png" v-if="timeData.orderTime" />
        <img src="~assets/images/order/tijiao_icon_cancel@2x.png" v-else/>
        <p :class="[timeData.orderTime?'step-now':'','time-title']">提交订单</p>
        <p class="time">{{timeData.orderTime}}</p>
      </div>
      <div :class=" timeData.orderTime ? 'line active-line' : 'line'"></div>
      <div class="step-status">
        <img src="~assets/images/order/tijiao_icon@2x.png" v-if="timeData.payTime" />
        <img src="~assets/images/order/wait_icon_light@2x.png" v-else-if="timeData.orderTime" />
        <img src="~assets/images/order/wait_icon@2x.png" v-else />
        <p :class="[timeData.payTime?'step-now':'','time-title']">支付订单</p>
        <p class="time">{{timeData.payTime}}</p>
      </div>
      <div :class=" timeData.payTime ? 'line active-line' : 'line'"></div>
      <div class="step-status">
        <img src="~assets/images/order/tijiao_icon@2x.png" v-if="timeData.contractTime" />
        <img src="~assets/images/order/wait_icon_light@2x.png" v-else-if="timeData.payTime" />
        <img src="~assets/images/order/wait_icon@2x.png" v-else />
        <p :class="[timeData.signTime?'step-now':'','time-title']">{{timeData.contractTime?'已签约':'待签约'}}</p>
        <p class="time">{{timeData.signTime}}</p>
      </div>
      <div :class=" timeData.signTime ? 'line active-line' : 'line'"></div>
      <div class="step-status">
        <img src="~assets/images/order/tijiao_icon@2x.png" v-if="timeData.completedTime" />
        <img src="~assets/images/order/wait_icon_light@2x.png" v-else-if="timeData.contractTime" />
        <img src="~assets/images/order/wait_icon@2x.png" v-else />
        <p :class="[timeData.completedTime || timeData.contractTime ?'step-now':'','time-title']">服务中</p>
        <p class="time">{{timeData.contractTime}}</p>
      </div>
      <div :class=" timeData.completedTime ? 'line active-line' : 'line'"></div>
      <div class="step-status">
        <img src="~assets/images/order/tijiao_icon@2x.png" v-if="timeData.completedTime" />
        <img src="~assets/images/order/wait_icon@2x.png" v-else />
        <p :class="[timeData.completedTime ?'step-now':'','time-title']">服务完成</p>
        <p class="time">{{timeData.completedTime}}</p>
      </div>
    </div>
    <div class="address" v-if="orderDetail.orderAddress">
      <p class="address-title">收件地址</p>
      <div class="receiver">
        <img src="~/assets/images/order/dgzz@2x.png" />
        <div>
          <div style="display: flex;">
            <p class="namelimit name">{{receiveAddress.receiverName}}</p>
            <p class="namelimit">{{receiveAddress.mobilePhoneNumber}}</p>
            <!-- <p v-if="receiveAddress.isDefault == 1" class="default">默认</p> -->
          </div>
          <p class="area">{{detailArea+receiveAddress.detailAddress}}</p>
        </div>
      </div>
    </div>
    <!-- 产品信息 -->
    <div class="order-info">
      <p class="pay-time">下单时间：{{orderDetail.createTime}}</p>
      <!-- 1-专利，2-商标，3-版权，4-其他 -->
      <div class="info" @click="toProduct(orderDetail)">
        <!-- <div v-if="orderDetail.orderType == 0">
          <img v-if="orderDetail.orderDetailVO.productSubType ==1" src="~/assets/images/order/pic_zl@2x.png" />
          <img v-if="orderDetail.orderDetailVO.productSubType ==2" src="~/assets/images/order/pic_sb@2x.png" />
          <img v-if="orderDetail.orderDetailVO.productSubType ==3" src="~/assets/images/order/pic_bq@2x.png" />
          <img v-if="orderDetail.orderDetailVO.productSubType ==4" src="~/assets/images/order/pic_qt@2x.png" />
        </div> -->
          <img :src="imgUrl + orderDetail.url" />
        <div >
          <p class="product-name">{{orderDetail.spuName}}</p>
          <p class="product-type">{{orderDetail.spec}}</p>
          <p class="product-type">类型：{{orderDetail.categoryName}}</p>
        </div>
        <div>
          <!-- <div v-if="orderDetail.orderType == 0">
            <p v-if="orderDetail.orderDetailVO.feeType == 2" class="price" >￥{{orderDetail.totalAmount/orderDetail.buyNum}}</p>
            <p class="price" v-else>￥{{orderDetail.orderDetailVO.feeType == 2 ? 0 : orderDetail.orderDetailVO.nowFee/100}}</p>
          </div> -->
          <p class="price">￥{{orderDetail.totalAmount}}</p>
          <p class="product-num">x {{orderDetail.buyNum}}</p>
        </div>
      </div>
      <!-- <div class="price-num" v-if="orderDetail.orderDetailVO && orderDetail.orderType == 0">
        <p>订单编号</p>
        <p>{{orderDetail.orderNo}}</p>
        <p v-if="orderDetail.orderDetailVO.feeType != 2">服务费</p>
        <p v-if="orderDetail.orderDetailVO.feeType != 2">￥{{orderDetail.orderDetailVO.nowFee/100}}</p>
        <p v-if="orderDetail.orderDetailVO.feeType == 2 || orderDetail.orderDetailVO.governmentFeeId >= 0">官费</p>
        <p v-if="orderDetail.orderDetailVO.feeType == 2">￥{{orderDetail.orderDetailVO.governmentFee/100}}</p>
        <p v-else-if="orderDetail.orderDetailVO.governmentFeeId >= 0">￥{{orderDetail.orderDetailVO.governmentReduceFee/100}}</p>
        <p>购买数量</p>
        <p>x {{orderDetail.orderDetailVO.productCount}}</p>
      </div> -->
      <div class="project-info">
        <div class="order-no">
          <p>订单编号</p>
          <span>{{orderDetail.orderNo}}</span>
        </div>
        <p class="service-title" v-if="!feeInfo.isDue">服务费</p>
        <div class="fee" v-if="feeInfo.isDue">
          <div class="fee-item">
          <p class="fee-item">服务费</p>
          <p class="fee-item" v-if="feeInfo.hasOffical">官费</p>
          </div>
          <div>
            <p class="fee-item fee-price">￥{{feeInfo.dueDeposit}}</p>
            <p class="fee-item fee-price" v-if="feeInfo.hasOffical">￥{{feeInfo.offical}}</p>
          </div>
          
        </div>
        <div v-else>
          <div class="pay-progress">
          <div>
            <img :src="orderDetail.orderStatus == 0 ? require('~/assets/images/order/yifu_icon@2x.png') : require('~/assets/images/order/weifu_icon@2x.png')" :class="orderDetail.orderStatus == 0 ? 'bright-img' : 'dark-img'" />
            <div class="pay-line"></div>  
            <img :src="orderDetail.orderStatus==2 && orderDetail.tailStatus == 1 || orderDetail.orderStatus==3 && orderDetail.tailStatus == 1 ? require('~/assets/images/order/yifu_icon@2x.png') : require('~/assets/images/order/weifu_icon@2x.png')" :class="orderDetail.orderStatus==2 && orderDetail.tailStatus == 1 || orderDetail.orderStatus==3 && orderDetail.tailStatus == 1 ? 'bright-img' : 'dark-img'" />
          </div>
          <div class="service-fee">
            <p :class="orderDetail.orderStatus == 0 ? 'bright-fee' : 'dark-fee'">定金 ￥{{ feeInfo.deposit}}</p>
            <p :class="orderDetail.orderStatus==2 && orderDetail.tailStatus == 1 || orderDetail.orderStatus==3 && orderDetail.tailStatus == 1 ? 'final-fee bright-fee' : 'final-fee dark-fee'">尾款 ￥{{orderDetail.tailStatus == 0 ? '待定' : feeInfo.tailPrice}}</p>
          </div>
          <div class="pay-status">
            <p :class="orderDetail.orderStatus == 0 ? 'bright-fee' : 'dark-fee'">{{orderDetail.orderStatus > 0 ? '已付款' : '待付款'}}</p>
            <p :class="orderDetail.orderStatus==2 && orderDetail.tailStatus == 1 || orderDetail.orderStatus==3 && orderDetail.tailStatus == 1 ? 'final-fee bright-fee' : 'final-fee dark-fee'">{{orderDetail.tailStatus==2?'已付款': orderDetail.tailStatus==1?'待付款':'待开始'}}</p>
          </div>
        </div>
          <div class="unit-price" style="margin-top: 10px" v-if="feeInfo.hasOffical">
            <p :class="feeInfo.payType==1 && orderDetail.orderStatus==0 ? 'bright-fee' : 'dark-fee'">官费 
              <span :class="feeInfo.payType==1 && orderDetail.orderStatus==0 ? 'bright-fee' : 'dark-fee'">￥{{feeInfo.offical}}</span>
            </p>
            <p :class="orderDetail.orderStatus == 0 ? 'bright-fee' : 'dark-fee'">{{orderDetail.orderStatus > 0 ? '已付款' : '待付款'}}</p>
          </div>
        </div>
        
        <div class="count">
          <span>购买数量</span>
          <span class="num">{{orderDetail.buyNum}}</span>
        </div>
      </div>
      <div v-if="orderDetail.orderStatus == 0" class="unit-price project-amount">
        <p>{{feeInfo.isDue?'服务费总计':'定金总计'}}</p>
        <p>￥{{feeInfo.isDue?feeInfo.dueDeposit*orderDetail.buyNum:feeInfo.deposit*orderDetail.buyNum}}</p>
        <p v-if="feeInfo.hasOffical">官费总计</p>
        <p v-if="feeInfo.hasOffical">￥{{feeInfo.offical*orderDetail.buyNum}}</p>
        <p class="need-pay" v-if="orderDetail.orderStatus == 0">本次应付款</p>
        <p class="need-pay" v-else-if="orderDetail.orderStatus==2 && orderDetail.tailStatus == 1 || orderDetail.orderStatus==3 && orderDetail.tailStatus == 1">本次应支付尾款</p>
        <p class="need-pay" v-else-if="orderDetail.orderStatus>=2 && orderDetail.tailStatus == 2 || orderDetail.orderStatus>=4">实付款</p>
        <p class="need-pay" v-else>已付</p>
        <p v-if="orderDetail.orderStatus==2 && orderDetail.tailStatus == 1 || orderDetail.orderStatus==3 && orderDetail.tailStatus == 1" class="bright-fee">￥{{feeInfo.tailPrice*orderDetail.buyNum}}</p>
        <p v-else-if="feeInfo.isDue||orderDetail.orderStatus>=2 && orderDetail.tailStatus == 2 || orderDetail.orderStatus>=4" class="bright-fee">￥{{orderDetail.totalAmount}}</p>
        <p v-else class="bright-fee">￥{{feeInfo.depositShould}}</p>
      </div>
      <!-- <div class="task-info" v-if="taskList.length == 1">
        <div class="deliverable">
          <p>任务编号</p>
          <p>{{taskList[0].taskNo}}</p>
          <p>交 &nbsp;付&nbsp; 物</p>
          <p>{{taskList[0].deliverableName ? taskList[0].deliverableName : '/'}}</p>
        </div>
        <div v-if="taskList[0].taskStatus == 0" class="task-status"><p class="round"></p><p class="apply-btn" @click="progress(taskList[0],1)">待开始</p></div>
        <div v-else class="task-status" @click="progress(taskList[0], 0)"><p class="round"></p><p class="schedule">{{taskList[0].workflowName}}</p></div>
      </div> -->
      <!-- <p class="amount" v-if="orderDetail.orderDetailVO && orderDetail.orderType == 0">
        <span style="font-weight:550;" v-if="'0,2,4,9'.match(orderDetail.orderStatus)">已付:</span>
        <span style="font-weight:550;" v-else>应付:</span>
        <span style="color:#FF6D27;">￥{{orderDetail.totalAmount/100}}</span>
      </p> -->
      <!-- <div class="refund" v-if="orderDetail.tailStatus == 0 || orderDetail.tailStatus == 1">
        <p class="viewcontract"  v-if="orderDetail.attachmentUrl&&orderDetail.attachmentUrl!==''" @click="goviewcontract">查看合同</p>
        <p v-if="!orderDetail.refundStatus" @click="goRefundDetail(orderDetail,0)">申请退款</p>
        <p v-if="orderDetail.refundStatus" class="cur" @click="goRefundDetail(orderDetail,1)">{{orderDetail.refundStatus | refundStatus}}</p>
        <p class="invoice">申请开票</p>
      </div> -->
      <div class="viewcontract" v-if="'2,3,4'.match(orderDetail.orderStatus) && orderDetail.contractFileName">
        <span @click="goviewcontract">查看合同</span>
      </div>
    </div>
    <div class="task" v-if="taskList">
      <p class="task-label">任务信息</p>
      <div class="task-info" v-for="item in taskList" :key="item.id">
        <div class="deliverable">
          <p>任务编号</p>
          <p>{{item.taskNo}}</p>
          <p>交 &nbsp;付&nbsp; 物</p>
          <p>{{item.deliveryName ? item.deliveryName : '/'}}</p>
        </div>
        <div v-if="item.taskStatus == 0" class="task-status" style="taxt-align:right"><p class="round"></p><p class="apply-btn" @click="progress(item,1)">待开始</p></div>
        <div v-else class="task-status" @click="progress(item, 0)"><p class="round"></p><p class="schedule">{{item.stepName}}</p></div>
      </div>
      <div class="more-task" v-if="orderDetail.tmOrderTaskVoList && orderDetail.tmOrderTaskVoList.length > 3">
        <p class="down" v-if="showTotal < orderDetail.tmOrderTaskVoList.length" @click="showMore()">查看更多 <img src="~/assets/images/order/down@2x.png" /></p>
        <p class="up" v-if="showTotal >= orderDetail.tmOrderTaskVoList.length" @click="pickUp()" >收起 <img src="~/assets/images/order/up@2x.png" /></p>
      </div>
    </div>
    <!-- 操作栏 -->
    <div class="pay-btn" v-if="orderDetail.orderStatus != 5">
      <div :class="['operate','0,2,4'.match(orderDetail.orderStatus) && orderDetail.orderType == 0?'':'backgroudwhite','0,2,4,6,7,8,9'.match(orderDetail.orderStatus) && orderDetail.orderType == 1?'backgroudwhite':'']" >
        <p></p>
        <p class="bt-cancle" v-if="orderDetail.orderStatus == 0 && feeInfo.payType != 2 && feeInfo.payStatus != 1" @click="updateStatus(orderDetail, 6, '取消')">取消订单</p>
        <p v-else></p>
        <p class="bt-cancle" v-if="orderDetail.orderStatus == 6" @click="updateStatus(orderDetail, 7, '删除')">删除订单</p>
        <p class="bt-pay" :class="feeInfo.payStatus == 1 ? 'bt-pay pay-order-cancel' : 'bt-pay'" v-if="orderDetail.orderStatus == 0" @click="feeInfo.payStatus == 1 ? '' : toPay(orderDetail)">立即支付</p>   
        <p :class="feeInfo.payStatus == 1 ? 'bt-pay pay-order-cancel' : 'bt-pay'" v-if="orderDetail.orderStatus==2 && orderDetail.tailStatus == 1 || orderDetail.orderStatus==3 && orderDetail.tailStatus == 1" @click="feeInfo.payStatus == 1 ? '' : toPay(orderDetail,true)">付尾款</p>  
        <span class="bt-pay"  v-if="orderDetail.orderStatus == 1" @click="goSigncontract(orderDetail)" >
          去签约({{orderDetail.contractType == 1 ? '电子' : '纸质' }})</span>      
      </div>
    </div>
    <!-- 遮罩层 -->
    <el-dialog :visible.sync="commonDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <!-- 取消/删除 -->
    <div v-if="delDialog" class="del-box">
      <p class="del-title">{{title}}订单</p>
      <img src="~/assets/images/order/close_icon@2x.png" @click="delDialog = false,commonDialog = false" />
      <p class="del-content">订单{{title}}后无法恢复，是否确认{{title}}?</p>
      <div class="del-btn" >
        <div class="cancel-del-btn" @click="delDialog = false,commonDialog = false">再想想</div>
        <div class="cancel-del-btn confirm-del-btn" @click="updateOrderStatus(orderDetail,delStatus,title)">提交</div>
      </div>
    </div>
    <!--授权提醒-->
    <el-dialog :visible.sync="essAuthDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <div v-if="essAuthDialog" class="dialog">
      <div>签约提示</div>
      <div style="margin: 5px;">由于您首次使用签约功能，需要完成签约授权，请先去授权再来签约吧~</div>
      <div>
        <el-button @click="essAuthDialog = false">取消</el-button>
        <el-button type="primary" @click="toAuth">去认证</el-button>
      </div>
    </div>

    <!-- 签约方式选择 -->
    <el-dialog :visible.sync="signDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <div v-if="signDialog" class="dialog">
        <div>选择签约方式</div>
        <div>
            <el-radio v-model="signType" :label="1">电子合同</el-radio>
            <span @click="signType = 1">线上签约，安全高效省心</span>
        </div>
        <div style="margin-bottom: 10px">
            <el-radio v-model="signType" :label="2">纸质合同</el-radio>
            <span @click="signType = 2">面签，扫描，邮寄等流程</span>
        </div>
        <el-button @click="signDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSign">确认</el-button>
    </div>
  </div>
</template>

<script>
import { getOrderDetail, getOrderTime, getTaskProcessList, updateOrder, getTaskByTaskNo, getEssAuthStatus, signSelf, changeContractType, } from '@/api/order'
import { getProvince1 } from "@/api/user";
import orderData from './order-data'
import specialHeader from '~/components/common/specialHeader'
import Encrypt from '~/plugins/Encrypt'
export default {
  components: {
    specialHeader
  },
  head() {
    return {
      title: '我的订单',
      meta: [
        { name: 'keywords', content: '我的订单' },
        {
          hid: 'description',
          name: 'description',
          content:'我的订单'
        }
      ]
    }
  },
  data(){
    return {
      orderId:'',
      orderDetail:{},
      taskList:[],
      payList:[],
      receiveAddress:'',
      timeData:{},
      commonDialog: false,
      delDialog: false,
      title: '',
      gray:true,
      delStatus: '',
      showTotal: 3,//默认展示任务数
      num: 0,
      orderCount: 0,
      detailArea: '',
      feeInfo: JSON.parse(this.$route.query.feeInfo),
      imgType:'.jpg,.png,.jpeg,.gif',
      videoType: '.mp4,.avi,.mov',
      orderStatus:'',
      imgUrl: process.env.CDN_BASE_URL,
      userInfo:{},
      auditMessage: '',
      signDialog:false,
      signType: 1,
      essAuthDialog: false,
      signInfo: {},
      statisticsList: [],
    }
  },
  filters:{
    orderStatus(val){
      return orderData.orderStatus(val);
    },    
    orderType(val){
      return orderData.orderType(val);
    },
     refundStatus(val){
      return orderData.refundStatus(val);
    }
  },
  computed:{
    statusFilter(){
      return orderData.orderStatus(this.orderDetail.orderStatus);
    },
    reAuthFilter(){
      return orderData.orderStatus(this.orderDetail.orderStatus);
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.goback, false);
  },
  mounted(){
    if(window.history && window.history.pushState){
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goback, false);
    }
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo){
      this.orderId = this.$route.query.id;
      this.getDetail();
    }else{
      this.$router.push({path:'/login'});
    };
  },
  methods:{
    goSigncontract(row) {
      if (this.userInfo.status != 2 && this.userInfo.status != 5) {
        this.$store.state.authDialog = true;
      } else {
        if (row.contractScope == 3) {
          this.signInfo = row;
          this.signType = row.contractType;
          this.signDialog = true;
        } else if (row.contractScope == 1) {
          getEssAuthStatus().then((res) => {
            if (res.code == 0) {
              if ("0,4".match(res.data.status)) {
                this.signDialog = false;
                this.essAuthDialog = true;
              } else if ("1,3".match(res.data.status)) {
                this.signDialog = false;
              } else {
                let param = {
                  orderId: row.id,
                  returnUrl: process.env.PC_URL + "/member/order",
                };
                signSelf(param).then((res) => {
                  if (res.code == 0) {
                    window.open(res.data, "_self");
                  } else {
                    this.$message({
                      type: "warning",
                      message: res.msg,
                      offset: 100,
                    });
                  }
                });
              }
            }
          });
        } else if (row.contractScope == 2) {
          let param = {
            id: row.id,
            contractType: 2,
          };
          changeContractType(param).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "后台正在处理您的纸质合同，请耐心等待~",
              });
            } else {
              this.$message({
                type: "error",
                message: res.msg,
                offset: 100,
              });
            }
          });
        }
      }
    },
    handleSign() {
      if (this.signType == 1) {
        getEssAuthStatus().then((res) => {
          if (res.code == 0) {
            if ("0,4".match(res.data.status)) {
              this.signDialog = false;
              this.essAuthDialog = true;
            } else if ("1,3".match(res.data.status)) {
              this.signDialog = false;
            } else {
              let param = {
                orderId: this.signInfo.id,
                returnUrl: process.env.PC_URL + "/member/order",
              };
              signSelf(param).then((res) => {
                if (res.code == 0) {
                  window.open(res.data, "_self");
                } else {
                  this.$message({
                    type: "warning",
                    message: res.msg,
                    offset: 100,
                  });
                }
              });
            }
          }
        });
      } else {
        let param = {
          id: this.signInfo.id,
          contractType: this.signType,
        };
        changeContractType(param).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "修改签约方式成功！",
            });
            this.signDialog = false;
            this.getStatistics();
            this.getDetail();
          }
        });
      }
    },
    goviewcontract(){
      console.log(this.orderDetail);
        window.open(this.imgUrl+this.orderDetail.contractFileUrl)
    },
    toAuth(){
      this.$router.push({
        path:'/member/authentication'
      })
    },
    progress(item, toStart){
      this.$router.push({
        path: '/order/order-task-progress',
        query:{
          toStart: toStart,
          item: JSON.stringify(item)
        }
      })
    },
    toProduct(item){
      this.$router.push({
        path:'/productdetails/details?spuId='+item.spuId
      })
    },
    showMore(){
      this.num++
      this.showTotal = 10*this.num;
    },
    pickUp(){
      this.showTotal = 3;
      this.num = 0;
    },
    updateStatus(row, status, title){
      this.title = title;
      this.orderDetail = row;
      this.delStatus = status;
      this.commonDialog = true;
      this.delDialog = true;
    },
    updateOrderStatus(row, status, title){
      let param = {
        id: row.id,
        orderStatus: status,
        // accountId: this.userInfo.userId,
        // orderNo: row.orderNo,
        // productName: row.orderDetailVO.productName
      };
      if(status == 6 || status == 7){
        updateOrder(param).then(res=>{
          if(res.code == 0){
            this.$message({
              type:'success',
              message:title+'订单成功！',
              offset: 80,
              duration: 2000
            })
            if (status == 7) {
              this.$router.push({
                path:'/member/order'
              })
            } else {
              this.delDialog = false;
              this.commonDialog = false;
              this.getDetail();
            }
            
          }else{

          };
        })
      }else{
        updateOrder(param).then(res=>{
          if(res.code == 0){
            this.$message({
              type:'success',
              message:'订单状态修改成功！',
              offset: 80,
              duration: 2000
            })
            this.getDetail();
          }else{

          };
        })
      };
    },
    toPay(row,tailstatusPayFlag){
      console.log(row);
      /* 加密 */
      var encrypt = Encrypt.encrypt(JSON.stringify(row),'Y2FsdGVkX184Asts');//密钥自定义 加密解密时保持一致即可
      if(tailstatusPayFlag && (this.userInfo.status != 2 && this.userInfo.status != 5)){
        this.$store.state.authDialog = true;
      }else{
        this.$router.push({
          path: '/order/order-pay',
          query:{
            pageFrom: 0,
            // pathUrl: this.$route.path,
            tailstatusPayFlag: tailstatusPayFlag,//true 尾款
            // fullPath: this.$route.fullPath,
            source: 'pay-list',
            data: encrypt,
            feeInfo: this.$route.query.feeInfo
          }
        })
      };
    },
    goback(){
      history.pushState(null, null, document.URL);
      this.$router.push({
        path:'/member/order',
        query:{
          status:this.$route.query.status,
          currentPage: this.$route.query.currentPage
        }
      })
    },
    getDetail(){
      getOrderDetail({id: this.$route.query.id}).then(res=>{
        if(res.data.orderStatus == 8){
          this.$router.push({
            path:'/member/order',
            query:{
              status:this.$route.query.status
            }
          })
        }else{
          this.orderDetail = res.data;
          this.taskList = res.data.tmOrderTaskVoList;
          this.payList = res.data.orderPaymentVoList;
          this.orderCount = 100;
          this.receiveAddress = res.data.orderAddress;
          getOrderTime({orderId: this.orderDetail.id}).then(res=>{
            if (res.code = 1000) {
              this.timeData = res.data;
            }
          })
          getTaskByTaskNo({tradeNo: this.feeInfo.tradeNoDeposit}).then(res => {
            if (res.code == 0) {
              this.auditMessage = res.data.auditMessage
              console.log(res.data);
            }
          })
        };
      });
      getProvince1().then(res => {
        if (res.code == 0) {
          let area = []
          res.data.forEach(item => {
            if (this.receiveAddress.areaNo.includes(item.id)) {
              area.push(item.areaName)
              item.children.forEach(item => {
                if (this.receiveAddress.areaNo.includes(item.id)) {
                  area.push(item.areaName)
                  item.children.forEach(item => {
                    if (this.receiveAddress.areaNo.includes(item.id)) {
                      area.push(item.areaName)
                    }
                  })
                }
              })
            }
          });
          this.detailArea = area.join('')
          console.log(this.detailArea);
        }
      })
    },
    goRefundDetail(orderDetail,check){
        if(check==0){
           let routerUrl = this.$router.resolve({
                path: '/refund/refund-apply',
                query:{
                    id:orderDetail.id
                }
           })
           window.open(routerUrl.href,'_self')
        }else{
           // 退款详情
           let routerUrl = this.$router.resolve({
                path: '/refund/refund-apply',
                query:{
                    id:orderDetail.id,
                    taskNo:orderDetail.taskNo,
                    orderNo:orderDetail.orderNo
                }
           })
           window.open(routerUrl.href,'_self')
        }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~assets/css/order/orderDetail.styl'
</style>