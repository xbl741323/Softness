<template>
  <div>
     <div style="width:1200px;margin:20px auto;position:relative;">
        <span class="tia" @click="toMore" >项目申报</span>
        <span class="tib"  @click="toMore">/ 为企业发展保驾护航</span>
        <span class="morezhichuan" @click="toMore">
              更多&nbsp;
                <img
                    src="~assets/images/home/icon_right_arrow.png"
                    alt=""
                    width="14"
                    height="14"
                  />
         </span>
      </div>
      <div class="list">
            <div class="projectItem" v-for="(item,index) in projectList" :key="index" @click="goDetail(item)">
                 <!-- <template v-if="item.coverUrls && item.coverUrls.length>0">
                       <div v-for="(newItem,index) in item.coverUrls" :key="index*6">
                           <img src="static.wotao.com/icon/head/38eb4037f2004e83bb8767e895365904.png">
                            <template v-if="newItem.isCover == 1">
                                    <img class="project-img" :src='imgPath+newItem.url' v-if="newItem.url && (newItem.url.split('.')[1]=='jpeg' || newItem.url.split('.')[1]=='png' ||newItem.url.split('.')[1]=='jpg' ||newItem.url.split('.')[1]=='gif')" />                    
                                    <video 
                                    class="project-img"
                                    v-else-if="newItem.spUrl&&(newItem.spUrl!==''&&newItem.spUrl!==null)" 
                                    :poster="imgPath+newItem.spUrl"
                                    :src="imgPath + newItem.url"></video>
                                    <video v-else :src="imgPath + newItem.url"  class="project-img"></video>
                            </template>
                        </div>
                 </template> -->
                <template>
                    <img class="project-img" :src='imgPath+item.imageUrl' v-if="item.imageUrl&&(item.imageUrl.split('.')[1]=='jpeg' || item.imageUrl.split('.')[1]=='png' ||item.imageUrl.split('.')[1]=='jpg' ||item.imageUrl.split('.')[1]=='gif')" />
                    <video class="project-img" :src='imgPath+item.imageUrl' v-if="item.imageUrl &&(item.imageUrl.split('.')[1]=='mp4' || item.imageUrl.split('.')[1]=='avi' ||item.imageUrl.split('.')[1]=='mov')" />
                </template>
                <!-- <span class="optionName">{{item.generateAttributeList[1].attributeValueDesc}}</span>  -->
                <span class="title">{{item.spuTitle}}</span>
                <p :class="['description',item.spuTitle.length>12 && item.spuSlogan.length>13?'specialdescription':'']">{{item.spuSlogan}}</p>
                <div class="message">
                        <div v-if="item.isOnline">
                            <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                            <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
                        </div> 
                        <!-- <div v-else-if="item.nowFee && item.previousFee">
                            <span class="priceIcon">￥</span><span class="price">{{item.nowFee | filterPrice}}</span><span class="huaxian">{{item.previousFee | filterPrice}}</span>
                        </div> 
                        <div v-else-if="item.nowFee || item.previousFee">
                            <span class="priceIcon">￥</span><span class="price">{{ (item.nowFee || item.previousFee) | filterPrice}}</span>
                        </div> -->
                        <div v-else class="nowchat">面议</div>
                    <div class="ask" @click.stop="showQia">立即咨询</div>
                </div>
            </div>
            <div id="wrap" style="visibility: hidden;">滚动标识</div>
      </div>
       <div v-loading="loading"></div>
 </div>
</template>
<script>
import tools from '@/utils/priceDeal' 
export default {
   data(){
       return{
           imgPath: process.env.CDN_BASE_URL,
           currentPage:1,
           scrollNumber:1,
           loading:false,
            ok: true
       }
   },
   props:{
      projectList:{
          type: Array,
          default: []
      }
  },
    filters:{
        filterPrice(val){
            return Number(val)/100
        },
        filterViewprice(val){
            return tools.filterViewprice(val)
        }
  },
   methods:{
        toMore(){
            window.open('/project/','_self');   
        },
        goDetail(item){
            window.open(`/productdetails/details?spuId=${item.id}`);
        },
      showQia() {
        window.open(
            "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
            "",
            "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
        );
    }
   }
}
</script>
<style lang="stylus" scoped>
@import "./project.styl";
</style>