<template>
  <div v-if="orderArray.length>0">
    <div class="list-header">
      <p class="rectangle"></p>
      <b class="text">订单信息</b>
    </div>
    <el-table
      :data="orderArray"
      :header-cell-style="{ background: '#FAFAFA',color:'#000000D9' }"
      border
      style="margin-bottom: 30px"
    >
    <!-- payType支付类型(1:定金；2:尾款；3:一口价),
  costType费用类型（1:代理费;2:第三方费用;3:官费;4:待定） -->
      <el-table-column prop="orderTime" label="订单时间" width="180"></el-table-column>  
      <el-table-column prop="orderNo" label="订单编号" width="180"></el-table-column>
      <el-table-column prop="thirdOrderNo" label="电商编号" width="180">
        <template slot-scope="scope">
          <p v-if="scope.row.thirdOrderNo">{{ scope.row.thirdOrderNo }}</p>
          <p v-else>/</p>
        </template>
      </el-table-column>
      <el-table-column prop="spuName" label="产品名称" width="180"></el-table-column>
      <el-table-column :key="Math.random()" v-if="orderArray[0].costType1payType1" prop="costType1payType1" label="代理费(定金)单价"></el-table-column>
      <el-table-column :key="Math.random()" v-if="orderArray[0].costType1payType3" prop="costType1payType3" label="代理费"></el-table-column>
      <el-table-column :key="Math.random()" v-if="orderArray[0].costType2payType1" prop="costType2payType1" label="第三方(定金)单价"></el-table-column>
      <el-table-column :key="Math.random()" v-if="orderArray[0].costType2payType3" prop="costType2payType3" label="第三方单价"></el-table-column>
      <el-table-column :key="Math.random()" v-if="orderArray[0].governmentFee" prop="governmentFee" label="官费单价"></el-table-column>
      <el-table-column :key="Math.random()" v-if="orderArray[0].costType1payType2" prop="costType1payType2" label="代理费(尾款)单价"></el-table-column>
      <el-table-column :key="Math.random()" v-if="orderArray[0].costType2payType2" prop="costType2payType2" label="第三方(尾款)单价"></el-table-column>
      <el-table-column prop="buyNum" label="数量" width="70"></el-table-column>
      <el-table-column prop="totalAmount" label="订单总价"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import refundDataJs from '../refund'
export default {
  props:{
    orderArray:{
      type: Array,
      default:[]
    }
  },
  data(){
    return {

    }
  },
  filters:{
    filterPrice(val){
      return refundDataJs.filterPrice(val);
    }
  },
  mounted(){
    setTimeout(()=>{
      console.log(this.orderArray,'llllllllllllllll');
    },500)
  }
}
</script>

<style scoped>
  @import url('../refund.css');
</style>