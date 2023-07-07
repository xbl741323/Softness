<template>
<!-- 排查完成 -->
  <div class="poreview">
    <div class="preview-info">
      <div class="flex back-img">
        <div class="text-flow preview-info-name">{{dataInfo.name}}</div>
        <p class="text-flow preview-info-slogan">{{dataInfo.slogan}}</p>
      </div>
      <div class="flex price"> 
        <div class="price-left">
          <div>
            <span >服务价格</span>
            <span v-if="dataInfo.nowFee" class="nowFee">¥{{Number(dataInfo.nowFee)/100}}</span>
            <span v-else  class="nowFee">面议</span>
            <span v-if="dataInfo.previousFee!=null && dataInfo.previousFee!='0'" style="text-decoration:line-through;margin-left:14px;color:#999;font-size:16px">¥{{Number(dataInfo.previousFee)/100}} </span>
          </div>
          <div class="flex" style="margin-top:23px">
            <span>服务保障</span>
            <div class="flex">
              <div v-for="(item,index) in serversList" :key="index" class="flex service-assurance">
                <img  :src="require('../../../assets/images/ip-servers/icon0'+(index+1)+'_ label_details@3x@2x.png')" alt="">
                <span >{{item}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="bye-btn" v-if="dataInfo.isOnline!=0" style="margin-left:170px;color:#fff;background:#36A6FE">服务咨询</div>
        <div class="flex collection-btn">
          <img src="../../../assets/images/ip-servers/collection_icon@2x.png" alt="">
          <span style="margin-left:5px">收藏</span>
        </div>
      </div>
      <div v-if="dataInfo.governmentFeeTypeList.length>0" class="govermentPrice">
        <div>
          <span>官费代缴</span>
          <div class="govermentPrice-icon">?</div>
        </div>
        <div :title="item.typeName" v-for="(item,index) in dataInfo.governmentFeeTypeList" :key="index" :class="['govermentPrice-item','flex',item.isDefault==1?'':'check-border']">
          <div class="text-flow govermentPrice-title">{{item.typeName}}</div>
          <span style="color:#FD4A1C;">¥{{Number(item.typeFee)/100}}</span>
          <img v-if="item.isDefault==0" src="../../../assets/images/ip-servers/dui_icon@2x.png" >
        </div>               
      </div >
      <div v-if="dataInfo.isOnline===0" class="govermentPrice" style="margin-top:20px;margin-bottom:20px;">
        <span style="margin-right:38px">购买数量</span>
        <div class="count-icon">-</div>
        <div class="count-number">1</div>
        <div class="count-icon">+</div>
      </div>
      <div v-if="dataInfo.isOnline===0" style="margin-left:150px;justify-content:flex-start" class="flex">
        <div class="bye-btn">立即下单</div>
        <div class="bye-btn" style="border: 1px solid #36a6fe;color:#36A6FE;background:#fff">服务咨询</div>
      </div>
    </div>
    <div class="preview-content">
      <div :class="[fixed==true?'position-fixed':'','tab-change']">
        <span
          @click="showTag(index)"
          :class="['tab-name', index == activeIndex ? 'name-color' : '']"
          v-for="(item, index) in dataList"
          :key="index"
          >{{ item.tagName }}</span>
      </div>
      <div v-for="(item, index) in dataList" :key="index">
        <p class="tab-content" v-html="item.tagContent" :id="index"></p>
      </div>
    </div>
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      fixed:"",
      isShowNowFee:false,
      isShowPreviousFee:false,
      tagContent: "",
      dataList: [],
      activeIndex: 0,
      dataInfo:{
        governmentFeeTypeList:[]
      },
      serversList:["全程监督","保障权益","十年行业经验"]
    };
  },
  methods: {
    showTag(index) {
      this.dataList.forEach((item) => {
        item.status = false;
      });
      this.activeIndex = index;
      this.dataList[this.activeIndex].status = true;
      var el = document.getElementById(this.activeIndex);
      this.$nextTick(() => {
        window.scroll({
          behavior: "smooth",
          block: "center",
          top: el.offsetTop - 60,
        });
      });
    },
    showSearch() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 450) {
        // 当页面滚动到高度300px处，动态绑定class 来设置头部固定定位
        this.fixed = true;
      } else {
        this.fixed = false;
      }
    },
  },
  created() {

    this.dataInfo=JSON.parse(this.$route.query.dataInfo);
    console.log(this.dataInfo.previousFee)
    // if(this.$route.query.type!="add"){//不是新建时组件的“价格”需/100
    //   this.dataInfo.nowFee=this.dataInfo.nowFee?Number(this.dataInfo.nowFee)/100:null;
    //   this.dataInfo.previousFee=this.dataInfo.nowFee?Number(this.dataInfo.previousFee)/100:null;
    // }
    // if(this.dataInfo.feeType==2){
    //   if(this.dataInfo.nowFee ){
    //     this.isShowNowFee=true
    //   }
    // }else{
    //   if(this.dataInfo.nowFee && this.dataInfo.previousFee){
    //     this.isShowNowFee=true;
    //     this.isShowPreviousFee=true
    //   }
    // }
    console.log(JSON.parse(this.$route.query.dataInfo),"aads")
    if (this.$route.query.dataList) {
      console.log(this.$route.query.dataList, "ssssss");
      this.dataList = JSON.parse(this.$route.query.dataList);
      if (this.dataList.length !== 0) {
        this.dataList.forEach((item) => {
          item.status = false;
        });
        this.dataList[0].status = true;
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.showSearch);
  },
};
</script>
<style scoped>
.poreview {
  background: #f5f5f5;
  position: relative;
  font-family: Source Han Sans CN;
  color:#333;
  font-size:18px;
  padding-top: 15px;
}
.preview-info-name{
  width:700px;
  font-size: 38px;
  font-family: Source Han Sans CN, Source Han Sans CN-Bold;
  font-weight: 700;
  color: #3985d3;
  margin-left:246px;
}
.preview-info-slogan{
  width: 600px;
  opacity: 1;
  font-size: 20px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  color: #3985d3;
  margin-left:246px;

}
.flex{
  display:flex;
  align-items:center;
  justify-content: space-between;

}
.text-flow{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.govermentPrice{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left:40px;
}
.preview-info{
  background:#fff;
  border-radius:20px;
  width: 960px;
  margin: 0 auto;
  padding-bottom:20px;
  margin-bottom:20px;
}
.nowFee{
  color:#FD4A1C;
  font-size:20px;
  font-weight:600;
  margin-left:36px
}
.back-img{
  /* border-radius:20px; */
  width:100%;
  height:184px;
  background-image: url("../../../assets/images/ip-servers/zhuanli_banner@2x.png");
  background-size:cover;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.price{
  margin:20px;
  width:920px;
  height:108px;
  background:#EFF2F3;
  padding-left:20px;
  border-radius: 10px;
}
.collection-btn{
  width:88px;
  height:40px;
  border:1px solid #36A6FE;
  border-radius: 5px;
  justify-content: center;
  margin-right:34px
}
.collection-btn img{
  width:20px;
  height:20px;
}
.collection-btn span{
  color:#36A6FE;
  font-size: 18px;
}
.preview-content {
  border-radius:20px;
  width: 960px;
  margin: 0px auto;
  min-height: 600px;
  background: #fff;
}
.govermentPrice-icon{
  width:14px;
  height:14px;
  background: #36A6FE;
  color:#fff;
  border-radius: 10px;
  text-align: center;
  line-height: 14px;
  font-size: 12px;
  float:right
}
.govermentPrice-item{
  width:96px;
  height:40px;
  position: relative;
  font-size: 12px;
  border-radius: 5px;
  border:1px solid #999;
  margin-left:22px;
  justify-content: center;
  flex-direction: column;
}
.govermentPrice-item img{
  width: 17px;
  height: 19px; 
  position: absolute;
  right:0;
  bottom: 0;
}
.check-border{
  border:1px solid #36A6FE
}
.govermentPrice-title{
  width: 100%;  
  font-weight: 400;
  color: #666666;
  text-align: center;
}
.count-icon{
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #f2f1ef;
  border: 1px solid #d8d8d8;
}
.count-number{
  width: 60px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #d8d8d8;
  font-size: 20px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  text-align: center;
  color: #333333;
}
.bye-btn{
  width: 140px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color:#fff;
  font-size:20px;
  background: #36a6fe;
  border-radius: 5px;
  margin-right: 20px;
}
.tab-change {
  width: 100%;
  border-bottom: 1px solid #e9e9e9;
  height: 47px;
}
.tab-name {
  display: inline-block;
  padding: 0 50px;
  line-height: 45px;
  font-size: 16px;
  cursor: pointer;
}
.name-color {
  color: rgb(16, 142, 233);
  border-bottom: 2px solid rgb(16, 142, 233);
}
.service-assurance{
  margin-left:36px;
}
.service-assurance img{
  width:18px;
  height:18px
}
.service-assurance span{
  font-size:14px;
  margin-left:4px
}
.tab-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  margin-top: 20px;
}
.position-fixed{
  width: 60%;
  position: fixed;
  height: 47px;
  top: 0px;
  background: #fff;
}
.tab-content >>> img {
  width: 100%;
}
</style>
