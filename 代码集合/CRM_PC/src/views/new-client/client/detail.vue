<template>
  <div class="new_client_detail">
    <!-- 基本用户信息 -->
    <basic-info :userData="userData" @refresh="getData" :type="type" :source="source" :accountId='accountId'></basic-info>
    <div class="tab_content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="线索信息" name="clue"></el-tab-pane>
        <el-tab-pane label="订单记录" name="order"></el-tab-pane>
        <el-tab-pane label="线索列表" name="clueInfo"></el-tab-pane>
        <el-tab-pane label="维护记录" name="operate"></el-tab-pane>
      </el-tabs>
      <clue-info v-if="activeName=='clue'" @refresh="getData" :userData="userData" :myType="myType" :type="type" :source="source" :customerType="customerType" :clueId='accountId' :clueType='clueType'></clue-info>
      <product-order v-if="orderType == 0 && activeName == 'order'" :source="type == 1 ? 'list' : 'personal'" :clueIdList="userData.clueIdList" :clueType="clueType"></product-order>
      <clue-record v-if="activeName=='clueInfo'" ref="record" @refresh="getNewData" :accountId="accountId" :source="source" :clueId="userData.id" @getData="getData" :type="type" :userData="userData"></clue-record>
      <operate-records v-if="activeName=='operate'" :userData="userData" :type="type"></operate-records>
    </div>
  </div>
</template>

<script>
import { getClientDetail,getSeaDetail } from "@/api/new-client/my-clue"
import basicInfo from "@/components/new-client/common/client-basic-info";
import clueInfo from "@/components/new-client/clue-info/index";
import operateRecords from "@/components/new-client/operate-records/index";
import registerInfo from "@/components/new-client/register-info/index";
import * as CodeMsg from "@/api/common/CodeChange"
import clueRecord from "@/components/new-client/clue-records/index";
import productOrder from "@/components/personal/my-users/product-order"
export default {
  components: {
    basicInfo,
    clueInfo,
    operateRecords,
    registerInfo,
    clueRecord,
    productOrder
  },
  data() {
    return {
      clueType: 1,// clueType：1-单位 0-个人
      myType: 1, // 0：我的线索 1：我的客户
      source: false,
      userData: {},
      accountId: "",
      type: "", //来源-> 0:个人中心 1:客户管理
      loginEmpNo: "",
      activeName: "clue",
      orderType: 0,
      customerType: 'customer' // 客户类型 clue-线索客户 customer-成交客户
    };
  },
  created() {
    this.accountId = this.$route.query.id;
    this.type = this.$route.query.type;
    this.clueType = this.$route.query.clueType;
    if(this.$route.query.source){
      this.source = true
    }
  },
  methods: {
    getNewData(id){
      this.accountId = id
      this.getData()
    },
    handleClick(){
      this.getData()
    },
    refresh(){
      this.getData();
    },
    // 获取公海线索详情
    getSeaData(){
      let params = this.clueType == 1?
      {clueCompanyId: this.accountId}:
      {cluePersonId: this.accountId}
      getSeaDetail(params,this.clueType,1).then(res=>{
        if (res.data.code == CodeMsg.CODE_0) {
          this.userData = res.data.data
          this.userData.clueType = this.clueType
        }
      })
    },
    // 获取线索详情数据
    getDetail(){
      let params = this.clueType == 1?
      {clueId: this.accountId}:
      {clueId: this.accountId}
      getClientDetail(params,this.clueType,this.type == 0 ? true:false).then(res=>{
        console.log(res);
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