<template>
  <div class="project_main" v-if="coverUrls.length>0">
    <div class="detail-body">
      <div class="body-left">
        <!-- 头部导航 -->
        <div class="project_nav">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="pointer_sty" @click.native="toHome()">首页</el-breadcrumb-item>
            <el-breadcrumb-item class="pointer_sty" @click.native="toList(type)">{{ type|filterName }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ type|filterName }}详情</el-breadcrumb-item>
          </el-breadcrumb>   
        </div>
        <div class="project_preview_top">
          <!-- 轮播图 -->
          <swiper :coverUrls="coverUrls" :noticeInfo="form" ref="child"></swiper>
          <!-- 产品描述 -->
          <div class="info-right">
            <h3 class="over_sty_title">{{ form.name }}</h3>
            <p class="detail-slogan">{{ form.slogan }}</p>
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
              <span class="btn_sty_item" @click="showQia()">
                <i class="el-icon-service"></i>
                <span>立即咨询</span>
              </span>

              <span class="btn_sty_item"  v-if="collectId != 0" @click="collect(1)">
                <i class="el-icon-star-off"></i>
                <span>加入收藏</span>
              </span>
              <span class="btn_sty_index" v-else @click="collect(2)">
                <img  src="~assets/images/shop/add_Collection@2x.png" width="20" height="20" />
                <span class="index_text">已收藏</span>
              </span>

            </div>
          </div>
        </div>
        <div class="fill-empty"></div>
        <!-- 内容部分 -->
        <div class="project_preview_bottom">
          <div class="bottom_left_content">
            <div :class="[fixed == true?'fix_active':'']">
              <div :class="['left_content_title',fixed == true?'fixed-width':'']">
                <div :class="['normal_tab_sty',showIndex == index ? 'choose_tab_sty' : '']"
                  v-for="(item, index) in tinyList"
                  :key="index"
                  @click="changeTab(index)">
                  <p>{{ item.tagName }}</p>
                  <span class="bottom_border_choosed" v-if="showIndex == index"></span>
                </div>
                <a class="top-ask" v-if="fixed" @click="showQia()"><i class="el-icon-service"></i> 立即咨询</a>
              </div>
            </div>
            <div class="left_content_main" ref="content" v-for="(item, index) in tinyList" :key="index">
              <span class="side_title">
                <span></span>
                <span>{{ item.tagName }}</span>
              </span>
              <div class="side_content" v-html="item.tagContent"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="body-right">        
        <div class="bottom_right_content">
          <div class="right_list_title">
            <span>推荐项目</span>
            <span class="right_more" @click="toList(type)">
              <span>更多</span>
              <img @click="toList(type)" :src="pointUrl" alt="">
            </span>
          </div>
          <div class="right_item_main" v-for="(item, index) in sideList" :key="index">
            <div v-for="(val,vIndex) in item.coverUrls" :key="vIndex" @click="toOtherDetail(item, false)">
              <img v-if="filterUrl(val)&&(val.isCover == 1)" :src="imgBaseUrl + val.url" alt="" />
              <div v-if="!filterUrl(val)&&(val.isCover == 1)">
                <video v-if="val.spUrl==''||val.spUrl==null" :src="imgBaseUrl + val.url"></video>
                <video v-else :poster="imgBaseUrl + val.spUrl" :src="imgBaseUrl + val.url"></video>
              </div>
            </div>
            <div class="item_main_bottom">
              <div class="item_desc_title" @click="toOtherDetail(item, false)">{{ item.name }}</div>
              <div class="btn_item_sty">
                <span @click="showQia()">立即咨询</span>
                <span @click="showQia()"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>    
    <!-- 尾部样式 -->
    <div class="project_preview_foot">
      <transecurity></transecurity>
    </div>
  </div>
</template>

<script>
import { getCommonDetail,getCommonList,addCommonView } from "@/api/common-service"
import transecurity from '@/components/project/index'
import swiper from "@/components/project/serviceSwiper";
import axios from "axios";
import { getUserInfo } from '@/api/login';
import {cancelCollect,addColl} from '@/api/announcement';
export default {
  components: {
    swiper,
    transecurity
  },
  head() {
    return {
      title: this.sreverInfo.metaTitle,
      meta: [
        { name: "keywords", content: this.sreverInfo.metaKeyword },
        {
          hid: "description",
          name: "description",
          content: this.sreverInfo.metaDescription,
        },
      ],
      userInfo: {},
    };
  },
  async asyncData({ params, query }) {
    try {
      let url = ""
    let length = query.type.length
    let id = query.type.substr(1,length - 1)
    switch (Number(query.type.substr(0,1))) {
    case 1:
      url = '/pagehome/gsdetails/' + id
      break;
    case 2:
      url = '/pagehome/rzdetails/' + id
      break;
    case 3:
      url = '/pagehome/fldetails/' + id
      break;
    case 4:
      url = '/pagehome/csdetails/' + id
      break;
  }
    const res = await axios.get(
      process.env.ASYNC_DATA_API + url
    );
    if (res&&res.data&&res.data.data) {
      return {
        sreverInfo: res.data.data,

        // collectId:res.data.data.isCollected,
      };
    }
    }catch(error){
      console.log(error)
    }
  },
  data() {
    return {
      collectId:null,
      sreverInfo: {},
      type:"",
      id:"",
      imgBaseUrl:process.env.CDN_BASE_URL,
      pointUrl:require("~/assets/images/xiangmu/youjiantou_iocn@2x.png"),
      lastIndex:0,
      fixed:false,
      form:{},
      coverUrls: [],
      tinyList: [],
      showIndex: 0,
      sideList: [],
      imgList: [
        {
          title: "全程监督",
          imgUrl: require("~/assets/images/xiangmu/icon01_ label_details@2x.png"),
        },
        {
          title: "保障权益",
          imgUrl: require("~/assets/images/xiangmu/icon02_ label_details@2x.png"),
        },
        {
          title: "十年行业经验",
          imgUrl: require("~/assets/images/xiangmu/icon03_ label_details@2x.png"),
        },
      ],
      titleList: ["快速响应", "专业代理", "品质服务", "无忧售后"],
      imgUrl:
        "//static-tst.wotao.com/icon/head/d78cea96a6aa4c0d88c6711fff8f8a69.jpg",

    userInfo:{},
    };
  },
  filters:{
    filterName(val){
      return val == 1?'工商注册':val == 2?'融资上市':val == 3?'法律服务':val == 4?'财税服务':''
    },
  },
  methods: {
    // 判断url类型是图片格式还是视频格式
    filterUrl(item){
      if(item.url&&item.url.split('.')[item.url.split('.').length-1]=='jpeg'||
         item.url.split('.')[item.url.split('.').length-1]=='png'||
         item.url.split('.')[item.url.split('.').length-1]=='jpg'||
         item.url.split('.')[item.url.split('.').length-1]=='gif'){
         return true;
      }
      if((item.url&&item.url.split('.')[item.url.split('.').length-1]=='mp4'||
         item.url.split('.')[item.url.split('.').length-1]=='avi'||
         item.url.split('.')[item.url.split('.').length-1]=='mov')){
         return false;
      }
    },
    toHome(){
      window.open('/',"_self")
    },
    toList(val){
      let url = val == 1?'/businessService':val == 2?'/financingListing':val == 3?'/legalService':val == 4?'/fiscalTax':''
      window.open(url,"_self")
    },
    operateTiny(val1,val2){
      if (Number(val1) !== 0 && Number(val2) !== 0) {
          let obj = {
            tagName: val1,
            tagContent: val2,
          };
          this.tinyList.push(obj);
        }
    },
    // 获取右侧推荐列表接口
    getIntroList(){
      getCommonList(this.type).then(res=>{
        if(res.data.code == 0){
          this.sideList = []
          let r = res.data.data
          r[0].name = r[0].title
          if(this.type == 2){
            this.sideList.push(r[0])
            r[1].forEach((item)=>{
            if(item.id != this.id){
              this.sideList.push(item)
            }
          })
          }else{
            r.forEach((item)=>{
            if(item.id != this.id){
              this.sideList.push(item)
            }
          })
          }
          this.sideList = this.sideList.slice(0,6)
        }
      })
    },
    // 获取详情接口
    getData(){
      getCommonDetail(this.type,this.id).then((res)=>{
        if(res.data.code == 0){
          this.tinyList = []
          let r = res.data.data
          this.form = r
          this.coverUrls = r.coverUrls
          this.collectId =this.form.isCollect
          //处理标签数组
          if(r.labelOneName){
            this.operateTiny(r.labelOneName,r.labelOneContent)
          }
          if(r.labelTwoName){
            this.operateTiny(r.labelTwoName,r.labelTwoContent)
          }
          if(r.labelThreeName){
            this.operateTiny(r.labelThreeName,r.labelThreeContent)
          }
          if(r.labelFourName){
            this.operateTiny(r.labelFourName,r.labelFourContent)
          }
          this.$nextTick(()=>{
            this.$refs['child'].imgObj = this.coverUrls[0]
          })
        }
      })
    },
    // 增加浏览量接口（要先调用增加浏览量接口再调用详情接口，否则前后台浏览量显示不一致）
    addView(){
      addCommonView(this.type,this.id).then(res=>{
        if(res.data.code == 0){
          this.getData();
        }
      })
    },
    showQia() {
      window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no') 
    },
    toOtherDetail(obj, status) {
      if(this.type == 2&&obj.title){
        window.open('/project/' + obj.number + 2);
      }else{
        const newPath = this.$router.resolve({
        path: "/common-service/detail",
        query: {
         type: String(this.type) + obj.id,// 1:gs工商 2:rz融资 3:fl法律 4:cs财税 
        },
      });
      status == true
        ? window.open(newPath.href, "_self")
        : window.open(newPath.href);
      }
    },
    // 切换tab显示
    changeTab(index) {
      this.showIndex = index;
      let el = this.$refs['content'][index]
      let offsetTop = el.offsetTop + (this.lastIndex == 0? 450 : this.showIndex == 0? 0 : 500)
      window.scrollTo({
        behavior: "smooth",
        top: offsetTop
      })
      this.lastIndex = index
    },
    handleScroll(){
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      this.fixed = scrollTop > 603? true : false;
    },

   
    getUserInfo() {
            getUserInfo().then((res) => {
                if (res.data.code == 0) {
                    this.userInfo = res.data.data;
                    this.loginStatus = true;
                }else{
                    this.loginStatus = false;
                }
            });
        },
    //收藏
    collect(status){
        let  projectType //前后端工商注册等的对应
        if (this.type==1) {
            projectType=2
        }else if (this.type==2) {
            projectType=4
        }else if (this.type==3) {
            projectType=5
        }else if (this.type==4) {
            projectType=3
        }

        if(!this.userInfo.accountId){
            window.open('/login')
            return
        }
        let param = {
            accountId:this.userInfo.accountId,
            number:this.form.number,
            type: projectType
        }
        if(status == 1){//status 1-收藏 2-取消
            addColl(param).then(res=>{
                if(res.data.code == 0){
                    this.$message({
                        type:'success',
                        message:'收藏成功！',
                        offset:50
                    })
                    this.getData();
                }
            })
        }else{
            let newparam = {
                accountId:this.userInfo.accountId,
                numbers:[this.form.number]
            }
            cancelCollect(newparam).then(res=>{
                if(res.data.code == 0){
                    this.$message({
                        type:'warning',
                        message:'取消收藏成功',
                        offset:50
                    })
                    this.getData();
                }
            })
        }
            
      }
  },
  mounted(){
    this.addView();
    this.getIntroList();
    // 监听页面滚动
    window.addEventListener('scroll',this.handleScroll)
  },
  created() {
    if(this.$route.query.type){
      let val = this.$route.query.type
      let length = val.length
      this.type = val.substr(0,1)
      this.id = val.substr(1,length - 1)
    }
    this.getUserInfo();
  },
  
};
</script>

<style scoped>
.project_main {
  overflow: hidden;
  background: #eff2f3;
  position: relative;
}
.detail-body{
  width: 1200px;
  margin: 0 auto;
  display: flex;
}
.body-left{
  width: 950px;
  overflow: hidden;
  background: #fff;
}
.body-right{
  margin: 54px 0 0 10px;
  background: #fff;
}
.fill-empty{
  width: 100%;
  height: 10px;
  background: #eff2f3;
}
.project_nav{
  width: 100%;
  padding: 20px;
  margin: 0 auto;
  background: #eff2f3;
}
.project_preview_top {
  display: flex;
  width: 100%;
  margin: 0 auto;
  background: #ffffff;
  padding: 20px;
  /* padding-bottom: 35px; */
}
.info-right{
  width: 540px;
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
  width: 500px;
  height: 50px;
  line-height: 50px;
  background: #f9f9f9;
  color: #333333;
  border-radius: 5px;
  font-size: 12px;
  padding-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.intro_three_content {
  height: 90px;
  display: flex;
  font-size: 16px;
  justify-content: center;
  align-items: center;
  margin: 12px 0 24px 0;
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
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 30px;
}
.btn_sty_item {
  width: 157px;
  height: 45px;
  background: linear-gradient(123deg, #75c2ff 0%, #3d7eff 100%);
  border-radius: 5px;
  /* margin-left: 30px; */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
}
/* .btn_sty_item:nth-of-type(1) {
  margin-left: 70px;
} */
.btn_sty_item:nth-of-type(2) {
  background: #ecf3ff;
  color: #4284ff;
  margin-left:18px;
}
.btn_sty_item i {
  font-size: 20px;
  margin-right: 8px;
}
.project_preview_bottom {
  display: flex;
  width: 1200px;
  margin: 0px auto;
  padding-top: 0;
  border-radius: 5px;
  background: #eff2f3 !important;
}
.bottom_left_content {
  background: #ffffff !important;
  width: 949px;
  margin-right: 11px;
  position: relative;
  border-radius: 5px;
}
.bottom_right_content {
  background: #ffffff !important;
  width: 240px;
  padding-bottom: 10px;
}
.left_content_title {
  display: flex;
  width: 949px;
  background: #ffffff;
  height: 50px;
}
.fixed-width{
  width: 1200px;
  margin:0 auto;
  display: flex;
  position: relative;
}
.fix_active {
  top: 46px;
  left: 0;
  width: 100%;
  position: fixed;
  box-shadow: 0 4px 20px 0 rgb(61 79 127 / 15%);
  background: #ffffff;
}
.top-ask{
  position: absolute;
  top: 0;
  right: 250px;
  width: 162px;
  height: 50px;
  line-height: 50px;
  color: #fff;
  text-align: center;
  background: #36a6fe;
  cursor: pointer;
}
.normal_tab_sty {
  font-size: 16px;
  font-weight: 400;
  width: 130px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #ffffff;
  color: #666666;
  cursor: pointer;
  position: relative;
}
.choose_tab_sty {
  background: #ffffff;
  color: #36a6fe;
  border: 1px solid #36a6fe;
  border-bottom: 2px solid #36a6fe;
}
.bottom_border_choosed {
  width:0;
	height:0;
  position: absolute;
  bottom: -7px;
	border-right:6px solid transparent;
	border-left:6px solid transparent;
	border-top:6px solid #36A6FE;
  left: 59px;
}
.bottom_right_content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.right_item_main {
  width: 200px;
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
.right_item_main video {
  width: 180px;
  height: 128px;
}
.item_main_bottom {
  border-top: none;
  margin-top: -4px;
  border-radius: 5px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
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
  width: 26px;
  height: 26px;
  margin-bottom: 7px;
}
.intro_img_icon span {
  border-right: none;
  font-size: 14px;
  color: #333333;
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
  /* height: 400px; */
}
.side_content >>> div{
  width: 100% !important;
}
.over_sty_title {
  width: 100%;
  /* height: 56px; */
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  font-weight: bold;
  font-size: 22px;
  color: #373d40;
  margin-bottom: 6px;
}
.detail-slogan{
  color: #999;
  font-size: 14px;
  margin-bottom: 10px;
}
.font_add_sty{
  font-weight: bold;
  font-size: 14px
}
.font_two_sty{
  font-size: 12px
}
.nav_color_sty{
  color:#36A6FE !important;
}
.project_preview_foot{
  width: 1200px;
  margin: 0 auto;
  margin-top: -10px;
  margin-bottom: 10px;
}
.right_more{
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  color: #A8A8A8;
}
.right_more:hover{
  color: #36A6FE;
}
.right_more img{
  width: 12px;
  height: 12px;
  margin-left: 5px;
}
.pointer_sty{
  cursor: pointer;
}
.btn_sty_index{
   width: 157px;
   height: 45px;
  background: #ECF3FF;
  border: 1px solid #4284FF;
  opacity: 1;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  line-height: 53px;
  margin-left:18px;
}
.index_text{
  color: #4284FF;
  font-size: 16px;
  display: inline-block;
  position: relative;
  top: -4px;
}
</style>