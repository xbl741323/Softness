<template>
<!-- 排查完成 -->
  <div class="add_product_next_frame">
    <el-form :model="form" ref="form" :rules="timeRules">
      <div class="overheight">
        <div v-for="(row,index) in form.orderList" :key="row.productNo" :class="[index+1!=form.orderList.length?'border_bottom':'','padding_top']">
            <div class="flex">
                <span class="title">{{'订单'+(index+1)+'：'}}</span><span class="name">{{row.productName}}</span><i class="del el-icon-delete" @click="deleteProduct(row)" v-if="form.orderList.length > 1"></i>
            </div>
            <div class="gridspace">
                <el-form-item label="产品数量：" :prop="'orderList.' + index +'.productCount'" :rules="timeRules.productCount">
                    <el-input type="number" class="orders_number mlnum"  max="999" v-model="row.productCount" @blur="row.productCount = row.productCount*100/100" />
                </el-form-item>
                <el-form-item label="交付日期：" :prop="'orderList.' + index + '.finishTime'" :rules="timeRules.finishTime">
                    <el-date-picker type="date" class="orders_date" v-model="row.finishTime" value-format= "yyyy-MM-dd" :clearable="false" placeholder="交付日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="订单总价(元)：">
                    <span v-if="row.agentTotalUncertain || row.thirdTotalUncertain || row.govTotalUncertain">待定</span>
                    <span v-else>{{(row.agencyFee*100 + row.thirdPartyFee*100 + row.governmentFee*100)/100}}</span>
                </el-form-item>
            </div>
            <div class="gridspace">
                <el-form-item label="代理费总价(元)：" :prop="'orderList.' + index +'.agencyFee'" :rules="timeRules.agencyFee" class="price_input">
                    <el-input type="number" class="orders_number" v-model="row.agencyFee" @blur="row.agencyFee = row.agencyFee*100/100" @focus="row.agentTotalUncertain = false" />
                    <el-checkbox v-model="row.agentTotalUncertain" @change="resetPrice(row, 'agencyFee')" class="indetermined" label="待定"></el-checkbox>
            </el-form-item>
                <el-form-item label="第三方费用总价(元)：" label-width="85px" :prop="'orderList.' + index +'.thirdPartyFee'" :rules="timeRules.thirdPartyFee">
                    <el-input type="number" class="orders_number inputthree" v-model="row.thirdPartyFee" @blur="row.thirdPartyFee = row.thirdPartyFee*100/100" @focus="row.thirdTotalUncertain = false" />
                    <el-checkbox v-model="row.thirdTotalUncertain" @change="resetPrice(row, 'thirdPartyFee')" class="indetermined" label="待定"></el-checkbox>
                </el-form-item>
                <el-form-item label="官费总价(元)：" :prop="'orderList.' + index + '.governmentFee'" :rules="timeRules.governmentFee"  class="price_input">
                    <el-input type="number" class="orders_number" v-model="row.governmentFee" @focus="row.govTotalUncertain = false" @blur="row.governmentFee = row.governmentFee*100/100" />
                    <el-checkbox v-model="row.govTotalUncertain" @change="resetPrice(row, 'governmentFee')" class="indetermined" label="待定"></el-checkbox>
                    <p class="tip">只有替客户代缴官费时，才填写此项</p>
                </el-form-item>
            </div>
            <el-form-item label="备注：" class="remark"><label slot="label"><span>备</span><span class="labelmr">注：</span></label><el-input type="textarea" class="text"  :rows="1" maxlength="100" show-word-limit v-model="row.orderNote"/></el-form-item>
            <div class="gridspace">
                <el-form-item label="工程师：">
                    <label slot="label"><span>工</span><span class="labelenginerone">程</span><span class="labelenginertwo">师：</span></label>
                    <el-select v-model="row.engineerCascadeView" clearable filterable class="mrenginer" >
                        <el-option v-for="items in engineersList" :key="items.userId" :label="items.name" :value="items.userId"></el-option>
                    </el-select>
                     <p class="tipword">如未选择工程师，系统将进行自动分配</p>
                </el-form-item>
                <el-form-item label="财务辅导：" v-if="form.orderList.length>0 && form.orderList[0].productType == 0">
                    <el-select v-model="row.financialIdCascadeView" clearable filterable class="mrfinan" >
                        <el-option  v-for="items in financialList" :key="items.userId" :label="items.name" :value="items.userId"></el-option>
                    </el-select>
                </el-form-item>
            </div>
        </div> 
        </div>
    </el-form>
    <div class="batch_add_products">
      <el-button type="primary" @click="goBack()">上一步</el-button>
      <el-button type="primary" @click="submitOrders()">确认</el-button>
      <el-button type="warning" @click="goBack()">取消</el-button>
    </div>
    <p class="complete">已填写{{completeNum}}/{{form.orderList.length}}条订单信息</p>
  </div>
</template>

<script>
import constract from './entering-contract.js'
import dropList from '@/util/department.js'
export default {
  props:{
    productInfo:{
      type: Array,
      required: true,
      default: []
    }
  },
  data(){
    return {
      form:{
        orderList: []
      },
      timeRules: constract.timeRules,
      TimeOption: constract.TimeOption,
      engineersList:[], 
      financialList:[]  
    }
  },
  computed:{
    completeNum(){
        let sum = []
        this.form.orderList.map(element=>{
            if(element.finishTime){
                sum.push(element.finishTime)
            }
        })
        return sum.length
    }
  },
  mounted(){
    this.form.orderList = JSON.parse(JSON.stringify(this.productInfo));
    console.log(this.form.orderList,"this.form.orderList")
    this.form.orderList.forEach(item => {
      this.$set(item, 'agentTotalUncertain', false);
      this.$set(item, 'thirdTotalUncertain', false);
      this.$set(item, 'govTotalUncertain', false);
      this.$set(item,'engineerCascadeView','');    // 工程师
      if(item.productType==0){
         this.$set(item,'financialIdCascadeView','');     // 财务辅导
      }
      // 官费
      if(item.governmentFeeTypeList && item.governmentFeeTypeList.length>0 ){
        item.governmentFeeTypeList.forEach(element=>{
          if(element.isDefault==0){
            this.$set(item, 'governmentFee', element.typeFee/100);
          }
        })        
      }else{
        if(item.governmentFee == null || item.governmentFee == ''){
          this.$set(item, 'governmentFee', 0);
        }else{
          this.$set(item, 'governmentFee', item.governmentFee/100);
        };
      }     
      // 代理费 
      if(item.agencyFee == null || item.agencyFee == ''){
        this.$set(item, 'agencyFee', 0);
      }else{
        this.$set(item, 'agencyFee', item.agencyFee/100);
      };
    //   第三方费用
      if(item.thirdPartyFee == null || item.thirdPartyFee ==''){
        this.$set(item, 'thirdPartyFee', 0);
      }else{
        this.$set(item, 'thirdPartyFee', item.thirdPartyFee/100);
      };
    });
    let deptNo = this.form.orderList[0].productType ? 0 : 1;
    dropList.getSpecificEmp(deptNo).then(res=>{
        this.engineersList = res;     // 工程师
    });
    dropList.getSpecificEmp(2).then(res=>{//财务辅导
        this.financialList = res;
    });
  },
  methods:{
    goBack(){
      this.$emit('goback',false);
    },
    submitOrders(){
      this.$refs.form.validate((valid)=>{
        if(valid){
            this.$emit('ordersList',this.form.orderList);
        }else{
          return false;
        };
      });
    },
    resetPrice(row, name){
      this.$set(row, name, parseFloat(0));
    },
    deleteProduct(row){
        this.$confirm('确认删除该产品吗？','提示',{
            type: 'warning',
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            cancelButtonClass: "btn-custom-cancel"
        }).then(()=>{
                this.form.orderList.forEach((item, index)=> {
                    if(row.productNo == item.productNo){
                    this.form.orderList.splice(index,1);
                    }
                });
        })
    },
  }
}
</script>

<style scoped>
.add_product_next_frame{
  width: 1100px;
}
.overheight{
    max-height: 600px;
    overflow-y: scroll;
}
.padding_top{
    padding-top: 15px;
}
.border_bottom{
    border-bottom: 1px solid #e4e7ed;
}
.name{
   font-weight: bold;
   margin-left: 15px;
}
.del{
    margin-left: 15px;
    font-size: 22px;
}
.del:hover{
    color: red;
}
.orders_number{
  width: 140px;
}
.orders_date{
    width: 140px;
}
.indetermined{
  margin-left: 10px;
}
.batch_add_products{
  margin-top: 20px;
  text-align: center;
}
.price_input{
  padding-bottom: 8px;
  display: flex;
}
.gridspace{
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-column-gap: 20px;
}
.tip{
    font-size:12px; 
    margin: 0;
}
.tipword{
    font-size:12px; 
    margin: 0 0 0 120px;
}
.remark{
    margin-top: -20px;
}
.flex{
    display: flex;
    align-items: center;
    margin-bottom: 18px;
}
.text{
    width: 915px;
    margin-left: 15px;
}
.complete{
    text-align: center;
    font-weight: bold;
    font-size: 14px;
}
.title{
    font-weight: 700;
}
.mlnum{
    margin-left: 28px;
}
.labelmr{
    margin-left: 50px;
}
.mrenginer{
    margin-left:12px ;
}
.labelenginerone{
    margin-left: 20px;
}
.labelenginertwo{
    margin-left: 20px;
}
.inputthree{
    margin-left: 6px;
}
.mrfinan{
    margin-left: 10px;
}
</style>