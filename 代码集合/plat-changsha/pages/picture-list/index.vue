<template>
  <div class="picture_list">
    <header-navigation :navList="navList" :shouyeId="shouyeId"></header-navigation>
    <!-- banner区域 -->
    <banner :bannerList="bannerList" v-if="bannerList.length>0"></banner>
    <!-- 主体内容区域 -->
    <div :class="['picture_content',bannerList.length>0?'':'no_banner_sty']">
      <!-- 导航标签区域 -->
      <div class="nav_contain">
        <nav-search ref="search" @search='refreshPage()'></nav-search>
      </div>
      <!-- 列表区域 -->
      <div class="picture_list_contain"  v-loading.lock="loading" v-if="dataList.length > 0">
        <pictureItem
          v-for="(item, index) in dataList"
          :key="index"
          :info="item"
          :id="$route.query.id"
          :filters="filters"
          :index="index">
        </pictureItem>
      </div>
      <!-- no-data展示区域 -->
      <div v-else class="picture_no_list">
        <div class="no_data_contain">
          <img :src="noImg" alt="暂无数据" />
          <span>抱歉暂无数据，请重新搜索！</span>
        </div>
      </div>
      <!-- 分页区域 -->
      <div class="article_page">
        <div class="page">
          <a v-if="pagination.current === 1" class="prev-btn dis light-page-block">上一页</a>
          <a v-else :href="'/picture-list?id='+$route.query.id+'&type='+$route.query.type+'&title='+keyWords+'&page='+pagination.previous+'&oneId='+$route.query.oneId" class="prev-btn light-page-block">上一页</a>
          <a v-for="(page, pageIndex) in pagination.pages" :key="pageIndex" :href="'/picture-list?id='+$route.query.id+'&type='+$route.query.type+'&title='+keyWords+'&page='+page+'&oneId='+$route.query.oneId" :class="pagination.current == page ? 'current' : ''">{{ page }}</a>
          <span v-if="point" class="point-sty">...</span>
          <a v-if="pagination.last !==pagination.pages[pagination.pages.length-1]&&pagination.last !== (pagination.next + 1) && pagination.last !== pagination.next && pagination.current+2 < pagination.last" :href="'/picture-list?id='+$route.query.id+'&type='+$route.query.type+'&title='+keyWords+'&page='+pagination.last+'&oneId='+$route.query.oneId" class="light-page-block">{{ pagination.last }}
          </a>
          <a v-if="pagination.current === pagination.last" class="prev-btn dis light-page-block">下一页</a>
          <a v-else class="prev-btn light-page-block"  :href="'/picture-list?id='+$route.query.id+'&type='+$route.query.type+'&title='+keyWords+'&page='+pagination.next+'&oneId='+$route.query.oneId">下一页</a>         
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBnner } from "@/api/notice";
import banner from "@/components/common/banner"
import filterItem from "@/components/common/filter-item";
import pictureItem from "@/components/picture-list/picture-item";
import headerNavigation from "@/components/common/headerNavigation"
import navBar from "@/components/common/nav-bar";
import navSearch from "@/components/common/nav-search";
import * as CodeMsg from "@/utils/code";
import axios from "axios";
export default {
  components: {
    banner,
    filterItem,
    navBar,
    headerNavigation,
    navSearch,
    pictureItem,
  },
  head() {
    return {
      title: this.clumnInfo.title,
      meta: [
        { charset: "utf-8" },
        {
          name: "keywords",
          content: this.clumnInfo.metakeyword,
        },
        {
          hid: "description",
          name: "description",
          content: this.clumnInfo.meta,
        },
      ],
    };
  },
  async asyncData({ query, redirect }) {
    let substationId = 20
    let data = {
        keywords: query.title ? query.title : "",
        pageNo: query.page ? parseInt(query.page) : 1,
        pageSize: 20,
        columnId: query.id,
        substationId: substationId,
        sort:'lattest'
      }
      if(query.title&&Number(query.title)!=0){
        data.sort = 'hottest'
      }
    return await axios.get(process.env.ASYNC_DATA_API+'/hfxl/column/listColumn?substationId='+substationId).then(res1=>{
      return  axios.post(process.env.ASYNC_DATA_API + "/hfxl/esJsNavigation/getListByColumnId",data).then(res => {
        const navList = [];
        res1.data.data.forEach(item => {
          if (item.status == 0) {
            switch (item.type) {
              case 0:
                item.pathUrl = "/graphic-content";
                break;
              case 1:
                item.pathUrl = "/article-list";
                break;
              case 2:
                item.pathUrl = "/graphic-list";
                break;
              case 3:
                item.pathUrl = "/picture-list";
                break;
              default:
                item.pathUrl = "/";
                break;
            }
            if (item.childrenColumnVoList) {
              item.childrenColumnVoList.forEach(child => {
                switch (child.type) {
                  case 0:
                    child.pathUrl = "/graphic-content";
                    break;
                  case 1:
                    child.pathUrl = "/article-list";
                    break;
                  case 2:
                    child.pathUrl = "/graphic-list";
                    break;
                  case 3:
                    child.pathUrl = "/picture-list";
                    break;
                  case 4:
                    child.pathUrl = "/";
                    break;
                  default:
                    child.pathUrl = "/";
                    break;
                }
              })
            }
            navList.push(item);
          }
        });
        let clumnInfoList = []
        res1.data.data.forEach(item => {
          if (item.isTwo == 1) {
            item.childrenColumnVoList.forEach(item1 => {
              clumnInfoList.push(item1)
            })
          } else {
            clumnInfoList.push(item)
          }
        })
        let clumnInfo = clumnInfoList.filter( val => {
          return query.id == val.id
        })[0]
        if(res.data.code == CodeMsg.CODE_0) {
          let pagination = {
            last: '',
            next:'',
            previous:'',
            pages:[],
            current:''
          } 
          let point = false;
          let pageLength = 0;
          let totalPage = 0;
          let total = res.data.data.total;
          //分页数据处理
          pagination.last = (total / 20 > parseInt(total / 20) || total / 20 == 0) ? parseInt(total /20)+1 : parseInt(total / 20);
          pagination.current = parseInt(query.page) ? parseInt(query.page) : 1;
          pagination.previous = pagination.current-1 > 1 ? pagination.current - 1 : 1;
          pagination.next = pagination.current + 1 < pagination.last ? pagination.current + 1 : pagination.last;
          //页码数据处理
          pagination.pages = [];
          if(pagination.current <= 3 && pagination.last >=5){
            pagination.pages = [1,2,3,4,5];
          }else if(pagination.current > 3 && (pagination.current +2 < pagination.last)){
            pagination.pages = [pagination.current-2, pagination.current-1, pagination.current, pagination.current+1, pagination.current+2]
          }else if(pagination.last < 5 ){
            for (let index = 1; index <= pagination.last; index++) {
              pagination.pages.push(index);
            }
          }else if(pagination.current+2 >= pagination.last){
            pagination.pages = [pagination.last-4, pagination.last-3, pagination.last-2, pagination.last-1, pagination.last]
          }else{

          };
          totalPage  = total;
          pageLength  = 20;
          point = pagination.last > 5 && pagination.last !== (pagination.next + 1) && pagination.last !== (pagination.current + 1) && pagination.current !== pagination.last
          const shouyeId = res1.data.data.filter(item => item.name.includes('首页'))[0].id
          return {
            clumnInfo: clumnInfo,
            dataList: res.data.data.list,
            total: res.data.data.total,
            loading: false,
            navList,
            pagination,
            totalPage,
            pageLength,
            point,
            shouyeId
          };
        }
      }).catch((err)=>{
        redirect('/');
      })
    })

  },
  data() {
    return {
      keyWords:'',
      url: process.env.PC_URL,
      classifyList:[],
      childIndex: null,
      loading: true,
      noImg: require("@/assets/images/notice/no_data.png"),
      dataList: [],
      total:0,
      childIndex1: null,
      page: {
        current: 1,
        size: 20,
      },
      areaObj: {
        categoryName: "地区：",
        options: [],
      },
      classify:[],
      clumnInfo: {},
      navList: [],
      bannerList: [],
      filters:{
        area:"", //适用地区
        punt:"", //归口
        policy:"", //汇编类型
        question:"", //问题类型
        industry:"" //行业类型
      },
      showIndex: null,
      navIndex: null,
      pagination: {
        pages:[]
      },
      point:false,
      keyword:'',
      params:'',
      totalPage: 0
    };
  },
  methods: {
    getNavIndex() {
      if(this.$route.path == '/'){
        this.navIndex = 0
      }else{
        if (this.$route.query.index) {
         this.navIndex = this.$route.query.index;
         if (this.$route.query.childIndex) {
          this.childIndex1 = this.$route.query.childIndex;
         } else {
          this.childIndex1 = null
         }
        } else {
          this.navIndex = 0
        }
      }
    },
    getBnnerList(type){
      getBnner(type).then(res=>{
        if(res.code == CodeMsg.CODE_0){
         this.bannerList = res.data
        }
      })
    },
    refreshPage(){
      this.$router.push({
        path: "/picture-list",
        query: {
          id: this.$route.query.id,
          type: this.$route.query.type,
          page:1,
          oneId: this.$route.query.oneId,
          title: this.$refs.search.keyWords,
        },
      })
    }
  },
  created() {
    if(this.$route.query.title){
      this.keyWords = this.$route.query.title;
    }
  },
  mounted() {
    if(this.$refs.search){
      this.$refs.search.keyWords = this.keyWords
    }
    this.getNavIndex();
    this.getBnnerList(this.$route.query.type);
  },
};
</script>

<style scoped>
.picture_list {
  width: 100%;
  background: #f7f8f9;
  overflow: hidden;
}
.picture_content {
  width: 1190px;
  margin: 0 auto;
  padding-bottom: 23px;
}
.picture_page {
  width: 100%;
  background: #f7f8f9 !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no_picture_page{
  margin-top: 20px !important;
}
.nav_contain {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.picture_list_contain {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}
.picture_no_list{
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  background: #ffffff;
}
.no_data_contain {
  width: 100%;
  height: 735px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.no_data_contain img {
  width: 300px;
}
.no_data_contain span {
  margin-top: 10px;
  color: #aca9a9;
  font-size: 16px;
}
.no_banner_sty{
  margin-top: 120px;
}

.nav_item_contain {
  width: 1190px;
  height: 100%;
  margin: 0 auto;
  padding-top: 70px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.nav_item {
  position: relative;
  flex: 1;
  display: flex;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #1172f3;
  margin-right: 10px;
  border-radius: 5px 5px 0px 0px;
  text-decoration: none;
}
.nav_active_item {
  color: #ffffff;
  background: #1172f3;
  border-radius: 5px 5px 0px 0px;
  text-decoration: none;
}
.nav_item_title {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
  border-radius: 5px 5px 0px 0px;
  text-decoration: none;
}

.two_nav_contain {
  position: absolute;
  top: 40px;
  width: 100%;
  background: #1172f3;
  border-radius: 0px 0px 5px 5px;
  z-index: 10000;
}
.two_nav_contain a {
  display: flex;
  height: 40px;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  border-top: 1px solid #ffffff;
  text-decoration: none;
}
.two_nav_contain > a:last-of-type {
  border-radius: 0px 0px 5px 5px;
}
.item_child_active {
  background: #5094ee;
}
.two_active{
  background: #5094EE;
}

/* 分页样式 */
.article_page {
  width: 100%;
  background: #f7f8f9 !important;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 50px;
}
.page a {
  display: inline-block;
  width: 32px;
  height: 28px;
  background-color: #ffffff;
  border-radius: 2px;
  border: solid 1px #dcdcdc;
  text-align: center;
  line-height: 28px;
  margin-left: 5px;
  text-decoration: none;
  transition: 0.5s;
  color: #666666;
}
.page a:hover {
  border-color: #93b874 ;
}
.page {
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 30px;
  padding-bottom: 30px;
}
.pro-box {
  min-height: 705px;
  height: 100%;
}
.page .prev-btn,
.page .next-btn {
  width: 56px;
  height: 28px;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666666;
}
.page a.current {
  background-color: #93b874 ;
  color: #fff;
  border: 0;
}
.page .dis {
  background-color: #dddddd;
  color: #f9fafa;
  border: 0;
}
.gopage{
  width: 56px;
  height: 28px;
  border-radius: 2px;
  border: 1px solid #dcdcdc;
  margin: 0 5px;
  text-align: center;
  font-size: 12px;
  color: #606266;
}
.page .goBtn{
  width: 60px;
  height: 28px;
  display: inline-block;
  text-align: center;
  line-height: 28px;vertical-align: bottom;
  margin-left: 10px;
}
.page .goBtn:hover{
  border-color: #dddddd;
}
.two_active{
  background: #5094EE;
}
.notice_page {
  width: 100%;
  margin-top: 20px;
  background: #f7f8f9 !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.point-sty{
  margin: 0 0 0 4px;
}
</style>