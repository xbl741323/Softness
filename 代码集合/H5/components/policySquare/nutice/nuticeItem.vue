<template>
  <div class="nutice_item" @click="toDetail(nuticeInfo.id)">
    <div class="item_title">
      <span></span>
      <span>
        <span 
          :class="[nuticeInfo.applyType==1?'orange':nuticeInfo.applyType==2?'blue':'grey','tag-sty']" 
          v-if="nuticeInfo.applyType">
          {{nuticeInfo.applyType | filterType}}
        </span>
        <img v-if="nuticeInfo.state==0" :src="require('@/assets/images/policySquare/icon_top@2x.png')" alt="">
        <span class="tit_sty" v-html="transfer(nuticeInfo.title)"></span>
        </span>
      <span class="nutice_pointer">
        <i class="iconfont">&#xe62a;</i>
      </span>
    </div>
    <div class="item_desc">
      <div class="desc_time">{{ nuticeInfo.create_time | filterTime}}</div>
      <div class="desc_view" v-if="info=='HY'">
        <img :src="require('@/assets/images/policySquare/icon_view@3x.png')" alt="">
        <span>{{ nuticeInfo.page_views }}次</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["nuticeInfo","sort","showStatus","keyWords","info"],
  data() {
    return {
      scrollTop: "",
      page:1,
    };
  },
  filters:{
    filterTime(val){
      if(val){
        return val.slice(0, 10)
      }
    },
    filterType(val){
        return val == 1 ? '未开始' : val == 2 ? '申报中' : val == 3 ? '已结束': ''
    }
  },
  methods: {
    transfer(str){
      return str.replaceAll('font-size:17px','font-size:15px')
    },
    toDetail(id) {
      if(sessionStorage.getItem("projectPage")){
      this.page = sessionStorage.getItem("projectPage")
      }
      const newPath = this.$router.resolve({
        path: this.info=='HY'? `/policy/${this.nuticeInfo.industry_no}0${this.sort}?id=${id}` : `/policy/${this.nuticeInfo.number}0${this.sort}?id=${id}`
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
  overflow: hidden;
  font-size: var(--size-14);
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  color: #000000;
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
  padding-top: 0.2rem;
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
.tag-sty {
  display: inline-block;
  width: 50px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 15px;
  font-size: var(--size-12);
}
.blue {
  background: #0989E8;
  color: #fff;
}
.grey {
  background: #B4B4B4;
  color: #fff;
}
.orange {
  background: #FA7F49;
  color: #fff;
}
.tit_sty {
  font-weight: 700;
  font-size: var(--size-14) !important;
  text-size-adjust: none;
}
</style>