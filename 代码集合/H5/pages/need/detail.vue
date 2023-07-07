<template>
  <div :class="['need_detail',needInfo.status==2||needInfo.status == 5?'need_detail_deleted':'']">
    <!-- 页头 -->
    <div class="tab_title">
      <i class="iconfont tab_left" @click="toList">&#xe641;</i>
      <div class="tab_title_sty">
        <span>技术需求详情</span>
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
      <p :class="[colorStatus==true?'complex_sty':'']">
        {{ needInfo.requirementName }}
      </p>
      <div class="title_price" v-show="needInfo.requirementName">
        <span :class="[colorStatus==true?'complex_sty':'']">预算：</span>
        <span :class="[colorStatus==true?'complex_sty':'']" v-if="needInfo.priceType == 1">面议</span>
        <span v-else :class="[colorStatus==true?'complex_sty':'']">
          <span :class="['price_sty',colorStatus==true?'complex_sty':'']" v-if="needInfo.tradePriceMin">{{ needInfo.tradePriceMin|receivePrice }}</span><span :class="['price_sty',colorStatus==true?'complex_sty':'']" v-if="needInfo.tradePriceMax&&needInfo.tradePriceMin">-</span><span :class="['price_sty',colorStatus==true?'complex_sty':'']" v-if="needInfo.tradePriceMax">{{ needInfo.tradePriceMax|receivePrice }}</span>万
        </span>
      </div>
    </div>

    <!-- 已删除 已下架 效果展示 -->
    <div class="deleted_img_sty" v-show="needInfo.status == 2||needInfo.status == 5">
      <img :src="require('~/assets/images/technology/No_content_icon@2x.png')" alt="" />
      <p>您查看的内容已下架，请看看其他产品吧</p>
    </div>

    <div v-show="needInfo.status == 1 || needInfo.status == 3">
      <!-- 技术参数 -->
    <div class="need_params" @click="drawer = true">
      <div class="params_title">
        <span></span>
        <span>技术参数</span>
      </div>
      <div class="params_content">
        <img :src="require('~/assets/images/technology/xianshi.png')" alt="" />
        <div
          class="params_item"
          v-for="(item, index) in drawList"
          :key="index"
        >
          <span>{{ item.title }}</span>
          <span>{{ item.value }}</span>
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
            <span>{{ item.title }}</span>
            <p>{{ item.value }}</p>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 需求描述 -->
    <div class="need_desc">
      <div class="params_title">
        <span></span>
        <span>需求描述</span>
      </div>
      <p class="desc_p_need" v-html="needInfo.requirementDesc"></p>
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
      <!-- <span class="cancel_need_collect" style="color: #FFC426;border-color: #FFC426;" v-if="!isCollect" @click="addCollect">+ 加入收藏</span>
      <span class="active_collect" v-else @click="cancelCollect">
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
import { Toast } from "mint-ui"
import { getNeedDetail } from "@/api/technology"
import axios from 'axios'
export default {
  head () {
      return {
          title: this.requirementName,
          meta: [
              { name:'keywords', content: this.requirementName },
              { hid: 'description', name: 'description', content: this.requirementDesc }
          ]
      }
  },
    async asyncData({query}){
      const res = await axios.get(process.env.ASYNC_DATA_API+'/requirement/getRequirementDetailSeo?id='+query.id);
        if(res.data.data.requirementDesc && res.data.data.requirementDesc.length>200){
               res.data.data.requirementDesc = res.data.data.requirementDesc.substring(0,200)
      }
      if(res.data.data){
        return{
          requirementName:res.data.data.requirementName,
          requirementDesc:res.data.data.requirementDesc
        }
      }
    },
  data() {
    return {
      colorStatus:false,
      metaDesc:"",
      accountId:"",
      isCollect:false,
      needInfo:{},
      drawer: false,
      direction: "btt",
      drawList: [
        {
          title: "技术编号：",
          value: "",
        },
        {
          title: "技术类型：",
          value: "",
        },
        {
          title: "行业类型：",
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
        this.$router.push({
            path: '/login'
        })
        return
     }
     let param  ={
        number:this.needInfo.requirementNo,
        type:8,
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
            this.$router.push({
                path: '/login'
            })
            return
        }
        let param  ={
            numbers:[this.needInfo.requirementNo],
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
      getNeedDetail(params).then(res=>{
         this.needInfo = res.data
         this.drawList[0].value = this.needInfo.requirementNo
         this.drawList[1].value = this.needInfo.requirementTypeTxt
         this.drawList[2].value = this.needInfo.industryTxt == ""?"不详":this.needInfo.industryTxt
         this.isCollect = this.needInfo.isCollect == 0?true:false
         this.metaDesc = this.needInfo.requirementDesc.slice(0,200)
         if(this.needInfo.status == 2||this.needInfo.status == 5){
            this.colorStatus = true
         }else if(this.needInfo.status == 1||this.needInfo.status == 3){
            this.colorStatus = false
         }
      })
    },
    toList() {
      this.$router.push({
        path: "/need",
      });
        // this.$router.go(-1)
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
    if(localStorage.getItem('userInfo')){
        var userInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.accountId = userInfo.userId
      }
    this.getDetail()
  }
};
</script>

<style scoped>
.need_detail {
  background: #f4f6f8;
  padding-bottom: 1.7rem;
}
.need_detail_deleted{
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
  height: 2.56rem;
  font-size: 0.4266666666666667rem;
  background: #ffffff;
  opacity: 1;
}
.need_title p {
  font-weight: bold;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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
.price_sty{
  font-size: 0.3733333333333333rem !important;
  font-weight: bold !important;
  color: #fd651c !important;
}
.need_params {
  height: 3.413333333333333rem;
  margin: 0.1333333333333333rem 0;
  padding: 0.2666666666666667rem 0.2666666666666667rem;
  background: #ffffff;
}
.params_title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
  border-radius: 0.1333333333333333rem;
  margin-left: 0.2666666666666667rem;
}
.params_content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.2933333333333333rem;
  height: 1.866666666666667rem;
  background: #f8f8f7;
  opacity: 1;
  border-radius: 0.2666666666666667rem;
}
.params_content img {
  position: absolute;
  right: 0.2133333333333333rem;
  top: 0.0533333333333333rem;
  width: 0.48rem;
}
.params_item {
  width: 2.346666666666667rem;
  display: flex;
  flex-direction: column;
  margin-left: 23px;
}
.params_item > span:nth-of-type(1) {
  font-size: 0.2666666666666667rem;
  color: #8d8d8d;
}
.params_item > span:nth-of-type(2) {
  margin-top: 0.1333333333333333rem;
  display: inline-block;
  width: 2.346666666666667rem;
  height: 0.4266666666666667rem;
  font-size: 0.32rem;
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
.desc_p_need {
  width: 100%;
  margin: 0.2666666666666667rem 0;
  font-size: 0.3733333333333333rem;
  color: #656565;
}
.desc_p_need >>> span{
  white-space: normal !important;
}
.desc_p_need .tit_tm{
  white-space: normal !important;
}
.desc_p_need >>> .tit_tm{
  white-space: normal !important;
}
.img_content {
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
  right: 0.5066666666666667rem;
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
}
.drawer_sty img {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  width: 0.5333333333333333rem;
}
.params_main {
  margin: 0.2666666666666667rem 0;
  font-size: 0.3733333333333333rem;
  color: #656565;
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
  font-size: 0.3733333333333333rem;
  color: #656565;
  margin-bottom: 0.2666666666666667rem;
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
.active_collect{
  background: linear-gradient(126deg, #FFC426 0%, #FFAE26 100%) !important;
  color: #FFFFFF !important;
  border: none !important;
  opacity: 1;
}
.cancel_need_collect{
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