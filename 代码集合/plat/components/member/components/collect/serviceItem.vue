<template>
  <div class="project_item" @click="toDetail(collectInfo)">
    <div class="project_img">
      <img v-if="filterType(collectInfo)"  :src='cdnPath+collectInfo.imageUrl' />
      <video v-if="!filterType(collectInfo)" :src='cdnPath+collectInfo.imageUrl'/>
      <!-- <div class="fail_zhe" v-if="collectInfo.deleted == 1||collectInfo.showStatus == 2">已失效</div> -->
    </div>
    <div class="project_title">
      {{ collectInfo.spuTitle }}
    </div>
    <div class="project_desc">
      {{ collectInfo.spuSlogan }}
    </div>
     <div class="project_btn">
        <template v-if="collectInfo.isOnline==true">
            <span v-if="collectInfo.spuMaxAmount==collectInfo.spuMinAmount" class="pricesize"><span class="pricemark">¥</span>{{collectInfo.spuMinAmount | filterViewprice}}</span>
            <span v-else class="pricesize"><span class="pricemark">¥</span>{{collectInfo.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
        </template>
        <template v-if="collectInfo.isOnline==false">
                <span>面议</span>
        </template>
    </div>
    <div class="check_btn" v-if="showStatus == 1">
      <el-checkbox v-model="checkValue" @click.stop.native="()=>{}" @change="checkChange"></el-checkbox>
    </div>
  </div>
</template>

<script>
import tools from '@/utils/priceDeal' 
export default {
  props: ["showStatus", "collectInfo"],
  data() {
    return {
      cdnPath:process.env.CDN_BASE_URL,
      checkValue: false,
      isShop: process.env.PROPERTY_URL,  //知识产权
      isShop_result: process.env.SHOP_URL,  //技术转移
      isShop_need: process.env.SHOP_URL,  //技术需求
      xunlu:process.env.SOFTWARE_URL //寻鹿
    };
  },
  filters:{
      filterViewprice(val){
          return tools.filterViewprice(val)
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
    toDetail(item) {
        const path = this.$router.resolve({
           path:'/productdetails/details',
           query:{
             spuId:item.spuId
           }
         })
         window.open(path.href)
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
  },
};
</script>

<style scoped>
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
.project_item {
  cursor: pointer;
  width: 233px;
  height: 270px;
  background: #ffffff;
  /* border: 1px solid #cecece; */
  opacity: 1;
  margin-bottom: 13px;
  position: relative;
  border-radius: 6px;
}
.project_img {
  width: 233px;
  height: 167px;
  position: relative;
}
.project_img img {
  width: 100%;
  height: 100%;
}
.project_img video {
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
  top: 0px;
  right: 0px;
  opacity: 0.9;
}
.project_btn {
  width: 194px;
  height: 24px;
  margin: 14px 12px 0 12px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  color: #fd651c;
}
.project_btn > span:nth-of-type(2) {
  width: 76px;
  height: 24px;
  border: 1px solid #36a6fe;
  border-radius: 5px;
  opacity: 1;
  color: #36a6fe;
  line-height: 22px;
  text-align: center;
  cursor: pointer;
}
.project_title {
  width: 194px;
  font-size: 14px;
  font-weight: 400;
  color: #474747;
  opacity: 1;
  margin:12px 12px 6px 12px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.project_desc {
  width: 194px;
  font-size: 12px;
  font-weight: 400;
  color: #a8a8a8;
  opacity: 1;
  margin: 4px 12px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  margin-top: 6px;
}
.check_btn {
  position: absolute;
  top: -3px;
  right: 3px;
}
.pricesize{
    font-size :18px;
}
.pricemark{
    font-size :12px;
}
   
</style>