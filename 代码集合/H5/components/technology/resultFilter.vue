<template>
  <div :class="[classStatus == true ? 'nutice_filter' : 'filter_more']">
    <popup v-model="currentValue" ref="popup">
      <!-- 具体条件选项区域 -->
      <div v-if="this.selectNameList.length <= 4">
        <div v-for="(item, index) in selectList" :key="index">
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
          <div v-for="(item, index) in selectList" :key="index">
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
                搜索技术成果
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
import { getSelect,getSelectIndustry } from "@/api/technology"
import BScroll from "better-scroll";
import Popup from "../policySquare/popup";
import filterClassify from "./filterClassify";
import moreClassify from "./moreClassify";
import sortClassify from "../policySquare/classify/sortClassify";
export default {
  props: ["classStatus"],
  components: {
    filterClassify,
    sortClassify,
    moreClassify,
    Popup,
  },
  data() {
    return {
      selectList: [
        {
          id: "0",
          name: "行业分类",
          options: []
        },
        {
          id: "1",
          name: "技术类型",
          options: []
        },
        {
          id: "2",
          name: "交易方式",
          options: []
        },
        {
          id: "3",
          name: "成熟度",
          options: []
        },
        {
          id: "4",
          name: "交易价格",
          options: []
        }
      ],
      poupStatus: true,
      filterNumber: 0,
      resetNumber: 1,
      availbleList: [],
      type: 5,
      selectOtherList: [
         {
          id: "3",
          name: "成熟度",
          options: []
        },
        {
          id: "4",
          name: "交易价格",
          options: []
        }
      ],
      title: "",
      availbleList:[
        {
          select: true,
          status:false,
          colorStatus:false,
          categoryName: "行业分类",
        },
        {
          select: true,
          status:false,
          colorStatus:false,
          categoryName: "技术类型",
        },
        {
          select: true,
          status:false,
          colorStatus:false,
          categoryName: "交易方式",
        },
        {
          select: true,
          status: false,
          colorStatus:false,
          categoryName: this.$t("message.more"),
        },
       {
          select: true,
          status: false,
          colorStatus:false,
          categoryName: this.$t("message.bestNew"),
        },
      ],
      selectNameList: [
        {
          select: true,
          status:false,
          colorStatus:false,
          categoryName: "行业分类",
        },
        {
          select: true,
          status:false,
          colorStatus:false,
          categoryName: "技术类型",
        },
        {
          select: true,
          status:false,
          colorStatus:false,
          categoryName: "交易方式",
        },
        {
          select: true,
          status: false,
          colorStatus:false,
          categoryName: this.$t("message.more"),
        },
       {
          select: true,
          status: false,
          colorStatus:false,
          categoryName: this.$t("message.bestNew"),
        },
      ],
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
          categoryName: this.$t("message.bestNew"),
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
        this.selectNameList[this.selectNameList.length-1].categoryName = this.$t("message.bestNew");
        this.selectNameList[this.selectNameList.length-1].colorStatus = false;
      } else if (val == 1) {
        this.selectNameList[this.selectNameList.length-1].categoryName = this.$t("message.bestHot");
        this.selectNameList[this.selectNameList.length-1].colorStatus = false;
      }
      this.$emit("sort-change", val);
    },
    clearSearch() {
      this.$emit("clear-Search");
      this.resetChoose();
    },
    resetChoose() {
      this.resetNumber = 10;
      this.$emit("sort-change", 0, this.resetNumber);
      this.selectNameList.forEach((item) => {
        item.colorStatus = false;
      });
      if (this.selectNameList[this.selectNameList.length - 1]) {
        this.selectNameList[this.selectNameList.length - 1].categoryName = this.$t(
          "message.bestNew"
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
      this.$refs.sortFilter.active = 0;
      if (this.$refs.moreFilter) {
        this.$refs.moreFilter.industryClassify = null;
      }
      if(this.$refs.soloFilter){
      this.$refs.soloFilter.forEach((el) => (el.industryClassify = null));
      }
      this.selectNameList[0].categoryName = "行业分类"
      this.selectNameList[1].categoryName = "技术类型"
      this.selectNameList[2].categoryName = "交易方式"
    },
    getSelectOvl(val, number, expectStatus) {
      this.$emit("filter-data", val, number, expectStatus);
      let optionName = "";
      if (val.length == 0) {
          this.selectNameList[this.showIndex].categoryName = this.availbleList[this.showIndex].categoryName;
          this.selectNameList[this.showIndex].colorStatus = false;
      } else {
          optionName = val[0].dropdownValue
          this.selectNameList[this.showIndex].categoryName = optionName
          this.selectNameList[this.showIndex].colorStatus = true;
       }
    },
    getCodeInfo(params) {
        return new Promise((resolve, reject) => {
          getSelect(params).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            });
        });
    },
    getIndustryInfo(params) {
        return new Promise((resolve, reject) => {
          getSelectIndustry(params).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            });
        });
    },
    setSelection(){
      let p1 = this.getIndustryInfo(5);
      let a = new FormData()
      a.append('type','technologyType')
      let p2 = this.getCodeInfo(a);
      let b = new FormData()
      b.append('type','tradeType')
      let p3 = this.getCodeInfo(b);
      let c = new FormData()
      c.append('type','maturity')
      let p4 = this.getCodeInfo(c);
      let d = new FormData()
      d.append('type','tradePrice')
      let p5 = this.getCodeInfo(d);
      Promise.all([p1, p2, p3, p4, p5]).then(values => {
        this.selectList[0].options = values[0];
        this.selectList[1].options = values[1];
        this.selectList[2].options = values[2];
        this.selectList[3].options = values[3];
        this.selectList[4].options = values[4];
        this.selectList[0].options.forEach(item=>{
          item.dropdownKey = item.id
          item.dropdownValue = item.name
        })
        this.selectOtherList[0].options =  values[3];
        this.selectOtherList[1].options =  values[4];
      }).catch(err => {
        console.log(err);
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
    this.setSelection();
    if (this.$refs.popup) {
      this.classStatus == true
        ? (this.$refs.popup.poupStatus = true)
        : (this.$refs.popup.poupStatus = false);
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
  margin-left: 0.25rem;
  color: #333333;
}
.filter_type_one ul li {
  flex: 1.5;
  height: 1.38666666667rem;
  line-height: 1.38666666667rem;
  text-align: center;
  /* margin-left: 0.25rem; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.filter_type_one ul >li:nth-of-type(4) {
  flex: 1.3;
  height: 1.38666666667rem;
  line-height: 1.38666666667rem;
  text-align: center;
  /* margin-left: 0.25rem; */
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
