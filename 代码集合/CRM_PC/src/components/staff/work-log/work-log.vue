<template>
  <div class="work_log">
    <!-- 筛选区域 -->
    <div class="title">
        <span @click="dialogVisible = true">{{ staffInfo.userName }}</span> 的日志（{{staffInfo.department}}）
    </div>
    <el-form :model="filters" ref="filters" inline>
      <el-form-item label="关键字：" prop="keyWords">
        <el-input
          @keyup.enter.native="getFirstAllList()"
          v-model="filters.keyWords"
          placeholder="请输入工作内容关键字">
        </el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="filters.status">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="正常日志" :value="0"></el-option>
          <el-option label="未填写日志" :value="2"></el-option>
          <el-option label="过期日志" :value="1"></el-option>
        </el-select>
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
    </el-form>
    <avue-crud
      ref="crud"
      :page.sync="page"
      :data="dataList"
      :option="option"
      :table-loading="tableLoading"
      @size-change="sizeChange"
      @on-load="getList">

    <template slot="content" slot-scope="scope">
       <span class="handle-style" @click="showDetail(scope.row)" v-if="scope.row.content!==''&&scope.row.content!==null">{{ scope.row.content }}</span>
       <span v-else>/</span>
    </template>
    <template slot="status" slot-scope="scope">
      <span v-if="scope.row.isEffective == 1||scope.row.isEffective == 2||scope.row.isEffective == 0" :class="[scope.row.isEffective == 1?'orange_sty_code':scope.row.isEffective == 2?'red_sty_code':'']">{{ scope.row.isEffective|filterEffective }}</span>
      <span v-else>节假日(含周末)</span>
    </template>
    <template slot="createTime" slot-scope="scope">
      <span v-if="scope.row.createTime!==''&&scope.row.createTime!==null">{{ scope.row.createTime }}</span>
      <span v-else>/</span>
    </template>
    </avue-crud>
    <!-- 查看/编辑dialog -->
    <el-dialog :title="logTitle" :visible.sync="logDialog" :close-on-click-modal="false">
      <operate-log ref="workLog" :operateStatus='operateStatus' @close-log='closeLog()'></operate-log>
    </el-dialog>
    
      <!-- 姓名切换 -->
      <el-dialog :visible.sync="dialogVisible" width="24%">
        <div>
          <span>姓名：</span>
          <el-cascader
            clearable
            v-model="staffInfo.number"
            ref="cascader"
            :show-all-levels="false"
            filterable
            :before-filter="beforeFilter"
            :options="serviceList"
            :props="{ value: 'customerNo', label: 'label' }">
            <template slot-scope="{data}">
            <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
              <div slot="content">{{data.customerNo}}</div>
              <span>{{data.label}}</span>
            </el-tooltip>
              </template>
            </el-cascader>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="changeStaff">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>  
import { getEmpList } from "@/api/clue/clue";
import { getDetailList } from "@/api/work-log/index"
import operateLog from "@/components/staff/work-log/operate-log"
import * as CodeMsg from "@/api/common/CodeChange"
import { tableOption } from "@/const/crud/work-log/work-log";
import { getDeptService } from "@/api/admin/user";
export default {
  components:{
    operateLog
  },
  data() {
    return {
      staffInfo: {},
      dialogVisible:false,
      clickStatus:false,
      id:"",
      serviceList:[],
      operateStatus:0,
      logTitle:"",
      logDialog: false,
      treeData:[],
      tableLoading: false,
      option: tableOption,
      page: {
        total: 0,
        pageSizes:[10,20,50,100],
        currentPage: 1,
        pageSize: 20,
      },
      dataList: [],
      empList: [],
      deptList: [],
      filters: {
        keyWords: "",
        emp: "",
        dept: "",
        status: null,
        createTime: null,
        logTime: [],
      },
    };
  },
  filters:{
    filterEffective(val){
      return val == 0?'正常':val == 1?'过期':val == 2?'未填写':'节假日(含周末)'
    }
  },
  created(){
    this.id = this.$route.query.id
    if(sessionStorage.getItem(`loginTime`)){
      this.filters.logTime = JSON.parse(sessionStorage.getItem(`loginTime`))
    }
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      this.page.currentPage = keepParams.params.start
      this.page.pageSize = keepParams.params.size
      this.filters.keyWords = keepParams.params.content
      this.filters.status = keepParams.params.isEffective
      this.filters.createTime = keepParams.createTime
      this.clickStatus = keepParams.clickStatus
    }
    this.getService()
  },
  methods: {
       //发起人显示工号
    async beforeFilter() {
      await getEmpList(true).then((res) => {
        if(res.data.code == 0) {
          this.serviceList = res.data.data;
        }
      });
      this.$loop(this.serviceList[0], this.serviceList[0])
      return false
    },
     getService() {
      getDeptService().then((res) => {

        this.serviceList = res.data.data;
      });
    //  let staffInfoData= JSON.parse(sessionStorage.getItem(`${this.$route.path}`)).staffInfo 
    // if (staffInfoData&&staffInfoData.userName) {
    //   console.log('dddddddd');
    //     this.staffInfo=staffInfoData
    //     console.log(staffInfoData);
    // }else{
       let staffInfo=this.staffInfo
       staffInfo.userName=this.$route.query.userName
       staffInfo.department=this.$route.query.department
      //  this.staffInfo=staffInfo
       console.log('ssssss');
    // }
    },
      changeStaff() {
      this.staffInfo = {
        number: this.$refs.cascader.getCheckedNodes()[0].value,
        name: this.$refs.cascader.getCheckedNodes()[0].label,
        userName:this.$refs.cascader.getCheckedNodes()[0].label,
        userId: this.$refs.cascader.getCheckedNodes()[0].data.value-0,
        department: this.$refs.cascader.getCheckedNodes()[0].data.customerDeptName
      };
      this.staffInfo.creatorNo = this.$refs.cascader.getCheckedNodes()[0].value
      this.staffInfo.creatorName = this.$refs.cascader.getCheckedNodes()[0].label
      // this.getAllList();
      this.id=this.staffInfo.userId
      this.getList()
      this.dialogVisible = false;
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    showDetail(row){
      this.logTitle = "查看日志"
      this.logDialog = true
      this.$nextTick(()=>{
      if(this.$refs.workLog){
        this.$refs.workLog.logInfo.id = row.id
        this.$refs.workLog.logInfo.textarea = row.content
        this.$refs.workLog.logInfo.journalTime = row.journalTime
        this.$refs.workLog.$refs.upload.imgList = []
        this.$refs.workLog.disabled = true
        if(row.pictures!==null){
           row.pictures.forEach(item=>{
             if(item!==''){
               this.$refs.workLog.$refs.upload.imgList.push({response:{data:item.trim()}})
             }
           })
        }
       }
      })
    },
    closeLog(){
      this.logDialog = false
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getFirstAllList() {
      this.clickStatus = true
      this.getAllList()
    },
    getList() {
      this.tableLoading = true
      let params = {
        current:this.page.currentPage,
        size:this.page.pageSize,
        content:this.clickStatus == true? (this.filters.keyWords):"",
        createId:this.id,
        isEffective:this.clickStatus == true?(this.filters.status):null,
        startDate:this.filters.logTime!==null&&this.filters.logTime.length>0?this.$moment(this.filters.logTime[0]).format( "YYYY-MM-DD"):"",
        endDate:this.filters.logTime!==null&&this.filters.logTime.length>0?this.$moment(this.filters.logTime[1]).format( "YYYY-MM-DD"):"",
        // createStart:this.clickStatus == true?(this.filters.createTime == null ?"":this.$moment(this.filters.createTime[0]).format( "YYYY-MM-DD")):"",
        // createEnd:this.clickStatus == true?(this.filters.createTime == null ?"":this.$moment(this.filters.createTime[1]).format( "YYYY-MM-DD")):"",
      }
      // 需要缓存的参数
      let keepParams = {
        clickStatus:this.clickStatus,
        params:params,
        logTime:this.filters.logTime,
        createTime:this.filters.createTime,
        staffInfo:this.staffInfo
      }
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
      getDetailList(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.dataList = res.data.data.records
          this.page.total = res.data.data.total
          this.tableLoading = false
        }
      })
    },
    reset(name){
      this.clickStatus = false
      this.$refs[name].resetFields()
      this.filters.createTime = null
      this.filters.logTime = null
      this.filters.keyWords = ""
      this.filters.emp = ""
      this.filters.dept = ""
      this.filters.status = null
      this.getAllList()
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 18px;
  padding: 10px 0 20px 0;
}
.title span {
  color: #36a6fe;
  cursor: pointer;
  margin-right: 20px;
  text-decoration: underline;
  font-weight: 500;
}
.red_sty_code{
  color: red !important;
}
.orange_sty_code{
  color: orange !important;
}
.handle-style{
  color: rgb(64, 158, 255) !important;
  cursor: pointer
}
</style>