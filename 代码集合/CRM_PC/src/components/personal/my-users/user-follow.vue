<template>
<!-- 排查完成 -->
  <div class="order-records">
    <el-form :model="filters" inline @keyup.enter.native="getAllList()">
      <el-form-item label="关键字：">
        <el-input
          class="order-input-sty"
          v-model.trim="filters.keyWords"
          placeholder="请输入标题关键字"></el-input>
      </el-form-item>
      <el-form-item label="操作时间：">
        <el-date-picker
          v-model="filters.createTime"
          :unlink-panels="true"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="请选择开始时间"
          end-placeholder="请选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getList()" class="mar">搜索</el-button>
      <el-button @click="reset('filters')" class="mar">重置</el-button>
    </el-form>
    <avue-crud
      ref="crud"
      :table-loading="tableLoading"
      :page.sync="page"
      :data="dataList"
      :option="option"
      @on-load="getList">
      <!-- 收藏来源 -->
      <template slot="collectSource" slot-scope="scope">
        <span>{{scope.row.collectSource | clientFilter}}</span>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getUserFollow } from "@/api/admin/user";
import { getEmpInfo } from "@/api/project/wtClass";
import { tableOption } from "@/const/crud/user/user-follow";
export default {
  //personal-个人中心 list-订单管理
  props: ["source"],
  data() {
    return {
      // baseUrl: process.env.BASE_URL,
      baseUrl: process.env.VUE_APP_IMAGE_BASEURL,
      dataList: [],
      tableLoading: false,
      option: tableOption,
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [10, 20, 30, 50, 100],
      },
      filters: {
        keyWords: "",
        createTime: null,
      },
      cEmpNo:"",
      cDeptName:"",
      dialogVisible: false,
      dialogImageUrl:''
    };
  },
  filters:{
    clientFilter(value){
      return value == '1' ? 'PC端' :  value == '2' ? ' 手机端' : value == '3' ? '小程序'  : ''
    }
  },
  methods: {
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      let params = {
        userId: this.$route.query.userId,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        spuTitle: this.filters.keyWords,
        startCreateTime:this.filters.createTime == null ? "": this.$moment(this.filters.createTime[0]).format("YYYY-MM-DD HH:mm"),
        endCreateTime:this.filters.createTime == null? "": this.$moment(this.filters.createTime[1]).format("YYYY-MM-DD HH:mm"),
      };
      getUserFollow(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.dataList = res.data.data.records;
          this.page.total = res.data.data.total;
          this.tableLoading = false;
        }
      });
    },
    changeTab() {
      this.getList();
    },
    showUserInfo(row){
      getEmpInfo(row.createBy).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    reset(filterName) {
      this.filters.keyWords = "";
      this.filters.createTime = null;
      this.getAllList();
    },
  },
};
</script>

<style scoped>
.order-records {
    margin-top: 20px;
}
.order-filter-item {
  margin: 0 0 15px 0;
}
.order-name-sty {
  font-size: 14px;
  color:#606266;
}
.order-btn-sty {
  margin: 0 20px 0 0;
}
.order-border-sty {
  border-left: 1px solid #dcdfe6;
}
.order-input-sty {
  width: 300px;
}
#handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
.disbale_content {
  display: flex;
  justify-content: center;
}
.disable_img_sty {
  width: 20px;
  height: 20px;
  margin-left: 3px;
}
.red-txt {
  color: red;
}
.circle-blue {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 6px;
}
.circleYellow {
  background: #ff9900;
}
.success {
  font-weight: bolder;
  font-size: 12px;
  float: left;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
.transfer-status {
  font-size: 12px;
  color: #999;
  margin: -5px 0;
}
.order-status-sty{
  display: flex;
  justify-content: center;
  align-items: center;
}
.mar {
    margin:2px 5px 20px 5px;
}
.spanStyle {
    font-weight: bold;
}
.preview {
  color:blue;
}
.preview:hover {
  cursor: pointer;
}
</style>