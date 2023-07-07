<template>
  <div class="notice_index">
    <!-- banner区域 -->
    <banner :bannerList="bannerList" v-if="bannerList.length>0"></banner>
    <!-- 主体内容区域 -->
    <div :class="['notice_content',bannerList.length>0?'':'no_banner_sty']">
      <!-- 导航标签区域 -->
      <nav-bar :navList="navList"></nav-bar>
      <!-- 搜索框 -->
      <notice-search @afterSearch="afterSearchList"></notice-search>
      <!-- 筛选区域 -->
      <filter-item :filterObj="filterObj" @changeFilter="changeFilter"></filter-item>

      <!-- 列表区域 -->
      <div class="notice_main">
        <!-- 地区筛选区域 -->
        <areaFilter :areaList="areaList" title="地区" @changeArea="changeArea"></areaFilter>
        
        <!-- list区域（包含分页） -->
        <div class="notice_include">
          <div class="notice_list">
            <!-- list筛选区域 -->
            <div class="list_filters">
              <div class="after_search" v-show="showSataus" @change="changeBox">
                <span>筛选结果：</span>
                <el-checkbox-group v-model="filters.searchIndex" :min="1">
                  <el-checkbox v-for="(item,index) in optionList" :key="index" :label="index">{{ item }}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="filter_sort">
                <span
                  class="sort_item"
                  v-for="(item, index) in sortList"
                  :key="index"
                  @click="changeSort(index)">
                  <span :class="[sortIndex == index ? 'choose_color' : '']">{{ item }}</span>
                  <span :class="[sortIndex == index ? 'choose_bg_color' : '']"></span>
                </span>
              </div>
            </div>

            <!-- list内容区域 -->
            <div
              class="notice_contain"
              v-loading.lock="loading"
              v-if="essayStatus">
              <notice-item
                v-for="(item, index) in noticeList"
                :key="index"
                :noticeInfo="item"
              ></notice-item>
            </div>
            <!-- no-data展示区域 -->
            <div v-else class="no_data_contain">
              <img :src="noImg" alt="暂无数据" />
              <span>抱歉暂无数据，请重新搜索！</span>
            </div>
          </div>

          <!-- 分页区域 -->
          <div class="notice_page">
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
  </div>
</template>

<script>
import banner from "@/components/common/banner"
import filterItem from "@/components/common/filter-item";
import noticeItem from "@/components/notice/notice-item";
import navBar from "@/components/common/nav-bar";
import noticeSearch from "@/components/notice/notice-search.vue";
import areaFilter from "@/components/notice/area-filter"
import { getPolicyList, getSelection, getBnner } from "@/api/notice";
import * as CodeMsg from "@/utils/code";
export default {
  components: {
    banner,
    filterItem,
    noticeItem,
    navBar,
    noticeSearch,
    areaFilter
  },
  head() {
    return {
      title: "江苏省各地市企业扶持奖励政策",
      meta: [
        { charset: "utf-8" },
        {
          name: "keywords",
          content: "扶持政策,政府补助",
        },
        {
          hid: "description",
          name: "description",
          content:
            "江苏卧涛为您整理各地市政府补助政策。找奖励政策就上卧涛网，实时更新，更全面！",
        },
      ],
    };
  },
  data() {
    return {
      essayStatus: true,
      showSataus: false,
      loading: true,
      filterIndex: 0,
      sortIndex: 0,
      filters: {
        keyWords: "",
        areaNos: [],
        selections: [],
        searchIndex: [],
      },
      page: {
        current: 1,
        size: 12,
        total: 0,
      },
      noticeList: [],
      optionList:["标题", "内容"],
      sortList: ["综合排序", "发布时间"],
      areaList: [],
      filterObj: {},
      navList: ["首页", "通知公告"],
      noImg: require("@/assets/images/notice/no_data.png"),
      bannerList: [],
    };
  },
  methods: {
    toHome(index) {
      if (index == 0) {
        window.open('/','_self');
      }
    },
    changeBox() {
      this.getAllList();
    },
    afterSearchList(val) {
      this.filters.keyWords = val;
      if (this.filters.keyWords !== "" && this.filters.keyWords !== null) {
        this.showSataus = true;
        this.filters.searchIndex = [0];
      } else {
        this.showSataus = false;
        this.filters.searchIndex = [];
      }
      this.getAllList();
    },
    getAllList() {
      this.page.current = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      let params = {
        type: 0,
        size: this.page.size,
        start: this.page.current,
        areaNos: this.filters.areaNos,
        categories: this.filters.selections,
        keyWords: this.filters.keyWords,
        isNewest: this.sortIndex == 1 ? true : false,
        isHotSpot: this.sortIndex == 0 ? true : false,
        isTitle: this.filters.searchIndex.includes(0),
        isContent: this.filters.searchIndex.includes(1),
      };
      getPolicyList(params).then((res) => {
        if (res.code == CodeMsg.CODE_1000) {
          this.page.total = res.data.policyList.count;
          this.essayStatus = this.page.total > 0 ? true : false;
          this.noticeList = [];
          res.data.policyList.object.forEach((item) => {
            item.forEach((it) => {
              this.noticeList.push(it);
            });
          });
          this.loading = false;
        }
      });
    },
    changeFilter(object, index) {
      this.filterIndex = index;
      if (object == null) {
        this.filters.selections.forEach((item) => {
          if (item.id == 2) {
            item.optionIds = [];
          }
        });
      } else {
        this.filters.selections.forEach((item) => {
          if (item.id == 2) {
            item.optionIds = [object.id];
          }
        });
      }
      this.getAllList();
    },
    changeArea(val) {
      this.filters.areaNos = [val.value];
      this.getAllList();
    },
    changeSort(index) {
      this.sortIndex = index;
      this.getAllList();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getList();
    },
    getFilter() {
      getSelection(0).then((res) => {
        if (res.code == CodeMsg.CODE_1000) {
          res.data.area.forEach(item=>{
            if(item.value == "320000"){
              this.areaList = item.children;
            }
          })
          this.filters.areaNos = [this.areaList[0].value];
          this.filters.selections = [];
          let selections = res.data.selection;
          selections.forEach((item) => {
            if (item.categoryId == 2) {
              this.filterObj = item;
            }
            this.filters.selections.push({
              id: item.categoryId,
              optionIds: [],
              name: item.categoryName,
            });
          });
          this.getAllList();
        }
      });
    },
    getBnnerList(){
      getBnner(1).then(res=>{
      if(res.code == CodeMsg.CODE_1000){
         this.bannerList = res.data
        }
      })
    }
  },
  mounted() {
    this.getFilter();
    this.getBnnerList()
  },
};
</script>

<style scoped>
.notice_index {
  width: 100%;
  background: #f7f8f9;
  overflow: hidden;
}
.notice_content {
  width: 62.5%;
  margin: 0 auto;
  margin-top: 17px;
  padding-bottom: 23px;
}
.notice_main {
  margin-top: 11px;
  width: 100%;
  height: 100%;
  display: flex;
}
.choose_color {
  color: #36a6fe !important;
}
.choose_bg_color {
  background: #36a6fe !important;
}
.notice_include {
  display: flex;
  flex-direction: column;
}
.notice_list {
  width: 970px;
  background: #ffffff;
  border-radius: 5px;
  padding: 0 19px 25px 22px;
}
.notice_contain {
  min-height: 735px;
}
.no_data_contain {
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
.list_filters {
  display: flex;
  height: 40px;
  border-bottom: 1px solid #e7e6eb;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: #373d40;
  position: relative;
}
.after_search {
  position: absolute;
  top: 10px;
  left: 0;
  display: flex;
}
.after_search > span:nth-of-type(2) {
  margin-right: 20px;
}
.filter_sort {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.filter_sort > span:nth-of-type(2) {
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
.no_banner_sty{
  margin-top: 120px;
}
</style>