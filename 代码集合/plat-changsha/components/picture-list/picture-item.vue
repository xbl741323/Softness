<template>
  <a
    :href="'/article-list/'+info.number+'?oneId='+$route.query.oneId+'&childId='+$route.query.childId" target="_self"
    :class="[
      'picture_item',
      (index + 1) % 5 == 0 && globalStatus == false
        ? 'active_picture_item'
        : (index + 1) % 4 == 0 && globalStatus == true
        ? 'active_picture_item'
        : '',
      globalStatus == true ? 'picture_global_item' : '',
    ]">
    <img :src="baseUrl+info.cover_url" alt="封面" />
    <span v-html="info.title"></span>
    <p v-html="$options.filters.clearTag(info.content)"></p>
  </a>
</template>

<script>
export default {
  props: ["info","index","filters","id"],
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
.picture_item {
  width: 222px;
  height: 218px;
  padding: 10px;
  background: #ffffff;
  opacity: 1;
  border-radius: 5px;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  text-decoration: none;
}
.picture_global_item {
  background: #f5f5f5 !important;
  margin-right: 12px;
  margin-bottom: 12px;
}
.active_picture_item {
  margin-right: 0 !important;
}
.picture_item img {
  width: 202px;
  height: 144px;
  border-radius: 2px;
}
.picture_item span {
  display: inline-block;
  width: 100%;
  height: 21px;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.picture_item p {
  width: 100%;
  height: 19px;
  font-size: 14px;
  font-weight: 400;
  line-height: 19px;
  color: #999999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>