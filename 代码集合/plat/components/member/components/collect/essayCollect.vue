<template>
  <div class="essay_collect">
    <!-- 筛选区域 -->
    <div class="pro_collect_tab">
      <div class="teb_left">
        <span
          @click="changeType(0)"
          :class="[showIndex == 0 ? 'change_style' : '']"
          >全部文章({{ allNum }})</span
        >
         <span
          @click="changeType(2)"
          :class="[showIndex == 2 ? 'change_style' : '']"
          >正常({{ allNum-failNum}})</span
        >
        <span
          @click="changeType(1)"
          :class="[showIndex == 1 ? 'change_style' : '']"
          >已失效({{ failNum }})</span
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
    <div class="no_data" v-if="total == 0">
     暂无数据
    </div>
    <div class="essay_list">
      <essay-item
        @project-change="soloCheckChange"
        ref="project"
        :showStatus="showMultiStatus"
        v-for="(item, index) in essayList"
        :collectInfo="item"
        :key="index"
      ></essay-item>
    </div>
    <!-- 分页区域 -->
    <div class="essay_page" v-if="total !== 0">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getCollectList,batchDelete } from "@/api/member";
import essayItem from "./essayItem";
export default {
  components: {
    essayItem,
  },
  data() {
    return {
      searchKey:"",
      info:{},
      allNum: 0,
      failNum: 0,
      pageSize: 30,
      total: 0,
      currentPage: 1,
      showIndex: 0,
      soloCheckList: [],
      titleList: [],
      showMultiStatus: 0,
      checkAllValue: false,
      essayList: [],
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
          offset:300,
          type: "warning",
        }).then(() => {
          let param = {
            idList: this.soloCheckList,
            resourceTitleList: this.titleList
          }
          batchDelete(param).then((res) => {
            if (res.data.code == 1000) {
              this.$message({
                type: "success",
                message: "删除成功！",
                offset: 300,
              });
              this.currentPage = 1;
              this.getList();
              this.changeProject(false);
              this.soloCheckList = [];
              this.titleList = []
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
      this.currentPage = 1
      this.showIndex = num;
      this.showMultiStatus = 0
      this.checkAllValue = false
      this.changeProject(false);
      this.getList();
    },
    //单选操作
    soloCheckChange() {
      this.soloCheckList = [];
      this.titleList = [];
      this.$refs.project.forEach((item) => {
        if (item.checkValue == true) {
          this.soloCheckList.push(item.collectInfo.id);
          this.titleList.push(item.collectInfo.title)
        }
      });
      if (this.soloCheckList.length == this.essayList.length) {
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
        this.soloCheckChange()
      } else {
        this.changeProject(false);
      }
      console.log(this.soloCheckList, "输出选中的选项");
    },
    changeProject(val) {
      if(this.$refs.project){
        this.$refs.project.forEach((item) => {
        item.checkValue = val;
      });
      }
    },
    getList() {
      let params = {
        size: this.pageSize,
        page: this.currentPage,
        deletedList: this.showIndex,
        listType: 2,
        searchKey:this.searchKey
      };
      getCollectList(params).then((res) => {
        let reaObj = res.data.data;
        this.essayList = reaObj.collList.records;
        this.total = reaObj.collList.total;
        this.allNum = reaObj.all;
        this.failNum = reaObj.invalid
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
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
.essay_collect {
  margin-top: 74px;
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
.essay_list {
  margin: 30px 0 0 20px;
  display: flex;
  flex-wrap: wrap;
}
.essay_page {
  margin: 34px 0 39px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no_data{
  width: 100%;
  text-align: center;
  margin-top:260px;
  color: #999999;
}
</style>
