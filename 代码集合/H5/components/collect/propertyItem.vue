<template>
  <div class="property_item_com">
    <div class="property_checkbox" v-if="showStatus == 1">
      <el-checkbox v-model="checkValue" @change="showValue"></el-checkbox>
    </div>
    <div class="property_img">
    <span v-if="collectInfo.status == 2" @click="goDetail">已失效</span>
    <img v-if="collectInfo.type==3" @click="goDetail" :src="require('@/assets/images/zscq/zc_bq.png')" alt="" />
    <img v-if="collectInfo.type==1" @click="goDetail" :src="require('@/assets/images/zscq/zc_zl.png')" alt="" />
    <img v-if="collectInfo.type==2" @click="goDetail" :src="require('@/assets/images/zscq/zc_sb.png')" alt="" />
    <img v-if="collectInfo.type==4" @click="goDetail" :src="require('@/assets/images/zscq/zc_zwxpz.png')" alt="" />
    </div>
    <div class="property_item_content" @click="goDetail">
      <span :class="[collectInfo.status == 2?'fail_sty':'','propername']">{{ collectInfo.name }}</span>
      <span :class="[collectInfo.status == 2?'fail_sty':'','propermeta']" v-if="collectInfo.metaDesc">{{ collectInfo.slogan }}</span>
       <div class="price_content">
            <span v-if="collectInfo.nowFee">
                <span class="priceIcon">￥</span><span class="price">{{collectInfo.nowFee | filterPrice}}</span>
            </span> 
            <span v-else class="nowchat">面议</span>
       </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["collectInfo","showStatus"],
  data() {
    return {
      checkValue: false,
    };
  },
  filters:{
      filterPrice(val){
         return Number(val)/100
      }
  },
  methods:{
    showValue(val) {
      this.$emit("project-change", val);
    },
    goDetail(item) {
        window.open("/zhichan/" + this.collectInfo.id, "_self");
    },
  }
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
}
.nowchat{
    color:#FF6D27;
    font-size: 14px;
}
.huaxian{
    font-size: 10px;
    color: #c5c5c5;
    text-decoration:  line-through;
    margin-left: 4.5px;
}
.propername{
    font-size: 0.3733333333rem;
    color: #333;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 14px;
}
.propermeta{
    font-size: 0.3733333333rem;
    color: #999999;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 12px;
}
.property_item_com {
  width: 100%;
  padding: 18px 15px;
  opacity: 1;
  border-bottom: 1px solid #f4f6f8;
  overflow: hidden;
  display: flex;
  cursor: pointer;
}
.property_img{
  width: 100px;
  height: 71px;
  position: relative;
}
.property_img span{
  position: absolute;
  background: #9ca1a5;
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.property_item_com img {
  width: 100px;
  height: 71px;
}
.property_item_content {
  flex: 1;
  margin-left: 10px;
  position: relative;
}
.property_item_content p {
  width: 224px;
  height: 34px;
  font-size: 12px;
  color: #8d8d8d;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.property_checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
.fail_sty{
  color: #8D8D8D !important;
}
</style>