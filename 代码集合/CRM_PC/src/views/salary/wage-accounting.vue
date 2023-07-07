<template>
  <div class="wage-frame">
    <el-form :model="wageForm" inline>
      <el-form-item label="考核日期：" prop="createTime">
        <el-date-picker :clearable="false" v-model="wageForm.assessedDate" @change="getList()" :picker-options="expireTimeOption" type="month" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
      </el-form-item>
      <el-form-item label="部门：" prop="deptId">
        <avue-input-tree v-model="wageForm.deptId" :dic="treeData" :props="{label: 'name',value: 'id'}" placeholder="请选择部门"/>
      </el-form-item>
      <el-form-item label="职位：" prop="position">
        <el-select placeholder="请选择职位" v-model="wageForm.position">
          <el-option
            v-for="item in positionList"
            :key="item.positionId"
            :value="item.positionId"
            :label="item.positionName"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" size="mini" @click="getList()">搜索</el-button>
      <el-button size="mini" @click="reset()">重置</el-button>
    </el-form>
    
    <el-table :data="wageData" border>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="任务名称" prop="name">
        <template slot-scope="{row}">
          <span class="operable" @click="permissions.bt_get_salary_calculate ? toWageDetail(row) : $notAuthorized()">{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用部门" prop="ttPositionDeptVoList"></el-table-column>
      <el-table-column label="使用职位" prop="positionName"></el-table-column>
      <el-table-column label="使用人数" prop="userNum"></el-table-column>
      <el-table-column label="审核状态">
        <template slot="header">
          <p>审核状态
            <el-popover
              placement="top-start"
              width="250"
              trigger="hover"
              content="审核状态为薪酬审批流程的状态（包括本人和其管理岗位下的成员）">
                <i class="el-icon-question" style="color:#EEAF2A" slot="reference"></i>
            </el-popover>
          </p>
        </template>
        <template slot-scope="{row}">
          <span>{{row.isAudit | auditState()}}</span>
        </template>
      </el-table-column>
      <el-table-column label="工资月份" prop="assessedDate"></el-table-column>
      <el-table-column label="核算状态" prop="isCalculate">
        <template slot-scope="{row}">
          <span>{{row.isCalculate | calculateState}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" v-if="row.isAudit == 1 && row.isCalculate == 1" @click="permissions.bt_get_salary_calculate ? toWageDetail(row) : $notAuthorized()">详情</el-button>
          <el-button type="text" v-if="row.isAudit == 1 && row.isCalculate == 0" @click="permissions.bt_get_salary_calculate ? toWageDetail(row) : $notAuthorized()">去核算</el-button>
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

    <el-dialog :visible.sync="phoneDialog" title="身份验证" width="500px">
      <el-form :model="phoneForm">
        <el-form-item label="身份验证：">
          <el-input placeholder="请输入验证码" v-model="phoneForm.code" :disabled="!unable" class="code-input" />
          <el-button
            size="small"
            @click="getCode()"
            class="com_sty"
            v-if="unable==false">{{$t('button.getCode')}}
          </el-button>
          <el-button
            size="small"
            v-show="unable==true"
            @click="getCode()"
            :disabled="unable"
            class="com_left_sty">{{btntxt}}
          </el-button>
          <p class="com_color_sty">{{ statusMsg }}</p>
        </el-form-item>
        <p>请输入{{phone}}手机号收到的验证码,验证通过后有效时间为30分钟</p>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelCode()">取消</el-button>
        <el-button size="mini" type="primary" @click="getToken()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWageData } from "@/api/salary/salary";
import { fetchNewTree } from "@/api/admin/dept";
import { getUserPhoneNum, sendSms, getSalaryCalculateToken, executeCalculate } from '@/api/salary/salary'
import { jobList } from "@/api/staff/index";
import { mapGetters } from "vuex";
export default {
  data(){
    return {
      pageNo: 1,
      pageSize: 20,
      total: 0,
      wageForm: {
        assessedDate: this.$moment().subtract(1, 'month').format('YYYY-MM'),
        deptId: 81
      },
      wageData: [],
      treeData: [],
      positionList: [],
      expireTimeOption:{
        disabledDate(date) {
          return (
            date.getTime() < new Date(new Date().getFullYear(),0,1).getTime() ||
            date.getTime() > new Date(new Date().getFullYear(),11,31).getTime()
          );
        }
      },
      phone: '',
      phoneDialog: false,
      phoneForm: {},
      time: 60,
      unable: false,
      statusMsg: '',
      btntxt: this.$t("button.sendAgain"),
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters:{
    auditState(val){
      return val ? '已审核' : '未审核';
    },
    calculateState(val){
      return val ? '已核算' : '未核算';
    }
  },
  created(){
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      this.wageForm = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
    }
  },
  mounted(){
    this.getDept();
    this.getList();
  },
  methods:{
    reset(){
      this.wageForm = {
        assessedDate: this.$moment().subtract(1, 'month').format('YYYY-MM'),
        deptId: 81
      }
      this.getList();
    },
    getDept(){
      fetchNewTree({menuFlag:"emp_list"}).then((response) => {
        this.treeData = response.data.data; 
      });
    },
    toWageDetail(row){
      if(row.isAudit == 1 ){
        const wageToken = localStorage.getItem('wageToken');
        if(wageToken){
          executeCalculate({salaryCalculateId:row.id,token:wageToken}).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              this.toDetail(row);
            }else{
              if(res.data.code == -2){
                localStorage.removeItem('wageToken');
              }
              this.$message.warning(res.data.msg);
            }
          })
        }else{
          getUserPhoneNum().then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              this.phone = res.data.data;
              this.phoneDialog = true;
            }
          })
        }
      }else{
        this.$message.warning('该任务中涉及的员工未全部审核完成，请先去处理审核流程~');
      }
    },
    toDetail(row){
      this.$router.push({
        path: '/accounting-detail',
        query: {
          salaryCalculateId: row.id,
          isCalculate: row.isCalculate,
          date: this.wageForm.assessedDate,
          positionName: row.positionName
        }
      })
    },
    cancelCode(){
      this.phoneForm = {};
      this.phoneDialog = false;
    },
    getList(){
      if(this.permissions.bt_page_salary_calculate){
        let param = {
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          deptId: this.wageForm.deptId,
          assessedDate: this.wageForm.assessedDate,
          position: this.wageForm.position
        }
        sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(param));
        getWageData(param).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.wageData = res.data.data.records;
            this.total = res.data.data.total;
          }
        })
        jobList({current: 1, size: -1}).then(res=>{
          this.positionList = res.data.data.records;
        })
      }else{
        this.$notAuthorized();
      }
      
    },
    getToken(){
      let param = {
        smsCode: this.phoneForm.code
      }
      getSalaryCalculateToken(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          localStorage.setItem('wageToken',res.data.data);
          this.$message({
            type:'success',
            message: res.data.msg
          })
          this.phoneForm = {};
          this.phoneDialog = false;
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    getCode(){//获取验证码
      sendSms().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message: res.data.msg
          })
          this.time = 60;
          this.unable = true;
          this.timer();
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    timer() {//60s倒计时
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time + this.$t("message.secondLaterGet");
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btntxt = this.$t("button.sendAgain");
        this.unable = false;
      }
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val){
      this.pageNo = val;
      this.getList();
    }
  }
}
</script>

<style>
.wage-frame{
  background: #FFFFFF;
  min-height: 100%;
  padding: 20px;
}
.code-input{
  width: 200px;
}
.com_left_sty{
  margin-left: 20px;
}
.com_sty{
  margin-left: 20px;
  border: 1px solid #409EFF;
  color: #409EFF;
}
</style>