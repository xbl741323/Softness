<template>
  <div class="salary-detail-frame">
    <p>{{deptName}} {{$route.query.yearMonth}}工资</p>
    <el-form :model="sheetForm" inline>
      <el-form-item label="部门：" prop="deptId">
        <avue-input-tree ref="tree" v-model="sheetForm.deptId" :dic="treeData" :node-click="getNodeData" :props="{label: 'name',value: 'id'}" placeholder="请选择部门" ></avue-input-tree>
      </el-form-item>
      <el-form-item label='关键字：'>
        <el-input placeholder="请输入姓名关键字、工号、职位名称" v-model="sheetForm.keyWords" />
      </el-form-item>
      <el-button size="mini" type="primary" @click="getSalaryDetail">搜索</el-button>
      <el-button size="mini" @click="reset()">重置</el-button>
    </el-form>

    <el-table :data="salaryData" border :header-cell-style="{background:'#F3F4F6'}">
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="工号" prop="number"></el-table-column>
      <el-table-column label="部门" prop="deptName"></el-table-column>
      <el-table-column label="职位" prop="positionName"></el-table-column>
      <el-table-column label="职级" prop="rankName"></el-table-column>
      <el-table-column label="岗位" prop="stationName"></el-table-column>
      <el-table-column v-for="(item, index) in parentHeader" :key="index" :label="item | transferKey" align="center" width="160">
        <el-table-column v-for="(el, subcript) in salaryHeader[item]" :key="subcript" :label="el.resultName" align="center" >
          <template slot-scope="{row}">
            <span>{{row.resultNameList[item][subcript].resultVal}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="个税" prop="taxesAmount"></el-table-column>
      <el-table-column label="预留" prop="reservedAmount"></el-table-column>
      <el-table-column label="应发工资" prop="shouldAmount"></el-table-column>
      <el-table-column label="实发工资" prop="realAmount"></el-table-column>
      <el-table-column label="状态" fixed="right" prop="state">
        <template slot-scope="{row}">
          <span @click="row.state ? viewRemark(row) : ''" :class=" row.state ? 'reamrk-btn' : ''">{{row.state ? '已确认'  : '未确认'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题反馈" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" @click="viewRemark(row)">查看反馈</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        background
        :page-sizes="[5, 10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

  <el-dialog :visible.sync="remarkDialog" title="问题反馈" :close-on-click-modal="false" width="550px">
    <div class="remark-box">
      <p>{{remark}}</p>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import { fetchNewTree } from "@/api/admin/dept";
import { salaryDetail } from "@/api/salary/salary";
import salary from './examine'
export default {
  data(){
    return {
      remarkDialog: false,
      sheetForm: {
        deptId: sessionStorage.getItem('deptId') || '',
        keyWords: sessionStorage.getItem('keyWords') || ''
      },
      treeData: [],
      salaryData: [],
      parentHeader: [],
      token: '',
      pageNo: 1,
      pageSize: 20,
      total: 0,
      remark: '',
      deptName: ''
    }
  },
  filters:{
    transferKey(val){
      return salary.transferKey(val);
    }
  },
  created(){
    this.$set(this.sheetForm,'deptId',sessionStorage.getItem('deptId') || this.$route.query.deptId);
    this.token = localStorage.getItem('salaryToken');
    this.deptName = sessionStorage.getItem('deptName') || this.$route.query.deptName;
    this.getSalaryDetail();
    this.getDept();
  },
  methods:{
    getNodeData(val){
      this.sheetForm.deptId = val.id;
      this.deptName = val.name;
      this.getSalaryDetail();
    },
    reset(){
      this.$set(this.sheetForm,'deptId',this.$route.query.deptId);
      this.$set(this.sheetForm,'keyWords','');
      this.getSalaryDetail();
    },
    viewRemark(row){
      this.remark = row.remark;
      this.remarkDialog = true;
    },
    getSalaryDetail(){
      let param = {
        yearMonth: this.$route.query.yearMonth,
        deptId: this.sheetForm.deptId,
        token: this.token,
        key: this.sheetForm.keyWords,
        positionName: this.sheetForm.positionRank
      }
      sessionStorage.setItem('keyWords',this.sheetForm.keyWords);
      sessionStorage.setItem('deptId',this.sheetForm.deptId);
      sessionStorage.setItem('deptName',this.deptName);
      salaryDetail(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.salaryData = res.data.data;
          this.salaryHeader = res.data.data[0].resultNameList;
          this.parentHeader = Object.keys(this.salaryHeader);
        }else{
          // 需要缓存的参数
          let keepParams = {
            active: '1',
            detail: { path: "", query: {} },
          };
          sessionStorage.setItem('/salary/salary-sheet', JSON.stringify(keepParams));
          this.$message({
            type:'warning',
            message: res.data.msg
          })
          history.go(-1);
        }
      })
    },
    getDept(){
      fetchNewTree({menuFlag:"emp_list"}).then((response) => {
        this.treeData = response.data.data;
      });
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getSalaryDetail();
    },
    handleCurrentChange(){
      this.pageNo = val;
      this.getSalaryDetail();
    }
  }
}
</script>

<style scoped>
  .salary-detail-frame{
    background: #FFFFFF;
    padding: 20px;
  }
  .remark-box{
    display: grid;
    grid-template-columns: 20% 80%;
    padding: 10px;
  }
  .reamrk-btn{
    color: #128EE9;
  }
</style>