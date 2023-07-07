<template>
  <div class="nutice_header">
    <!-- 搜索历史 -->
    <div class="search">
      <div class="search-head">
        <div class="iconfont back-icon" @click="goBack">&#xe641;</div>
        <div class="search-input">
          <input
            class="input-box"
            type="text"
            @keyup.13="keywordsSearch"
            v-model.trim="searchValue"
            :placeholder="'搜索想要的内容'"
          />
        </div>
        <div class="search_btn" @click="keywordsSearch">搜索</div>
      </div>
      <div class="search-recommend">
        <div class="search-title">
          <h3>历史搜索</h3>
          <img src="@/assets/images/home/shanchu_icon.png" alt="" class="img-sty" @click="clearHistory">
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
      <div class="search-recommend">
        <div class="search-title">
          <h3>热搜词</h3>
          <div class="hot-icon">HOT</div>
        </div>
        <div class="search-cont">
          <p
            class="search-item"
            v-for="(item,index) in hotData"
            :key="index"
            @click="hotClick(item,index)"
          >{{item}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHotSearch } from "@/api/policySquare";
export default {
  components: {},
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description"
        }
      ]
    };
  },
  data() {
    return {
      title: "卧涛科技专注企业服务",
      hotType: 5,
      hotSearch:'',
      searchValue: "",
      historyData: [],
      hotData: []
    };
  },
  created() {
    this.type = this.$route.query.type;
    this.searchValue = this.$route.query.keywords;
    if(sessionStorage.getItem("searchHistory")){
      this.historyData = JSON.parse(sessionStorage.getItem("searchHistory"))
    }
  },
  methods: {
    goBack() {
      window.history.go(-1);
    },
    hotClick(item, index) {
      this.searchValue = item;
      this.keywordsSearch();
    },
    getHotList() {
      getHotSearch(this.hotType).then(res => {
        if(res.code==1000){
          this.hotData = res.data;
          this.hotSearch = res.data[0]
        }
      });
    },
    clearHistory() {
      if(sessionStorage.getItem("searchHistory")){
        sessionStorage.removeItem("searchHistory");
      }
      this.historyData = []
    },
    keywordsSearch() {
      if(!this.searchValue){
        this.searchValue = this.hotSearch
      }
      if(this.historyData.indexOf(this.searchValue) == -1 && this.searchValue !== '' ){
        this.historyData.unshift(this.searchValue)
      }
      sessionStorage.setItem("searchHistory", JSON.stringify(this.historyData))
      this.$router.push({
        path: "/search",
        query: {
          type: 1,
          keywords: this.searchValue
        }
      });
    },
    search() {
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
  font-size: 0.42666666667rem;
  height: 1.17333333333rem;
}

.mutice_header_left {
  width: 0.26666666667rem;
  height: 0.48rem;
}

.mutice_header_right {
  width: 0.48rem;
  height: 0.48rem;
}

.search {
  padding: 0.3rem;
  min-height: 5rem;
}

.search-title {
  font-weight: 600;
  display: flex;
  font-size: 14px
  font-family: Source Han Sans CN, Source Han Sans CN-Bold;
  position: relative;
}

.search-title h3 {
  font-weight: 600;
  flex: 1;
  color: #333;
  margin-left: 4px;
  font-size: 14px;
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
  line-height: 0.48rem;
  padding: 0.2rem 0.3rem;
  float: left;
  margin: 0 0.1rem 0.3rem 0;
  background: #f6f7f9;
  border-radius: 30px;
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  color: #333333;
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

.hot-icon {
  width: 41px;
  height: 16px;
  background: linear-gradient(180deg,#f1b046, #ed732c);
  font-size: 12px;
  font-family: Source Han Sans CN, Source Han Sans CN-Bold;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  border-radius: 6px 0 6px 0;
  margin-left: 9px;
  position: absolute;
  top: 2px;
  left: 48px;
}

.img-sty {
  width: 18px;
  height: 18px;
}
</style>