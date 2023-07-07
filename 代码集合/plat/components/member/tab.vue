<template>
  <div class="member_content">
    <!-- 左侧导航区域  -->
    <div class="member_tab">
      <div
        :class="['tab_item', showPath == item.path ? 'tab_color' : '']"
        v-for="(item, index) in tabList"
        :key="index"
        @click="ski(item, index)"
      >
        <span>{{ item.title }}</span>
        <span
          :class="['tab_link', showPath == item.path ? 'tab_color_bg' : '']"
        ></span>
      </div>
    </div>

    <!-- 右侧内容切换区域  -->
    <nuxt-child />

    <!-- 底部推荐区域 -->
    <!-- <div class="member_bottom" v-if="showPath == '/member'">
      <div class="bottom_title">热门项目</div>
      <div class="bottom_span"></div>
      <div class="bottom_project">
        <project-item
          v-for="(item, index) in projectList"
          :collectInfo="item"
          :key="index"
        ></project-item>
      </div>
    </div> -->
    <!-- 订阅消息 -->
    <div class="focusTip">
      <focusTip v-if="showPath=='/member'||showPath=='/member/authentication'||showPath=='/member/auth-info'"></focusTip>
    </div>
  </div>
</template>

<script>
import { getCollecPro } from "@/api/member";
import projectItem from "./components/collect/projectItem";
import member from "./components/member";
import collect from "./components/collect/collect";
import account from "./components/account/account";
import focusTip from "@/components/order/focus-tip";
export default {
  components: {
    member,
    account,
    collect,
    projectItem,
    focusTip
  },
  data() {
    return {
      pageSize:4,
      currentPage:1,
      showPath: "",
      projectList: [],
      tabList: [
        {
          path: "/member",
          title: "个人中心",
        },
        {
          path: "/member/account",
          title: "账户设置",
        },
        {
          path: "/member/collect",
          title: "我的收藏",
        },
        {
          path: "/member/order",
          title: "我的订单",
        },
        {
          path: "/member/authentication",
          title: "身份认证",
        },
        {
          path: "/member/question",
          title: "我的提问",
        },
      ],
    };
  },
  watch: {
    $route: "getPath",
  },
  methods: {
    getPath() {
      this.showPath = this.$route.path;
    },
    ski(item, index) {
      this.$router.push({
        path: item.path,
      });
    },
  },
  mounted(){
    this.getPath()
  }
};
</script>

<style scoped>
.member_content {
  width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
  padding-bottom: 100px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}
.member_tab {
  width: 220px;
  min-height: 882px;
  /* background: #ffffff; */
  opacity: 1;
  margin-right: 20px;
}
.tab_item {
  width: 220px;
  height: 50px;
  font-size: 16px;
  color: #333333;
  font-weight: 400;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eff2f3;
  text-decoration: none;
  cursor: pointer;
   background: #ffffff;
}
.tab_color {
  color: #36a6fe;
}
.tab_color_bg {
  border: 2px solid #36a6fe !important;
  border-left: none !important;
  border-bottom: none !important;
}
.tab_link {
  display: inline-block;
  margin-top: 4px;
  width: 10px;
  height: 10px;
  border: 2px solid #333333;
  transform: rotate(45deg);
  border-left: none;
  border-bottom: none;
  margin-left: 50px;
}
.member_main {
  width: 950px;
  min-height: 882px;
}
.member_bottom {
  width: 1190px;
  height: 363px;
  background: #ffffff;
  opacity: 1;
  border-radius: 4px;
  margin-top: 30px;
}
.bottom_title {
  width: 64px;
  height: 20px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #373d40;
  opacity: 1;
  font-weight: bold;
  margin: 20px 0 16px 20px;
}
.bottom_span {
  width: 1143px;
  height: 0px;
  border: 1px solid #ebebeb;
  opacity: 1;
  margin-left: 20px;
}
.bottom_project {
  display: flex;
  margin-top: 20px;
  margin-left: 20px;
}
.focusTip{
  position: absolute;
  left: 45%;
  bottom: 0;
}
</style>