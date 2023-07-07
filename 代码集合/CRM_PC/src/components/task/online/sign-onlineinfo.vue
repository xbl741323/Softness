<template>
  <div class="signing">
    <span class="signing-spa">订单信息</span>
    <!-- <div class="signing-info">
      <p  style="color: #409EFF;cursor: pointer;" @click="goOrderDetail(orderInfo.id)"><span>订单编号：</span>
         {{orderInfo.orderNo}}
      </p>
      <p><span>订单状态：</span>
          <span :class="[
            orderInfo.orderStatus == 0 ? 'tostart' : 
             orderInfo.orderStatus == 1 ? 'in-service' : 
            orderInfo.orderStatus == 2 ? 'in-service' : 
            orderInfo.orderStatus == 3 ? 'circleRed' :
            orderInfo.orderStatus == 4 ? 'newsuccess' :
            orderInfo.orderStatus == 6 ? 'circleRed' :''
          ]"><b v-if="orderInfo.orderStatus == 4">✔</b></span>
          {{orderInfo.orderStatus | orderStatus}}
      </p>
      <p v-if="orderInfo.orderDetailVO && orderInfo.orderDetailVO.productName"><span>产品信息：</span>{{orderInfo.orderDetailVO.productName}}({{orderInfo.orderDetailVO.productCount}})</p>
      <p><span>订单总价：</span>{{orderInfo.totalAmount ?(orderInfo.totalAmount/100).toFixed(2):'无'}} </p>
      <p><span>下单时间：</span>{{orderInfo.gmtCreate}}</p>
      <p v-if="orderInfo.orderDetailVO && orderInfo.orderDetailVO.agencyFee"><span>代  理  费：</span>{{orderInfo.orderDetailVO.agencyFee}}</p>
      <p><span>推广归属：</span>
       <el-tooltip effect="dark" :content="'工号：'+orderInfo.userBelongNo +' 部门：'+orderInfo.userBelongDeptName" placement="top" v-if="orderInfo.userBelongName">
            <span>&nbsp;{{orderInfo.userBelongName}}</span>
        </el-tooltip>
      </p>
      <p v-if="orderInfo.orderDetailVO.thirdPartyFee"><span>第三方费：</span>{{ orderInfo.orderDetailVO.thirdPartyFee}}</p>
      <p><span>业务员：</span>
        <el-tooltip effect="dark" :content="'工号：'+orderInfo.salesmanNo +' 部门：'+orderInfo.salesmanDeptName" placement="top"  v-if="orderInfo.salesmanName">
              <span>&nbsp;{{orderInfo.salesmanName}}</span>
         </el-tooltip>
      </p>
      <p v-if="orderInfo.orderDetailVO.governmentFee"><span>官        费：</span>{{ orderInfo.orderDetailVO.governmentFee }}</p>
    </div> -->
        <div class="signing-info">
      <p  style="color: #409EFF;cursor: pointer;" @click="goOrderDetail(orderInfo.id)"><span>线索编号：</span>
         {{orderInfo.orderNo}}
      </p>
      <p><span>合同编号：</span>
          <span :class="[
            orderInfo.orderStatus == 0 ? 'tostart' : 
             orderInfo.orderStatus == 1 ? 'in-service' : 
            orderInfo.orderStatus == 2 ? 'in-service' : 
            orderInfo.orderStatus == 3 ? 'circleRed' :
            orderInfo.orderStatus == 4 ? 'newsuccess' :
            orderInfo.orderStatus == 6 ? 'circleRed' :''
          ]"><b v-if="orderInfo.orderStatus == 4">✔</b></span>
          {{orderInfo.orderStatus | orderStatus}}
      </p>
      <p v-if="orderInfo.orderDetailVO && orderInfo.orderDetailVO.productName"><span>订单编号：</span>{{orderInfo.orderDetailVO.productName}}({{orderInfo.orderDetailVO.productCount}})</p>
      <p><span>合同附件：</span>{{orderInfo.totalAmount ?(orderInfo.totalAmount/100).toFixed(2):'无'}} </p>
      <p><span>订单归属：</span>{{orderInfo.gmtCreate}}</p>
      <p v-if="orderInfo.orderDetailVO && orderInfo.orderDetailVO.agencyFee"><span>客户联系人：</span>{{orderInfo.orderDetailVO.agencyFee}}</p>
      <p><span>线索归属：</span>
       <el-tooltip effect="dark" :content="'工号：'+orderInfo.userBelongNo +' 部门：'+orderInfo.userBelongDeptName" placement="top" v-if="orderInfo.userBelongName">
            <span>&nbsp;{{orderInfo.userBelongName}}</span>
        </el-tooltip>
      </p>
      <p v-if="orderInfo.orderDetailVO.thirdPartyFee"><span>客户签约人：</span>{{ orderInfo.orderDetailVO.thirdPartyFee}}</p>
      <p><span>业务员：</span>
        <el-tooltip effect="dark" :content="'工号：'+orderInfo.salesmanNo +' 部门：'+orderInfo.salesmanDeptName" placement="top"  v-if="orderInfo.salesmanName">
              <span>&nbsp;{{orderInfo.salesmanName}}</span>
         </el-tooltip>
      </p>
      <p v-if="orderInfo.orderDetailVO.governmentFee"><span>签约时间：</span>{{ orderInfo.orderDetailVO.governmentFee }}</p>
    </div>
  </div>
</template>

<script>
import { saveDetal } from "@/util/clearDetail"
import orderData from '@/components/order/order-data.js'
export default {
  props:{
    orderId:{
        type:Number,
        required:true
    },
    listType:{    
        type: String,
        default: null
    }
  },
  data(){
    return{
       orderInfo:{}
    }
  },
  filters:{
     totalAmount(value){
       return value == null ? '待定' : (value/100).toFixed(2);
     },
     orderStatus(value){
      return orderData.onlinetransformOrderStatus(value)
    },
  },
  mounted(){
    this.getDetail()
  },
  methods:{
    getDetail(){
      let param = {
        orderId: this.orderId,
        pwd:this.listType =='personal'?'other':'pwd'
      }
      orderData.getOnlineOrderDetail(param).then(res=>{
            res.data.orderDetailVO.agencyFee  = this.filterPrice(res.data.orderDetailVO.agencyFee,res.data.orderDetailVO.productCount);
            res.data.tailAmount  = this.filterPrice(res.data.tailAmount,res.data.orderDetailVO.productCount);
            res.data.orderDetailVO.thirdPartyFee  = this.filterPrice(res.data.orderDetailVO.thirdPartyFee,res.data.orderDetailVO.productCount);
            res.data.orderDetailVO.governmentFee  = this.filterPrice(res.data.orderDetailVO.governmentFee,res.data.orderDetailVO.productCount);
            this.orderInfo = res.data
      })
    },
    filterPrice(val,num){
      if(val){
          return (val/100).toFixed(2)
      }else{
          return '无'
      }
    },
    //  this.$router.push({
    //     path: '/orderonline-detail',
    //     query:{
    //       orderId: row.id,
    //       source: this.source
    //     }
    //   })
    goOrderDetail(orderId){
        let path ="/orderonline-detail"
        let query = {
            orderId,
            source: 'list',
            noButton:'really'
        }
        saveDetal(`${this.$route.path}`,path,query)
        this.$router.push({path,query})
    }
  }
}
</script>

<style scoped>
.signing{
    margin-top: 5px;
    color: #666666b5;
    font-size: 14px;
}
.signing-spa{
  color: #2c3e50;
  font-weight: 600;
  padding-left: 6px;
  border-left: #3e84df 3px solid;
}
.signing-info{
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: repeat(2,1fr);
  margin: 10px 0 0 10px;
  font-size: 14px;
}
.signing-info span{
  color: #2c3e50;
}
.empName{
  color: #666666b5 !important;
}
.waitAllot{
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;  
  color: #FF6600;
  position: relative;
  top: -1px;
}
.tostart{
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  position: relative;
  top: -1px;
}
.newsuccess{
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #027502;
  position: relative;
  top: -1px;
}
.circleRed{
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;  
  background: #ff0000;
  position: relative;
  top: -1px;
}
.in-service{
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;  
  background: #f3ab03;
  position: relative;
  top: -1px;
}
.status-block{
  padding: 4px 12px 4px 18px;
  border-radius: 4px;
  font-size: 12px;
  position: relative;
}
.already{
  color: #67c23a;
  background: #f0f9eb;
  border: 1px solid #c2e7b0;
}
.status-block span{
  position: absolute;
  left: 8px;
  top: 4px;
}
.check{
  left: 5px !important;
  top: 0 !important;
  color: #67c23a !important;
}
</style>