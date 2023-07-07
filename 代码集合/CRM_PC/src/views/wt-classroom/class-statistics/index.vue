<template>
  <basic-container>
    <!-- 筛选区域 -->
    <div class="common-service">
      <el-form :model="filters" ref="filters" inline @keyup.enter.native="getFirstAllList()">
        <el-form-item label="关键字：" prop="keyWords">
          <el-input v-model.trim="filters.keyWords" placeholder="请输入课程标题关键字"></el-input>
        </el-form-item>
        <el-form-item label="专业分类：" prop="themeType">
            <el-select v-model="filters.themeType">
            <el-option value="" label="全部"></el-option>
            <el-option v-for="(item,index) in optionList" :key="index" :label="item.categoryName" :value="item.id"></el-option>
            </el-select>
           </el-form-item>
           <el-form-item label="收费类型：" prop="feeType">
            <el-select v-model="filters.feeType">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="完全免费"></el-option>
            <el-option :value="2" label="VIP免费"></el-option>
            <el-option :value="3" label="单独收费"></el-option>
            </el-select>
           </el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getFirstAllList()">搜索</el-button>
        <el-button icon="el-icon-refresh-left" @click="resetForm()">重置</el-button>
      </el-form>
    </div>
    <!-- 列表区域 -->
    <avue-crud class="batch-choose" ref="crud" :page.sync="page" :data="dataList" :option="option" :table-loading="tableLoading"
      @size-change="sizeChange"
      @current-change="currentChange"
      @sort-change="changeSort"
      @on-load="getList">
      <template slot="classTitle" slot-scope="scope">
        <span>{{ scope.row.baseTitle }}</span>
      </template>
      <template slot="tradingChargeType" slot-scope="scope">
        <span>{{ scope.row.tradingChargeType|fixTradType }}</span>
      </template>
      <template slot="themeType" slot-scope="scope">
        <div v-for="(item,index) in scope.row.professionIds" :key="index">{{item|filterProType}}</div>
      </template>
      <template slot="tradingCurrentPrice" slot-scope="scope">
        <span>{{ scope.row.tradingCurrentPrice }}</span>
      </template>
      <template slot="viewNumber" slot-scope="scope">
        <span>{{scope.row.viewNumber}}</span>
      </template>
      <template slot="playNumber" slot-scope="scope">
        <span>{{scope.row.playNumber}}</span>
      </template>
      <template slot="subscribeNumber" slot-scope="scope">
        <span>{{scope.row.subscribeNumber}}</span>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
let that = ""
import { getOptionList, courseStatistics } from "@/api/project/wtClass";
import * as CodeMsg from "@/api/common/CodeChange";
import { tableOption } from "@/const/crud/wt-classroom/class-statistics";
export default {
  data() {
    return {
      sortName:"", // 排序名称
      sortType:"", // DESC降序 ASC升序
      optionList: [],
      type: 1,
      editVisible: false,
      clickStatus: false,
      tableLoading: false,
      dataList: [],
      option: tableOption,
      filters: {
        keyWords: "",
        themeType: "",
        feeType: "",
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
    };
  },
  beforeCreate(){
    that = this
  },
  filters: {
    filterProType(val) {
     let result = that.optionList.filter(item=>{
        return item.id == val
      })
      return result.length>0? result[0].categoryName : '';
    },
    fixTradType(val) {
      return val == 1 ? "完全免费" : val == 2 ? "VIP免费" : val == 3 ? "单独收费" : "";
    },
  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.keyWords = keepParams.params.keyWord;
      this.filters.feeType = keepParams.params.tradingChargeType;
      this.filters.themeType = keepParams.params.professionId;
      this.clickStatus = keepParams.clickStatus;
    }
  },
  methods: {
    changeSort(e){
      this.sortName = e.prop == 'playNumber'?'play_number':e.prop == 'viewNumber'?'view_number':e.prop
      this.sortType = e.order == 'descending'?'DESC':'ASC'
      this.getList()
    },
    getFirstAllList() {
      this.clickStatus = true;
      this.getAllList();
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        keyWord: this.clickStatus == true ? this.filters.keyWords : "",
        tradingChargeType: this.clickStatus == true ? this.filters.feeType : "",
        professionId: this.clickStatus == true ? this.filters.themeType : "",
      };
      if(this.sortName!=''){
        params.orderField = this.sortName
        params.orderType = this.sortType
      }
      // 需要缓存的参数
      let keepParams = {
        clickStatus: this.clickStatus,
        params: params,
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      courseStatistics(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          this.dataList = r.records;
          this.page.total = r.total;
        }
      });
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    resetForm() {
      this.clickStatus = false;
      this.filters.keyWords = "";
      this.filters.feeType = ""; 
      this.filters.themeType = "";
      this.getAllList();
    },
    // 获取产品分类下拉框数据
    getDropList() {
      getOptionList().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.optionList = res.data.data;
        }
      });
    },
  },
  mounted() {
    this.getDropList();
  },
};
</script>
<style scoped>
#handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
</style>