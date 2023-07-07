<template>
  <div class="project_item">
    <div class="project_img" @click="toDetail">
      <template  v-if="collectInfo.coverUrls && collectInfo.coverUrls.length>0">
          <div v-for="(test,index) in collectInfo.coverUrls" :key="index" style="width: 194px;height: 135px;" v-show="test.url && test.isCover ==1">
              <img  :src='cdnPath+test.url' v-if="test.url && test.isCover ==1 && (test.url.split('.')[1]=='jpeg' || test.url.split('.')[1]=='png' ||test.url.split('.')[1]=='jpg' ||test.url.split('.')[1]=='gif')" />
              <video  :poster="cdnPath+test.spUrl" :src='cdnPath+test.url' v-else-if="test.isCover ==1 && test.spUrl&&(test.spUrl!==''&&test.spUrl!==null) "/>
              <video v-else :src='cdnPath+test.url'></video>
          </div>
      </template>
      <template v-else>
              <img  :src='cdnPath+collectInfo.coverUrl' v-if="collectInfo.coverUrl&&(collectInfo.coverUrl.split('.')[1]=='jpeg' || collectInfo.coverUrl.split('.')[1]=='png' ||collectInfo.coverUrl.split('.')[1]=='jpg' ||collectInfo.coverUrl.split('.')[1]=='gif')" />
              <video  :src='cdnPath+collectInfo.coverUrl' v-if="collectInfo.coverUrl &&(collectInfo.coverUrl.split('.')[1]=='mp4' || collectInfo.coverUrl.split('.')[1]=='avi' ||collectInfo.coverUrl.split('.')[1]=='mov')" />
      </template>
      <div class="fail_zhe" v-if="collectInfo.deleted == 1||collectInfo.showStatus == 2">已失效</div>
    </div>
    <div class="project_title" @click="toDetail">
      {{ collectInfo.title }}
    </div>
    <div class="project_desc" @click="toDetail">
      {{ collectInfo.slogan }}
    </div>
     <div class="project_btn">
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
      <span @click="showQia">立即咨询</span>
    </div>
    <div class="check_btn" v-if="showStatus == 1">
      <el-checkbox v-model="checkValue" @change="checkChange"></el-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  props: ["showStatus", "collectInfo"],
  data() {
    return {
      cdnPath: process.env.CDN_BASE_URL,
      checkValue: false,
    };
  },
   filters:{
      filterPrice(val){
         return Number(val)/100
      }
  },
  methods: {
    toDetail() {
          const { href } = this.$router.resolve({
             path: "/project/" + this.collectInfo.number + 1,
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
  width: 218px;
  height: 249px;
  background: #ffffff;
  border: 1px solid #cecece;
  opacity: 1;
  margin-bottom: 13px;
  margin-right: 13px;
  position: relative;
  border-radius: 6px;
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
  top: -12px;
  right: -10px;
  opacity: 0.9;
}
.project_btn {
  width: 194px;
  height: 24px;
  margin: 14px 12px 0 12px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
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
  margin:32px 12px 6px 12px;
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
</style>