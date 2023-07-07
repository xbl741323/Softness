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
          >正常({{ countObj.normal }})</span
        >
        <span
          @click="changeType(1)"
          :class="[showIndex == 1 ? 'change_style' : '']"
          >已失效({{ countObj.all - countObj.normal}})</span
        >
      </div>
      <div class="teb_multi_operate" v-if="showMultiStatus == 1">
        <span>
          <el-checkbox v-model="checkAllValue" @change="checkAllChange">全选</el-checkbox>
        </span>
        <span @click="deleteCollect()">删除</span>
        <span @click="cancelOperate()">取消</span>
      </div>
      <div
        class="teb_multi_operate"
        v-if="showMultiStatus == 0"
        @click="showMultiStatus = 1"
      >
        <span></span>
        <span style="float: right">批量管理</span>
      </div>
    </div>
    <!-- 具体内容区域 -->
    <div class="no_data" v-if="total == 0">暂无数据</div>
    <div class="project_list" v-else>
      <div v-for="(item, index) in projectList"
        :key="index"
        class="project_item"
        @click="toDetail(item)">
          <div>
            <div class="check_btn" v-if="showMultiStatus == 1">
              <el-checkbox v-model="item.checkValue" @click.stop.native="()=>{}" @change="checkChange(item)"></el-checkbox>
            </div>
            <span class="project_circle"></span>
            <el-tooltip
              v-if="item.title&&item.title.length>42"
              content="Top"
              placement="top"
              effect="light"
            >
              <span slot="content">{{item.title}}</span>
              <span class="project_font">【{{item.type | filteType}}】{{item.title}}</span>
            </el-tooltip>
            <span v-else class="project_font">【{{item.type | filteType}}】{{item.title}}</span>
          </div>
          <div class="project_time">{{item.createTime | filterTime}}</div>
      </div>
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
import { getMyCollectList,deleteCollect } from "@/api/announcement";
import * as CodeMsg from "@/api/CodeChange"
import serviceItem from "./serviceItem";
import { getUserInfo } from "@/api/login";
export default {
  components: {
    serviceItem,
  },
  data() {
    return {
      accountId: null,
      searchKey: "",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showIndex: 0, // 状态（全部null 正常1 失效2）
      showMultiStatus: 0, // 批量操作
      checkAllValue: false, // 全选
      soloCheckList: [], // 勾选项
      projectList: [],
      userInfo: {},
      countObj: {
        all: 0,
        normal: 0,
        other: 0
      },
    };
  },
  filters: {
    filterTime(val){
      if(val){
        return val.length > 10 ? val.slice(0,10) : ''
      }
    },
    filteType(val){
      if(val){
        return val == 1 ? '通知公告' : val == 2 ? '行业资讯' : '卧涛文档'
      }
    }
  },
  methods: {
    // 跳转详情
    toDetail(item){
      // state 0 无效 1 有效
      if(this.showIndex!=1 && item.state==1){
        item.type!='3'?window.open(`/policy/${item.infoNo}01?id=${item.infoId}`):window.open(`/policy/files/${item.infoId}`)
      }else{
        this.$router.push("/member/collect/nodata")
      }
    },
    checkChange(item) {
      if(item.checkValue == true){
        this.soloCheckList.push(item.infoId)
      }else{
        if(this.soloCheckList.indexOf(item.infoId)>-1){
          this.soloCheckList.splice(this.soloCheckList.indexOf(item.infoId), 1)
        }
      }
      if (this.soloCheckList.length == this.total) {
        this.checkAllValue = true;
      } else {
        this.checkAllValue = false;
      }
    },
    // 取消操作
    cancelOperate(){
      this.showMultiStatus = 0
      this.checkAllValue = false
      this.soloCheckList = []
      this.changeProject(false);
    },
    // 批量取消收藏
    deleteCollect() {
      if (this.soloCheckList.length > 0) {
        this.$confirm("确定删除所选的收藏吗？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        }).then(() => {
            let param = {
              infoIds: this.soloCheckList,
              userId: JSON.parse(localStorage.getItem('userInfo')).userId,
              collectSource: 1,
            }
            deleteCollect(param).then((res) => {
              if(res.data.code == CodeMsg.CODE_0){
                this.$message({
                  type: "success",
                  message: "删除成功！",
                  offset: 300,
                  duration: 1500
                });
                this.currentPage = 1;
                this.projectList = []
                this.getCollectList();
                this.getList()
                this.cancelOperate()
              }
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
      if(num == 0){
        this.getList()
      }
      this.getCollectList()
    },
    //单选操作
    soloCheckChange() {
      this.soloCheckList = [];
      this.projectList.length>0&&this.projectList.forEach((item) => {
        if (item.checkValue == true) {
          this.soloCheckList.push(item.infoId);
        }
      });
      if (this.soloCheckList.length == this.projectList.length) {
        this.checkAllValue = true;
      } else {
        this.checkAllValue = false;
      }
    },
    //全选操作
    checkAllChange(val) {
      this.soloCheckList = [];
      if (val == true) {
        this.changeProject(true);
        this.soloCheckChange(false);
      } else {
        this.changeProject(false);
      }
    },
    changeProject(val) {
      if (this.projectList.length>0) {
        this.projectList.forEach((item) => {
          item.checkValue = val;
        });
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCollectList();
      this.changeProject(false)
      this.soloCheckList = [];
      this.checkAllValue = false
    },
    getList(){
      if(localStorage.getItem('userInfo')){
         let params1 = {
            collectSource: 1,// 1-PC 2-H5 3-小程序
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            title: this.searchKey,
            effective: '',
            userId: JSON.parse(localStorage.getItem('userInfo')).userId,
          }
         getMyCollectList(params1).then(res=>{
             this.projectList = res.data.data.records
             this.total = res.data.data.total
             this.countObj.all = res.data.data.total
         })
         let param = {
            collectSource: 1,// 1-PC 2-H5 3-小程序
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            title: this.searchKey,
            effective: 1,
            userId: JSON.parse(localStorage.getItem('userInfo')).userId,
          }
          getMyCollectList(param).then(res=>{
             this.countObj.normal = res.data.data.total
         })
         if(this.projectList.length>0){
          this.projectList.forEach(item => {
            item.checkValue = false
          })
         }
      }else{
          this.$router.push('/login')
      }
    },
    getCollectList(){
      if(localStorage.getItem('userInfo')){
         let params = {
            collectSource: 1,// 1-PC 2-H5 3-小程序
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            title: this.searchKey,
            effective: this.showIndex==0?'':this.showIndex==2?1:2,
            userId: JSON.parse(localStorage.getItem('userInfo')).userId,
          }
         getMyCollectList(params).then(res=>{
             this.projectList = res.data.data.records
             this.total = res.data.data.total
         })
         if(this.projectList.length>0){
          this.projectList.forEach(item => {
            item.checkValue = false
          })
         }
      }else{
          this.$router.push('/login')
      }
    }
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
  border-bottom: 10px solid #eff2f3;
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
  display: flex;
  flex-direction: column;
  margin-top: 28px;
}
.project_item {
  height: 21px;
  font-size: 16px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #666666;
  line-height: 21px;
  margin-bottom: 16px;
  margin-left: 32px;
  width: 93%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
}
.project_circle {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #36a6fe;
  border-radius: 50%; 
  vertical-align: middle;
  position: absolute;
  left: 5px;
  top: 7px;
}
.project_font {
  font-size: 16px;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-indent: 1rem;
  max-width: 780px;
}
.project_page {
  margin: 34px 0 39px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.project_time {
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #999999;
  vertical-align: middle;
}
.no_data {
  width: 100%;
  text-align: center;
  margin-top: 150px;
  color: #999999;
  min-height: 100px;
}
.check_btn {
  position: absolute;
  top: 2px;
  left: -23px;
}
</style>
