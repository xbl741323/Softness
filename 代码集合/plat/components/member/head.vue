<template>
  <div class="member_head">
    <!-- 会员中心head导航区域 -->
    <div class="member_head_nav">
      <div class="center_left">
        <span>会员中心</span>
        <span style="margin-left: 20px">|</span>
      </div>
      <div class="center_right">
        <!-- <nuxt-link
          class="right_item"
          v-for="(item, index) in tabList"
          :key="index"
          :to="item.path"
          @click.native="changeTab(item)"
        >
          {{ item.title }}</nuxt-link
        > -->
         <span
          class="right_item"
          v-for="(item, index) in tabList"
          :key="index"
          @click="changeTab(item)"
        >
          {{ item.title }}
          </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabList: [
        {
          path: "/aboutWt/",
          title: "关于卧涛",
        },
        {
          path: "/policy/policysquare",
          title: "资讯广场",
        },
        {
          path: "/project",
          title: "项目申报",
        },
        {
          path: "/",
          title: "卧涛首页",
        },
        {
          path: "/member",
          title: "会员首页",
        },
      ],
    };
  },
  methods: {
    changeTab(item) {
      if (item.path == "/member") {
        this.$emit("member-center");
      }
      if(item.title=='关于卧涛'){
           window.open("/aboutWt/",'_self');
      }else{
            this.$router.push(item.path); 
      }
   
    },
  },
};
</script>

<style scoped>
.member_head {
  width: 100%;
  height: 56px;
  background: #36a6fe;
  opacity: 1;
}
.member_head_nav {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.center_left {
  width: 481px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #ffffff;
  font-size: 24px;
}
.center_right {
  display: flex;
  flex-direction: row-reverse;
  width: 712px;
}
.right_item {
  width: 64px;
  height: 100%;
  line-height: 56px;
  margin-left: 50px;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
}
</style>