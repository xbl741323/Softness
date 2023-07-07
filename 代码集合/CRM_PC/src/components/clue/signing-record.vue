<template>
  <div class="signing-frame">
    <span class="signing">签约记录</span>
    <el-table :data="signRecord" border class="signingTable">
      <el-table-column label="签约时间" prop="signTime"></el-table-column>
      <el-table-column label="合同编号" prop="contractNo">
        <template slot-scope="scope">
          <div v-if="source || sourceType">
            <span>{{ scope.row.contractNo }}</span>
          </div>
          <div v-else>
            <span v-if="type == 0" id="handle-style" @click="toDetail(scope.row)">{{ scope.row.contractNo }}</span>
            <span v-if="type == 1">{{ scope.row.contractNo }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品名称">
        <template slot-scope="scope">
          <div>{{scope.row.productName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="合同金额">
        <template slot-scope="scope">
         <span v-if="scope.row.totalAmount!==null">{{ scope.row.totalAmount|moneyFilter }}</span>
         <span v-else>待定</span>
        </template>
      </el-table-column>
      <el-table-column label="线索归属" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.orderSource == 1">
            <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ scope.row.userBelongNo +' '+ $t('message.emp') + scope.row.userBelongDeptName" placement="right">
              <span>{{ scope.row.userBelongName }}</span>
            </el-tooltip>
          </div>
           <div v-if="scope.row.orderSource == 0">
            <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ scope.row.clueBelongNo +' '+ $t('message.emp') + scope.row.clueBelongDeptName" placement="right">
              <span>{{ scope.row.clueBelongName }}</span>
            </el-tooltip>
           </div>
        </template>
      </el-table-column>
      <el-table-column label="业务员" align="center">
        <template slot-scope="scope">
          <div>
            <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ scope.row.salesmanNo +' '+ $t('message.emp') + scope.row.salesmanDeptName" placement="right">
              <span>{{ scope.row.salesmanName }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="sizes, prev, pager, next, total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size= pageSize
      :total='total'>
    </el-pagination>
  </div>
</template>

<script>
import { getRecords } from '@/api/dep-areas/department-areas'
export default {
  props:{
    infoData:{
      type: Object,
      required: true
    },
    type:{
      required: false
    },
    source:{
      required: false
    },
    sourceType:{
      type:Boolean
    }
  },
  data(){
    return{
      signingNo: '',
      pageSize: 20,
      currentPage: 1,
      total: 0,
      signRecord:[]
    }
  },
  filters:{
    moneyFilter(val){
      if(val==null){
        return ""
      }else{
        return (val/100).toFixed(2)
      }
    },
  },
  mounted(){
    console.log(this.source,'e')
    this.signingNo = this.infoData.id;
    this.getSingningRecords();
  },
  methods:{
    toDetail(row){
      this.$router.push({
        path:'/contracts-detail',
        query: {
          id: row.contractId
        }
      })
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.getSingningRecords();
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getSingningRecords();
    },
    getSingningRecords(){
      let param = {
        clueId: this.signingNo,
        size: this.pageSize,
        current: this.currentPage,
      }
      if(this.type == 0&&!this.source){
        param.clueOrUserBelongFlag = true
      }
       getRecords(param,true).then(res=>{
        this.signRecord = res.data.data.records
        this.total = res.data.data.total
      })
    }
  }
}
</script>

<style scoped>
.signing-frame{
  padding: 10px 100px 200px 0;
}
.signing{
  padding-left: 5px;
  border-left: 3px solid #36A6FE;
  margin: 10px;
  font-size: 16px;
}
.pagination{
  float: right;
}
.signingTable{
  margin: 10px;
}
#handle-style{
  color: rgb(64, 158, 255) !important;
  cursor: pointer
}
</style>