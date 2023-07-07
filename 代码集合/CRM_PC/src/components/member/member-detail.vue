<template>
  <div class="order-detail-page"  v-if="orderInfo">
    <!-- 订单信息 -->
    <div class="order-detail-theme">
      <span class="order-no">
        <img src="../../../public/images/订单.png" class="img" />单号：{{orderInfo.orderNo}} &nbsp;&nbsp;&nbsp;
          <span v-if="orderInfo.orderStatus == 0" class="red-circle">待付款</span>
          <span  v-show="orderInfo.validStart!=null">
              <span class="to-be-effective" v-if="currentDate < orderInfo.validStart">待生效</span>
              <span class="effective" v-else-if="currentDate < orderInfo.validEnd">已生效</span>
              <span v-else>已到期</span>
          </span>
      </span>
      <div>
        <el-tag type="success" effect="plain" color="#F7F7F7" size="medium">{{orderInfo.userNo}}</el-tag>&nbsp;&nbsp;
        <el-tag type="success" effect="plain" color="#F7F7F7" size="medium">{{orderInfo.accountNo}}</el-tag>
      </div>
      <div class="order-info" v-if="orderInfo">
        <div v-for="(item,index) in list" :key="index" >
          <p class="info-name">{{item.label}}</p>
          <p class="info-data" v-if="item.value== 1">
            <span v-if="orderInfo.authName!=null">{{orderInfo.authName}}</span>
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
          <p class="info-data" v-if="item.value== 5">
            <span v-if="orderInfo.orderStatus == 0">&nbsp;&nbsp;&nbsp;&nbsp;/</span>
            <span v-else>{{orderInfo.validEnd}}</span>
          </p>
          <p class="info-data" v-if="item.value== 6">{{orderInfo.vipProductName }}</p>
          <p class="info-data" v-if="item.value== 7">{{orderInfo.orderAmount | payAmount}}</p>
        </div>
      </div>
    </div>
    <!-- tab -->
    <el-tabs type="border-card" class="order-detail-theme tabs" v-model="tabName" >
      <el-tab-pane name="0" label="费用信息">
        <fee-information v-if="tabName == 0 && orderInfo.id" :orderInfo="orderInfo"></fee-information>
      </el-tab-pane>
      <el-tab-pane name="1" label="操作记录" >
        <operate-records v-if="tabName == 1 && orderInfo.operateList.length" :operateList="orderInfo.operateList"></operate-records>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import orderData from '@/components/member/order-data.js'
import FeeInformation from '@/components/member/fee-information.vue'
import OperateRecords from '@/components/member/operate-records.vue'


export default {
  components: {
    FeeInformation,
    OperateRecords
  },
  filters:{
    wherePlat(value){
      return orderData.wherePlat(value); 
    },
    payAmount(value){
        return orderData.payAmount(value);
    },
  },
  data () {
    return {
      id: '',
      currentDate:'',
      tabName: 0,
      list: orderData.infoData,
      orderInfo: {},
      source:""
    }
  },

  created () {
    this.id = this.$route.query.id;
    this.source = this.$route.query.source;
    this.getCurrentDate();
  },

  mounted () {
    this.getCurrentDate();
    this.getOrderDetail(this.id);
  },

  methods: {
    // 获取会员订单详情
    getOrderDetail(id){
      orderData.getOrderDetail(id,this.source=='personal').then(res=>{
        this.orderInfo = res.data;
      })
    },

    // 获取当前日期
    getCurrentDate(){
        let yy = new Date().getFullYear();
        let mm = new Date().getMonth()+1 < 10 ? '0'+ (new Date().getMonth()+1) : new Date().getMonth()+1;
        let dd = new Date().getDate() < 10 ? '0'+ new Date().getDate() : new Date().getDate();
        this.currentDate = yy+'-'+mm+'-'+dd;
    },
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
.red-circle::before {
  content: '';
  background:#ff0000;
  width:7px;
  height:7px;
  display: inline-block;
  border-radius: 50%;
  margin-right:3px;
}
.to-be-effective::before{
  content: '';
  background: #f3ab03;
  width:7px;
  height:7px;
  display: inline-block;
  border-radius: 50%;
  margin-right:3px;
}
.effective::before{
  content: '';
  background: #36a6fe;
  width:7px;
  height:7px;
  display: inline-block;
  border-radius: 50%;
  margin-right:3px;
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