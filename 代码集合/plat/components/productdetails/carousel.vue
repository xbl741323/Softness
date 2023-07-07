<template>
  <div class="proview_banner">
    <div @mouseenter="showStatus = true" @mouseleave="showStatus = false">
      <img class="show_img" v-if="filterType(imgObj)" :src="cdnPath + imgObj.imageUrl" alt=""/>
      <div v-if="!filterType(imgObj)">
        <video class="show_img" :poster="cdnPath + imgObj.mediaUrl" :src="cdnPath + imgObj.imageUrl" controls="controls"></video>
      </div>
    </div>
    <!-- 缩略图 -->
    <div class="spec-list">
      <a id="spec-forward" class="arrow-prev">
        <i v-if="imgsLength == 7" class="sprite-arrow-prev arrow-prev-abled" @click="prevImg"></i>
        <i v-else class="arrow-prev-disabled"></i>
      </a>
      <a id="spec-backward" class="arrow-next">
        <i v-if="imgsLength>5&&imgsLength != 7" class="sprite-arrow-next arrow-next-abled" @click="nextImg"></i>
        <i v-else class="sprite-arrow-next arrow-next-disabled"></i>
      </a>
      <div class="img_content">
        <ul ref="thumbnail">
          <li :class="['choose_show_span', imgIndex == index ? 'choosed_sty' : '']"
            v-for="(item, index) in imageList"
            @mouseenter="changeImg(item, index)"
            :key="index">
            <img v-if="filterType(item)" :src="cdnPath + item.imageUrl" alt=""/>
            <div v-if="!filterType(item)">
              <video :poster="cdnPath + item.mediaUrl" :src="cdnPath + item.imageUrl"></video>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 浏览量,分享,收藏 -->
    <div class="view_page">
      <span class="view_span_main">
        <img :src="viewUrl" alt="">
        <span class="viewword">{{ pageViews }}&nbsp;浏览</span>
      </span>
      <span class="view_span_main">
        <img :src="shareUrl" alt="">
        <span class="share_color_sty" @mouseenter="qrStatus = true" @mouseleave="qrStatus = false">分享</span>
        <div class="share_img_contain" v-if="qrStatus" @mouseenter="qrStatus = true" @mouseleave="qrStatus = false">
         <p>扫描二维码分享网页到微信</p>
          <img title="本文二维码，手机扫一扫，精彩随身带!" :src="shareSrc + href"/>
         <p>分享当前网页到：</p>
         <div class="share-sty-content">
          <span @click="qqShare()">
            <i class="iconfont qq-sty">&#xe780;</i>
            <span>QQ空间</span>
          </span>
          <span @click="weiboShare()">
            <i class="iconfont weibo-sty">&#xe631;</i>
            <span>新浪微博</span>
          </span>
         </div>
        </div>
      </span>
      <span class="view_span_main curpos">
        <template v-if="collectStatus==false">
            <img :src="collectUrl" alt="" class="curpos" @click="collect(0)">
            <span class="viewword curpos" @click="collect(0)">收藏</span>
        </template>
        <template v-if="collectStatus==true">
            <img :src="cancelUrl" alt="" @click="collect(1)"> 
            <span class="viewword curpos" @click="collect(1)">取消收藏</span> 
        </template>
      </span>
    </div>
  </div>
</template>

<script>
import { getView,addcollect,cancelcollect,getcollectList,isCollect } from '@/api/productdetails'
export default {
  props: {
    baseInfo:{
       type:Object,
       required:true
    },
    imageList:{
        type:Array,
        required:true
    }
  },
  data() {
    return {
      collectUrl:require("~/assets/images/productdetails/shoucang_icon@2x.png"),  
      cancelUrl:require("~/assets/images/productdetails/collect_icon.png"),
      href:"",
      qrStatus:false,
      shareSrc:'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=',
      showStatus:false,
      viewUrl:require("~/assets/images/productdetails/liulan_icon@2x.png"),
      shareUrl:require("~/assets/images/productdetails/fenxiang_icon@2x.png"),
      cdnPath:process.env.CDN_BASE_URL,
      imgObj: {
           imageUrl:"//static-tst.wotao.com/icon/head/d78cea96a6aa4c0d88c6711fff8f8a69.jpg"
      },
      imgIndex: 0,
      imgsLength:null,
      pageViews:0,
      collectStatus:false,
      userId:null
    };
  },
  mounted() {  
    if(localStorage.getItem('userInfo')){
      this.userId = JSON.parse(localStorage.getItem('userInfo')).userId
      this.judgeCollectStatus()
    }
    this.getViews()
    this.imgIndex = 0;
    this.href = window.location.href;
    this.imgsLength = this.imageList.length;
    this.imgObj = this.imageList[0]
  },
  methods: {
    //是否收藏  
    judgeCollectStatus(){
        isCollect({userId:this.userId,spuId:this.baseInfo.id}).then(res=>{
            if(res.data.code==0){
              this.collectStatus = res.data.data
            }
        })
    },  
    //浏览量
    getViews(){
        getView({keyId:this.baseInfo.id}).then(res=>{
            this.pageViews = res.data.data
        })
    },
    //收藏
    collect(type){
        if(this.userId){
          if(type==0){
              addcollect({spuId:this.baseInfo.id,userId:this.userId}).then(res=>{
                if(res.data.code==0){
                  this.$message({
                    type:'success',
                    message:"收藏成功!",
                    offset:300
                  })
                   this.judgeCollectStatus()
                }
             })
          }else{
              cancelcollect({spuIds:[this.baseInfo.id],userId:this.userId}).then(res=>{
                if(res.data.code==0){
                  this.$message({
                    type:'success',
                    message:"取消成功!",
                    offset:300
                  })
                   this.judgeCollectStatus()
                }
              }) 
          }
        }else{
          this.$router.push('/login')
        }
    },
    // 判断是图片还是视频
    filterType(item){
      if(item.imageUrl.match(/(jpeg|png|jpg|gif)/)){
          return true
      }else{
          return false
      }
    },
    nextImg(){
      var thumbnail = this.$refs.thumbnail;
      thumbnail.style = 'transform: translateX(-'+ 330 +'px)';
      this.imgsLength = 7
    },
    prevImg(){
      var thumbnail = this.$refs.thumbnail;
      thumbnail.style = 'transform: translateX('+ 0 +'px)';
      this.imgsLength = 6
    },
    //qq分享
    qqShare() {
      const urlData = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' +window.location.href +'&sharesource=qzone&title=项目申报&pics=你的分享图片&summary=你的分享描述信息'
      window.open(urlData, '_blank')
    },
    //微博分享
    weiboShare() {
      const urlData ='http://service.weibo.com/share/share.php?&sharesource=weibo&title=项目申报&url=' + window.location.href + '&pic=你的分享图片&appkey=1343713053'
      window.open(urlData, '_blank')
    },
    changeImg(item, index) {
      this.imgObj = item;
      this.imgIndex = index;
    },
  }
};
</script>

<style scoped>
.proview_banner {
  width: 390px;
  height: 277px;
  margin-right: 12px;
  position: relative;
}
.spec-list{
  width: 390px;
  position: relative;
  margin-top: 8px;
}
.spec-list i{ 
  display: block;
}
.arrow-prev {
  left: 0;
}
.arrow-next {
  right: 0;
}
.arrow-prev,.arrow-next{
    display: block;
    width: 26px;
    height: 26px;
    float: left;
    position: absolute;
    cursor: pointer;
    top: 50%; 
    margin-top: -16px;
}
.arrow-prev-disabled{
  width: 26px;
  height: 26px;
  background: url('~assets/images/productdetails/left_icon_disable.png');
}
/* .arrow-prev-abled:hover{
    background: url('~assets/images/productdetails/hover-prev.png');
} */
.sprite-arrow-prev{
    width: 26px;
    height: 26px;
    background-image: url('~assets/images/productdetails/left_icon.png');
}
/* .arrow-next-abled:hover{
    background: url('~assets/images/service/hover-next.png');
} */
.sprite-arrow-next{
    width: 26px;
    height: 26px;
    background-image: url('~assets/images/productdetails/right_icon.png');
    background-position: -78px 0;
}
.arrow-next-disabled{
  background: url('~assets/images/productdetails/right_icon_disable.png');
}
.img_content {
  width: 330px;
  margin: 0 auto;
  position: relative;
  height: 54px;
  overflow: hidden;
}
.img_content ul{
  overflow: hidden;
  zoom: 1;
  width: 400px;
  height: 54px;
  padding: 0;
  -webkit-transition: all .5s;
	transition: all .5s;
}
.show_img {
  width: 390px;
  height: 277px;
  cursor: pointer;
  object-fit: cover;
}
.choose_show_span {
  width: 62px;
  height: 44px;
  margin: 0 2px;
  cursor: pointer;
  border: 2px solid #ffffff;
  float: left;
  overflow: hidden;
}
.choose_show_span img{
  width: 62px;
  height: 44px;
}
.choose_show_span video{
  width: 62px;
  height: 44px;
  object-fit: cover;
}
.choosed_sty {
  border: 2px solid #36a6fe;
}
.choose_show_span:nth-of-type(1) {
  margin-left: 0 !important;
}
.img_pointer {
  width: 50px;
  z-index: 1000;
}
.img_pointer img {
  width: 100%;
  cursor: pointer;
}
.img_left {
  position: absolute;
  top: 35%;
  left: 24px;
}
.img_right {
  position: absolute;
  top: 35%;
  right: 24px;
}
.view_page{
  display: flex;
  margin-top: 12px;
  font-size: 12px;
  justify-content: flex-start;
  align-items: center;
}
.view_span_main{
  display: flex;
  color: #B2B2B2;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}
.view_span_main img{
  width: 16px;
  height: 16px;
  margin-right: 2px;
}
.view_span_main:nth-of-type(2){
  cursor: pointer;
  position: relative;
}
.share_img_contain {
  position: absolute;
  left: 10px;
  top: 15px;
  width: 200px;
  min-height: 180px;
  background: #ffffff;
  border: 1px solid rgb(235, 231, 231);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0 15px 0;
  color: #474646;
  z-index: 1000;
}
.share_img_contain > p:nth-of-type(1) {
  margin-bottom: 10px;
}
.share_img_contain > p:nth-of-type(2) {
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}
.share_img_contain > div {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.share_img_contain > div > span {
  cursor: pointer;
  transition: 0.3s;
}
.share_img_contain > div > span:hover {
  color: #36a6fe;
}
.share_img_contain > div > span:nth-of-type(2) {
  margin-left: 20px;
}
.share_img_contain img {
  margin-bottom: 15px;
  width: 110px;
  height: 110px;
}
.share_color_sty{
  color: #555555;
  font-size: 16px;
  margin-right: 2px;
}
.qq-sty{
  color:#FFBF31;
  font-size:18px;
  margin-right:5px;
}
.weibo-sty{
  color:#D62D2F;
  font-size:18px;
  margin-right:5px;
}
.share-sty-content{
  display: flex;
  justify-content: center;
  align-items: center;
}
.share-sty-content >span{
  display: flex;
  justify-content: center;
  align-items: center;
}
.viewword{
  color: #555555;
  font-size: 16px;
}
.curpos{
    cursor: pointer;
}
</style>