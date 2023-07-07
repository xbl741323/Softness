<template>
  <div>
    <nuxt :keep-alive="viewCache" :keep-alive-props="{ include: includeArr }" />
    <div class="footer">
      <div class="policy_float" v-if="showStatus == true">
        <span class="angle_pointer"></span>
        <ul>
          <li v-for="(val, index) in policyNav" :key="index">
            <img :src="require('@/assets/images/' + val.imgUrl)" />
            <nuxt-link
              :to="val.path"
              class="skip_link"
              @click.native="showStatus = false"
              >{{ val.name }}</nuxt-link
            >
          </li>
        </ul>
      </div>
      <div class="service_float" v-if="showService">
        <span class="angle_pointer"></span>
        <ul>
          <li v-for="(val, index) in serviceNav" :key="index">
            <img :src="require('@/assets/images/' + val.imgUrl)" />
            <nuxt-link
              :to="val.path"
              class="skip_link"
              @click.native="showService = false"
              >{{ val.name }}</nuxt-link
            >
          </li>
        </ul>
      </div>
      <ul class="foot-nav">
        <nuxt-link
          tag="li"
          v-for="(item, index) in indexNav"
          :key="index"
          :to="item.path"
          :class="[currentIndex == index ? 'active' : '', 'foot-nav-list']"
          @click.native="changeTab(item, index)"
        >
          <div class="foot-img">
            <div v-if="index !== 1">
              <img
                v-if="currentIndex == index"
                :src="require('@/assets/images/' + item.imgActive)"
                :class="{'zixun':index===2}"
                alt
              />
              <img v-else :src="require('@/assets/images/' + item.img)" :class="{'zixun':index===2}" alt />
            </div>
            <div v-if="index == 1">
              <img
                v-if="currentIndex == 1"
                :src="require('@/assets/images/' + indexNav[1].imgActive)"
                alt
              />
              <img
                v-if="currentIndex !== 1"
                :src="require('@/assets/images/' + indexNav[1].img)"
                alt
              />
            </div>
          </div>
          <p style="margin-left: 8px;">{{ item.name }}</p>
        </nuxt-link>
      </ul>
    </div>
  </div>
</template>
<script>
import { getUserInfo } from "@/api/login";
import datas from "@/assets/js/static-data";
export default {
  middleware: "midd",
  data() {
    return {
      viewCache: false,
      includeArr: ["projectList", "nuticeList"], // 需要缓存的组件名数组
      currentIndex: 0,
      showStatus: false,
      showService: false,
      top: false,
      // 底部导航数据
      policyNav: datas.datalist.homePolicyNav,
      serviceNav: datas.datalist.homeServiceNav,
      indexNav: datas.datalist.indexNav,
    };
  },
  methods: {
    changeTab(item, index) {
      this.currentIndex = index;
      // 政策广场
      if (index == 1) {
        this.showStatus = !this.showStatus;
      } else {
        this.showStatus = false;
      }
      // 咨询
      if(index==2){
        this.watchRoute()
        this.showMeiqia()
      }
      // 服务分类
      if (index == 3) {
        this.showService = !this.showService;
      } else {
        this.showService = false;
      }
    },
    watchRoute(){
      if (
      String(this.$route.path).indexOf("/policy/announcement") != -1 ||
      String(this.$route.path).indexOf("/policy/assembly") != -1 ||
      String(this.$route.path).indexOf("/policy/troubleList") != -1 ||
      String(this.$route.path).indexOf("/policy/filesDownload") != -1 ||
      String(this.$route.path).indexOf("/policy/industryinfo") != -1
    ) {
      this.currentIndex = 1;
    } else if (
      String(this.$route.path).indexOf("/project") != -1 ||
      String(this.$route.path).indexOf("/zhichan") != -1 ||
      String(this.$route.path).indexOf("/evaluation") != -1||
      String(this.$route.path).indexOf("/result") != -1||
      String(this.$route.path).indexOf("/need") != -1
    ) {
      this.currentIndex = 3;
    } else if (String(this.$route.path).indexOf("/member") != -1) {
      this.currentIndex = 4;
    } else {
      this.currentIndex = 0;
    }
    },
    handleScroll() {
      //改变元素#searchBar的top值
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // console.log(scrollTop)
      if (scrollTop >= 108) {
        this.top = true;
      } else {
        this.top = false;
      }
    },
    listenClick() {
      this.showStatus = false;
      this.showService = false;
    },
    Top() {
      var scrolltop =
        document.documentElement.scrollTop || document.body.scrollTop;
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    },
    showMeiqia() {
      // window.open('https://tb.53kf.com/code/code/0c8e8b081090b185745c9bc98ff4b6cb1/2')
      var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
      _53.push("cmd", "mtalk"); /*开发者文档1.7 主动发起(手机端)*/
      _53.query();
    },
  },
  watch: {
    $route(to, form) {
      this.showStatus = false;
      this.showService = false;
      if (
        String(this.$route.path).indexOf("/policy/announcement") != -1 || //!=-1表示是当前路由
        String(this.$route.path).indexOf("/policy/assembly") != -1 ||
        String(this.$route.path).indexOf("/policy/troubleList") != -1 ||
        String(this.$route.path).indexOf("/policy/filesDownload") != -1 ||
        String(this.$route.path).indexOf("/policy/industryinfo") != -1
      ) {
        this.currentIndex = 1;
      } else if (
         String(this.$route.path).indexOf("/project") != -1 ||
         String(this.$route.path).indexOf("/zhichan") != -1 ||
         String(this.$route.path).indexOf("/evaluation") != -1||
         String(this.$route.path).indexOf("/result") != -1||
         String(this.$route.path).indexOf("/need") != -1
      ) {
        this.currentIndex = 3
      } else if (to.path.indexOf("/member") != -1) {
        this.currentIndex = 4;
      } else {
        this.currentIndex = 0;
      }
    },
  },
  mounted() {
    getUserInfo().then((res) => {
      //页面刷新重新获取用户信息
      if (res.code == 10002) {
        //清除用户信息
        this.$store.state.userInfo = {};
        localStorage.removeItem("userInfo");
      } else {
        //刷新用户信息
        this.$store.state.userInfo = res.data;
      }
    });

    console.log(this.$route);
    if (this.$route.query.catch) {
      this.viewCache = true;
    } else {
      this.viewCache = false;
    }
    this.watchRoute()
    window.addEventListener("scroll", this.handleScroll, true);
    window.addEventListener("click", this.listenClick, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
<style scoped>
.foa{
  position: fixed; 
  z-index: 99999; 
  right: 0.12rem; 
  bottom: 8rem;
}
.kkk{
  display: block; 
  width: 1.3333333333rem; 
  height: 1.68rem
}
.jjj{
   display: block;
          width: 1.3333333333rem;
          height: 1.68rem;
          margin-top: -0.5333333333rem;
}
.zixun{
  width: 59px !important;
  height: 59px !important;
  position: relative;
  top: -7px;
  left: -14px;
}
.footer {
  width: 100%;
  height: 1.42rem;
  position: fixed;
  background: #fbfbfb;
  z-index: 9999;
  left: 0;
  bottom: 0;
}
.policy_float {
  position: absolute;
  bottom: 1.3933333rem;
  left: 15%;
  background: #fbfbfb;
  /*height: 4.97333333rem;*/
  width: 32%;
  border: 1px solid #36a6fe;
}
.service_float {
  position: absolute;
  bottom: 1.3933333rem;
  left: 55%;
  background: #fbfbfb;
  /*height: 4.97333333rem;*/
  width: 32%;
  border: 1px solid #36a6fe;
}
.policy_float li,
.service_float li {
  display: block;
  height: 1.2432222222rem;
  line-height: 1.2432222222rem;
  font-size: 0.32rem;
  border-bottom: 1px solid #d6d6d6;
  color: #666666;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fbfbfb;
}
.policy_float li img,
.service_float li img {
  width: 0.42666666667rem;
  margin-right: 0.213333333333rem;
}
.foot-nav {
  display: flex;
  align-items: center;
  border-top: 1px solid #e7e6eb;
}
.foot-nav-list {
  height: 1.33333333rem;
  width: 25%;
  text-align: center;
}
.foot-img {
  width: 23%;
  margin: 0 38%;
  margin-top: 0.12rem;
}
.foot-img img {
  /* width: 100%; */
  width: 24px;
  height: 24px;
}
.foot-nav-list p {
  color: #999;
  font-family: PingFang SC;
  font-size: 0.32rem;
}
.active p {
  color: #36a6fe;
}
.skip_link {
  color: #666666;
  text-decoration: none;
}
.angle_pointer {
  position: absolute;
  width: 0.23333333333rem;
  height: 0.23333333333rem;
  border: 1px solid #36a6fe;
  bottom: -0.16066666667rem;
  left: 50%;
  border-top: 0px solid;
  border-left: 0px solid;
  transform: translate(-50%) rotate(45deg);
  background: #ffffff;
}
.footer_top {
  position: fixed;
  right: 0.42rem;
  bottom: 1.6rem;
  width: 1.12rem;
  height: 1.12rem;
  border-radius: 50%;
  z-index: 9999;
  /* background: rgba(51, 51, 51, 0.14); */
  text-align: center;
  transform: rotate(180deg);
}
.top-ico {
  color: #999;
  line-height: 1.12rem;
  font-size: 22px;
}
.meiqia {
  position: fixed;
  z-index: 99999;
  right: 0.42rem;
  top: 8.2rem;
  width: 1.2266666667rem;
  height: 1.2266666667rem;
  text-align: center;
  background: linear-gradient(180deg, #70d8ff 0%, #44b7f9 100%);
  border-radius: 50%;
  color: #fff;
}
.mq-txt {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  text-align: center;
  transform: translate(-50%, -50%);
}
.mq-txt p {
  font-size: 0.32rem;
}
</style>