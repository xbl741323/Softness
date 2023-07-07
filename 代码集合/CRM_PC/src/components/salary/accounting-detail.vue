<template>
  <div class="wage-detail-frame">
    <p class="wage-detail-header">{{query.positionName}} {{query.date}}工资</p>
    <el-form inline :model="wageDetailForm" @keyup.enter.native="getDetail()">
      <el-form-item label="关键字：">
        <el-input placeholder="请输入姓名关键字、工号" v-model.trim="wageDetailForm.keyWords" />
      </el-form-item>
      <el-button size="mini" type="primary" @click="getDetail()">搜索</el-button>
      <el-button size="mini" @click="reset()">重置</el-button>
      <el-button size="mini" type="success" @click="completeAll()" v-if="isCalculate == 0">核算完成 
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          content="所有人员的工资项都有数据后方可核算完成，完成后数据将不可修改。">
            <i class="el-icon-question" slot="reference"></i>
        </el-popover>
      </el-button>
    </el-form>

      <el-table :data="salaryData" border max-height="700px" :header-cell-style="{background:'#F3F4F6'}">
        <el-table-column v-for="(item, index) in headerInfo" :key="index" :label="item.name" :fixed="index < 5 ? true : (index > headerInfo.length-4 ? 'right': false)" :width="item.indexType == -1 ? '130' : (index < 5 || index > headerInfo.length-2 ? '100' : '160')">
          <template slot-scope="{row,$index}"> 
            <div v-if="row.salaryResultVoList[index].indexType != null && row.salaryResultVoList[index].indexType === '-1'">
              <el-form :model="form" ref="salaryResult">
                <el-form-item :prop="$index+'/result'" :rules="resultRule.result">
                  <el-input placeholder="待填写" v-model="row.salaryResultVoList[index].result" :disabled="isCalculate" @blur="editTax(row.userId,row.salaryResultVoList[index])" />
                </el-form-item>
              </el-form>
            </div>
            <div v-else >
              <span>{{row.salaryResultVoList[index].result || (index < 5 ? '' : '待计算')}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import { calculateDetail, completeCalculate, editPersonalTax} from "@/api/salary/salary";
export default {
  data(){
    let resultValidate = (value, rule, callback )=>{
      if(value){
        var subscript = value.field.match(/\d/)[0];
        let pattern = /^\d{1,10}(\.\d{1,2})?$/;
        if(pattern.test(this.salaryData[subscript].salaryResultVoList[this.salaryData[subscript].salaryResultVoList.length-2].result)){
          callback();
        }else{
          callback(new Error('请填写0或正数'));
        }
      }else{
        callback(new Error('请填写0或正数'));
      }
    };
    return {
      token: '',
      isCalculate: false,
      wageDetailForm: {},
      query: {},
      form: {},
      salaryData: [],
      headerInfo: [],
      resultRule:{
        result:[{ validator: resultValidate, trigger: 'blur'}]
      }
    }
  },
  mounted(){
    this.token = localStorage.getItem('wageToken')
    this.query = this.$route.query;
    this.isCalculate = this.query.isCalculate == 1 ? true : false; 
    if(this.token){
      this.getDetail();
    }else{
      history.go(-1);
    }
  },
  methods:{
    reset(){
      this.wageDetailForm = {};
      this.getDetail();
    },
    editTax(userId, row){
      let pattern = /^\d{1,10}(\.\d{1,2})?$/;
      if(pattern.test(row.result)){
        let param = {
          salaryCalculateId: this.query.salaryCalculateId,
          userId: userId,
          personalTaxAmount: row.result,
          token: this.token
        }
        editPersonalTax(param).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.getDetail(this.token);
          }else{
            if(res.data.code == -2){
              localStorage.removeItem('wageToken');
              history.go(-1);
            }
            this.$message.warning(res.data.msg);
          }
        })
      }
    },
    completeAll(){
      let checkStatus = true;
      this.$refs.salaryResult.forEach(el => {
        el.validate(valid=>{
          if(!valid){
            checkStatus = false;
          }
        })
      });
      if(checkStatus){
        this.$confirm('核算完成后数据将不能修改，是否确认核算完成','提示',{
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel",
        }).then(()=>{
          let param = {
            salaryCalculateId: this.query.salaryCalculateId,
            token: this.token
          }
          completeCalculate(param).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              this.$route.query.isCalculate = 1;
              this.isCalculate = 1;
            }else{
              if(res.data.code == -2){
                localStorage.removeItem('wageToken');
                history.go(-1);
              }
              this.$message.warning(res.data.msg);
            }
          })
        })
      }else{
        this.$message.warning('请检查个税是否填写完整！');
      }
    },
    getDetail(){
      let param = {
        salaryCalculateId: this.query.salaryCalculateId,
        keyword: this.wageDetailForm.keyWords,
        token: this.token
      }
      calculateDetail(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.salaryData = res.data.data;
          this.headerInfo = res.data.data[0].salaryResultVoList;
        }else{
          if(res.data.code == -2){
            localStorage.removeItem('wageToken');
            history.go(-1);
          }
          this.$message.warning(res.data.msg);
        }
      })
    },
  }
}
</script>

<style scoped>
  .wage-detail-frame{
    min-height: 100%;
    background: #FFFFFF;
    padding: 10px;
  }
  .wage-detail-header{
    font-weight: 550;
  }
</style>