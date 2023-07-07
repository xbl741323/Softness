<template>
  <div>
    <span class="operate_lab">操作记录</span>
    <el-table :data="orderOperateData" border class="order_operate_table" :cell-style="rowSty">
      <el-table-column label="操作时间" width="150" prop="gmtCreate"></el-table-column>
      <el-table-column label="操作人" width="180">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.operateNo +'   部门：'+scope.row.operateDeptName" placement="top">
             <p><img src="/img/disable.png" class="dispicture" v-if="scope.row.sysUserLockFlag == 9" alt="" />{{scope.row.operateName}}</p> 
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作内容">
        <template slot-scope="scope">
          <span class="operate_title">{{scope.row.operateContent}} </span>
          <span class="operate_content" v-if="scope.row.operateContentCopy ">：{{scope.row.operateContentCopy}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { orderOperate } from '@/api/order/index'
export default {
  props:{
    orderId:{
      type: Number,
      required: true
    }
  },
  data(){
    return {
      orderOperateData:[],
      pageSize: 20,
      currentPage: 1,
      total: 0
    }
  },
  mounted(){
    this.getOrderOperate();
  },
  methods:{
    rowSty({row,column,rowIndex,columnIndex}){
        return {'padding': '1px 0'}
    },
    getOrderOperate(){
      let param = {
        orderId: this.orderId,
        page: this.currentPage,
        size: this.pageSize
      }
      orderOperate(param).then(res=>{
        this.orderOperateData = res.data.data.data.records;
        this.total = res.data.data.data.total;
      }).catch(err=>{
        return err;
      })
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.getOrderOperate();
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getOrderOperate();
    },
  }
}
</script>

<style scoped>
.operate_lab{
  padding-left: 5px;
  border-left: 3px #36a6fe solid;
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