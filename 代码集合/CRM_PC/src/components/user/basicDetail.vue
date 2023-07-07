<template>
  <div class="basic_detail">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="注册信息" name="register"></el-tab-pane>
        <el-tab-pane v-if="userData.auditStatus=='1'" label="补充信息" name="info"></el-tab-pane>
      </el-tabs>
      <register-info :dialog="false"  v-if="activeName=='register'" :type="type" :source="source" :basicData="userData" :innerInfo='innerInfo' :unitVO='unitVO' :showTitle="false"></register-info>
      <clue-info v-if="activeName=='info'" :userData="innerInfo" :type="type" :phone="userData.accountNo" :accountType="userData.accountType" :unitVO='unitVO' :clueOrganization="clueOrganization"></clue-info>
  </div>
</template>

<script>
import clueInfo from "@/components/user/common/clue-info";
import registerInfo from "@/components/user/common/register-info";
export default {
  props:['userData','innerInfo','unitVO','type','clueOrganization'],
  components: {
    clueInfo,
    registerInfo,
  },
  data() {
    return {
        source:false,
        myType:0,
        activeName: "register",
    };
  },
  methods:{}
};
</script>

<style scoped>
.basic_detail{
  padding: 0 30px;
}
</style>