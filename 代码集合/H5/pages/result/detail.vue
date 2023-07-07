<template>
  <div :class="['result_detail',resultInfo.status==2||resultInfo.status == 5?'result_detail_deleted':'']">
    <!-- 页头 -->
    <div class="tab_title">
      <i class="iconfont tab_left" @click="toList">&#xe641;</i>
      <div class="tab_title_sty">
        <span>技术成果详情</span>
      </div>
      <img
        class="img_right"
        :src="require('~/assets/images/technology/home.png')"
        @click="toHome"
        alt=""
      />
    </div>

    <!-- 标题 -->
    <div class="need_title">
      <div class="wrapper">
        <span v-show="resultInfo.status == 2||resultInfo.status == 5" class="delete_sty">已下架</span>
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item, index) in banners" :key="index">
            <div class="cut_img">
              <img v-if="item.picture.match(/icon/)" :src="cdnUrl + item.picture" class="swiper-img" alt /> 
              <img v-if="item.picture.match(/images/)" :src="ygUrl + item.picture" class="swiper-img" alt /> 
            </div>
          </swiper-slide>
          <div
            v-if="banners.length != 1"
            class="swiper-pagination"
            slot="pagination"
          ></div>
        </swiper>
      </div>
      <p :class="['need_sty',colorStatus==true?'complex_sty':'']">
        {{ resultInfo.achievementName }}
      </p>
      <p :class="['desc_sty',showStatus==true?'desc_hide_sty':'desc_show_sty',colorStatus==true?'complex_sty':'']">
        {{ resultInfo.technologyAbstract }}
      </p>
      <span v-if="showStatus" :class="['show_all',colorStatus==true?'complex_sty':'']" @click="showStatus = false">全文>></span>
      <div class="title_price" v-show="resultInfo.achievementName">
        <span :class="[colorStatus==true?'complex_sty':'']">预算：</span>
        <span :class="[colorStatus==true?'complex_sty':'']" v-if="resultInfo.priceType == 1">面议</span>
        <span :class="[colorStatus==true?'complex_sty':'']" v-else>{{ resultInfo.tradePrice|receivePrice }}万</span>
      </div>
    </div>
    
    <!-- 已删除 已下架 效果展示 -->
    <div class="deleted_img_sty" v-show="resultInfo.status == 2||resultInfo.status == 5">
      <img :src="require('~/assets/images/technology/No_content_icon@2x.png')" alt="" />
      <p>您查看的内容已下架，请看看其他产品吧</p>
    </div>

    <div v-show="resultInfo.status == 1 || resultInfo.status == 3">
      <!-- 技术参数 -->
    <div class="need_params" @click="drawer = true">
      <div class="params_title">
        <span></span>
        <span>技术参数</span>
      </div>
      <div class="params_content">
        <img :src="require('~/assets/images/technology/xianshi.png')" alt="" />
        <div class="params_item_contain">
          <div
            class="params_item"
            v-for="(item, index) in paramsOne"
            :key="index"
          >
            <span>{{ item.title }}</span>
            <span>{{ item.value }}</span>
          </div>
        </div>
        <div class="params_item_contain">
          <div
            class="params_item"
            v-for="(item, index) in paramsTwo"
            :key="index"
          >
            <span>{{ item.title }}</span>
            <span>{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 技术参数抽屉 -->
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      :with-header="false"
    >
      <div class="drawer_sty">
        <img
          @click="handleClose"
          :src="require('~/assets/images/technology/close.png')"
          alt=""
        />
        <div class="params_title">
          <span></span>
          <span>技术参数</span>
        </div>
        <div class="params_main">
          <div
            v-for="(item, index) in drawList"
            :key="index"
            class="params_main_contain"
          >
            <span>{{ item.title }}：</span>
            <p>{{ item.value }}</p>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 需求描述 -->
    <div class="need_desc">
      <div class="params_title">
        <span></span>
        <span>技术描述</span>
      </div>
      <p class="desc_p" v-html="resultInfo.technicalDesc"></p>
    </div>

    <!-- 交易保障 -->
    <div class="need_pay">
      <div class="params_title">
        <span></span>
        <span>交易保障</span>
      </div>
      <div class="img_content" v-for="(item, index) in imgList" :key="index">
        <img :src="item.imgUrl" alt="" />
        <div class="img_desc">
          <span>{{ item.title }}</span>
          <span>{{ item.desc }}</span>
        </div>
      </div>
    </div>

    <!-- 收藏按钮 -->
    <div class="collect_btn">
      <!-- <span class="cancel_result_collect" style="color: #FFC426;border-color: #FFC426;" v-if="!isCollect" @click="addCollect">+ 加入收藏</span>
      <span class="active_collect" v-else  @click="cancelCollect">
        <i class="el-icon-check" style="margin-right:4px;"></i>
        收藏成功
        </span> -->
      <span @click="showMeiqia">立即咨询</span>
    </div>
    </div>
  </div>
</template>

<script>
import { addColl,cancelCollect } from '@/api/collect'
import { receivePrice } from "@/utils/price"
import { Toast, MessageBox, Popup, Field } from "mint-ui";
import { getResultDetail } from "@/api/technology"
import axios from 'axios'
import {toWx} from '@/utils/toWx'
export default {
  head () {
      return {
          title: this.achievementName,
          meta: [
              { name:'keywords', content: this.achievementName },
              { hid: 'description', name: 'description', content: this.technologyAbstract }
          ]
      }
  },
  async asyncData({query}){
      const res = await axios.get(process.env.ASYNC_DATA_API+'/achievement/getAchievementDetailSeo?id='+query.id);
      if(res.data.data){
        console.log(res.data.data,"res.data.data")
        return{
          achievementName:res.data.data.achievementName,
          technologyAbstract:res.data.data.technologyAbstract
        }
      }
    },
  data() {
    return {
      colorStatus:false,
      isCollect:false,
      accountId:"",
      id:"",
      cdnUrl: process.env.CDN_BASE_URL,
      // cdnUrl: '//static.wotao.com/',
      ygUrl:"//static.yagu.cn/",
      resultInfo:{},
      showStatus:false,
      desc:"",
      drawer: false,
      direction: "btt",
      banners: [],
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        loop: false,
        observer: true,
        observeParents: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      },
      drawList: [],
      paramsOne: [
        {
          title: "技术编号",
          value: "",
        },
        {
          title: "交易方式",
          value: "",
        },
        {
          title: "成 熟 度",
          value: "",
        },
      ],
      paramsTwo: [
        {
          title: "技术类型",
          value: "",
        },
        {
          title: "行业类型",
          value: "",
        },
        {
          title: "所 在 地",
          value: "",
        },
      ],
      imgList: [
        {
          imgUrl: require("~/assets/images/technology/fuwu_01.png"),
          title: "专业多对一服务",
          desc: "多对一即时咨询服务，专业领域顾问，至少两年以上从业经验。",
        },
        {
          imgUrl: require("~/assets/images/technology/fuwu_02.png"),
          title: "全程透明化操作",
          desc: "服务产品化定制规范，全程可监控，可追溯，业务进度实时跟进。",
        },
        {
          imgUrl: require("~/assets/images/technology/fuwu_03.png"),
          title: "严控风险 安全保障",
          desc: "严格把控业务办理风险，保障业务办理过程安全顺利、平稳进行。",
        },
        {
          imgUrl: require("~/assets/images/technology/fuwu_04.png"),
          title: "一站式企业服务",
          desc: "涵盖企业初创期、成长期、成熟期，满足各类不同业务办理需求。",
        },
      ],
    };
  },
  created(){
    this.id = this.$route.query.id
  },
  filters:{
    receivePrice(price){
      return receivePrice(price,2)
    },
  },
  methods: {
    addCollect(){
     if(!localStorage.getItem('userInfo')){
        // this.$router.push({
        //     path: '/login'
        // })
        toWx()
        return
     }
     let param  ={
        number:this.resultInfo.achievementNo,
        type:7,
        accountId:this.accountId
      }
      addColl(param).then(res=>{
        if(res.code == 0){
           Toast({
                message: "收藏成功！",
                position: "middle",
                duration: 5000,
              });
          this.isCollect = true
        }
      })
    },
    cancelCollect(){
        if(!localStorage.getItem('userInfo')){
            // this.$router.push({
            //     path: '/login'
            // })
            toWx()
            return
        }
        let param  ={
            numbers:[this.resultInfo.achievementNo],
            accountId:this.accountId
        }
      cancelCollect(param).then(res=>{
        if(res.code == 0){
          Toast({
                message: "取消收藏成功！",
                position: "middle",
                duration: 5000,
              });
          this.isCollect = false
        }
      })
    },
    getDetail(){
      let params = new FormData()
      params.append('id',this.id)
      params.append('accountId',this.accountId)
      getResultDetail(params).then(res=>{
         this.drawList = []
         this.resultInfo = res.data
         if(this.resultInfo.status==2||this.resultInfo.status==5){
           this.banners = [this.resultInfo.coverUrls[0]]
           this.colorStatus = true
         }else if(this.resultInfo.status==1||this.resultInfo.status==3){
           this.banners = this.resultInfo.coverUrls
           this.colorStatus = false
         }
         this.paramsOne[0].value = this.resultInfo.achievementNo
         this.paramsOne[1].value = this.resultInfo.tradeTypeTxt
         this.paramsOne[2].value = this.resultInfo.maturityTxt
         this.paramsTwo[0].value = this.resultInfo.technologyTypeTxt
         this.paramsTwo[1].value = this.resultInfo.industryTxt !== ""?this.resultInfo.industryTxt:"不详"
         this.paramsTwo[2].value = this.resultInfo.areaTxt
         this.drawList = this.paramsOne.concat(this.paramsTwo)
         this.desc = this.resultInfo.technologyAbstract // 控制显示有问题
         this.showStatus = this.desc.length > 87? true:false
         console.log(this.desc.length,"输出字符串十里香！")
         this.isCollect = this.resultInfo.isCollect == 0?true:false
      })
    },
    toList() {
      this.$router.push({
        path: "/result",
      });
      //  this.$router.go(-1)
    },
    toHome() {
      this.$router.push({
        path: "/",
      });
    },
    handleClose() {
      this.drawer = false;
    },
    showMeiqia() {
      var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
      _53.push("cmd", "mtalk");
      /*开发者文档1.7 主动发起(手机端)*/ _53.query();
    },
  },
  mounted(){
    console.log(this.$refs.desc)
    if(localStorage.getItem('userInfo')){
        var userInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.accountId = userInfo.userId
      }
    this.getDetail()
  }
};
</script>

<style scoped>
.result_detail {
  background: #f4f6f8;
  position: relative;
  padding-bottom: 1.7rem;
}
.result_detail_deleted{
  background: #ffffff !important;
}
.tab_title {
  height: 1.173333333333333rem;
  background: #ffffff;
  color: #36a6fe;
  font-size: 0.42666666667rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f4f6f8;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.03);
}
.tab_title_sty {
  height: 100%;
  position: relative;
  color: #363636;
  font-size: 0.4266666666666667rem;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tab_left {
  margin-left: 0.42666666667rem;
  color: #363636;
}
.img_right {
  width: 0.4266666666666667rem;
  color: #363636;
  margin-right: 0.4rem;
}
.need_title {
  width: 100%;
  padding: 0.2666666666666667rem 0.2666666666666667rem;
  font-size: 0.4266666666666667rem;
  background: #ffffff;
  opacity: 1;
}

.title_price {
  margin-top: 0.2666666666666667rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.title_price span {
  font-size: 0.32rem;
  color: #656565;
}
.title_price > span:nth-of-type(2) {
  font-size: 0.3733333333333333rem;
  font-weight: bold;
  color: #fd651c;
}
.need_params {
  height: 6.053333333333333rem;
  margin: 0.1333333333333333rem 0;
  padding: 0.2666666666666667rem 0.2666666666666667rem;
  background: #ffffff;
}
.params_title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.3733333333333333rem;
}
.params_title > span:nth-of-type(1) {
  display: inline-block;
  width: 0.1066666666666667rem;
  height: 0.48rem;
  background: #36a6fe;
  opacity: 1;
  border-radius: 0.1066666666666667rem;
}
.params_title > span:nth-of-type(2) {
  display: inline-block;
  height: 0.48rem;
  color: #333333;
  font-size: 0.3733333333333333rem;
  font-weight: bold;
  opacity: 1;
  border-radius: 4px;
  margin-left: 0.2666666666666667rem;
}
.params_content {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.2933333333333333rem;
  padding: 0.2666666666666667rem 0 0 0;
  height: 4.533333333333333rem;
  background: #f8f8f7;
  opacity: 1;
  border-radius: 0.2666666666666667rem;
  flex-wrap: wrap;
}
.params_content img {
  position: absolute;
  right: 8px;
  top: 0.0533333333333333rem;
  width: 0.48rem;
}
.params_item_contain {
  display: flex;
  flex-direction: column;
}
.params_item {
  width: 3.466666666666667rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0px 0.4rem 0.2rem 23px;
}
.params_item > span:nth-of-type(1) {
  font-size: 0.2666666666666667rem;
  color: #8d8d8d;
}
.params_item > span:nth-of-type(2) {
  margin-top: 0.1rem;
  display: inline-block;
  width: 100%;
  height: 0.6rem;
  font-size: 0.3733333333333333rem;
  color: #333333;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.need_desc {
  margin: 0.1333333333333333rem 0;
  padding: 0.2666666666666667rem 0.2666666666666667rem;
  background: #ffffff;
}
.need_pay {
  margin: 0.1333333333333333rem 0;
  padding: 0.2666666666666667rem 0.2666666666666667rem;
  background: #ffffff;
}
.need_sty {
  margin-top: 0.32rem;
  font-weight: bold;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.desc_sty {
  margin-top: 0.1333333333333333rem;
  font-size: 0.32rem;
  color: #656565;
}
.desc_hide_sty{
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.desc_show_sty{
  display:flex;
}
.desc_p {
  width: 100%;
  margin: 0.2666666666666667rem 0;
  font-size: 0.3733333333333333rem;
  color: #656565;
}
.desc_p >>> span{
  width: 100% !important;
  white-space: normal !important;
}
.desc_p .tit_tm{
  width: 100% !important;
  white-space: normal !important;
}
.desc_p >>> .tit_tm{
  width: 100% !important;
  white-space: normal !important;
}
.img_content {
  width: 100%;
  position: relative;
  height: 2.24rem;
  margin-top: 0.2666666666666667rem;
}
.img_content img {
  position: absolute;
  width: 100%;
  height: 2.24rem;
  top: 0;
  right: 0;
}
.img_content .img_desc {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 6.08rem;
  top: 0.4rem;
  right: 0.5066666666666667em;
}
.img_desc > span:nth-of-type(1) {
  font-size: 0.3733333333333333rem;
  font-weight: bold;
  color: #333333;
}
.img_desc > span:nth-of-type(2) {
  margin-top: 0.0533333333333333rem;
  font-size: 0.32rem;
  color: #656565;
}
.collect_btn {
  width: 100%;
  position: fixed;
  height: 1.653333333333333rem;
  margin-top: 0.1333333333333333rem;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  box-shadow: -3px -3px 4px rgba(0, 0, 0, 0.03);
}
.collect_btn span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.453333333333333rem;
  height: 0.9066666666666667rem;
  color: #999999;
  background: #ffffff;
  border: 1px solid #999999;
  opacity: 1;
  border-radius: 0.9066666666666667rem;
  font-size: 0.3733333333333333rem;
}
.collect_btn > span:nth-of-type(2) {
  margin-left: 0.2933333333333333rem;
  background: #36a6fe;
  border: 1px solid #36a6fe;
  color: #ffffff;
}
.drawer_sty {
  position: relative;
  padding: 0.4rem 0.2666666666666667rem;
  padding-bottom: 0;
}
.drawer_sty img {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  width: 0.5333333333333333rem;
}
.params_main {
  margin: 0.2rem 0;
  height: 4.5rem;
  padding-bottom: 1rem;
  font-size: 0.3733333333333333rem;
  color: #656565;
  overflow: scroll;
}
.params_main div {
  margin-bottom: 0px;
  font-size: 0.3733333333333333rem;
  color: #656565;
}
.params_main span {
  text-align: left;
  display: inline-block;
  width: 1.893333333333333rem;
}
.params_main p {
  color: #656565;
  margin-bottom: 0.2rem;
  font-size: 0.3733333333333333rem;
}
.params_main_contain {
  display: flex;
}
.params_main_contain span{
  display: inline-block;
  flex: 1;
  font-size: 0.3733333333333333rem;
}
.params_main_contain p{
  flex: 4;
  font-size: 0.3733333333333333rem;
}
.wrapper {
  width: 100%;
  height: 5.866666666666667rem;
  position: relative;
  overflow: hidden;
}
.delete_sty{
  display: inline-block;
  width: 2.133333333333333rem;
  height: 1.066666666666667rem;
  text-align: center;
  line-height: 1.066666666666667rem;
  background: #503A3A;
  color: #FFFFFF;
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  opacity: 0.78;
  border-radius: 0.1333333333333333rem;
}
.cut_img {
  width: 100%;
  height: 5.866666666666667rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.deleted_img_sty{
  padding-top: 1.546666666666667rem;
  width: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #F4F6F8;
}
.deleted_img_sty img{
  width: 3.253333333333333rem;
  height: 2.986666666666667rem;
}
.deleted_img_sty p{
  font-size: 0.3733333333333333rem;
  color: #8D8D8D;
}
.swiper-img {
  width: 100%;
  height: 100%;
}
.wrapper >>> .swiper-pagination-bullets {
  bottom: 0.3rem;
}

.wrapper >>> .swiper-container {
  width: 100%;
  height: 100%;
}

.wrapper >>> .swiper-pagination-bullet-active {
  background: rgb(0, 122, 255);
}
.show_all{
  font-size: 0.32rem;
  color: #36A6FE;
}
.active_collect{
  background: linear-gradient(126deg, #FFC426 0%, #FFAE26 100%) !important;
  color: #FFFFFF !important;
  border: none !important;
  opacity: 1;
}
.cancel_result_collect{
  color: #FFC426 !important;
  border-color: #FFC426 !important;
}
.complex_sty{
  color: #8D8D8D !important;
}
</style>
<style>
.el-drawer {
  border-radius: 0.2666666666666667rem 0.2666666666666667rem 0px 0px;
}
</style>