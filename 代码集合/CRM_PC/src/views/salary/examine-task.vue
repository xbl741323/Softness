<template>
  <div class="examine-task-box">
    <el-form :model="examineTaskForm" inline @keyup.enter.native="getPlanTask()">
      <el-form-item label="考核任务：">
        <el-input placeholder="请输入方案名称" v-model.trim="examineTaskForm.name" >
          <el-button slot="append" icon="el-icon-search" @click="page.currentPage = 1; getPlanTask()"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="任务状态：">
        <el-select v-model="examineTaskForm.status">
          <el-option 
            v-for="item in planStatusList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-button size="mini" type="primary" @click="getPlanTask()">搜索</el-button>
      <el-button size="mini" @click="clear()">重置</el-button>
      <el-button size="mini" type="primary" @click="permissions.salary_job_edit ? createTask() : $notAuthorized()">创建新任务</el-button>
    </el-form>

    <el-table :data="taskList" border>
      <el-table-column label="任务名称">
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核职位" >
        <template slot-scope="{row}">
          <span>{{row.position | getPositionName(this_)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核部门">
        <template slot-scope="{row}">
          <span v-for="item in row.pageJobDeptList" :key="item.id">{{item.deptFullName}}; </span>
        </template>
      </el-table-column>
      <el-table-column label="使用人数" prop="countUser" align="center" width="150px"></el-table-column>
      <el-table-column label="周期类型" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{row.cycle | cycle}}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" align="center" width="150px">
        <template slot-scope="{row}">
          <el-switch v-model="row.status"  :active-value="1" :inactive-value="2" @change="permissions.salary_job_mod_status ? changeStatus(row) : $notAuthorized();getPlanTask() " />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="{row}">
          <el-button type="text" @click="permissions.salary_job_edit ? editPlanTask(row.id) : $notAuthorized()">编辑</el-button>
          <el-popconfirm
            :key="'j'+ Date.now()"
            confirm-button-text='确定'
            cancel-button-text='取消'
            @confirm="permissions.salary_job_delete ? delPlanTask(row.id) : $notAuthorized()"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除该条任务吗？"
          >
            <el-button slot="reference" type="text" size="mini" class="del-plantask-btn" v-if="row.countUser == 0 || row.status == 2">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>


    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        background
        :page-sizes="[5, 10, 20, 30, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { planTask, delJob, modJobStatus } from "@/api/salary/examine";
import { jobList, } from "@/api/staff/index";
import { mapGetters } from "vuex";
export default {
  data(){
    return {
      this_:this,
      examineTaskForm: {},
      taskList: [],
      positionList:[],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
      },
      planStatusList:[
        {value: 1,label:'启用'},
        {value: 2,label:'禁用'},
      ]
    }
  },
  filters:{
    getPositionName(val, this_){
      var positionName = '';
      this_.positionList.forEach(el => {
        if(el.positionId == val){
          positionName = el.positionName;
        }
      });
      return positionName
    },
    cycle(val){
      return val == 1 ? '月度' : val == 2 ? '年度' : '';
    },
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created(){
    let sessionData = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
    if(sessionData && sessionData.id){
      this.$router.push({
        path: sessionData.path,
        query: {
          id: sessionData.id,
          operate: 'edit'
        }
      })
    }
    if(sessionData && sessionData.pageSize){
      this.page = {
        pageSize: sessionData.pageSize,
        currentPage: sessionData.pageNo,
        total:0
      }
      this.examineTaskForm.name = sessionData.name;
      this.examineTaskForm.status = sessionData.status
    }
    this.getPlanTask();
  },
  methods:{
    clear(){
      this.examineTaskForm = {};
      this.getPlanTask();
    },
    changeStatus(row){
      let param = {
        jobId: row.id,
        status: row.status
      }
      modJobStatus(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message:'考核任务状态修改成功！',
            duration: 1000
          })
          this.getPlanTask();
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    editPlanTask(id){
      let path = '/create-examinetask';
      let query = {
        id: id,
        operate: 'edit'
      }
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(Object.assign({path},query)));
      this.$router.push({ path: path, query: query });
    },
    delPlanTask(id){
      delJob(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message:'删除成功！'
          })
          this.getPlanTask();
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    getPlanTask(){
      let param = {
        name: this.examineTaskForm.name,
        status: this.examineTaskForm.status,
        pageSize: this.page.pageSize,
        pageNo: this.page.currentPage
      }
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(param));
      jobList({current: 1, size: -1}).then(res=>{
        this.positionList = res.data.data.records;
      })
      planTask(param).then(res=>{
        this.taskList = res.data.data.records;
        this.page.total = res.data.data.total;
      })
    },
    createTask(){
      this.$router.push({
        path:'/create-examinetask'
      })
    },
    handleSizeChange(val){
      this.page.pageSize = val;
      this.getPlanTask();
    },
    handleCurrentChange(val){
      this.page.currentPage = val;
      this.getPlanTask();
    },
  }
}
</script>

<style scoped>
  .examine-task-box{
    background: #FFFFFF;
    padding: 20px;
    height: 100%;
  }
  .del-plantask-btn{
    margin-left: 10px;
    color: red;
  }
</style>