<template>
  <div class="order-detail-page" v-if="hasPermissions">
    <!-- 订单信息 -->
    <div class="order-detail-theme">
      <span class="order-no"><img src="../../../public/images/订单.png" class="img" />单号：{{orderInfo.orderNo}}</span>
      <span class="order_status" :class="{'wait' : orderInfo.orderStatus == 1}">
        <span class="status">订单状态：</span>
        <span :class="[
          orderInfo.orderStatus == 0 ? 'tostart' : 
          orderInfo.orderStatus == 2 ? 'blue-circle in-service' : 
          orderInfo.orderStatus == 3 ? 'blue-circle circleRed' :
          orderInfo.orderStatus == 4 ? 'success_detail' :
          ''
        ]"><b v-if="orderInfo.orderStatus == 4">✔</b></span>
        {{orderInfo.orderStatus | orderStatus}}
      </span>
      <!-- 从任务详情跳到订单详情,不显示操作按钮 -->
      <template v-if="(!($route.query.noButton && $route.query.noButton=='really'))">
          <!-- 自动分配工程师 -->
         <!-- <el-button type="primary" size="mini" @click="orderAllot()" v-if="orderInfo.loginNo == orderInfo.salesmanNo && orderInfo.orderStatus == 1">分配工程师</el-button> -->
         <!-- <el-button type="warning" size="mini" v-if="orderInfo.loginNo == orderInfo.salesmanNo && (orderInfo.orderStatus == 0 || orderInfo.orderStatus == 1)" >申请退款</el-button> -->
         <el-button type="primary" class="pto" size="mini" v-if="orderInfo.loginNo == orderInfo.salesmanNo && (orderInfo.taskCloseFlag ==1 && (orderInfo.orderStatus !=4 && ( orderInfo.payAmount > orderInfo.refundAmount)) && (orderInfo.totalAmount != 0 && orderInfo.payAmount != null))" @click="updateOrder(4)" >完成订单</el-button>
         <el-button type="warning" class="pto" size="mini" v-if="orderInfo.loginNo == orderInfo.salesmanNo && ((orderInfo.taskFlag ==1 || orderInfo.orderTasks.length == 0 ) && (orderInfo.orderStatus != 5 && (orderInfo.payAmount == null || (orderInfo.payAmount != null && orderInfo.payAmount === orderInfo.refundAmount))) )" @click="updateOrder(5)">关闭订单</el-button>
      </template>
      <span class="order-noo" style="margin-left:15px">
        <img class="person" src="../../../public/images/clueman.png" width="22px" height="20px" v-if="orderInfo.clueBelongName" />
        <el-tooltip effect="dark" :content="'工号：'+orderInfo.clueBelongNo +' 部门：'+orderInfo.clueBelongDeptName" placement="top" v-if="orderInfo.clueBelongName">
            <span>&nbsp;{{orderInfo.clueBelongName}}</span>
        </el-tooltip>
        <img src="/img/disable.png" v-if="orderInfo.userBelongLockFlag && orderInfo.userBelongLockFlag==9" class="dispicture" alt="" />
      </span>
      <span class="belong" v-if="orderInfo.clueBelongName && orderInfo.salesmanName"></span>
      <span class="order-noo">
        &nbsp;<img class="persontwo" src="../../../public/images/salesman.png" width="24px" height="22px" v-if="orderInfo.salesmanName" />
        <el-tooltip effect="dark" :content="'工号：'+orderInfo.salesmanNo +' 部门：'+orderInfo.salesmanDeptName" placement="top"  v-if="orderInfo.salesmanName">
              <span>&nbsp;{{orderInfo.salesmanName}}</span>
         </el-tooltip>
        <img src="/img/disable.png" v-if="orderInfo.salesmanLockFlag && orderInfo.salesmanLockFlag==9" class="dispicture" alt="" />
      </span>
      <div class="gmt">{{orderInfo.gmtCreate }}</div>
      <div class="order-info" v-if="orderInfo.orderDetail">
        <div v-for="(item,index) in list" :key="index" >
          <p class="info-name">{{item.label}}</p>
          <p class="info-data" v-if="item.value== 0">
            <span>{{orderInfo.customerName}}</span>
          </p>
          <p class="info-data" v-if="item.value== 1">
              <span>{{signingInfo.clueAccount.clueNo}}</span>
          </p>
          <p class="info-data" v-if="item.value== 2">{{orderInfo.finishTime ? orderInfo.finishTime : '暂无数据' }}</p>
          <p class="info-data" v-if="item.value== 3">{{orderInfo.orderDetail.agencyFee | totalAmount }}</p>
          <p class="info-data" v-if="item.value== 4">{{orderInfo.orderDetail.thirdPartyFee | totalAmount }}</p>
          <p class="info-data" v-if="item.value== 5">{{orderInfo.orderDetail.governmentFee | totalAmount }}</p>
          <p class="info-data" v-if="item.value== 6">{{orderInfo.orderDetail.productName ? orderInfo.orderDetail.productName : '暂无数据' }}</p>
          <p class="info-data" v-if="item.value== 7">{{orderInfo.orderDetail.productCount ? orderInfo.orderDetail.productCount : '暂无数据' }}</p>
          <p class="info-data" v-if="item.value== 8">{{orderInfo.totalAmount | totalAmount }}</p>
          <p class="info-data" v-if="item.value== 9">{{orderInfo.payAmount | payAmount }}</p>
          <p class="info-data" v-if="item.value== 10">{{orderInfo.tailAmount | totalAmount }}</p>
          <p class="info-data" v-if="item.value== 11">{{orderInfo.refundAmount | refundAmount }}</p>
        </div>
      </div>
      <p class="info-note">订单备注<i class="el-icon-edit edit" @click="editNote()"></i></p>
      <p class="info-desc">{{orderInfo.orderNote ? orderInfo.orderNote : '暂无备注'}}</p>
    </div>
    <!-- tab -->
    <el-tabs type="border-card" class="order-detail-theme tabs" v-model="tabName" >
      <el-tab-pane name="0" label="任务信息">
        <order-task-information v-if="tabName == 0" :taskInfo="orderInfo.orderTasks" :orderStatus='orderInfo.orderStatus' @allotEngineer="orderAllot" />
      </el-tab-pane>
      <el-tab-pane name="1" label="签约信息">
        <order-signing-information v-if="tabName == 1" :signingInfo="signingInfo" />
      </el-tab-pane>
      <el-tab-pane name="2" label="回款信息">
        <receivable-infomation :orderNo="orderInfo.orderNo" :invoice="invoice" :customerType="orderInfo.customerType" @refresh='refresh' :source="$route.query.source" v-if="tabName == 2" />
      </el-tab-pane>
      <el-tab-pane name="3" label="操作记录">
        <order-operate-records :orderId="orderInfo.id" v-if="tabName == 3" />
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="noteDialog" title="编辑备注" :close-on-click-modal="false" width="500px">
      <el-input 
        type="textarea"
        v-model="note"
        rows="5"
        maxlength="100"
        show-word-limit
      />
      <div class="edit-note">
        <el-button type="primary" @click="submit()" v-preventReClick>确 定</el-button>
        <el-button @click="noteDialog=false">取 消</el-button>
      </div>
    </el-dialog>
     <!-- 自动分配工程师 -->
    <el-dialog :visible.sync='orderAllotDialog' width="900px" title="分配工程师" :close-on-click-modal='false'>
      <task-allocation  :orderNo="orderInfo.orderNo" :taskInfo="orderInfo.orderDetail" @closeAllotDialog="closeAllotDialog" :from="$route.query.source" @cancelAllotDialog="cancelAllotDialog" :source="'order'" v-if="orderAllotDialog" />
    </el-dialog>
  </div>
</template>

<script>
import detailHead from "@/page/index/top/index";
import OrderTaskInformation from './order-task-information.vue';
import OrderSigningInformation from './order-signing-information.vue';
import orderData from './order-data.js'
import TaskAllocation from '@/components/task/task-allocation'
import ReceivableInfomation from './receivable-infomation.vue';
import OrderOperateRecords from './order-operate-records.vue';
export default {
  components:{
    detailHead,
    OrderTaskInformation,
    OrderSigningInformation,
    TaskAllocation,
    ReceivableInfomation,
    OrderOperateRecords
  },
  data(){
    return {
      orderId: '',
      tabName: 0,
      invoice:'',//线索中带入的回款信息
      list: orderData.infoData,
      orderInfo: {},
      source: 'personal',//跳转来源
      signingInfo: {},
      hasPermissions: false,//是否有权限查看详情
      noteDialog: false,
      note: '',
      orderAllotDialog: false,
    }
  },
  filters:{
    orderStatus(value){
      return orderData.transformOrderStatus(value);
    },
    totalAmount(value){
      return orderData.totalAmount(value);
    },
    refundAmount(value){
      return orderData.refundAmount(value);
    },
    payAmount(value){
      return orderData.payAmount(value);
    },
  },
  created(){
    this.orderId = this.$route.query.orderId;
    this.source = this.$route.query.source;
    this.pjPath = this.$route.query.pjPath;
    sessionStorage.setItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value,JSON.stringify({
        page: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).page,
        screening: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).screening,//表单筛选信息
        ID: JSON.parse(sessionStorage.getItem('pigx-tag')).content.label,//页面标识
        orderSource: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).orderSource,
        orderType: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).orderType,
        detail:{query:this.$route.query,path:this.$route.path}
      })
    );//保存页面信息
  },
  mounted(){
    this.getDetail();
  },
  methods:{
    refresh(){
      this.getDetail();
    },
    updateOrder(type){
      if(type == 5){
        var message = '订单关闭后已暂停和已关闭的任务不可再重新启动';
        var name = '关闭';
      }else{
        if(this.orderInfo.refundStatus != 0){
          var message = '确定手动完成该订单吗？';
          var name = '完成';
        }else{
          this.$message({
            type:'warning',
            message:'有退款流程正在进行，请流程完成后再试'
          })
        };
      };
      if(this.orderInfo.refundStatus !=0){
        var url ='';
        console.log(this.$route.query.source);
        if(this.$route.query.source == 'personal'){
          url = '/wtcrm/wtorder/updateOrderById';
        }else{
          url = '/wtcrm/wtorder/close'
        };
        let param = {
          id: this.orderInfo.id,
          orderStatus: type
        };
        this.$confirm(message,name,{
          type: 'warning',
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel"
        }).then(()=>{
          orderData.updateOrderStatus(param,url,'修改成功！').then(res=>{
            this.getDetail();
          })
        }).catch(()=>{

        });
      }
    },
    cancelAllotDialog(val){
      this.orderAllotDialog = val;
    },
    closeAllotDialog(val){
      this.orderAllotDialog = val;
      this.tabName = '0';
      this.$nextTick(()=>{
        this.tabName = '3';
      })
      this.getDetail();
    },
    orderAllot(){
      this.orderAllotDialog = true;
    },
    submit(){
      if(this.orderInfo.orderNote == this.note){
        this.noteDialog = false;
        this.$message({
          message: '修改备注成功！',
          type: 'success'
        });
        this.getDetail();
      }else{
        let param = {
          id: this.orderInfo.id,
          orderNote: this.note,
          orderNo:this.orderInfo.orderNo
        }
        let successMsg = '修改备注成功！';
        orderData.updateNote(param, successMsg).then(res=>{
            this.noteDialog = false;
            this.getDetail();
        });
      }
    },
    cancel(){
      this.noteDialog = false;
    },
    editNote(){
      this.note = this.orderInfo.orderNote;
      this.noteDialog = true;
    },
    getDetail(){
      let param = {
        id: this.orderId
      }
      orderData.getOrderDetail(param, this.source,this.pjPath).then(res=>{
        this.hasPermissions = true;
        this.invoice=res.data.invoice;
        this.orderInfo = res.data.order;
        this.signingInfo = res.data.sign;
      })
    }
  }
}
</script>

<style scoped>
.belong{
    display: inline-block;
    width: 42px;
    height: 1.8px;
    background: #999;
    position: relative;
    top: -4px;
    left: 5px;
}
.order-detail-page{
  font-size: 14px;
  height: 100%;
  margin: 10px;
}
.order-detail-theme{
  min-width: 960px;
  background-color: #FFF;
  margin: 0 auto;
  padding: 20px;
}
.order-info{
  margin-top: 10px;
  margin-left: 22px;
  display: grid;
  grid-template-columns: repeat(6,1fr);
  grid-column-gap: 20px;
}
.info-name{
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
}
.info-note{
  font-size: 14px;
  font-weight: bold;
  margin-left: 22px;
}
.info-data{
 color: #666; 
}
.info-desc{
 color: #666; 
 margin-left: 22px;
}
.edit{
  color: #409eff;
  cursor: pointer;
  margin-left: 3px;
}
.tabs{
  margin-top: 20px;
}
.circleBlue{
  width:6px;
  height:6px;
  float:left;
  border-radius: 50%;
  background: #36A6FE;
  margin-top: 2px;
  margin-right:7px;
}
.wait{
  color: #ccca4d;
}
.order-no{
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 20px;
  position: relative;
  color: #2c3e50;
  line-height: 24px;
}
.order-noo{
  font-size: 14.5px;
  font-weight: bold;
  position: relative;
  color: #2c3e50;
  line-height: 24px;  
}
.edit-note{
  text-align: right;
  margin-top: 10px;
}
.img{
  position: absolute;
  top: -3px;
  left: -25px;
  margin-right: 3px;
}
.blue-circle{
  width:7px;
  height:7px;
  display: inline-block;
  border-radius: 50%;
  background: #36A6FE;
  margin-right:3px;
}
.success_detail{
  font-weight:bolder;
  font-size:12px;
  display: inline-block;
  color:#027502;
  margin-right:6px;
}
.circleRed{
  background: #ff0000;
}
.in-service{
  background: #f3ab03;
}
.tostart{
  width: 7px;
  height: 7px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 3px;
}
.order_status{
  margin: 0 15px;
  font-size: 16px;
  font-weight: bold;
}
.status{
  font-size: 16px;
  font-weight: 550;
}
.person{
    position: relative;
    top: 3.5px;
    object-fit: contain;
}
.persontwo{
    position: relative;
    top: 5.5px;
    object-fit: contain;
}
.gmt{
    position: relative;
    top: 10px;
    left: 22px;
    color: #666;
}
.pto{
    position: relative;
    top: -2px;
}
.dispicture{
    width: 24px;
    height: 24px;
    position: relative;
    top: 7px;
    margin-left: 3px;
}
</style>