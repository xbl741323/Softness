<template>
  <div>
    <mt-header :title="title + '实名认证'" class="header">
      <router-link to="/member" slot="left">
        <mt-button icon="back"></mt-button
      ></router-link>
    </mt-header>
    <!-- 审核中 -->
    <div class="result" v-if="authenticationStatus == 3||authenticationStatus == 1">
      <img
        class="result-img"
        src="@/assets/images/member/shenhe@2x.png"
        alt=""
      />
      <p class="result-title">
        您的{{ authInfo.autType == 2 ? "单位" : "个人" }}实名认证正在审核中！
      </p>
      <div v-if="authInfo.autType == 2" class="result-info">
        <p style="margin-bottom: 2px">单位名称：{{ authInfo.companyName }}</p>
        <p>统一社会信用代码：{{ authInfo.organization }}</p>
      </div>
      <div v-else class="result-info">
        <p style="margin-bottom: 2px">真实姓名：{{ authInfo.personName }}</p>
        <p>身份证号码：{{ authInfo.idCard }}</p>
      </div>
      <div class="reset-btn-contain">
        <span class="result-btn" @click="againStatus">重新认证</span>
        <span class="result-btn" @click="changeStatus">继续认证</span>
      </div>
    </div>
    <!-- 通过 -->
    <div class="result" v-if="authenticationStatus == 2">
      <img
        class="result-img"
        src="@/assets/images/member/chenggong@2x.png"
        alt=""
      />
      <p class="result-title">
        您已通过{{ authInfo.autType == 2 ? "单位" : "个人" }}实名认证审核！
      </p>
      <div v-if="authInfo.autType == 2" class="result-info">
        <p style="margin-bottom: 2px">单位名称：{{ authInfo.companyName }}</p>
        <p>统一社会信用代码：{{ authInfo.organization }}</p>
      </div>
      <div v-else class="result-info">
        <p style="margin-bottom: 2px">真实姓名：{{ authInfo.personName }}</p>
        <p>身份证号码：{{ authInfo.idCard }}</p>
      </div>
    </div>
    <!-- 未通过 -->
    <div class="result" v-if="authenticationStatus == 4">
      <img
        class="result-img"
        src="@/assets/images/member/cuowu@2x.png"
        alt=""
      />
      <p class="result-title">
        很抱歉，您的{{
          authInfo.autType == 2 ? "单位" : "个人"
        }}实名认证未通过审核！
      </p>
      <p class="result-desc">未通过原因：{{ authInfo.auditFailReason }}</p>
      <div class="result-btn" @click="changeStatus">继续认证</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["authenticationStatus", "accountType", "authInfo"],
  data() {
    return {
      title: "",
      newIdCard: "",
      newOrganization: "",
    };
  },
  methods: {
    againStatus() {
     sessionStorage.setItem('resetAuth',true)
     this.$emit("resetComfirm");
    },
    changeStatus() {
      this.$emit("confirmNext");
    },
  },
  mounted() {
    this.title = this.authInfo.autType == 2 ? "单位" : this.authInfo.autType == 1? "个人" :"";
  },
};
</script>

<style scoped>
.header {
  background: #ffffff;
  height: 56px;
  font-size: 16px;
  color: rgb(189, 172, 172);
  box-shadow: 3px 3px 4px 0px rgba(0, 0, 0, 0.03);
  color: #333;
}
.result {
  width: 100%;
  height: 70vh;
  font-family: Microsoft YaHei;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.result-title {
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  color: #333333;
  margin: 6px 0;
}
.result-img {
  width: 32px;
  height: 32px;
}
.result-desc {
  font-size: 12px;
  color: #fd651c;
}
.result-info {
  text-align: center;
  color: #333;
  font-size: 14px;
}
.result-btn {
  width: 100px;
  height: 30px;
  background: #36a6fe;
  border-radius: 3px;
  line-height: 30px;
  text-align: center;
  color: #ffffff;
  font-size: 12px;
  margin-top: 6px;
  margin-right: 10px;
}
.reset-btn-contain {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
}
.reset-btn-contain > span:nth-of-type(1) {
  background: #f4f4f4;
  border: 1px solid #e8e8e8;
  color: #999999;
}
</style>
