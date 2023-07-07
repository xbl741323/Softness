<template>
  <div class="container">
    <top-cont />
    <div class="hierarchy-box"><img :src="bannerUrl" class="wotaobackground" /></div>
    <!-- 金刚区 -->
    <icons />   
    <!-- 精选服务 -->
    <selectservices/>
    <!-- 技术转移 -->
    <!-- <technology /> -->
    <!-- 所有产品 -->
    <allservice id="allservice" @scrollView="handleScrollTo" />
  </div>
</template>

<script>
import topCont from "~/components/home/top";
import zhichan from "~/components/home/zhichan";
import notice from "~/components/home/notice";
import policy from "~/components/home/policy";
import icons from "~/components/home/icons";
import policySquare from "~/components/home/policySquare";
import project from "~/components/home/project";
import technology from "~/components/home/technology";
import advantage from "~/components/home/advantage";
import question from "~/components/home/question";
import homeFooter from "~/components/home/homeFooter";
import Selectservices from '~/components/home/selectservices.vue';
import Allservice from '~/components/home/allservice.vue';
import datas from '@/assets/js/static-data'
export default {
  middleware: "midd",
  components: {
    topCont,
    notice,
    policy,
    project,
    question,
    homeFooter,
    policySquare,
    advantage,
    icons,
    zhichan,
    technology,
    Selectservices,
    Allservice
  },
  layout: "footer",
  head() {
    return {
      title: "卧涛网（WOTAO.COM）-专业的科技企业服务平台，找企业服务就上卧涛网！",
      meta: [
        { charset: "utf-8" },
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
        parentOfftop:0,
        bannerUrl:datas.datalist.indexBanner
    }
  },
  mounted() {
    try {//获取员工推广码
      if(this.$route.query.link){
        localStorage.setItem('link',this.$route.query.link);
      }
    } catch (error) {
      console.log(error)
    }
    this.parentOfftop = document.getElementById('allservice').offsetTop-150
  },
  methods:{
    handleScrollTo(){
       this.$nextTick(()=>{
        window.scrollTo({
            behavior: "smooth",
            top: this.parentOfftop
        })
       })
    }
  }
};
</script>
<style scoped>
.container {
  background: var(--bg-home-color);
  padding-bottom: 1.5rem;
  overflow: hidden;
  position: relative;
  z-index: 0;
}
.hierarchy-box{
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
}
.more-project {
  text-align: center;
  color: #999;
  font-size: 0.32rem;
  line-height: 0.64rem;
  margin: 0.213333333rem 0;
}
.container >>> ::-webkit-scrollbar {
    width: 0 !important;
}
.container >>> ::-webkit-scrollbar {
    width: 0 !important;height: 0;
}
.wotaobackground{
    width: 100%;
    z-index: 1;
}
</style>