<template>
  <div class="notice_nav">
    <div class="notice_nav_item" v-for="(item, index) in navList" :key="index">
      <span
        @click="toHome(index)"
        :class="[index == navList.length - 1 ? 'nav_current' : '']">{{ item }}</span>
      <span v-if="index !== navList.length - 1"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["navList"],
  data() {
    return {};
  },
  methods: {
    toHome(index) {
      if (index == 0) {
        window.open('/','_self');
      }
    },
  },
};
</script>

<style scoped>
.notice_nav {
  display: flex;
  height: 20px;
  line-height: 20px;
  justify-content: flex-start;
  align-items: center;
}
.notice_nav_item {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333333;
  font-size: 16px;
  margin-right: 5px;
  font-weight: normal;
}
.notice_nav_item > span:nth-of-type(1) {
  cursor: pointer;
}
.notice_nav_item > span:nth-of-type(2) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8px;
  height: 8px;
  border-top: 1px solid #333333;
  border-right: 1px solid #333333;
  transform: rotate(45deg);
  margin: 0 5px;
}
.nav_current {
  font-weight: bold !important;
}
</style>