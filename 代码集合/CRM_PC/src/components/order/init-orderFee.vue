<template>
  <div>
    <span class="receivable-span">费用信息</span>
    <el-table class="table-fee" ref="multipleTable" :data="orderFeeList" border show-summary :summary-method="getonlineSummaries" :span-method="spanMethod">
      <el-table-column label="费用类型" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.costType | filteramountType }} <span>{{ scope.row.payType == 1 ? '(定金)' : scope.row.payType == 2 ? '(尾款)' : ''}}</span> </span>
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.price || '待定') | filterpayAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template>
          <span>{{buyNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总价" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price * scope.row.buyNum | filterpayAmount }}</span>
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
        <span v-if="payInfo.payChannel == 0">支付宝流水号： {{payInfo.tradeNo}}</span>
        <span v-if="payInfo.payChannel == 2">微信流水号： {{payInfo.tradeNo}}</span>
        <span v-if="payInfo.payChannel == 1" class="active-transfer" @click="showTransferImg()">查看转账凭证</span>
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
import { getPayRecords } from "@/api/order/index.js"
import * as CodeMsg from "@/api/common/CodeChange"
import orderData from '@/components/order/order-data.js'
import TechnicalDetails from '@/components/shop/technicalDetails';
import { priceMixin } from './mixin.js';
export default {
  mixins:[priceMixin],
  components:{

  },
  props:{
    orderFeeVoList:{  //费用信息
      type: Array,
      require: true,
      default: ()=>{
        return [];
      }
    },
    tailStatus:{  //尾款状态
      type: Number
    },
    waitingPay:{ //是否存在待支付
      type: Boolean
    }
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
      totalAmount:null,
      source:'',
      payType: '',
      buyNum: 0,
      orderFeeList: [],
      finalWaiting: false,
      orderList: []
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
    filteramountType(val){
      if(val == 1){
        return '代理费';
      }else if(val == 2){
        return '第三方费用';
      }else if(val == 3){
        return '官费';
      }else if(val == 4){
        return '尾款';
      }else{
        return '待定'
      };
    },
    filterpayAmount(val){
      if(val == 0){
        return '待定'
      }
      return (val);
    }
  },
  mounted(){
    this.source = this.$route.query.source;
    let sum = 0
    this.orderList = this.orderFeeVoList.filter(item=>{
      return item.price != 0;
    })
    if(this.orderList && this.orderList.length > 0){
      try {
        this.orderList.forEach(item=>{
          if(item.payType == 2 && !item.price){
            this.finalWaiting = true;
            sum = '待定'
            throw new Error();
          }else{
            sum += item.price;
          };
        })
      } catch (error) {
        
      };
      this.totalAmount = sum * this.orderList[0].buyNum; //支付总金额
      this.buyNum = this.orderList[0].buyNum;
      this.payType = this.orderList[0].payType;
      this.orderFeeList = this.orderList;
    }

  },
  methods:{
    handlerefresh(){
      this.$parent.getDetail();
    },
    showTransferImg(){
      this.srcList = [
        this.preUrl,
        this.preUrl
      ]
      this.$refs.preview.showViewer = true
    },
    handleClose(){
      this.payVisible = false
    },
    getPayRecordsData(id){
      getPayRecords(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.payInfo = res.data.data
          this.preUrl = this.imgUrl+this.payInfo.url
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
      return orderData.getInitSummaries(param,{totalAmount: this.totalAmount, payType: this.payType, buyNum: this.buyNum, finalWaiting: this.finalWaiting});
    },
    spanMethod({ row, rowIndex, column, columnIndex }){

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
</style>