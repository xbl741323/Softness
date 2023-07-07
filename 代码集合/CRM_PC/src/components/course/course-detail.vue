<template>
  <div class="order-detail-page">
    <!-- 订单信息 -->
    <div class="order-detail-theme">
      <span class="order-no">
        <img src="../../../public/images/订单.png" class="img" />单号：{{orderInfo.orderNo}} &nbsp;&nbsp;
        <span v-if="orderInfo.deleted==1">已删除</span>
        <span v-else>
          <span v-show="orderInfo.orderStatus==0||orderInfo.orderStatus==1"><span  class="red-circle"></span>待付款</span>
          <span v-show="orderInfo.orderStatus==2" ><b class="newsuccess">✔</b>已付款</span>
          <span v-show="orderInfo.orderStatus==4">已取消</span>
        </span>
      </span>
      <div>
        <el-tag type="success" effect="plain" color="#F7F7F7" size="medium">{{orderInfo.userNo}}</el-tag>&nbsp;&nbsp;
        <el-tag type="success" effect="plain" color="#F7F7F7" size="medium">{{orderInfo.accountNo}}</el-tag>
      </div>
      <div class="order-info" v-if="orderInfo">
        <div v-for="(item,index) in list" :key="index" >
          <p class="info-name">{{item.label}}</p>
          <p class="info-data customerName"  v-if="item.value== 1">
            <span v-if="orderInfo.authName!=null">{{orderInfo.authName}} 
              <span v-show="orderInfo.vipFlag" class="vip">VIP</span> 
            </span>
            <span v-else>暂无数据</span>
           
          </p>
          <!-- <p class="info-data" v-if="item.value== 1">
              <span>{{orderInfo.userNo}}</span>
          </p> -->
          <p class="info-data" v-if="item.value== 2">
            <span v-show="source == 'personal'">{{orderInfo.accountMobileNotSensitive}}</span>
            <span v-show="source == 'list'">{{orderInfo.accountMobile}}</span>
          </p>
          <p class="info-data" v-if="item.value== 3">{{orderInfo.orderSource | wherePlat}}</p>
          <p class="info-data" v-if="item.value== 4">{{orderInfo.createTime}}</p>
          <p class="info-data" v-if="item.value== 5">{{orderInfo.baseTitle ? orderInfo.baseTitle : '暂无数据' }}</p>
          <p class="info-data" v-if="item.value== 6">{{orderInfo.tradingCurrentPrice | payAmount}}</p>
          <p class="info-data" v-if="item.value== 7">{{orderInfo.tradingThirdFee | filterTradingThirdFee}}</p>
          <p class="info-data" v-if="item.value== 8">
            <span>{{orderTotal | payAmount}}</span> 
            <span v-if="isVip">(VIP价)</span>
          </p>
          <p class="info-data" v-if="item.value== 9">永久</p>
        </div>
      </div>
    </div>

    <!-- tab -->
    <el-tabs type="border-card" class="order-detail-theme tabs" v-model="tabName" >
      <el-tab-pane name="0" label="费用信息">
        <fee-information v-if="tabName == 0 && orderInfo.orderFeeList" :orderFeeList="orderInfo.orderFeeList"></fee-information>
      </el-tab-pane>
      <el-tab-pane name="1" label="操作记录" >
        <operate-records v-if="tabName == 1 && orderInfo.operateList" :operateList="orderInfo.operateList"></operate-records>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import orderData from '@/components/course/order-data.js'
import FeeInformation from '@/components/course/fee-information.vue'
import OperateRecords from '@/components/course/operate-records.vue'


export default {
  components: {
    FeeInformation,
    OperateRecords
  },
  filters:{
    wherePlat(value){
      return orderData.wherePlat(value);
    },
    filterTradingThirdFee(value){
      return orderData.filterTradingThirdFee(value);
    },
    payAmount(value){
      return orderData.payAmount(value);
    },
  },
  data () {
    return {
      id: '',
      tabName: 0,
      list: orderData.infoData,
      orderInfo: {},
      orderTotal:null,
      isVip:null,
      source:""
    }
  },

  created () {
    this.id = this.$route.query.id;
    this.isVip = this.$route.query.isVip;
    this.source = this.$route.query.source;
  },

  mounted () {
      this.getCourseDetail(this.id,this.source=='personal');
  },

  methods: {
    // 获取课程订单详情
    getCourseDetail(id,source){
      orderData.getCourseDetail(id, source).then(res=>{
        if(res.code == 0){
          res.data.accountMobile = this.filterPhone(res.data.accountMobile);
          if(this.isVip == true){
            this.orderTotal = res.data.tradingVipPrice + res.data.tradingThirdFee
          }else{
            this.orderTotal = res.data.tradingCurrentPrice + res.data.tradingThirdFee
          }
          this.orderInfo = res.data;
        }else{
           this.$message({
            type:'warning',
            message: res.msg,
            duration: 2000
          })
        }
      })
    },

    // 手机号脱敏
    filterPhone(str){
      if(str !== null  && str !== undefined){
          var pat=/(\d{3})\d*(\d{4})/;
          return str.replace(pat,'$1****$2');
      } else {
        return '';
      }
    }
  }
}  
</script>

<style scoped>
.customerName{
  position: relative;
}
.vip {
  color:red;
  position:absolute;
  top:-5px;
  font-style:italic;
}
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
  grid-template-columns: repeat(5,1fr);
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
.newsuccess{
  font-weight:bolder;
  font-size:16px;
  display: inline-block;
  color:#027502;
  margin-right:6px;
}
.red-circle {
  width:6px;
  height:6px;
  display: inline-block;
  border-radius: 50%;
  background: #fe3636;
  margin-right:7px;
}
</style>