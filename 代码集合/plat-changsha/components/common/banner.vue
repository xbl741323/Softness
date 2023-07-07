<template>
  <div class="common_banner">
    <el-carousel
      indicator-position="none"
      :interval="5000"
      arrow="never"
      height="440px">
      <el-carousel-item v-for="(item, index) in bannerList" :key="index">
        <img :src="imgUrl + item.photoUrl" @click="toLink(item)" alt="banner图" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  props: ["bannerList"],
  data() {
    return {
      imgUrl:process.env.CDN_BASE_URL
    };
  },
  methods: {
    toLink(val) {
      if (val.linkUrl !== "") {
        window.open(val.linkUrl);
      }
    },
  },
};
</script>

<style scoped>
.common_banner {
  margin-bottom: 10px;
  height: 440px;
  margin-top: 110px;
}
.common_banner img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>