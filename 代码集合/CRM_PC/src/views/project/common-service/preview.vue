<template>
<!-- 排查完成 -->
  <div class="project_main">
    <div class="project_preview_top">
      <swiper :coverUrls="coverUrls"></swiper>
      <div>
        <div class="over_sty_title">{{ form.name }}</div>
        <span class="chen_sty_span" v-for="(item, index) in titleList" :key="index">{{ item }}</span>
        <div class="desc_sty_content">
            <span class="font_add_sty">增值服务：</span>
            <span class="font_two_sty">免费规划、相关专业培训课程</span>
        </div>
        <div class="intro_three_content">
          <span class="intro_img_icon" v-for="(item, index) in imgList" :key="index">
            <img :src="item.imgUrl" alt="" />
            <span>{{ item.title }}</span>
          </span>
        </div>
        <div class="intro_btn_content">
          <span class="btn_sty_item">
            <i class="el-icon-service"></i>
            <span>立即咨询</span>
          </span>
          <span class="btn_sty_item">
            <i class="el-icon-star-off"></i>
            <span>加入收藏</span>
          </span>
        </div>
      </div>
    </div>
    <div class="project_preview_bottom">
      <div class="bottom_left_content">
        <div :class="['left_content_title',fixed == true?'fixed_sty':'']">
          <span :class="['normal_tab_sty',showIndex == index ? 'choose_tab_sty' : '']"
            v-for="(item, index) in tinyList"
            :key="index"
            @click="changeTab(index)">
            <span>{{ item.tagName }}</span>
            <span :class="['bottom_border',showIndex == index ? 'bottom_border_choosed' : '']"></span>
          </span>
        </div>
        <div class="left_content_main" ref="content" v-for="(item, index) in tinyList" :key="index">
          <span class="side_title">
            <span></span>
            <span>{{ item.tagName }}</span>
          </span>
          <div class="side_content" v-html="item.tagContent"></div>
        </div>
      </div>
      <div class="bottom_right_content">
        <div class="right_list_title">
          <span>推荐项目</span>
          <span class="right_more" @click="toList(type)">
            <span>更多</span>
          </span>
        </div>
        <div class="right_item_main" v-for="(item, index) in sideList" :key="index">
          <img :src="imgUrl" alt="" />
          <div class="item_main_bottom">
            <div class="item_desc_title">项目名称项目名称</div>
            <div class="btn_item_sty">
              <span>立即咨询</span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swiper from "@/components/project/swiper";
export default {
  components: {
    swiper,
  },
  data() {
    return {
      fixed:false,
      coverUrls: [],
      tinyList: [],
      lastIndex:0,
      showIndex: 0,
      sideList: ["", "", "", "", "", ""],
      imgList: [
        {
          title: "全程监督",
          imgUrl: require("@/assets/images/project/icon01.png"),
        },
        {
          title: "保障权益",
          imgUrl: require("@/assets/images/project/icon02.png"),
        },
        {
          title: "十年行业经验",
          imgUrl: require("@/assets/images/project/icon03.png"),
        },
      ],
      titleList: ["快速响应", "专业代理", "品质服务", "无忧售后"],
      imgUrl:
        "//static-tst.wotao.com/icon/head/d78cea96a6aa4c0d88c6711fff8f8a69.jpg",
    };
  },
  methods: {
    changeTab(index) {
      this.showIndex = index;
      let el = this.$refs.content[index];
      window.scrollTo({
        behavior: "smooth",
        block: "center",
        top: this.showIndex == 0?0:this.lastIndex == 0?el.offsetTop + 350:el.offsetTop + 400,
      })
      this.lastIndex = index
    },
    handleScroll(){
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
       this.fixed = scrollTop > 519?true:false;
      console.log(scrollTop)
    }
  },
  created() {
    this.form = JSON.parse(this.$route.query.form);
    this.coverUrls = JSON.parse(this.$route.query.coverUrls);
    this.tinyList = JSON.parse(this.$route.query.tinyList);
  },
  mounted(){
    window.addEventListener('scroll',this.handleScroll,true)
  },
};
</script>

<style scoped>
.project_main {
  background: #eff2f3;
  padding-bottom: 20px;
  padding-top: 10px;
}
.project_preview_top {
  display: flex;
  width: 1200px;
  margin: 0px auto;
  background: #ffffff;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.chen_sty_span {
  display: inline-block;
  text-align: center;
  width: 90px;
  height: 38px;
  background: #fbe5d4;
  opacity: 1;
  border-radius: 5px;
  font-size: 14px;
  line-height: 38px;
  color: #ff6900;
  margin-right: 10px;
}
.desc_sty_content {
  margin-top: 14px;
  width: 685px;
  height: 50px;
  background: #eff2f3;
  color: #333333;
  opacity: 1;
  border-radius: 10px;
  font-size: 12px;
  padding: 5px;
  padding-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.intro_three_content {
  height: 96px;
  display: flex;
  font-size: 16px;
  justify-content: center;
  align-items: center;
  margin: 14px 0 46px 0;
  border-top: 1px dashed #E2E2E2;
  border-bottom: 1px dashed #E2E2E2;
}
.intro_three_content span {
  height: 25px;
  border-right: 1px solid #E2E2E2;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.intro_three_content > span:nth-of-type(3) {
  border-right: none;
}
.intro_btn_content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
}
.btn_sty_item {
  width: 246px;
  height: 56px;
  background: linear-gradient(123deg, #75c2ff 0%, #3d7eff 100%);
  opacity: 1;
  border-radius: 10px;
  margin-left: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 18px;
}
.btn_sty_item:nth-of-type(1) {
  margin-left: 0;
}
.btn_sty_item:nth-of-type(2) {
  background: #ecf3ff;
  color: #4284ff;
}
.btn_sty_item i {
  font-size: 22px;
  margin-right: 5px;
}
.project_preview_bottom {
  display: flex;
  width: 1200px;
  margin: 0px auto;
  margin-bottom: 10px;
  padding-top: 0;
  background: #eff2f3 !important;
  border-radius: 5px;
}
.bottom_left_content {
  background: #ffffff !important;
  width: 949px;
  margin-right: 11px;
  position: relative;
}
.bottom_right_content {
  background: #ffffff !important;
  width: 240px;
}
.left_content_title {
  display: flex;
  width: 100%;
  background: #ffffff;
  height: 55px;
}
.fixed_sty{
  width: 949px;
  top: 0;
  position: fixed;
}
.normal_tab_sty {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  width: 160px;
  height: 55px;
  /* background: #F6F6F6; */
  color: #666666;
  opacity: 1;
  cursor: pointer;
}
.choose_tab_sty {
  background: #ffffff;
  color: #36a6fe;
}
.bottom_right_content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.right_item_main {
  margin-bottom: 10px;
  padding-top: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #d8d8d8;
}
.right_item_main img {
  width: 180px;
  height: 128px;
}
.item_main_bottom {
  border-top: none;
  margin-top: -4px;
}
.btn_item_sty {
  padding: 5px 8px 5px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn_item_sty span {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  width: 56px;
  height: 20px;
  border-radius: 5px;
}
.btn_item_sty > span:nth-of-type(1) {
  color: #36a6fe;
  background: #ffffff;
  cursor: pointer;
}
.btn_item_sty > span:nth-of-type(2) {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-top: 1px solid #36a6fe;
  border-right: 1px solid #36a6fe;
  cursor: pointer;
  transform: rotate(45deg);
  border-radius: 0;
}
.item_desc_title {
  width: 198px;
  font-size: 14px !important;
  font-weight: bold;
  padding: 8px 0 5px 8px;
  border-bottom: 1px solid #d8d8d8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.right_list_title {
  width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
}
.right_list_title span {
  display: flex;
  font-size: 12px;
}
.right_list_title > span:nth-of-type(1) {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
}
.intro_img_icon {
  display: flex;
  flex-direction: column;
}
.intro_img_icon img {
  width: 18px;
  margin-bottom: 6px;
}
.intro_img_icon span {
  border-right: none;
}
.side_title {
  font-size: 16px;
  padding-left: 25px;
  color: #36a6fe;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.side_title > span:nth-of-type(1) {
  display: inline-block;
  border-radius: 2px;
  width: 4px;
  height: 14px;
  background: #36a6fe;
  border-radius: 4px;
  margin-right: 10px;
}
.left_content_main {
  margin-top: 25px;
}
.side_content {
  min-height: 300px;
  padding: 20px 25px 30px 35px;
}
.side_content >>> video {
  width: 100%;
  height: 400px;
}
.side_content >>> img {
  width: 100%;
  height: 400px;
}
.side_content >>> div{
  width: 100% !important;
}
.over_sty_title {
  width: 685px;
  height: 56px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  font-weight: bold;
  font-size: 22px;
  color: #373d40;
  margin-bottom: 15px;
}
.bottom_border {
  width: 20px;
  height: 4px;
  opacity: 1;
  border-radius: 4px;
  margin-top: 12px;
}
.bottom_border_choosed {
  background: #36A6FE;
}
.font_add_sty{
  font-weight: bold;
  font-size: 14px
}
.font_two_sty{
  font-size: 12px
}
.right_more{
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
  color: #A8A8A8;
}
.right_more:hover{
  color: #36A6FE;
}
</style>