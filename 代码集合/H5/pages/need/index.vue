<template>
  <div class="policy_list" v-loading.fullscreen.lock="loading">
    <!-- 头部搜索栏 -->
    <nutice-header
      ref="header"
      @close_filter="closeFilter"
      :title="title"
      @search_result="getSearch"
      @show-change="showChange"
      :type="type"
      v-if="showStatus ==true"
    ></nutice-header>
    <!-- 筛选框tab -->
    <result-filter
      v-show="tabIndex == 0"
      ref="result"
      @sort-change="sortChange"
      @close_search="closeSearch"
      @start-search="getStartList"
      @filter-data="filterData"
      @clear-Search="clearSearch"
      :classStatus="showStatus"
    ></result-filter>
    <need-filter
      v-show="tabIndex == 1"
      ref="need"
      @sort-change="sortChange"
      @close_search="closeSearch"
      @start-search="getStartList"
      @filter-data="filterData"
      @clear-Search="clearSearch"
      :classStatus="showStatus"
    ></need-filter>
    <!-- 文章列表 -->
    <div :class="[showStatus == true?'eassy_position':'eassy_more']">
      <div v-if="tabIndex == 0"><result-item v-for="(item,index) in nuticeArr" :key="index" :nuticeInfo="item" :sort="sort" :showStatus='showStatus' :keyWords="keyWords"></result-item></div>
      <div v-else><need-item v-for="(item,index) in nuticeArr" :key="index" :nuticeInfo="item" :sort="sort" :showStatus='showStatus' :keyWords="keyWords"></need-item></div>
    </div>
    <div style="width: 100%;" class="page_limit" v-if="showMsg == 0">
      <el-pagination
        :page-size="pageSize"
        @current-change="handleChange"
        background
        :current-page="start"
        :pager-count="5"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <div v-if="showMsg == 1" class="null_search">{{ $t('message.noMoreData') }}</div>
  </div>
</template>

<script>
import { getResultList,getNeedList } from "@/api/technology"
import resultFilter from "@/components/technology/resultFilter";
import needFilter from "@/components/technology/needFilter";
import resultItem from "@/components/technology/result-item";
import needItem from "@/components/technology/need-item";
import nuticeHeader from "@/components/technology/needHeader";
export default {
  name: "projectList",
  components: {
    nuticeHeader,
    resultItem,
    needItem,
    resultFilter,
    needFilter
  },
  layout: "footer",
  head() {
    return {
      title: "【卧涛网】专业科技成果转化平台，找技术就上卧涛网",
      meta: [
        { charset: "utf-8" },
        {
          name: "keywords",
          content:
            "技术转让,买技术,技术创新"
        },
        {
          hid: "description",
          name: "description",
          content:
            "上卧涛网，免费发布科技成果需求，平台提供专业的技术交易、专利转让服务。致力于构建企业、高校和科研机构之间的技术转移快速通道，帮助企业解决技术难题，加快科技发展脚步。"
        }
      ],
    };
  },
  data() {
    return {
      tabIndex:1,
      loading:true,
      sort:3,
      objList: [],
      obj: {},
      params: {},
      showStatus: true,
      type: 4,
      showMsg: 2,
      metaTitle: this.$t("title.projectMetaTitle"),
      total: 0,
      pageSize: 25,
      title: this.$t("message.projectApply"),
      nuticeArr: [],
      keyWords: "",
      start: 1,
      isNewest: true,
      isHotSpot: false,
      requirementType:"",
      technologyType:"",
      industry:"",
      tradeType:"",
      maturity:"",
      tradePrice:"",
    };
  },
  methods: {
    showChange(index){
      this.tabIndex = index
      if(this.tabIndex == 0){
        this.$refs.result.clearSearch()
      }else{
        this.$refs.need.clearSearch()
      }
      console.log(index,"输出index")
    },
    clearSearch() {
      this.keyWords = "";
      this.start = 1
      this.technologyType="",
      this.requirementType=""
      this.industry="",
      this.tradeType="",
      this.maturity="",
      this.tradePrice="",
      this.isNewest = true
      this.getListData()
    },
    filterData(val, number, expectStatus) {
      console.log(val,"ssssssssssss")
      if(val.length!==0){
        if(val[0].categoryId&&val[0].categoryId==5){
        this.industry = val[0].id
      }else if(val[0].type == "tradeType"){
        this.tradeType = val[0].dropdownKey
      }else if(val[0].type == "technologyType"){
        this.technologyType = val[0].dropdownKey
      }else if(val[0].type == "maturity"){
        this.maturity = val[0].dropdownKey
      }else if(val[0].type == "tradePrice"){
        this.tradePrice = val[0].dropdownKey
       }else if(val[0].type == "requirementType"){
        this.requirementType = val[0].dropdownKey
      }
      }
    },
    sortChange(val,resetNumber) {
      if (val == 0) {
        this.isNewest = true;
        this.isHotSpot = false;
        this.sort = 1
      } else if (val == 1) {
        this.isNewest = false;
        this.isHotSpot = true;
        this.sort = 0
      }
    },
    getSearch(val) {
      this.keyWords = val;
      this.start = 1;
      this.getListData();
    },
    handleChange(val) {
      this.start = val;
      this.getListData();
      sessionStorage.setItem("projectPage", this.start);
    },
    getStartList() {
      this.start = 1;
      this.getListData();
    },
    //es6中利用Set去重
    newArr(arr){
      if(arr.length!==0){
        return Array.from(new Set(arr))
      }else{
        return []
      }
    },
    getResultData(){
    this.loading = true
      this.params = {};
        this.params = {
          pageNo: this.start,
          pageSize: this.pageSize,
          achievementName: this.keyWords,
          orderBy:this.isNewest==true?1:2,
          technologyType:this.technologyType,
          industry:this.industry,  
          tradeType:this.tradeType,
          maturity:this.maturity,
          tradePrice:this.tradePrice,
          type:8
        }
      sessionStorage.setItem("resultParams",JSON.stringify(this.params))
      getResultList(this.params).then(res => {
        this.total = res.data.total;
        this.nuticeArr = res.data.records;
        if (this.total == 0) {
          this.showMsg = 1;
        } else {
          this.showMsg = 0;
        }
        this.loading = false
      });
    },
    getNeedData(){
      this.loading = true
      this.params = {};
        this.params = {
          pageNo:this.start,
          pageSize:this.pageSize,
          requirementName:this.keyWords,
          requirementType:this.requirementType,
          industry: this.industry,
          orderBy:this.isNewest==true?1:2, //1，最新，2最热
          type:7
      }
      sessionStorage.setItem("needParams",JSON.stringify(this.params))
      getNeedList(this.params).then(res => {
        this.total = res.data.total;
        this.nuticeArr = res.data.records;
        if (this.total == 0) {
          this.showMsg = 1;
        } else {
          this.showMsg = 0;
        }
        this.loading = false
      });
    },
    getListDataNoce(){
      if(this.tabIndex == 0){
        this.setResultParams()
        this.getResultData()
      }else{
        this.setNeedParams()
        this.getNeedData()
      }
    },
    getListData() {
      if(this.tabIndex == 0){
        this.getResultData()
      }else{
        this.getNeedData()
      }
    },
    closeSearch() {
      if (this.$refs.header) {
        this.$refs.header.searchWindow = false;
      }
    },
    closeFilter() {
      if(this.$refs.result){
        this.$refs.result.currentValue = false;
      }
    },
    saveResultSort(){
      this.$refs.result.showIndex = 4
      if(this.isNewest){
        this.$refs.result.$refs.sortFilter.toggleRank(0);
      }else{
        this.$refs.result.$refs.sortFilter.toggleRank(1);
      }
    },
    saveNeedSort(){
      this.$refs.need.showIndex = 4
      if(this.isNewest){
        this.$refs.need.$refs.sortFilter.toggleRank(0);
      }else{
        this.$refs.need.$refs.sortFilter.toggleRank(1);
      }
    },
    classSoloOperate(num){
      switch(num){
        case 0:
        this.$refs.result.showIndex = 0
        this.$refs.result.$refs.soloFilter[0].handleCheckedindustryClassify(this.industry)
        this.$refs.result.$refs.soloFilter[0].industryClassify = this.industry == ""?null:this.industry
        break;
        case 1:
        this.$refs.result.showIndex = 1
        this.$refs.result.$refs.soloFilter[1].handleCheckedindustryClassify(this.technologyType)
        this.$refs.result.$refs.soloFilter[1].industryClassify = this.technologyType == ""?null:this.technologyType
        break;
        case 2:
        this.$refs.result.showIndex = 2
        this.$refs.result.$refs.soloFilter[2].handleCheckedindustryClassify(this.tradeType)
        this.$refs.result.$refs.soloFilter[2].industryClassify = this.tradeType == ""?null:this.tradeType
        break;
      }
    },
    classNeedOperate(num){
      switch(num){
        case 0:
        this.$refs.need.showIndex = 0
        this.$refs.need.$refs.soloFilter[0].handleCheckedindustryClassify(this.industry)
        this.$refs.need.$refs.soloFilter[0].industryClassify = this.industry == ""?null:this.industry
        break;
        case 1:
        this.$refs.need.showIndex = 1
        this.$refs.need.$refs.soloFilter[1].handleCheckedindustryClassify(this.technologyType)
        this.$refs.need.$refs.soloFilter[1].industryClassify = this.requirementType == ""?null:this.requirementType
        break;
      }
    },
    classMoreOperate(num){
      switch(num){
        case 0:
        this.$refs.result.showIndex = 0
        this.$refs.result.$refs.moreFilter[0].handleCheckedindustryClassify(this.maturity)
        this.$refs.result.$refs.moreFilter[0].industryClassify = this.maturity == ""?null:this.maturity
        break;
        case 1:
        this.$refs.result.showIndex = 1
        this.$refs.result.$refs.moreFilter[1].handleCheckedindustryClassify(this.tradePrice)
        this.$refs.result.$refs.moreFilter[1].industryClassify = this.tradePrice == ""?null:this.tradePrice
        break;
      }
    },
    setNeedParams(){
      if(sessionStorage.getItem("needParams")){
      let params = JSON.parse(sessionStorage.getItem("needParams"))
      console.log(params,"params")
      this.start = params.pageNo
      this.keyWords = params.requirementName
      this.isNewest = params.orderBy == 1?true:false
      this.requirementType = params.requirementType
      this.industry = params.industry
      }
      console.log(this.$refs.result.$refs.moreFilter,"this.$refs.filter.$refs.soloFilter")
      this.$nextTick(()=>{
        this.saveNeedSort()
        this.classNeedOperate(0)
        this.classNeedOperate(1)
      })
    },
    setResultParams(){
      if(sessionStorage.getItem("resultParams")){
      let params = JSON.parse(sessionStorage.getItem("resultParams"))
      console.log(params,"params")
      this.start = params.pageNo
      this.keyWords = params.achievementName
      this.isNewest = params.orderBy == 1?true:false
      this.technologyType = params.technologyType
      this.industry = params.industry
      this.tradeType = params.tradeType
      this.maturity = params.maturity
      this.tradePrice = params.tradePrice
      }
      console.log(this.$refs.result.$refs.moreFilter,"this.$refs.filter.$refs.soloFilter")
      this.$nextTick(()=>{
        this.saveResultSort()
        this.classSoloOperate(0)
        this.classSoloOperate(1)
        this.classSoloOperate(2)
        this.classMoreOperate(0)
        this.classMoreOperate(1)
      })
    }
  },
  destroyed(){
    if(sessionStorage.getItem("needParams")){
      sessionStorage.removeItem("needParams")
    }
  },
  created() {
    if(this.$route.query.search){
      this.keyWords = this.$route.query.search
      console.log(this.keyWords,"输出this.keyWords")  
    }
    if(this.$route.query.page){
      this.start = Number(this.$route.query.page)
      console.log(this.start,"输出this.start")
    }
  },
  mounted() {
    this.getListDataNoce()
    this.$refs.header.searchValue = this.keyWords
  }
};
</script>

<style scoped>
.policy_list {
  position: relative;
  width: 100%;
}
.eassy_position {
  margin-top: 2.56rem;
}
.eassy_more {
  margin-top: 3.73333333333rem;
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
  margin-top: 0.8rem;
  padding-top: 0.8rem;
}
</style>

