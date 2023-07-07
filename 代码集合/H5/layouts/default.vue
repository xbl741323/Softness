<template>
  <div>
    <nuxt :keep-alive="viewCache" :keep-alive-props="{ include: includeArr }" />
    <!-- <div style="position: fixed; z-index: 99999; right: 0.12rem; top: 8.2rem" v-if="$route.path != '/order/order-pay' && $route.path != '/order/address' && $route.path != '/order/my-order' && $route.path != '/member/order' && $route.path != '/member/authentication/authentication-personal' && $route.path != '/member/authentication/personal/personal-authen' ">
      <img
        src="@/assets/images/home/top_icon@2x.png"
        style="display: block; width: 1.3333333333rem; height: 1.68rem"
        @click="tops()"
      />
      <img
        src="@/assets/images/home/zixun_icon@2x.png"
        style="
          display: block;
          width: 1.3333333333rem;
          height: 1.68rem;
          margin-top: -0.5333333333rem;
        "
        v-if="$route.path.indexOf('/project/') == -1"
        @click="showMeiqia"
      />
      <img
        src="@/assets/images/home/zixun_icon@2x.png"
        style="
          display: block;
          width: 1.3333333333rem;
          height: 1.68rem;
          margin-top: -0.5333333333rem;
        "
        v-if="$route.path.indexOf('/project/') != -1 "
        @click="showMeiqia"
      />
    </div> -->
    
    <!-- 遮罩层 -->
    <el-dialog :visible.sync="authDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
    <div v-if="authDialog" class="dialog">
      <p class="auth-title">认证提示</p>
      <p class="auth-msg"> 您身份未认证，无法进行签约操作。为了给您提供更好的服务，请尽快完成认证。</p>
      <div class="dialog-btn">
        <p @click="giveup()">放弃认证</p>
        <p @click="toAuth()">去认证</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/login";
export default {
  middleware: "midd",
  data() {
    return {
      includeArr: ["projectList", "nuticeList"], // 需要缓存的组件名数组
      viewCache: false,
      top: false,
      showStatus: 0,
    };
  },
  computed:{
    authDialog(){
      return this.$store.state.authDialog;
    }
  },
  methods: {
    giveup(){
      this.$store.state.authDialog = false;
    },
    toAuth(){
      this.$store.state.authDialog = false;
      this.$router.push({
        path:'/member/authentication'
      })
    },
    tops() {
      //使得返回顶部过渡置增加交互效果
      // var timer = setInterval(() => document.documentElement.scrollTop <= 0 ? clearInterval(timer) : window.scrollTo(0, document.documentElement.scrollTop - 50), 17);
      var scrolltop =
        document.documentElement.scrollTop || document.body.scrollTop;
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    },
    handleScroll() {
      //改变元素#searchBar的top值
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      // console.log(scrollTop)
      scrollTop >= 108 ? (this.top = true) : (this.top = false);
      scrollTop >= 557 ? (this.showStatus = 1) : (this.showStatus = 0);
    },
    showMeiqia() {
      var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
      _53.push("cmd", "mtalk");
      /*开发者文档1.7 主动发起(手机端)*/ _53.query();
    },
  },
  watch: {
    $route(to, form) {
      
    },
  },
  mounted() {
    try {//获取员工推广码
      if(this.$route.query.link){
          localStorage.setItem('link',this.$route.query.link);
      }
    } catch (error) {
      console.log(error);
    };
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
    window.addEventListener("scroll", this.handleScroll, true);
    // if (this.$route.query.catch) {
    //   this.viewCache = true;
    // } else {
    //   this.viewCache = false;
    // }
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style>
S html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.at_top {
  position: fixed;
  right: 0.42rem;
  bottom: 1.6rem;
  width: 1.12rem;
  height: 1.12rem;
  border-radius: 50%;
  z-index: 9999;
  background: rgba(51, 51, 51, 0.14);
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
  top: 9rem;
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
.dialog{
  width: 80%;
  height: 4.6rem;
  position: fixed;
  top: 45%;
  left: 10%;
  border-radius: 10px;
  background: #FFFFFF;
  font-size: .426rem;
  line-height: 1.6rem;
  z-index: 9999;
  text-align: center;
}
.auth-title{
  font-weight: 550;
}
.auth-msg{
  font-size: .32rem;
  padding: 0 .32rem;
  height: 1.36rem;
  line-height: .5rem;
}
.dialog-btn{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.dialog-btn :nth-child(1){
  color: #999999; 
  font-size: .53rem;
  border-top: 1px solid #E5E5E5;
  border-right: 1px solid #E5E5E5;
}
.dialog-btn :nth-child(2){
  color: #36A6FE; 
  font-size: .53rem;
  border-top: 1px solid #E5E5E5;
}
</style>
