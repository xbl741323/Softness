<template>
  <div class="list-job">
    <el-form :model="jobForm" ref="jobForm" inline>
      <el-form-item label="搜索：">
        <el-input v-model="jobForm.keyWords" placeholder="请输入职位名称/创建人" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="page.currentPage = 1; getJobList()"></el-button>
        </el-input>
        <!-- <el-input v-model="jobForm.keyWords"  placeholder="请输入职位名称/创建人" /> -->
      </el-form-item>
      <el-button type="primary" @click="addJob()">新增职位</el-button>
      <el-popconfirm
        :key="'f'+ Date.now()"
        confirm-button-text='确定'
        cancel-button-text='取消'
        @confirm="batchDelJob({ids:delIdsList})"
        icon="el-icon-info"
        icon-color="red"
        title="确定批量删除所选职位吗？"
      >
        <el-button slot="reference" :disabled="delIdsList.length == 0" class="batch-del">批量删除</el-button>
      </el-popconfirm>
    </el-form>
    <el-table :data="jobList" border @selection-change="selcetJobs" :row-key="getRowKey">
      <el-table-column type="selection" :selectable="selectable" :reserve-selection="true"></el-table-column>
      <el-table-column label="职位名称">
        <template slot-scope="{row}">
          <span class="position-name" @click="toDetail(row)">{{row.positionName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="职级类型" align="center" prop="rankLevel" width="120">
        <template slot-scope="{row}">
          <p v-for="(item, index) in row.categoryTypeAndNames" :key="index" class="table-label">{{item.name}}</p>
        </template>
      </el-table-column>
      <el-table-column label="使用部门" align="center">
        <template slot-scope="{row}">
          <p v-for="(item, index) in row.usedDeptNames" :key="index" class="table-label">{{item}}</p>
        </template>
      </el-table-column>
      <el-table-column label="总使用人数" width="100" align="center">
        <template slot-scope="{row}">
          <p class="table-label" >{{row.usedSysUserCounts}}</p>
        </template>
      </el-table-column>
      <el-table-column label="关联考核任务" align="center">
        <template slot-scope="{row}">
          <p v-for="(item, index) in row.jobNames" :key="index" class="table-label">{{item}}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="150" align="center">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" :content="'工号：'+ empNo +' 部门：'+ deptName" placement="top">
            <span @mouseover="showUserInfo(row.createBy)">{{row.createByName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="editJob(row)">编辑</el-button>
          <el-popconfirm
            :key="'a'+ Date.now()"
            confirm-button-text='确定'
            cancel-button-text='取消'
            @confirm="batchDelJob({ids:row.positionId})"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除该条职位吗？"
          >
            <el-button slot="reference" type="text" size="mini" class="del-job-btn" v-if="selectable(row)">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-job">
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

    <!-- 新增/编辑职位 -->
    <el-dialog :visible.sync="jobDialog" :close-on-click-modal="false" width="820px" :title="operateTitle">
      <add-job v-if="jobDialog" :operate="operateId" @operateSuccess="operateSuccess" :editJobInfo="editJobInfo" ></add-job>
    </el-dialog>

    <!-- 使用人 -->
    <el-dialog :visible.sync="userDialog" title="使用人" width="500px" :close-on-click-modal="false">
      <div class="user-list">
        <p
          v-for="item in userList"
          :key="item.id"
        >{{item.name}}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addJob from '@/components/staff/manage-job/index';
import { jobList, deletePositionById, deletePositionByIds } from "@/api/staff/index";
export default {
  components:{
    addJob
  },
  data(){
    return {
      jobDialog: false,
      userDialog: false,
      jobList:[],
      userList: [],
      delIdsList:[],
      jobForm: {},
      editJobInfo: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
      },
      operateTitle:'',
      operateId: 0,
    }
  },
  mounted(){
    this.getJobList();
  },
  methods:{
    toDetail(row){
      this.$router.push({
        path:'/position-detail',
        query:{
          id: row.positionId,
          positionName: row.positionName,
          categoryList: JSON.stringify(row.categoryTypeAndNames)
        }
      })
    },
    getRowKey(row){
      return row.id;
    },
    selectable(row){
      return row.usedSysUserCounts == 0;
    },
    selcetJobs(row){
      this.delIdsList = [];
      row.forEach( el => {
        this.delIdsList.push(el.positionId);
      });
    },
    batchDelJob(row){
      deletePositionByIds(row).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message: '职位批量删除成功!',
            duration: 2000
          })
          this.getJobList();
        }else{
          this.$message({
            type:'error',
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    delJob(row){
      deletePositionById(row.id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message: '职位删除成功!',
            duration: 2000
          })
          this.getJobList();
        }else{
          this.$message({
            type:'error',
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    viewUser(row){
      if(row.sysUserList){
        this.userList = row.sysUserList;
        this.userDialog = true;
      }
    },
    editJob(row){
      this.operateId = 1;
      this.operateTitle = '编辑职位';
      this.jobDialog = true;
      this.editJobInfo = row;
    },
    getJobList(){
      let param = {
        positionNameOrCreateByName: this.jobForm.keyWords,
        current: this.page.currentPage,
        size: this.page.pageSize,
      }
      jobList(param).then(res=>{
        this.jobList = res.data.data.records;
        this.page.total = res.data.data.total;
      })
    },
    addJob(){
      this.operateId = 0;
      this.operateTitle = '新增职位';
      this.jobDialog = true;
    },
    operateSuccess(){
      this.jobDialog = false;
      this.getJobList();
    },
    handleSizeChange(val){
      this.page.pageSize = val;
      this.getJobList();
    },
    handleCurrentChange(val){
      this.page.currentPage = val;
      this.getJobList();
    },
  }
}
</script>

<style scoped>
  .list-job{
    background: #FFFFFF;
    height: 100%;
    width: 100%;
  }
  .del-job-btn{
    margin-left: 10px;
    color: #f04d4d;
  }
  .pagination-job{
    margin: 30px;
    text-align: right;
  }
  .using-list{
    color: #36a6fe;
    cursor: pointer;
  }
  .user-list{
    max-height: 300px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 15px;
  }
  .batch-del{
    margin-left: 10px;
  }
  .table-label{
    margin: 0;
  }
  .position-name{
    color:#36a6fe;
    cursor: pointer;
  }
</style>