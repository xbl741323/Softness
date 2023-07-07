<template>
  <div class="aaa">
    <div class="contracts">
      <div class="details">
        <div class="top-detail">
          <div class="processnumber flex-left">
            <img
              src="../../assets/images/process/liucheng_icon.png"
              style="width: 24px; height: 24px; position: relative; top: 5px"
            />
            <span style="margin-left: 8px; font-weight: 600">流程编号：{{ refundInfo.refundNo }}</span>
            <p class="refund-status">
              <span
                v-show="[1,2,].includes(refundInfo.refundStatus)"
                class="circleBluec"
              ></span>
              <span
                v-show="refundInfo.refundStatus == 4"
                class="successc"
                ><b>✔</b></span
              >
              <span
                v-show="refundInfo.refundStatus == -2"
                class="circleRedc"
              ></span>
              <span class="refund-status-txt">{{ refundInfo.refundStatus | remarkStatus }}
              </span>
            </p>
            <span class="order-noo">
              &nbsp;<img class="person" src="@/assets/images/refund/clueman.png" width="24px" height="22px" />
              <span :class="refundInfo.refundStep>=1?'txt-ing':'txt-ever'">客户提交退款申请</span>              
            </span>
            <span :class="[refundInfo.refundStep>=1?'line-ing':'line-ever','belong']"></span>
            <span class="order-noo">
              &nbsp;<img class="persontwo" src="@/assets/images/refund/salesman.png" width="24px" height="22px" />
              <span :class="refundInfo.refundStep>=1?'txt-ing':'txt-ever'">业务员审核</span>              
            </span>
            <span  :class="[refundInfo.refundStep>=2?'line-ing':'line-ever','belong']"></span>
            <span class="order-noo">
              &nbsp;<img class="persontwo" src="@/assets/images/refund/salesman.png" width="24px" height="22px" />
              <span :class="refundInfo.refundStep>=2?'txt-ing':'txt-ever'">工程师审核</span>              
            </span>
            <span class="belong" :class="[refundInfo.refundStep>=3?'line-ing':'line-ever','belong']"></span>
            <span class="order-noo">
              &nbsp;<img class="persontwo" src="@/assets/images/refund/salesman.png" width="24px" height="22px" />
              <span :class="refundInfo.refundStep>=3?'txt-ing':'txt-ever'">部门负责人审核</span>              
            </span>     
            <span class="belong" :class="[refundInfo.refundStep>=4?'line-ing':'line-ever','belong']"></span>
            <span class="order-noo">
              &nbsp;<img class="persontwo" src="@/assets/images/refund/salesman.png" width="24px" height="22px" />
              <span :class="refundInfo.refundStep>=4?'txt-ing':'txt-ever'">财务审核</span>              
            </span>            
          </div>
          <!-- 退款信息 -->
          <refund-online :refundInfo="refundInfo"/>
        </div>
      
        <el-tabs type="border-card" v-model="tabActive">
          <el-tab-pane label="订单及退款信息" name="2">
            <!-- 线上 -->
            <refund-orderinfo  :orderArray="orderInfo" />
            <refund-orderpay :payInfo="feeInfo" :handlers="handlers" :orderType="refundInfo.orderType" />
          </el-tab-pane>
          <el-tab-pane label="任务信息" name="3" v-if="taskInfo">
            <refund-taskinfo :taskInfo="taskInfo"/>
          </el-tab-pane>
          <el-tab-pane label="审核记录" name="4">
            <refund-onlineauditrecords :recordData="onlineAuditInfo"/>
          </el-tab-pane>
        </el-tabs>

        <!-- 审批操作 -->
        <div class="examine" v-if="snapshotInformation.taskStatus == 0">
          <div class="list-header">
            <p class="rectangle"></p>
            <b class="text">审批</b>
          </div>
          <div class="examine-content">
            <p>审批意见：</p>
            <el-input type="textarea" placeholder="请输入内容" v-model="textarea" maxlength="100" show-word-limit clearable rows="4"></el-input>
            <div class="button">
              <el-button type="success" size="medium" v-preventReClick @click="permissions.bt_refund_detail || isPersonal ? handleOn() : $notAuthorized()">{{ $t("button.auditingPassed") }}</el-button>
              <el-button type="danger" size="medium" class="unpassed" v-preventReClick @click="permissions.bt_refund_detail || isPersonal ? handleOff() : $notAuthorized()">{{ $t("button.auditingUnPassed") }}</el-button>
            </div>
          </div>
        </div>
        <!-- 验证码操作 -->
        <el-dialog title="身份验证" :visible.sync="centerDialogVisible" :close-on-click-modal="false" center width="420px" height="380px">
          <div style="display: flex">
            <el-input v-model="code" placeholder="请输入验证码"></el-input>
            <el-button class="achievecode" :class="{ ccc: codeDisabled == true }" :disabled="codeDisabled" @click="getCode">{{ btnCode }}</el-button>
          </div>
          <div style="margin-top: 15px; color: #333333a1">
            请输入尾号为{{ showMobile }}的手机号收到的验证码
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit" :disabled="!code" v-preventReClick>确 定</el-button>
            <el-button @click="centerDialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
        <handle ref="handles" v-if="show" :handlers="handlers" :refundInfo="refundInfo" :feeInfo="feeInfo" :taskInfo="taskInfo"></handle>
        <!-- :froms="refundFrom" -->
      </div>
    </div>
  </div>
</template>

<script>
import orderData from '../order/order-data'
import {
  getDetailInfoByRefundId,
  getRefundFeeByRefundId,
  getRefundTaskByRefundId,
  listTmOrderTaskByOrderId,
  audit,
  sendCode,
  auditFail,
  getMobile,
} from "@/api/processmanage/refund";
import { auditLog } from "@/api/contracts/contracts";
import refundData from './refund'
import RefundOrderinfo from './refund-info/refund-orderinfo.vue';
import RefundReceiveinfo from './refund-info/refund-receiveinfo.vue';
import RefundTaskinfo from './refund-info/refund-taskinfo.vue';
import RefundOrderpay from './refund-info/refund-orderpay.vue';
import RefundAuditrecords from './refund-info/refund-auditrecords.vue';
import handle from './dialogContent';
import RefundOffline from './refund-info/refund-offline.vue';
import RefundOnline from './refund-info/refund-online.vue';
import RefundOnlineauditrecords from './refund-info/refund-onlineauditrecords.vue';
import { mapGetters } from 'vuex';
export default {
  components: {
    RefundOrderinfo,
    RefundReceiveinfo,
    RefundTaskinfo,
    RefundOrderpay,
    RefundAuditrecords,
    handle,
    RefundOffline,
    RefundOnline,
    RefundOnlineauditrecords
  },
  data() {
    return {
      tabActive: '2',
      encodeTaskNo: null,
      num: 60,
      btnCode: "获取验证码",
      codeDisabled: false,
      code: null,
      centerDialogVisible: false,
      snapshotInformation: {},
      customerInfo: {},
      orderArray: [],
      refundArray: [],
      recordData: [],
      payInfo:[],
      handleTitle:'',
      textarea: "",
      currentUserId: null,
      showMobile: null,
      refundInfo:{},
      orderInfo:[],//线上退款订单信息
      feeInfo:[],//线上退款费用信息
      taskInfo:[],
      onlineAuditInfo:[],//审核记录
      handlers:null,
      orderId:'',
      show: false,
      recordShow: false,
      taskShow: false,
      orderShow: false,
      isPersonal: this.$route.query.source == 'personal'
    };
  },
  filters:{
    remarkStatus(val) {
      return refundData.refundStatus(val);
    },
  },
  mounted() {
    this.getDetail();
  },

  methods: {        
    getDetail(val) {
      this.recordShow = false;
      this.taskShow = false;      
      //获取订单详情信息      
      getDetailInfoByRefundId(this.$route.query.id,this.$route.query.from).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          let data = res.data.data;
          data.ttRefundFeeList = refundData.doubleUniqueArr(data.ttRefundFeeList,'costTypeId','payTypeId');
          data.tmRefundApprovalList = refundData.uniqueArr(data.tmRefundApprovalList,'handleByNo');
          this.refundInfo = data;
          this.handlers = data;
          // 判断是否全退、部分全退、部分退
          if(data.totalAmount == data.refundAmount){
            this.$set(this.handlers,'allInRefund',true)
          } else {
            if(data.totalAmount/data.buyNum == data.refundAmount/data.refundNum){
              this.$set(this.handlers,'depart-allIn',true)
            } else {
              this.$set(this.handlers,'depart-allIn',false)
            }
          }
          // 退款业务员操作根据订单id获取任务信息  
          if(data.refundStep == 1){
            listTmOrderTaskByOrderId(data.orderId).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                  let data = res.data.data;
                  data.forEach(element => {
                      this.$set(element,'able',true)                
                  });                    
                  if(data.length > 0 ) {
                      this.$set(this.handlers,'hasTask',true)
                      this.$set(this.handlers,'taskData',data)
                  } else {
                      this.$set(this.handlers,'hasTask',false)
                  }
                }
            });
          }  
          // 设置费用信息
          let list = {};
          let payI = {};
          data.ttOrderFeeVoList.forEach( i=>{
            // 订单信息所需费用
            if(i.costType==3){
              this.$set(list,'governmentFee',i.price)
            } else {
              this.$set(list,'costType'+ i.costType+'payType'+i.payType,i.price)              
            }
            // 业务员处理弹框所需费用
            if(i.payStatus == 2){
              if(i.costType == 3){
                this.$set(payI,'governmentFee',i.price)
              } else {
                this.$set(payI,'costType'+ i.costType+'payType'+i.payType,i.price)
              }
            } 
          });          
          let payments = refundData.uniqueArr(data.ttOrderFeeVoList,'paymentId');
          this.$set(this.handlers,'feeInfo',payI);
          this.$set(this.handlers,'payments',payments);
          console.log(Object.values(this.handlers.feeInfo).reduce((n,m) => n + m),'~~~~~~~~~~~~~~~~~values');
              // 财务退款立马去处理
          if(val=='follow'){
            setTimeout(()=>{
              this.handlers.refundStatus = 3;
              this.handlers.refundStep = 5;
              this.$refs.handles.handleAudit(1);
            },300)
          }
          this.show = true;
          data = Object.assign(data,list)
          this.orderInfo = [data];
          console.log(this.refundInfo);
        }
      });
      // 根据退款id获取退款费用信息
      setTimeout(()=>{
        getRefundFeeByRefundId(this.$route.query.id).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            let allIn = this.handlers.allInRefund?true:this.handlers.depart-allIn?true:false;
            let data = res.data.data;
            data.forEach(element => {
                this.$set(element,'allIn',allIn);             
                this.$set(element,'hasTask',this.handlers.hasTask);                
            }); 
            console.log(data,'datadata');         
            this.feeInfo = data;
          }
        });      
      },800);
      
      // 根据退款id获取退款任务信息
      getRefundTaskByRefundId(this.$route.query.id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.taskInfo = res.data.data
        }
      });
      //审核记录
      let paras = {
        type: 4,
        taskId: this.$route.query.id
      }
      auditLog(paras).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.onlineAuditInfo = Object.values(res.data.data).map(item => Object.values(item)[0]);
        }
      })            
    },    
    judgeUknow(){
      let ind = this.feeInfo.findIndex(item => item.refundState == 3);
      let idx = this.feeInfo.findIndex(item => item.refundState == 2);
      if (ind != -1){
        setTimeout(()=>{
          this.$refs.handles.unKnow = true
        },200)
      };
      if (idx != -1){
        setTimeout(()=>{
          this.$refs.handles.fail = true
        },200)
      }
    },
    // 审批按钮
    handleOn() {
      this.centerDialogVisible = true;
      let param = {
        taskCurrentEmpId: this.snapshotInformation.taskCurrentEmpId,
      };
      getMobile(param).then((res) => {
        this.showMobile = res.data.data;
      });
    },
    getCode() {
      let param = {
        taskCurrentEmpId: this.snapshotInformation.taskCurrentEmpId,
        taskNo: this.$route.query.taskNo,
      };
      sendCode(param).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            message: "发送成功，5分钟内有效！",
            type: "success",
          });
          this.timer();
          this.encodeTaskNo = res.data.data;
        } else if (res.data.code == CodeMsg.CODE_1001) {
        } else {
          this.$message({
            message: "发送失败，请稍后再试！",
            type: "error",
          });
        }
      });
    },
    timer() {
      if (this.num > 0) {
        this.codeDisabled = true;
        this.btnCode = this.num + "s后重试";
        this.num--;
        setTimeout(() => {
          this.timer();
        }, 1000);
      } else {
        this.btnCode = "获取验证码";
        this.num = 60;
        this.codeDisabled = false;
      }
    },
    //审核通过
    handleSubmit() {
      let param = {
        auditNote: this.textarea,
        code: this.code,
        taskCurrentEmpId: this.snapshotInformation.taskCurrentEmpId,
        taskNo: this.$route.query.taskNo,
        encodeTaskNo: this.encodeTaskNo,
      };
      audit(param).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "审核通过!",
          });
          this.getDetail();
          this.centerDialogVisible = false;
        } else if (res.data.code == CodeMsg.CODE_1) {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
    handleOff() {
      let param = {
        auditNote: this.textarea,
        code: this.code,
        taskCurrentEmpId: this.snapshotInformation.taskCurrentEmpId,
        taskNo: this.$route.query.taskNo,
      };
      this.$confirm("审核不通过,流程将驳回到流程发起人", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
        auditFail(param).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "审核不通过!",
            });
            this.getDetail();
          }
        });
      });
    },
  },
  computed:{
    refundFrom(){
      return this.$route.query.from
    },
    ...mapGetters(['permissions'])
  }
};
</script>
<style scoped>
  @import url('./refund.css');
</style>