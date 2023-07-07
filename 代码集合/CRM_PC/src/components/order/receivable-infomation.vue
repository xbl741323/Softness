<template>
  <div>
    <p class="receivable-span">回款信息</p>
    <div class="fee-type">
      <span>费用类型：</span>
      <el-checkbox class="check-all" v-model="checkAll">全部</el-checkbox>
      <el-checkbox-group v-model="priceType" @change="getList(),checkAll = false">
        <el-checkbox 
          v-for="item in feeTypeList"
          :key="item.value"
          :label="item.value"
        >{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div style="margin:20px 0"><el-button type="primary" @click="mergeApply">合并申请开票</el-button></div>
    <el-table ref="multipleTable" :data="dataList" border @select-all="selectAll" @select="selectRow" @selection-change="handleSelectionChange" show-summary :summary-method="getSummaries">
      <el-table-column type="selection"  :selectable='handleSelectable' width="53"></el-table-column>
      <el-table-column label="回款时间" prop="receiveTime" align="center"></el-table-column>
      <el-table-column label="回款编号" prop="receiveNo" align="center"></el-table-column>
      <el-table-column label="回款金额(元)" prop="receiveAmount" :formatter="receiveAmount" align="center"></el-table-column>
      <el-table-column label="费用类型" prop="amountType" :formatter="amountType" align="center"></el-table-column>
      <el-table-column label="尾款金额(元)" align="center" width="200">
        <template slot-scope="scope">
          <span style="position: relative">{{scope.row.tailAmount | tailAmount}}
            <span v-if="scope.row.refundStatus == 1" class="receive_refund_amount">退款+{{scope.row.refundAmount | tailAmount}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="认领人" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.claimNo +'   部门：'+scope.row.claimDeptName" placement="top">
            <span>{{scope.row.claimName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column label="退款金额(元)" align="center"></el-table-column> -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="applyInvoicing (scope.row,0,scope.row.invoiceShowStatus)" >{{scope.row.invoiceShowStatus==1?"查看发票":scope.row.invoiceShowStatus==0?"申请开票":""}}</el-button>
          <el-button type="text" @click="applyRefund(scope.row)" v-if="scope.row.isRefund == 0">申请退款</el-button>
          <el-button type="text" v-if="scope.row.isRefund == 1" @click="checkRefundDetail(scope.row,scope.row.receiveNo)" >查看退款</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 申请开票 -->
    <el-dialog :visible.sync="invoicingDialog" :title="applyInvoicingTitle" width="800px" >
      <invoicing-apply v-if="invoicingDialog" @closeRefundDialog="closeRefundDialog" :source="source"  :invoicingInfo="invoicingInfo"  />
    </el-dialog>
    <!-- 查看发票 -->
    <el-dialog :visible.sync="invoicingDetailDialog" title="查看发票" width="800px" >
      <order-invoicing-detail v-if="invoicingDetailDialog" @closeRefundDialog="closeRefundDialog" @applyInvoicing="applyInvoicing" :source="source" :row="row" :receiveNo="receiveNo"  />
    </el-dialog>
    <!-- 申请退款 -->
    <el-dialog :visible.sync="refundDialog" title="申请退款" :close-on-click-modal="false">
      <refund-apply v-if="refundDialog" :receiveInfo="receiveInfo" :source="source" @closeRefundDialog="closeRefundDialog" />
    </el-dialog>
    <!-- 查看退款 -->
    <el-dialog :visible.sync="refundDetailDialog" title="退款信息" :close-on-click-modal="false" width="800px">
      <refund-detail v-if="refundDetailDialog" :receiveNo="receiveNo" :receiveInfo="receiveInfo" :source="source" @closeRefundDialog="closeRefundDialog" @reApply="reApply" />
    </el-dialog>
  </div>
</template>

<script>
import orderData from './order-data'
import receiveData from '@/views/receivable/js/receivable.js'
import refundApply from '@/components/refund/refund-apply.vue'
import RefundDetail from '@/components/refund/refund-detail.vue'
import invoicingApply from '@/components/invoicing/invoicing-apply.vue' 
import orderInvoicingDetail from '@/components/invoicing/order-invoicing-detail.vue' 

export default {
  components: {
    refundApply,
    RefundDetail,
    invoicingApply,
    orderInvoicingDetail
  },
  props:{
    orderNo:{
      type: String,
      required: true
    },
    customerType:{
      type: String,
      required: true
    },
    invoice:{
      // type: Object,
      // required: true
    },
    source:{
      type: String
    }
  },
  data(){
    return {
      feeTypeList: orderData.feeTypes,
      priceType: [],
      dataList: [],
      row:{},
      total: 0,
      applyInvoicingTitle:"申请开票",//0-单个申请开票；1-合并申请开票
      checkAll: true,
      refundDialog: false,
      refundDetailDialog: false,
      invoicingDialog:false,
      receiveInfo: {},
      receiveNo:"",
      invoicingInfo:{},
      multipleData:[],//多选的数据
      selectedAmountType:"",
      canMerge:true,//初始化是否存在可合并的项
      invoicingDetailDialog:false,
    }
  },
  filters:{
    tailAmount(value){
      return orderData.tailAmount(value);
    },
  },
  mounted(){
    this.getList();
  },
  methods:{
    mergeApply(){
      if(!this.canMerge){
          this.$message({
              message: '当前列表不存在合并开票的款项',
              type: 'info',
              offset:300
          }); 
      }else{
        if(this.multipleData.length==0){
          this.$message({
              message: '请先选择合并开票的款项',
              type: 'info',
              offset:300
          });        
        }else{
          if(this.multipleData.some(item=>{ return item.refundStatus==0})){
            this.$message({
              message: '请勿勾选正在申请退款的数据',
              type: 'info',
              offset:300
            }); 
          }else{
            this.applyInvoicing(this.multipleData,1,0)
          }      
        }
      }      
    },
    selectAll(rows){//全选按钮
      console.log(rows,"aii");
      if(rows.length>0){
        if(!rows.every(item=>{ return rows[0].amountType==item.amountType})){
          this.$message({
              message: '费用类型不同，不能全选',
              type: 'error',
              offset:300
          }); 
          this.toggleSelection(rows)
        }else{
          this.multipleData=rows;
        }
      }else{
        this.multipleData=[];
      }
      
    },
    selectRow(selection,row){
      console.log(selection,"selection",row,"seses");
      this.selectedAmountType=row.amountType;
      this.multipleData=selection
    },
    //判断哪些列可以合并开票
    handleSelectable(row,rowIndex){ 
      if(this.multipleData.length==0){//选项没有勾选（列表初始化）
        if(row.invoiceShowStatus==0){//invoiceShowStatus:0-可申请开票；1-查看开票
          return true;//true:可勾选
        }else{
          return false;
        }
      }else{//选择了一项，排除不符合条件的选项（费用类型与当前选项相同且符合开票条件）
        if(row.invoiceShowStatus==0){
           if(this.selectedAmountType==row.amountType  ){
            return true;
          }else{
            return false;
          }
        }else{         
          return false;
        }
      }
              
    },
    handleSelectionChange(val){
      // console.log(val,"val")      
      // this.handleSelectable(row)
    },
    toggleSelection(rows){
      this.$refs.multipleTable.clearSelection();
    },
    reApply(val){
      this.refundDetailDialog = !val;
      this.refundDialog = val;
    },
    closeRefundDialog(val){
      this.$emit('refresh',true);
      this.refundDialog = val;
      this.refundDetailDialog = val;
      this.invoicingDialog = val;
      this.invoicingDetailDialog=val;
      this.multipleData=[];
      this.getList();
    },
    applyInvoicing(rows,type,status){//单个按钮
    // （status:按钮状态0-申请，1-查看; ）
      if(status==1){
        this.invoicingDetailDialog=true;
        this.invoicingDialog=false;
        this.refundDetailDialog = false;
        this.refundDialog = false;
        this.receiveNo = rows.receiveNo;
        this.row=rows;
      }else{
        if(this.source != 'personal'){//我的订单的“申请开票”个人需权限
          orderData.checkReceive().then(res=>{
            if(res != 1001){
              this.applyInvoicingOperate(rows,type);
            };
          });
        }else{//订单管理的“申请开票”
          this.applyInvoicingOperate(rows,type);
        };
      }
    },
    applyInvoicingOperate(rows,type){
      //rows-开票的款项；type:0-单项开票，1-合并开票；            
      if(type==1){
        this.applyInvoicingTitle="合并申请开票";
        let row=rows[0];
        this.invoicingInfo={
          type:1,
          invoice:this.invoice,
          orderNo:this.orderNo,
          customerType:this.customerType,
          amountType:row.amountType,
          customerName:row.customerName,
          contractNo:row.contractNo,
          invoicingList:rows
        }
        this.invoicingDialog=true;
        this.refundDetailDialog = false;
        this.refundDialog = false;
      }else{
        this.applyInvoicingTitle="申请开票";
        let row=rows;
        if(row.refundStatus==0){//refundStatus:是否正在退款流程中
          this.$message({
            message: '您有退款申请流程正在进行中，请退款完成后再申请开票',
            type: 'info',
            offset:300
          });  
        }else{
          this.invoicingInfo={
            type:0,
            invoice:this.invoice,
            orderNo:this.orderNo,
            customerType:this.customerType,
            amountType:row.amountType,
            receiveNo:row.receiveNo,
            invoiceAmount:row.refundAmount?(row.receiveAmount-row.refundAmount):row.receiveAmount,
            customerName:row.customerName,
            contractNo:row.contractNo,
            invoicingList:[]
          };
          this.invoicingDialog=true;
          this.refundDetailDialog = false;
          this.refundDialog = false;
        }        
      }                  
    },
    applyRefund(row){
      if(this.source != 'personal'){
        orderData.checkReceive().then(res=>{
          if(res != 1001){
            this.receiveInfo = row;
            this.refundDialog = true;
          };
        });
      }else{
        this.receiveInfo = row;
        this.refundDialog = true;
      };
    },
    checkRefundDetail(info,No){
      this.receiveInfo = info;
      this.receiveNo = No;
      this.refundDetailDialog = true;
    },
    receiveAmount(value){
      return value.receiveAmount== null ?  '待定' : (value.receiveAmount/100).toFixed(2);
    },
    amountType(value){
      return value.amountType == 0 ? '代理费' : value.amountType == 1 ? '第三方费用' : value.amountType == 2 ? '官费' : '';
    },
    getList(){
      let param = {
        amountTypeSearch: this.priceType,
        orderNo: this.orderNo
      }
      receiveData.orderReceivePage(param).then(res=>{
        this.dataList = res.records.records;
        this.amount = res;
        this.total = res.total;
        if(this.dataList.length>0){//初始化是否有可合并的项
          if(this.dataList.every(item=>{ return item.invoiceShowStatus!="0"})){
            this.canMerge=false;
          }else{
            this.canMerge=true;
          }
        }else{
          this.canMerge=false;
        }
      });
    },
    getSummaries(param){
      return orderData.getSummaries(param,this.amount);
    },
  },
  watch:{
    checkAll(val){
      if(val){
        this.priceType = [];
        this.getList();
      }
    },
    priceType(val){
      if(val.length == 0){
        this.$nextTick(()=>{
          this.checkAll = true;
        })
      }
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
</style>