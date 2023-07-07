<template>
  <div class="policy_list" v-loading.fullscreen.lock="loading">
    <!-- 头部搜索栏 -->
     <nutice-header
      ref="header"
      :title="title"
      @search="getSearch"
    ></nutice-header>
    <!-- 筛选项 -->
    <div :class="[showStatus == true ? 'nutice_filter' : 'filter_more']">
      <popup v-model="currentValue" >
        <filter-filter 
          :showIndex="showIndex"
          :type="type"
          :rankData="rankData" 
          :active="showIndex==1?localAreaNo:showIndex==2?assemblyType:comprehensiveSort"
          @search-filter="searchFilter"
        >
        </filter-filter>
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
    <div :class="[showStatus == true ? 'eassy_position' : 'eassy_more']">
      <nutice-item
        v-for="(item, index) in nuticeArr"
        :key="index"
        :nuticeInfo="item"
        :sort="sort"
        :showStatus='showStatus'
        :keyWords="keyWords"
      ></nutice-item>
    </div>
    <div style="width: 100%" class="page_limit" v-if="showMsg == 0">
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
    <div v-if="showMsg == 1" class="null_search">暂无数据</div>
  </div>
</template>

<script>
import { getSelection, esPagePolicy } from "@/api/policySquare";
import nuticeItem from "@/components/policySquare/nutice/nuticeItem";
import nuticeHeader from "@/components/policySquare/searchBox/searchBox";
import Popup from "@/components/policySquare/popup";
import filterFilter from "@/components/policySquare/filterItems/filterFilter";
import * as policyData from '@/pages/policy/policy-data';
import { getNewArea } from "@/api/home";
export default {
  name: "nuticeList",
  components: {
    nuticeHeader,
    nuticeItem,
    Popup,
    filterFilter
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
            "项目申报通知，项目政策公告"
        },
        {
          hid: "description",
          name: "description",
          content:
            "卧涛网平台汇集全国各地市科技项目申报通知、项目政策公告，及时更新，快速查询。落地企业项目申报最后一公里。"
        }
      ],
    };
  },
  data() {
    return {
      loading:false,
      localAreaNo:"",
      filterArea:[],
      skiFrom:false,
      areaObj: {},
      sort: 1,
      params: {},
      showStatus: true,
      type: 1,
      classList: [],
      scrollTo: 0,
      classifyList: [],
      showMsg: 2,
      metaTitle: this.$t("title.nuticeMetaTitle"),
      total: 0,
      pageSize: 50,
      title: this.$t("message.policyEdit"),
      nuticeArr: [],
      keyWords: "",
      start: 1,
      isNewest: true,
      isHotSpot: false,
      isTitle: true,
      isContent: false,
      assemblyType: 0,//行业类型
      comprehensiveSort: 0,//综合排序
      paramObj: {
        areaNos: {},
        optionIds: [],
      },
      rankData: [],
      selectNameList: [{
        categoryId: 1,
        categoryName: '地区',
        select: true,
        status: false,
        otherName: '地区'
      },{
        categoryId: 2,
        categoryName: '汇编类型',
        select: true,
        status: false,
        otherName: '汇编类型'
      },{
        categoryId: 3,
        categoryName: '综合排序',
        select: true,
        status: false,
        otherName: '综合排序'
      },
      ],
      selectList: [],
      showIndex: "",
      currentValue: false,
      region: [],
      areaList: []
    };
  },
  methods: {
    resetChoose(){
      this.assemblyType = 0
      this.comprehensiveSort = 0
      this.selectNameList = [{
        categoryId: 1,
        categoryName: '地区',
        select: true,
        status: false,
        otherName: '地区'
      },{
        categoryId: 2,
        categoryName: '汇编类型',
        select: true,
        status: false,
        otherName: '汇编类型'
      },{
        categoryId: 3,
        categoryName: '综合排序',
        select: true,
        status: false,
        otherName: '综合排序'
      }]
      this.getStartList()
    },
    searchFilter(val) {
      this.currentValue = false;
      switch(Number(this.showIndex)){
        case 1:
          this.localAreaNo = val.no
          if(val.no == sessionStorage.getItem("localAreaNo").split(',')[1]){
              this.selectNameList[0].categoryName = this.selectNameList[0].otherName
              this.selectNameList[0].status = false
            }else{
              this.selectNameList[0].categoryName = val.name
              this.selectNameList[0].status = true
          }
          break;
        case 2:
          this.assemblyType = val.no
          if(val.no == 0){
              this.selectNameList[1].categoryName = this.selectNameList[1].otherName
              this.selectNameList[1].status = false
            }else{
              this.selectNameList[1].categoryName = val.name
              this.selectNameList[1].status = true
          }
          break;
        case 3:
          this.comprehensiveSort = val.no
          if(val.no == 0){
              this.selectNameList[2].categoryName = this.selectNameList[2].otherName
              this.selectNameList[2].status = false
            }else{
              this.selectNameList[2].categoryName = val.name
              this.selectNameList[2].status = true
          }
          break;    
      }
      this.getListData();
    },
    changeStatus(val, index) {
      this.showIndex = val.categoryId;
      this.selectNameList.forEach((item) => {
        item.status = false;
      });
      val.status = true;
      this.currentValue = true;
      if(this.showIndex==1){
        this.rankData = this.areaList
      }else if(this.showIndex==2){
        this.rankData = this.classList
      }else{
        this.rankData = policyData.sortData
      }
    },
    getNameList() {
      getSelection(1).then((res) => {
        this.classList = res.data.selection[0].options;
        this.classList.forEach((item, index) => {
          item.no = item.id
        });
        let obj = {
          id: 0,
          name: '全部',
          no: 0
        }
        this.classList = [obj].concat(this.classList)
      });
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
    getListData() {
        this.loading = true
        this.params = {
          type: 1,
          pageSize: this.pageSize,
          pageNo: this.start,
          areaNo: this.localAreaNo,
          keywords: this.keyWords,
          sort: this.comprehensiveSort == 0 ? 'hottest' : 'latest',
          optionId: this.assemblyType == 0 ? null : this.assemblyType,
          level: '全部'
        };
        sessionStorage.setItem("projectParams",JSON.stringify(this.params))
        esPagePolicy(this.params).then((res) => {
          this.loading = false
          if(res.data.code == 0){
            this.total = res.data.data.total;
            this.nuticeArr = res.data.data.policyList;
            if (res.data.data.policyList.length == 0) {
              this.showMsg = 1;
            } else {
              this.showMsg = 0;
            }
          }
        });
    },
    // 获取地区数据
    getNewArea(){
      getNewArea().then(res => {
        if(res.data.code == 0){
          this.region = JSON.parse(JSON.stringify(res.data.data))
          res.data.data.forEach(item => {
            item.children.forEach(cItem => {
              if(cItem.no == this.localAreaNo){
                this.areaList = [cItem].concat(cItem.children)
              }
            });
          });
          sessionStorage.setItem('district', JSON.stringify(res.data.data))
        }
      }).catch(error => {
          console.log(error)
      })
    },
  },
  watch: {
    "$store.state.Set_LocationNo":{
      deep:true,
      handler:function(newVal,oldVal){
        let data = this.region
        this.localAreaNo = newVal.split(',')[1]
        let arr = newVal.split(',')
        this.getStartList()
        data.forEach(item=>{
          item.children.forEach(citem =>{
            if(citem.no == arr[1]){
              this.areaList = [citem].concat(citem.children)
            }
          })
        })
        if(newVal != oldVal){
          this.resetChoose()
        }
      }
    },
  },
  created() {
    if(this.$route.query.search){
      this.keyWords = this.$route.query.search
    }
    if(this.$route.query.page){
      this.start = Number(this.$route.query.page)
    }
    if(this.$route.query.skiFrom){
      this.skiFrom = this.$route.query.skiFrom
      }
    if (this.$route.query.areaObj) {
      this.areaObj = {};
      this.areaObj.value = this.$route.query.areaObj.areaNo;
      this.areaObj.label = this.$route.query.areaObj.areaName;
    }
    this.$nextTick(()=>{
      this.getNewArea()
      this.getNameList()
    })
    
  },
  mounted() {
    if (sessionStorage.getItem("localAreaNo")) {
      this.localAreaNo = sessionStorage.getItem("localAreaNo").split(',')[1];
    } 
    this.$refs.header.searchValue = this.keyWords
    this.getStartList();
  },
};
</script>

<style scoped>
.policy_list {
  position: relative;
  width: 100%;
}
.eassy_position {
  margin-top: 3.9rem;
}
.eassy_more {
  border-bottom: 1px solid #e7e6eb;
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
  margin-top: 4.5rem;
}
.nutice_filter {
  height: 1.38666666667rem;
  background: #FFFFFF;
  position: fixed;
  top: 2.7rem;
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
  margin-left: 0.02666666667rem;
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
</style>

