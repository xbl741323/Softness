<template>
  <div class="calculator-box">
    <p class="indicator-subtitle">{{this.name}}</p>
    <!-- <el-input placeholder="请输入相应计算公式" type="textarea" :rows="5" v-model="formula" /> -->
    <div class="indicator-text-area">
      <span v-for="(item, index) in formulaList" :key="index" :class="item.formulaType == 0 ? 'indicatorkey':''">{{item.name}}</span>
    </div>
    <div class="operation-box">
      <p class="indicator-subtitle">快捷运算符</p>
      <div class="desktop-operator">
        <p v-for="item in operatorList" :key="item.value" class="operationkey" @click="getFormula(item, 1)">{{item.name}}</p>
      </div>
    </div>
    <p class="indicator-subtitle">点击选择指标项</p>
    <div class="indicator-select-box">
      <p v-if="editOperator.isComputed && editOperator.isParam">结果指标</p>
      <p v-if="editOperator.isComputed && editOperator.isParam" class="indicatorlabel result" @click="getFormula({type:0, val:'0',name:'结果值',calculatorType:'param'}, 0)">结果值</p>
      <p v-if="administrativeList.length > 0">行政指标</p>
      <div class="indicator-box">
        <p v-for="item in administrativeList" :key="item.id" class="indicatorlabel" @click="getFormula(item, 0)">{{item.name}}</p>
      </div>
      <p v-if="indicatorList.length > 0 && editOperator.indexType !='1-3'">业绩指标-单项指标</p>
      <div class="indicator-box" v-if="editOperator.indexType !='1-3'">
        <p v-for="item in indicatorList" :key="item.id" class="indicatorlabel" @click="getFormula(item, 0)">{{item.name}}</p>
      </div>
      <p v-if="editOperator.indexType =='1-3'">业绩指标-管理指标</p>
      <div class="indicator-box" v-if="editOperator.indexType =='1-3'">
        <p v-for="item in manageList" :key="item.id" class="indicatorlabel" @click="getFormula(item, 0)">{{item.name}}</p>
      </div>
      <p v-if="financialList.length > 0 && editOperator.indexType !='1-3'">财务指标-单项指标</p>
      <div class="indicator-box" v-if="editOperator.indexType !='1-3'">
        <p v-for="item in financialList" :key="item.id" class="indicatorlabel" @click="getFormula(item, 0)">{{item.name}}</p>
      </div>
      <p v-if="financialReserveList.length > 0 && editOperator.indexType !='1-3'">财务指标-预留指标</p>
      <div class="indicator-box" v-if="editOperator.indexType !='1-3'">
        <p v-for="item in financialReserveList" :key="item.id" class="indicatorlabel" @click="getFormula(item, 0)">{{item.name}}</p>
      </div>
    </div>
    <div class="indicator-footer-btn">
      <el-button size="mini" type="primary" @click="confirmFormula()">确定</el-button>
    </div>
  </div>
</template>

<script>
import examineData from './examine'
import { pageKpIndex, } from "@/api/salary/target"
import { getPlan } from "@/api/salary/examine";
export default {
  props:{
    editOperator:{//操作项
      type: Object,
    },
    examineList: {//已选考核项
      type: Array,
      require: true
    },
    relatedPlanId:{//关联方案id
      type: Number
    },
  },
  data(){
    return {
      operatorList:examineData.operatorList,
      administrativeList: [],
      financialList: [],
      indicatorList: [],
      financialReserveList: [],
      manageList: [],
      formulaList:[],//存储计算规则
      formula:'',
      name:'',
    }
  },
  mounted(){
    this.name = this.editOperator.name;
    if(this.editOperator.computeRuleList && this.editOperator.computeRuleList.length > 0){
      this.formulaList = JSON.parse(JSON.stringify(this.editOperator.computeRuleList));
      this.formulaList.forEach( el => {
        if(el.type != 'num' && el.type != 'sign'){
          el.formulaType = 0
        }
        this.formula = this.formula + el.name;
      });
      if(this.formulaList[0].type == 'null'){
        this.formulaList = [];
        this.formula = '';
      }
    }
    if(this.relatedPlanId){
      this.getPlan();
    }
    this.examineList.forEach(item => {
      item.selectedIndicatorList.forEach(indicator => {
        const { indexId, id, indexType, isParam } = indicator;
        let typeId, val; 
        let financialList = this.financialList;
        let financialReserveList = this.financialReserveList;
        let administrativeList = this.administrativeList;
        let indicatorList = this.indicatorList;
        let manageList = this.manageList;
        /* 1-1 业绩指标-单项指标 1-2 业绩指标-等级指标 1-3 业绩指标-管理指标 2-1 行政指标 3-1财务指标-单项指标 3-2 财务指标-预留指标*/
        if((indexType == '1-1' || indexType == '2-1' || indexType == '3-1' || indexType == '3-2' || indexType == '1-3') && isParam){
          typeId = indexId || id;
          val = indexId || id;
          if (indexType == '1-1') 
            indicatorList.push(indicator);
          else if (indexType == '2-1') 
            administrativeList.push(indicator);
          else if(indexType == '3-1')
            financialList.push(indicator);
          else if(indexType == '3-2')
            financialReserveList.push(indicator);
          else if(indexType == '1-3')
            manageList.push(indicator);
        }
        // else if (indexType == '3-2' && isParam){
        //   typeId = indexId || id;
        //   val = indexId || id;
        //   financialReserveList.push(indicator);
        // } 

        this.$set(indicator, 'calculatorType', 'param');
        this.$set(indicator, 'able', true);
        this.$set(indicator, 'typeId', typeId);
        this.$set(indicator, 'val', val);
        this.$set(indicator, 'indexType', indexType);
      });
    });
  },
  methods:{
    getPlan(){//编辑-获取方案详情
      getPlan(this.relatedPlanId).then(res=>{
        this.relatedPlan = res.data.data.planItemList;
        this.relatedPlan.forEach(item => {
          item.planItemIndexConfList.forEach(el => {
            if(el.isParam){
              this.administrativeList.push(el);
            }
          });
        });
      })
    },
    confirmFormula(){
      this.$emit('formula', this.formulaList);
    },
    getFormula(row, type){//计算规则
      this.$set(row,'formulaType',type);//运算符-1 指标项-0
      this.$set(row,'type', row.calculatorType)
      switch (row.value) {
        case 15:
          this.formulaList.splice(this.formulaList.length-1, 1);
          break;
        case 20:
          this.formulaList = [];
          break;
        default:
            this.formulaList.push(row);
          break;
      }
      this.formula = '';
      this.formulaList.forEach( el => {
        this.formula = this.formula + el.name;
      });
    },
    getPageKpIndex(){//业绩指标-单项指标
      let param = {
        pageNo: 1,
        pageSize: -1,
        indexType: '2-1'
      }
      //业绩指标-单项指标

      pageKpIndex(param).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          res.data.data.records.forEach( el => {
            this.$set(el,'calculatorType','param');
            this.$set(el, 'able', true);
            // this.$set(el, 'type', 0); //type 0-单项指标 1-等级指标
            this.$set(el, 'typeId', el.id);
            this.$set(el, 'val', el.id);
          });
          this.administrativeList = res.data.data.records;
        }
      })
    },
  }
}
</script>

<style scoped>
.calculator-box{
  margin-top: -50px;
}
.desktop-operator{
  width: 450px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}
.desktop-operator :nth-child(4n){
  margin-left: 20px;
}
.operationkey{
  text-align: center;
  border: 1px solid #f6f6f6;
  background: #f6f6f6;
  margin: 0 10px;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
}
.indicator-select-box{
  max-height: 500px;
  overflow: auto;
}
.indicator-box{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 10px;
  text-align: center;
}
.indicatorlabel{
  border: 1px solid #dcdcdc;
  color: #409EFF;
  padding: 5px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 5px;
}
.result{
  width: 55px;
  text-align: center;
}
.indicator-subtitle{
  font-size: 14px;
  font-weight: 550;
  margin-top: 30px;
  color: #333333;
}
.indicator-footer-btn{
  text-align: right;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f6f6f6;
}
.indicatorkey{
  display: inline-block;
  border: 1px solid #dcdcdc;
  color:#409EFF;
  padding: 3px 6px;
  margin: 10px 4px;
  border-radius: 5px;
}
.indicator-text-area{
  width: 95%;
  min-height: 100px;
  margin: 0 auto;
  border: 1px solid #dcdcdc;
  padding: 20px;
  border-radius: 5px;
}
</style>