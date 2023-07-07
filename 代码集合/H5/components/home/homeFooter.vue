<template>
  <div class="footer">
    <div class="footer-box">
      <div class="navtitle">
        <div class="bigtitle">
            <img src="~@/assets/images/home/jianbian_bg@2x.png" width="15" height="15" />
             <span class="dddddd">联系我们</span>
        </div>
        <span class="smalltitle">&nbsp;尽快解决项目问题</span>
      </div>
      <div class="footer-cont">
        <div v-for="(info, idx) in footInfo" :key="idx" class="info-line">
          <div class="info-ico">
            <img :src="info.url" width="14" height="13" />
          </div>
          <p style="margin-left:12px">{{ info.txt }}</p>
        </div>
      </div>
      <!-- <div class="footer-img">
        <ul>
          <li v-for="(item,index) in imgs" :key="index">
            <img :src="require('@/assets/images/'+item.src)" alt />
          </li>
        </ul>
      </div> -->
      <!-- <p class="copyright">{{$t('home.copyright')}}</p> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // imgs: [
      //   {
      //     src: "home/img01_contact_home@3x.png",
      //     id: 1
      //   },
      //   {
      //     src: "home/img02_contact_home@3x.png",
      //     id: 1
      //   }
      // ],
      footInfo: [
        {
          txt: this.$t("home.servicePhone"),
          ico: "&#xe66d;",
          url: require("~/assets/images/home/dianhua_icon@2x.png")
        },
        {
          txt: this.$t("home.serviceTime"),
          ico: "&#xe60f;",
          url: require("~/assets/images/home/shijian_icon@2x.png")
        },
        {
          txt: this.$t("home.serviceAdd"),
          ico: "&#xe627;",
          url: require("~/assets/images/home/dingwei_icon@2x.png")
        }
      ]
    };
  },
  methods: {},
  mounted() {}
};
</script>

<style lang="stylus" scoped>
.dddddd{
  font-weight: bold;
  color: #333333;
  font-size: 0.4266666666666667rem;
  margin-left: -6px;
  width: 80px;
}
.navtitle{
  display: flex;
  align-items: center;
}
.bigtitle{
            width 80px
            height 19px
            display flex
            align-items center
        }
        .smalltitle{
            display inline-block
            margin-top 4px
            color: #233558;
            opacity: 0.5;
            font-weight: 400;
        }
.footer {
  width: 100%;
  background: #ffffff;
}
.footer-box {
  /* margin: 0.53333333rem 0.426666666rem; */
  padding: 13px 15px;
}
.footer-box h3 {
  color: #666;
  font-size: 0.48rem;
  font-weight: bold;
}
.footer-cont {
  margin-top: 0.52rem;
}
.info-line {
  color: #72838f;
  display: flex;
  text-align: center;
  align-items: center;
  margin-bottom: 0.32rem;
  font-size: 0.32rem;
  width: 100%;
  height: 26px;
  background: #F9FAFE;
  border-radius: 24px;
}
.info-ico {
  width: 0.48rem;
  height: 0.48rem;
  // background: #d1d6d9;
  border-radius: 50%;
  // margin-right: 0.3rem;
  margin-left: 15px;
  display: flex;
  align-items: center;
}
.info-ico i {
  font-size: 0.32rem;
  line-height: 0.48rem;
}
.footer-img ul {
  width: 4.8rem;
  margin: 0.42rem auto;
  display: flex;
  align-items: center;
}
.footer-img ul li {
  flex: 1;
  margin-right: 0.8rem;
}
.footer-img ul li:last-child {
  margin-right: 0;
}
.footer-img ul li img {
  width: 100%;
}
.copyright {
  text-align: center;
  font-size: 0.32rem;
  color: #72838f;
}
</style>
