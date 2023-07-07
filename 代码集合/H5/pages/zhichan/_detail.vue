<template>
  <div class="service" v-if="detailData.status!==2">
    <div class="header_top">
      <i class="back" @click="goBack()"></i>知产服务
    </div>
    <div class="main">
      <div class="main-content">
        <ul :class="[fixed == true ? 'right-fixed' : '']">
          <li
            v-for="(d, i) in tab"
            :key="i"
            @click="changeTab(d)"
            :class="[d.id == activeId ? 'choosed' : '']"
            style="position: relative"
          >
            <p>{{ d.name }}</p>
            <p :class="[d.id == activeId ? 'borderbottom' : '']"></p>
          </li>
        </ul>
      </div>
      <div class="top">
        <div class="top-main">
            <div class="top-title">
              <h3>{{ detailData.name }}</h3>
              <span>{{ detailData.slogan }}</span>
            </div>
        </div>
      </div>
      <div class="price-box">
        <div class="price-show">
          <span class="symbol">￥</span>
          <h3>{{ showPrice }}</h3>
          <span class="original-price" v-if="detailData.previousFee">￥{{detailData.previousFee | receivePrice}}</span>
        </div>     
        <div class="pro-label">
          <span>快速响应</span><span>专业代理</span><span>品质服务</span><span>无忧售后</span>
        </div>    
      </div>
      <div v-for="(d, i) in tab" :key="i" class="content-box">
        <div v-html="d.content" :id="d.id" class="m-html"></div>
      </div>
    </div>
    <!-- 收藏按钮 -->
    <div class="collect_btn">
      <span class="cancel_result_collect" style="color: #FFC426;border-color: #FFC426;" v-if="!isCollect" @click="addCollect">+ 加入收藏</span>
      <span class="active_collect" v-else  @click="cancelCollect">
        <i class="el-icon-check" style="margin-right:4px;"></i>
        收藏成功
        </span>
      <span v-if="detailData.nowFee && detailData.isOnline == 0" @click="showOrder = true">立即下单</span>
      <span v-else @click="showMeiqia()">立即咨询</span>
    </div>
    <div class="pop-order">
      <mt-popup
        v-model="showOrder"
        position="bottom">
        <div class="bottom-order">
          <img class="close-ico" :src="require('~/assets/images/zscq/close_icon@2x.png')" @click="closePop" alt="" />
          <div class="bottom-price">
            <b v-if="detailData.feeType == 2">官费价格</b>
            <b v-else>服务价格</b>
            <span class="bottom-symbol">￥</span>
            <b>{{ detailData.nowFee | receivePrice }}</b>
            <span v-if="detailData.previousFee" class="original-price">￥{{detailData.previousFee | receivePrice}}</span>
          </div>
          <div class="choose-fee" @click="feeStandard" v-if="detailData.feeType != 2 && detailData.hasPublicExpense ==0">
            <h3>官费代缴</h3>
            <div class="circle">?</div>
          </div>
          <div class="fee-type" v-if="detailData.feeType != 2 && showFee">
            <ul>
              <li :class="['fee-type-item',index == nowIdx ?'choosed-type':'']" v-for="(item, index) in detailData.governmentFeeTypeList" :key="index" @click="chooseType(item,index)">
                <div class="type-block">
                  <p>{{ item.typeName }}</p>
                  <p>￥{{ item.typeFee | receivePrice }}</p>
                </div>
                <img v-if="index == nowIdx" class="check-ico" :src="require('~/assets/images/zscq/duihao@2x.png')" alt="" />
              </li>
            </ul>
          </div>
          <div class="fee-num">
            <h3>数量</h3>
            <div class="choose-num">
              <span @click="minusNum">
                <img class="alg-sign" :src="require('~/assets/images/zscq/jian_icon@2x.png')" alt="" />
              </span>
              <span>
                <input class="input-fee-num" type="number" @blur="searchValue" maxlength="99" v-model="feeNum"/>
              </span>
              <span @click="addNum">
                <img class="alg-sign" :src="require('~/assets/images/zscq/jia_icon@2x.png')" alt="" />
              </span>
            </div>
          </div>
          <div class="confirm-btn" @click="submitOrder">确定</div>
        </div>
      </mt-popup>
    </div>
  </div>
  <div class="service" v-else>
     <div class="header_top">
      <i class="back" @click="goBack()"></i>
      官费收费标准
    </div>
    <div class="deleted_img_sty" v-if="!collectStatus">
        <img :src="require('~/assets/images/technology/No_content_icon@2x.png')" alt="" />
        <p>您查看的内容已下架，请看看其他产品吧!</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { receivePrice } from "@/utils/price"
import { Toast, MessageBox, Popup, Field } from "mint-ui";
import { addPropertyCollect,cancelPropertyCollect,getPropertyDetail } from "@/api/property";
import { getUserInfo } from '@/api/login'
import { addColl,cancelCollect } from '@/api/collect'
import {toWx} from '@/utils/toWx'
export default {
  head() {
    return {
      title: this.metaTitle,
      meta: [
        { name: "keywords", content: this.metaKeywords },
        { hid: "description", name: "description", content: this.metaDesc },
      ],
    };
  },
  async asyncData({ params, query }) {
    if(process.server){
      let number = params.detail.substr(0, params.detail.length - 1);
      const res = await axios.get(
        process.env.ASYNC_DATA_API + "/property/detail?id=" + number
      );
      console.log(res.data);
      if (res.data.data) {
        return {
          metaTitle: res.data.data.metaTitle,
          metaKeywords: res.data.data.metaKeywords,
          metaDesc: res.data.data.metaDesc,
        };
      } else {
        return {
          metaTitle: "",
          metaKeywords: "",
          metaDesc: "",
        };
      };
    };
  },  
  filters:{
    receivePrice(price){
      return receivePrice(price,1)
    },
  },
  data() {
    return {
      identification:"",
      accountId:"",
      isCollect:false,
      imgPath: process.env.CDN_BASE_URL,
      tab: [],
      detailData: {},
      // leftMenu:[],
      productNo: "",
      activeId: "",
      bannerUrl: "",
      showPrice:'',
      fixed: false,
      showOrder:false,
      showFee:false,
      scrollTop: null,
      nowIdx: 0,
      feeNum:1,
      userInfo:{},
      loginStatus: false,
    };
  },
  computed: {
    info(){
      return this.$store.state.userInfo
    }
  },
  created() {
    this.productNo = this.$route.params.detail.substr(0,this.$route.params.detail.length-1);
    this.getData(true);
  },
  watch: {
    activeItem(newVal) {
      if (!newVal) return;
      this.activeChild = newVal.child;
    },
  },
  methods: {
    addCollect(){
      if(!localStorage.getItem('userInfo')){
      //  this.$router.push({
      //       path: '/login'
      //   })
      toWx()
        return
      }
      let params = {
          accountId:this.accountId,
          number:this.detailData.number,
          type:1
      }
      addColl(params).then(res=>{
        if(res.code == 0){
           Toast({
                message: "收藏成功！",
                position: "middle",
                duration: 5000,
              });
          this.getData(false)
        }
      })
    },
    cancelCollect(){
      if(!localStorage.getItem('userInfo')){
      //  this.$router.push({
      //       path: '/login'
      //   })
      toWx()
        return
      }
      let params = {
          accountId:this.accountId,
          numbers:[this.detailData.number]
      }
      cancelCollect(params).then(res=>{
        if(res.code == 0){
          Toast({
                message: "取消收藏成功！",
                position: "middle",
                duration: 5000,
              });
          this.getData(false)
        }
      })
    },
    feeStandard(){
      this.$router.push("/standard");
    },
    closePop(){
      this.showOrder = false;
    },
    submitOrder(){
      if(this.loginStatus == true){
          this.$router.push({
            path: '/order/order-pay',
            query:{
              productNum: this.feeNum,
              productId:this.detailData.id,
              type: this.detailData.type,
              orderType: 0,//0-知产 1-项目
              goverFeeType: this.nowIdx,
            }
          })
      }else{
        // this.$router.push({
        //   path: '/login'
        // })
        toWx()
      };
    },
    minusNum(){
      this.feeNum--
      if(this.feeNum<1){
        this.feeNum=1;
        Toast({
          message: '数量不能再减少了',
          position: 'bottom',
          duration: 3000
        });
      }
    },
    addNum(){
      this.feeNum++
      if(this.feeNum>99){
        this.feeNum=99;
        Toast({
          message: '输入数量超出库存',
          position: 'bottom',
          duration: 3000
        });
      }
    },
    searchValue(){
        let reg = /^\+?[0-9][0-9]*$/;
        let regex=/^[0]+/;
        if (!reg.test(this.feeNum)) {
          this.feeNum = 1;
        }
        if (regex.test(this.feeNum)) {
          this.feeNum = this.feeNum.replace(regex,"");
        }
        if(this.feeNum>99){
          this.feeNum=99;
          Toast({
            message: '输入数量超出库存',
            position: 'bottom',
            duration: 3000
          });
        }
    },
    chooseType(item,index){
      this.nowIdx = index;
    },
    //获取页面数据
    getData(viewStatus) {
      getPropertyDetail({ id: this.productNo, browser: viewStatus,accountId:this.accountId }).then((res) => {
        this.detailData = res.data;
        if(res.data.nowFee){
          this.showPrice = res.data.nowFee/100
        } else {
          this.showPrice = '面议'
        }
        if(res.data.governmentFeeTypeList.length>0){
          this.showFee = true;
        }
        this.isCollect = res.data.isCollected == 0?true:false
        this.tab = res.data.labelAndContent; //获取产品详情数据
        this.tab.forEach((item, index) => {
          this.$set(item, "id", "id" + index);
        });
        res.data.governmentFeeTypeList.forEach((i,idx)=>{
          if(i.isDefault == 0){
            this.nowIdx = idx;              
          }
        })
        this.activeId = this.tab[0].id;
      }).catch((err) => {
        return err;
      });
      //用户信息
      getUserInfo().then((res) => {
        if (res.code == 0) {
          this.userInfo = res.data;
          this.loginStatus = true;
        }else{
          this.loginStatus = false;
        }
      });

    },
    changeTab(d) {
      this.activeId = d.id;
      var el = document.getElementById(this.activeId);
      this.$nextTick(() => {
        window.scrollTo({
          behavior: "smooth",
          block: "center",
          top: el.offsetTop - 78,
        });
      });
    },
    showMeiqia() {
      // window.open('https://tb.53kf.com/code/code/0c8e8b081090b185745c9bc98ff4b6cb1/2')
      var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
      _53.push("cmd", "mtalk"); /*开发者文档1.7 主动发起(手机端)*/
      _53.query();
    },
    showSearch() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.scrollTop = scrollTop;
      if (scrollTop > 450) {
        // 当页面滚动到高度300px处，动态绑定class 来设置头部固定定位
        this.fixed = true;
      } else {
        this.fixed = false;
      }
    },
    goBack() {
      history.pushState(null, null, document.URL);
      this.$router.push('/zhichan');
    },
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.goBack, false);
  },
  mounted() {
    if(window.history && window.history.pushState){
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goBack, false);
    }
    if(localStorage.getItem('userInfo')){
      var userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.accountId = userInfo.userId
      }
    if(localStorage.getItem("identification")){
      this.identification = localStorage.getItem("identification")
    }
    this.getData(true);
    window.addEventListener("scroll", this.showSearch);
  },
};
</script>

<style scoped>
.service * {
  box-sizing: border-box;
}
.service {
  width: 100%;
  padding-top: 1.17333333333rem;
  padding-bottom: 1.12rem;
}
.header_top {
  position: fixed;
  top: 0;
  width: 100%;
  height: 1.17333333333rem;
  font-size: 0.42666666666rem;
  line-height: 1.17333333333rem;
  padding: 0 0.64rem;
  color: #545454;
  z-index: 1;
  background: #ffffff;
  text-align: center !important;
}
.contactbtn {
  outline: none;
  width: 2.1333333333rem;
  height: 0.64rem;
  line-height: 0.64rem;
  font-size: 0.32rem;
  background: #36a6fe;
  color: #fff;
  border: none;
  border-radius: 0.4rem;
}
.borderbottom {
  width: 16px;
  height: 2px;
  position: absolute;
  background: #277be3;
  opacity: 1;
  border-radius: 10px;
  left: 50%;
  transform: translateX(-50%);
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
.price-box{
  margin: .32rem 0;
  width: 100%;
  text-align: center;
}
.price-box h3{
  color: #FF6D27;
  font-family: Source Han Sans CN;
  font-size: .53333333333rem;
  font-weight: 600;
}
.symbol{
  font-size: .3733333333333rem;
  color: #FF6D27;
}
.price-show{
  display: flex;
  position: relative;
  margin: 0 .32rem;
}
.price-show > *{
  line-height: 1rem;
  vertical-align:bottom;
}
.pro-label{
  display: flex;
  padding-left: .32rem;
}
.pro-label span{
  width: 1.8666667rem;
  height: .7466666667rem;
  line-height: .7466666667rem;
  font-size: .32rem;
  font-family: Microsoft YaHei;
  color: #ff6900;
  background: #FFECDE;
  margin-right: .26666667rem;
  text-align: center;
  border-radius: 5px;
}
.original-price{
  text-decoration:line-through;
  font-size: .266667rem;
  color: #999;
  margin-left: .1rem;
}
.main {
  width: 100%;
  /* margin-bottom: 16px; */
}
.main-content {
  width: 100%;
  height: 0.85333333333rem;
  background-color: #ffffff;
  text-align: center;
}
.main-content ul {
  display: flex;
  width: 100%;
}
.main-content ul li {
  width: 25%;
  font-size: 0.37333333333rem;
  color: #666666;
  height: 0.85333333333rem;
  line-height: 0.85333333333rem;
  margin: 0 0.4rem;
  text-align: center;
  flex: 1;
}
.choosed {
  color: #36a6fe !important;
}
.top {
  width: 100%;
  margin-top: .05rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.top-main {
  background: url("~@/assets/images/zscq/pic_01@2x.png") no-repeat;
  background-size:100% 5.0666667rem;
  width: 100%;
  height: 5.0666667rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.top-main img {
  width: 1.06666666666rem;
  height: 1.06666666666rem;
  margin-left: 30px;
  margin-right: 0.42666666666rem;
}
.top-box {
  display: flex;
  flex-direction: column;
}
.top-box button {
  outline: none;
  width: 2.98666666666rem;
  height: 0.64rem;
  font-size: 0.32rem;
  background: #36a6fe;
  color: #fff;
  border: none;
  border-radius: 0.4rem;
}
.top-title {
  width: 94%;
  margin-left: 3%;
  text-align: center;
  align-items: center;
  font-family: Source Han Sans CN;
  color: #fff;
}
.top-title h3 {
  width: 100%;
  font-size: 0.8rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.top-title span {
  display: inline-block;
  font-size: 0.32rem;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* margin-left: 12px; */
}
.bg {
  background: #eff2f3;
  height: 0.42666666666rem;
}
.main-box {
  width: 100%;
}
.content-box {
  text-align: center;
  margin-top: .32rem;
}
.right-fixed {
  position: fixed;
  top: 1.17333333333rem;
  width: 100%;
  background: #f5f5f5;
  box-shadow: 0 0.10666666666rem 0.53333333333rem 0 rgba(61, 79, 127, 0.1);
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
.fee-type{
  margin-top: .1rem;
}
.fee-type ul{
  display: inline-block;
  width: 100%;
}
.fee-type-item{
  width: 32%;
  float: left;
  display:table;
  text-align: center;
  color: #333;
  font-family: Source Han Sans CN;
  margin:0 2% .32rem 0;
  height: 1.44rem;
  background: #ECF5FF;
  border-radius: 5px;
  position: relative;
}
.fee-type-item:nth-child(3n+3){
  margin-right: 0 !important;
}
.type-block{
  display:table-cell; 
  vertical-align:middle;
}
.type-block p{
  max-width: 2.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right:.1rem;
}
.choosed-type{
  border: 1px solid #36a6fe;  
  color: #36a6fe;
  background: #fff;
  box-sizing: border-box; 
  -webkit-box-sizing: border-box; 
  -moz-box-sizing: border-box; 
}
.fee-num{
  display: flex;
  align-items:center;
  margin-top: .32rem;
}
.fee-num h3{
  flex: 1;
}
.choose-num{
  display: flex;
  align-items:center;
}
.alg-sign{
  width: .533333333rem;
  height: .533333333rem;
}
.input-fee-num{
  height: .533333333rem;
  line-height: .5333333333rem;
  width: 1.2rem;
  font-size: .426666667rem;
  color: #333;
  border: 0;
  text-align: center;
}
.confirm-btn{
  width: 100%;
  height: 1.066666667rem;
  line-height: 1.066666667rem;
  margin: .32rem 0;
  text-align: center;
  color: #fff;
  background: #36A6FE;
  border-radius: .5333333rem;
  font-size: .4266666666667rem;
}
.check-ico{
  position: absolute;
  width: .64rem;
  height: .586666667rem;
  bottom: 0;
  right: -1px;
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
.cancel_result_collect{
  color: #FFC426 !important;
  border-color: #FFC426 !important;
}
.active_collect{
  background: linear-gradient(126deg, #FFC426 0%, #FFAE26 100%) !important;
  color: #FFFFFF !important;
  border: none !important;
  opacity: 1;
}
.deleted_img_sty{
  padding-top: 1.546666666666667rem;
  padding-bottom: 1.546666666666667rem;
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
.bottom-order{
  margin: .32rem;
  border-radius: 10px 10px 0px 0px;
  position: relative;
}
.close-ico{
  position: absolute;
  width: .53333333rem;
  height: .53333333rem;
  top: 0;
  right: 0;
}
.bottom-price{
  display:flex;
  height: .64rem;
  align-items:baseline;  
}
.bottom-price b, .choose-fee h3, .fee-num h3{
  font-size: .373333333rem;
  font-family: Source Han Sans CN;
}
.choose-fee{
  display: flex;
  align-items: center;
  margin-top: .32rem;
}
.choose-fee h3, .fee-num h3{
  color: #333;
}
.circle{
  width: .37333333333rem;
  height: .3733333333rem;
  font-size: .2rem;
  line-height: .32rem;
  border: 1px solid #36A6FE;
  color: #36A6FE;
  text-align: center;
  border-radius: 50%;
  margin-left: .2rem;
}
.bottom-price>:first-child{
  color: #333;
}
.bottom-price>:nth-child(3){
  color: #FF6D27;
}
.bottom-symbol{
  margin-left: .4rem;
  color: #FF6D27;
}
</style>
<style>
.m-html p {
  width: 100%;
  /* padding: 0 16px; */
}
.m-html p img {
  width: 100% !important;
  height: auto !important;
}
</style>>