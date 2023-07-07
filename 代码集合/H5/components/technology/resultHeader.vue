<template>
<client-only>
  <div class="nutice_header">
    <!-- 头部搜索栏 -->
      <div class="tab_title">
        <i class="iconfont tab_left" @click="toHome">&#xe641;</i>
        <div :class="['tab_title_sty',tabIndex == index?'choosed_title_sty':'']" v-for="(item,index) in tabList" :key="index" @click="changeTab(index)">
             <span>{{ item.title }}</span>
             <span v-if="tabIndex == index" class="tab_bottom_border"></span>
        </div>
        <i class="iconfont tab_right" slot="right" @click="search">&#xe605;</i>
        </div>
    <!-- 搜索历史 -->
    <popup v-model="searchWindow">
      <div class="search">
        <div class="search-head">
          <div class="iconfont back-icon" @click="closePopup">&#xe641;</div>
          <div class="search-input">
            <i class="search-ico iconfont" @click="keywordsSearch">&#xe605;</i>
            <input
              class="input-box"
              type="text"
              @keyup.13="keywordsSearch"
              v-model="searchValue"
              :placeholder="$t('button.search')"
            />
          </div>
          <div class="search_btn" @click="keywordsSearch">搜索</div>
        </div>
        <div class="search-recommend" v-if="historyData.length>0">
          <div class="search-title" style="margin-top:20px;">
            <h3>热门搜索</h3>
          </div>
          <div class="search-cont">
            <p
              class="search-item"
              v-for="(item,index) in historyData"
              :key="index"
              @click="hotClick(item,index)"
            >{{item}}</p>
          </div>
        </div>
      </div>
    </popup>
  </div>
  </client-only>
</template>

<script>
import { getHotSearch } from "@/api/policySquare";
import Popup from "../policySquare/searchPopup";
export default {
  props: ["title", "type"],
  components: {
    Popup
  },
  data() {
    return {
      tabIndex:0,
      tabList:[
        {
          title:"技术成果"
        },
        {
          title:"技术需求"
        }
      ],
      searchWindow: false,
      searchValue: "",
      historyData: []
    };
  },
  methods: {
    toHome(){
      this.$router.push({
        path:"/"
      })
    },
    changeTab(index){
      this.tabIndex = index
      // this.$emit("show-change",index)
      if(this.tabIndex == 0){
        this.$router.push({
        path: "/result"
      });
      }else{
       this.$router.push({
        path: "/need"
      });
      }
    },
    hotClick(item, index) {
      this.searchValue = item;
      this.keywordsSearch();
    },
    getHotList() {
      getHotSearch(6).then(res => {
        this.historyData = res.data;
      });
    },
    cancleHistory() {},
    historyClick(item, index) {},
    keywordsSearch() {
      this.searchWindow = false;
      this.$emit("search_result", this.searchValue);
    },
    closePopup() {
      this.searchWindow = false;
    },
    search() {
      this.searchWindow = true;
      this.$emit("close_filter");
    }
  },
  mounted() {
    this.getHotList();
  }
};
</script>

<style lang="stylus" scoped>
.nutice_header {
  top: 0px;
  position: fixed;
  width: 100%;
  z-index: 10;
}

.mutice_header_title {
  font-size: 16px
  line-height 16px
  height: 1.2rem;
  border-bottom 1px solid #F4F6F8
}

.mutice_header_left {
  width: 0.26666666667rem;
  height: 0.48rem;
}

.mutice_header_right {
  width: 0.6rem;
  height: 0.6rem;
  color #333333
}

.search {
  padding: 0.3rem;
  min-height: 5rem;
}

.search-title {
  font-weight: 600;
  display: flex;
}

.search-title h3 {
  font-weight: 600;
  flex: 1;
  color: #333;
  margin-left: 4px;
  font-size: 16px;
}

.search-title i {
  color: #999;
  font-size: 0.4rem;
}

.search-recommend {
  margin: 0.6rem 0 0.4rem 0;
  display: flex;
  flex-direction: column;
}

.flexDiv {
  display: flex;
  align-items: center;
}

.search-item {
  background: rgba(241, 241, 241, 1);
  line-height: 0.48rem;
  padding: 0.1rem 0.3rem;
  font-size: 0.24rem;
  color: #666;
  float: left;
  margin: 0 0.3rem 0.3rem 0;
}

.search-head {
  width: 100%;
  display: flex;
  align-items: center;
}

.search-head .back-icon {
  font-weight: 600;
  color: #3D85DC;
}

.search-input {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.search-ico {
  position: absolute;
  left: 9%;
  color: #D1D1D6;
  width: 18px;
  height: 18px;
  font-size: 18px;
}

.input-box {
  width: 90%;
  margin-left: 6%;
  padding-left: 0.8rem;
  line-height: 30px;
  background: #F8F8F8;
  border: 1px solid #36A6FE;
  border-radius: 40px;
  color: #979797;
  font-size: 14px;
}

.input-box :before {
  content: '\e6ad', ;
}

.search-cont {
  margin-top: 0.4rem;
  margin-left: 0.1rem;
}

.search_btn {
  width: 56px;
  height: 30px;
  background: linear-gradient(270deg, #70D8FF 0%, #44B7F9 100%);
  opacity: 1;
  border-radius: 16px;
  font-size: 14px;
  text-align: center;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0.26666666667rem;
}
.tab_title {
  height: 44px;
  background: #ffffff;
  color: #36a6fe;
  font-size: 0.42666666667rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom 1px solid #F4F6F8;
}
.tab_title_sty{
  height 100%
  position relative
  color #363636;
  font-size 16px
  display flex
  flex-direction column
  justify-content center
  align-items center
}
.choosed_title_sty{
  font-weight bold
}
.tab_bottom_border{
  bottom 0;
  position absolute
  display inline-block
  margin-top 8px
  width: 38px;
  height: 4px;
  background: #36A6FE;
  opacity: 1;
  border-radius: 4px;
}
.tab_left {
  margin-left: 0.42666666667rem;
  color #363636
}
.tab_right {
  font-size 24px;
  color #363636
  margin-right: 0.4rem;
}
</style>

<style>
.nutice_header .mint-header{
  background: #ffffff;
}
.nutice_header .mintui-back:before{
  color: #333333;
  font-size: 18px;
}
.nutice_header .mint-header-title{
  color: #333333;
  font-size: 16px;
  line-height: 1.2rem;
  height: 1.2rem;
  font-weight: bold;
}
</style>