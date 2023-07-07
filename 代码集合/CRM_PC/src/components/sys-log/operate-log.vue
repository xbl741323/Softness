<template>
    <div>
    <el-form :model="filters" ref="filters" inline @keyup.enter.native="getFirstAllList()" style="form_sty">
      <el-form-item :label="$t('label.keywords')" prop="keyWords">
        <el-input
          v-model.trim="filters.keyWords"
          style="width:300px;"
          :placeholder="$t('message.logTips')">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('message.belongMenu')+'：'" style="margin-left: 10px">
        <el-select v-model="filters.menu" :placeholder="$t('message.pleaseSelect')">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="江苏站" :value="1"></el-option>
            <el-option label="政策广场" :value="2"></el-option>
            <el-option label="产品管理" :value="3"></el-option>
            <el-option label="栏目管理" :value="4"></el-option>
            <el-option label="权限管理" :value="5"></el-option>
            <el-option label="员工管理" :value="6"></el-option>
            <el-option label="网站设置" :value="7"></el-option>
            <el-option label="合同管理" :value="8"></el-option>
            <el-option label="订单管理" :value="9"></el-option>
            <el-option label="客户管理" :value="10"></el-option>
            <el-option label="公海管理" :value="11"></el-option>
            <el-option label="系统设置" :value="12"></el-option>
            <el-option label="回款管理" :value="13"></el-option>
            <el-option label="任务管理" :value="14"></el-option>
            <el-option label="微信管理" :value="15"></el-option>
            <el-option label="流程管理" :value="16"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item :label="$t('label.createTime')+'：'" style="margin-left:10px;">
          <el-date-picker
            v-model="filters.publishTime"
            :unlink-panels="true"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            :range-separator="$t('message.to')"
            :start-placeholder="$t('message.startTime')"
            :end-placeholder="$t('message.endTime')"
          ></el-date-picker>
        </el-form-item>
      <el-button size="small" icon="el-icon-search" type="primary" style="width:80px;margin-left:20px;" @click="getFirstAllList()">{{ $t("button.search") }}</el-button>
      <el-button icon="el-icon-delete" @click="reset()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table :data="dataList" border="" style="width:100%;margin-top:15px;">
      <el-table-column prop="createTime" :label="$t('label.createTime')" align="center"></el-table-column>
      <el-table-column prop="operateContent" :label="$t('table.title')"  align="center"></el-table-column>
      <el-table-column prop="associationId" label="数据编号"  align="center">
        <template slot-scope="scope">
           <span>{{scope.row.associationId ?scope.row.associationId :'无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" :label="$t('message.operateMan')"  align="center">
         <template slot-scope="scope">
           <el-tooltip effect="dark" :content="'工号：'+scope.row.number+' 部门：'+scope.row.dept" placement="right">
            <span>{{scope.row.createUser}}</span>
           </el-tooltip>
         </template>
      </el-table-column>
      <el-table-column prop="menu" :label="$t('message.belongMenu')"  align="center"></el-table-column>
    </el-table>
     <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      :page-sizes="[10,20,30,40,50]"
      :page-size="20"
      background
      :total="total"
      style="float:right;margin-top:20px;">
     </el-pagination>
    </div>
</template>
<script>
import { getEmpOperate } from "@/api/admin/user";
export default {
  data() {
    return {
        clickStatus:false,
        logType:0,
        currentPage:1,
        pageSize:20,
        total:0,
        filters: {
         keyWords: "",
         menu: null,
         publishTime: null,
      },
      dataList: [],
    };
  },
  created(){
    if (sessionStorage.getItem(`${this.$route.path}`+'/operate-log')) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`+'/operate-log')
      );
      this.filters.keyWords = keepParams.params.operateContent
      this.filters.menu = keepParams.params.moduleType
      this.filters.publishTime =  keepParams.time
      this.clickStatus = keepParams.clickStatus
    }
  },
  methods: {
    reset(){
      this.clickStatus = false
      this.filters.menu = null
      this.filters.publishTime = null
      this.$refs['filters'].resetFields();
      this.getAllList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    getAllList(){
      this.currentPage = 1
      this.getList()
    },
    getFirstAllList(){
      this.clickStatus = true
      this.getAllList()
    },
    getList() {
      let params = {
        size:this.pageSize,
        start:this.currentPage,
        menuType: this.clickStatus == true?(this.filters.menu):null,
        operateContent: this.clickStatus == true?(this.filters.keyWords):"",
        startTime: this.clickStatus == true?(this.filters.publishTime !== null ?this.$moment(this.filters.publishTime[0]).format( "YYYY-MM-DD HH:mm:ss"):""):"",
        endTime: this.clickStatus == true?(this.filters.publishTime !== null?this.$moment(this.filters.publishTime[1]).format("YYYY-MM-DD HH:mm:ss"):""):"",
      };
       // 需要缓存的参数
      let keepParams = {
        clickStatus:this.clickStatus,
        params: params,
        time: this.filters.publishTime,
      };
      sessionStorage.setItem(`${this.$route.path}`+'/operate-log', JSON.stringify(keepParams));
      getEmpOperate(params).then(res => {
        this.dataList = res.data.data.list
        this.total = res.data.data.total
      });
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.getList()
    },
  },
  mounted(){
    this.getList()
  }
};
</script>

<style scoped>
</style>