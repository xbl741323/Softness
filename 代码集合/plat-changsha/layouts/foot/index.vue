<template>
  <div class="foot">
    <div class="empty-box">
      <div class="conter-box">
        <div class="intro-item" v-for="(item, index) in introList" :key="index">
          <div class="box">
            <img class="top-img" :src="item.imgUrl" />
            <div class="right-title">
              <p class="big">{{ item.title }}</p>
              <p class="small">{{ item.desc }}</p>
            </div>
          </div>
          <div class="line" v-if="index != 3"></div>
        </div>
      </div>
    </div>
    <div class="flex-layout content">
      <div class="flex-layout foot-center">
        <div v-for="(item, index) in records" :key="index">
          <span>{{ item.title }}</span>
          <div class="flex-layout item-center">
            <span class="limit_sty"
              v-for="(item1, index1) in item.content"
              :key="index1">{{ item1.value }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="js_under">
      版权所有© 卧涛控股有限公司
      <a
        style="color: #fff"
        href="http://beian.miit.gov.cn/"
        target="_blank"
        rel="nofollow">皖ICP备13016955号-26</a>
    </div>
    <div class="top-icon" v-if="topIconStatus" @click="toTop()">
      <img :src="cdnUrl + topIconImg" alt="置顶" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      introList: [
        {
          imgUrl: require("@/assets/images/banner/icon_foot_zhuan@2x.png"),
          title: "极速响应",
          desc: "第一时间相应你的需求",
        },
        {
          imgUrl: require("@/assets/images/banner/icon_foot_ding@2x.png"),
          title: "专属服务",
          desc: "服务顾问全程多对一服务",
        },
        {
          imgUrl: require("@/assets/images/banner/icon_foot_gao@2x.png"),
          title: "信息安全",
          desc: "平台赋能保障客户信息安全",
        },
        {
          imgUrl: require("@/assets/images/banner/icon_foot_shou@2x.png"),
          title: "售后无忧",
          desc: "承诺3年售后服务",
        },
      ],
      records: [
        {
          title: "联系我们",
          content: [
            { value: "服务热线：15855199550" },
            {
              value:
                "地址：湖南省长沙市岳麓区麓谷大道627号麓谷新长海中心A1栋13楼1301C室",
            },
          ],
        },
      ],
      topIconStatus: false,
      cdnUrl: "https://static.wotao.com/",
      topIconImg: "icon/head/c09ffde5b90649d0bb5ee647ab9c7e2f.png",
    };
  },
  methods: {
    handleScroll() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 600) {
        this.topIconStatus = true;
      } else {
        this.topIconStatus = false;
      }
    },
    toTop() {
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
};
</script>

<style scoped>
.flex-layout {
  display: flex;
  justify-content: flex-start;
}
.top-icon {
  position: fixed;
  right: 0;
  bottom: 200px;
  color: #585858;
}
.foot {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #585858;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}
.empty-box {
  width: 100%;
  height: 100px;
  background: #fff;
  font-size: 14px;
}

.small {
  font-weight: 400;
  line-height: 20px;
  color: #86898b;
}
.line {
  height: 30px;
  border: 1px solid #cecece;
  margin-right: 20px;
  margin-left: 20px;
}
.conter-box {
  width: 1255px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
.box {
  width: 250px;
  height: 100px;
  margin: auto 0;
  display: flex;
}
.box:nth-of-type(1) {
  margin-left: 37px;
}
.top-img {
  width: 58px;
  height: 58px;
  margin: auto 0;
}
.right-title {
  height: 50px;
  margin: auto 0;
  margin-left: 15px;
}
.big {
  font-size: 18px;
  font-weight: bold;
  line-height: 30px;
  color: #383c40;
}
.content {
  width: 1130px;
  margin: 0 auto;
  padding: 30px 0 0 0;
}
.foot-center {
  width: 924px;
}
.item-center {
  height: 110px;
  margin-top: 8px;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: normal;
}
.wechat {
  flex-direction: column;
  align-items: center;
}
.link {
  cursor: pointer;
}
.limit_sty {
  margin: 5px 26px 5px 0;
}
.left_sty {
  margin-right: 50px;
}
.js_under {
  text-align: center;
  font-size: 12px;
  font-weight: normal;
  color: #fff;
  margin-bottom: 40px;
}

.intro-item {
  width: 1255px;
  display: flex;
  align-items: center;
}
</style>
