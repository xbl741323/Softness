<template>
  <div class="new_client_detail">
    <!-- 基本用户信息 -->
    <basic-info :userData="userData" @refresh="getData" :sourceType='sourceType' :type="type" :source="source" :accountId='accountId'></basic-info>
    <div class="tab_content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="线索信息" name="clue"></el-tab-pane>
        <el-tab-pane label="订单记录" name="order"></el-tab-pane>
        <el-tab-pane label="维护记录" name="defend"></el-tab-pane>
      </el-tabs>
      <clue-info v-if="activeName=='clue'" @refresh="getData" :userData="userData" :clueNo="clueNo" :myType="myType" :type="type" :source="source" :customerType="customerType" :clueId='accountId' :clueType='clueType'></clue-info>
      <product-order v-if="orderType == 0 && activeName == 'order'" :source="type == 1 ? 'list' : 'personal'" :clueIdList="[JSON.parse($route.query.id)]" :clueType="clueType" ></product-order>
      <defend-records v-if="activeName=='defend'&&!sourceType" :clueId="accountId" :infoData="userData" :isOpenSeas="source" :type="type" @refresh='refresh' @closeFollow="closeFollow"></defend-records>
      <!-- 业绩统计-客户跟进-跟进/回访列表 -->
      <return-visit v-if="activeName=='defend'&&sourceType" :clueId="accountId" :infoData="userData" @refresh='refresh'></return-visit>
    </div>
  </div>
</template>

<script>
import { getClueDetail,getSeaDetail } from "@/api/new-client/my-clue"
import basicInfo from "@/components/new-client/common/clue-basic-info";
import clueInfo from "@/components/new-client/clue-info/index";
import * as CodeMsg from "@/api/common/CodeChange"
import registerInfo from "@/components/new-client/register-info/index";
import defendRecords from '@/components/new-client/defend-records/index'
import returnVisit from '@/components/new-client/return-visit/index'
import productOrder from "@/components/personal/my-users/product-order"
export default {
  components: {
    basicInfo,
    clueInfo,
    defendRecords,
    registerInfo,
    productOrder,
    returnVisit
  },
  data() {
    return {
      clueType: 1,// clueType：1-单位 0-个人
      clueNo: null,
      sourceType: false,// 跟进-回访记录
      myType:0, // 0：我的线索 1：我的客户
      customerFollow: false,
      source:false,
      userData: {},
      accountId: "",
      type: "", // 来源-> 0:个人中心 1:客户管理
      activeName: "clue",
      orderType: 0,
      customerType: 'clue' // 客户类型 clue-线索客户 customer-成交客户
    };
  },
  created() {
    this.setActiveName()
    this.accountId = this.$route.query.id;
    this.clueNo = this.$route.query.clueNo;
    this.type = this.$route.query.type;
    this.clueType = this.$route.query.clueType;
    if(this.$route.query.source){
      this.source = true
      this.myType = 1
    }
    if(this.$route.query.sourceType){
     this.sourceType = true
    }
    if(this.$route.query.customerType){
     this.customerType = this.$route.query.customerType
    }
  },
  methods: {
    handleClick(){
      if(this.activeName=='order'){
        sessionStorage.setItem('clue-active-name',this.activeName)
      }else{
        sessionStorage.setItem('clue-active-name','clue')
      }
    },
    closeFollow(val){
      this.customerFollow = val;
    },
    refresh(){
      this.getDetail();
    },
    // 获取公海线索详情
    getSeaData(){
      let params = this.clueType == 1?
      {clueCompanyId: this.accountId}:
      {cluePersonId: this.accountId}
      getSeaDetail(params,this.clueType,0).then(res=>{
        if (res.data.code == CodeMsg.CODE_0) {
          this.userData = res.data.data
          this.userData.clueType = this.clueType
        }
      })
    },
    // 获取线索详情数据
    getDetail(){
      let params = this.clueType == 1?{clueCompanyId: this.accountId}:{cluePersonId: this.accountId}
      getClueDetail(params,this.clueType,this.type == 0?true:false).then(res=>{
        if (res.data.code == CodeMsg.CODE_0) {
          this.userData = res.data.data
          this.userData.clueType = this.clueType
        }
      })
    },
    getData() {
      if(this.source){
        this.getSeaData() 
      }else{
        this.getDetail()
      }
    },
    setActiveName(){
      console.log(this.$route)
      console.log(Location)
      if(sessionStorage.getItem('clue-active-name')){
        this.activeName = sessionStorage.getItem('clue-active-name')
      }
    },
  },
   mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.new_client_detail {
  margin-left: 10px;
  overflow: hidden;
}
.tab_content {
  background: #ffffff;
  border-radius: 3px;
  margin-top: 10px;
  padding: 10px 0 0 25px;
}
.order-filter-item {
  margin: 0 0 15px 0;
}
</style>