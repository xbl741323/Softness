
<template>
  <div class="container">
    <div class="about-us-bg">
      <div class="about-us-contain">
        <span class="about-us-title">关于我们</span>
        <div class="about-desc">
          卧涛(长沙)科技，拥有项目申报、知识产权、工商财税、软件开发等领域专业从业资质与经验沉淀，是湖南省一站式科技企业服务公司。拥有团队成员300多名，主要承担科技口、经信口、发改口等归口项目规划、申报与再申报!
					承担全省各地科技企业项目材料撰写以及各地政策奖补信息咨询等。主要涉及高新技术企业、专精特新、企业技术中心、科技型中小企业、发明专利甲请、商标汪册、软著申请...
					我们一直秉承“真诚合作-战略共赢”的原则，全新全意为科技企业服务，共创价值!
        </div>
        <div class="about-img-list">
          <img
            v-for="(item, index) in introList"
            :src="item"
            :key="index"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="core-advantage"></div>
    <div class="qyry">
      <div class="qyry_top">
        <span>荣誉资质</span>
        <span>让价值共享，记录企业发展脚步</span>
      </div>
      <div class="rolling">
        <vue-seamless-scroll
          :data="swiperList"
          :class-option="optionLeft"
          class="seamless-warp"
        >
          <ul class="item">
            <li v-for="(item, index) in swiperList" :key="index">
              <img :src="item" class="swiper-img-sty" />
            </li>
          </ul>
        </vue-seamless-scroll>
      </div>
    </div>
    <!-- 公司地址信息 -->
    <div class="company">
      <div class="company-contain">
      <div class="company-left">
         <div class="ask-contain">
           <span>免费咨询</span>
           <img class="ask-img" :src="askUrl" alt="">
         </div>
         <div class="location-left-contain">
            <div class="location-left-item" v-for="(item,index) in locationList" :key="index">
               <img class="location-img" :src="item.imgUrl" alt="">
               <span></span>
               <span>{{item.title}}</span>
            </div>
         </div>
      </div>
      <img :src="locationUrl" alt="" class="company-right">
    </div>
    <div class="listFriendLink_sty" v-if="listFriendLink.length > 0">
          <div>友情链接:</div>
          <div v-for="(item, index ) in listFriendLink" :key="item.id">
            <span @click="openLinks(item.linkUrl)" class="listFriendLink_linkName" @mouseenter="setActive(index)"
              @mouseleave="setActive(-1)" :style="{ 'text-decoration': activeIndex == index ? 'underline' : 'none' }"> {{
                item.linkName
              }}</span>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['listFriendLink'],
  computed: {
    optionLeft() {
      return {
        direction: 2,
        limitMoveNum: 4,
      };
    },
  },
  data() {
    return {
      activeIndex: -1,
      locationList:[
        {
          imgUrl: require("@/assets/images/banner/icon_APP@2x.png"),
          title:'15855199550'
        },
        {
          imgUrl: require("@/assets/images/banner/icon_Co@2x.png"),
          title:'湖南省长沙市岳麓区麓谷大道627号麓谷新长海中心A1栋13楼1301C室'
        }
      ],
      askUrl: require("@/assets/images/banner/ask-lang.png"),
      locationUrl: require("@/assets/images/banner/location.png"),
      introList: [
        require("@/assets/images/banner/env-one.png"),
        require("@/assets/images/banner/env-two.png"),
        require("@/assets/images/banner/env-three.png"),
      ],
      swiperList: [
        require("@/assets/images/project/pic_certificate1.png"),
        require("@/assets/images/project/pic_certificate2.png"),
        require("@/assets/images/project/pic_certificate3.png"),
        require("@/assets/images/project/pic_certificate4.png"),
      ],
    };
  },
  mounted() {
  },
  methods: {
    openLinks(url) {
      window.open(url, '_blank')
    },
    setActive(index) {
      this.activeIndex = index
    },
  },
};
</script>

<style scoped>

.container {
  background: #f2f4f5;
  width: 100%;
  overflow: hidden;
}
.about-us-contain {
  width: 1116px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.about-us-title {
  font-size: 17px;
  font-weight: bold;
  margin-left: 50px;
}
.about-desc {
  width: 1019px;
  margin: 40px 0 20px 90px;
	font-size: 17px;
	line-height: 26px;
}
.about-img-list {
  display: flex;
  justify-content: center;
  align-items: center;
}

.about-img-list img {
  width: 348px;
  height: 172px;
  margin-right: 36px;
}
.about-img-list>img:last-child{
  margin-right: 0;
}
.about-us-bg {
  width: 100%;
  height: 604px;
  background-image: url("@/assets/images/banner/pic_about_us@2x.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
}
.core-advantage {
  margin: 80px auto;
  width: 1129px;
  height: 609px;
  background-image: url("@/assets/images/banner/pic-core-advantage@2x.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.qyry {
  background-image: url("@/assets/images/banner/pic-scroll.png");
  width: 100%;
  height: 433px;
}
.qyry_top {
  width: 1150px;
  margin: 0 auto;
  padding: 64px 0 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #ffffff;
}
.qyry_top>span:nth-of-type(1){
  font-weight: bold;
}
.qyry_top > span {
  margin-bottom: 6px;
}
.rolling {
  margin: 0 auto;
  width: 1150px;
}
.rolling .seamless-warp {
  overflow: hidden;
  width: 1150px;
  padding: 0 0 20px 0;
}
.rolling .seamless-warp .item {
  width: 1200px;
  padding: 0;
  list-style-type: none;
}
.rolling .seamless-warp .item li {
  display: inline;
  margin-right: 25px;
}
.swiper-img-sty {
  width: 275px;
  height: 183px;
}
.foot-img {
  width: 100%;
  height: 382px;
}
.company{
  width: 1200px;
  background: #ffffff;
  margin: 40px auto;

}
.company-contain{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ask-contain{
  font-weight: bold;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  color: #333333;
  letter-spacing: 1.8px;
}
.ask-img{
  width: 78px;
  height: 6px;
  margin-top: 3px;
}
.company-left{
  width: 600px;
  height: 300px;
  margin-left: 32px;
  margin-top: 30px;
}
.company-right{
  width: 437px;
  height: 262px;
  margin-right: 20px;
}
.location-left-contain{
  margin-top: 46px;
  color: #333333;
}
.location-left-item{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 18px;
}
.location-left-item>span:nth-of-type(1){
  display: inline-block;
  width: 1px;
  height: 21px;
  opacity: 0.3;
  background: #000000;
  margin: 0 17px;
}
.location-left-item>span:nth-of-type(2){
  font-size: 18px;
}
.location-img{
  width: 28px;
  height: 28px;
}

.listFriendLink_sty {
  color:#666;
  background: #ffffff;
  width: 1200px;
  line-height: 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-left: 10px;
  margin: 0 auto;
  cursor: pointer;
}

.listFriendLink_sty div {
  font-size: 14px;
  margin-right: 20px;
}

.listFriendLink_sty div:nth-child(1) {
  color: #000 !important;
  font-weight: 700;
  margin: 0;
}

.listFriendLink_sty div:nth-child(2) {
  margin: 0 20px;
}

.listFriendLink_linkName:hover {
  text-decoration: underline;
}
</style>
