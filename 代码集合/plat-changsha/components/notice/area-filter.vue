<template>
  <div class="area_filter">
    <div class="area_item">
      <span>{{ title }}</span>
    </div>
    <div
      class="area_item"
      v-for="(item, index) in areaList"
      :key="index"
      @click="changeArea(item, index)">
      <span :class="[chooseIndex == index ? 'choose_color' : '']">{{ item.label }}</span>
      <span :class="[chooseIndex == index ? 'choose_bg_color' : '']"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["areaList","title"],
  data() {
    return {
      chooseIndex: 0,
    };
  },
  methods: {
    changeArea(val, index) {
      this.chooseIndex = index;
      this.$emit("changeArea", val);
    },
  },
};
</script>

<style scoped>
.area_filter {
  width: 220px;
  height: 100%;
  background: #ececec;
  border-radius: 5px;
  margin-right: 10px;
}
.area_item {
  width: 100%;
  height: 50px;
  border-top: 1px solid #e0dede;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666666;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
}
.area_item:nth-of-type(1) {
  border-top: none;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff !important;
  background: #36a6fe !important;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: auto !important;
}
.area_item > span:nth-of-type(2) {
  position: absolute;
  bottom: 0;
  width: 20px;
  height: 4px;
  background: #ececec;
  opacity: 1;
  border-radius: 4px;
}
.choose_color {
  color: #36a6fe !important;
}
.choose_bg_color {
  background: #36a6fe !important;
}
</style>