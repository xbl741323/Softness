<template>
  <div class="sheet-box">
    <el-form :model="sheetForm" inline >
      <el-form-item label="考核日期：" prop="createTime">
        <el-date-picker :clearable="false" v-model="sheetForm.appraisalDate" @change="getSalaryData" type="month" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
      </el-form-item>
      <el-form-item label="部门：" prop="deptId">
        <avue-input-tree v-model="sheetForm.deptId" :dic="treeData" :props="{label: 'name',value: 'id'}" placeholder="请选择部门"/>
      </el-form-item>
      <el-button size="mini" type="primary" @click="getSalaryData">搜索</el-button>
      <el-button size="mini" @click="reset()">重置</el-button>
    </el-form>
    
    <div class="authority">
      <p @click="getPhone()">获取查看权限</p>
    </div>

    <el-table :data="tableData" border row-key="id" :tree-props="{children: 'child'}">
      <el-table-column label="部门" prop="name"></el-table-column>
      <el-table-column label="考核人数" >
        <template slot-scope="{row}">
          <span>{{row.partNum}}人</span>
        </template>
      </el-table-column>
      <el-table-column label="核算状态">
        <template slot-scope="{row}">
          <span>
            <span class="mark" v-if="row.partNum == row.auditNum">{{row.partNum}}(已完成)</span>
            <span class="unfinished" v-if="row.partNum != row.auditNum">{{row.partNum-row.auditNum}}(未完成)</span>
          /{{row.partNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="应发工资">
        <template slot-scope="{row}">
          <span>{{row.shouldAmount | transferAmount}}万元</span>
        </template>
      </el-table-column>
      <el-table-column label="实发工资">
        <template slot-scope="{row}">
          <span>{{row.realAmount | transferAmount}}万元</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="salaryDetail(row.deptId,row.name)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="phoneDialog" title="身份验证" width="500px">
      <el-form :model="phoneForm">
        <el-form-item label="身份验证：">
          <el-input placeholder="请输入验证码" v-model="phoneForm.code" :disabled="!disabled" class="code-input" />
          <el-button
            size="small"
            @click="getCode()"
            class="com_sty"
            v-if="disabled==false">{{$t('button.getCode')}}
          </el-button>
          <el-button
            size="small"
            @click="getCode()"
            :disabled="disabled"
            v-show="disabled==true"
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
import { getSalary, getUserPhoneNum, sendSms, getAuthToken } from '@/api/salary/salary'
import { fetchNewTree } from "@/api/admin/dept";
import { saveDetal } from "@/util/clearDetail";
const math = require('mathjs')
export default {
  data(){
    return {
      active: '1',
      phone: '',
      statusMsg: '',
      phoneDialog: false,
      disabled: false,
      time: 60,
      btntxt: this.$t("button.sendAgain"),
      phoneForm: {},
      tableData: [],
      treeData: [],
      sheetForm:{
        appraisalDate: this.$moment().subtract(1, 'month').format('YYYY-MM'),
        deptId: 81
      }
    }
  },
  filters:{
    transferAmount(val){
      return math.format(val/10000,14);
    }
  },
  mounted(){
    this.getSalaryData();
    this.getDept();
  },
  created(){
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      this.active = keepParams.active;
      if(this.active == '1'){
        this.sheetForm.appraisalDate = keepParams.params.yearMonth;
        this.sheetForm.deptId = keepParams.params.deptId;
      }
      if (keepParams.detail.path !== "") {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
    }
  },
  methods:{
    reset(){
      this.sheetForm = {
        appraisalDate: this.$moment().subtract(1, 'month').format('YYYY-MM'),
        deptId: 81
      }
      this.getSalaryData();
    },
    tabClick(){
      // 需要缓存的参数
      let keepParams = {
        active: this.active,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
    },
    cancelCode(){
      this.phoneForm = {};
      this.phoneDialog = false;
    },
    getToken(){
      let param = {
        smsCode: this.phoneForm.code
      }
      getAuthToken(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          localStorage.setItem('salaryToken',res.data.data);
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
    getCode(){
      sendSms().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message: res.data.msg
          })
          this.time = 60;
          this.disabled = true;
          this.timer();
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time + this.$t("message.secondLaterGet");
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btntxt = this.$t("button.sendAgain");
        this.disabled = false;
      }
    },
    getPhone(){
      getUserPhoneNum().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.phone = res.data.data;
          this.phoneDialog = true;
        }
      })
    },
    salaryDetail(deptId,deptName){
      let param = {
        yearMonth: this.sheetForm.appraisalDate,
        deptId: deptId,
        deptName: deptName
      }
      saveDetal(`${this.$route.path}`, '/salary-detail', param);
      sessionStorage.removeItem('keyWords');
      sessionStorage.removeItem('deptId');
      sessionStorage.removeItem('deptName');
      this.$router.push({
        path:'/salary-detail',
        query: param
      })
    },
    getDept(){
      fetchNewTree({menuFlag:"emp_list"}).then((response) => {
        this.treeData = response.data.data; 
      });
    },
    getSalaryData(){
      let param = {
        yearMonth: this.sheetForm.appraisalDate,
        deptId: this.sheetForm.deptId || 81,//默认值81
      }
      // 需要缓存的参数
      let keepParams = {
        active: this.active,
        params: param,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getSalary(param).then(res=>{
        this.tableData = res.data.data
      })
    }
  }
}
</script>

<style scoped>
  .sheet-box{
    background: #FFFFFF;
    min-height: 100%;
    padding: 20px;
  }
  .mark{
    color: #70B603;
  }
  .unfinished{
    color: #FFC03A;
  }
  .authority{
    height: 30px;
    position: relative;
    margin: 2px 0;
    color: #409EFF;
    font-size: 12px;
  }
  .authority p{
    line-height: 30px;
    margin: 0;
    position: absolute;
    right: 0;
    cursor: pointer;
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