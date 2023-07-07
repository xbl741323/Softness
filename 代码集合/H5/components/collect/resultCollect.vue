<template>
  <div class="project_collect">
    <div style="border:1px solid #cccccc0a"></div>
    <div @click="changeTitle" style="height: 40px;line-height: 40px;padding-left: 15px;background:#ffffff">
      <span v-if="showStatus == 0" class="bbbbbb">全部</span>
      <span v-if="showStatus == 1" class="bbbbbb">已失效</span>
      <span v-if="showStatus == 2" class="bbbbbb">正常</span>
      <i class="el-icon-arrow-down" v-show="!showState"></i>
      <i class="el-icon-arrow-up" v-show="showState"></i>
    </div>
    <div style="border:1px solid #cccccc0a"></div>
    <div style="display:flex;padding-left: 16px;padding-top: 10px;background:#ffffff" v-show="showState">
        <div :class="['stateotherbtn',showStatus == 0?'statebtn':'']" @click="changeStatus(0)">全部</div>
        <div :class="['stateotherbtn',showStatus == 2?'statebtn':'']" @click="changeStatus(2)" style="margin-left:15px">正常</div>
        <div :class="['stateotherbtn',showStatus == 1?'statebtn':'']" @click="changeStatus(1)" style="margin-left:15px">已失效</div>
    </div>
    <div class="content_null" v-if="total == 0">暂无数据</div>
    <div v-else>
      <div class="collect_content">
        <div
          class="content_project"
          v-for="(item, index) in collectList"
          :key="index"
        >
          <result-item
            ref="result"
            @project-change="projectChange"
            :showStatus="multiStatus"
            :collectInfo="item"
          ></result-item>
        </div>
      </div>
      <div class="page_limit">
        <el-pagination
          :page-size="pageSize"
          @current-change="handleChange"
          :current-page="currentPage"
          background
          :pager-count="5"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import resultItem from "@/components/collect/resultItem";
import { getResultCollectList,getCountResultCollectList,cancelResult } from "@/api/member";
import { getUserInfo } from "@/api/login";
import { status } from '~/locales/cn';
export default {
  components: {
    resultItem,
  },
  data() {
    return {
      chanpingstatus:'产品状态',
      showState:false,
      accountId:null,
      searchKey: "",
      multiStatus: 0,
      pageSize: 20,
      currentPage: 1,
      total: 0,
      collectList: [],
      showStatus:0
    };
  },
  methods: {
    changeTitle(){
         this.showState = !this.showState;
    },
    changeStatus(val){
        this.showStatus = val
        this.showState = false;
        this.getList();
    },
    getList() {
       if(localStorage.getItem('userInfo')){
          var userInfo = JSON.parse(localStorage.getItem('userInfo'));
          this.accountId = userInfo.userId
        }else{
          this.accountId = null
        }
      let params = {
        accountId:this.accountId,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        deletedList: this.showStatus,
        searchKey: this.searchKey,
      };
       // 统计
      let param = new FormData()
      param.append('accountId',this.accountId)
      param.append('searchKey',this.searchKey)
      getCountResultCollectList(param).then((res) => {
            // this.All= res.data.data.total
            // this.normal= res.data.data.normal
            // this.invalid= res.data.data.invalid
      });
      getResultCollectList(params).then((res) => {
        
        this.collectList = res.data.records;
        this.total = res.data.total;
        this.$emit('project-total',this.total)
        console.log("输出需要的数据", this.collectList);
      });
    },
    projectChange() {
        this.$emit('project-change')
    },
    handleChange(val) {
      this.currentPage = val;
      this.getList();
      this.$emit('change-page')
    },
  },
  mounted() {
     this.getList();
  },
};
</script>

<style scoped>
.bbbbbb{
 font-size: 12px;
 color: #36a6fe;
}
.act{
  color: #36a6fe;
}
.statebtn{
  width: 56px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 4px;
  background: #36a6fe !important;
  color: #ffffff !important;
}
.stateotherbtn{
  width: 56px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 4px;
  background: #c0c4cc;
  color: #ffffff;
}
.collect_content {
  /* margin-top: 12px; */
  background: #ffffff;
}
.page_limit {
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 35px;
  margin-bottom: 2rem;
}
.content_null {
  padding-top: 50px;
  background: #ffffff;
  color: #aaaaaa;
  font-size: 0.426666666667rem;
  width: 100%;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>