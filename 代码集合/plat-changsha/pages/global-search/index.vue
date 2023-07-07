<template>
  <div class="global_search">
    <div class="global_main">
      <areaFilter :areaList="navList" title="搜索范围" @changeArea="changeNav"></areaFilter>
      <div class="global_context">
        <div class="global_context_right">
          <div class="global_filter_sort" v-if="dataList.length>0">
            <span
              class="sort_item"
              v-for="(item, index) in sortList"
              :key="index"
              @click="changeSort(index)">
              <span :class="[sortIndex == index ? 'choose_color' : '']">{{ item }}</span>
              <span :class="[sortIndex == index ? 'choose_bg_color' : '']"></span>
            </span>
          </div>
        <!-- 列表区域 -->
        <div class="article_show_main" v-if="dataList.length > 0" v-loading.lock="loading">
          <div class="article_list_contain" v-if="showType == 0">
            <graphic-content :noticeInfo="graphicInfo"></graphic-content>
          </div>
          <div class="article_list_contain" v-if="showType == 1">
            <article-item v-for="(item, index) in articleList" :key="index" :info="item" :index="index" :filters="hotParams" :id="showId"></article-item>
          </div>
          <div class="article_list_contain" v-if="showType == 2">
            <graphic-item v-for="(item, index) in graphicList" :key="index" :info="item" :filters="hotParams" :id="showId"></graphic-item>
          </div>
          <div class="article_list_contain" v-if="showType == 3">
            <pictureItem v-for="(item, index) in pictureList" :key="index" :info="item" :index="index" :filters="hotParams" :id="showId"></pictureItem>
          </div>
          <div class="article_list_contain" v-if="showType == 5">
            <notice-item v-for="(item, index) in noticeList" :key="index" :noticeInfo="item" :id="showId"></notice-item>
          </div>
        </div>
        <!-- no-data展示区域 -->
        <div v-else class="article_list_contain">
          <div class="no_data_contain">
            <img :src="noImg" alt="暂无数据" />
            <span>抱歉暂无数据，请重新搜索！</span>
          </div>
        </div>
        </div>
        <!-- 分页区域 -->
        <div class="notice_page" v-if="showType !== 0">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page.sync="page.current"
            :page-size="page.size"
            layout="prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNavList, globalSearch } from "@/api/template"
import { getPolicyList, getSelection } from "@/api/notice";
import noticeItem from "@/components/notice/notice-item";
import pictureItem from "@/components/picture-list/picture-item";
import graphicItem from "@/components/graphic-list/graphic-item";
import articleItem from "@/components/article-list/article-item";
import index from "@/layouts/head/index";
import graphicContent from "@/components/graphic-content/content"
import { getColumnList } from "@/api/home";
import * as CodeMsg from "@/utils/code";
import areaFilter from "@/components/notice/area-filter";
export default {
  components: {
    areaFilter,
    articleItem,
    graphicItem,
    pictureItem,
    noticeItem,
    index,
    graphicContent
  },
  head() {
    return {
      title: "寻鹿软件开发-网站建设,系统软件定制开发",
      meta: [
        {
          name: "keywords",
          content:
            "网站开发,APP开发,小程序开发,系统开发"
        },
        {
          hid: "description",
          name: "description",
          content:
            "专业软件开发团队，10年开发经验，为企业提供网站建设、小程序开发、APP开发、CRM等系统定制开发。高品质服务，无隐形收费，全程可跟踪，软件开发就找寻鹿科技。"
        }
      ]
    };
  },
  data() {
    return {
      areaList:[],
      hotParams:{
        area:"", //适用地区
        punt:"", //归口
        policy:"", //汇编类型
        question:"", //问题类型
        industry:"" //行业类型
      },
      showName:"",
      keyWords:"",
      loading: true,
      noImg: require("@/assets/images/notice/no_data.png"),
      showType: "",
      showId:"",
      sortIndex: 0,
      page: {
        current: 1,
        size: 20,
        total: 0,
      },
      filters:{
        selections:[],
        areaNos:[]
      },
      graphicList:[],
      graphicInfo:{},
      articleList:[],
      pictureList:[],
      dataList: [],
      noticeList:[],
      sortList: ["综合排序", "发布时间"],
      navList: [],
    };
  },
  created(){
    this.keyWords = this.$route.query.keyWords
  },
  watch:{
    $route(to,form){
      this.keyWords = to.query.keyWords
      this.getAllList()
    }
  },
  methods: {
    getNav() {
      getColumnList({substationId:20}).then((res) => {
        if (res.code == CodeMsg.CODE_0) {
          this.navList = [];
          res.data.forEach((item, index) => {
            if (index > 0 && item.type!==4 && item.type!==6) {
              item.label = item.name;
              this.navList.push(item);
              if(index == 1){
                // this.getFilter()
                this.showType = this.navList[0].type
                this.showId = this.navList[0].id
                this.getAllList()
              }
            }
          });
        }
      });
    },
    changeSort(index) {
      this.sortIndex = index;
      this.getAllList();
    },
    getAllList(){
      this.page.current = 1
      this.getList()
    },
    typeTranslate(){
      switch(this.showType){
       case 0:
          if(this.dataList.length>0){
              this.graphicInfo = this.dataList[0] 
              this.graphicInfo.name = this.showName
          }
       case 1:
          this.articleList = this.dataList 
          break;
       case 2:
          this.graphicList = this.dataList
          break;
       case 3:
          this.pictureList = this.dataList
          break;
      }
    },
    getNavData(){
      this.loading = true;
      let params = {
        keywords: this.keyWords,
        pageNo: this.page.current,
        pageSize: this.page.size,
        columnId: this.showId,
        substationId: 20,
        // isDraft: 0,
        sort: this.sortIndex == 0 ? 'hottest' : 'latest'
      }
      globalSearch(params).then(res=>{
        if(res.code == CodeMsg.CODE_0){
         this.dataList = []
         this.dataList = res.data.list
         this.page.total = res.data.total
         this.typeTranslate()
         this.loading = false;
        }
      })
    },
    getNoticeData(){
      this.loading = true;
      let params = {
        keyWords: this.keyWords,
        type: 0,
        size: this.page.size,
        start: this.page.current,
        areaNos: this.filters.areaNos,
        categories: this.filters.selections,
        isNewest: this.sortIndex == 1 ? true : false,
        isHotSpot: this.sortIndex == 0 ? true : false,
        isTitle: true,
        isContent: false,
      };
      getPolicyList(params).then((res) => {
        if (res.code == CodeMsg.CODE_1000) {
          this.dataList = []
          this.noticeList = [];
          this.page.total = res.data.policyList.count;
          res.data.policyList.object.forEach((item) => {
            item.forEach((it) => {
              this.noticeList.push(it);
              this.dataList.push(it)
            });
          });
          this.loading = false;
        }
      });
    },
    getList(){
      if(this.showType == 5){
        this.getNoticeData()
      }else{
        this.getNavData()
      }
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getList();
    },
    changeNav(val) {
      this.showType = val.type;
      this.showId = val.id
      this.showName = val.name
      this.sortIndex = 0
      this.getAllList()
    },
    getFilter() {
      getSelection(0).then((res) => {
        if (res.code == CodeMsg.CODE_1000) {
          this.filters.selections = [];
          this.filters.areaNos = [];
          res.data.area.forEach(item=>{
            if(item.value == "320000"){
              this.areaList = item.children;
            }
          })
          this.areaList.forEach(item=>{
            this.filters.areaNos.push(item.value)
          })
          let selections = res.data.selection;
          selections.forEach((item) => {
            this.filters.selections.push({
              id: item.categoryId,
              optionIds: [],
              name: item.categoryName,
            });
          });
        }
      });
    },
  },
  mounted() {
    this.getNav();
  },
};
</script>

<style scoped>
.global_search {
  width: 100%;
  background: #f7f8f9;
  overflow: hidden;
  padding-bottom: 20px;
}
.global_main {
  width: 62.5%;
  margin: 0 auto;
  margin-top: 70px;
  display: flex;
}
.global_context {
  display: flex;
  flex-direction: column;
}
.global_context_right {
  width: 960px;
  min-height: 750px;
  padding: 10px 15px;
  background: #ffffff;
  opacity: 1;
  border-radius: 5px;
}
.global_filter_sort {
  height: 35px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  color: #373d40;
  padding-left: 10px;
}
.global_filter_sort > span:nth-of-type(2) {
  margin: 0 30px 0 20px;
}
.sort_item {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
}
.sort_item > span:nth-of-type(2) {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 3px;
  background: #ffffff;
  opacity: 1;
  border-radius: 2px;
}
.notice_page {
  width: 100%;
  margin-top: 20px;
  background: #f7f8f9 !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.choose_color {
  color: #36a6fe !important;
}
.choose_bg_color {
  background: #36a6fe !important;
}
.article_list_contain {
  width: 100%;
  margin-top: 10px;
  padding-bottom: 20px;
  background: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  border-radius: 5px;
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
.article_show_main{
  width: 100%;
  min-height: 750px;
}
</style>