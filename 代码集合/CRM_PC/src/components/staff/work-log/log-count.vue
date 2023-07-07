<template>
  <div class="log-count">
    <el-form :model="filters" ref="filters" inline @keyup.enter.native="getFirstAllList()">
      <div>
        <el-form-item label="员工：" prop="empId">
        <el-cascader
          filterable
          :show-all-levels="false"
          :options="empList"
          :before-filter="beforeFilter"
          clearable
          v-model="filters.empId"
          :props="{ value: 'customerId', label: 'label' }">
          <template slot-scope="{data}">
            <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
              <div slot="content">{{data.customerNo}}</div>
              <span>{{data.label}}</span>
            </el-tooltip>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="部门：" prop="deptId">
        <avue-input-tree
          v-model="filters.deptId"
          :dic="treeData"
          :props="{label: 'name',value: 'id'}"
          placeholder="请选择所属部门"/>
      </el-form-item>
      <el-form-item label="日志时间：" prop="logTime">
        <el-date-picker
          v-model="filters.logTime"
          :unlink-panels="true"
          format="yyyy-MM-dd HH:mm"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getFirstAllList()">搜索</el-button>
      <el-button @click="reset('filters')">重置</el-button>
      <el-button type="primary" @click="exportTable()" v-if="permissions.bt_work_log_export">导出</el-button>
      </div>
    </el-form>
    <avue-crud
      ref="crud"
      :page.sync="page"
      :data="dataList"
      :option="option"
      :table-loading="tableLoading"
      @size-change="sizeChange"
      @on-load="getList">
      <template slot="needCountHeader" slot-scope="{column}">
        <span>{{column.label}}</span>
        <el-tooltip effect="dark" content="应填写日志是员工在职期间应填写日志数量" placement="top-start">
          <i class="el-icon-question left-icon-sty"></i>
        </el-tooltip>
      </template>
      <template slot="notCountHeader" slot-scope="{column}">
        <span>{{column.label}}</span>
        <el-tooltip effect="dark" content="未填写日志是员工在职期间未填写日志数量" placement="top-start">
          <i class="el-icon-question left-icon-sty"></i>
        </el-tooltip>
      </template>
      <template slot="sysUserNumber" slot-scope="scope">
        <span @click="toDetail(scope.row)" class="handle-style">{{ scope.row.sysUserNumber }}</span>
      </template>
      <template slot="sysUserName" slot-scope="scope">
       <div class="disbale_content">
        <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ scope.row.sysUserNumber+ ' '+$t('message.emp')+ scope.row.deptName" placement="right">
          <span @click="toDetail(scope.row)" class="handle-style">{{ scope.row.sysUserName }}</span>
        </el-tooltip>
       <el-tooltip effect="dark" :content="'禁用时间：'+scope.row.lockTime" placement="top-start">
          <span>
            <el-tag v-if="scope.row.lockFlag!==null&&scope.row.lockFlag == '9'" type="danger" class="disabled-sty">禁用</el-tag>
          </span>
        </el-tooltip>
      </div>
      </template>
      <template slot="notCount" slot-scope="scope">
        <span class="red_color_sty">{{ scope.row.notFilledCount }}</span>
      </template>
      <template slot="overdueCount" slot-scope="scope">
        <span class="orange_color_sty">{{ scope.row.overdueCount }}</span>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getCountList, getLogNumber, exportLog } from "@/api/work-log/index"
import { tableOption } from "@/const/crud/work-log/log-count";
import * as CodeMsg from "@/api/common/CodeChange"
import { getEmpList } from "@/api/clue/clue";
import { fetchNewTree } from "@/api/admin/dept";
import { saveDetal } from "@/util/clearDetail";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      clickStatus:false,
      baseUrl: process.env.BASE_URL,
      imgCdnUrl: process.env.VUE_APP_IMAGE_BASEURL,
      countInfo:{
        all:0,
        normal:0,
        disable:0
      },
      tableLoading:false,
      option:tableOption,
      dataList:[],
      empList:[],
      treeData:[],
      page: {
        total: 0,
        pageSizes:[10,20,50,100],
        currentPage: 1,
        pageSize: 20,
      },
      filters: {
        empStatus: null,
        empId: "",
        deptId: "",
        logTime: [],
      },
      params: {}
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created(){
    this.startTime()
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams  = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      if (keepParams.detail.path !== "") {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
      this.page.currentPage = keepParams.params.start
      this.page.pageSize = keepParams.params.size
      this.filters.deptId = keepParams.params.deptId
      this.filters.logTime = keepParams.logTime
      this.filters.empId = keepParams.empId
      this.clickStatus = keepParams.clickStatus
    }
  },
  methods:{
    //显示工号
    async beforeFilter() {
      await getEmpList(true).then((res) => {
        if(res.data.code == 0) {
          this.empList = res.data.data;
        }
      });
      this.$loop(this.empList[0], this.empList[0])
      return false
    },
    changeStatus(){
      this.getAllList()
    },
    toDetail(row){
      let path = "/work-log-detail";
      let query = {
        id:row.sysUserId,
        logTime:this.filters.logTime,
        userName:row.sysUserName,
        department:row.deptName,
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    getAllList(){
      this.page.currentPage = 1
      this.getList()
    },
    getFirstAllList(){
      this.clickStatus = true
      this.getAllList()
    },
    getList(){
      this.tableLoading = true
      let params = {
        current:this.page.currentPage,
        size:this.page.pageSize,
        deptId:this.clickStatus == true?(this.filters.deptId):"",
        sysUserId:this.clickStatus == true?(this.filters.empId==''?'':this.filters.empId[this.filters.empId.length-1]):"",
        startDate:this.filters.logTime!==null&&this.filters.logTime.length>0?this.$moment(this.filters.logTime[0]).format("YYYY-MM-DD HH:mm:ss"):'',
        endDate:this.filters.logTime!==null&&this.filters.logTime.length>0?this.$moment(this.filters.logTime[1]).format("YYYY-MM-DD HH:mm:ss"):'',
      }
      this.params = Object.assign({}, params)
      getCountList(params).then(res=>{
         if(res.data.code == CodeMsg.CODE_0){
           let result = res.data.data
           this.dataList = result.records
           this.page.total = result.total
           this.tableLoading = false
         }
      })
      //需要缓存的参数
      let keepParams = {
        clickStatus:this.clickStatus,
        params:params,
        logTime:this.filters.logTime,
        empId:this.filters.empId,
        detail: { path: "", query: {} },
      }
      sessionStorage.setItem(`loginTime`,JSON.stringify(this.filters.logTime))
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
    },
    // 获取导出数据
    exportLog(number){
      exportLog({number: number}).then(response => {
        let {status, remark, ossUrl} = response.data.data
        // status = 2表示导出完成
        if(status==2){
          window.open(this.imgCdnUrl + ossUrl,"_self")
          return false
        }
        // status = -1表示导出失败报错了
        if(status == -1){
          this.$offsetMessage.warning(remark)
          return false
        }
        setTimeout(()=>{
          this.exportLog(number)
        },1500)
      })
    },
    // 导出表
    async exportTable(){
      try {
        const res = await getLogNumber(this.params)
        if(res.data.code == CodeMsg.CODE_0){
          this.exportLog(res.data.data)
        }
      }catch(error){
        this.$message({
          type: "warning",
          message: error || "请求失败",
        });
      }
    },
    reset(name){
      this.clickStatus = false
      this.$refs[name].resetFields()
      this.filters.empStatus = null
      this.filters.logTime = []
      this.filters.keyWords = ""
      this.filters.empId = ""
      this.filters.deptId = ""
      this.startTime()
      this.getAllList()
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    getDropList() {
      // 获取员工数据
      getEmpList(true).then((res) => {
        this.empList = res.data.data;
      });
      let params = {
        menuFlag:"emp_list"
      }
      fetchNewTree(params).then((response) => {
        this.treeData = response.data.data;
      });
    },
    startTime(){
      this.filters.logTime = []
      this.filters.logTime.push(this.$moment(new Date()).startOf("month")._d)
      this.filters.logTime.push(this.$moment(new Date())._d)
    }
  },
  mounted(){
    this.getDropList()
  }
};
</script>

<style scoped>
.left_btn_sty{
  margin-left: 20px;
  border-left: 1px solid #DCDFE6;
}
.handle-style{
  color: rgb(64, 158, 255) !important;
  cursor: pointer
}
.red_color_sty{
  color: red !important;
}
.orange_color_sty{
  color: orange !important;
}
.disbale_content{
  display: flex;
  justify-content: center;
}
.disable_img_sty{
  width:20px;
  height:20px;
  margin-left: 3px;
}
.left-icon-sty{
  font-size: 14px;
  margin-left: 2px;
}
.disabled-sty{
  margin-left: 5px;
}
</style>