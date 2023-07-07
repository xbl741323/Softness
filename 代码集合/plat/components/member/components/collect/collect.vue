<template>
  <div class="collect_set">
    <!-- tab切换区域 -->
    <div class="collect_head">
      <div class="title_tab">
        <span
          v-for="(item, index) in tabList"
          :key="index"
          :class="[showIndex == item.id ? 'change_sty' : '']"
          @click="changeShow(item)"
          >{{ item.title }}</span
        >
      </div>
      <div class="title_search">
        <input @keyup.enter="toSearch" :placeholder="placeholder" v-model="keyWords" type="text" />
        <img class="title_img" src="~/assets/images/home/icon_search.png"/>
        <span class="search_btn" @click="toSearch">搜索</span>
      </div>
    </div>
    <!-- 具体内容筛选区域 -->
    <div class="collect_filters">
       <!-- 文章政策 -->
      <div v-if="showIndex == 1">
        <policyCollect ref="policy"></policyCollect>
      </div>
      <!-- 服务产品 -->
      <div v-if="showIndex == 2">
        <serviceCollect ref="service"></serviceCollect>
      </div>
    </div>
  </div>
</template>

<script>
import serviceCollect from "../collect/serviceCollect"
import policyCollect from "../collect/policyCollect"
export default {
  components: {
    serviceCollect,
    policyCollect
  },
  head() {
        return {
            title: this.metaTitle,
        };
    },
  data() {
    return {
      metaTitle:"我的收藏",
      placeholder:"请输入资讯/文档标题",
      showIndex: 1,
      keyWords:"",
      tabList: [
        {
          title: "资讯&文档",
          id: 1,
        },     
        {
          title: '服务产品',
          id: 2
        }
      ],
    };
  },
  created(){
    if(this.$route.query.showIndex){
      this.showIndex = this.$route.query.showIndex
      this.changeType()
    }
  },
  mounted(){
    this.toSearch()
  },
  methods:{
    // tab切换
    changeShow(item){
      this.showIndex = item.id
      this.changeType()
      this.$nextTick(()=>{
        this.toSearch()
      })
    },
    changeType(){
      if(this.showIndex == 1){
         this.placeholder = '请输入资讯/文档标题';
      }else if(this.showIndex == 2){
         this.placeholder = '请输入产品标题';
      }
    },
    // 搜索
    toSearch(){
      if(this.showIndex == 1){
        this.$refs['policy'].searchKey = this.keyWords
        this.$refs['policy'].currentPage = 1
        this.$refs['policy'].getList()
        }else if(this.showIndex == 2){
        this.$refs['service'].searchKey = this.keyWords
        this.$refs['service'].currentPage = 1
        this.$refs['service'].getList()
      } 
    }
  }
};
</script>

<style scoped>
.collect_set {
  width: 950px;
  background: #ffffff !important;
  opacity: 1;
  overflow: hidden;
}
.collect_head {
  width: 948px;
  height: 50px;
  background: #fff;
  border-bottom: 1px solid #f3f3f3;
  opacity: 1;
  justify-content: space-between;
  align-items: center;
}
.title_tab {
  display: flex;
}
.title_tab span {
  display: flex;
  width: 120px;
  height: 50px;
  font-weight: 400;
  background: #fff;
  opacity: 1;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666666;
  cursor: pointer;
}
.change_sty {
  background: #36a6fe !important;
  color: #ffffff !important;
}
.title_search {
  display: flex;
  width: 327px;
  height: 30px;
  background: #eff2f3;
  border-radius: 15px;
  padding-left: 28px;
  margin-top: 16px;
  margin-left: 20px;
  position: relative;
}
.title_img {
  position: absolute;
  left: 9px;
  top: 6px;
  width: 18px;
  height: 18px;
}
.title_search input {
  width: 280px;
  height: 30px;
  background: none;
  padding-left: 10px;
  outline: none;
  border: none;
}
.search_btn {
  border-radius: 15px;
  display: inline-block;
  background: #36A6FE;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  width: 88px;
  height: 30px;
  line-height: 30px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #ffffff;
  letter-spacing: 0.84px;
  text-align: center;
}
</style>