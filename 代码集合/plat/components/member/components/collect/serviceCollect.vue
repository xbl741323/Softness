<template>
  <div class="project_collect">
    <!-- 筛选区域 -->
    <div class="pro_collect_tab">
      <div class="teb_left">
        <span
          @click="changeType(0)"
          :class="[showIndex == 0 ? 'change_style' : '']"
          >全部({{ countObj.all }})</span
        >
         <span
          @click="changeType(2)"
          :class="[showIndex == 2 ? 'change_style' : '']"
          >正常({{ countObj.normal}})</span
        >
        <span
          @click="changeType(1)"
          :class="[showIndex == 1 ? 'change_style' : '']"
          >已失效({{ countObj.all - countObj.normal }})</span
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
        <span style="float:right">批量管理</span>
      </div>
    </div>
    <!-- 具体内容区域 -->
    <div class="no_data" v-if="total == 0">暂无数据</div>
    <div class="project_list">

        <serviceItem
          :showStatus="showMultiStatus"
          ref="service"
          @project-change="soloCheckChange"
          v-for="(item, index) in projectList"
          :collectInfo="item"
          :key="index"
        ></serviceItem>

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
import {  cancelcollect , getcollectList } from '@/api/productdetails'
import serviceItem from "./serviceItem";
import { getUserInfo } from '@/api/login';
export default {
  components: {
    serviceItem,
  },
  data() {
    return {
      accountId:null,
      searchKey: null,
      currentPage: 1,
      pageSize: 40,
      total: 0,
      showIndex: 0,  // 状态（全部 正常 失效）
      showMultiStatus: 0,  // 批量操作
      checkAllValue: false,  // 全选
      soloCheckList: [],     // 勾选项
      titleList: [],
      projectList: [],
      userInfo: {},
      countObj:{},
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
          let param = {
            spuIds: this.soloCheckList,
            userId:JSON.parse(localStorage.getItem('userInfo')).userId
          }
          cancelcollect(param).then((res) => {
              this.$message({
                type: "success",
                message: "删除成功！",
                offset: 300,
                duration: 1500
              });
              this.currentPage = 1;
              this.getList();
              this.changeProject(false);
              this.soloCheckList = [];
              this.titleList = [];
          })
        })
      } else {
        this.$message({
          type: "warning",
          message: "请先勾选再进行删除！",
          offset: 300,
          duration: 1500
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
      this.$refs.service.forEach((item) => {
        if (item.checkValue == true) {
          this.soloCheckList.push(item.collectInfo.spuId);
          this.titleList.push(item.collectInfo.spuTitle);
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
      if (this.$refs.service) {
        this.$refs.service.forEach((item) => {
          item.checkValue = val;
        });
      }
    },
    //获取收藏列表
    getList() {
      if(localStorage.getItem('userInfo')){
         let param = {
            pageNo:this.currentPage,
            pageSize:this.pageSize,
            userId:JSON.parse(localStorage.getItem('userInfo')).userId,
            effective: this.showIndex==0?0:this.showIndex==2?1:2,
            spuTitle:this.searchKey
         }
         getcollectList(param).then(res=>{
             let data = res.data.data
             this.projectList = data.records
             this.total = data.total
         })
         getcollectList({
            pageSize:-1,
            userId:JSON.parse(localStorage.getItem('userInfo')).userId,
            effective: 0,
            spuTitle:this.searchKey
         }).then(res=>{
             this.countObj.all = res.data.data.records.length
         })
         getcollectList({
            pageSize:-1,
            userId:JSON.parse(localStorage.getItem('userInfo')).userId,
            effective: 1,
            spuTitle:this.searchKey
         }).then(res=>{
             this.countObj.normal = res.data.data.records.length
         })
      }else{
          this.$router.push('/login')
      }
    },
    getUserInfo() {
      getUserInfo().then((res) => {
        if (res.data.code == 0) {
          this.accountId = res.data.data.id
          this.getList()
        }else{
          this.getList()
        }
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
    this.getUserInfo();
  },
};
</script>

<style scoped>
.project_collect {
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
  background: #ffffff;
  display: grid;
  grid-template-columns: repeat(4,233px);
  justify-content: space-between;
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
