<template>
  <div class="home_frame">
    <div class="top_img">
       <img src="https://static.wotao.com/icon/head/e1d4791ebf3c420eb6b9225555076080.png" class="zuo" />
       <banner :typeId="4" :height="364" :showRecomend="true" :ThreeImage="ThreeImage" class="specialbanner"></banner>
       <!-- 个人中心 -->
       <div class="personcontent">
        <div class="usertop">
          <div v-if="userObj.accountId">
            <img v-if="!judgeNull(userObj.diyLogoUrl)" :src="cdnPath+userObj.diyLogoUrl" class="shouyebordcursor"  @click="goPerson" />
            <img v-else src="~/assets/images/home/header_center@2x.png" class="shouyebordcursor"  @click="goPerson" />
          </div>
          <img v-else src="~/assets/images/home/head_icon@2x.png" class="shouyebordcursor" />
          <div>
             <div class="mrten"  @click="goPerson">
               <p class="user-name" v-if="!judgeNull(userObj.username)">您好，{{userObj.username}}</p>
               <p v-else class="font_sty">您好，欢迎光临卧涛网</p>
             </div> 
             <div class="mrten account"  v-if="!judgeNull(userObj.mobile)">登录账号：{{userObj.mobile}}</div>
             <div v-show="isLogin">
               <div v-if="userObj.authStatus==1" class="divStyle">
                <span v-show="userObj.userType==1">
                  <img width="16" height="16" src="~/assets/images/certified_unit_low.png" class="ver" v-if="userObj.certifiedType == 1"/>
                  <img width="16" height="16" src="~/assets/images/certified_unit.png" class="ver" v-if="userObj.certifiedType == 2"/>
                  <span class="userStyle">{{userObj.personName}}</span>
                </span>
                <span v-show="userObj.userType==2">
                  <img width="16" height="16" src="~/assets/images/certified_unit_low.png" class="ver" v-if="userObj.certifiedType == 1"/>
                  <img width="16" height="16" src="~/assets/images/certified_unit.png" class="ver" v-if="userObj.certifiedType == 2"/>
                  <span class="userStyle">{{userObj.companyName}}</span>
                </span>
              </div>
              <div class="unlogin-sty" v-else @click="goauthentication()">
                  <span class="circle-sty"></span>
                  <span class="unlogin-color">未认证，去认证</span>
              </div>
             </div>
          </div>
        </div>
        <div class="userbtn" v-if="!userObj.mobile">
          <div class="gologin" @click="gologin">登录</div>
          <div class="goregister" @click="goregister">注册</div>
        </div>
        <div class="our">
             <div><span class="oura">卧涛科技</span><span class="ourb">服务企业 / 创意未来</span></div>
            <div style="margin-top:18px;">
                <span class="dianzan">10年+</span><span class="dianzan">10万+</span><span class="dianzana">90%+</span>
                 <!-- <div class="shu" :class="{'topa':userObj && userObj.accountSubject}"></div> -->
            </div>
            <div style="margin-top:2px">
                <span class="nodian">行业经验</span><span class="nodian" style="margin-left:40px">月流量</span><span class="nodian" style="margin-left:45px">成交率</span>
                <!-- <div class="shua" :class="{'topb':userObj && userObj.accountSubject}"></div> -->
            </div>
        </div>
        <div class="userindustry">
          <img src="~/assets/images/home/icon_hot.png" width="12px" height="12px" /> <span class="userindustrytit">行业资讯</span><span class="userindustrymore" @click="goindustry">更多 >></span>
        </div>
        <div class="hengxian"></div>
        <div class="mteight">
          <div class="industrydetail" v-for="(childItem,childIndex) in industrys" :key="childIndex">
              <span v-if="childIndex+1==1" class="one">{{childIndex+1}}</span>
                <span v-else-if="childIndex+1==2" class="two">{{childIndex+1}}</span>
              <span v-else-if="childIndex+1==3" class="three">{{childIndex+1}}</span>
              <span v-else class="other">{{childIndex+1}}</span>
              <p class="over"  @click="toDetail(childItem)">{{childItem.title}}</p>
              <img v-if="childIndex+1==1 || childIndex+1==2 || childIndex+1==3"  src="~/assets/images/home/icon_new.png" width="24px" height="12px"  style="margin-left:5px" />
          </div>
        </div>
      </div> 
       <img src="https://static.wotao.com/icon/head/59c48f9570924227a20af273f982274c.png" class="you" />
    </div>
    <!-- 精选服务 -->
    <TopService />
    <!-- 通知公告 -->
    <!-- <policy-square :ThreeImage="ThreeImage"></policy-square> -->
    <!-- 政策汇编、卧涛问答 -->
    <!-- <policy-assembly></policy-assembly> -->
    <!-- 热门项目 -->
    <!-- <pop-project></pop-project> -->
    <!-- 技术转移 -->
    <!-- <shop /> -->
    <!-- 企业服务 -->
    <zhichan />
     <!-- 提交需求 -->
    <improveNeed />
    <!-- <class-room></class-room> -->
    <!-- 技术转移 -->
    <technology-transfer></technology-transfer>
    <show-result></show-result>
    <!-- 项目申报 -->
    <project :projectList="projectList" />
    <about-wt></about-wt>
    <!-- <brand-advantage></brand-advantage> -->
  </div>
</template>

<script>
import { getIndustry,getThree } from "@/api/home";
import { esPageIndustry } from "@/api/announcement";
import showResult from "@/components/home/showResult"
import PolicySquare from "~/components/home/policySquare";
import PolicyAssembly from "~/components/home/policyAssembly";
import PopProject from "~/components/home/popProject";
import ClassRoom from "~/components/home/woTaoClass";
import AboutWt from "~/components/home/aboutWt";
// import BrandAdvantage from "~/components/home/brandAdvantage";
import Banner from "@/components/policy/specialbanner";
import shop from "@/components/home/shop";
import zhichan from "@/components/home/zhichan";
import improveNeed from "@/components/home/improveNeed";
import Default from "~/layouts/default.vue";
import Zhichan from "~/components/home/zhichan.vue";
import project from "~/components/home/project.vue";
import technologyTransfer from "~/components/home/technologyTransfer.vue";
import TopService from "~/components/home/topservice";
import { getUserDetail } from '~/api/member';
import { getProductList } from '@/api/productdetails'
export default {
  //  userType 用户类型 0-未知 1-个人 2-单位
  //  authStatus  认证状态 0-未认证 1已认证
  components: {
    PolicySquare,
    PolicyAssembly,
    PopProject,
    ClassRoom,
    AboutWt,
    // BrandAdvantage,
    Banner,
    shop,
    zhichan,
    improveNeed,
    Default,
    Zhichan,
    technologyTransfer,
    project,
    TopService,
    showResult
  },
  head() {
    return {
      title: "卧涛网(WOTAO.COM)-专业的科技企业服务平台，找企业服务就上卧涛网！",
      meta: [
        {
          name: "keywords",
          content:
            "高新技术企业,创业,专利申请,品牌策划,注册公司,软件开发,企业管理,融资"
        },
        {
          hid: "description",
          name: "description",
          content:
            "卧涛网，专业的科技企业服务平台。为科技企业提供全方位的企业服务项目，如高新技术企业认定代理、公司注册、商标/专利申请、融资上市、企业管理、软件开发、股改、品牌策划等各项企业服务。卧涛专注企业服务10年，金牌服务，售后无忧！"
        }
      ]
    };
  },
  data() {
    return {
      activeIndex: 0,
      industrys:[],
      userObj:{},
      cdnPath:process.env.CDN_BASE_URL,
      ThreeImage:[],
      ok: true,
      currentPage: 1,
      scrollNumber: 1,
      projectList: [],
      isLogin: false//是否登录
    };
  },
  filters:{
      changeInfo(value) {
      if (value) {
          var reg = /^(\d{3})\d*(\d{4})$/;
          var str = value.replace(reg, "$1****$2");
          return str;
      }
      },
  },
  computed:{
     info(){
        if(this.$store.state.userInfo.mobile){
            return this.$store.state.userInfo;
        }else{
            return false;
        }
    }
  },
  methods:{
     goauthentication(){
         this.$router.push({path:'/member/authentication'})
     },
     getThreeImage(){
        getThree().then(res=>{
            if(res.data.data && res.data.data.length>0){
               res.data.data[2].coverUrls = [{zc:1,url:'https://static.wotao.com/icon/head/ca23a8abc1354abe9ca61bd0f2fa116b.png'}]
               this.ThreeImage = res.data.data;
            }
        })
     },
     getUserInfo() {
         getUserDetail().then((res) => {
        if (res.data.code == 0) {
          this.userObj = res.data.data
          Object.values(this.userObj).length > 0 ? this.isLogin = true : this.isLogin = false
        }
      });
    },
    gologin(){
        this.$router.push({
          path:'/login'
        })
    },
    goregister(){
       this.$router.push({
          path:'/register'
        })
    },
    goPerson(){
         this.$router.push({
          path:'/member'
        })
    },
    toDetail(childItem){
      window.open("/policy/" + childItem.industry_no + 101 + '?id=' + childItem.id);
    },
    changeTab(index){
       this.activeIndex = index
    },
    goindustry(){
      window.open('/policy/industryinfo','_self')
    },
    judgeNull(str){
      if(str == '' || str == null || str == undefined){
        return true
      }
        return false;
      },
    // 滚动加载
    handleScroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      var el = document.getElementById('wrap').offsetTop;
      if(scrollTop+500>el){
        if (this.ok) {
          this.ok = false; 
          this.goNext();    
          setTimeout(() => { 
            this.ok = true;      
          }, 500)
        }
      }
    },
      
    goNext(){
      // 最多只能加载4页
      if(this.currentPage<this.scrollNumber && this.currentPage<= 4){
        this.currentPage++
        this.getData(this.$store.state.Set_LocationNo)
      }else{
        return false;
      }
      
    },
    getData(positionNo){
      // let allList = JSON.parse(sessionStorage.getItem('allList'))
      // if(typeof(positionNo) == 'number'){
      //   var area = toString(positionNo)
      // }else if(typeof(positionNo) == 'string'){
      //   var area =  positionNo;
      // }
      let param = {
        // parentId: 0,
        // type:4,
        // areaNo:area,
        // categories:[{id: 2, name: "归口", optionIds: []}],
        categoryId: 1,
        pageNo: this.currentPage,
        pageSize: 25,
        // isNewest:false,
        // isHotSpot:false
      }
      //项目申报
      getProductList(param).then(res=>{
        if(res.data){
          // if (positionNo == '100000') {
          //   sessionStorage.setItem('allList',JSON.stringify(res.data.data.records))
          // }
          if(this.currentPage == 1){
            this.projectList = res.data.data.records;
          }else{
            this.projectList = this.projectList.concat(res.data.data.records);
          }
          // // if (this.currentPage != 1 && positionNo!=='100000' && this.scrollNumber == this.currentPage) {
          // //   this.projectList = this.projectList.concat(allList)
          // // }
          this.total = res.data.data.total;
          if(res.data.data.total<=25){
            this.scrollNumber =1;
          }else if(res.data.data.total%25==0){
            this.scrollNumber = res.data.data.total/25;
          }else{
            this.scrollNumber =parseInt(res.data.data.total/25)+1 ;
          }
        }
      }).catch(err=>{
          return err;
      })
    },
    getNavRightIndustryList(){
      let paras = { 
        pageNo: 1, 
        pageSize: 7,
        sort: "latest"
      }
      esPageIndustry(paras).then(res => {
        this.industrys = res.data.data.industryInfoList
      }).catch(err => {
        return err;
      });
    }
  },
   computed: {
    areaNo() {
      if (this.$store.state.Set_LocationNo !== null) {
        return this.$store.state.Set_LocationNo;
      } else {
        return 100001;
      }
    }
  },
  watch: {
    areaNo(val) {
      this.currentPage = 1
      if (val !== null) {
        this.getData(val);
      } else {
        this.getData(100000);
      }
    }
  },
  created(){
    this.getThreeImage();
  },
  mounted() {
    this.getNavRightIndustryList();
    let val = this.$store.state.Set_LocationNo ? this.$store.state.Set_LocationNo : 100000;
    this.getData(val);
    window.addEventListener("scroll", this.handleScroll);
    this.getUserInfo();
  },
  beforeDestroy(){
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="stylus" scoped>
@import '../../css/home/home.stylus';
.shouyeindustryword {
  font-size:14px;
  height: 25px;
}
.font_sty {
  color: #333333;
  letter-spacing: 1px;
  font-size: 14px;
}
.spanStyle {
  font-size:12px;
  height: 20px;
  color:#888888;
}
.user-name {
    white-space: nowrap;
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    color:#333333;
}
.divStyle {
  padding-left: 5px;
  margin-top: 5px;
}
.userStyle {
  color:#888888;
  font-size:12px;
  vertical-align: middle;
}
.ver {
  vertical-align: middle;
}
.account {
  color:#888888;
  font-size:12px;
  margin-top: 5px;
}
</style>

