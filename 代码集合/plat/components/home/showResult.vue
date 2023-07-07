<template>
  <div class="contain" @click="goDetail($event)">
    <vue-seamless-scroll
      :data="listData"
      :class-option="classOption"
      class="warp"
    >
      <div class="ul-item">
        <div
          :data-id="item.id"
          :class="['li-item']"
          v-for="(item, index) in listData"
          :key="index"
        >
          {{ item.title }}
        </div>
      </div>
    </vue-seamless-scroll>
  </div>
</template>

<script>
import { getRight } from "@/api/home";
export default {
  data() {
    return {
      listData: [],
      classOption: {
        step: 1,
        singleHeight: 45,
        waitTime: 1500,
        limitMoveNum: 1,
        direction: 1,
      },
    };
  },
  methods: {
    goDetail(e) {
      let id = Number(e.target.dataset.id)
      window.open("/aboutWt/" + 8 + "?id=" + id);
    },
    getAllResult() {
      this.loading = true;
      let params = {
        programId: 8,
        current: 1,
        size: 10,
      };
      getRight(params).then((res) => {
        if (res.data.code == 1000) {
          this.listData = res.data.data.records;
        }
      });
    },
  },
  mounted() {
    this.getAllResult();
  },
};
</script>

<style scoped>
.contain {
  width: 1200px;
  height: 70px;
  margin: 0 auto;
  margin-bottom: 30px;
  background-image: url("~@/assets/images/last/pic-qinghe@2x.png");
  background-size: 100% 100%;
}
.warp {
  width: 1000px;
  height: 70px;
  margin: 0 auto;
  overflow: hidden;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0 auto;
}
.ul-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.li-item {
  width: 900px;
  height: 45px;
  line-height: 75px;
  margin-right: 10px;
  color: #ffffff;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  z-index: 999 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* background: pink;
  opacity: 0.8; */
}
</style>