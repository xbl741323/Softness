<template>
  <a :href="'/article-list/'+info.number+'?oneId='+$route.query.oneId+'&childId='+$route.query.childId" target="_self" :class="['graphic_item',globalStatus == true?'graphic_global_item':'']">
    <div class="item_left">
      <img :src="baseUrl+info.cover_url" alt="封面图片" />
    </div>
    <div :class="['item_right',globalStatus == true?'item_global_right':'']">
      <span v-html="info.title"></span>
      <p v-html="$options.filters.clearTag(info.content)"></p>
    </div>
  </a>
</template>

<script>
export default {
  props: ["info","filters","id"],
  data() {
    return {
      globalStatus: false,
      baseUrl:process.env.CDN_BASE_URL,
    };
  },
  filters:{
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
  },
  mounted() {
    this.globalStatus = this.$route.path == "/global-search" ? true : false;
  },
};
</script>

<style scoped>
.graphic_item {
  width: 100%;
  height: 150px;
  background: #ffffff;
  padding: 20px;
  opacity: 1;
  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  text-decoration: none;
}
.graphic_global_item {
  background: #f5f5f5 !important;
  margin-bottom: 15px !important;
}
.item_left {
  width: 154px;
  height: 110px;
  opacity: 1;
  margin-right: 20px;
}
.item_left img {
  width: 100%;
  height: 100%;
}
.item_right {
  width: 84.5%;
  height: 83px;
  display: flex;
  flex-direction: column;
}
.item_global_right {
  width: 80% !important;
}
.item_right > span {
  width: 100%;
  height: 24px;
  line-height: 24px;
  color: #333333;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item_right > p {
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  color: #666666;
  font-size: 14px;
}
</style>