<template>
<!-- 排查完成 -->
  <div>
    <div class="title">操作记录</div>
    <el-table :data="recordsList" :header-cell-style="tableHeader">
      <el-table-column  v-if="recordsList.length>0" :label="recordsList[0].requirement.requirementNo+'--'+recordsList[0].requirement.requirementName"  align="center">
        <el-table-column label="操作时间" prop="createTime" width="150" align="center"></el-table-column>
        <el-table-column label="操作人" align="center" width="200">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'工号：'+scope.row.userVO.number +' 部门：'+ scope.row.userVO.deptName" placement="top">
              <span v-if="scope.row.userVO">{{scope.row.userVO.name}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作内容" prop="typeTxt" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <div class="records-pagination" >    	
      <el-pagination   
        background
        @size-change="handleSizeChange"      
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, total"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getRequirementRecords } from '@/api/requirement/index'

export default {
  props:{
    active:{
      type: Number
    }
  },
  data(){
    return {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      recordsList: [],
      requirementId: ''
    }
  },
  created(){
    this.requirementId = this.$route.query.requirementId;
  },
  mounted(){
    this.getRecords();
  },
  methods:{
    getRecords(){
      let param ={
        id: this.requirementId,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      getRequirementRecords(param).then(res=>{
        this.recordsList = res.data.data.records;
        this.total = res.data.data.total;
      })
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getRecords();
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.getRecords();
    },
    tableHeader(){
      return 'color: #000;'
    }
  }
}
</script>

<style scoped>
.records-pagination{
  margin: 10px 0;
  text-align: right;
}
.title{
  margin-bottom:20px;
  color:#303133;
  font-size: 14px;
  font-weight:600
}
</style>