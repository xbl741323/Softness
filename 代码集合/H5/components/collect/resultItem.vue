<template>
  <div class="nutice_item">
    <div class="item_checkbox" v-if="showStatus == 1">
      <el-checkbox v-model="checkValue" @change="showValue"></el-checkbox>
    </div>
    <div :class="['nutice_item_left', showStatus == 1 ? 'show_copy' : '']" @click="toDetail">
      <img
        :src="cdnUrl+collectInfo.coverUrls[0].picture"
        v-if="collectInfo.coverUrls &&collectInfo.coverUrls.length>0"
        alt
      />
      <span class="fail_sty" v-if="collectInfo.status == 2||collectInfo.status == 5">已失效</span>
    </div>
    <div class="nutice_item_right" @click="toDetail">
      <div class="nutice_right_top">
        {{ collectInfo.achievementName }}
      </div>
      <div class="nutice_right_bottom">
        {{ collectInfo.technologyTypeTxt }}
          <span style="font-size:12px">
            {{ collectInfo.priceType|judge }}
             <template v-if="collectInfo.priceType ==0">{{ collectInfo.tradePrice |receivePrice }}万</template> 
          </span>
      </div>
    </div>
  </div>
</template>

<script>
import { receivePrice } from "@/utils/price";
export default {
  props: ["showStatus","collectInfo"],
  data() {
    return {
      checkValue: false,
      cdnUrl: process.env.CDN_BASE_URL,
    };
  },
   filters:{
     judge(value) {
      return value == 1 ? "面议" : "";
    },
    receivePrice(price) {
      return receivePrice(price, 2);
    },
   },
  methods: {
    showValue(val) {
      this.$emit("project-change", val);
    },
    toDetail() {
        const newPath = this.$router.resolve({
        path: "/result/detail?id=" + this.collectInfo.id,
      });
      window.open(newPath.href, "_self");
    },
  },
};
</script>
<style scoped>
.nutice_item {
  width: 100%;
  height: 2.986666666667rem;
  display: flex;
  border-bottom: 0.05333333333rem solid #e7e6eb;
  overflow: hidden;
  justify-content: flex-start;
  align-items: center;
}
.nutice_item_left {
  position: relative;
  width: 2.93333333333rem;
  height: 2.10666666667rem;
  margin-left: 0.42666666667rem;
}
.show_copy {
  margin-left: 0;
}
.nutice_item_left img {
  width: 100%;
  height: 100%;
}
.nutice_item_right {
  width: 5.89333333333rem;
  height: 2.10666666667rem;
  margin-left: 0.32rem;
}
.nutice_item_right .nutice_right_top {
  width: 100%;
  min-height: 0.45333333333rem;
  color: #333333;
  font-size: 0.37333333333rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.nutice_item_right .nutice_right_bottom {
  margin-top: 0.21333333333rem;
  width: 100%;
  height: 0.85333333333rem;
  color: #999999;
  font-size: 0.32rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.item_checkbox {
  width: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fail_sty{
  display: inline-block;
  width: 100%;
  height: 0.5333333333rem;
  font-size: 0.32rem;
  line-height: 0.5333333333rem;
  position: absolute;
  right: 0px;
  bottom: 0;
  text-align: center;
  background: #ccc;
  opacity: 0.8;
}
</style>