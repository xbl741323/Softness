<template>
  <div class="refund_detail" v-if="refundReceiveInfo.refund">
    <div class="refund_info">
      <p>退款编号：<span>{{refundReceiveInfo.refund.taskNo}}</span></p>
      
      <p>申请时间：<span>{{refundReceiveInfo.refund.gmtCreate}}</span></p>
      <p>申请人：
        <span>
          <el-tooltip effect="dark" :content="'工号：'+ refundReceiveInfo.refund.creatorNo +'   部门：'+refundReceiveInfo.refund.creatorDeptName" placement="top">
            <span>{{refundReceiveInfo.refund.creatorName}}</span>
          </el-tooltip>
        </span>
      </p>
    </div>
    <div class="receive_refund_info">
      <div 
        v-for="item in refundInfoList"
        :key="item.value"
      >
        <span>{{item.label}}</span>
        <p v-if="item.value == 0">
          <span :class="[refundReceiveInfo.refund.taskStatus == 0 ? 'tostart' : refundReceiveInfo.refund.taskStatus == 1 ? 'success' : refundReceiveInfo.refund.taskStatus == 2 ? 'blue-circle circleRed' :'']">
            <b v-if="refundReceiveInfo.refund.taskStatus == 1">✔</b>
          </span>
          {{refundReceiveInfo.refund.taskStatus | refundStatus}}</p>
        <p v-if="item.value == 1">{{ refundReceiveInfo.refund.refundAmount | receiveAmount }}</p>
        <p v-if="item.value == 2">{{ refundReceiveInfo.refund.amountType | amountType }}</p>
        <p v-if="item.value == 3">{{ refundReceiveInfo.refund.refundReasonContent }}</p>
        <p v-if="item.value == 4">{{ refundReceiveInfo.receive.receiveNo }}</p>
        <p v-if="item.value == 5">{{ refundReceiveInfo.receive.receiveAmount | receiveAmount }}</p>
        <p v-if="item.value == 6">{{ refundReceiveInfo.receive.payerName }}</p>
        <p v-if="item.value == 7">{{ refundReceiveInfo.receive.customerName }}</p>
      </div>
    </div>
    <div class="refund_line">
      <p class="refund_desc">问题描述</p>
      <p>{{refundReceiveInfo.refund.questionDescription}}</p>
    </div>
    <div v-if="refundReceiveInfo.refund.taskStatus == 1 || refundReceiveInfo.refund.taskStatus == 2">
      <p class="audit_opinion">审批意见</p>
      <p>{{refundReceiveInfo.refundProcess.gmtCreate}} 
        <el-tooltip effect="dark" :content="'工号：'+refundReceiveInfo.refundProcess.operatorNo +'   部门：'+refundReceiveInfo.refundProcess.operatorDept" placement="top">
          <span>{{refundReceiveInfo.refundProcess.operatorName}}</span>
        </el-tooltip>
      </p>
      <p>{{refundReceiveInfo.refundProcess.auditNote}}</p>
    </div>
    <div class="refund_btn">
      <el-button type="warning" v-if="refundReceiveInfo.refund.taskStatus == 0 && (receiveInfo.claimNo == receiveInfo.loginNo || receiveInfo.salesmanNo == receiveInfo.loginNo)" @click="cancelRefund()" v-preventReClick >撤销申请退款</el-button>
      <el-button type="primary" v-if="(refundReceiveInfo.refund.taskStatus == 2 || refundReceiveInfo.refund.taskStatus == 5) && (receiveInfo.claimNo == receiveInfo.loginNo || receiveInfo.salesmanNo == receiveInfo.loginNo)" @click="reApply()" v-preventReClick >重新申请退款</el-button>
    </div>
  </div>
</template>

<script>
import refundData from './refund'
export default {
  props:{
    receiveNo:{
      type: String,
      required: true,
    },
    source:{
      type: String,
      required: true,
      default: 'list'
    },
    receiveInfo:{
      type: Object,
      required: true
    }
  },
  data(){
    return {
      refundInfoList: refundData.refundInfoList,
      refundReceiveInfo: {}
    }
  },
  filters:{
    receiveAmount(value){
      return value == null ?  '待定' : (value/100).toFixed(2);
    },
    refundStatus(value){
      return refundData.refundStatus(value);
    },
    amountType(value){
      return value == 0 ? '代理费' : value == 1 ? '第三方费用' : value == 2 ? '官费' : '';
    },
    
  },
  mounted(){
    this.getRefundInfo();
  },
  methods:{
    getRefundInfo(){
      let url = this.source == 'personal' ? '/wtcrm/refund/personal/getReceiveRefundDetail' : '/wtcrm/refund/getReceiveRefundDetail';
      refundData.getRefundInfo({no: this.receiveNo},url).then(res=>{
        this.refundReceiveInfo = res;
      })
    },
    cancelRefund(){
      refundData.cancelRefund({taskNo: this.refundReceiveInfo.refund.taskNo}).then(res=>{
        if(res){
          this.$emit('closeRefundDialog',false);
        }
      })
    },
    reApply(){
      this.$emit('reApply',true);
    },
  }
}
</script>

<style scoped>
.refund_detail{
  min-width: 750px;
}
.receive_refund_info{
  display: grid;
  grid-template-columns: repeat(4,1fr);
  padding-left: 5px;
  border-bottom: 1px #eee solid;
}
.receive_refund_info span{
  font-weight: 550;
  font-size: 14px;
  color: #000;
}
.refund_info{
  display: flex;
  margin: 10px 0;
  padding-left: 5px;
  color: #000;
  background: #f2f2f2;
}
.refund_info span{
  font-weight: 500;
  color: #666;
}
.refund_info p{
  font-weight: 550;
  margin-right: 20px;
}
.refund_desc{
  color: #000;
  font-weight: 550;
}

.blue-circle{
  width:6px;
  height:6px;
  display: inline-block;
  border-radius: 50%;
  background: #36A6FE;
  margin-right:7px;
}
.success{
  font-weight:bolder;
  font-size:12px;
  display: inline-block;
  color:#027502;
  margin-right:6px;
}
.success b{
  color:#027502;
}
.circleRed{
  background: #ff0000;
}
.tostart{
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 7px;
}
.refund_btn{
  text-align: center;
  margin-top: 10px;
}
.audit_opinion{
  font-weight: 550;
  padding: 5px;
  color: #000;
  background: #f2f2f2;
}
.refund_line{
  border-bottom: 1px #eee solid;
}
</style>