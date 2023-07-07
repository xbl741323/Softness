<!--排查完成-->
<template>
  <div>
    <span class="receivable-span">费用信息</span>
    <el-button size="mini" v-if="((((orderInfo.orderStatus == 0 ||orderInfo.orderStatus == 1 || ((orderInfo.tailStatus == 0 || orderInfo.tailStatus == 1)&&((orderInfo.orderStatus == 2||orderInfo.orderStatus == 3)&&(auditStatus||!orderInfo.tmOrderPayment))))) && orderInfo.changePriceStatus != 1)&&(filterState(portType, orderList.exportList, 'change') || (permissions.bt_change_price_product_my && $route.query.source == 'personal')))&&!userInfo.isPartner"  @click="EditPrice($route.query.orderId)">改价</el-button>
    <el-table class="table-fee" ref="multipleTable" :data="list" border show-summary :summary-method="getonlineSummaries" :span-method="spanMethod" >
      <el-table-column label="支付金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price * scope.row.buyNum | filterpayAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用类型" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.costType | filteramountType }} <span v-if="scope.row.payType == 1">(定金)</span> </span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.payType == null"></span>
          <span v-else>{{ scope.row.payTime || '/'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payChannel | filterpayType  }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="支付状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.payStatus==1" class="pay-column-sty">
            <span>已支付</span>
            <span class="pay-record-sty" @click="showPayRecord(scope.row)">付款记录</span>
          </div>
          <div v-else>
            <div>待付款</div>
            <div>{{scope.row.voucherStatus==0?'对公转账审核中':(scope.row.voucherStatus==2?'对公转账审核未通过':'') }}</div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="支付状态" align="center">
        <template slot-scope="{row}">
          <!-- <el-button type="text" v-if="row.payType == 3 && row.payStatus != 2" @click="EditPrice(row.id)">改价</el-button> -->
          <div v-if="row.payStatus == 2" class="pay-column-sty">
            <span>已支付</span>
            <span class="pay-record-sty" @click="showPayRecord(row)">付款记录</span>
          </div>
          <div v-else>
            <div>待付款</div>
            <div>{{row.payChannel == 1 && row.payStatus == 1 ?'对公转账审核中':(row.payChannel == 1 && row.payStatus == 3 ?'对公转账审核未通过':'') }}</div>
          </div>
        </template>
      </el-table-column>
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
            <div class="refundNote" @click="showRefundInfo(scope.row)" v-if="scope.row.refundStatus == 4">退款支付记录</div>
          </div>
          <div v-else>/</div>
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
      <div class="pay-content">
        <span>支付方式：{{payInfo.payChannel | payFilter}}</span>
        <span>支付时间：{{payInfo.payTime}}</span>
        <span>流程编号：{{payInfo.tradeNo}}</span>
        <span v-if="payInfo.payChannel == 0">支付宝流水号： {{payInfo.tradeNo}}</span>
        <span v-if="payInfo.payChannel == 2">微信流水号： {{payInfo.tradeNo}}</span>
        <span v-if="payInfo.payChannel == 1" class="active-transfer" @click="showTransferImg(payInfo.tradeNo, 0)">查看转账凭证</span>
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
    <!-- 订单改价 -->
    <el-dialog title="订单改价"  :visible.sync="changepriceDialog"  width="1100px" :close-on-click-modal="false">
      <onlinechangeprice v-if="changepriceDialog"   :priceObject="priceObject" :finalPriceTypeNum="finalPriceTypeNum" :hasFinalprice="hasFinalprice" :routerType="routerType" :source="source" @closeChangePriceDialog="closeChangePriceDialog" @handlerefresh="handlerefresh" :portType="portType"></onlinechangeprice>
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
  </div>
</template>

<script>
import orderList from "@/views/order/order-data.js";
import { getPayRecords, getTrTaskOrderByTaskNo, getRefundRequest } from "@/api/order/index.js"
import * as CodeMsg from "@/api/common/CodeChange"
import orderData from '@/components/order/order-data.js'
import Onlinechangeprice from './onlinechangeprice.vue'
import { priceMixin } from '../mixin.js';
import { mapGetters,mapState } from 'vuex';
export default {
  mixins:[priceMixin],
  components:{
    Onlinechangeprice
  },
  props:{
    orderFeeVoList:{  //费用信息
      type: Array,
      required: true
    },
    tailStatus:{  //尾款状态
      type: Number
    },
    waitingPay:{ //是否存在待支付
      type: Boolean
    },
    orderInfo:{
      type: Object
    },
    auditStatus:{
      type: Boolean
    },
    portType:{
      type:String
    },
    routerType:{
      type:String,
      required:false
    }
  },
  data(){
    return {
      orderList: null,
      imgUrl:
        process.env.NODE_ENV == "production"
          ? "//static.wotao.com/"
          : "//static-tst.wotao.com/",
      showTransfer:false,
      payInfo:{},
      srcList:[],
      preUrl:"",
      payVisible:false,
      totalAmount:null,
      source:'',
      payType: '',
      list: [],
      refundNote: false,
    }
  },
  filters:{
    payFilter(val){
      return val == 0 ? "支付宝" : val == 1 ? "对公转账" : val == 2 ? "微信支付" : "";
    },
    filterpayType(val){
      if(val == 0){
        return '支付宝'
      }else if(val == 1){
        return '对公转账'
      }else if(val == 2){
        return '微信'
      }else{
        return '/'
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
    filteramountType(val){
      if(val == 1){
        return '代理费';
      }else if(val == 2){
        return '第三方费用';
      }else if(val == 3){
        return '官费';
      }else if(val == 4){
        return '尾款';
      };
    },
    filterpayAmount(val){
      try {
        if(val == 0){
          return '待定'
        }
        return (val).toFixed(2);
      } catch (error) {
        
      }
    }
  },
  computed: {
       ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    ...mapGetters(['permissions'])
  },
  created(){
    this.source = this.$route.query.source;
    this.orderList = orderList;
  },
  mounted(){
    let sum = 0
    let orderFeeVoList = this.orderFeeVoList.filter(item=>{
      return item.price != 0 || item.costType == 4;
    })
    try {
      orderFeeVoList.forEach(item=>{
        if(item.costType == 4 || item.costType == null || item.payAmount == 0){
          sum = '待定';
          throw new Error();
        }else{
          sum += item.price;
        }
      })
    } catch (error) {
      
    };
    this.totalAmount = sum == '待定' ? '待定' : sum * orderFeeVoList[0].buyNum; //支付总金额
    this.payType = orderFeeVoList[0].payType;
    this.list = orderFeeVoList;
  },
  methods:{
    //获取退款请求信息
    showRefundInfo(val) {
      getRefundRequest(val.paymentId).then(res => {
        this.payInfo = res.data
        this.refundNote = true
      })
    },
    closeChangePriceDialog(val){
      this.changepriceDialog = val;
      this.$parent.$parent.$parent.getDetail();
    },
    handlerefresh(){
      this.$parent.getDetail();
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
    getPayRecordsData(id){
      getPayRecords(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.payInfo = res.data.data
        }
      })
    },
    // 已付款状态点击出现付款信息弹框
    showPayRecord(row){
      // this.getPayRecordsData(row.id)
      this.payInfo = row;
      this.payVisible = true
    },
    getonlineSummaries(param){
      return orderData.getonlineSummaries(param,{totalAmount: this.totalAmount, payType: this.payType});
    },
    spanMethod(param){
      return orderData.spanMethod(param,{payType: this.payType, orderFeeVoList: this.list});
    }
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
  margin-right: 15px;
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
.table-fee{
  margin-top: 20px;
}
.refundNote{
  color: #36a6fe;
}
.refundNote:hover{
  cursor: pointer;
}
</style>