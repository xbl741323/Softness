<template>
  <div >
    <el-form :model="jobInfo" ref="jobInfo" :rules="jobRules" inline class="job-add-box" label-width="95px">
      <p class="subtitle">基本信息</p>
      <el-form-item label="职位名称：" prop="positionName" :rules="jobRules.positionName">
        <el-input v-model="jobInfo.positionName" maxlength="10" placeholder="请输入职位名称" />
      </el-form-item>
      <el-form-item label="使用部门：" prop="dept" :rules="jobRules.dept">
        <el-cascader
          v-model="jobInfo.dept"
          :options="deptData"
          :props="{ multiple: true, checkStrictly: true, emitPath: false}"
          @change="deptArr"
          filterable
          collapse-tags
          clearable>
        </el-cascader>
      </el-form-item>

      <p class="subtitle">职级信息</p>
      <el-tabs v-model="categoryId" @tab-click="handleClick">
        <el-tab-pane  v-for="item in rankCategoryList" :key="item.number" :name="''+item.number" :label="item.name" ></el-tab-pane>
      </el-tabs>
      <div class="rank-list-box">
        <el-checkbox-group v-model="checkRankList" class="check-group">
          <el-checkbox v-for="item in rankList" :key="item.rankId" :label="item.rankId" @click.native.prevent="getItem(item)" class="limit-word">{{item.rankLevel}}({{item.description}})</el-checkbox>
        </el-checkbox-group>
      </div>
      
      <div class="position-info-list">
        <div v-for="(item, index) in allOfChecked" :key="index">
          <div class="minus-img">
            <p>{{item.rankLevel}} <span class="rank-desc" v-if="item.description.length > 0">({{item.description}})</span></p>
            <img @click="delInfo(item,index)" src="@/assets/images/ip-servers/dedut_icon@2x.png" alt="">
          </div>
          <div class="info-job">
            <el-form-item label="基本工资：" :prop="index+'basicSalary'" :rules="jobRules.basicSalary">
              <el-input v-model="item.basicSalary" placeholder="请输入基本工资" />
            </el-form-item>
            <el-form-item label="岗位工资：" :prop="index+'rankSalary'" :rules="jobRules.rankSalary">
              <el-input v-model="item.rankSalary" placeholder="请输入岗位工资" />
            </el-form-item>
            <el-form-item label="绩效工资：" :prop="index+'performanceSalary'" :rules="jobRules.performanceSalary">
              <el-input v-model="item.performanceSalary" placeholder="请输入绩效工资" />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>

    <div class="line-job"></div>
    <!-- 操作 -->
    <div class="operate-btn">
      <el-button size="mini" type="primary" v-if="operate == 0" @click="addOrEditJob(0)">创建</el-button>
      <el-button size="mini" v-if="operate == 1" @click="closeDilog()">取消</el-button>
      <el-button size="mini" type="primary" v-if="operate == 1" @click="addOrEditJob(1)">确定</el-button>
    </div>
  </div>
</template>

<script>
import { savePosition } from '@/api/staff/index'
import { fetchNewTree } from "@/api/admin/dept";
import { getRankCategoryList, listRankByCategory, editPosition, deleteByPositionRankId  } from "@/api/staff/index";
import Vue from 'vue'
export default {
  props:{
    operate:{//0-新增 1-编辑
      type: Number,
      default: 0
    },
    editJobInfo: {//需要编辑的数据
      type: Object,
    }
  },
  data(){
    var basicSalaryValidate = (rule, value, callback)=>{
      let index = rule.field.match(/(\d)/)[1];
      let pattern = /^\d+(\.(\d{1,2}))?$/;
      if(pattern.test(this.allOfChecked[index].basicSalary)){
        callback();
      }else{
        callback(new Error('请输入0或正数,小数点后两位'))
      }
    };
    var jobSalaryValidate = (rule, value, callback)=>{
      let index = rule.field.match(/(\d)/)[1];
      let pattern = /^\d+(\.(\d{1,2}))?$/;
      if(pattern.test(this.allOfChecked[index].rankSalary)){
        callback();
      }else{
        callback(new Error('请输入0或正数,小数点后两位'))
      }
    };
    var performanceSalaryValidate = (rule, value, callback)=>{
      let index = rule.field.match(/(\d)/)[1];
      let pattern = /^\d+(\.(\d{1,2}))?$/;
      if(pattern.test(this.allOfChecked[index].performanceSalary)){
        callback();
      }else{
        callback(new Error('请输入0或正数,小数点后两位'))
      }
    };
    return {
      deptData:[],
      rankCategoryList: [],
      categoryId: '1',
      rankList: [],
      checkRankList: [],
      allOfChecked: [],
      usedDeptIds: [],
      jobInfo: {},

      /* 旧的 */
      jobRules:{
        positionName:[{required: true, message:'请输入职位名称', trigger:'blur'}],
        dept:[{required: true, message:'请选择使用部门', trigger:'blur'}],
        basicSalary:[{required: true, validator: basicSalaryValidate, trigger:'blur'}],
        rankSalary:[{required: true, validator: jobSalaryValidate, trigger:'blur'}],
        performanceSalary:[{required: true, validator: performanceSalaryValidate, trigger:'blur'}],
      }
    }
  },
  mounted(){
    if(this.operate == 1){
      this.getEditDetail(this.editJobInfo);
    }
    this.getEmpList();
    this.getRankCategory();
    this.getRankList();
  },
  methods: {
    getItem(row){
      let rankIds = Array.from(this.allOfChecked,({rankId})=>rankId);
      if(rankIds.indexOf(row.rankId) == -1){
        this.checkRankList.push(row.rankId);
        this.allOfChecked.push(row);
      }else{
        if(row.usedSysUserCounts && row.usedSysUserCounts > 0){
          this.$message({
            type:'warning',
            message:'该职级存在使用人，无法移除'
          })
        }else{
          this.allOfChecked.forEach( (el,index) => {
            if(el.rankId == row.rankId){
              this.allOfChecked.splice(index, 1);
            }
          });
          this.checkRankList.forEach( (el, index) => {
            if(el == row.rankId){
              this.checkRankList.splice(index ,1);
            }
          });
        }
      }
    },
    getEditDetail(row){
      let param = {
        positionId: row.positionId,
      }
      editPosition(param).then(res=>{
        this.jobInfo = res.data.data;
        this.rankList = this.jobInfo.positionRankList;
        this.jobInfo.dept = this.jobInfo.usedDeptIds;
        this.rankList.forEach( el => {
          this.allOfChecked.push(el)
        });
        this.handleClick();
      })
    },
    deptArr(){
      this.usedDeptIds = [];
      this.jobInfo.dept.forEach( el => {
        this.usedDeptIds.push(el.slice(-1));
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getEmpList() {
      fetchNewTree({menuFlag: "emp_list"}).then( res => {
        this.clearChild(res.data.data);
        this.deptData = res.data.data;
      });
    },
    clearChild(arr){//清除空children
      arr.forEach(el => {
        if(el.children.length == 0){
          Vue.delete(el,'children')
        }else{
          this.clearChild(el.children)
        }
      });
    },
    getRankCategory(){//职级分类
      getRankCategoryList().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.rankCategoryList = res.data.data;
        }
      })
    },

    getRankList(){
      let param = {
        category: this.categoryId,
      }
      listRankByCategory(param).then( res=>{
        this.rankList = res.data.data;
      })
    },
    handleClick(){
      this.checkRankList = [];
      this.allOfChecked.forEach( el => {
        if((el.category == this.categoryId) && el.rankId){
          this.checkRankList.push(el.rankId);
        }
      });
      this.getRankList();
    },
    addOrEditJob(operateId){//0-新建 1-编辑
      let param = {
        positionId: this.jobInfo.positionId || null,
        positionName: this.jobInfo.positionName,
        rankList: this.allOfChecked,
        usedDeptIds: this.jobInfo.dept,
      }
      let validateStatus = true;
      this.rankList.forEach( el => {
        this.$refs.jobInfo.validate(valid=>{
          if(!valid){
            validateStatus = false;
          }else{
            if(this.allOfChecked.length == 0){
            validateStatus = false;
              this.$message({
                type:'warning',
                message:'请选择职级'
              })
            }
          }
        })
      });
      if(validateStatus){
        savePosition(param, operateId).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.$message({
              type: 'success',
              message: operateId ? '编辑职位成功！' : '新增职位成功！',
              duration: 2000
            })
            this.$emit('operateSuccess');
          }else{
            this.$message({
              type:'error',
              message: res.data.msg
            })
          }
        })
      };
    },
    delInfo(row, index){
      if(this.operate == 1 && row.usedSysUserCounts > 0){
        this.$message({
          type:'warning',
          message:'该职级存在使用人，无法移除'
        })
      }else if(this.operate == 1 && row.usedSysUserCounts == 0){//编辑且无人使用
        this.checkRankList.forEach(el => {
          if(el == row.rankId){
            this.checkRankList.splice(index, 1);
          }
        });
        this.allOfChecked.splice(index, 1);
      }else{
        this.checkRankList.forEach(el => {
          if(el == row.rankId){
            this.checkRankList.splice(index, 1);
          }
        });
        this.allOfChecked.splice(index, 1);
      }
    },
    closeDilog(){
      this.$emit('operateSuccess');
    },
  }
}
</script>

<style>
  .job-add-box .el-input__inner{
    width: 155px;
  }
  .info-job{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: 20px;
  }
  .subtitle{
    padding-left: 5px;
    border-left: 3px solid #108ee9;
  }
  .minus-img{
    display: flex;
  }
  .minus-img img{
    width: 15px;
    height: 15px;
    margin: auto 10px;
    cursor: pointer;
  }
  .line-job{
    width: 100%;
    margin: 20px 0;
    border-bottom: 1px solid #DCDCDC;
  }
  .operate-btn{
    text-align: right;
  }
  .check-group{
    display: grid !important;
    grid-template-columns: repeat(auto-fit, 170px);
    grid-gap: 20px;
  }
  .rank-list-box{
    margin: 10px 0;
  }
  .rank-desc{
    font-size: 14px;
    color: #555555;
  }
  .position-info-list{
    height: 350px;
    overflow: auto;
  }
  .limit-word{
    min-width: 170px;
  }
</style>