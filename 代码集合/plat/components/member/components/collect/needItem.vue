<template>
  <div class="project_item">
      <div class="list-item-cont">
        <div class="item-img" @click="toDetail">
          {{collectInfo.requirementName}}
        </div> 
      <div style="margin: 8px">
        <div style="height:100px">
            <div class="desc-main" @click="toDetail">
             <span v-html="delHtmlTag(collectInfo.requirementDesc)"></span>
            </div>
        </div>
        <div class="fail_zhe" v-if="collectInfo.status == 2||collectInfo.status == 5">已失效</div>
        <div class="product_desc" @click="toDetail">
           <span style="color: #999999;font-size:12px;white-space: nowrap;">
              {{collectInfo.areaTxt}}
            </span>
          <span style="font-size:12px;white-space: nowrap;">
            <span class="left" v-if="collectInfo.priceType == 1"> 预算: 面议 </span>
            <span
              class="left"
              v-if="collectInfo.tradePriceMax&&collectInfo.tradePriceMin"
            >预算: {{ collectInfo.tradePriceMin |receivePrice}}-{{ collectInfo.tradePriceMax |receivePrice }}万 </span>
            <span
              class="left"
              v-if="(collectInfo.tradePriceMin==''||collectInfo.tradePriceMin==null||collectInfo.tradePriceMin=='undefined')&&(collectInfo.tradePriceMax!=null)"
            > 预算: {{ collectInfo.tradePriceMax |receivePrice }}万 </span>
            <span
              class="left"
              v-if="(collectInfo.tradePriceMax==''||collectInfo.tradePriceMax==null||collectInfo.tradePriceMax=='undefined')&&(collectInfo.tradePriceMin!=null)"
            > 预算: {{ collectInfo.tradePriceMin |receivePrice }}万</span>
          </span>
        </div>
         <div style="width: 110%;height: 0px;border: 1px solid #E2E2E2;opacity: 0.3;position: relative;left: -10px;margin-top: 10px;"></div>
        <div class="pro_statu" @click="toDetail">
            <span style="font-size:12px">
              <span>类型: {{ collectInfo.requirementTypeTxt }}</span>
            </span>
          <!-- <span style="font-size:12px;color: #999999;">
            {{ collectInfo.industryTxt }}
          </span> -->
        </div>
      </div>
    </div>
    <div class="check_btn" v-if="showStatus == 1">
      <el-checkbox v-model="checkValue" @change="checkChange"></el-checkbox>
    </div> 
  </div>
</template>

<script>
import { receivePrice } from "@/utils/price";
export default {
  props: ["showStatus", "collectInfo"],
  data() {
    return {
      checkValue: false,
       isShop: process.env.SHOP_URL
    };
  },
  filters:{
    receivePrice(price) {
      return receivePrice(price, 2);
    },
  },
  methods: {
     delHtmlTag(str) {
      if(str){
         return str.replace(/<[^>]+>/g, "");
      }
    },
    toDetail() {
          const { href } = this.$router.resolve({
             path: this.isShop+"/need/detail?id=" + this.collectInfo.id ,
          });
          window.open(href, "_blank");
    },
    checkChange(val) {
      this.$emit("project-change");
    },
    showQia() {
      window.open(
        "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
        "",
        "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
      );
    },
    delHtmlTag(str) {
      if(str){
         return str.replace(/<[^>]+>/g, "");
      }
     
    }
  },
};
</script>

<style scoped>
.project_item {
  cursor: pointer;
  width: 218px;
  height: 210px;
  background: #ffffff;
  border: 1px solid #cecece;
  opacity: 1;
  margin-bottom: 13px;
  margin-right: 13px;
  position: relative;
  border-radius: 5px;
}
.project_img {
  width: 194px;
  height: 110px;
  margin: 12px;
  position: relative;
}
.project_img img {
  width: 100%;
  height: 100%;
}
.fail_zhe{
 position: absolute;
  width: 30%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  background: #ccc;
  top: 0;
  right: 0px;
  opacity: 0.9;
}
.project_btn {
  width: 194px;
  height: 24px;
  margin: 10px 12px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}
.project_btn > span:nth-of-type(1) {
  width: 70px;
  height: 24px;
  background: #eff8ff;
  line-height: 24px;
  border-radius: 2px;
  color: #36a6fe;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 5px;
}
.project_btn > span:nth-of-type(2) {
  width: 76px;
  height: 24px;
  border: 1px solid #fd651c;
  opacity: 1;
  border-radius: 2px;
  color: #fd651c;
  line-height: 22px;
  text-align: center;
  cursor: pointer;
}
.project_title {
  width: 194px;
  height: 39px;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: #474747;
  opacity: 1;
  margin: 0px 12px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.project_desc {
  width: 194px;
  height: 31px;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  color: #a8a8a8;
  opacity: 1;
  margin: 0px 12px;
  margin-top: 4px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.check_btn {
  position: absolute;
  top: -3px;
  right: 3px;
}
/* 需求 */
.desc-main {
  line-height: 20px;
  color: #666666;
  font-size: 14px;
  overflow: hidden;
  text-align: left;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  padding-top: 5px;
}
.item-img {
  margin-top: 13px;
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 600;
}
.item-img img {
  width: 100%;
  transition: all 1s;
  height: 160px;
}
.product_name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 12px 0px 8px 5px;
  margin-left: 5px;
  color: #333333;
  font-size: 14px;
  line-height: 16px;
  height: 16px;
  font-weight: bold;
}
.product_desc {
  display: flex;
  justify-content: space-between;
  margin-top: 0px;
}
.product_desc > span:nth-of-type(1) {
  color: #3d85dc;
  font-size: 14px;
}
.product_desc > span:nth-of-type(2) {
  color: #f96600;
  font-size: 14px;
  font-weight: bold;
}
.pro_statu {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}
.pro_statu > span:nth-of-type(1) {
  color: #aaaaaa;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pro_statu > span:nth-of-type(2) {
  color: #666666;
  font-size: 14px;
  margin-right: 5px;
  cursor: pointer;
  font-weight: 400;
  line-height: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.flower_img {
  margin-top: 7px;
  margin-left: 4px;
  position: absolute;
  bottom: 5px;
}
.flower_img img {
  width: 12px;
  height: 12px;
}
.flower_img span {
  font-size: 12px;
  color: #3d85dc;
  font-weight: bold;
}
</style>