<template>
  <div class="frame">
    <div class="banner_img"  v-if="searchMark != 0">
      <banner :typeId="0"></banner>
    </div>
    <div class="search_box"  v-if="searchMark != 0">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'index' }">{{
          $t("txt.home")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'index-policy-policysquare' }">{{
          $t("txt.policySquare")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t("txt.announcements") }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <common
      :typeId="0"
      :prompt="promptValue"
      @title="getTitle"
      :searchMark="searchMark"
      :content="this.content"
    />
  </div>
</template>

<script>
import Common from "@/components/policy/commonList";
import Banner from "@/components/policy/banner";
export default {
  props: ["searchMark", "content"],
  components: {
    Common,
    Banner
  },
  head() {
    return {
      title: "全国科技项目申报通知文件快速查询-卧涛网",
      meta: [
        { name: "keywords", content: "项目申报通知、项目政策公告" },
        {
          hid: "description",
          name: "description",
          content:
            "卧涛网平台汇集全国各地市科技项目申报通知、项目政策公告，及时更新，快速查询。落地企业项目申报最后一公里。",
        },
      ],
    };
  },
  data() {
    return {
      cdnPath: process.env.CDN_BASE_URL,
      title: "",
      promptValue: "搜索通知公告",
      bannerImg: [],
    };
  },
  methods: {
    getTitle(val) {
      this.title = val;
    },
  },
  mounted() {},
};
</script>

<style lang="stylus" scoped>
.frame {
  width: 100%;
  min-width: 1200px;
  background: #F1F1F1;
  font-family: Microsoft YaHei UI;

  .banner_img {
    height: 440px;
  }

  .search_box {
    width: 1200px;
    margin: 20px auto;
    font-size: 14px;
  }
}
</style>