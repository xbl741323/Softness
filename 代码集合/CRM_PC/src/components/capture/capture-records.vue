<template>
  <div>
    <p>操作记录</p>
    <el-table border :data="recordsList">
      <el-table-column label="标题" prop="titles"></el-table-column>
      <el-table-column label="网址" prop="url"></el-table-column>
      <el-table-column label="操作时间" prop="createTime"></el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.number +'   部门：'+scope.row.deptName" placement="top">
            <span>{{scope.row.createName}}({{scope.row.number}})</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作内容" prop="type"></el-table-column>
    </el-table>
    <div class="pagina">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { records } from '@/api/capture-data/index'
export default {
  data(){
    return {
      currentPage: 1,
      pageSize: 20,
      total: 0,
      recordsList: []
    }
  },
  mounted(){
    this.getRecords();
  },
  methods:{
    getRecords(){
      let param ={
        size: this.pageSize,
        start: this.currentPage
      };
      records(param).then(res=>{
        this.recordsList = res.data.data.list;
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
  }
}
</script>

<style scoped>
.pagina{
  margin-top: 10px;
  text-align: right;
}
</style>