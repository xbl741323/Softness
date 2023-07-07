<template>
  <div class="refund_apply">
    <div class="receive_info">
      <div>
        <p>回款时间</p>
        {{receiveInfo.receiveTime}}
      </div>
      <div>
        <p>回款金额(元)</p>
        {{receiveInfo.receiveAmount | receiveAmount}}
      </div>
      <div>
        <p>费用类型</p>
        {{receiveInfo.amountType | amountType}}
      </div>
    </div>
    <el-form :model="refundForm" ref="refundForm" :rules="rules" class="refund_form" label-width="100px">
      <el-form-item prop="refundFee" label="退款金额：">
        <el-input v-model="refundForm.refundFee" class="refund_fee" placeholder="请输入退款金额，小数点后最多两位"/>
      </el-form-item>
      <el-form-item prop="refundReason" label="退款原因：">
        <div class="refund_reason">
          <el-radio 
            v-for="item in refundReasonList"
            :key="item.id"
            :label="item.dropdownKey"
            v-model="refundForm.refundReason"
          >{{item.dropdownValue}}</el-radio>
        </div>
      </el-form-item>
      <el-form-item prop="refundDesc" label="问题描述：">
        <el-input 
          class="refund_desc"
          type="textarea" 
          rows="5"
          maxlength="100"
          show-word-limit
          v-model="refundForm.refundDesc" />
      </el-form-item>
      <el-form-item label="审批人：" prop="auditor">
        <el-select v-model="refundForm.auditor">
          <el-option
            v-for="item in auditorList"
            :key="item.userId"
            :value="item.userId"
            :label="item.name"
          >
           <span>{{item.name}}</span>
           <img v-if="item.lockFlag && item.lockFlag ==9" src="/img/disable.png" class="disableman" alt="" />
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="refund_btn">
      <el-button type="primary" @click="submitRefund()" v-preventReClick >提交审核</el-button>
      <el-button type="warning" @click="closeRefundDialog()">取消</el-button>
    </div>
  </div>
</template>
<script>

import { getRefundReason, applyRefund, getAuditor} from '@/api/refund/index'

export default {
  props:{
    receiveInfo:{
      type: Object,
      required: true,
      default: {},
    },
    source:{
      type: String,
      required: true,
      default: 'list'
    }
  },
  data(){
    var refundFeevalidator = (rule, value, callback)=>{
      let pattern = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/;
      if(value){
        if(pattern.test(value)){
          if(value*100 <= this.receiveInfo.receiveAmount){
            callback();
          }else{
            callback(new Error('请输入正确的退款金额（退款金额大于0且不超过本次回款金额，小数点后最多两位）'));
          };
        }else{
          callback(new Error('请输入正确的退款金额（退款金额大于0且不超过本次回款金额，小数点后最多两位）'));
        };
      }else{
        callback(new Error('请输入正确的退款金额（退款金额大于0且不超过本次回款金额，小数点后最多两位）'));
      };
    };
    return {
      refundForm: {},
      refundReasonList:[],
      auditorList:[],
      rules: {
        refundFee:[{required: true, validator: refundFeevalidator, trigger: "blur"}],
        refundReason:[{required: true, message: '请选择退款原因', trigger: 'blur'}],
        refundDesc:[{required: true, message: '请输入问题描述', trigger: 'blur'}],
        auditor:[{required: true, message: '请选择审核人', trigger: 'change'}]
      }
    }
  },
  filters:{
    receiveAmount(value){
      return value == null ?  '待定' : (value/100).toFixed(2);
    },
    amountType(value){
      return value == 0 ? '代理费' : value == 1 ? '第三方费用' : value == 2 ? '官费' : '';
    },
  },
  mounted(){
    this.getreceive();
  },
  methods:{
    closeRefundDialog(){
      this.$emit('closeRefundDialog',false);
    },
    submitRefund(){
      let url = this.source == 'personal' ? '/wtcrm/refund/personal/applicationRefund' : '/wtcrm/refund/applicationRefund';
      let param ={
        orderNo: this.receiveInfo.orderNo,
        questionDescription: this.refundForm.refundDesc,
        receiveAmount: this.receiveInfo.receiveAmount,
        receiveNo: this.receiveInfo.receiveNo,
        refundAmount: this.refundForm.refundFee*100,
        refundReason: this.refundForm.refundReason,
        amountType: this.receiveInfo.amountType,
        taskCurrentEmpId: this.refundForm.auditor
      };
      this.$refs.refundForm.validate(valid=>{
        if(valid){
          applyRefund(param,url).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              this.$message({
                type:'success',
                message: '退款申请提交成功！'
              })
            };
            this.$emit('closeRefundDialog',false);
          }).catch(err=>{
            return err;
          });
        }else{
          return false;
        };
      })
    },
    getreceive(){
      getRefundReason().then(res=>{
        this.refundReasonList = res.data.data;
      });
      getAuditor().then(res=>{
        this.auditorList = res.data.data;
      })
    }
  }
}
</script>

<style scoped>
.receive_info{
  display: grid;
  grid-template-columns: repeat(3,1fr);
}
.receive_info p{
  font-weight: 550;
  color: #000;
}
.refund_reason{
  float: left;
}
.refund_reason > *{
  display: block;
  line-height: 30px;
}
.refund_fee{
  width: 300px;
}
.refund_form{
  margin-top: 10px;
}
.refund_desc{
  width: 400px;
}
.refund_btn{
  text-align: center;
}
.disableman{
    width: 15px;
    height: 15px;
    position: relative;
    top: 3px;
    left: -10px;
}
</style>