<template>
  <div class="account_set">
    <div class="account_title">账户设置</div>
    <!-- tab切换区域 -->
    <div class="account_head">
      <div class="title_tab">
        <span
          v-for="(item, index) in tabList"
          :key="index"
          :class="[showIndex == index ? 'change_sty' : '']"
          @click="showIndex = index"
          >{{ item.title }}</span
        >
      </div>
    </div>
    <!-- 内容切换区域 -->
    <!-- <div class="basic_info" v-if="showIndex == 0">
      <user-info @to-safe="toSafe"></user-info>
    </div> -->
    <div class="basic_info" v-if="showIndex == 0">
      <basic-info @to-safe="toSafe"></basic-info>
    </div>
    <div class="safe_set" v-if="showIndex == 1">
      <safe-set ></safe-set>
    </div>
    <div class="address_plat" v-if="showIndex == 2">
      <address-plat></address-plat>
    </div>
  </div>
</template>

<script>
import userInfo from "./userInfo";
import basicInfo from "./basicInfo";
import safeSet from "./safeSet";
import addressPlat from "./address_plat"
export default {
  components: {
    userInfo,
    safeSet,
    addressPlat,
    basicInfo
  },
  head() {
    return {
      title: this.metaTitle,
    };
  },
  created() {
    if (this.$route.query.showIndex) {
      this.showIndex = this.$route.query.showIndex
    }
  },
  mounted() {
    if (this.$route.query.showIndex==0) {
      this.showIndex = this.$route.query.showIndex
    }
  },
  data() {
    return {
      metaTitle: "账户设置",
      showIndex: 0,
      tabList: [
        {
          title: "基本信息",
        },
        {
          title: "账号信息",
        },
        {
          title: "收件地址",
        }
      ],
    };
  },
  methods:{
    toSafe(str){
      scrollTo(0,0);
      this.showIndex = str
    },
  }
};
</script>

<style scoped>
.account_set {
  width: 950px;
  height: 100%;
  background: #ffffff !important;
  opacity: 1;
  overflow: hidden;
}
.account_title {
  width: 64px;
  height: 21px;
  font-size: 16px;
  font-weight: bold;
  line-height: 21px;
  margin: 26px 0 0px 24px;
  color: #333333;
}
.account_head {
  margin-top: 27px;
  width: 948px;
  height: 40px;
  background: #f3f3f3;
  opacity: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title_tab {
  display: flex;
}
.title_tab span {
  display: flex;
  width: 140px;
  height: 40px;
  font-weight: 400;
  background: #f3f3f3;
  opacity: 1;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666666;
  cursor: pointer;
}
.change_sty {
  background: #36a6fe !important;
  color: #ffffff !important;
}
</style>