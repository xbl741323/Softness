<template>
  <div class="nutice_item">
    <div class="item_checkbox" v-if="showStatus == 1">
      <el-checkbox v-model="checkValue" @change="showValue"></el-checkbox>
    </div>
    <div :class="['nutice_item_left', showStatus == 1 ? 'show_copy' : '']" @click="toDetail">
    <!-- <span class="fail_sty" v-if="collectInfo.deleted == 1 || collectInfo.showStatus == 2">已失效</span> -->
      <img  v-if="filterType(collectInfo)" :src="cdnUrl+collectInfo.imageUrl" />
      <video v-if="!filterType(collectInfo)" :src="cdnUrl+collectInfo.imageUrl" />
    </div>
    <div class="nutice_item_right" @click="toDetail(collectInfo)">
      <div class="nutice_right_top">{{ collectInfo.spuTitle }}</div>
      <div class="propermeta">{{ collectInfo.spuSlogan }}</div>
      <div class="price_content">
         <template v-if="collectInfo.isOnline==true">
            <span v-if="collectInfo.spuMaxAmount==collectInfo.spuMinAmount" class="pricesize"><span class="pricemark">¥</span>{{collectInfo.spuMinAmount | filterViewprice}}</span>
            <span v-else class="pricesize"><span class="pricemark">¥</span>{{collectInfo.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
        </template>
        <template v-if="collectInfo.isOnline==false">
                <span>面议</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["showStatus","collectInfo"],
  data() {
    return {
      checkValue: false,
      cdnUrl: process.env.CDN_BASE_URL,
    };
  },
  filters:{
       filterViewprice(val){
            if(String(Number(val)).length<=5){
                return Number(val)
            }else{
                return ((Number(val)/10000)+'万')
            }
        }
  },
  methods: {
      // 判断是图片还是视频
    filterType(item){
      if(item.imageUrl.match(/(jpeg|png|jpg|gif)/)){
          return true
      }else{
          return false
      }
    },    
    showValue(val) {
      this.$emit("project-change", val);
    },
    toDetail(item) {
      this.$router.push({
          path: "/productdetails/details",
          query: {spuId:item.id}
      })
    },
  },
  mounted() {},
};
</script>
<style  scoped>
.nutice_item >>> .el-checkbox__inner{
    border-radius: 50%;
}
.price_content {
    position: absolute;
    bottom: -0.05333333333333334rem;
    color: #FF6D27;
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
.nutice_item {
  width: 100%;
  height: 2.986666666667rem;
  display: flex;
  border-bottom: 1px solid #e7e6eb;
  overflow: hidden;
  justify-content: flex-start;
  align-items: center;
}
.nutice_item_left {
  position: relative;
  width: 2.93333333333rem;
  height: 2.10666666667rem;
  border-radius: 5px;
  /* margin-left: 0.42666666667rem; */
}
img{
  border-radius: 4px;
}
.show_copy {
  margin-left: 0;
}
.nutice_item_left img {
  width: 100%;
  height: 100%;
}
.nutice_item_left video {
  width: 100%;
  height: 100%;
}
.nutice_item_right {
  width: 5.89333333333rem;
  height: 2.10666666667rem;
  margin-left: 0.32rem;
  position: relative;
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
  -webkit-line-clamp: 1;
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
  bottom: 0;
  text-align: center;
  background: #ccc;
  opacity: 0.8;
}
</style>