<template>
  <div class="property_item" @click="toDetail">
        <div class="property_img">
            <img v-if="collectInfo.type==3" :src="require('@/assets/images/member/zc_bq.png')" alt="" />
            <img v-if="collectInfo.type==1" :src="require('@/assets/images/member/zc_zl.png')" alt="" />
            <img v-if="collectInfo.type==2" :src="require('@/assets/images/member/zc_sb.png')" alt="" />
            <img v-if="collectInfo.type==4" :src="require('@/assets/images/member/zc_zwxpz.png')" alt="" />
        </div> 
        <div class="property_fail_zhe" v-if="collectInfo.status == 2">已失效</div>
        <div class="property_desc">
          <span>{{ collectInfo.name }}</span>
          <span>{{ collectInfo.metaDesc }}</span>
        <span v-if="collectInfo.nowFee">
            <span class="priceIcon">￥</span><span class="price">{{collectInfo.nowFee | filterPrice}}</span>
        </span> 
        <span v-else class="nowchat">面议</span>
          
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
      checkValue:false,
      isShop: process.env.PROPERTY_URL
    };
  },
  filters:{
      filterPrice(val){
         return Number(val)/100
      }
  },
  methods: {
    checkChange(val) {
      this.$emit("project-change");
    },
    toDetail() {
      //  if(this.collectInfo.status!==2){
         const { href } = this.$router.resolve({
             path: this.isShop+"/" + this.collectInfo.id + this.collectInfo.type ,
          });
          window.open(href, "_blank");
      //  }
    }
  },
};
</script>

<style scoped>
.price_content {
    position: absolute;
    bottom: -0.05333333333333334rem;
}
.priceIcon{
    color:#FF6D27;
    font-size: 12px;
}
.price{
    color:#FF6D27;
    font-size: 16px;
    display: inline-block;
    margin-top: 10px;
}
.nowchat{
    color:#FF6D27;
    font-size: 14px;
    display: inline-block;
    margin-top: 10px;
}
.huaxian{
    font-size: 10px;
    color: #c5c5c5;
    text-decoration:  line-through;
    margin-left: 4.5px;
}
.property_item {
  cursor: pointer;
  width: 218px;
  background: #ffffff;
  opacity: 1;
  border-radius: 6px;
  margin-bottom: 28px;
  margin-right: 13px;
  position: relative;
}
.property_img {
  width: 100%;
  height: 147px;
  position: relative;
}
.property_img img {
  width: 100%;
  height: 100%;
}
.property_fail_zhe{
  position: absolute;
  width: 30%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  background: #ccc;
  color: #ffffff;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.8;
}
.check_btn {
  position: absolute;
  top: -3px;
  right: 3px;
}
.property_desc{
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  padding: 11px 15px;
  border: 1px solid #cecece;
  border-top: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  position: relative;
}
.property_desc>span:nth-of-type(1){
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.property_desc>span:nth-of-type(2){
  width: 100%;
  margin-top: 8px;
  color: #999999;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
