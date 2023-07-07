<template>
    <div class="fee-standard">
        <div class="header_top">
        <i class="back" @click="goBack()"></i>
            官费收费标准
        </div>
        <img :src="require('~/assets/images/zscq/guanfei_pic@2x.png')" alt="" />
    </div>
</template>

<script>
export default {
  components: {
  },
  layout: "default",
  head() {
    return {
      title: "卧涛网（WOTAO.COM）-专业的科技企业服务平台，找企业服务就上卧涛网！",
      meta: [
        { charset: "utf-8" },
        {
          name: "keywords",
          content:
            "高新技术企业,创业,专利申请,品牌策划,注册公司,软件开发,企业管理,融资"
        },
        {
          hid: "description",
          name: "description",
          content:
            "卧涛网，专业的科技企业服务平台。为科技企业提供全方位的企业服务项目，如高新技术企业认定代理、公司注册、商标/专利申请、融资上市、企业管理、软件开发、股改、品牌策划等各项企业服务。卧涛专注企业服务10年，金牌服务，售后无忧！"
        }
      ]
    };
  },
  data() {
    return {
      title: this.$t("title.indexMetaTitle")
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.fee-standard {
  background: #f4f6f8;
  width: 100%;
  position: relative;
}
.fee-standard img{
    width: 100%;
    margin-top: 1.17333333333rem;
}
.header_top {
  position: fixed;
  top: 0;
  width: 100%;
  height: 1.17333333333rem;
  font-size: 0.42666666666rem;
  line-height: 1.17333333333rem;
  padding: 0 0.64rem;
  color: #545454;
  z-index: 1;
  background: #ffffff;
  text-align: center !important;
}
.back {
  float: left;
  margin-top: 0.42666666666rem;
  content: "";
  /* display: inline-block; */
  height: 0.32rem;
  width: 0.32rem;
  border-width: 0 0 0.02666666666rem 0.02666666666rem;
  border-color: #545454;
  border-style: solid;
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
}
</style>