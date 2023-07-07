<template>
  <div class="notice_search">
    <img :src="imgOne" alt="背景" />
    <img :src="imgTwo" alt="人物" />
    <div class="search_content">
      <img :src="imgThree" alt="搜索" />
      <input
        v-model.trim="keyWords"
        type="text"
        placeholder="输入热门关键词：高新企业、 工业设计"
        @keydown.enter="afterSearchList()"/>
      <span @click="afterSearchList()">搜 索</span>
      <img @click="afterSearchList()" :src="imgFour" alt="按钮" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyWords: "",
      imgOne: require("@/assets/images/notice/bg.png"),
      imgTwo: require("@/assets/images/notice/renwu.png"),
      imgThree: require("@/assets/images/notice/icon_search.png"),
      imgFour: require("@/assets/images/notice/anniu_yellow.png"),
    };
  },
  methods: {
    afterSearchList() {
      this.$emit("afterSearch", this.keyWords);
    },
  },
};
</script>

<style scoped>
.notice_search {
  margin-top: 48px;
  width: 100%;
  height: 90px;
  position: relative;
}
.notice_search > img:nth-of-type(1) {
  width: 100%;
  height: 100%;
}
.notice_search > img:nth-of-type(2) {
  width: 182.5px;
  height: 113.29px;
  position: absolute;
  bottom: 0;
  left: 42px;
}
.search_content {
  position: absolute;
  right: 99px;
  top: 22px;
  width: 792px;
  height: 50px;
  background: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  opacity: 1;
  border-radius: 60px;
  margin-left: 309px;
}
.search_content input {
  width: 570px;
  height: 45px;
  border: none;
  margin-left: 10px;
  color: #8e8c8c;
  font-size: 14px;
}
.search_content input :focus {
  border: none;
}
.search_content span {
  position: absolute;
  color: #ffffff;
  font-size: 22px;
  top: 10px;
  right: 58px;
  cursor: pointer;
}
.search_content > img:nth-of-type(1) {
  width: 26px;
  height: 26px;
  margin-left: 16px;
}
.search_content > img:nth-of-type(2) {
  width: 180px;
  height: 50px;
  margin-left: 16px;
  cursor: pointer;
}
</style>