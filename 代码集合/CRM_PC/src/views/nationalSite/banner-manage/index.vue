<template>
  <div class="js_banner">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabList"
        :key="item.id"
        :label="item.name"
        :name="item.name"
      ></el-tab-pane>
      <div v-for="(item, index) in tabList" :key="index">
        <first-page
          v-if="activeName == item.name && item.name !== '历史记录'"
          :type="item.bannerType"
          :deviceType="deviceType"
        ></first-page>
      </div>
      <div v-if="activeName == '历史记录'">
        <banner-history :tabList="selectList" :deviceType="deviceType"></banner-history>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import { getBannerNav } from "@/api/js-wotao-b/banner";
import firstPage from "@/components/nationalSite/bannerManage/firstPage";
import bannerHistory from "@/components/nationalSite/bannerManage/bannerHistory";
var BIN = require("bankcardinfo");
export default {
  components: {
    firstPage,
    bannerHistory,
  },
  data() {
    return {
      activeName: "",
      deviceType: "pc",
      tabList: [],
      selectList:[],
    };
  },
  methods: {
    getNav() {
      getBannerNav(1).then((res) => {
        this.selectList = []
        res.data.data.forEach((item,index)=>{
          if(index>0){
            if (item.childrenColumnVoList.length > 0) {
              item.childrenColumnVoList.forEach(item1 => {
                this.tabList.push(item1)
                this.selectList.push(item1)
              })
            } else {
              this.tabList.push(item)
              this.selectList.push(item)
            }
          }
        })
        this.tabList.push({ name: "历史记录" });
        this.activeName = this.tabList[0].name;
      });
    },
  },
  mounted() {
    this.getNav();
  },
};
</script>

<style scoped>
.js_banner {
  width: 100%;
  padding: 10px 50px 0 20px;
  margin: 0px 0 0 10px;
  background: #fff;
}
.banner-ul {
  padding-left: 33px;
  margin: 0;
}
.column_left {
  border: 1px solid #ebeef5;
  width: 10%;
  height: 300px;
  margin: 30px 30px 0 10px;
  padding-bottom: 30px;
}
.left_title {
  text-align: center;
  font-size: 14px;
  height: 40px;
  background: #1e90ff;
  line-height: 40px;
  color: #fff;
}
.column_left li {
  width: 140px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  cursor: pointer;
}
.li_style {
  color: #108ee9;
}
</style>
