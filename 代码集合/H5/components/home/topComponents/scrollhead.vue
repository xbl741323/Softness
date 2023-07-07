<template>
  <div class="wrapper">
    <div class="header">
      <nuxt-link to="/city" href="nofollow" style="height: 1.0666667rem">
        <div class="header-left">
            <span class="text">{{location}}</span>
            <img :src="require('@/assets/images/wotao/wotao_xiajiantou@2x.png')" alt>
            <span class="bor"></span>
            <img  class="hotimg" :src="require('@/assets/images/wotao/hot_icon@2x.png')" alt>
            <input class="search-input" :placeholder="hotSearch" v-model="searchValue" type="text" @keyup.13="toGlobalSearch" />
        </div>
      </nuxt-link>
      <!-- <div class="header-center">
      
      </div> -->
      <div class="header-right" @click="toGlobalSearch">
         <img :src="require('@/assets/images/wotao/sousuo_icon@2x.png')" alt>
      </div>
    </div>
  </div>
</template>

<script>
import { getLocation } from "@/api/home";
export default {
  data() {
    return {
      searchValue: "",
      location: "",
      hotSearch:'高新技术企业',
      hotData: [],
      identification:''
    };
  },
  methods: {
    toGlobal(item) {
      this.searchValue = item;
      this.toGlobalSearch()
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
    prev() {
      this.$router.go(-1);
    },
    // 获取定位值
    getLocationData() {
      getLocation(this.identification).then(res => {
          if (res.code == 1000) {
            this.$store.commit("changeCity", res.data.areaName);
            this.$store.commit("changeNo", res.data.areaNo);
            this.location = this.$store.state.city;
            sessionStorage.setItem('localAreaNo', res.data.areaNo);
            localStorage.setItem('identification', res.data.identification);
          } else {
            this.location = this.$store.state.city ? this.$store.state.city : '全国';
          }
        }).catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {   
    // 获取identification
    console.log(localStorage.getItem("identification"),"localStorageidentification")
    if (localStorage.getItem("identification")) {
      this.identification = localStorage.getItem("identification")
    } else {
      
    };
    // 判断localStorage是否有值，无值才调用接口
    console.log(sessionStorage.getItem("localCity"), "localStorageLocalCity");
    if (sessionStorage.getItem("localCity")) {
      this.location = sessionStorage.getItem("localCity");
    } else {
      this.getLocationData();
    };
  },
};
</script>

<style lang="stylus" scoped>
.header {
  display: flex;
  height: 0.96rem;
  line-height: 0.96rem;
  border-radius: 0.48rem;
  background: #fff;  
  justify-content: space-between;
  align-items: center;
  padding: 0  0.4rem;
  .header-left{
      display flex
      align-items: center;
      position relative
      top 0.05333333333333334rem
      .text{
          font-weight 550
          font-size: 16px;
          color: #333333;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 80px;
      }
      img{
          width: 16px;
          height 16px;
      }
      .hotimg{
          margin-left: 9px;
      }
      .bor{
        width: 1px;
        height: 20px;
        background: #e4e4e4;
        display: inline-block;
        margin-left: 6px;
      }
  }
   .search-input{
      border: none;
      font-size: 16px;
      position: relative;
      top: 1px;
      left: 8px;
   }

  .header-right{
      img{
          width 16px
          height 16px
          position: relative;
          top: 3px;
      }
  }
}
</style>
