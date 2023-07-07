<template>
  <div class="service">
    <div class="header_top">
      <!-- 改为标签跳转 -->
      <router-link  to>
        <i class="back" @click="$router.back(-1)"></i>
      </router-link>
      知产服务
    </div>
    <swiper :type="8" :staticImg="staticImg" />
    <!-- 专利 -->
    <div class="box" id="zhuanli">
      <div class="title">
        <img src="@/assets/images/zscq/icon_zhuanli_zhichan@3x.png" alt="" />
        <h3 class="patent_title">专利服务</h3>
      </div>
      <div class="list">
        <div class="listdemo">
          <div class="property_item" v-for="(item, index) in patentList" :key="index" @click="goDetail(item)">
            <div class="txt-pos">
              <div style="display:flex"> 
                <h3  :class="['desc',index==0 || index==1 || index==2 || index==3 ?'super-long':'']">{{ item.name }}</h3>
               <img v-if="index==0 || index==1 || index==2 || index==3 " class="hot-ico" src="@/assets/images/zscq/hot_icon@2x.png" alt="" />
              </div>              
              <p class="slogan">{{ item.slogan }}</p>
            </div>
            <div class="price-show">
              <span v-if="item.nowFee">￥{{ item.nowFee | receivePrice }}</span>
              <span v-else>面议</span>              
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 商标 -->
    <div class="box trademark_box" id="shangbiao">
      <div class="title">
        <img src="@/assets/images/zscq/icon_shangbiao_zhichan@3x.png" alt="" />
        <h3 class="trademark_title">商标服务</h3>
      </div>
      <div class="list">
        <div class="listdemo">
          <div class="property_item" v-for="(item, index) in tradeList" :key="index" @click="goDetail(item)">
            <div class="txt-pos">
              <div style="display:flex"> 
                <h3 class="desc">{{ item.name }}</h3>
               <img v-if="index==0 || index==1 " class="hot-ico" src="@/assets/images/zscq/hot_icon@2x.png" alt="" />
              </div>              
              <p class="slogan">{{ item.slogan }}</p>
            </div>
            <div class="price-show">
              <span v-if="item.nowFee">￥{{ item.nowFee | receivePrice }}</span>
              <span v-else>面议</span>              
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="borderbottom"></div>
    <!-- 版权 -->
    <div class="box trademark_box" id="banquan">
      <div class="title">
        <img src="@/assets/images/zscq/icon_banquan_zhichan@3x.png" alt="" />
        <h3>版权服务</h3>
      </div>
      <div class="list">
        <div class="listdemo">
          <div class="property_item" v-for="(item, index) in copyList" :key="index" @click="goDetail(item)">
            <div class="txt-pos">
              <h3 class="desc">{{ item.name }}</h3>     
              <p class="slogan">{{ item.slogan }}</p>
            </div>
            <div class="price-show">
              <span v-if="item.nowFee">￥{{ item.nowFee | receivePrice }}</span>
              <span v-else>面议</span>              
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box trademark_box" id="banquan">
      <div class="title">
        <img src="@/assets/images/zscq/icon_qita@2x.png" alt="" />
        <h3>其他服务</h3>
      </div>
      <div class="list">
        <div class="listdemo">
          <div class="property_item" v-for="(item, index) in otherList" :key="index" @click="goDetail(item)">
            <div class="txt-pos">
              <h3 class="desc">{{ item.name }}</h3>     
              <p class="slogan">{{ item.slogan }}</p>
            </div>
            <div class="price-show">
              <span v-if="item.nowFee">￥{{ item.nowFee | receivePrice }}</span>
              <span v-else>面议</span>              
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 服务流程 -->
    <div class="process_box">
      <!-- <img src="@/assets/images/zscq/img_liucheng_zhuanli.png" alt="" /> -->
    </div>
  </div>
</template>

<script>
import Swiper from "@/components/home/topComponents/Swiper";
import { receivePrice } from "@/utils/price"
import { getPropertyList } from "@/api/property";
export default {
  layout: "footer",
  components: {
    Swiper,
  },
  filters: {   
    receivePrice(price){
      return receivePrice(price,1)
    },
  },
  head() {
    return {
      title: "申请专利、注册商标、版权登记-找知产代理就上卧涛网！",
      meta: [
        { charset: "utf-8" },
        {
          name: "keywords",
          content: "申请专利,注册商标,版权登记",
        },
        {
          hid: "description",
          name: "description",
          content:
            "卧涛网提供注册商标、申请专利、版权/著作权登记等一站式知识产权服务，资深审查专家团队，专业顾问一对一在线服务。找知产代理就上卧涛网，全国免费咨询热线：400-0507-580！",
        },
      ],
    };
  },
  data() {
    return {
      imgPath: process.env.CDN_BASE_URL,
      patentLimited: [],
      patentAll: [],
      patentList: [],
      tradeLimited: [],
      tradeAll: [],
      tradeList: [],
      copyLimited: [],
      copyAll: [],
      copyList: [],
      otherList:[],
      flag: false,
      staticImg: "/_nuxt/assets/images/zscq/banner_zscq _iphone@3x.png",
    };
  },
  methods: {
    goDetail(item) {
      window.open("/zhichan/" + item.id + item.type, "_self");
    },
    getData() {
      getPropertyList().then((res) => {
          this.patentList = res.data[1].children;
          this.tradeList = res.data[2].children;
          this.copyList = res.data[3].children;
          this.otherList = res.data[4].children;
          console.log(otherList,"otherList")
          // 滚动到相应位置
           if(sessionStorage.getItem('number')){
            if(sessionStorage.getItem('number')==1){
              var el = document.getElementById('zhuanli');
              this.$nextTick(()=>{
                    window.scrollTo({top:el.offsetTop-75});
              })
            }else if(sessionStorage.getItem('number')==2){
                var el = document.getElementById('shangbiao');
                this.$nextTick(()=>{
                    window.scrollTo({top:el.offsetTop-75});
                })
            }else if(sessionStorage.getItem('number')==3){
                var el = document.getElementById('banquan');
                this.$nextTick(()=>{
                      window.scrollTo({top:el.offsetTop-75});
                })
            }   
          }
        })
        .catch((err) => {
          return err;
        });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.getData();
    // this.watchscroll();
  },
  beforeDestroy(){
    sessionStorage.removeItem('number')
  }
};
</script>

<style scoped>
.service * {
  box-sizing: border-box;
}
.service {
  padding-top: 1.17333333333rem;
  padding-bottom: 1.12rem;
  background: #F4F6F8;
}
.header_top {
  position: fixed;
  top: 0;
  width: 100%;
  height: 1.17333333333rem;
  font-size: 0.42666666666rem;
  line-height: 1.17333333333rem;
  padding: 0 0.42666666666rem;
  color: #545454;
  z-index: 12;
  background: #ffffff;
  text-align: center !important;
}
.borderbottom {
  width: 100%;
  height: 4px;
  background: #f4f4f4;
}
.desc {
  max-width: 80%;
  font-size: .373333rem;
  font-family: Source Han Sans CN;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right:.1rem;
}
.super-long{
  max-width: 60% !important;
}
.slogan{
  color: #999;
  font-size: .26666667rem;
  margin-bottom: .26666667rem;
}
.txt-pos{
  width: 65%;
  margin-left: .32rem;  
  margin-top: .26666667rem;
}
.txt-pos p{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 94px;
}
.hot-ico{
  width: .746666667rem;
  height: .42666667rem;
}
.price-show{
  position: absolute;
  right: .32rem;
  line-height: 1.44rem;
  color: #FF6D27;
  font-family: Source Han Sans CN;
  font-weight: 600;
}
.back {
  float: left;
  margin-top: 0.42666666666rem;
  content: "";
  /* display: inline-block; */
  height: 0.32rem;
  width: 0.32rem;
  border-width: 0 0 0.02666666666rem 0.02666666666rem;
  border-color: #545454;
  border-style: solid;
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
}
.banner_img {
  display: flex;
}
.banner_img img {
  width: 100%;
  height: 3.62666666666rem;
}
.box {
  padding: 0.32rem;
  padding-bottom: 0;
}
.box .title {
  text-align: left;
  font-size: 0.426666666667rem;
  font-weight: 600;
  font-family: Source Han Sans CN;
  margin-bottom: 0.29333333333rem;
  display: flex;
  align-items: center;
  padding: 0 0.10666666666rem;
}
.box .title img {
  width: 0.42666666666rem;
  height: 0.42666666666rem;
  margin-right: 0.21333333333rem;
}
.box .title i {
  display: inline-block;
  width: 0.16rem;
  height: 0.42666666666rem;
  background-color: #36a6fe;
  margin-right: 0.32rem;
}
.box .title h3 {
  font-weight: bold;
  color: #333;
}
.list {
  display: flex;
  flex-wrap: wrap;
  position: relative;
}
.listdemo {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}
.item {
  width: 50%;
  height: calc(25vw - 0.16rem);
  padding: 0.10666666666rem 0.10666666666rem;
}
.property_item {
  width: 48.5%;
  height: 1.44rem;
  margin-bottom: .32rem;
  position: relative;
  background: #fff;
  border-radius: .2rem;
  display: flex;
}
.property_item:nth-child(odd) {
  margin-right: 1.5%;
}
.property_item:nth-child(even) {
  margin-left: 1.5%;
}
.item-main {
  height: 100%;
  text-align: center;
  background: #fff;
  position: relative;
}
.item-main h3 {
  font-size: 0.29333333333rem;
  text-align: left;
}
.item-main img {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.opacity img {
  opacity: 1;
}
.item_length h3 {
  margin-left: 10px;
  padding-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.length h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.copyright_box .item-main {
  background-image: url("~@/assets/images/zscq/bg_zhuanli.png");
}
.trademark_item {
  width: 33.3%;
  height: 1.81333333333rem;
  padding: 0.10666666666rem;
}
.trademark_item .item-main h3 {
  text-align: center;
}
.trademark_item .item-main img {
  position: static;
  margin-top: 0.21333333333rem;
}
.point_box {
  display: flex;
  align-items: center;
  background-color: #eff2f3;
  width: 0.69333333333rem;
  height: 0.69333333333rem;
  position: absolute;
  left: -0.24rem;
}
.point {
  background-color: #36a6fe;
  width: 0.48rem;
  height: 0.48rem;
  border-radius: 100%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.32rem;
}
.lastItem {
  border: none;
  padding-bottom: 0px;
}
.process img {
  width: 100%;
}
.process_box {
  padding-bottom: 0.10666666666rem;
  width: 100%;
  height: 12.5066666667rem;
  background: url("~@/assets/images/home/fuwu_bg@2x.png") no-repeat
    center/contain;
}
.process_box .title h3 {
  font-weight: bold;
  color: #333333;
}
.bottom {
  width: 100%;
  text-align: center;
  padding-bottom: 0.1333333333rem;
  cursor: pointer;
}
.more {
  color: #a8a8a8;
  font-size: 0.26666666666rem;
  padding-bottom: 0.08rem;
}
.more-down {
  margin-bottom: 0.13333333333rem;
}
.arrow {
  position: absolute;
  color: #a8a8a8;
  display: inline-block;
  content: "";
  width: 0.21333333333rem;
  height: 0.21333333333rem;
  border: solid#666666;
  border-width: 1px 1px 0 0;
  -webkit-transform: translate(0, -50%) rotate(135deg);
  transform: translate(0, -50%) rotate(135deg);
  margin-left: -0.08rem;
}
.arrow-down {
  position: absolute;
  color: #a8a8a8;
  display: inline-block;
  content: "";
  width: 0.21333333333rem;
  height: 0.21333333333rem;
  border: solid#666666;
  border-width: 1px 1px 0 0;
  -webkit-transform: translate(0, -50%) rotate(314deg);
  transform: translate(0, -50%) rotate(314deg);
  margin-left: -0.05333333333rem;
}
.swiperitem {
  width: 88px;
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  background-image: url("~@/assets/images/zscq/bg_zhuanli@3x.png");
}
.swipword {
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  font-family: Hiragino Sans GB;
  font-weight: normal;
  color: #333333;
  opacity: 1;
  transform: translateX(-12px);
}
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
.isShow {
  width: 55px;
  height: 4px;
  background: #a7cfee !important;
}
.notShow {
  width: 55px;
  height: 4px;
  background: #e8e8e8;
}
</style>