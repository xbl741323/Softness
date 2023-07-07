<template>
  <div class="hot-search">
    <div class="cont">
      <div class="search">
        <div class="search-left">
          <i class="iconfont search-ico">&#xe67a;</i>
          <input class="search-input" :placeholder="hotSearch" v-model="searchValue" type="text" @keyup.13="toGlobalSearch" />
        </div>
        <div class="search-right">
          <button @click="toGlobalSearch">{{$t('home.search')}}</button>
        </div>
      </div>
      <div class="hot">
        <div class="hot-ico">
          <img :src="require('@/assets/images/home/icon_hot_home@3x.png')" alt />
        </div>
        <div class="hot-list">
          <ul>
            <li
              v-for="(item,index) in hotData"
              :key="index"
              class="hot-item"
              @click="toGlobal(item)"
            >{{item}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHotSearch } from "@/api/policySquare";
export default {
  data() {
    return {
      searchValue: "",
      hotSearch:'',
      hotData: []
    };
  },
  methods: {
    getHotList() {
      getHotSearch(5).then(res => {
        this.hotData = res.data;
        this.hotSearch = res.data[0]
      });
    },
    toGlobalSearch() {
      if(!this.searchValue){
        this.searchValue = this.hotSearch
      }
      this.$router.push({
        path: "/search",
        query: {
          type: 1,
          keywords: this.searchValue
        }
      });
    },
    toGlobal(item) {
      this.$router.push({
        path: "/search",
        query: {
          type: 1,
          keywords: item
        }
      });
    }
  },
  mounted() {
    this.getHotList();
  }
};
</script>

<style scoped>
.hot-search {
  width: 100%;
  margin: 0.2133333333rem 0;
  margin-bottom: 0;
  position: relative;
  box-shadow: 0px 3px 6px rgba(51, 51, 51, 0.12);
}
.cont {
  margin: 0 0.426666666rem;
  padding-bottom: 0.2133333333rem;
}
.hot {
  width: 100%;
  margin: 0.12rem 0;
  position: relative;
  display: flex;
  align-items: center;
  line-height: 0.64rem;
  height: 0.64rem;
}
.hot-ico {
  width: 0.48rem;
  height: 0.64rem;
}
.hot-ico img {
  width: 100%;
}
.hot-list {
  flex: 1;
  margin-left: 0.2rem;
  height: 0.64rem;
  align-items: center;
}
.hot-list ul {
  display: -moz-box; /*Firefox*/
  display: -webkit-box; /*Safari,Opera,Chrome*/
  /* display: box; */
  display: flex;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}
.hot-item {
  font-size: 0.32rem;
  display: block;
  color: #ff925e;
  height: 0.48rem;
  line-height: 0.48rem;
  margin-top: 0.08rem;
  background: rgba(253, 101, 28, 0.07);
  margin-right: 0.2rem;
  padding: 0 0.3rem;
  border-radius: 0.3rem;
}
.hot-list ul::-webkit-scrollbar {
  display: none;
}
.search {
  width: 100%;
  margin: 0.1rem 0;
  position: relative;
  display: flex;
  align-items: center;
  line-height: 0.85333333rem;
  height: 0.85333333rem;
}
.search-left {
  flex: 1;
  position: relative;
}
.search-input {
  width: 100%;
  line-height: 0.85333333rem;
  height: 0.85333333rem;
  background: #e7e6eb;
  padding-left: 1rem;
  border: none;
  color: #666;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
}
.search-ico {
  position: absolute;
  left: 0.4rem;
  top: 0.02rem;
  font-size: 0.42666667rem;
  line-height: 0.85333333rem;
  color: #999;
}
.search-right button {
  width: 1.6rem;
  line-height: 0.85333333rem;
  color: #fff;
  background: linear-gradient(
    125deg,
    rgba(116, 199, 255, 1) 0%,
    rgba(54, 166, 254, 1) 100%
  );
  border: none;
  font-size: 0.32rem;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}
</style>
