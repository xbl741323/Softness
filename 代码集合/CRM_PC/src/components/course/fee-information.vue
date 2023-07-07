<template>
  <div>
    <p class="receivable-span">费用信息</p>
    <el-table ref="multipleTable" :data="orderFeeList" border show-summary :summary-method="getTotal">
      <el-table-column label="支付时间" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.payStatus==2?scope.row.payTime: ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
            <span v-if="scope.row.payStatus==2">{{ scope.row.payType | payType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.feeAmout | feeAmout}}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用类型" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.feeType | feeType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center">
        <template slot-scope="scope">
            <div v-if="scope.row.payStatus==2" class="pay-column-sty">
              <span>支付成功</span>
              <span class="pay-record-sty" @click="showPayRecord(scope.row)">付款记录</span>
            </div>
            <div><span v-if="scope.row.payStatus==0||scope.row.payStatus==1">待付款</span></div>
            <div><span v-if="scope.row.payStatus==3">支付失败</span></div>
            <div><span v-if="scope.row.payStatus==4">取消支付</span></div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 付款信息dialog -->
    <el-dialog
     title="付款记录"
     :visible.sync="payVisible"
     :close-on-click-modal="false"
     width="30%"
     :before-close="handleClose">
      <div class="pay-content" >
        <span>支付方式：{{payInfo.payType | payType}}</span>
        <span>支付时间：{{payInfo.payTime}}</span>
        <span v-if="payInfo.payType == 0">支付宝流水号： {{payInfo.tradeNo}}</span>
        <span v-if="payInfo.payType == 2">微信流水号： {{payInfo.tradeNo}}</span>
        <span v-if="payInfo.payType == 1" class="active-transfer" @click="showTransferImg()">查看转账凭证</span>
      </div>
     </el-dialog>

     <!-- 预览 -->
    <div class="demo-image__preview image_fix_sty">
     <el-image 
       ref="preview"
       style="width: 0px; height: 0px"
       :src="preUrl" 
       :preview-src-list="srcList">
     </el-image>
    </div>
  </div>
</template>

<script>
import orderData from '@/components/course/order-data.js'
export default {
  props:{
    orderFeeList: {
      type: Array,
      required: true
    },
  },
  data(){
    return {
      imgUrl:
        process.env.NODE_ENV == "production"
          ? "//static.wotao.com/"
          : "//static-tst.wotao.com/",
      showTransfer:false,
      payInfo:{},
      srcList:[],
      preUrl:"",
      payVisible:false,
      totalReceiveAmount:null,
    }
  },
  filters:{
    payType(value){
      return orderData.payType(value);
    },
    feeType(value){
       return orderData.feeType(value);
    },
    feeAmout(value){
       return orderData.payAmount(value);
    }
  },
  mounted() {
    let sum = 0;
    this.orderFeeList.forEach(item =>{
      sum += item.feeAmout;
    })
    this.totalReceiveAmount = sum;
  },
  methods:{
    showTransferImg(){
      this.srcList = [
        this.preUrl,
        this.preUrl
      ]
      this.$refs.preview.showViewer = true
      console.log(this.$refs.image,"image")
    },
    handleClose(){
      this.payVisible = false
    },
    // 已付款状态点击出现付款信息弹框
    showPayRecord(row){
      this.payInfo = row;
      this.payVisible = true
    },
    getTotal(param){
      return orderData.getSummaries(param,{totalReceiveAmount:this.totalReceiveAmount});
    },
  }
}
</script>

<style scoped>
.fee-type{
  display: flex;
  margin: 20px 0;
}
.check-all{
  margin-right: 20px;
}
.receivable-span{
  line-height: 100%;
  padding-left: 5px;
  border-left: 3px solid #36a6fe;
}
.pay-column-sty{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pay-record-sty{
  color: #999999;
  cursor: pointer;
}
.pay-record-sty:hover{
  color: #36a6fe;
}
.pay-content{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.pay-content span{
  margin-bottom: 20px;
}
.active-transfer{
  color: #36a6fe;
  cursor: pointer;
}
</style>
<style>
.el-table__footer-wrapper {
  font-size: 14px;
  font-weight: 550;
}
.receive_refund_amount{
  /* position: absolute; */
  background: #ffcc9970;
  /* border-color: #ffcc99; */
  color: #ff6600;
  padding: 3px;
  border-radius: 5px;
  margin-left: 2px;
}
.image_fix_sty{
  position: absolute;
  top: 0;
  z-index: 10000;
}
.el-image-viewer__close{
  background: rgb(238, 235, 235) !important;
}
</style>