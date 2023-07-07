<template>
<!-- 排查完成 -->
  <div class="proview_banner">
    <span
      v-for="(item, index) in pointList"
      :key="index"
      :class="['img_pointer', index == 0 ? 'img_left' : 'img_right']">
      <img @click="pointer(item, index)" :src="item" alt="" />
    </span>
      <img
          class="show_img"
          v-if="imgObj.url.split('.')[imgObj.url.split('.').length-1]=='jpeg'||
          imgObj.url.split('.')[imgObj.url.split('.').length-1]=='png'||
          imgObj.url.split('.')[imgObj.url.split('.').length-1]=='jpg'||
          imgObj.url.split('.')[imgObj.url.split('.').length-1]=='gif'"
          :src="imgBaseUrl + imgObj.url"
          alt=""
        />
       <div v-if="(imgObj.url.split('.')[imgObj.url.split('.').length-1]=='mp4'||
          imgObj.url.split('.')[imgObj.url.split('.').length-1]=='avi'||
          imgObj.url.split('.')[imgObj.url.split('.').length-1]=='mov')">
          <video
          class="show_img"
          v-if="(imgObj.spUrl==''||imgObj.spUrl==null)"
          :src="imgBaseUrl + imgObj.url" controls="controls"></video>
         <video
          class="show_img"
          v-else
          :poster="imgBaseUrl + imgObj.spUrl"
          :src="imgBaseUrl + imgObj.url" controls="controls"></video>
       </div>
      <div class="img_content">
      <span
        :class="['choose_show_span', imgIndex == index ? 'choosed_sty' : '']"
        v-for="(item, index) in coverUrls"
        @mouseenter="changeImg(item, index)"
        :key="index">
        <img
          v-if="item.url.split('.')[item.url.split('.').length-1]=='jpeg'||
          item.url.split('.')[item.url.split('.').length-1]=='png'||
          item.url.split('.')[item.url.split('.').length-1]=='jpg'||
          item.url.split('.')[item.url.split('.').length-1]=='gif'"
          :src="imgBaseUrl + item.url"
          alt=""
        />
        <div v-if="(item.url.split('.')[item.url.split('.').length-1]=='mp4'||
          item.url.split('.')[item.url.split('.').length-1]=='avi'||
          item.url.split('.')[item.url.split('.').length-1]=='mov')">
          <video
          v-if="(item.spUrl==''||item.spUrl==null)"
          :src="imgBaseUrl + item.url"></video>
         <video
          v-else
          :poster="imgBaseUrl + item.spUrl"
          :src="imgBaseUrl + item.url"></video>
        </div>
      </span>
    </div>
    <div class="view_page">
      <span class="view_span_main">
        <i class="el-icon-view" style="margin-right:2px;"></i>
        <span>123456</span>
      </span>
      <span class="view_span_main">
        <i class="el-icon-position" style="margin-right:2px;color:#FFB300;"></i>
        <span style="color:#FFB300;">分享</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["coverUrls"],
  data() {
    return {
      imgBaseUrl:
        process.env.NODE_ENV == "production"
          ? "//static.wotao.com/"
          : "//static-tst.wotao.com/",
      pointList: [
        require("./imgs/left_pointer.png"),
        require("./imgs/right_pointer.png"),
      ],
      imgObj: {},
      imgIndex: 0
    };
  },
  created(){
    this.imgObj = this.coverUrls[0]
  },
  mounted() {
    this.imgIndex = 0;
  },
  methods: {
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
  width: 456px;
  height: 325px;
  margin-right: 20px;
  position: relative;
}
.img_content {
  display: flex;
  justify-content: flex-start;
}
.show_img {
  width: 456px;
  height: 325px;
}
.choose_show_span {
  width: 68px;
  height: 49px;
  margin-left: 10px;
  margin-top: 5px;
  cursor: pointer;
  border: 2px solid #ffffff;
}
.choose_show_span img{
  width: 64px;
  height: 45px;
}
.choose_show_span video{
  width: 64px;
  height: 45px;
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
  width: 115px;
  margin: 10px 0;
  font-size: 12px;
  justify-content: space-between;
  align-items: center;
}
.view_span_main{
  display: flex;
  color: #B2B2B2;
  justify-content: center;
  align-items: center;
}
</style>