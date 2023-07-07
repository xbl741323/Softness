<template>
<!-- 排查完成 -->
  <div class="orderFrame" v-if="orderInfo">
    <el-form  :model="orderInfo" ref="orderInfo" :rules="orderRules" label-width="110px">
      <el-form-item prop="productName" label="产品名称：">
        <el-tooltip effect="dark" :content="orderInfo.productName" placement="top-start">
          <p class="name">{{this.orderInfo.productName}}</p>
        </el-tooltip>
      </el-form-item>
       <div class="gridspace">
            <el-form-item label="产品数量：" prop="productCount">
                <el-input type="number" class="order-input" v-model="orderInfo.productCount" />
            </el-form-item>
            <el-form-item label="交付日期：" prop="finishTime" class="empty">
                <el-date-picker
                style="width:140px"
                type="date"
                v-model="orderInfo.finishTime"
                value-format= "yyyy-MM-dd"
                :picker-options= "TimeOption"
                placeholder="交付日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="订单总价：">
                <span v-if="orderInfo.agentTotalUncertain || orderInfo.thirdTotalUncertain || orderInfo.govTotalUncertain">待定</span>
                <span v-else>{{(orderInfo.agencyFee*100 + orderInfo.thirdPartyFee*100 + orderInfo.governmentFee*100)/100}}</span>
            </el-form-item>
      </div>
      <div class="gridspace">
            <el-form-item label="代理费总价：" prop="agencyFee">
                <el-input type="number" class="order-input" v-model="orderInfo.agencyFee" :disabled="orderInfo.agentTotalUncertain" @blur="orderInfo.agencyFee ==null || orderInfo.agencyFee == 0 || orderInfo.agencyFee == '' ? orderInfo.agencyFee= 0 : orderInfo.agencyFee = orderInfo.agencyFee*100/100" />
                <el-checkbox v-model="orderInfo.agentTotalUncertain" class="box" @change="orderInfo.agencyFee = 0" label="待定"></el-checkbox>
            </el-form-item>
            <el-form-item label="第三方总价：" prop="thirdPartyFee">
                <label slot="label"><span class="mlthree">第三方总价：</span></label>
                <el-input type="number" class="order-input inputthree" v-model="orderInfo.thirdPartyFee" :disabled="orderInfo.thirdTotalUncertain" @blur="orderInfo.thirdPartyFee ==null || orderInfo.thirdPartyFee==0 || orderInfo.thirdPartyFee=='' ? orderInfo.thirdPartyFee= 0 : orderInfo.thirdPartyFee = orderInfo.thirdPartyFee*100/100" />
                <el-checkbox v-model="orderInfo.thirdTotalUncertain" class="box" @change="orderInfo.thirdPartyFee = 0" label="待定"></el-checkbox>
            </el-form-item>
            <el-form-item label="官费总价：" prop="governmentFee">
                <el-input type="number" class="order-input" v-model="orderInfo.governmentFee" :disabled="orderInfo.govTotalUncertain" @blur="orderInfo.governmentFee==null || orderInfo.governmentFee == 0 || orderInfo.governmentFee == '' ? orderInfo.governmentFee= 0 : orderInfo.governmentFee = orderInfo.governmentFee*100/100" />
                <el-checkbox v-model="orderInfo.govTotalUncertain" @change="orderInfo.governmentFee = 0" class="box" label="待定"></el-checkbox>
                <p class="governmentfee-warning">只有替客户代缴官费时，才填写此项</p>
            </el-form-item>
      </div>
      <el-form-item prop="orderNote" label="备注：" class="remark">
        <el-input type="textarea"  :rows="1" maxlength="100" class="orderText" show-word-limit v-model="orderInfo.orderNote"/>
      </el-form-item>
       <div class="gridspace mt">
            <el-form-item label="工程师：">
                <el-select v-model="orderInfo.engineerCascadeView" clearable filterable >
                    <el-option v-for="items in engineersList" :key="items.userId" :label="items.name" :value="items.userId"></el-option>
                </el-select>
                <p class="tipword">如未选择工程师，系统将进行自动分配</p>
            </el-form-item>
            <el-form-item label="财务辅导：" v-if="orderInfo.productType == 0">
                <el-select v-model="orderInfo.financialIdCascadeView" clearable filterable >
                    <el-option  v-for="items in financialList" :key="items.userId" :label="items.name" :value="items.userId"></el-option>
                </el-select>
            </el-form-item>
       </div>
    </el-form>
    
    <div class="btn">
      <el-button size="small" type="primary" @click="last()" v-if="!this.editOrder">上一步</el-button>
      <el-button size="small" type="primary" @click="addOrder()" v-preventReClick>确定</el-button>
      <el-button size="small" type="warning" @click="cancle()">取消</el-button>
    </div>
  </div>
</template>

<script>
import constract from './entering-contract.js'
import dropList from '@/util/department.js'
export default {
  props:{
    productInfo:{
      type: Object,
      required: true
    },
    editOrder:{
      type:Boolean,
      required: true
    }
  },
  data(){
    return{
      TimeOption: constract.TimeOption,
      orderRules: constract.timeRules,
      orderInfo:{},
      engineersList:[], 
      financialList:[]  
    }
  },
  created(){
    this.orderInfo = JSON.parse(JSON.stringify(this.productInfo));
    if(!this.orderInfo.productCount){
      this.$set(this.orderInfo,'productCount',1);
    } 
    if(!this.orderInfo.orderNote){
      this.$set(this.orderInfo,'orderNote','');
    }
    if(!this.orderInfo.finishTime){
      this.$set(this.orderInfo,'finishTime','');
    }
    let deptNo = this.orderInfo.productType ? 0 : 1;
    dropList.getSpecificEmp(deptNo).then(res=>{
        this.engineersList = res;     // 工程师
    });
    dropList.getSpecificEmp(2).then(res=>{//财务辅导
        this.financialList = res;
    });
  },
  methods:{
    cancle(){//取消
      this.$emit('closeDialog',false);
    },
    last(){
      this.$emit('lastDialog',true);
    },
    addOrder(){
      this.$refs.orderInfo.validate(valid=>{
        if(valid){
          if(this.editOrder){
            this.$emit('edit',this.orderInfo);//编辑订单
          }else{
          this.$emit('list',[this.orderInfo]);//添加订单
          }
          this.$emit('closeDialog',false);
        }else{
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
.orderFrame{
  width: 1150px;
}
.order-input{
  width: 140px;
}
.box{
  margin-left: 5px;
  padding: 0 !important;
}
.empty{
  margin-left: 28px;
}
.btn{
  margin-top: 20px;
  text-align: center;
}
.name{
  width: 196px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.remark{
    margin-top: -13px;
}
.orderText{
  width: 1000px;
}
.governmentfee-warning{
  font-size: 12px;
  margin: 0;
}
.gridspace{
  display: grid;
  grid-template-columns: repeat(3,1fr);
}
.tipword{
    font-size:12px; 
    margin: 0 0 0 2px;
}
.inputthree{
    margin-left: 28px;
}
.mlthree{
    margin-left: 45px;
}
</style>