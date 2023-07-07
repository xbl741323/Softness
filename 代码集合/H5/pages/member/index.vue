<template>
  <client-only>
    <div class="member_frame">
      <!-- 头部搜索栏 -->
      <!-- 用户登录/注册 -->
      <div class="member_login">
        <div class="project_header_title">
          <i class="iconfont project_header_left" @click="toSki(0)">&#xe641;</i>
          <p class="center_member">{{ metaTitle }}</p>
        </div>
        <div class="top-box">
          <div class="info-card">
            <!-- 头像 -->
            <div class="head_img">
              <!-- 已登录时 -->
              <div class="login_head" v-if="info.accountId">
                <img v-if="info.diyLogoUrl&&info.diyLogoUrl!==null" :src="cdnUrl+logoUrl" alt />
                <img v-else :src="require('@/assets/images/member/header_center@2x.png')" alt />
              </div>
              <!-- 未登录时 -->
              <div class="login_head" v-else>
                <img :src="require('@/assets/images/member/member_head@2x2.png')" alt />
              </div>
              <img v-if="info.authStatus==1" src="@/assets/images/member/certify_already.png" class="comfirm-icon">
              <img v-else src="@/assets/images/member/certify_disabled.png" class="comfirm-icon">
            </div>
            <!-- 账号信息 -->
            <div>
              <div class="login_regist" v-if="!info.accountId" @click="toSki(1)">
                {{ $t('message.pleaseLogin') }}
              </div> 
              <div class="login_haved" v-else>
                <div>
                  <div class="name_sty" style="font-size: 14px">{{ "尊敬的用户"+ info.username }}</div>
                  <div class="name_sty">{{ "登录账号：" + info.mobile}}</div>
                  <div class="company" v-if="info.authStatus == 1">
                    <img src="@/assets/images/member/icon_approve@2x.png">
                    <span>{{info.userType == 1 ? info.personName : info.companyName}}</span>
                  </div>
                </div>
                <div class="login_type" v-if="info.authStatus==1">已认证</div>
                <div class="login_type" v-else>未认证</div>
              </div>
            </div>
            <div class="info_right" v-if="info.accountId">
               <span class="toachieve" @click="toAccount">去完善</span>
              <img src="~/assets/images/order/into_icon@2x.png" alt="" @click="toAccount">
            </div>
          </div>
          <div class="order-list">
            <div>
              <img src="~/assets/images/order/dd_icon_dark@2x.png" @click="myOrder()">
              <p>全部订单</p>
            </div>
            <div>
              <el-badge :value="countList.waitPayCount > 0 ? countList.waitPayCount : undefined">
                <img src="~/assets/images/order/money_icon@2x.png" @click="myOrder(0)">
              </el-badge>
              <p>待付款</p>
            </div> 
            <div>
              <el-badge :value="(countList.waitSignElectronCount || '') +
                (countList.waitSignPaperCount || '') > 0 ? (countList.waitSignElectronCount || '') +
                (countList.waitSignPaperCount || '') : undefined">
                <img src="~/assets/images/order/order-sign.png" @click="myOrder(1)">
              </el-badge>
              <p>待签约</p>
            </div>
            <div>
              <el-badge :value="countList.serviceOrderCount > 0 ? countList.serviceOrderCount : undefined">
                <img src="~/assets/images/order/fw_icon_dark.png" @click="myOrder(3)">
              </el-badge>
              <p>服务中</p>
            </div>
            <div>
              <el-badge :value="countList.refundCount > 0 ? countList.refundCount : undefined">
                  <img src="~/assets/images/order/tk_icon_dark.png" @click="myOrder(99)">
              </el-badge>
              <p>退款/售后</p>
            </div>
          </div>
        </div>
      </div>
      <!-- member操作区域 -->
      <div class="member_operate">  
        <div
          class="operate_item"
          v-for="(item, index) in imgList"
          :key="index"
          @click="operate(index)">
          <div class="item_left">
          <img :src="require('@/assets/images/' + item.imgSrc)" alt :class="[index==3?'img_sty':'']"/>
            <span>{{ item.title }}<h1 style="color:red">{{ceshi}}</h1></span>
          </div>
          <div class="item_right"></div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import { getWeixinOpenid } from '~/api/weixinpay'
import { layout, getUserInfo } from "@/api/login"
import { getAuthentication } from '~/api/member'
import { getOnlineOrdersStatistics } from '@/api/order'
import { getzfbResult,getAliResult, statisticsOrderNumForFront } from '~/api/member'
import { Dialog } from 'vant';
import {toWx} from '@/utils/toWx'
export default {
  layout: "footer",
  head() {
    return {
      title: this.metaTitle,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description",
        },
      ],
    };
  },
  data() {
    return {
      countList: [],
      cdnUrl: process.env.CDN_BASE_URL,
      logoUrl: "",
      accountNo: "",
      accountType: "",
      authenticationStatus:"",
      userObj: {},
      loginStatus: 0,
      metaTitle: this.$t('message.memberCenter'),
      imgList: [
        {
          title: this.$t('message.accountSet'),
          imgSrc: "member/member_set@2x.png",
        },
        {
          title: this.$t('message.myCollect'),
          imgSrc: "member/member_collect@2x.png",
        },
        {
          title: "身份认证",
          imgSrc: "member/icon_renzheng@2x.png",
        },
        {
          title: "我的提问",
          imgSrc: "member/icon_question@2x.png",
        },
        {
          title:  this.$t('message.quit'),
          imgSrc: "member/member_out@2x.png",
        },
      ],
      ceshi:null
    }
  },
  computed: {
    info(){
      return this.$store.state.userInfo
    },
  },
  filters: {
    typeFilter(value) {
      return value == 2 ? "单位" : value == 1 ? "个人" : "";
    },
  },
  methods: {
    getMessageNumber() {
        let params = {
          userId: this.info.userId,
          accountId: this.info.accountId
        }
      statisticsOrderNumForFront(params).then(res => {
        this.countList = res.data
      })
    },
    myOrder(status){
      // this.$router.push({
      //   path:'/member/order',
      //   query:{
      //     status: status
      //   }
      // })
      toWx()
    },
    toAccount() {
      this.$router.push({
        path: "member/account/info",
      });
    },
    operate(index) {
      toWx()
      // if (index == 3) {
      //   //调用登出接口
      //   this.userLayout();
      // } else if (index == 1) {
      //   this.$router.push({
      //     path:"/member/collect"
      //   })
      // } else  if (index == 2){
      //    this.$router.push({
      //     path:"/member/authentication"
      //   })
      // }else{
      //    this.$router.push({
      //     path:"/member/account"
      //   })
      // }
    },
    getUser() {
      getUserInfo().then((res) => {
        if (res.data) {
          this.loginStatus = 1;
          this.userObj = res.data;
          if (this.userObj.diyLogoUrl&&this.userObj.diyLogoUrl !== null) {
            this.logoUrl = this.cdnUrl + this.userObj.diyLogoUrl;
          }
        }
      });
    },
    userLayout() {
      layout().then((res) => {
        if (res.code == 0) {
          location.href = "/"
        }
      });
    },
    toSki(val) {
      toWx()
      // Dialog.confirm({
      //   title: `即将打开“卧涛商城”小程序`,
      //   // message: `即将打开“卧涛商城”小程序`,
      //   confirmButtonText:'允许',
      //   confirmButtonColor:'#36a6fe'
      // }).then(() => {
      //   toWx()
      // }).catch(() => {
      // // on cancel
      // });
      // if (val == 0) {
      //   this.$router.push({
      //     path: "/",
      //   });
      // } else {
      //   this.$router.push({
      //     path: "/login",
      //   });
      // }
    },
    noBack(){
      history.pushState(null, null, document.URL);
    },
     // 截取回调页code(用code换取openid)
    getUrlParam(){
       let href = window.location.href
       if(href.split('code').length==2){   
           return href.split('code')[1].split('&state')[0].split('=')[1]
       }else{
           return null
       }
    },
    // 获取openid
    getopenid(user){
      getWeixinOpenid({code:'011Wx01w3oXddY2nY42w3OLUoW1Wx01I',accountId:user.id}).then(res=>{
          if(res.code==0){
              this.openid = res.data
          }else{
              Toast({
                message: res.msg.errmsg,
                position: "middle",
                duration: 3000
              })
          }
      })
    },
  },
  mounted() {
    // if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'){
    //      const code = this.getUrlParam()
    //      this.ceshi =  code
    //      if(code == null){
    //         window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ 'wx6ea2b65c38386eb0'  +'&redirect_uri=' + encodeURIComponent('https://www.airkonw.com/') + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
    //      }
    // }
    // this.getopenid(JSON.parse(localStorage.getItem('userInfo')))
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if(userInfo&&userInfo.accountId&&userInfo.accountId!==null){
      this.logoUrl = userInfo.diyLogoUrl+'?t='+ new Date();
      this.getMessageNumber();
      // 申请单位认证
      getAuthentication({userid: userInfo.userId}).then(res=>{
        if(res.code == 0){
          this.authenticationStatus = res.data.auditStatus;
        }
      }) 
    };     
    if(window.history && window.history.pushState){
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.noBack, false);
    }      
    // 刷脸认证结果(通知后端)
    if(localStorage.getItem('authentication-result')){
        let param = JSON.parse(localStorage.getItem('authentication-result'))
        // 阿里云
        if(param.plat==1){
           getAliResult(param).then(res=>{
            if(res.code==0){
            }else if(res.code == 1){
            }
           })
        }else{
        //  支付宝 
            getzfbResult(param).then(res=>{
            if(res.code==0){
                // this.$router.push('/member/authentication');
                // window.alert('认证成功')
            }else if(res.code == 1){
                // window.alert('认证失败');
            }
           })
        }

    }
  },
  destroyed(){
    window.removeEventListener('popstate', this.noBack, false);
     if(localStorage.getItem('authentication-result')){
        localStorage.removeItem('authentication-result')
    }
  },
};
</script>

<style lang="stylus" scoped>
 @import '~assets/css/member/member.styl'
</style>