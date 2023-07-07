<template>
  <div :class="[classStatus == true ? 'nutice_filter' : 'filter_more']">
    <popup v-model="currentValue" ref="popup">
      <!-- 具体条件选项区域 -->
      <title-filter-classify
        v-show="afterSearch == 0 && showIndex == 0"
        :optionsObj="expectObj"
        @industry-change="getTitleOvl"
        @search-filter="searchFilter"
        @reset-change="clearSearch"
        ref="titleFilter"
        :type="type"
      ></title-filter-classify>
      <area-classify
        v-show="showIndex == areaNumber"
        :area="areaList"
        :title="title"
        ref="areaFilter"
        @search-filter="searchFilter"
        @industry-change="getAreaOvl"
        @reset-change="clearSearch"
        :type="type"
      ></area-classify>
      <div v-if="this.selectNameList.length <= 4">
        <div v-for="(item, index) in selectList.selection" :key="index">
          <filter-classify
            v-show="showIndex == index + filterNumber"
            :optionsObj="item"
            ref="soloFilter"
            @industry-change="getSelectOvl"
            @search-filter="searchFilter"
            @reset-change="clearSearch"
            :type="type"
          ></filter-classify>
        </div>
      </div>
      <div v-else>
        <div v-show="showIndex !== 4">
          <div v-for="(item, index) in selectList.selection" :key="index">
            <filter-classify
              v-show="showIndex == index + filterNumber && showIndex !== 3"
              :optionsObj="item"
              @industry-change="getSelectOvl"
              @search-filter="searchFilter"
              @reset-change="clearSearch"
              ref="soloFilter"
              :type="type"
            ></filter-classify>
          </div>
        </div>
        <div v-show="showIndex == 3" class="filtrate-more" ref="wrapper">
          <div>
            <more-classify
            v-for="(item, index) in selectOtherList" :key="index"
              @industry-change="getSelectOvl"
              @reset-change="clearSearch"
              :optionsObj="item"
              :type="type"
              ref="moreFilter"
            ></more-classify>
          </div>
          <div class="filtrate-footer">
            <div class="reset" @click="clearSearch">
               <p class="reset-txt" @click="resetChoose">{{ $t("button.reset") }}</p>
            </div>
            <div class="search-btn">
              <div @click="searchFilter">
                {{ $t("button.search") }}项目申报
              </div>
            </div>
          </div>
        </div>
      </div>
      <sort-classify
        @sort-change="sortFilter"
        @search-filter="searchFilter"
        @reset-change="clearSearch"
        v-show="showIndex == selectNameList.length - 1"
        ref="sortFilter"
        :type="type"
      ></sort-classify>
    </popup>
    <!-- 一个分类，多个选项时 -->
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
              :class="[item.status == true ? 'type_seleted' : '', 'type_one_angle_project']"
              v-if="item.select == true"
            ></span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import { getSelection } from "@/api/policySquare";
import Popup from "../popup";
import areaClassify from "../classify/areaClassify";
import filterClassify from "../classify/filterClassify";
import moreClassify from "../classify/moreClassify";
import sortClassify from "../classify/projectSortClassify";
import titleFilterClassify from "../classify/titleFilterClassify";
export default {
  props: ["classStatus"],
  components: {
    filterClassify,
    sortClassify,
    moreClassify,
    areaClassify,
    titleFilterClassify,
    Popup,
  },
  data() {
    return {
      localAreaNo:"",
      poupStatus: true,
      filterNumber: 0,
      afterSearch: 10,
      areaNumber: 0,
      resetNumber: 1,
      availbleList: [],
      type: 3,
      selectOtherList: [],
      title: "",
      selectNameList: [],
      selectList: [],
      showIndex: "",
      currentValue: false,
      paramObject: {
        areaNos: [],
        optionsIds: [],
      },
      filterOne: [
        {
          categoryName: this.$t("message.more"),
          status: false,
          select: true,
        },
        {
          categoryName: this.$t("message.sort"),
          status: false,
          select: true,
        },
      ],
      expectSearch: {
        categoryName: "按标题",
        status: false,
        select: true,
      },
      areaList:[],
      expectObj: {
        categoryName: "按标题",
        optionsList: [
          {
            options: "按内容",
          },
        ],
      },
    };
  },
  computed:{
            areaNos(){
                return this.$store.state.areaNo;
            },
            city(){
                return this.$store.state.city;
            },
    },
  methods: {
    closePopup() {
      this.selectNameList.forEach((item) => {
        item.status = false;
      });
      this.showIndex = 0;
    },
    sortFilter(val) {
      if (val == 0) {
        this.selectNameList[this.selectNameList.length-1].categoryName = this.$t("message.sort");
        this.selectNameList[this.selectNameList.length-1].colorStatus = false;
      } else if (val == 1) {
        this.selectNameList[this.selectNameList.length-1].categoryName = this.$t("message.bestNew");
        this.selectNameList[this.selectNameList.length-1].colorStatus = true;
      } else {
        this.selectNameList[this.selectNameList.length-1].categoryName = this.$t("message.bestHot");
        this.selectNameList[this.selectNameList.length-1].colorStatus = true;
      }
      this.$emit("sort-change", val);
    },
    resetPara() {
      this.paramObject.areaNos = [];
      this.paramObject.optionsIds = [];
    },
    clearSearch() {
      this.$emit("clear-Search");
      this.resetChoose();
    },
    resetChoose() {
      console.log(this.$refs.soloFilter,"输出this.$refs.soloFilter")
      this.areaNumber = 0;
      this.resetNumber = 10;
      this.$emit("sort-change", 0, this.resetNumber);
      this.selectNameList.forEach((item) => {
        item.colorStatus = false;
      });
      if (this.selectNameList[this.selectNameList.length - 1]) {
        this.selectNameList[this.selectNameList.length - 1].categoryName = this.$t(
          "message.sort"
        );
      }
      if (this.selectNameList.length > 4) {
        this.selectNameList[3].categoryName = this.$t("message.more");
        if (this.$refs.moreFilter) {
          this.$refs.moreFilter.forEach((el) => (el.industryClassify = null));
        }
      }
      this.closePopup();
      this.currentValue = false;
      this.$refs.areaFilter.industryClassify = null;
      this.$refs.sortFilter.active = 0;
      if (this.$refs.moreFilter) {
        this.$refs.moreFilter.industryClassify = null;
      }
      if(this.$refs.soloFilter){
      this.$refs.soloFilter.forEach((el) => (el.industryClassify = null));
      console.log(this.$refs.soloFilter,"输出this.$refs.soloFilter")
      }
      if (this.$refs.titleFilter) {
        this.$refs.titleFilter.industryClassify = ["按标题"];
      }
      this.resetPara();
      this.getSelectData();
      this.searchGetData();
      this.getSelectName();
    },
    getAreaOvl(val) {
      console.log(val,"输出筛选的地区！");
      this.paramObject.areaNos = [];
      let areaName = [];
      if (val[0] !== null) {
        val.forEach((item) => {
          this.paramObject.areaNos.push(item.value);
          console.log(this.paramObject.areaNos,"输出选择的地区")
          areaName.push(item.label);
          this.selectNameList[this.areaNumber].categoryName = areaName.toString();
          this.selectNameList[this.showIndex].colorStatus = true;
        });
      } else {
        this.selectNameList[this.areaNumber].categoryName = this.availbleList[
          this.areaNumber
        ].otherName;
        this.selectNameList[this.showIndex].colorStatus = false;
      }
    },
    getSelectOvl(val, number, expectStatus) {
      this.$emit("filter-data", val, number, expectStatus);
      let optionName = [];
      if (val[0] !== null) {
          optionName = val[0].name
          this.selectNameList[this.showIndex].categoryName = optionName
          this.selectNameList[this.showIndex].colorStatus = true;
      } else {
        this.selectNameList[this.showIndex].categoryName = this.availbleList[
          this.showIndex
        ].otherName;
        this.selectNameList[this.showIndex].colorStatus = false;
      }
    },
    getTitleOvl(val, number, expectStatus) {
      this.$emit("filter-data", val, number, expectStatus);
      let optionName = [];
      if (val[0] !== null) {
        val.forEach((item) => {
          optionName.push(item);
          this.selectNameList[this.showIndex].categoryName = optionName.toString();
          this.selectNameList[this.showIndex].colorStatus = true;
        });
      } else {
        this.selectNameList[this.showIndex].categoryName = this.availbleList[
          this.showIndex
        ].otherName;
        this.selectNameList[this.showIndex].colorStatus = true;
      }
    },
    getSelectName() {
      getSelection(4).then((res) => {
        let addArr = this.filterOne;
        this.selectNameList = res.data.app;
        this.title = res.data.app[0].categoryName;
        if (this.selectNameList.length <= 4) {
          this.selectNameList.push(addArr[1]);
          this.availbleList = this.selectNameList;
          this.availbleList.forEach((item) => {
            item.otherName = item.categoryName;
          });
          console.log(this.selectNameList, "输出一开始的selectNameList");
        } else {
          this.selectNameList = this.selectNameList.slice(0, 3);
          this.selectNameList = this.selectNameList.concat(addArr);
          this.availbleList = this.selectNameList;
          this.availbleList.forEach((item) => {
            item.otherName = item.categoryName;
          });
          console.log(this.selectNameList, "输出一开始的selectNameList");
        }
      });
    },
    //搜索后筛选项展示
    setAfterSearch() {
      getSelection(4).then((res) => {
        let addArr = this.filterOne;
        this.selectNameList = res.data.app;
        this.title = res.data.app[0].categoryName;
        if (this.selectNameList.length <= 3) {
          this.selectNameList.push(addArr[1]);
          this.selectNameList.unshift(this.expectSearch);
          this.availbleList = this.selectNameList;
          this.availbleList.forEach((item) => {
            item.otherName = item.categoryName;
          });
          this.selectNameList[0].colorStatus = true;
          console.log(this.availbleList);
        } else {
          this.selectNameList = this.selectNameList.slice(0, 2);
          this.selectNameList.unshift(this.expectSearch);
          console.log(this.selectNameList, "输出分类头值");
          this.filterOne.forEach((item) => {
            this.selectNameList.push(item);
          });
          this.selectNameList[0].colorStatus = true;
          console.log(this.selectNameList, "输出分类头值");
          this.availbleList = this.selectNameList;
          this.availbleList.forEach((item) => {
            item.otherName = item.categoryName;
          });
        }
      });
    },
    getDataAfterSearch() {
      getSelection(4).then((res) => {
        this.areaNumber = 1;
        this.afterSearch = 0;
        this.filterNumber = 2;
        this.selectList = res.data;
        this.areaList = res.data.area
        this.selectList.area.forEach(item=>{
          console.log(this.areaNos,"输出地区切areaNos")
          console.log(item.value,"输出地区切avalue")
          if(this.localAreaNo !== '100000'){
            if(this.localAreaNo == item.value){
             this.areaList = item.children
           }
           console.log(this.areaList,"输出地区切换的！")
          }
          })
        this.selectOtherList = this.selectList.selection.slice(1);
      });
    },
    //搜索后筛选项展示-结尾处
    getSelectData() {
      getSelection(4).then((res) => {
        this.areaNumber = 0;
        this.afterSearch = 10;
        this.filterNumber = 1;
        this.selectList = res.data;
        this.areaList = res.data.area
        this.selectList.area.forEach(item=>{
          console.log(this.areaNos,"输出地区切areaNos")
          console.log(item.value,"输出地区切avalue")
           if(this.localAreaNo !== '100000'){
            if(this.localAreaNo == item.value){
             this.areaList = item.children
           }
           console.log(this.areaList,"输出地区切换的！")
          }
           console.log(this.areaList,"输出地区切换的！")
          })
        this.selectOtherList = this.selectList.selection.slice(2);
        console.log(this.selectOtherList);
      });
    },
    initScroll(){
      this.$nextTick(()=>{
        if(!this.scroll){
          if(this.$refs.wrapper){
            const options = {
             click: true,
             tap: true
            };
            this.scroll = new BScroll(this.$refs.wrapper, options);
            }
            }else{
             this.scroll.refresh()
        }
    })
    },
    searchFilter() {
      this.currentValue = false;
      this.searchGetData();
    },
    searchGetData() {
      this.$emit("start-search", this.paramObject);
    },
    changeStatus(val, index) {
      this.$emit("close_search");
      this.showIndex = index;
      this.selectNameList.forEach((item) => {
        item.status = false;
      });
      val.status = true;
      this.currentValue = true;
      this.initScroll()
      if(this.$refs.areaFilter){
        this.$refs.areaFilter.initScroll()
      }
    },
  },
  created(){
    this.initScroll()
  },
  mounted() {
    this.getSelectData();
    this.getSelectName();
    if (this.$refs.popup) {
      this.classStatus == true
        ? (this.$refs.popup.poupStatus = true)
        : (this.$refs.popup.poupStatus = false);
    }
    if (sessionStorage.getItem("localAreaNo")) {
      this.localAreaNo = sessionStorage.getItem("localAreaNo");
      console.log(this.localAreaNo,"localAreaNo")
    } 
  },
};
</script>

<style scoped>
.nutice_filter {
  height: 1.38666666667rem;
  background: #FFFFFF;
  position: fixed;
  top: 1.17333333333rem;
  z-index: 4;
  width: 100%;
  border-bottom: 1px solid #F4F6F8;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.03);
}
.filter_more {
  height: 1.38666666667rem;
  background: #FFFFFF;
  position: fixed;
  top: 2.34666666667rem;
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
  margin-left: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.filter_type_one ul > li:last-of-type {
  margin-left: 0.02666666667rem;
  flex: 0.9;
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
.type_one_angle_project {
  display: inline-block;
  width: 0;
  height: 0;
  margin-bottom: 0.05333333333rem;
  border: 0.09666666667rem solid;
  border-color: transparent transparent #333333#333333 !important;
  transform: rotate(-45deg);
  border-radius: 1px;
}
.type_seleted {
  border-color: transparent transparent #36a6fe #36a6fe !important;
  transform: rotate(135deg);
  margin-bottom: -0.05333333333rem;
  border-radius: 1px;
}
.divider {
  width: 100%;
  height: 1px;
  background: #F4F6F8;
}
.filtrate-footer {
  width: 100%;
  background: #fff;
  position:fixed;
  bottom:0;
  padding: 0.3rem 0.4rem 0.3rem 0rem;
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
  border: 1px solid #999999;
  height: 34px;
  line-height:34px;
  font-size:14px;
  font-weight:400;
  flex:1;
  display:flex;
  margin-right:3%;
  justify-content:center;
  align-items:center;
  margin-left: 0.34rem;
  border-radius:34px;
  color:#333333;
}

.filtrate .reset-txt {
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
.font_color {
  color: #36a6fe;
}
.filtrate-more{
  height:5rem;
  overflow-y: scroll ; 
  position: relative;
}
</style>
