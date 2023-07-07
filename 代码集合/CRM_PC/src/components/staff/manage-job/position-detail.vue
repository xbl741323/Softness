<template>
  <div class="position-detail-box">
    <p class="position-name">{{positionName}}</p>
    <el-tabs v-model="category" @tab-click="getPositionDetail()">
      <el-tab-pane v-for="item in categoryList" :key="item.type" :name="''+item.type" :label="item.name"></el-tab-pane>
    </el-tabs>
    
    <el-popconfirm
      :key="'r'+ Date.now()"
      confirm-button-text='确定'
      cancel-button-text='取消'
      @confirm="batchDelRank({positionRankIds: selectedRankIds.join(',')})"
      icon="el-icon-info"
      icon-color="red"
      title="确定批量删除所选职位吗？"
    >
      <el-button slot="reference" size="mini" type="primary" :disabled="selectedRankIds.length == 0" v-if="category != -1">批量删除</el-button>
    </el-popconfirm>
    <!-- 操作记录 -->
    <el-table :data="positionLogs" border v-if="category == -1" :key="'a'+new Date()" class="log-poeition-list">
      <el-table-column label="操作时间" prop="createTime"></el-table-column>
      <el-table-column label="操作人" prop="createBy"></el-table-column>
      <el-table-column label="操作内容" prop="title"></el-table-column>
    </el-table>
    
    <el-table :data="rankList" @selection-change="selcetRanks" :row-key="(row)=>{return row.positionRankId}" v-if="category != -1">
      <el-table-column type="selection" :selectable="selectable" :reserve-selection="true"></el-table-column>
      <el-table-column label="职位级别" prop="rankLevel" align="center"></el-table-column>
      <el-table-column label="职级描述" prop="description" align="center"></el-table-column>
      <el-table-column label="基本工资" prop="basicSalary" align="center"></el-table-column>
      <el-table-column label="岗位工资" prop="rankSalary" align="center"></el-table-column>
      <el-table-column label="绩效工资" prop="performanceSalary" align="center"></el-table-column>
      <el-table-column label="使用人数" align="center">
        <template slot-scope="{row}">
          <span class="user-count" @click="getRankUsedSysUserDetail(row)" >{{row.usedSysUserCounts}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="editSalary(row)">编辑</el-button>
          
          <el-popconfirm
            :key="'d'+ Date.now()"
            confirm-button-text='确定'
            cancel-button-text='取消'
            @confirm="batchDelRank({positionRankIds: row.positionRankId})"
            icon="el-icon-info"
            icon-color="red"
            title="确定批量删除所选职位吗？"
          >
            <el-button slot="reference" size="mini" type="text" class="del-salary" v-if="row.usedSysUserCounts == 0">删除</el-button>
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
    
    <!-- 编辑工资 -->
    <el-dialog :visible.sync="salaryDialog" title="编辑职级信息" width="800px" :close-on-click-modal="false">
      <el-form :model="salaryForm" ref="salaryForm" :rules="salaryRules" inline>
        <p>职位级别：{{salaryForm.rankLevel}}</p>
        <el-form-item label="基本工资" prop="basicSalary">
          <el-input placeholder="请输入基本工资" v-model="salaryForm.basicSalary" />
        </el-form-item>
        <el-form-item label="岗位工资" prop="rankSalary">
          <el-input placeholder="请输入岗位工资" v-model="salaryForm.rankSalary" />
        </el-form-item>
        <el-form-item label="绩效工资" prop="performanceSalary">
          <el-input placeholder="请输入绩效工资" v-model="salaryForm.performanceSalary" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="edit()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 使用人 -->
    <el-dialog :visible.sync="userDialog" :close-on-click-modal="false" width="600px" title="职级使用人">
      <div class="user-list">
        <p v-for="item in userList" :key="item.number">{{item.name}}-{{item.number}}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { positionDetail, editRankInfo, delPositionRank, rankUsedSysUserDetail, pageSysLogByOperatedId } from "@/api/staff/index";
export default {
  data(){
    var salaryValidate = (rule, value, callback)=>{
      let pattern = /^\d+(\.(\d{1,2}))?$/;
      if(pattern.test(value)){
        callback();
      }else{
        callback(new Error('请输入0或正数,小数点后两位'))
      }
    }
    return{
      category: '0',
      positionId: '',
      positionName: '',
      categoryList: [],
      positionLogs: [],
      rankList: [],
      selectedRankIds: [],
      userList: [],
      salaryForm: {},
      salaryRules: {
        basicSalary:[{required: true, validator: salaryValidate, trigger:'blur'}],
        performanceSalary:[{required: true, validator: salaryValidate, trigger:'blur'}],
        rankSalary:[{required: true, validator: salaryValidate, trigger:'blur'}],
      },
      salaryDialog: false,
      userDialog: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
      },
    }
  },
  mounted(){
    this.positionId = this.$route.query.id
    this.positionName = this.$route.query.positionName;
    this.categoryList = JSON.parse(this.$route.query.categoryList);
    this.categoryList.push({type: -1, name: '操作记录'});
    this.category = this.categoryList[0].type+'';
    this.getPositionDetail();
  },
  methods:{
    getRankUsedSysUserDetail(row){
      rankUsedSysUserDetail(row.positionRankId).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.userList = res.data.data;
          if(this.userList.length> 0){
            this.userDialog = true;
          }
        }
      })
    },
    batchDelRank(row){
      delPositionRank(row).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message: '删除成功！'
          })
          this.getPositionDetail();
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    edit(){
      let param = {
        positionRankId: this.salaryForm.positionRankId,
        basicSalary: this.salaryForm.basicSalary,
        performanceSalary: this.salaryForm.performanceSalary,
        rankSalary: this.salaryForm.rankSalary
      }
      this.$refs.salaryForm.validate(valid=>{
        if(valid){
          editRankInfo(param).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              this.$message({
                type:'success',
                message:'信息编辑成功！'
              })
              this.salaryDialog = false;
              this.getPositionDetail();
            }else{
              this.$message({
                type:'warning',
                message: res.data.msg
              })
            }
          })
        }else{
          return false;
        }
      })
    },
    editSalary(row){
      this.salaryForm = row;
      this.salaryDialog = true;
    },
    selectable(row){
      return row.usedSysUserCounts == 0;
    },
    selcetRanks(arr){
      this.selectedRankIds = Array.from(arr,({positionRankId})=>positionRankId);
    },
    getPositionDetail(){
      if(this.category == -1){//操作记录
        let param = {
          operatedId: this.positionId,
          pageNo: this.page.currentPage,
          pageSize: this.page.pageSize
        }
        pageSysLogByOperatedId(param).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.positionLogs = res.data.data.records;
            this.page.total = res.data.data.total;
          }
        })
      }else{
        let param = {
          category: this.category,
          positionId: this.positionId,
          current: this.page.currentPage,
          size: this.page.pageSize
        }
        positionDetail(param).then(res=>{
          this.rankList =  res.data.data.records;
          this.page.total = res.data.data.total;
        })
      };
    },
    handleSizeChange(val){
      this.page.pageSize = val;
      this.getPositionDetail();
    },
    handleCurrentChange(val){
      this.page.currentPage = val;
      this.getPositionDetail();
    },
  }
}
</script>

<style scoped>
.position-detail-box{
  background: #FFFFFF;
  padding: 20px;
  min-height: 100%;
}
.del-salary{
  margin-left: 10px;
  color: red;
}
.position-name{
  font-size: 16px;
  font-weight: 550;
  color: #555555;
}
.user-count{
  color: #36a6fe;
  cursor: pointer;
}
.user-list{
  display: grid;
  grid-template-columns: repeat(4,1fr);
}
.log-poeition-list{
  margin: 10px 0;
}
</style>