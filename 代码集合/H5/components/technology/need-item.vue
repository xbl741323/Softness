<template>
  <div class="nutice_item" @click="toDetail">
    <div class="nutice_item_right">
      <div class="nutice_right_top">{{ nuticeInfo.requirementName }}</div>
      <div class="nutice_right_bottom">
        <span>类型：{{ nuticeInfo.requirementTypeTxt }}</span>
        <span>行业：{{ nuticeInfo.industryTxt }}</span>
      </div>
      <div class="need_img_content">
        <span>预算：</span>
        <span v-if="nuticeInfo.priceType == 1">{{ nuticeInfo.priceType|judge }}</span>
        <span v-else>
          <span v-if="nuticeInfo.tradePriceMin">{{ nuticeInfo.tradePriceMin|receivePrice }}</span><span v-if="nuticeInfo.tradePriceMax&&nuticeInfo.tradePriceMin">-</span><span v-if="nuticeInfo.tradePriceMax">{{ nuticeInfo.tradePriceMax|receivePrice }}</span>万</span>
      </div>
    </div>
  </div>
</template>

<script>
import { receivePrice } from "@/utils/price"
export default {
  props: ["nuticeInfo", "sort",'showStatus',"keyWords"],
  data() {
    return {
      page:1,
    };
  },
  filters: {
    judge(value) {
      return value == 1 ? "面议" : "";
    },
    filtermature(value){    
        if(value==0){
          return '正在研发'
        }else if(value ==1){
          return '已有样品'
        }else if(value==2){
          return '通过小试'
        }else if(value ==3){
          return '通过中试'
        }else if(value){
          return '可以量产'
        }
    },
    receivePrice(price){
      return receivePrice(price,2)
    },
  },
  methods: {
    showMeiqia() {
      var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
      _53.push("cmd", "mtalk");
      /*开发者文档1.7 主动发起(手机端)*/ _53.query();
    },
    toDetail() {
      if(sessionStorage.getItem("projectPage")){
      this.page = sessionStorage.getItem("projectPage")
      }
      const newPath = this.$router.resolve({
        path: "/need/detail",
        query: {
          id: this.nuticeInfo.id
          }
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
  border-bottom: 1px solid #E7E6EB;
  overflow: hidden;
}
.nutice_item_right {
  width: 100%;
  height: 2.10666666667rem;
  margin-top: 0.45333333333rem;
  margin-left: 0.32rem;
}
.nutice_item_right .nutice_right_top {
  width: 100%;
  min-height: 0.45333333333rem;
  color: #333333;
  font-size: 0.37333333333rem;
  overflow: hidden;
  font-weight: bold;
  /* text-overflow: ellipsis;
  white-space: nowrap; */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.nutice_item_right .nutice_right_bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  width: 100%;
  color: #8D8D8D;
  font-size: 0.32rem;
}
.nutice_right_bottom>span:nth-of-type(2){
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 0.4rem;
}
.need_img_content{
  width: 100%;
  height: 0.5866666666666667rem;
  margin-top: 2px;
}
.need_img_content >span:nth-of-type(1){
  height: 0.5866666666666667rem;
  display: inline-block;
  color: #8D8D8D;
  line-height: 0.5866666666666667rem;
  font-size: 12px;
}
.need_img_content >span:nth-of-type(2){
  color: #FD651C;
  margin-top: 10px;
  font-weight: bold;
  font-size: 14px;
}
</style>