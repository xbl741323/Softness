<template>
  <a class="article-item" :href="'/article-list/'+info.number+'?oneId='+$route.query.oneId+'&childId='+$route.query.childId" target="_self">
    <div class="article_item_contain">
      <div class="item_title">
        <span v-html="info.title"></span>
        <span>{{ info.create_time | timeFilter }}</span>
        <span></span>
      </div>
      <p v-html="$options.filters.clearTag(info.content)"></p>
    </div>
  </a>
</template>

<script>
export default {
  props: ["info","filters","id"],
  data() {
    return {};
  },
  filters:{
    timeFilter(val){
      if(val){
        return val.slice(0,10)
      }
    },
    clearTag(val) {
      if(val!==null){
        return (
        val
          .replace(/&ldquo;/gi, '"')
          .replace(/&rdquo;/gi, '"')
          .replace(/<[^>]+>|&[^>]+;\s*/g, "")
          .replace(/\s+/g, "")
      );
      }
    },
  },
  methods:{
  }
};
</script>

<style scoped>
.article-item {
  width: 100%;
  background: #ffffff;
  padding: 16px 10px 0 20px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid #d4d4d4;
  cursor: pointer;
  text-decoration: none;
}
.item_title {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.article_item_contain {
  width: 100%;
  padding-bottom: 16px;
}
.article-item p {
  width: 100%;
  /* height: 40px; */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  color: #666666;
  font-size: 14px;
  line-height: 21px;
}
.item_title > span:nth-of-type(1) {
  display: inline-block;
  width: 100%;
  color: #333333;
  font-size: 18px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item_title > span:nth-of-type(2) {
  display: inline-block;
  width: 90px;
  text-align: right;
  color: #999999;
  font-size: 14px;
  overflow: hidden;
}
.item_title > span:nth-of-type(3) {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #f97700;
  border-radius: 50%;
  position: absolute;
  left: -16px;
  top: 7px;
}
</style>