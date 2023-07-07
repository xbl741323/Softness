<template>
  <div class="entry-fee">
    <el-form :model="feeForm" ref="feeForm" :rules="feeRules">
      <el-table :data="feeForm.feeData" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="回款时间">
          <template slot-scope="scope">
            <el-form-item :prop="'feeData.'+scope.$index+'.receiveTime'" :rules="feeRules.receiveTime">
              <el-date-picker
                class="common-sty"
                v-model="scope.row.receiveTime"
                type="date"
                :picker-options="expireTimeOption"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="付款方名称">
          <template slot-scope="scope">
            <el-form-item :prop="'feeData.'+scope.$index+'.payerName'" :rules="feeRules.payerName">
              <el-autocomplete
                class="common-sty"
                v-model="scope.row.payerName" custom-item=""
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                value-key='clueName'
                :trigger-on-focus="false"
                @select="handleSelect"
                :maxlength="50"
              ></el-autocomplete>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="回款去向">
          <template slot-scope="scope">
            <el-form-item :prop="'feeData.'+scope.$index+'.receiveDirectionName'" :rules="feeRules.receiveDirectionName">
              <el-select v-model="scope.row.receiveDirectionName" class="common-sty">
                <el-option 
                  v-for="item in options"
                  :key="item.id"
                  :value="item.constantValue"
                  :label="item.constantValue"
                  filterable>
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="回款金额">
          <template slot-scope="scope">
            <el-form-item :prop="'feeData.'+scope.$index+'.receiveAmount'" :rules="feeRules.receiveAmount">
              <el-tooltip class="item" effect="light" :content='scope.row.receiveAmount | switchReceiveAmount' placement="top-start">
                <el-input class="common-sty" type="number" v-model="scope.row.receiveAmount" placeholder="请填写"></el-input>
              </el-tooltip>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="del(scope.$index)" v-if="feeForm.feeData.length>1">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button icon="el-icon-plus" class="add-fee" @click="addNewInfo()" :disabled="feeForm.feeData.length>=20" v-if="this.commitType == 'post'">回款信息</el-button>
    </el-form>
    <div class="commit-btn">
      <el-button type="primary" @click="commitFee()" v-preventReClick>确认</el-button>
      <el-button type="warning" @click="cancelCommit()">取消</el-button>
    </div>
  </div>
</template>

<script>
import receiveData from '@/views/receivable/js/receivable.js'
import receiveTo from '@/util/department.js'
export default {
  props:{
    commitType:{
      type: String,
      required: true
    },
    receiveInfo:{
      type: Object,
      required: false
    }
  },
  data(){
    return {
      feeForm:{
        feeData: [
          {
            receiveTime:'',
            payerName:'',
            receiveDirectionName:'',
            receiveAmount:'',
          }
        ]
      },
      feeRules:{
        receiveTime:[{required: true, message:'请选择回款时间', trigger:'blur'}],
        payerName:[{required: true, message:'请输入付款方名称',trigger:'blur'}],
        receiveAmount:[{required: true, pattern: /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/, message: '大于0,最多两位小数',trigger:'blur'}],
        receiveDirectionName:[{required: true, message:'请选择汇款去向',trigger:'blur'}]
      },
      options: [],
      expireTimeOption:{
        disabledDate(date){
          return date.getTime() > Date.now();
        }
      }
    }
  },
  filters:{
    switchReceiveAmount(value){
      if(value){
        return receiveData.switchReceiveAmount(value);
      }else{
        return '无';
      }
    }
  },
  mounted(){
    if(this.receiveInfo){
      this.receiveInfo.receiveTime = this.receiveInfo.receiveDateTime
      let obj = {};//防止子组件变化影响父组件
      obj = JSON.parse(JSON.stringify(this.receiveInfo))
      obj.receiveAmount = obj.receiveAmount
      this.feeForm.feeData = [];
      this.feeForm.feeData.push(obj);
    }
    receiveTo.getToReceive('hkqx').then(res=>{//汇款去向
      this.options = res[0].constants;
    });
  },
  methods:{
    del(index){
      this.feeForm.feeData.splice(index,1);
    },
    cancelCommit(){
      this.$emit('closeFeeDialog',false);
    },
    commitFee(){
      this.$refs.feeForm.validate(valid=>{
        if(valid){
          let param= {
            list:this.feeForm.feeData
          }
          receiveData.commitFee(param,this.commitType).then(res=>{
            if(res){
              this.$emit('closeFeeDialog',false);
            }
          })
        }else{
          return false;
        }
      })
    },
    addNewInfo(){
      this.feeForm.feeData.push(
        {
          receiveTime:'',
          payerName:'',
          receiveDirectionName:'',
          receiveAmount:'',
        }
      )
    },
    querySearch(queryString, cb) {
      let param ={
        orgName: queryString,
        size: 20,
        current:1
      }
      receiveData.orgNameLikeList(param).then(res=>{
        var restaurants = res;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.clueName.toLowerCase().indexOf(queryString.toLowerCase()) >-1);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
  },
}
</script>

<style scoped>
.entry-fee{
  font-size: 14px;
  width:100%;
}
.add-fee{
  margin: 10px 0;
}
.commit-btn{
  text-align: center;
  margin: 10px 0;
}
.common-sty{
  width: 180px;
}
</style>