<template>
  <div class="nutice_item">
    <div class="item_checkbox" v-if="showStatus == 1">
      <el-checkbox v-model="checkValue" @change="showValue"></el-checkbox>
    </div>
    <div :class="['nutice_item_left', showStatus == 1 ? 'show_copy' : '']" @click="toDetail">
    <span class="fail_sty" v-if="collectInfo.deleted == 1 || collectInfo.showStatus == 2">已失效</span>
       <template  v-if="collectInfo.coverUrls && collectInfo.coverUrls.length>0">
          <div v-for="(test,index) in collectInfo.coverUrls" :key="index" style="width: 100%; height: 79px;" v-show="test.url && test.isCover ==1">
              <img  :src='cdnUrl+test.url' v-if="test.url && test.isCover ==1 && (test.url.split('.')[1]=='jpeg' || test.url.split('.')[1]=='png' ||test.url.split('.')[1]=='jpg' ||test.url.split('.')[1]=='gif')" />
              <video  :poster="cdnUrl+test.spUrl" :src='cdnUrl+test.url' v-else-if="test.isCover ==1 && test.spUrl&&(test.spUrl!==''&&test.spUrl!==null) "/>
              <video v-else :src='cdnUrl+test.url'></video>
          </div>
      </template>
      <template v-else>
              <img  :src='cdnUrl+collectInfo.coverUrl' v-if="collectInfo.coverUrl&&(collectInfo.coverUrl.split('.')[1]=='jpeg' || collectInfo.coverUrl.split('.')[1]=='png' ||collectInfo.coverUrl.split('.')[1]=='jpg' ||collectInfo.coverUrl.split('.')[1]=='gif')" />
              <video  :src='cdnUrl+collectInfo.coverUrl' v-if="collectInfo.coverUrl &&(collectInfo.coverUrl.split('.')[1]=='mp4' || collectInfo.coverUrl.split('.')[1]=='avi' ||collectInfo.coverUrl.split('.')[1]=='mov')" />
      </template>
    </div>
    <div class="nutice_item_right" @click="toDetail">
      <div class="nutice_right_top">{{ collectInfo.title }}</div>
      <div class="propermeta">{{ collectInfo.slogan }}</div>
      <div class="price_content">
            <span v-if="collectInfo.earnestMoney">
                <span class="priceIcon">￥</span><span class="price">{{collectInfo.earnestMoney | filterPrice}}</span><span class="priceIcon">/定金</span>
            </span> 
            <span v-else-if="collectInfo.nowFee && collectInfo.previousFee">
                <span class="priceIcon">￥</span><span class="price">{{collectInfo.nowFee | filterPrice}}</span><span class="huaxian">{{collectInfo.previousFee | filterPrice}}</span>
            </span> 
            <span v-else-if="collectInfo.nowFee || collectInfo.previousFee">
                    <span class="priceIcon">￥</span><span class="price">{{ (collectInfo.nowFee || collectInfo.previousFee) | filterPrice}}</span>
            </span>
            <span v-else class="nowchat">面议</span>
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
      filterPrice(val){
         return Number(val)/100
      }
  },
  methods: {
    showValue(val) {
      this.$emit("project-change", val);
    },
    toDetail() {
        const newPath = this.$router.resolve({
        path: "/project/" + this.collectInfo.number+3,
        query: {
          sort: 3,
          }
      });
      window.open(newPath.href, "_self");
    },
  },
  mounted() {},
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