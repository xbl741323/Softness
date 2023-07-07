<!--排查完成-->
<template>
  <div>
    <el-steps :active="active" finish-status="success" process-status="finish">
      <el-step title="确认客户"></el-step>
      <el-step title="确认订单和费用"></el-step>
      <el-step title="认领完成"></el-step>
    </el-steps>
    <div v-if="!commitSuccess">
      <div class="source-sty">
        <span class="red-sty">*</span>
        <span>回款来源：</span>
      </div>
      <el-radio-group v-model="receiveSource" @change="handelRadioChange">
       <el-radio :label="1">2023年1月1日及之后的线上订单</el-radio>
       <el-radio :label="2">2023年1月1日之前的历史数据及第三方返佣/官费年费等</el-radio>
      </el-radio-group>
      <!-- 2023年1月1日及之后的线上订单操作 -->
      <div class="btn-contain" v-if="receiveSource==1">
        <el-button size="medium" type="primary" @click="showRecords()">{{selectOrderList.length>0?'更换支付记录':'关联支付记录'}}</el-button>
        <div class="check-contain-item" v-for="(item,index) in selectOrderList" :key="index">
          <div class="order-info">
           <span>订单编号：{{item.orderNo}}</span>
           <span>支付流水号：{{item.tradeNo}}</span>
          </div>
        <div class="form-check-contain">
          <div class="form-item-sty">
          <label>代理费：</label>
          <el-input v-model="item.agencyFee" type="number" class="form-item-input" disabled></el-input>
         </div>
         <div class="form-item-sty">
          <label>第三方费用：</label>
          <el-input v-model="item.thirdPartyFee" type="number" class="form-item-input" disabled></el-input>
         </div>
         <div class="form-item-sty">
          <label>官费：</label>
          <el-input v-model="item.governmentFee" type="number" class="form-item-input" disabled></el-input>
         </div>
        </div>
        </div>
        <div class="total-contain" v-if="selectOrderList.length>0">
          <div>
            <span class="label-sty">合计认领：</span>
            <span class="strong-sty">{{amountInfo.fixAmount}}元</span>
            <span class="small-sty" v-if="amountInfo.fixAmount != receiveAmount">{{amountInfo.balanceAmount}}元</span>
          </div>
          <div class="total-amount strong-sty">
            <span>{{receiveAmount}}元</span>
            <span v-if="amountInfo.fixAmount == receiveAmount">✔</span>
          </div>
       </div>
      </div>
      <!-- 2023年1月1日之前的历史数据及第三方返佣/官费年费等的订单操作 -->
      <div v-if="receiveSource==2">
       <el-form :model="oldForm" ref="oldForm" inline class="form-sty" :rules="rules">
         <el-form-item label="合同编号：" prop="contractNo">
          <el-input v-model="oldForm.contractNo" class="long-input-sty" placeholder="有合同的请输入合同编号，其他回款请简单备注"></el-input>
         </el-form-item>
         <div class="form-check-contain">
          <div class="form-item-sty">
          <el-checkbox v-model="oldForm.agencyStatus" @change="changeCheckStatus">代理费：</el-checkbox>
          <el-input @change="getFixAmount" @keyup.native="getFixAmount" class="form-item-input" :disabled="!oldForm.agencyStatus" v-model="oldForm.agencyVal"></el-input>
         </div>
         <div class="form-item-sty">
          <el-checkbox v-model="oldForm.thirdStatus" @change="changeCheckStatus">第三方费用：</el-checkbox>
          <el-input @change="getFixAmount" @keyup.native="getFixAmount" type="number" class="form-item-input" :disabled="!oldForm.thirdStatus" v-model="oldForm.thirdVal"></el-input>
         </div>
         <div class="form-item-sty">
          <el-checkbox v-model="oldForm.governmentStatus" @change="changeCheckStatus">官费：</el-checkbox>
          <el-input @change="getFixAmount" @keyup.native="getFixAmount" type="number" class="form-item-input" :disabled="!oldForm.governmentStatus" v-model="oldForm.governmentVal"></el-input>
         </div>
        </div>
       </el-form>
       <div class="total-contain">
          <div>
            <span class="label-sty">合计认领：</span>
            <span class="strong-sty">{{oldForm.totalAmount}}元</span>
            <span class="small-sty" v-if="oldForm.totalAmount != receiveAmount">{{oldForm.oldBalanceAmount}}元</span>
          </div>
          <div class="total-amount strong-sty">
            <span>{{receiveAmount}}元</span>
            <span v-if="oldForm.totalAmount == receiveAmount">✔</span>
          </div>
       </div>
      </div>
      <div class="btn-main">
        <el-button class="right-btn-sty" size="medium" type="primary" @click="lastStep">上一步</el-button>
        <el-button size="medium" type="primary" :disabled="btnDisabled" v-preventReClick @click="claimOperate()">确认认领</el-button>
      </div>
    </div>
    <div v-else>
      <img :src='`${baseUrl}images/成功 (1).png`' class="success-img">
      <p class="success-info success-receive">回款认领成功</p>
    </div>

    <!-- 关联支付记录 -->
    <el-dialog width="1200px" :modal="false" title="关联支付记录" :visible.sync="payDialog" v-if="payDialog" :close-on-click-modal="false" :before-close="handleClose">
      <related-pay-records :feeInfo="feeInfo" ref="records" @getSelectOrder="getSelectOrder" @closeDialog="handleClose"></related-pay-records>
    </el-dialog>
    
  </div>
</template>

<script>
import receivableOrderinfo from './receivable-orderinfo.vue';
import relatedPayRecords from './related-pay-records.vue';
import { saveReceivePayment } from '@/api/receive/receive.js'
import { set } from 'vue';
export default {
  components: { receivableOrderinfo,relatedPayRecords },
  props:{
    clueId:{
      type: Number,
      required: true
    },
    receiveAmount:{
      type: Number,
      required: true
    },
    feeInfo:{
      type: Object,
    },
    customerName:{
      type: String
    },
    clueType:{
      type: Number,
    }
  },
  data(){
    return {
      amountInfo:{
        fixAmount:0,
        balanceAmount:0
      },
      selectOrderList:[], // 选择的支付记录集合
      payDialog: false,
      btnDisabled: true, // 控制确认认领按钮是否可以点击
      newForm:{},
      oldForm:{
        contractNo:'',
        totalAmount:0, // 计算总金额
        oldBalanceAmount:0, // 差值
        agencyStatus:false,
        agencyVal:'',
        thirdStatus:false,
        thirdVal:'',
        governmentStatus:false,
        governmentVal:'',
      },
      receiveSource: 1, // 回款来源
      baseUrl: process.env.BASE_URL,
      active: 1,
      commitSuccess: false,
      rules:{
        contractNo: [{required: true, message: '请输入', trigger: 'change' }],
      }
    }
  },
  methods:{
    // 校验数字
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      value = value.indexOf(".") > 0 ? value.split(".")[0].substring(0, 10) + "." + value.split(".")[1] : value.substring(0, 10);
      return value;
    },
    handelRadioChange(){
      this.changeCheckStatus()
    },
    // 领取操作
    claimOperate(){
      if(this.receiveSource == 1){
       this.finalClaimReceive(this.selectOrderList)
      }else{
       this.$refs['oldForm'].validate((valid)=>{
        if(valid){
          let val = [{
           agencyFee:Number(this.oldForm.agencyVal), // 代理费
           thirdPartyFee:Number(this.oldForm.thirdVal), // 第三方费用
           governmentFee:Number(this.oldForm.governmentVal),// 官费
           contractNo:this.oldForm.contractNo, // 合同编号 产品订单独有
           receiveId:this.feeInfo.id,
           orderType: this.receiveSource==1? this.selectOrderList[0].orderType:4,
           payType: 3
          }]
          this.finalClaimReceive(val)
         }
       })
      }
    },
    finalClaimReceive(val){
      let params = {
        clueId:this.clueId,
        customerName: this.customerName,
        clueType:this.clueType,
        receiveId:this.feeInfo.id,
        trReceivePayments:val
      }
      saveReceivePayment(params).then(res=>{
        if(res.data.code == 0){
          this.commitSuccessStatus(true)
        }else{
          this.$message({
            type:'warning',
            message:res.data.msg,
            offset: 300
          })
        } 
      })
    },
    changeCheckStatus(){
      this.getFixAmount()
    },
    getFixAmount(){
      this.oldForm.totalAmount = 0
      this.oldForm.agencyVal = this.oninput(this.oldForm.agencyVal)
      this.oldForm.thirdVal = this.oninput(this.oldForm.thirdVal)
      this.oldForm.governmentVal = this.oninput(this.oldForm.governmentVal)
      if(this.oldForm.agencyStatus){
        this.oldForm.totalAmount = this.oldForm.totalAmount + Number(this.oldForm.agencyVal)
      }
      if(this.oldForm.thirdStatus){
        this.oldForm.totalAmount = this.oldForm.totalAmount + Number(this.oldForm.thirdVal)
      }
      if(this.oldForm.governmentStatus){
        this.oldForm.totalAmount = this.oldForm.totalAmount + Number(this.oldForm.governmentVal)
      }
      let value = Number(this.receiveAmount)-this.oldForm.totalAmount
      this.oldForm.oldBalanceAmount = value>0? '-'+Math.abs(value):value<0?'+'+Math.abs(value):''
      this.setBtnDisabled()
    },
    getSelectOrder(val){
      this.selectOrderList = val
      let temAmount = 0
      this.selectOrderList.forEach(item=>{
        temAmount = Number(temAmount) + Number(item.payAmount)
      })
      this.amountInfo.fixAmount = temAmount
      let value = Number(this.receiveAmount) - Number(temAmount)
      this.amountInfo.balanceAmount = value>0? '-'+Math.abs(value):value<0?'+'+Math.abs(value):''
      this.setBtnDisabled()
    },
    // 控制按钮是否可以点击
    setBtnDisabled(){
      // 线上订单判断按钮
      if(this.receiveSource==1){
        this.btnDisabled = (this.selectOrderList.length>0)&&(this.amountInfo.fixAmount == this.receiveAmount) ? false : true 
      }else{
      // 历史数据处理判断按钮
        this.btnDisabled = (this.oldForm.totalAmount == this.receiveAmount) ? false : true 
      }
    },
    // 关闭弹窗
		handleClose(){
			this.payDialog = false
		},
    showRecords(){
     this.payDialog = true
     this.$nextTick(()=>{
      this.$refs.records.selectTotalOrderList = this.selectOrderList
      this.$refs.records.setTypeOrder()
     })
    },
    commitSuccessStatus(val){
      this.commitSuccess = val;
      setTimeout(()=>{
        this.$emit('closeConfirmDialog', false);
      },1000)
    },
    lastStep(){
      this.$emit('lastStep',{clueId:this.clueId,feeInfo: this.feeInfo})
    },
  }
}
</script>

<style scoped>
.success-img{
  display:block;
  margin: 20px auto;
}
.success-info{
  display: block;
  text-align: center;
}
.success-receive{
  font-size: 16px;
  font-weight: 550;
  color: black;
}
.source-sty{
  margin: 20px 0 20px 0;
}
.btn-contain{
  margin-top: 30px;
}
.btn-main{
  margin-top: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.form-sty{
  margin-top: 25px;
}
.long-input-sty{
  width: 400px;
}
.form-check-contain{
  display: flex;
  align-items: center;
  margin-top: 15px;
}
.form-item-sty{
  display: flex;
  align-items: center;
  margin-right: 30px;
}
.form-item-input{
  width: 200px;
}
.total-contain{
 margin-top: 30px;
}
.total-amount{
  margin-top: 30px;
  margin-left: 86px;
}
.label-sty{
  font-size: 14px;
  font-weight: bold;
  margin-right: 15px;
}
.strong-sty{
  font-weight: bold;
  font-size: 16px;
}
.small-sty{
  font-size: 14px;
  margin-left: 30px;
  color: #FF9900;
}
.check-contain-item{
  margin-top: 20px;
}
.order-info{
  font-size: 14px;
}
.order-info>span:nth-of-type(1){
  margin-right: 30px;
}

.right-btn-sty{
  margin-right: 20px;
}

.red-sty{
  color: #F56C6C;
  margin-right: 5px;
}
</style>