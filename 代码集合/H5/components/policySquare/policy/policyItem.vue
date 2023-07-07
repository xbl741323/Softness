<template>
  <div class="nutice_item" @click="toDetail">
    <div class="item_title">
      <!-- <span class="trouble_ling"></span> -->
      <span></span>
      <!-- <img :src="require('@/assets/images/policySquare/icon_new@2x.png')" alt=""> -->
      <span>{{ nuticeInfo.title }}<img v-if="nuticeInfo.isNew=='1'" :src="require('@/assets/images/policySquare/icon_new@2x.png')" alt=""></span>
      <span class="nutice_pointer">
        <i class="iconfont">&#xe62a;</i>
      </span>
    </div>
    <div class="item_desc">
      <div class="desc_time">{{ nuticeInfo.createTime }}</div>
      <div class="desc_view">
        <!-- <img :src="require('@/assets/images/policySquare/icon_view@3x.png')" alt="">
        <span>{{ nuticeInfo.pageViews }}</span> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["nuticeInfo","sort","showStatus","keyWords"],
  data() {
    return {
      scrollTop: "",
      page:1,
    };
  },
  methods: {
    toDetail() {
      if(sessionStorage.getItem("projectPage")){
      this.page = sessionStorage.getItem("projectPage")
      }
      const newPath = this.$router.resolve({
        path: "/policy/" + this.nuticeInfo.number + 1 +this.sort,
        query: {
          catch: this.showStatus,
          skiFrom:true,
          page:this.page,
          keyWords:this.keyWords
          }
      });
      window.open(newPath.href, "_self");
    }
  }
};
</script>

<style scoped>
.nutice_item {
  width: 100%;
  height: 2.42666666667rem;
  border-bottom: 1px solid #F4F6F8;
  overflow: hidden;
}
.item_title {
  position: relative;
  width: 100%;
  height: 1.05rem;
  margin-left: 0.42666666667rem;
  margin-top: 0.42666666667rem;
  font-size: 0.37333333333rem;
  overflow: hidden;
}
.item_title > span:nth-of-type(1) {
  color: #36a6fe;
}
.item_title > span:nth-of-type(2) {
  color: #333;
  width: 89%;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.item_desc {
  display: flex;
  justify-content: space-between;
  color: #999999;
  font-size: 0.29333333333rem;
}
.desc_time {
  margin-top: 0.2rem;
  margin-left: 0.42666666667rem;
}
.desc_view {
  margin-top: 0.2rem;
  margin-right: 0.42666666667rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.desc_view img {
  width: 0.37333333333rem;
  height: 0.37333333333rem;
  margin-right: 0.10666666667rem;
}
.trouble_ling {
  display: inline-block;
  width: 0.18rem;
  height: 0.18rem;
  margin-left: 0.06rem;
  background: #36a6fe;
  transform: rotate(45deg);
  margin-bottom: 0.05333333333rem;
}
.item_title .nutice_pointer{
  position: absolute;
  display: inline-block;
  width: 8px;
  height: 8px;
  top: 12px;
  right: 30px;
}
.item_title .nutice_pointer i{
  font-size: 8px;
  color: #989898;
}
.item_title img{
  width: 24px;
  height: 12px;
  margin-left: 4px;
}
</style>