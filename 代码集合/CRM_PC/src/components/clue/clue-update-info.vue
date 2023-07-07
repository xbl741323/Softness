<template>
<!-- 排查完成 -->
  <div>
    <p>线索{{this.clueNo}}信息已更新，请选择当前合同中线索需要同步更新的内容。</p>
    <el-table :data="this.datalist" border>
      <el-table-column label="内容" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.empType | empType}}</p>
        </template>
      </el-table-column>
      <el-table-column label="更新前" prop="contractEmpName" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.contractEmpNo +' 部门：'+scope.row.contractDeptName" placement="top">
            <p>{{scope.row.contractEmpName}}</p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="更新后" prop="empName" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.empNo +' 部门：'+scope.row.empDeptName" placement="top">
            <p>{{scope.row.empName}}</p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="是否同步更新" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="changeStatus(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <h5>说明:</h5>
    <p>在‘我的合同’里只有业务员本人可以提交合同审核，因此线索业务员变更时，“我的合同”中的线索不允许同步更新业务员。</p>
    <div class="btn">
      <el-button type="primary" @click="updateClueInfo()" :disabled="this.list.length == 0" v-preventReClick>确认</el-button>
      <el-button type="warning" @click="cancle()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { updateInfo } from '@/api/clue/clue-contract'
import * as CodeMsg from "@/api/common/CodeChange"
export default {
  props: {
    datalist:{
      type: Array,
      required: false
    },
    clueNo: {
      type: String,
      required: false
    }
  },
  data(){
    return {
      list: []
    }
  },
  mounted(){

  },
  methods:{
    cancle(){
      this.$emit('cancle',false);
    },
    updateClueInfo(){
      updateInfo({changeList:this.list}).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type: 'success',
            message: '线索信息更新成功！'
          });
          this.$emit('closeDialog',false);
        }
      })
    },
    changeStatus(val){
      if(val.status){
        this.list.push(val);
      }else{
        for(let i = 0; i<this.list.length; i++){
          if(val.id == this.list[i].id){
            this.list.splice(this.list.indexOf(this.list[i]),1);
          }
        }
      }
    }
  },
  filters:{
    empType(val){
      return val == 0 ? '线索归属' : val == 1 ? '业务员' : val == 2 ? '客户归属' : ''
    }
  }
}
</script>

<style scoped>
.btn{
  text-align: center;
  margin-top: 20px;
}
</style>