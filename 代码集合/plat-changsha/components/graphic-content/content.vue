<template>
  <div class="gra_detail">
    <div class="gra_detail_contain">
      <!-- 文章区域 -->
      <div class="contain_left">
        <div class="essay_left_top">
          <div :class="['essay_title', noticeInfo.canCopy ? '' : 'noselect']">{{noticeInfo.title}}</div>
          <div class="essay_contant">
            <div class="essay_desc">
               <span>{{ noticeInfo.createUser }}</span>
               <span>/</span>
               <span>{{ noticeInfo.createTime | timeFilter }}</span>
            </div>
            <div v-if="noticeInfo.pageViews > 0">
              <span>
                <img :src="viewUrl" alt="" />
                <span>{{ noticeInfo.pageViews }}</span>
              </span>
              <span
                @mouseenter="qrStatus = true"
                @mouseleave="qrStatus = false">
                <img :src="shareUrl" alt="分享" />
                <span>分享</span>
              </span>
              <div
                class="share_img_contain"
                v-if="qrStatus"
                @mouseenter="qrStatus = true"
                @mouseleave="qrStatus = false">
                <p>扫描二维码分享网页到微信</p>
                <img title="本文二维码，手机扫一扫，精彩随身带!" :src="shareSrc + this.href" alt="分享" />
                <p>分享当前网页到：</p>
                <div>
                  <span @click="qqShare">QQ空间</span>
                  <span @click="weiboShare">新浪微博</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p  :class="['essay_left_bottom', noticeInfo.canCopy ? '' : 'noselect']" v-html="noticeInfo.content"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['noticeInfo'],
  data() {
    return {
      qrStatus: false,
      href: "",
      shareSrc:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=",
      viewUrl: require("@/assets/images/notice/icon_view.png"),
      shareUrl: require("@/assets/images/notice/icon_share.png"),
    };
  },
  filters: {
    timeFilter(val){
      if(val){
        return val.slice(0,10)
      }
    },
  },
  methods: {
    showQr() {
      this.qrStatus = true;
    },
    //qq分享
    qqShare() {
      let urlData =
        "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" +
        window.location.href +
        "&sharesource=qzone&title=" +
        this.noticeInfo.title +
        "&pics=你的分享图片&summary=" +
        this.noticeInfo.meta;
      window.open(urlData, "_self");
    },
    //微博分享
    weiboShare() {
      let urlData =
        "http://service.weibo.com/share/share.php?&sharesource=weibo&title=" +
        this.noticeInfo.title +
        "&url=" +
        window.location.href +
        "&pic=你的分享图片&appkey=1343713053";
      window.open(urlData, "_self");
    },
  },
  mounted() {
    this.href = window.location.href;
  },
};
</script>

<style scoped>
.gra_detail {
  background: #f7f8f9;
  width: 100%;
  overflow: hidden;
  margin: 10px 0;
}
.gra_detail_contain {
  width: 100%;
  display: flex;
  margin: 0 auto;
  margin-top: 0px;
}
.contain_left {
  width: 100%;
  min-height: 600px;
  background: #ffffff;
  border-radius: 5px;
  padding: 19px 15px;
}
.essay_left_top {
  min-height: 68px;
  border-bottom: 1px solid #eceaea;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
}
.essay_title {
  font-size: 18px;
  color: #3d3e3e;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
}
.essay_contant {
  display: flex;
  justify-content: space-between;
  color: #bbbbbb;
  font-size: 12px;
  position: relative;
}
.essay_contant > div:nth-of-type(2) {
  display: flex;
  justify-content: space-between;
}
.essay_contant > div:nth-of-type(2) > span {
  display: flex;
  justify-content: center;
  align-items: center;
}
.essay_contant > div:nth-of-type(2) > span > img {
  margin-right: 5px;
}
.essay_contant > div:nth-of-type(2) > span:nth-of-type(1) {
  margin-right: 30px;
}
.essay_contant > div:nth-of-type(2) > span:nth-of-type(2) {
  cursor: pointer;
}
.essay_contant img {
  widows: 14px;
  height: 12px;
}
.share_img_contain {
  position: absolute;
  right: -15px;
  top: 15px;
  width: 175px;
  min-height: 180px;
  background: #ffffff;
  border: 1px solid rgb(235, 231, 231);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0 15px 0;
  color: #474646;
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
.essay_left_bottom {
  padding: 16px 0;
  color: #333333;
  font-size: 12px;
  min-height: 300px;
}
.essay_desc>span:nth-of-type(3){
  display: inline-block;
  width: 90px;
  height: 14px;
  overflow: hidden;
}
.noselect {
  -webkit-user-select: none;
  /* iOS Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE/Edge */
  user-select: none;
  /* 通用属性 */
  -webkit-touch-callout: none;
  /* iOS Safari */
}
</style>
