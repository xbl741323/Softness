<template>
  <div class="policy_list" v-loading.fullscreen.lock="loading">
    <!-- 头部搜索栏 -->
    <nutice-header
      ref="header"
      @close_filter="closeFilter"
      :title="title"
      @search_result="getSearch"
      :type="type"
      v-if="showStatus ==true"
    ></nutice-header>
    <!-- 筛选框tab -->
    <nutice-filter
      v-if="showStatus == true"
      ref="filter"
      @sort-change="sortChange"
      @close_search="closeSearch"
      @start-search="getStartList"
      @filter-data="filterData"
      @clear-Search="clearSearch"
      :classStatus="showStatus"
    ></nutice-filter>
    <!-- 文章列表 -->
    <div :class="[showStatus == true?'eassy_position':'eassy_more']">
      <nutice-item v-for="(item,index) in nuticeArr" :key="index" :nuticeInfo="item" :sort="sort" :showStatus='showStatus' :keyWords="keyWords"></nutice-item>
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
import { getList, getSelection,getPolicyList } from "@/api/policySquare";
import nuticeFilter from "@/components/policySquare/project/projectFilter";
import nuticeItem from "@/components/policySquare/project/projectItem";
import nuticeHeader from "@/components/policySquare/nuticeHeader";
export default {
  name: "projectList",
  components: {
    nuticeHeader,
    nuticeItem,
    nuticeFilter
  },
  layout: "footer",
  head() {
    return {
       title: this.metaTitle,
      meta: [
        { charset: "utf-8" },
        {
          name: "keywords",
          content:
            "科技项目，项目申报，项目申报办法，科技项目申报中心，科技项目申报咨询"
        },
        {
          hid: "description",
          name: "description",
          content:
            "卧涛网，专注科技项目申报十年，上万家科技项目申报成功案例，通过率高！专业团队，多维度服务，为您保驾护航！"
        }
      ],
    };
  },
  data() {
    return {
      loading:true,
      localAreaNo:"",
      filterArea:[],
      skiFrom:false,
      sort:3,
      objList: [],
      obj: {},
      params: {},
      showStatus: true,
      type: 4,
      classList: [],
      scrollTop: 0,
      classifyList: [],
      showMsg: 2,
      metaTitle: this.$t("title.projectMetaTitle"),
      total: 0,
      pageSize: 25,
      title: this.$t("message.projectApply"),
      nuticeArr: [],
      keyWords: "",
      start: 1,
      isNewest: false,
      isHotSpot: false,
      isTitle: true,
      isContent: false,
      paramObj: {
        areaNos: [],
        optionIds: []
      }
    };
  },
  methods: {
    clearSearch() {
      this.keyWords = "";
    },
    filterData(val, number, expectStatus) {
      console.log(val, "输出的选择项");
      console.log(number, "输出的选择项number");
      if (expectStatus == 0) {
        this.isTitle = true;
        this.isContent = false;
      } else if (expectStatus == 1) {
        this.isTitle = false;
        this.isContent = true;
      } else if (expectStatus == 2) {
        this.isTitle = true;
        this.isContent = true;
      }
      this.classifyList.forEach((item, index) => {
        if (item.id == number) {
          if (val[0] == null) {
            item.optionIds = [];
          } else {
            item.optionIds = [];
            val.forEach(iem => {
              item.optionIds.push(iem.id);
            });
          }
        }
      });
      console.log(this.classifyList, "输出最终参数");
    },
    getNameList() {
      getSelection(4).then(res => {
        this.classList = res.data.selection;
        this.filterArea = res.data.area;
        this.classifyList = [];
        this.classList.forEach((item, index) => {
          var obj = {
            id: item.categoryId,
            optionIds: []
          };
          obj.id = item.categoryId;
          this.classifyList.push(obj);
        });
        console.log(this.classifyList, "输出需要的数据结构");
        this.setParams()
        this.getListData();
        if(this.keyWords!==""){
          this.saveTitle()
        }
        if (this.obj.id && this.obj.id !== "") {
          if (this.$refs.filter) {
            this.$nextTick(() => {
              this.$refs.filter.showIndex = 1;
              console.log("输出子组件中的soloFilter",this.$refs.filter.$refs.soloFilter[0])
              this.$refs.filter.$refs.soloFilter[0].changeSelectOption(
                [this.obj],
                this.obj.categoryId,
                3
              );
             this.getListData();
            });
          }
        }
      });
    },
    sortChange(val, resetNumber) {
      if (resetNumber == 10) {
        this.isTitle = true;
        this.isContent = false;
        this.classifyList.forEach((item, index) => {
          item.optionIds = [];
        });
      }
      if (val == 0) {
        this.isNewest = false;
        this.isHotSpot = false;
        this.sort = 3
      } else if (val == 1) {
        this.isNewest = true;
        this.isHotSpot = false;
        this.sort = 1
      } else {
        this.isNewest = false;
        this.isHotSpot = true;
        this.sort = 0
      }
    },
    getSearch(val) {
      console.log("输出搜索点击方法");
      this.keyWords = val;
      this.start = 1;
      this.$refs.filter.resetChoose();
      if (this.keyWords !== "") {
        this.$nextTick(() => {
          this.$refs.filter.getDataAfterSearch();
          this.$refs.filter.setAfterSearch();
        });
      }
      window.open("/project?search="+this.keyWords,"_self")
      this.getListData();
    },
    handleChange(val) {
      this.start = val;
      this.getListData();
      sessionStorage.setItem("projectPage", this.start);
    },
    getStartList(val) {
      this.paramObj = val;
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
    getListData() {
      this.loading = true
      this.params = {};
      this.params = {};
      if(this.localAreaNo == 100000){
        
      }else{
       if(this.paramObj.areaNos.length == 0){
       this.filterArea.forEach(item=>{
        if(this.localAreaNo == item.value){
          item.children.forEach(it=>{
            this.paramObj.areaNos.push(it.value)
          })
        }
          console.log(this.areaList,"输出地区切换的！")
        })
      }
      }
        this.params = {
          type: 4,
          size: this.pageSize,
          start: this.start,
          areaNos: this.newArr(this.paramObj.areaNos),
          categories: this.classifyList,
          keyWords: this.keyWords,
          isNewest: this.isNewest,
          isHotSpot: this.isHotSpot,
          isTitle: this.isTitle,
          isContent: this.isContent
        };
      sessionStorage.setItem("projectParams",JSON.stringify(this.params))
      getPolicyList(this.params).then(res => {
        this.total = res.data.policyList.total;
        this.nuticeArr = res.data.policyList.list;
        if (this.total == 0) {
          this.showMsg = 1;
        } else {
          this.showMsg = 0;
        }
        this.loading = false
      });
    },
    closeSearch() {
      if (this.$refs.header) {
        this.$refs.header.searchWindow = false;
      }
    },
    closeFilter() {
      this.$refs.filter.currentValue = false;
    },
    handleScroll() {
      this.scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
        console.log(this.scrollTop,"输出scrollTop")
        sessionStorage.setItem("proSLocation",this.scrollTop);
    },
    toLocation() {
      if (sessionStorage && sessionStorage.getItem("proSLocation")) {
       this.scrollTop = sessionStorage.getItem("proSLocation");
       console.log(this.scrollTop,"输出his.scrollTop")
      }
        window.scrollTo(0, 300);
    },
    saveArea(){
      this.$refs.filter.showIndex = 0;
      if(this.paramObj.areaNos.length!==0){
      let area = this.newArr(this.paramObj.areaNos)
      this.$refs.filter.$refs.areaFilter.handleCheckedindustryClassify(area);
      }
    },
    saveAreaAfterSearch(){
      this.$refs.filter.showIndex = 1;
      if(this.paramObj.areaNos.length!==0){
      let area = this.newArr(this.paramObj.areaNos)
      this.$refs.filter.$refs.areaFilter.handleCheckedindustryClassify(area);
      }
    },
    //未搜索筛选
    saveSole(){
      if(this.classifyList.length<4){
        this.classifyList.forEach((item,index)=>{
          if(item.optionIds.length!==0){
          this.$refs.filter.showIndex = index+1;
          this.$refs.filter.$refs.soloFilter[index].handleCheckedindustryClassify(item.optionIds)
          console.log(item.optionIds,"输出item.optionId")
          console.log(this.$refs.filter.$refs.soloFilter[index],"输出solo组件")
        }
      })
      }else{
        this.classifyList.forEach((item,index)=>{
          if(index<2){
          if(item.optionIds.length!==0){
          this.$refs.filter.showIndex = index+1;
          this.$refs.filter.$refs.soloFilter[index].handleCheckedindustryClassify(item.optionIds)
          console.log(item.optionIds,"输出item.optionId")
          console.log(this.$refs.filter.$refs.soloFilter[index],"输出solo组件")
        }
        }
        if(index>=2){
          if(item.optionIds.length!==0){
          this.$refs.filter.showIndex = 3;
          this.$refs.filter.$refs.moreFilter[index-2].handleCheckedindustryClassify(item.optionIds)
          console.log(item.optionIds,"输出item.optionId")
          console.log(this.$refs.filter.$refs.moreFilter[index-2],"输出solo组件")
        }
        }
      })
      }
    },
    //搜索后筛选
    saveSoleAfterSearch(){
      if(this.classifyList.length<3){
        this.classifyList.forEach((item,index)=>{
          if(item.optionIds.length!==0){
          this.$refs.filter.showIndex = index+2;
          this.$refs.filter.$refs.soloFilter[index].handleCheckedindustryClassify(item.optionIds)
          console.log(item.optionIds,"输出item.optionId")
          console.log(this.$refs.filter.$refs.soloFilter[index],"输出solo组件")
        }
      })
      }else{
        this.classifyList.forEach((item,index)=>{
          if(index<1){
          if(item.optionIds.length!==0){
          this.$refs.filter.showIndex = index+2;
          this.$refs.filter.$refs.soloFilter[index].handleCheckedindustryClassify(item.optionIds)
          console.log(item.optionIds,"输出item.optionId")
          console.log(this.$refs.filter.$refs.soloFilter[index],"输出solo组件")
        }
        }
        if(index>=1){
          if(item.optionIds.length!==0){
          this.$refs.filter.showIndex = 3;
          this.$refs.filter.$refs.moreFilter[index-1].handleCheckedindustryClassify(item.optionIds)
          console.log(item.optionIds,"输出item.optionId")
          console.log(this.$refs.filter.$refs.moreFilter[index-1],"输出solo组件")
        }
        }
      })
      }
    },
    saveSort(){
      if(this.isNewest){
        this.$refs.filter.$refs.sortFilter.toggleRank(1);
      }else if(this.isHotSpot) {
        this.$refs.filter.$refs.sortFilter.toggleRank(2);
      }else{
        this.$refs.filter.$refs.sortFilter.toggleRank(0);
      }
    },
    saveTitle(){
      this.$refs.filter.showIndex = 0;
      if(this.isTitle==true&&this.isContent==false){
        this.$refs.filter.$refs.titleFilter.handleCheckedindustryClassify(["按标题"]);
        this.$refs.filter.selectNameList[0].categoryName = "按标题"
      }else if(this.isTitle==false&&this.isContent==true){
        this.$refs.filter.$refs.titleFilter.handleCheckedindustryClassify(["按内容"]);
        this.$refs.filter.selectNameList[0].categoryName = "按内容"
      }else if(this.isTitle==true&&this.isContent==true){
        this.$refs.filter.$refs.titleFilter.handleCheckedindustryClassify(["按标题","按内容"]);
        this.$refs.filter.selectNameList[0].categoryName = "按标题，按内容"
      }
    },
    setParams(){
      if(this.skiFrom){
      if(sessionStorage.getItem("projectParams")){
      let params = JSON.parse(sessionStorage.getItem("projectParams"))
      console.log(params,"params")
      this.start = params.start
      this.paramObj.areaNos = params.areaNos
      if(this.paramObj.areaNos.length>1){
        this.paramObj.areaNos = []
      }
      this.classifyList = params.categories
      this.keyWords = params.keyWords
      this.isNewest = params.isNewest
      this.isHotSpot = params.isHotSpot
      this.isTitle = params.isTitle
      this.isContent = params.isContent
      console.log(this.classifyList,"this.classifyList")
      this.saveSort()
      if(this.keyWords!==""){
        this.saveAreaAfterSearch()
        this.saveSoleAfterSearch()
      }else{
        this.saveArea()
        this.saveSole()
      }
      }
    }
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
    if(this.$route.query.skiFrom){
      this.skiFrom = this.$route.query.skiFrom
      }
    if (this.$route.query.obj) {
      this.objList = [];
      this.obj = {};
      let info = this.$route.query.obj;
      this.obj.id = info.optionId;
      this.obj.name = info.optionName;
      this.obj.categoryId = info.categoryId;
      this.objList.push(this.obj);
    }
  },
  mounted() {
     if (sessionStorage.getItem("localAreaNo")) {
      this.localAreaNo = sessionStorage.getItem("localAreaNo");
      console.log(this.localAreaNo,"localAreaNo")
    } 
    // window.addEventListener("scroll", this.handleScroll, true);
    this.$refs.header.searchValue = this.keyWords
    if (this.keyWords !== "") {
        this.$refs.filter.getDataAfterSearch();
        this.$refs.filter.setAfterSearch();
      }
    this.getNameList();
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

