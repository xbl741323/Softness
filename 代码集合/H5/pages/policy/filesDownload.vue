<template>
  <div class="policy_list" v-loading.fullscreen.lock="loading">
    <!-- 头部搜索栏 -->
    <file-header
      ref="header"
      :title="title"
      :content="content"
      @search="getSearch"
      @changeSort="changeSort"
    ></file-header>
    <!-- 筛选项 -->
    <div :class="[showStatus == true ? 'nutice_filter' : 'filter_more']">
      <popup v-model="currentValue" >
        <file-filter 
          :active="sort"
          @search-filter="searchFilter"
        ></file-filter>
      </popup>
      <div class="filter_type_one">
        <ul>
          <li
            v-for="(item, index) in selectNameList"
            :key="index"
            @click="changeStatus(item, index)"
          >
            <span :class="[item.status == true ? 'type_one_border' : '']">
              <span :class="[item.colorStatus == true ? 'font_color' : '']">{{
                item.categoryName
              }}</span>
              <span
                :class="[item.status == true ? 'type_seleted' : '', 'type_one_angle']"
                v-if="item.select == true"
              ></span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 文章列表 -->
    <div class="eassy_position">
      <file-item v-for="(item,index) in nuticeArr" :key="index" :item="item"></file-item>
    </div>
    <div style="width: 100%;" class="page_limit" v-if="showMsg == 0">
      <el-pagination
        :page-size="pageSize"
        @current-change="handleChange"
        background
        :current-page="start"
        layout="prev, pager, next"
        :pager-count="5"
        :total="total"
      ></el-pagination>
    </div>
    <div v-if="showMsg == 1" class="null_search">暂无数据</div>
  </div>
</template>

<script>
import { esPageFile } from "@/api/file";
import fileFilter from "@/components/policySquare/fileDowland/fileFilter";
import fileItem from "@/components/policySquare/fileDowland/fileItem";
import fileHeader from "@/components/policySquare/fileDowland/fileHeader";
import Popup from "@/components/policySquare/popup";
export default {
  components: {
    fileHeader,
    fileFilter,
    fileItem,
    Popup,
  },
  head() {
    return {
      title: this.metaTitle,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description"
        }
      ]
    };
  },
  layout: "footer",
  data() {
    return {
      loading:true,
      showFilter:true,
      params: {},
      showStatus: true,
      showMsg: 0,
      metaTitle: this.$t("message.fileDowland") + this.$t("message.list"),
      title: '卧涛文档',
      content: '请输入关键词',
      pageSize: 51,
      total: 0,
      start: 1,
      keyWords: "",
      nuticeArr: [],
      selectNameList: [{
        categoryName: '发布时间',
        select: true,
        colorStatus: true,
        status: false,
        otherName: '发布时间'
      }],
      currentValue: false,
      sort: 'latest'
    };
  },
  methods: {
    changeSort(obj){
      this.sort = obj.value
      this.selectNameList[0].categoryName = obj.name
      this.selectNameList[0].otherName = obj.name
      if(obj.value=='latest'){
        this.getStartList()
      }
    },
    getSearch(val) {
      this.keyWords = val;
      this.start = 1;
      if (val !== "") {
        this.showFilter = false
      }else{
        this.showFilter = true
      }
      window.open("/policy/filesDownload?search="+this.keyWords,"_self")
      this.getListData();
    },
    // 获取子组件筛选项传值
    searchFilter(obj) {
      this.currentValue = false;
      this.sort = obj.value
      this.selectNameList[0].categoryName = obj.name
      this.selectNameList[0].otherName = obj.name
      this.getListData()
    },
    changeStatus(val, index) {
      this.selectNameList.forEach((item) => {
        item.status = false;
      });
      val.status = true;
      this.currentValue = true;
    },
    handleChange(val) {
      this.start = val;
      this.getListData();
    },
    getStartList() {
      this.start = 1;
      this.getListData();
    },
    getListData() {
      this.loading = true
      this.params = {};
        this.params = {
          pageSize: this.pageSize,
          pageNo: this.start,
          keywords: this.keyWords,
          sort: this.sort
        };
      esPageFile(this.params).then(res => {
        if(res.data.code == 0){
          this.nuticeArr = res.data.data.fileList;
          this.total = res.data.data.total;
          if (res.data.data.fileList.length == 0) {
            this.showMsg = 1;
          } else {
            this.showMsg = 0;
          }
          this.loading = false
        }else{
          this.showMsg = 0;
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created(){
    if(this.$route.query.search){
      this.keyWords = this.$route.query.search
    }
  },
  mounted() {
    this.$refs.header.searchValue = this.keyWords
    this.getStartList()
  },
};
</script>

<style scoped>
.policy_list {
  position: relative;
  width: 100%;
}
.eassy_position {
  margin-top: 4.2rem;
  display: flex;
  flex-wrap: wrap;
}
.page_limit {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.53333333333rem;
  margin-bottom: 2rem;
}
.null_search {
  color: #aaaaaa;
  font-size: 0.426666666667rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4.5rem;
}
.nutice_filter {
  height: 1.38666666667rem;
  background: #FFFFFF;
  position: fixed;
  top: 2.5rem;
  z-index: 4;
  width: 100%;
  border-bottom: 1px solid #F4F6F8;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.03);
}
.filter_more {
  height: 1.38666666667rem;
  background: #FFFFFF;
  position: fixed;
  top: 5rem;
  z-index: 4;
  width: 100%;
}
ul,
li {
  list-style: none;
}
.filter_type_one ul {
  display: flex;
  font-size: 0.37333333333rem;
  color: #333333;
  width: 35%;
}
.filter_type_one ul li {
  flex: 1.2;
  height: 1.38666666667rem;
  line-height: 1.38666666667rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.filter_type_one ul > li:last-of-type {
  margin-left: -0.366666666667rem;
  flex: 1;
  margin-right: 0.12666666667rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.type_one_border {
  padding: 0.48rem 0 0.42rem;
  /* border-bottom: 0.04rem solid #36a6fe; */
  color: #36a6fe;
}
.type_one_angle {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 0.15rem solid transparent;
  border-right: 0.15rem solid transparent;
  border-top: 0.15rem solid #B4B4B4;
  border-radius: 0.0625rem;
}
.type_seleted {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 0.15rem solid transparent;
  border-right: 0.15rem solid transparent;
  border-top: 0.15rem solid #36a6fe;
  border-radius: 0.0625rem;
}
.divider {
  width: 100%;
  height: 1px;
  background: rgba(209, 209, 214, 1);
}
.filtrate-footer {
  width: 100%;
  background: #fff;
  position:fixed;
  bottom:0;
  padding: 0.3rem 0.4rem;
  border-top: 1px solid #F4F6F8;
  display: flex;
  align-items: center;
}
.filtrate-footer img {
  width: 0.53333333333rem;
  height: 0.53333333333rem;
}
.search-btn {
  flex: 1;
}
.reset {
  text-align: center;
  margin-left: 0.34rem;
}
.reset-txt {
  font-size: 0.37333333333rem;
  color: #333333;
}
.search-btn div {
  text-align: center;
  width: 90%;
  margin-left: 8%;
  font-size: 0.37333333333rem;
  line-height: 0.96rem;
  background: #36A6FE;
  color: #fff;
  border-radius: 4px;
}
.font_color {
  color: #36a6fe;
}
.filtrate-more{
  height:5rem;
  overflow-y: scroll ; 
  position: relative;
}
.filtrate-wrapper-sort {
  padding: 0.4rem 0.4rem;
  padding-bottom: 0.46rem;
  overflow-y: scroll;
  height: 4.5rem;
}
 
.filtrate-title {
  margin-top: 0.4rem;
  font-weight: bold;
  color: #000000;
  font-size: 16px;
}
.filtrate-item-sort {
  padding: 0.02rem 0.2rem 0.2rem 0.10rem;
  width: 100%;
  /* min-height:3rem; */
}
.filtrate-item-sort{
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* min-height:3rem; */
}
.rank-item {
  width: 2rem;
  height: 0.8rem;
  background: #F8F8F7;
  opacity: 1;
  border-radius: 5px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 0.8rem;
  color: #333333;
  opacity: 1;
  margin-right: 0.2rem;
  margin-top: 0.2rem;
}
.chooseRank {
  color: #FFFFFF;
  background: #36A6FE
}
.divider {
  width: 100%;
  height: 1px;
  background: rgba(209, 209, 214, 1);
}
.filtrate-footer-sort {
  width: 100%;
  background: #fff;
  position: fixed;
  bottom: 0;
  padding: 0.3rem 0.4rem 0.3rem 0rem;
  border-top: 1px solid rgba(209, 209, 214, 1);
  display: flex;
  align-items: center;
}
.filtrate-footer-sort img {
  width: 0.53333333333rem;
  height: 0.53333333333rem;
}
.search-btn {
  flex: 1;
}
.reset {
  border: 1px solid #999999;
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  font-weight: 400;
  flex: 1;
  display: flex;
  margin-right: 3%;
  justify-content: center;
  align-items: center; 
  margin-left: 0.34rem;
  border-radius: 34px;
  color: #333333;
}
.reset-txt {
  font-size: 0.37333333333rem;
  color: #333333;
}
.search-btn div {
  text-align: center;
  width: 100%;
  font-size: 0.37333333333rem;
  line-height: 0.96rem;
  background: #36A6FE;
  color: #FFFFFF;
  border-radius: 34px;
}
.filtrate-item-sort .el-checkbox__inner {
  display: none !important;
}
.filtrate-item-sort .el-checkbox {
  margin-right: 2% !important;
  text-align: center;
  width: 23% !important;
  background: rgba(241, 241, 241, 1);
  border-radius: 2px;
  line-height: 26px !important;
}
.filtrate-item-sort .el-checkbox:nth-child(4n + 4) {
  margin-right: 0 !important;
}
.filtrate-item-sort .el-checkbox__label {
  padding-left: 0 !important;
  font-size: 0.32rem !important;
}
.filtrate-item-sort .is-checked {
  background: rgba(61, 133, 220, 0.16);
}
.ques_tag {
  position: fixed;
  width: 1.173333333333333rem;
  height: 1.173333333333333rem;
  line-height: 1.173333333333333rem;
  background: #36a6fe;
  border-radius: 50%;
  box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16); 
  bottom: 4rem;
  right: 0.2rem;
  font-size: 0.373333333333333rem;
  font-family: Source Han Sans CN, Source Han Sans CN-Bold;
  font-weight: 700;
  text-align: center;
  color: #ffffff;
  z-index: 9999;
}
</style>