<template>
  <div class="proview_banner">
    <!-- <span
      @mouseenter="showStatus = true"
      @mouseleave="showStatus = false"
      v-for="(item, index) in pointList"
      :key="index"
      :class="['img_pointer', index == 0 ? 'img_left' : 'img_right']">
      <img v-if="showStatus" @click="pointer(item, index)" :src="item" alt="" />
    </span> -->
    <div @mouseenter="showStatus = true" @mouseleave="showStatus = false">
      <img class="show_img" v-if="filterUrl(imgObj)" :src="imgBaseUrl + imgObj.url" alt=""/>
      <div v-if="!filterUrl(imgObj)">
        <video class="show_img" v-if="(imgObj.spUrl==''||imgObj.spUrl==null)" :src="imgBaseUrl + imgObj.url" controls="controls"></video>
        <video class="show_img" v-else :poster="imgBaseUrl + imgObj.spUrl" :src="imgBaseUrl + imgObj.url" controls="controls"></video>
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
            v-for="(item, index) in coverUrls"
            @mouseenter="changeImg(item, index)"
            :key="index">
            <img v-if="filterUrl(item)" :src="imgBaseUrl + item.url" alt=""/>
            <div v-if="!filterUrl(item)">
              <video v-if="(item.spUrl==''||item.spUrl==null)" :src="imgBaseUrl + item.url"></video>
              <video v-else :poster="imgBaseUrl + item.spUrl" :src="imgBaseUrl + item.url"></video>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 浏览量和分享 -->
    <div class="view_page">
      <span class="view_span_main">
        <img :src="viewUrl" alt="">
        <span>{{ noticeInfo.pageViews }}</span>
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
    </div>
  </div>
</template>

<script>
export default {
  props: ["coverUrls","noticeInfo"],
  data() {
    return {
      href:"",
      qrStatus:false,
      shareSrc:'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=',
      showStatus:false,
      viewUrl:require("~/assets/images/xiangmu/icon_browse@2x.png"),
      shareUrl:require("~/assets/images/xiangmu/icon_share@2x.png"),
      imgBaseUrl:process.env.CDN_BASE_URL,
      pointList: [
        require("~/assets/images/shop/left_arrow@2x.png"),
        require("~/assets/images/shop/right_arrow@2x.png"),
      ],
      imgObj: {
        url:"//static-tst.wotao.com/icon/head/d78cea96a6aa4c0d88c6711fff8f8a69.jpg"
      },
      imgIndex: 0,
      imgsLength:null,
    };
  },
  mounted() {
    this.imgIndex = 0;
    this.href = window.location.href;
    this.imgsLength = this.coverUrls.length;
  },
  methods: {
    // 判断url类型是图片格式还是视频格式
    filterUrl(item){
      if(item.url&&item.url.split('.')[item.url.split('.').length-1]=='jpeg'||
         item.url.split('.')[item.url.split('.').length-1]=='png'||
         item.url.split('.')[item.url.split('.').length-1]=='jpg'||
         item.url.split('.')[item.url.split('.').length-1]=='gif'){
         return true;
      }
      if((item.url&&item.url.split('.')[item.url.split('.').length-1]=='mp4'||
         item.url.split('.')[item.url.split('.').length-1]=='avi'||
         item.url.split('.')[item.url.split('.').length-1]=='mov')){
         return false;
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
      let urlData =
        "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" +
        window.location.href +
        "&sharesource=qzone&title=" +
        this.noticeInfo.metaTitle +
        "&pics=你的分享图片&summary=" +
        this.noticeInfo.metaDescription;
      window.open(urlData, "_blank");
    },
    //微博分享
    weiboShare() {
      let urlData =
        "http://service.weibo.com/share/share.php?&sharesource=weibo&title=" +
        this.noticeInfo.metaTitle +
        "&url=" +
        window.location.href +
        "&pic=你的分享图片&appkey=1343713053";
      window.open(urlData, "_blank");
    },
    changeImg(item, index) {
      this.imgObj = item;
      this.imgIndex = index;
    },
    pointer(item, index) {
      if (index == 0) {
        if (this.imgIndex > 0) {
          this.imgObj = this.coverUrls[--this.imgIndex];
        }
      } else {
        if (this.imgIndex < this.coverUrls.length - 1) {
          this.imgObj = this.coverUrls[++this.imgIndex];
        }
      }
    },
  },
};
</script>

<style scoped>
.proview_banner {
  width: 390px;
  height: 277px;
  margin-right: 20px;
  position: relative;
}
.spec-list{
  width: 390px;
  position: relative;
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
    width: 22px;
    height: 32px;
    float: left;
    position: absolute;
    cursor: pointer;
    top: 50%; 
    margin-top: -16px;
}
.arrow-prev-disabled{
  width: 22px;
  height: 32px;
  background: url('~assets/images/service/disabled-prev.png');
}
.arrow-prev-abled:hover{
    background: url('~assets/images/service/hover-prev.png');
}
.sprite-arrow-prev{
    width: 22px;
    height: 32px;
    background-image: url('~assets/images/service/sprite.png');
    background-position: 0 -54px;
}
.arrow-next-abled:hover{
    background: url('~assets/images/service/hover-next.png');
}
.sprite-arrow-next{
    width: 22px;
    height: 32px;
    background-image: url('~assets/images/service/sprite.png');
    background-position: -78px 0;
}
.arrow-next-disabled{
  background: url('~assets/images/service/disabled-next.png');
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
}
.choose_show_span {
  width: 62px;
  height: 54px;
  margin: 0 2px;
  cursor: pointer;
  border: 2px solid #ffffff;
  float: left;
  overflow: hidden;
}
.choose_show_span img{
  width: 62px;
  height: 54px;
}
.choose_show_span video{
  width: 62px;
  height: 54px;
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
  margin-top: 15px;
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
  width: 14px;
  height: 10px;
  margin-right: 4px;
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
  color:#FFB300;
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
</style>