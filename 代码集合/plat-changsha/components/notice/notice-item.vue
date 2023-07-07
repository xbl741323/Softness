<template>
  <div class="notice_item" @click="toDeatil">
    <div>
      <el-tooltip
        :content="noticeInfo.title"
        placement="top"
        :disabled="disabled"
        effect="light">
        <span v-html="noticeInfo.title">
          <span class="top_sty" v-if="noticeInfo.show_status == 0">置顶</span>
        </span>
      </el-tooltip>
      <span>{{ noticeInfo.create_time | timeFilter }}</span>
    </div>
    <div>
      <span v-html="$options.filters.clearTag(noticeInfo.small_content)"></span>
      <span class="show_all">查看全文>></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["noticeInfo","id"],
  data() {
    return {
      disabled: true,
    };
  },
  filters: {
    clearTag(val) {
      let msg = val.replace(/&ldquo;/gi, '"').replace(/&rdquo;/gi, '"').replace(/<[^>]+>|&[^>]+;\s*/g, "").replace(/\s+/g, "")
      return msg.length>142?msg.slice(0, 143) + "...":msg.slice(0, 143)
    },
    timeFilter(val){
      if(val){
        return val.slice(0,10)
      }
    },
  },
  updated() {
    this.checkDisabled();
  },
  methods: {
    toDeatil() {
      sessionStorage.setItem("navIndex", 154);
      const newPath = this.$router.resolve({
        path: "/notice/detail",
        query: {
          number: this.noticeInfo.number,
        },
      });
      window.open(newPath.href,'_self');
    },
    checkDisabled() {
      this.disabled = this.noticeInfo.title.length > 48 ? false : true;
    },
  },
  mounted() {
    this.checkDisabled();
  },
};
</script>

<style scoped>
.notice_item {
  width: 100%;
  height: 93px;
  padding: 15px 10px;
  border-bottom: 1px solid #e7e6eb;
  cursor: pointer;
}
.notice_item > div:nth-of-type(1) {
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
}
.notice_item > div:nth-of-type(1) > span:nth-of-type(1) {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  width: 820px;
  padding-right: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}
.notice_item > div:nth-of-type(1) > span:nth-of-type(2) {
  color: #86898b;
  font-size: 14px;
}
.notice_item > div:nth-of-type(2) {
  width: 100%;
  color: #8a8a8a;
  font-size: 12px;
  line-height: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}
.notice_item > div:nth-of-type(2) >>> p {
  width: 100%;
  color: #8a8a8a;
  font-size: 12px;
  line-height: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.top_sty {
  display: inline-block;
  padding: 1px 5px;
  border-radius: 3px;
  background: #fd651c;
  right: -0px;
  top: 0;
  color: #ffffff;
  font-size: 14px;
  position: absolute;
}
.show_all {
  position: absolute;
  color: #4aaffe;
  font-size: 12px;
  right: 0;
  bottom: 0;
  background: #ffffff;
}
</style>