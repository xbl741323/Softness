<template>
  <div class="salary-my-frame">
    <el-form :model="salaryForm" inline>
      <el-form-item label="考核日期：" prop="createTime">
        <el-date-picker :clearable="false" v-model="salaryForm.appraisalDate" @change="getSalaryData" type="month" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
      </el-form-item>
    </el-form>
    
    <el-table :data="salaryData" border >
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="工号" prop="number"></el-table-column>
      <el-table-column label="部门" prop="deptName"></el-table-column>
      <el-table-column label="职位" prop="positionName"></el-table-column>
      <el-table-column label="职级" prop="rankName"></el-table-column>
      <el-table-column label="岗位" prop="stationName"></el-table-column>
      <el-table-column v-for="(item, index) in parentHeader" :key="index" :label="item | transferKey" align="center">
        <el-table-column v-for="(el, subcript) in salaryHeader[item]" :key="subcript" :label="el.resultName" align="center" >
          <template>
            <span>{{el.resultVal}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="个税" prop="taxesAmount"></el-table-column>
      <el-table-column label="预留" prop="reservedAmount"></el-table-column>
      <el-table-column label="应发工资" prop="shouldAmount"></el-table-column>
      <el-table-column label="实发工资" prop="realAmount"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300px" align="center">
        <template slot="header">
          <p>操作</p>
          <p class="prompt">(工资条发放24小时后，系统将自动确认无误)</p>
        </template>
        <template slot-scope="{row}">
          <el-button type="text" @click="getPhone()">查看完整信息</el-button>
          <el-button type="text" class="isconfirm" v-if="row.state">已确定</el-button>
          <el-button type="text" v-if="!row.state" @click="confirmSalary()">确认无误</el-button>
          <el-button type="text" class="isconfirm" v-if="row.remark" @click="viewRemark">已反馈</el-button>
          <el-button type="text" v-if="!row.remark" @click="feedback()">问题反馈</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="phoneDialog" title="身份验证" width="500px" :close-on-click-modal="false">
      <el-form :model="phoneForm">
        <el-form-item label="身份验证：">
          <el-input placeholder="请输入验证码" v-model="phoneForm.code" :disabled="!unable" class="code-input" />
          <el-button
            size="small"
            @click="getCode()"
            class="com_sty"
            v-if="unable==false">{{$t('button.getCode')}}</el-button>
          <el-button
            size="small"
            v-show="unable==true"
            @click="getCode()"
            :disabled="unable"
            class="com_left_sty">{{btntxt}}</el-button>
          <p class="com_color_sty">{{ statusMsg }}</p>
        </el-form-item>
        <p>请输入{{phone}}手机号收到的验证码,验证通过后有效时间为30分钟</p>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button size="mini" type="primary" @click="getToken()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 查看反馈 -->
    <el-dialog title="问题反馈" :visible.sync="viewRemarkDialog" :close-on-click-modal="false" width="500px">
      <p v-if="salaryData[0]">{{salaryData[0].remark}}</p>
    </el-dialog>

    <!-- 问题反馈 -->
    <el-dialog :visible.sync="remarkDialog" title="问题反馈" :close-on-click-modal="false">
      <el-form :model="remarkForm" label-width="100px">
        <el-form-item label="反馈内容：">
          <el-input type="textarea" maxlength="50" show-word-limit :rows="5" v-model="remarkForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmRemark()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { salaryOfMy, getUserPhoneNum, sendSms, getAuthToken, feedbackSalaryOfMy, confirmSalaryOfMy } from '@/api/salary/salary'
import salary from '@/components/salary/examine'
export default {
  data(){
    return {
      salaryForm: {
        appraisalDate: this.$moment().subtract(1, 'month').format('YYYY-MM')
      },
      phoneDialog: false,
      remarkDialog: false,
      viewRemarkDialog: false,
      phoneForm: {},
      remarkForm: {},
      userInfo: {},
      salaryData: [],
      salaryHeader: [],
      parentHeader: [],
      phone: '',
      time: 60,
      unable: false,
      btntxt: this.$t("button.sendAgain"),
      statusMsg: '',
    }
  },
  filters:{
    transferKey(val){
      return salary.transferKey(val);
    }
  },
  mounted(){
    this.userInfo = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content;
    this.getSalaryData();
  },
  methods:{
    viewRemark(){
      this.viewRemarkDialog = true;
    },
    cancel(){
      this.remarkDialog = false
    },
    feedback(){
      this.$set(this.remarkForm,'remark','');
      this.remarkDialog = true;
    },
    confirmSalary(){
      let param = {
        yearMonth: this.salaryForm.appraisalDate,
        userId: this.userInfo.id
      }
      confirmSalaryOfMy(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message: res.data.msg
          })
          this.salaryData[0].state = true
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    confirmRemark(){
      let param = {
        yearMonth: this.salaryForm.appraisalDate,
        remark: this.remarkForm.remark,
        userId: this.userInfo.id
      }
      feedbackSalaryOfMy(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message: res.data.msg
          })
          this.salaryData[0].remark = this.remarkForm.remark;
          this.remarkDialog = false;
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    getToken(){
      let param = {
        smsCode: this.phoneForm.code
      }
      getAuthToken(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message: res.data.msg
          })
          this.getSalaryData();
          this.phoneForm = {};
          this.phoneDialog = false;
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
    timer() {
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
    getPhone(){
      getUserPhoneNum().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.phone = res.data.data;
          this.phoneDialog = true;
        }
      })
    },
    getSalaryData(){
      let param = {
        yearMonth: this.salaryForm.appraisalDate,
        smsCode: this.phoneForm.code
      }
      salaryOfMy(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.salaryData = [res.data.data];
          this.salaryHeader = res.data.data.resultNameList;
          this.parentHeader = Object.keys(this.salaryHeader);
        }else{
          this.salaryData = [];
          this.$message({
            type:'warning',
            message: res.data.msg,
            offset: 120
          })
        }
      })
    },
  }
}
</script>

<style scoped>
.salary-my-frame{
  padding: 20px;
  color: #FFFFFF;
  background: #FFFFFF;
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
.isconfirm{
  color: #333333;
}
.prompt{
  color: #AAAAAA;
  font-size: 10px;
  font-weight: 400;
}
</style>