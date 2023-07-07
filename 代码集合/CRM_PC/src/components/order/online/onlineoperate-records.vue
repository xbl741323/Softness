<template>
  <div>
    <div class="operate_lab">操作记录</div>
    <div v-if="!this.source">
      <el-table :data="orderOperateData" border class="order_operate_table" :cell-style="rowSty">
        <el-table-column label="操作时间" width="150" prop="gmtCreate"></el-table-column>
        <el-table-column label="操作人" width="180">
          <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.operateDeptName" placement="top" v-if="scope.row.operateNo && scope.row.operateNo.indexOf(8)==0">
                <p><img src="/img/disable.png" class="dispicture" v-if="scope.row.userLockFlag && scope.row.userLockFlag ==0" alt="" />{{scope.row.operateName}}</p>
              </el-tooltip>
              <el-tooltip effect="dark" :content="'工号：'+scope.row.operateNo +'   部门：'+scope.row.operateDeptName" placement="top" v-else>
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
    <div v-else>
      <el-table :data="orderOperateData" border class="order_operate_table" :cell-style="rowSty">
        <el-table-column label="操作时间" width="150" prop="createTime"></el-table-column>
        <el-table-column label="操作人" width="180">
          <template slot-scope="scope">
            <div class="table-line-height">用户 {{ scope.row.createByNo }}</div>            
          </template>
        </el-table-column>
        <el-table-column label="操作内容" prop="content"></el-table-column>
      </el-table>

    </div>
    
  </div>
</template>

<script>
import { orderOperate } from '@/api/order/index'
import { getTmFileOrderLogByOrderId } from '@/api/order/document'
export default {
  props:{
    orderId:{
      type: Number,
      required: true
    },
    source:{ //文档订单操作记录
      type: String,
      default: null
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
      let url = this.source ? getTmFileOrderLogByOrderId : orderOperate;
      let data = this.source ? this.orderId : param;
      url(data).then(res=>{
        this.orderOperateData = this.source ? res.data.data : res.data.data.data.records;
        this.total = this.source ? null : res.data.data.data.total;
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
  padding-left: 8px;
  height: 18px;
  line-height: 18px;
  font-size: 14px;
  border-left: 4px #36a6fe solid;
  margin-bottom: 20px;
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
.table-line-height{
  line-height: 32px !important;
}
.dispicture{
    width: 15px;
    height: 15px;
    position: relative;
    top: 3px;
}
</style>