<template>
  <div class="nutice_item">
    <div class="item_checkbox" v-if="showStatus == 1">
      <el-checkbox v-model="checkValue" @change="showValue"></el-checkbox>
    </div>
    <div :class="['nutice_main', showStatus == 1 ? 'nutice_change' : '']" @click="toDetail">
      <div class="item_title">
        <span>{{ collectInfo.requirementName }}</span>
      </div>
      <div class="item_desc">
        <div :class="['desc_time', showStatus == 0 ? 'desc_change' : '']">
            <span style="font-size:12px">
            <span class="left" v-if="collectInfo.priceType == 1"> 预算: 面议 </span>
            <span
              class="left"
              v-if="collectInfo.tradePriceMax&&collectInfo.tradePriceMin"
            >预算: {{ collectInfo.tradePriceMin|receivePrice }}-{{ collectInfo.tradePriceMax|receivePrice }}万 </span>
            <span
              class="left"
              v-if="(collectInfo.tradePriceMin==''||collectInfo.tradePriceMin==null||collectInfo.tradePriceMin=='undefined')&&(collectInfo.tradePriceMax!=null)"
            > 预算: {{ collectInfo.tradePriceMax|receivePrice }}万 </span>
            <span
              class="left"
              v-if="(collectInfo.tradePriceMax==''||collectInfo.tradePriceMax==null||collectInfo.tradePriceMax=='undefined')&&(collectInfo.tradePriceMin!=null)"
            > 预算: {{ collectInfo.tradePriceMin|receivePrice }}万 </span>
          </span>
        </div>
        <div style="position: relative;top: 6px;right:20px">
          <span class="fail_sty" v-if="collectInfo.status == 2||collectInfo.status == 5">已失效</span>
        </div>
         
      </div>
    </div>
  </div>
</template>

<script>
import { receivePrice } from "@/utils/price";
export default {
  props: ["showStatus", "collectInfo"],
  data() {
    return {
      sort: 1,
      checkValue: false,
    };
  },
  filters: {
     receivePrice(price) {
      return receivePrice(price, 2);
    },
    typeFilter(val) {
      switch (val) {
        case 0:
          return "[公告]";
        case 1:
          return "[汇编]";
        case 2:
          return "[疑难]";
        case 10:
          return "[资讯]";
      }
    },
     check(value) {
      if (value == "" || value == null) {
        return "未知";
      } else {
        return value;
      }
    },
  },
  methods: {
    showValue(val) {
      this.$emit("policy-change", val);
    },
    toDetail() {
         const newPath = this.$router.resolve({
          path:"/need/detail?id=" + this.collectInfo.id
        });
        window.open(newPath.href, "_self");
    },
  },
};
</script>

<style scoped>
.nutice_item {
  width: 100%;
  height: 2.42666666667rem;
  overflow: hidden;
  border-bottom: 1px solid #e7e6eb;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/**/
.nutice_main {
  width: 10rem;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}
.nutice_change {
  align-items: flex-start;
}
.item_title {
  width: 90.042666667%;
  height: 1.05rem;
  font-size: 0.37333333333rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.item_title > span:nth-of-type(1) {
  color: #333;
}
.item_title > span:nth-of-type(2) {
  color: #333;
}
/**/
.item_desc {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: #999999;
  font-size: 0.29333333333rem;
}
.desc_time {
  margin-top: 0.2rem;
}
.desc_change {
  margin-left: 0.5rem !important;
}
.desc_view {
  margin-top: 0.2rem;
  margin-right: 0.42666666667rem;
  display: flex;
  justify-content: space-between;
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
.item_checkbox {
  width: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fail_sty {
  width: 1.28rem;
  height: 0.48rem;
  background: #999999;
  opacity: 1;
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;
  padding: 1px 7px;
}
</style>