<template>
 <div>
  <div class="top">
    <div class="banner-desc-main">
      <div class="banner-desc-title">一站式科技企业服务平台</div>
      <div class="banner-desc-content">
        <span>优享政策红利</span>
        <span>助您无忧申报</span>
      </div>
    </div>
    <div class="top_zixun">
      <div class="top_zixun_left">
        <span>湖南政策解读</span>
        <span @click="handleMore({id:zixunList[0].id, bannerType: zixunList[0].bannerType,type: zixunList[0].type,childId: zixunList[0].childId})">查看更多</span>
      </div>
      <div class="top_zixun_body">
        <p v-for="item in zixunList" :key="item.id">
          <span class="circle-sty"></span>
          <a class="over-sty" :href="'/article-list/' + item.number + '?oneId=' + item.id" target="_blank">
            {{ item.title }}
          </a>
        </p>
      </div>
    </div>
  </div>
  <div class="advantages-list">
    <div class="advantages-item" v-for="(item,index) in advantagesList" :key="index">
      <img :src="item.imgUrl" alt="">
      <span>{{item.title}}</span>
      <span>{{item.desc}}</span>
    </div>
  </div>
 </div>
</template>

<script>
export default {
  props: {
    zixunList: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      advantagesList:[
        {
          imgUrl:require('@/assets/images/banner/icon_one@2x.png'),
          title:'国内一站式专业项目申报公司',
          desc:'立足霸都长沙，以专注专业理念服务全国'
        },
        {
          imgUrl:require('@/assets/images/banner/icon_two@2x.png'),
          title:'超过20000家项目申报合作企业',
          desc:'助力全国科技型中小企业快速发展'
        },
        {
          imgUrl:require('@/assets/images/banner/icon_three@2x.png'),
          title:'300人项目申报专业团队',
          desc:'8大部门分工协作，湘皖两地协同部署'
        }
      ]
    };
  },
  methods:{
    filterPath(type){
      let pathUrl = ''
      switch (type) {
        case 0:
          pathUrl = "/graphic-content";
          break;
        case 1:
          pathUrl = "/article-list";
          break;
        case 2:
          pathUrl = "/graphic-list";
          break;
        case 3:
          pathUrl = "/picture-list";
          break;
      }
      return pathUrl
    },
    handleMore(val) {
      const newPath = this.$router.resolve({
        path: this.filterPath(val.type),
        query: {
          id: val.childId!=''?val.childId: val.id,
          type: val.bannerType,
          page: 1,
          oneId: val.id,
          childId: val.childId!=''?val.childId:''
        } 
      });
      window.open(newPath.href,'_self');
    },
  }
};
</script>

<style scoped>
.top {
  margin-top: 110px;
  position: relative;
  width: 100%;
  height: 700px;
  background-image: url("@/assets/images/banner/pic_banner2.png");
  background-size: 100% 100%;
  text-align: center;
}
.banner-desc-main{
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 35%;
  right: 60%;
  z-index: 999;
}
.banner-desc-title{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 367px;
  height: 59px;
  background: #499e02;
  color: #FFFFFF;
  font-size: 29px;
  letter-spacing: 3px;
}
.banner-desc-content{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  color: #FFFFFF;
  font-size: 46px;
  margin-top: 26px;
}
.banner-desc-content>span{
 text-align: left;
 letter-spacing: 5px;
}
.top_zixun {
  display: flex;
  flex-direction: column;
  width: 480px;
  background: #5E9431;
  position: absolute;
  top: 14%;
  right: 20%;
  padding-bottom: 20px;
}
.top_zixun_top{
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 20px;
}
.top_zixun_left{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.top_zixun_left>span:nth-of-type(1){
  display: flex;
  justify-content: center;
  align-items: center;
  width: 132px;
  height: 39px;
  background: #ffffff;
  border-radius: 20px;
  color: #93B874;
  font-size: 18px;
  font-weight: bold;
  margin-left: 20px;
}
.top_zixun_left>span:nth-of-type(2){
  color: #FFFFFF;
  font-size: 14px;
  margin-right: 19px;
  cursor: pointer;
}
.top_zixun_body{
  margin-top: 16px;
  width: 100%;
}
.top_zixun_body p{
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 18px;
}
.over-sty{
  width: 422px;
  text-align: left;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  margin-left: 6px;
  color: #ffffff;
  text-decoration:none;
}
.top_zixun_body a:hover{
  color: #93B874;
  cursor: pointer;
}
.circle-sty{
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 50%;
  margin-left: 20px;
}
.advantages-list{
  width: 1195px;
  height: 110px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  margin-top: 82px;
}

.advantages-item{
  position: relative;
  display: flex;
  flex-direction: column;
  width: 388px;
  height: 94px;
  background: #edf3e7;
  color: #333333;
  font-size: 16px;
  margin-right: 16px;
}

.advantages-item:last-child{
  margin-right: 0 !important;
}

.advantages-item img{
  position: absolute;
  width: 48px;
  height: 44px;
  top: -16px;
  left: 20px;
}

.advantages-item>span:nth-of-type(1){
  font-weight: bold;
  margin: 23px 0 8px 71px;
}

.advantages-item>span:nth-of-type(2){
  margin-left: 71px;
}
</style>

