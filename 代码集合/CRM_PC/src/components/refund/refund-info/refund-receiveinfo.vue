<template>
  <div>
    <!-- 回款信息 -->
    <div class="list-header">
      <p class="rectangle"></p>
      <b class="text">回款信息</b>
    </div>
    <el-table
      :data="refundArray"
      :header-cell-style="{ background: '#FAFAFA' ,color:'#000000D9'}"
      border
      style="margin-bottom: 30px"
    >
      <el-table-column prop="receiveNo" label="回款编号" width="180">
      </el-table-column>
      <el-table-column prop="contractNo" label="合同编号" width="180">
      </el-table-column>
      <el-table-column prop="receiveAmount" label="回款金额">
        <template slot-scope="scope">
          <span>{{ scope.row.receiveAmount | filterPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payerName" label="付款方名称">
      </el-table-column>
      <el-table-column prop="amountType" label="费用类型">
        <template slot-scope="scope">
          <span>{{ scope.row.amountType | filterAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveDirectionName" label="回款去向">
      </el-table-column>
      <el-table-column prop="claimName" label="认领人">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content=" '工号：' + scope.row.claimNo + '   部门：' +scope.row.claimDeptName" placement="right">
            <span>{{ scope.row.claimName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="receiveTime" label="回款时间">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import refundDataJs from '../refund'
export default {
  props:{
    refundArray:{
      type: Array,
      default: []
    }
  },
  filters:{
    filterAmount(val){
      return refundDataJs.filterAmount(val);
    },
    filterPrice(val){
      return refundDataJs.filterPrice(val);
    }
  }
}
</script>

<style scoped>
  @import url('../refund.css');
</style>