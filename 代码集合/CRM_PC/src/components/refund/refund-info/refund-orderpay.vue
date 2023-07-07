<template>
  <div>
    <div class="list-header">
      <p class="rectangle"></p>
      <b class="text">退款信息</b>
    </div>
    <el-table
      v-if="payInfo && handlers"
      :data="payInfo"
      :header-cell-style="{ background: '#FAFAFA',color:'#000000D9' }"
      border
      show-summary
      :span-method="changeRow"
      :summary-method="getSummaries"
      style="margin-bottom: 30px"
    >
      <el-table-column prop="payTime" label="支付时间" width="180"></el-table-column>
      <el-table-column prop="payChannel" label="支付方式" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.payChannel | payType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amountType" label="退款类型">
        <template slot-scope="scope">
          <p><span>{{ scope.row.costTypeId | filterCostType }}</span>{{ scope.row.payTypeId == 1 && scope.row.costTypeId != 3 ? '(定金)' : scope.row.payTypeId == 2 ? '(尾款)' : '' }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="费用单价(元)" ></el-table-column>
      <el-table-column prop="refundNum" label="退款数量" ></el-table-column>
      <el-table-column prop="payAmount" label="支付金额" align="center">
        <template slot-scope="scope">
          <p class="pay-amount">{{ scope.row.payAmount }}</p>
          <p class="pay-record" @click="payRecord(scope.row)">付款记录</p>
        </template>
      </el-table-column>
      <el-table-column prop="refundAmount" label="可退款金额(元)" >
        <template slot-scope="scope" >
          <span v-if="handlers.refundStep == 1">待分配</span>
          <span v-else-if="scope.row.refundAmount || handlers.refundStep>1">{{ scope.row.refundAmount ? scope.row.refundAmount:0 }}</span>
          <span v-else-if="scope.row.allIn">{{ scope.row.price * scope.row.refundNum}}</span>
          <span v-else>待确认</span>
        </template>
      </el-table-column>
      <el-table-column prop="refundStatus" label="退款状态">
        <template slot-scope="scope">
          <span>{{ scope.row.refundStatus | refundState }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 付款记录 -->
    <el-dialog title="付款记录" :visible.sync="payDialog" width="400px">
      <p>支付方式：{{payRecords.payChannel | payType}}</p>
      <p>支付时间：{{payRecords.payTime}}</p>
      <p>{{payRecords.payChannel == 1 ? '对公转账' : payRecords.payChannel == 2 ? '微信': '支付宝'}}流水号：{{payRecords.tradeNo}}</p>
      <p v-if="payRecords.payChannel == 1" class="refund-success" @click="getPreview(payRecords.tradeNo)">查看转账凭证</p>
    </el-dialog>
    <!-- 退款记录 -->
    <el-dialog title="退款记录" :visible.sync="refundDialog" width="400px">
      <p>支付方式：{{refundRecords.payChannel | payType}}</p>
      <p>支付时间：{{refundRecords.refundTime}}</p>
      <p v-if="refundRecords.payChannel == 0">支付宝流水号：{{refundRecords.refundCertificate}}</p>
      <p v-if="refundRecords.payChannel == 2">微信流水号：{{refundRecords.refundCertificate}}</p>
      <p v-if="payRecords.payChannel == 1">对公转账流程号：{{payRecords.payCertificate}}</p>
      <p v-if="refundRecords.payChannel == 1" class="refund-success" @click="preview(refundRecords.refundCertificate)">查看转账凭证</p>
    </el-dialog>

    
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
import refundDataJs from '../refund'
import orderData from '@/components/order/order-data'
import {getTrTaskOrderByTaskNo} from "@/api/processmanage/refund";
export default {
  props:{
    payInfo:{
      type: Array,
      default:[]
    },
    orderType:{
      type: Number
    },
    handlers:{
        type: Object,
        default:{},
    },
  },
  data(){
    return {
      refundDialog: false,
      payDialog: false,
      refundRecords: {},
      payRecords: {},
      srcList:[],
      preUrl:'',
      showViewer: false,
      imgUrl: process.env.VUE_APP_IMAGE_BASEURL,
      mergeRules: null,
    }
  },
  filters:{
    payType(val){
      return refundDataJs.payType(val);
    },
    filterPrice(val){
      return refundDataJs.filterPrice(val);
    },
    refundState(val){
      return refundDataJs.refundStatus(val);
    },
    filterAmount(val){
      return refundDataJs.filterAmount(val);
    },
    policyFeeType(val){
      return refundDataJs.policyFeeType(val);
    },
    filterCostType(val){
      return refundDataJs.filterCostType(val);
    }
  },
  methods:{
    getPreview(data){
      getTrTaskOrderByTaskNo(data).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.preUrl = this.imgUrl + res.data.data.voucherUrl;
          this.srcList = [this.preUrl]
          this.$refs.preview.showViewer = true
        }
      })
    },
    changeRow({ row, column, rowIndex, columnIndex }){    
      if (columnIndex === 4) {
          if (rowIndex % this.payInfo.length === 0) {
              return {
                  rowspan: this.payInfo.length,
                  colspan: 1
              };
          } else {
              return {
                  rowspan: 0,
                  colspan: 0
              };
          }
      };
      return orderData.spanMethod({ row, column, rowIndex, columnIndex },{payType: this.payInfo[0].payTypeId, orderFeeVoList: this.payInfo},5);
    },
    preview(img){
      console.log(img);
      this.preUrl = this.imgUrl + img;
      this.srcList = [
        this.preUrl,
        this.preUrl,
      ]
      this.$refs.preview.showViewer = true
    },
    refundRecord(row){
      this.refundRecords = row;
      this.refundDialog = true;
    },
    payRecord(row){
      this.payRecords = row
      this.payDialog = true;
    },
    getSummaries(params){
      let all = this.handlers.totalAmount;
      return refundDataJs.getSummaries(params,all,this.handlers.refundStep)
    }
  },
}
</script>

<style scoped>
  @import url('../refund.css');
</style>