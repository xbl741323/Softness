<template>
  <div>
    <el-steps :active="active" finish-status="success" process-status="finish">
      <el-step title="确认客户"></el-step>
      <el-step title="确认订单和费用"></el-step>
      <el-step title="认领完成"></el-step>
    </el-steps>
    <div class="fee-information">
      <div>回款时间
        <p>{{feeInfo.receiveDateTime}}</p>
      </div>
      <div>回款金额
        <p>{{feeInfo.receiveAmount }}元</p>
      </div>
      <div>付款方名称
        <p>{{feeInfo.payerName}}</p>
      </div>
      <div>回款去向
        <p>{{feeInfo.receiveDirectionName}}</p>
      </div>
    </div>
    <el-form :model="feeForm">
      <el-form-item prop="customer" :rules="rules.customer" label="客户名称：">
        <el-autocomplete
          class="fee-input"
          v-model="feeForm.customer"
          :fetch-suggestions="querySearch"
          placeholder="请输入单位线索的单位名称或个人线索的线索姓名"
          value-key='clueNoAndName'
          :trigger-on-focus="false"
          @select="handleSelect"
          :maxlength="50"
        ></el-autocomplete>
      </el-form-item>
    </el-form>
    <div class="first-next">
      <el-button type="primary" :disabled="!hasSelected" @click="nextStep()">下一步</el-button>
      <el-button type="warning" @click="cancel()">取消</el-button>
    </div>
  </div>
</template>

<script>
import receiveData from '@/views/receivable/js/receivable.js'
export default {
  props:{
    feeInfo:{//回款信息
      type: Object,
      required: true
    },
    customerName:{//客户名称
      type: String,
      default: null
    },
    clueId:{
      type: Number,
      default: null
    },
  },
  data(){
    var customerValidator = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请输入客户名称！'));
      }else{
        setTimeout(()=>{
          if(!this.hasSelected){
            return callback(new Error('请选择已存在的客户名称！'));
          }else{
            callback();
          };
        },300);
      }
    }
    return {
      active: 0,
      feeForm:{},
      rules:{
        customer:[{required: true, validator: customerValidator, trigger:'blur'}]
      },
      hasSelected: false,
      name:'',//客户名称
    }
  },
  filters:{
    receiveAmount(value){
      return receiveData.receiveAmount(value);
    }
  },
  mounted(){
    if(this.customerName){
      this.$set(this.feeForm,'customer',this.customerName);
      this.$set(this.feeForm,'clueId',this.clueId);
      this.hasSelected = true;
    };
  },
  methods:{
    cancel(){
      this.$emit('cancel',false);
    },
    nextStep(){
      this.$emit('nextStep',{id: this.feeInfo.id,clueId: this.feeForm.clueId,receiveAmount: this.feeInfo.receiveAmount,feeInfo: this.feeInfo, customerName:this.feeForm.clueName,clueType:this.feeForm.clueType});
    },
    querySearch(queryString, cb) {
      let param ={
        orgName: queryString,
        size: 20,
        current:1
      }
      this.hasSelected = false;
      receiveData.myNormalClue(param).then(res=>{
        var restaurants = res;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.clueNoAndName.toLowerCase().indexOf(queryString.toLowerCase()) >-1);
      };
    },
    handleSelect(item) {
      console.log(item,'item')
      this.feeForm.clueId = item.id;
      this.feeForm.clueType = item.clueType
      this.feeForm.clueName = item.clueName
      this.hasSelected = true;
    },  
  }

}
</script>

<style scoped>
.fee-information{
  display: grid;
  grid-template-columns: repeat(4,1fr);
  font-size: 14px;
  font-weight: 550;
}
.fee-information p{
  font-weight: 400;
  color: #333;
}
.fee-input{
  width: 85%;
}
.first-next{
  text-align: center;
}
</style>