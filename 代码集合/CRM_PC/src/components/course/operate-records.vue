<template>
  <div>
    <span class="operate_lab">操作记录</span>
    <el-table :data="operateList" border class="order_operate_table" :cell-style="rowSty">
      <el-table-column label="操作时间" width="150" prop="createTime" align="center"></el-table-column>
      <el-table-column label="操作人" width="180" prop="operatorNo" align="center"></el-table-column>
      <el-table-column label="操作内容" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.operateContent}} </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props:{
    operateList:{
      type: Array,
      required: true
    }
  },
  data(){
    return {
      pageSize: 20,
      currentPage: 1,
      total: 0
    }
  },
  mounted(){
    
  },
  methods:{
    rowSty({row,column,rowIndex,columnIndex}){
        return {'padding': '10px 0'}
    }
  }
}
</script>

<style scoped>
.operate_lab{
  padding-left: 5px;
  border-left: 3px #36a6fe solid;
  font-size: 14px;
}
.order_operate_table{
  margin:10px 0;
}
.operate_title{
  font-size: 14px;
  font-weight: 550;
}
.operate_content{
  font-size: 12px;
  color: #666;
}
.dispicture{
    width: 15px;
    height: 15px;
    position: relative;
    top: 3px;
}
</style>