<template>
  <div class="notice_detail">
    <div class="notice_detail_contain">
      <!-- 文章区域 -->
      <div class="contain_left" v-loading.lock="loading">
        <div class="essay_left_top">
          <div class="essay_title">
            {{ noticeInfo.title }}
          </div>
          <div class="essay_contant">
            <div v-if="noticeInfo.policyTypeValue">
              {{ noticeInfo.policyTypeValue }} / {{ noticeInfo.createTime }}
            </div>
            <div v-if="pageViews > 0">
              <span>
                <img :src="viewUrl" alt="浏览" />
                <span>{{ pageViews }}</span>
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
                <img title="本文二维码，手机扫一扫，精彩随身带!" :src="shareSrc + this.href" alt="扫一扫"/>
                <p>分享当前网页到：</p>
                <div>
                  <span @click="qqShare">QQ空间</span>
                  <span @click="weiboShare">新浪微博</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="essay_left_bottom" v-html="noticeInfo.content"></p>
        <!-- 上一页-下一页 -->
        <div class="essay_other" v-if="preInfo.number && preInfo.number !== ''">
          <div @click="toOtherDetail(preInfo, true)">
            <span>上个问题></span>
            <span>{{ preInfo.title }}</span>
          </div>
          <div @click="toOtherDetail(nextInfo, true)" v-if="nextInfo.number && nextInfo.number != ''">
            <span>下个问题></span>
            <span>{{ nextInfo.title }}</span>
          </div>
        </div>
      </div>

      <!-- 推荐区域 -->
      <div class="contain_right" v-loading.lock="loading">
        <div class="right_intro_title">推荐资讯</div>
        <div
          class="right_intro_item"
          v-for="(item, index) in introList"
          :key="index"
          @click="toOtherDetail(item, false)">
          <div>{{ item.title }}</div>
          <div>{{ item.title }}</div>
          <div>
            <span>{{ item.createTime }}</span>
            <span>点击查看</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPolicyDetail, getViews } from "@/api/notice";
import * as CodeMsg from "@/utils/code";
import axios from "axios";
import Encrypt from '~/plugins/Encrypt'
export default {
  head() {
    return {
      title: this.sreverInfo.metaTitle,
      meta: [
        { name: "keywords", content: this.sreverInfo.metaKeyword },
        {
          hid: "description",
          name: "description",
          content: this.sreverInfo.metaDescription,
        },
      ],
    };
  },
  async asyncData({ params, query }) {
    const res = await axios.get(
      process.env.ASYNC_DATA_API +
        "/policy/detail?number=" +
        query.number +
        "&type=0" +
        "&token=1"
    );
    if (res&&res.data&&res.data.data&&res.data.data.detail) {
      // let str = Encrypt.aesDecode(res.data.data.detail.content);
      // res.data.data.detail.content = str;
      return {
        sreverInfo: res.data.data.detail,
      };
    }
  },
  data() {
    return {
      sreverInfo: {},
      qrStatus: false,
      href: "",
      pageViews: 0,
      loading: true,
      noticeInfo: {},
      nextInfo: {},
      preInfo: {},
      number: "",
      introList: [],
      shareSrc:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=",
      viewUrl: require("@/assets/images/notice/icon_view.png"),
      shareUrl: require("@/assets/images/notice/icon_share.png"),
    };
  },
  mounted() {
    this.href = window.location.href;
    // this.getDetail();
  },
  created() {
    this.number = this.$route.query.number;
  },
  methods: {
    showQr() {
      this.qrStatus = true;
    },
    toOtherDetail(obj, status) {
      const newPath = this.$router.resolve({
        path: "/notice/detail",
        query: {
          number: obj.number,
        },
      });
      status == true
        ? window.open(newPath.href, "_self")
        : window.open(newPath.href);
    },
    getDetailViews() {
      getViews(this.number).then((res) => {
        if (res.code == CodeMsg.CODE_1000) {
          this.pageViews = res.data;
        }
      });
    },
    getDetail() {
      this.loading = true;
      let params = {
        number: this.number,
        type: 0,
        token: 1,
      };
      getPolicyDetail(params).then((res) => {
        this.getDetailViews();
        if (res.code == CodeMsg.CODE_1000) {
          this.noticeInfo = res.data.detail;
          if (res.data.pre) {
            this.preInfo = res.data.pre;
          }
          if (res.data.next) {
            this.nextInfo = res.data.next;
          }
          this.introList = res.data.side[0].policies;
          this.loading = false;
        }
      });
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
      window.open(urlData, "_self");
    },
    //微博分享
    weiboShare() {
      let urlData =
        "http://service.weibo.com/share/share.php?&sharesource=weibo&title=" +
        this.noticeInfo.metaTitle +
        "&url=" +
        window.location.href +
        "&pic=你的分享图片&appkey=1343713053";
      window.open(urlData, "_self");
    },
  },
};
</script>

<style scoped>
.notice_detail {
  background: #f7f8f9;
  width: 100%;
  padding: 10px 0px;
  overflow: hidden;
}
.notice_detail_contain {
  width: 62.5%;
  display: flex;
  margin: 0 auto;
  margin-top: 110px;
}
.contain_left {
  width: 970px;
  min-height: 600px;
  margin-right: 10px;
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
  right: -25px;
  top: 15px;
  width: 180px;
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
.contain_right {
  width: 220px;
  height: 590px;
  background: #ffffff;
  border-radius: 5px;
  padding-bottom: 10px;
}
.essay_left_bottom {
  padding: 16px 0;
  color: #333333;
  font-size: 12px;
  min-height: 300px;
}
.right_intro_title {
  width: 100%;
  height: 50px;
  background: #1172f3;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  border-radius: 5px 5px 0px 0px;
}
.right_intro_item {
  width: 100%;
  height: 106px;
  padding: 14px 17px;
  border-top: 1px solid #e7e5e5;
  cursor: pointer;
}
.right_intro_item > div:nth-of-type(1) {
  font-size: 14px;
  color: #333333;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 8px;
}
.right_intro_item > div:nth-of-type(2) {
  width: 100%;
  height: 34px;
  color: #666666;
  font-size: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
}
.right_intro_item > div:nth-of-type(3) {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}
.right_intro_item > div:nth-of-type(3) > span:nth-of-type(1) {
  color: #666666;
}
.right_intro_item > div:nth-of-type(3) > span:nth-of-type(2) {
  color: #36a6fe;
  cursor: pointer;
}
.essay_other {
  width: 100%;
  font-size: 14px;
  margin-top: 50px;
  border-top: 1px solid #eeeaea;
  padding-top: 21px;
}
.essay_other > div:nth-of-type(1) {
  margin-bottom: 9px;
}
.essay_other > div > span:nth-of-type(1) {
  color: #000000;
  opacity: 0.5;
}
.essay_other > div > span:nth-of-type(2) {
  color: #3d3e3e;
  cursor: pointer;
}
</style>