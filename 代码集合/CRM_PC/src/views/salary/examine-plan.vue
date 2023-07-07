<template>
  <div class="plan-frame">
    <el-form :model="planForm" inline @keyup.enter.native="getExaminePlan()">
      <el-form-item label="考核方案：">
        <el-input v-model.trim="planForm.keyWords" placeholder="请输入方案名称" >
        <el-button slot="append" icon="el-icon-search" @click="page.currentPage = 1;getExaminePlan()"></el-button>
    </el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="permissions.salary_plan_edit ? createPlan() : $notAuthorized()">创建方案</el-button>       
      </el-form-item>
    </el-form>
    <el-table :data="planList" border >
      <el-table-column label="方案名称" width="200px">
        <template slot-scope="{row}">
          <span class="paln-name" @click="editPlan(row)">{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联任务">
        <template slot-scope="{row}">
          <span v-for="item in row.planJobList" :key="item.jobId">{{item.jobName}}; </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px">
        <template slot-scope="{row}">
          <el-button type="text" @click="permissions.salary_plan_edit ? editPlan(row) : $notAuthorized()">编辑</el-button>
          <el-popconfirm
            :key="'j'+ Date.now()"
            confirm-button-text='确定'
            cancel-button-text='取消'
            @confirm="permissions.salary_plan_delete ? delJob(row.id) : $notAuthorized()"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除该条方案吗？"
          >
            <el-button slot="reference" type="text" size="mini" class="del-plan-btn" v-if="row.planJobList.length == 0 && (row.planType == 1 || row.planType == 2 )">删除</el-button>
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
import { examinePlan, delPlan } from "@/api/salary/examine";
import { mapGetters } from "vuex";
import { saveDetal } from "@/util/clearDetail";
export default {
  data(){
    return {
      planForm: {
        keyWords: sessionStorage.getItem("planName") ? sessionStorage.getItem("planName") : "",
      },
      planList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
      },
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created(){
    let sessionData = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
    if(sessionData && sessionData.id){
      this.$router.push({
        path: sessionData.path,
        query:{
          id: sessionData.id,
          operate: sessionData.operate
        }
      })
    }
    if(sessionData && sessionData.pageSize){
      this.page = {
        pageSize: sessionData.pageSize || 20,
        currentPage: sessionData.currentPage || 1,
        total: 0
      }
      this.planForm.keyWords = sessionData.keyWords || '';
    }
    this.getExaminePlan();
  },
  methods:{
    delJob(id){
      delPlan(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message:'删除考核方案成功！'
          })
          this.getExaminePlan();
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    getExaminePlan(){
      sessionStorage.setItem("planName", this.planForm.keyWords);
      let param = {
        pageSize: this.page.pageSize,
        pageNo: this.page.currentPage,
        name: this.planForm.keyWords
      }
      let keep = {
        pageSize: this.page.pageSize,
        currentPage: this.page.currentPage,
        keyWords: this.planForm.keyWords
      }
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keep));
      examinePlan(param).then(res=>{
        this.planList = res.data.data.records;
        this.page.total = res.data.data.total;
      })
    },
    editPlan(row){
      let path = '/create-examine';
      let query = {
        id: row.id,
        operate: 'edit'
      }
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(Object.assign({path},query)));
      this.$router.push({ path: path, query: query });  
    },
    createPlan(){
      this.$router.push({
        path:'/create-examine'
      })
    },
    handleSizeChange(val){
      this.page.pageSize = val;
      this.getExaminePlan();
    },
    handleCurrentChange(val){
      this.page.currentPage = val;
      this.getExaminePlan();
    },
  }
}
</script>

<style scoped >
  .plan-frame{
    background: #FFFFFF;
    height: 100%;
    padding: 20px;
  }
  .paln-name{
    color: #36a6fe;
    cursor: pointer;
  }
  .del-plan-btn{
    color: red;
    margin-left: 10px;
  }
</style>