<!--排查完成-->
<template>
  <div>
    <p class="receivable-span">费用信息</p>
    <el-table ref="multipleTable" :data="payMessageList" border show-summary :summary-method="getonlineSummaries">
      <el-table-column label="支付时间"  align="center">
        <template slot-scope="scope">
            <span v-if="scope.row.payType==null"></span>
            <span v-else>{{ scope.row.payStatus==0?scope.row.gmtCreate: scope.row.payTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.payType | filterpayType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.payAmount | filterpayAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用类型"  align="center" >
        <template slot-scope="scope">
            <span>{{ scope.row.amountType | filteramountType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center">
        <template slot-scope="scope">
            <div v-if="scope.row.payStatus==1" class="pay-column-sty">
              <span>已支付</span>
              <span class="pay-record-sty" @click="showPayRecord(scope.row, 0)">付款记录</span>
            </div>
            <div v-else>
                <div>待付款</div>
                <div>{{scope.row.voucherStatus==0?'对公转账审核中':(scope.row.voucherStatus==2?'对公转账审核未通过':'') }}</div>
            </div>
        </template>
        <el-table-column label="退款金额" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.refundAmount">{{ scope.row.refundAmount | filterpayAmount }}</span>
            <span v-else>/</span>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" align="center" width="300px">
          <template slot-scope="scope">
            <!-- 只显示退款成功和退款中 -->
            <div v-if="'1,2,3,4'.includes(scope.row.refundStatus)">
              <div>{{ scope.row.refundStatus | filterRefundStatus }}（流程编号：{{scope.row.refundNo}}）</div>
              <div class="refundNote" @click="refundNote = true" v-if="scope.row.refundStatus == 4">退款支付记录</div>
            </div>
            <div>/</div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center"></el-table-column>
    </el-table>
    <!-- 付款信息dialog -->
    <el-dialog
     title="付款记录"
     :visible.sync="payVisible"
     :close-on-click-modal="false"
     width="30%"
     :before-close="handleClose">
      <div class="pay-content">
        <span>支付方式：{{payInfo.payType|payFilter}}</span>
        <span>支付时间：{{payInfo.payTime}}</span>
        <span v-if="payInfo.payType == 0">支付宝流水号： {{payInfo.payWater}}</span>
        <span v-if="payInfo.payType == 2">微信流水号： {{payInfo.wxPayWater}}</span>
        <span v-if="payInfo.payType == 1" class="active-transfer" @click="showTransferImg()">查看转账凭证</span>
      </div>
     </el-dialog>
     <!-- 退款 -->
    <el-dialog title="退款记录" :visible.sync="refundNote" :close-on-click-modal="false" width="30%">
      <div class="pay-content">
        <span>退款方式：{{payInfo.refundChannel | payFilter}}</span>
        <span>退款时间：{{payInfo.createTime}}</span>
        <span v-if="payInfo.refundChannel == 0">支付宝流水号： {{payInfo.thirdRefundNo}}</span>
        <span v-if="payInfo.refundChannel == 2">微信流水号： {{payInfo.thirdRefundNo}}</span>
        <span v-if="payInfo.refundChannel == 1" class="active-transfer" @click="showTransferImg(payInfo.voucherUrl, 1)">查看转账凭证</span>
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
import * as CodeMsg from "@/api/common/CodeChange"
import { getPayRecords, getRefundRequest  } from "@/api/order/index.js"
import orderData from '@/components/order/order-data.js'
export default {
  props:{
    payMessageList:{
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
        totalReceiveAmount:null,
        payVisible:false,
        payInfo:{},
        srcList:[],
        preUrl:"",
        refundNote: false,
    }
  },
  filters:{
    payFilter(val){
      return val==0?"支付宝":val==1?"对公转账":val==2?"微信支付":"";
    },
      filterpayType(val){
         if(val==0){
             return '支付宝'
         }else if(val==1){
             return '对公转账'
         }else if(val==2){
             return '微信'
         }else{
             return ''
         }
     },
     filteramountType(val){
         if(val==0){
             return '代理费'
         }else if(val==1){
             return '第三方费用'
         }else{
             return '官费'
         }
     },
    filterpayAmount(val){
      try {
        if(val == 0){
          return '待定'
        }
        return (val).toFixed(2);
      } catch (error) {
        
      }
    },
    filterRefundStatus(val){
      switch(val) {
        case 4:
          return '退款成功'
        case 1:
        case 2:
        case 3:
          return '退款中'
        default:
          return ''
      }
    },
  },
  mounted(){
      let sum = 0
      this.payMessageList.forEach(item=>{
          sum+=item.payAmount
      })
      this.totalReceiveAmount = sum
  },
  methods:{
    //获取退款请求信息
    showRefundInfo(val) {
      console.log(val);
      getRefundRequest(val.paymentId).then(res => {
        if (res.data.code == 0) {
          console.log(res.data.data);
        }
      })
    },
    showTransferImg(tradeNo,i){
      if (i == 0) {
        getTrTaskOrderByTaskNo({tradeNo}).then(res=>{
          this.preUrl = this.imgUrl+ res.data.data.voucherUrl
          this.srcList = [
            this.preUrl,
            this.preUrl
          ]
          this.$refs.preview.showViewer = true;
        })
      } else {
        this.preUrl = this.imgUrl+ tradeNo
        this.srcList = [
          this.preUrl,
          this.preUrl
        ]
        this.$refs.preview.showViewer = true;
      }
    },
    handleClose(){
      this.payVisible = false
    },
    // 已付款状态点击出现付款信息弹框
    showPayRecord(row){
      this.getPayRecordsData(row.id)
      this.payVisible = true
    },
    getPayRecordsData(id){
      getPayRecords(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.payInfo = res.data.data
          this.preUrl = this.imgUrl+this.payInfo.url
        }
      })
    },
    getonlineSummaries(param){
      return orderData.getonlineSummaries(param,{totalReceiveAmount:this.totalReceiveAmount});
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
.pay-column-sty{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.refundNote{
  color: #36a6fe;
}
.refundNote:hover{
  cursor: pointer;
}
</style>