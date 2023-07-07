<template>
  <div class="policy-contain">
    <div class="policy-main-contain">
      <div class="policy-main">
      <div class="policy-item" v-for="(item, index) in hyzxList" :key="index">
        <img class="policy-bg" :src="item.imgUrl" alt="" />
        <div class="policy-item-contain">
          <div class="policy-top">
            <span>{{ item.title }}</span>
            <span @click="toList({ id: item.id, bannerType: item.bannerType, type: item.type,childId: item.childId })">查看更多</span>
          </div>
          <div class="policy-bottom">
            <div class="policy-bottom-list">
              <a class="policy-bottom-item"
                v-for="(cItem, cIndex) in item.list"
                :key="cIndex"
                :href="'/article-list/' + cItem.number + '?oneId=' + item.id"
                target="_blank">
                {{ cItem.title }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <!-- 各地政策奖补 -->
    <div class="policy-awards">
       <div class="awards-top">
				  <span>各地政策奖补</span>
					<span @click="toList({id: zcjbList[0].id, bannerType: zcjbList[0].bannerType, type: zcjbList[0].type, childId: zcjbList[0].childId})">查看更多</span>
			 </div>
			 <div class="awards-contain">
				  <div class="awards-list">
						<div class="awards-item" v-for="(cItem, cIndex) in zcjbList[0].list" :key="cIndex">
							<span></span>
							<a class="awards-over-sty" :href="'/article-list/'+cItem.number+'?oneId='+zcjbList[0].id" target="_blank">
                {{cItem.title}}
              </a>
						</div>
					</div>
					<span class="awards-lang"></span>
					<div class="awards-list">
						<div class="awards-item" v-for="(cItem, cIndex) in zcjbList[1].list" :key="cIndex">
							<span></span>
							<a class="awards-over-sty" :href="'/article-list/'+cItem.number+'?oneId='+zcjbList[1].id" target="_blank">
                {{cItem.title}}
              </a>
						</div>
					</div>
			 </div>
		</div>
  </div>
</template>
<script>
export default {
  props: {
    hyzxList: {
      type: Array,
      default: [],
    },
    zcjbList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {};
  },
  methods: {
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
    toList(val) {
      const newPath = this.$router.resolve({
        path: this.filterPath(val.type),
        query: {
          id: val.childId!=''?val.childId: val.id,
          type: val.bannerType,
          page: 1,
          oneId: val.id,
          childId: val.childId!=''?val.childId:''
        },
      });
      window.open(newPath.href, "_self");
    },
  },
};
</script>


<style scoped>
.policy-contain {
  width: 100%;
  margin-top: 123px;
	background: #ffffff;
}
.policy-main-contain{
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/banner/pic-bg.png');
  background-size: 100% 100%;
  padding-bottom: 60px;
}
.policy-main{
  width: 1195px;
  height: 100%;
  margin: 0 auto;
}
.policy-item {
  position: relative;
  width: 100%;
  height: 393px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.policy-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.policy-item-contain {
  position: absolute;
  top: 0;
  left: 0;
}
.policy-top {
  width: 1195px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 33px;
}
.policy-top > span:nth-of-type(1) {
  color: #333333;
  font-size: 18px;
  font-weight: bold;
}
.policy-top > span:nth-of-type(2) {
  color: #5e9431;
  font-size: 14px;
  margin-right: 37px;
  cursor: pointer;
}
.policy-bottom {
  display: flex;
  justify-content: space-between;
}
.policy-bottom-list {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
}
.policy-bottom-item {
  margin-bottom: 12px;
  color: #555555;
  font-size: 18px;
  width: 542px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
}
/* 各地政策奖补 */
.policy-awards{
	width: 1195px;
	height: 394px;
  margin: 0 auto;
	background-image: url("@/assets/images/banner/pic-background@2x.png");
	background-size: 100% 100%;
  background-repeat: no-repeat;
	margin-top: 70px;
	margin-bottom: 64px;
	overflow: hidden;
}
.awards-top{
	display: flex;
	justify-content: space-between;
	margin-top: 46px;
}
.awards-top>span:nth-of-type(1){
	width: 173px;
  height: 48px;
	display: flex;
	justify-content: center;
	align-items: center;
  background: #ffffff;
  border-radius: 24px;
	color: #93B874;
	font-size: 18px;
	font-weight: bold;
	margin-left: 98px;
}
.awards-top>span:nth-of-type(2){
	color: #FFFFFF;
	font-size: 18px;
	font-weight: bold;
	margin-right: 95px;
	cursor: pointer;
}
.awards-contain{
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-top: 24px;
}
.awards-list{
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
}
.awards-list:nth-of-type(1){
	margin-left: 98px;
}
.awards-list:nth-of-type(2){
	margin-right: 95px;
}
.awards-item{
	display: flex;
	align-items: center;
	color: #FFFFFF;
	font-size: 18px;
	margin-bottom: 16px;
}
.awards-item>span:nth-of-type(1){
	display: inline-block;
  width: 11px;
  height: 11px;
  background: #dbeccc;
  border-radius: 50%; 
	margin-right: 6px; 
}
.awards-lang{
	display: inline-block;
	width: 1px;
  height: 224px;
  border: 1px solid #ffffff;
	margin-bottom: 10px;
}
.awards-over-sty{
	display: inline-block;
	width: 398px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-decoration: none;
	color: #FFFFFF;
}
</style>