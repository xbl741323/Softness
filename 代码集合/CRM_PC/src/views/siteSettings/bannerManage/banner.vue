<template>
  <div class="my_publish">
    <div class="column_left">
      <div class="left_title">banner显示终端</div>
      <ul class="banner-ul">
        <li
          v-for="(item,index) in bannerClass"
          :class="[deviceType == item.type?'li_style':'']"
          :key="index"
          @click="toggle(item,index)"
        >{{ item.name }}</li>
      </ul>
    </div>
    <div class="banner-content">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="(item) in tabList" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
        <div v-for="(item,index) in arrOne" :key="index">
          <first-page ref="childList" v-if="(activeName == item.name)&&(activeName!=='history')" :type="item.type" :deviceType="deviceType"></first-page>
        </div>
        <div v-if="activeName == 'history'">
          <banner-history :deviceType="deviceType"></banner-history>
        </div>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import firstPage from "@/components/siteSettings/bannerManage/firstPage";
import bannerHistory from "@/components/siteSettings/bannerManage/bannerHistory";
export default {
  components: {
    firstPage,
    bannerHistory
  },
  data() {
    return {
      activeName: "home",
      deviceType:'pc',
      arrOne: [],
      //添加知识产权
      pcList: [
        { type: 4, label: "首页", name: "home" },
        { type: 3, label: "项目申报", name: "project" },
        { type: 0, label: "通知公告", name: "nutice" },
        { type: 1, label: "政策汇编", name: "policy" },
        { type: 2, label: "疑难解答", name: "trouble" },
        { type: 10, label: "行业资讯", name: "industry" },
        { type: 5, label: "关于卧涛", name: "aboutWt" },
        { type: 6, label: "知识产权", name: "ip" },
        { type: 11, label: "技术成果", name: "result" },
        { type: 12, label: "技术需求", name: "need" },
        { label: "历史记录", name: "history" },
      ],
      mobileList: [
        { type: 7,label: "首页", name: "home" },
        { type: 8,label: "知识产权", name: "ip" },
        { label: "历史记录", name: "history" }
      ],
      bannerClass:[
        {
          name: 'PC端',
          type: 'pc',
        },{
          name: '移动端',
          type: 'mobile',
        }
      ],
      tabList:[],
    };
  },
  methods: {
    toggle(item) {
      this.deviceType = item.type;
      this.activeName = 'home';
      this.$nextTick(() => {
        this.tabList.forEach((item, index) => {
          if(this.$refs.childList[index]){
            this.$refs.childList[index].getList();
          }
        })
      })      
    }
  },
  mounted(){
    this.tabList = this.pcList;
    this.arrOne = this.pcList;
  },
  watch: {
    deviceType(val) {
      if(val=='pc'){
        this.tabList = this.pcList;
        this.arrOne = this.pcList;
      } else if(val=='mobile'){
        this.tabList = this.mobileList;
        this.arrOne = this.mobileList;
      }
      console.log(this.arrOne,'arrOne')
    }
  }
};
</script>

<style scoped>
.my_publish {
  padding: 10px;
  margin-top: -20px;
  display: flex;
  background: #fff;
}
.banner-content{
  width: 86%;
  margin-top: 30px;
}
.banner-ul{
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
  background: #1E90FF;
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