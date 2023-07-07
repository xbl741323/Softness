<template>
  <div class="trouble_item" @click="toDetail">
    <div class="item_title">
      <span v-html="nuticeInfo.title"></span>
    </div>
    <div class="item_desc">
      <div class="desc_time">{{ nuticeInfo.createTime | filterTime}}</div>
      <div class="desc_view">
        <img :src="require('@/assets/images/policySquare/icon_wenda@2x.png')" alt="">
        <span v-if="nuticeInfo.answerCount&&nuticeInfo.answerCount>0">{{ nuticeInfo.answerCount }}回答</span>
        <span v-else>0回答</span>
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
  filters: {
    filterTime(val){
      if(val){
          return val.length > 10 ? val.slice(0,10) : val
      }
    },
    filterCount(val) {
      if(val){
          return val>0 ? val : 0
      }else{
          return 0
      }
    }
  },
  methods: {
    delHtmlTag(str) {
      if(str){
        return str.replace(/<[^>]+>/g, "");
      }
    },
    toDetail() {
      const newPath = this.$router.resolve({
        path: "/policy/questionDetail",
        query: {
          id: this.nuticeInfo.id
        }
      });
      window.open(newPath.href, "_self");
    }
  }
};
</script>

<style scoped>
.trouble_item {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.2rem 0.2rem 0.6rem 0.1rem;
  border-bottom: 1px solid #F4F6F8;
}
.item_title {
  width: 85.6%;
  color: #111E34;
  margin-left: 0.57666666667rem;
  margin-top: 0.27666666667rem;
  font-size: 0.37333333333rem;
  font-family: Source Han Sans CN, Source Han Sans CN-Bold;
  font-weight: 700;
  color: #000000;
}
.item_title img{
  width: 100%;
  height: 100%;
}
.item_title > span:nth-of-type(1) {
  color: #111E34;
  overflow: hidden;
  min-height: 0.5066666666666667rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.item_title > span:nth-of-type(2) {
  color: #333;
  margin-left: 0.1rem;
}
.item_desc {
  height: 0.12rem;
  margin-top: 0.22666666667rem;
  display: flex;
  justify-content: space-between;
  color: #999999;
  font-size: 0.29333333333rem;
}
.desc_time {
  height: 0.32rem;
  margin-top: 0.21333333333rem;
  margin-left: 0.57666666667rem;
  font-family: Source Han Sans CN, Source Han Sans CN-Light;
  font-weight: 300;
  color: #999999;
}
.desc_view {
  height: 0.32rem;
  margin-top: 0.21333333333rem;
  margin-right: 0.42666666667rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.desc_view img {
  width: 0.32rem;
  height: 0.32rem;
  margin-right: 0.10666666667rem;
}
.item_intro {
  position: relative;
  margin-top: 0.2rem;
  width: 100%;
  margin-left: 0.57666666667rem;
  font-size: 0.32rem;
  color: #666666;
  color: #333;
}
.item_intro>span:nth-of-type(1){
  position: absolute;
  display: inline-block;
  width: 0.4266666666666667rem;
  height: 0.4266666666666667rem;
  left: -0.6rem;
  top:0;
  border-radius: 4px;
}
.item_intro>span:nth-of-type(1) img{
  width: 0.4266666666666667rem;
  height: 0.4266666666666667rem;
}
.item_intro .intro_pointer{
  position: absolute;
  display: inline-block;
  width: 0.2133333333333333rem;
  height: 0.2133333333333333rem;
  top: 0;
  right: 1.28rem;
}
.item_intro .intro_pointer i{
  font-size: 0.2133333333333333rem;
  color: #989898;
}
.intro_content{
  width: 85.6%;
  overflow: hidden;
  display: -webkit-box;
  line-height: 18px;
  color: #111E34;
  opacity: 0.9;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.trouble_ling {
  display: inline-block;
  width: 0.18rem;
  height: 0.18rem;
  background: #36a6fe;
  transform: rotate3d(1, 2, 2.4, 60deg);
}
</style>