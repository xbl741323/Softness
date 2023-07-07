<template>
  <div class="project_collect">
    <!-- 筛选区域 -->
    <div class="pro_collect_tab">
      <div class="teb_left">
       <span
          @click="changeType(0)"
          :class="[showIndex == 0 ? 'change_style' : '']"
          >全部({{ All }})</span
        >
          <span
          @click="changeType(2)"
          :class="[showIndex == 2 ? 'change_style' : '']"
          >正常({{ normal }})</span
        >
        <span
          @click="changeType(1)"
          :class="[showIndex == 1 ? 'change_style' : '']"
          >已失效({{ invalid }})</span
        >
      </div>
      <div class="teb_multi_operate" v-if="showMultiStatus == 1">
        <span>
          <el-checkbox v-model="checkAllValue" @change="checkAllChange"
            >全选</el-checkbox
          >
        </span>
        <span @click="deleteCollect">删除</span>
        <span @click="showMultiStatus = 0">取消</span>
      </div>
      <div
        class="teb_multi_operate"
        v-if="showMultiStatus == 0"
        @click="showMultiStatus = 1"
      >
        <span></span>
        <span>批量管理</span>
      </div>
    </div>
    <!-- 具体内容区域 -->
    <div class="no_data" v-if="total == 0">暂无数据</div>
    <div class="project_list">
      <need-item
        :showStatus="showMultiStatus"
        ref="project"
        @project-change="soloCheckChange"
        v-for="(item, index) in projectList"
        :collectInfo="item"
        :key="index"
      ></need-item>
    </div>
    <!-- 分页区域 -->
    <div class="project_page">
      <el-pagination
        v-if="total !== 0"
        @current-change="handleCurrentChange"
        background
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getCollectList, batchDelete,getNeedCollectList,getCountNeedCollectList,cancelNeed } from "@/api/member";
import { getUserInfo } from "@/api/login";
import needItem from "./needItem";
export default {
  components: {
    needItem,
  },
  data() {
    return {
      accountId:null,
      searchKey: "",
      All: 0,
      normal: 0,
      invalid:0,
      info: {},
      currentPage: 1,
      pageSize: 8,
      total: 0,
      showIndex: 0,
      showMultiStatus: 0,
      checkAllValue: false,
      soloCheckList: [],
      titleList: [],
      projectList: [],
      tabList: [
        {
          title: "",
        },
      ],
    };
  },
  methods: {
    deleteCollect() {
      if (this.soloCheckList.length > 0) {
        this.$confirm("确定删除所选的收藏吗？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        }).then(() => {
            let params = {
            numbers:this.soloCheckList,
            accountId:this.accountId
          }
          cancelNeed(params).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功！",
                offset: 300,
              });
              this.currentPage = 1;
              this.getList();
              this.changeProject(false);
              this.soloCheckList = [];
              this.titleList = [];
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "请先勾选再进行删除！",
          offset: 300,
        });
      }
    },
    //全部0 已失效1 类型切换
    changeType(num) {
      this.currentPage = 1;
      this.showIndex = num;
      this.showMultiStatus = 0;
      this.checkAllValue = false;
      this.changeProject(false);
      this.getList();
    },
    //单选操作
    soloCheckChange() {
      this.soloCheckList = [];
      this.titleList = [];
      this.$refs.project.forEach((item) => {
        if (item.checkValue == true) {
          this.soloCheckList.push(item.collectInfo.requirementNo);
        }
      });
      if (this.soloCheckList.length == this.projectList.length) {
        this.checkAllValue = true;
      } else {
        this.checkAllValue = false;
      }
      console.log(this.soloCheckList, "输出选中的选项");
    },
    //全选操作
    checkAllChange(val) {
      this.soloCheckList = [];
      this.titleList = [];
      if (val == true) {
        this.changeProject(true);
        this.soloCheckChange(false);
      } else {
        this.changeProject(false);
      }
      console.log(this.soloCheckList, "输出选中的选项");
    },
    changeProject(val) {
      if (this.$refs.project) {
        this.$refs.project.forEach((item) => {
          item.checkValue = val;
        });
      }
    },
    //获取收藏列表
    getList() {
        if(localStorage.getItem('userInfo')){
          var userInfo = JSON.parse(localStorage.getItem('userInfo'));
          this.accountId = userInfo.accountId
        }else{
          this.accountId = null
        }
      let params = {
        accountId:this.accountId,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        deletedList: this.showIndex,
        searchKey: this.searchKey,
      };
       // 统计
      let param = new FormData()
      param.append('accountId',this.accountId)
      param.append('searchKey',this.searchKey)
      getCountNeedCollectList(param).then((res) => {
            this.All= res.data.data.total
            this.normal= res.data.data.normal
            this.invalid= res.data.data.invalid
      });
      // 列表
      getNeedCollectList(params).then((res) => {
        this.projectList = res.data.data.records;
        this.total = res.data.data.total;
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
      this.changeProject(false)
      this.soloCheckList = [];
      this.titleList = [];
      this.checkAllValue = false
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped>
.project_collect {
  margin-top: 18px;
}
.pro_collect_tab {
  width: 100%;
  height: 60px;
  border-bottom: 10px solid #EFF2F3;
  opacity: 1;
  /* display: flex; */
  justify-content: space-between;
  align-items: center;
}
.teb_left {
  display: flex;
  margin-top: 75px;
}
.teb_left span {
  display: flex;
  height: 19px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  padding: 25px 35px;
  justify-content: center;
  align-items: center;
  /* border-bottom: 2px solid #e2e2e2; */
  cursor: pointer;
}
.change_style {
  border-bottom: 1px solid #36a6fe !important;
  color: #36a6fe !important;
}
.teb_multi_operate {
  margin-right: 28px;
  margin-left: 787px;
  margin-top: -100px;
}
.teb_multi_operate > span:nth-of-type(1) {
  margin-right: 10px;
}
.teb_multi_operate > span:nth-of-type(2) {
  height: 19px;
  font-size: 14px;
  font-weight: 400;
  color: #36a6fe;
  cursor: pointer;
}
.teb_multi_operate > span:nth-of-type(3) {
  height: 19px;
  font-size: 14px;
  font-weight: 400;
  color: #36a6fe;
  cursor: pointer;
  margin-left: 5px;
}
.project_list {
  margin: 30px 0 0 20px;
  display: flex;
  flex-wrap: wrap;
}
.project_page {
  margin: 34px 0 39px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no_data {
  width: 100%;
  text-align: center;
  margin-top: 260px;
  color: #999999;
}
</style>
