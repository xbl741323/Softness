<template>
  <div>
    <p class="job-info-title">基本信息</p>
    <div class="basic-info">
      <div class="basic-info-attribute">
        <p>姓名：</p>
        <p>{{ jobInfo.name  || '/'}}</p>
      </div>
      <div class="basic-info-attribute">
        <p>性别：</p>
        <p>{{ jobInfo.sex | sex}}</p>
      </div>
      <div class="basic-info-attribute">
        <p>手机号码：</p>
        <p>{{ jobInfo.mobilePhone || '/'}}
          <span class="edit-phone" @click="permissions.sys_account_edit ? showPhoneDialog() : $notAuthorized()">修改手机号</span>
        </p>
      </div>
      <div class="basic-info-attribute">
        <p>所属部门：</p>
        <p>{{ jobInfo.deptName || '/'}}</p>
      </div>
      <div class="basic-info-attribute">
        <p>查重部门：</p>
        <p>{{ jobInfo.businessGroupName || '/'}}</p>
      </div>
      <div class="basic-info-attribute">
        <p>密码：</p>
        <p>*******
          <span class="edit-phone" @click="permissions.sys_account_edit ? showPwdDialog() : $notAuthorized()">修改密码</span>
        </p>
      </div>
      <div class="basic-info-attribute">
        <p>工号：</p>
        <p>{{ jobInfo.number || '/'}}</p>
      </div>
      <div class="basic-info-attribute">
        <p>员工状态：</p>
        <p>{{ jobInfo.status | status }}</p>
      </div>
      <div class="basic-info-attribute">
        <p>职位：</p>
        <p>{{ jobInfo.positionName || '/'}}</p>
      </div>
      <div class="basic-info-attribute">
        <p>职级：</p>
        <div>
          <span class="rank" v-for="(item, index) in jobInfo.positionRankName" :key="index">{{item}} <span v-if="index < jobInfo.positionRankName.length-1">、</span></span>
        </div>
        <!-- <p>{{ jobInfo.rankLevel || '/'}}</p> -->
      </div>
      <div class="basic-info-attribute">
        <p>岗位等级：</p>
        <p>{{ jobInfo.stationLevelAndName || '/'}}</p>
      </div>
      <div class="basic-info-attribute">
        <p>证件类型：</p>
        <p> 居民身份证 </p>
      </div>
      <div class="basic-info-attribute">
        <p>证件号码：</p>
        <p>{{ jobInfo.credentialsNumber || '/'}}</p>
      </div>
      <div class="basic-info-attribute">
        <p>入职日期：</p>
        <p>{{ jobInfo.entryTime || '/'}}</p>
      </div>
      <div class="basic-info-attribute">
        <p>转正日期：</p>
        <p>{{ jobInfo.regularTime || '/'}}</p>
      </div>
      <div class="basic-info-attribute">
        <p>出生日期：</p>
        <p>{{ jobInfo.birthday || '/'}}</p>
      </div>
      <div class="basic-info-attribute">
        <p>学历：</p>
        <p>{{ jobInfo.educationName }}</p>
      </div>
    </div>
    
    <!-- 修改手机号 -->
    <el-dialog
      :title="$t('message.updatePhoneNumber')"
      :visible.sync="phoneDialog"
      :close-on-click-modal="false"
      width="30%"
      :before-close="handleClose"
      center>
      <el-form :model="phoneForm" ref="phoneForm" :rules="phoneRules">
        <el-form-item :label="$t('message.inputPwd')+'：'" label-width="135px" prop="password">
          <el-input type="password" v-model="phoneForm.password" style="width:80%;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.newPhone')+'：'" label-width="135px" prop="phoneNumber">
          <el-input v-model="phoneForm.phoneNumber" style="width:80%;" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.code')+'：'" label-width="135px" prop="code">
          <el-input v-model="phoneForm.code" class="com_wid_sty"></el-input>
          <el-button
            size="small"
            @click="getCode(0)"
            :disabled="disabled"
            v-if="disabled==false">{{$t('button.getCode')}}</el-button>
          <el-button
            size="small"
            @click="getCode(0)"
            :disabled="disabled"
            v-if="disabled==true"
            class="com_left_sty">{{btntxt}}</el-button>
          <p class="com_color_sty">{{ statusMsg }}</p>
          <div class="com_font_sty">{{ $t('message.inputNewPhoneCode') }}</div>
        </el-form-item>
      </el-form>
      <div class="com_flex_sty">
        <el-button
          type="primary"
          class="com_right_sty"
          @click="editPhone">
          {{ $t('message.confirmUpdate') }}
        </el-button>
        <el-button @click="phoneDialog = false;handleClose()">{{ $t('button.cancel') }}</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      :title="$t('message.editPwd')"
      :visible.sync="pwdDialog"
      :close-on-click-modal="false"
      width="30%"
      :before-close="handleClose"
      center>
      <el-form :model="pwdForm" ref="pwdForm" :rules="pwdRules">
        <el-form-item :label="$t('message.code')+'：'" label-width="130px" prop="code">
          <el-input v-model="pwdForm.code" class="com_wid_sty" readonly onfocus="this.removeAttribute('readonly')" autocomplete="off"></el-input>
          <el-button
            size="small"
            @click="getCode(1)"
            :disabled="disabled"
            v-if="disabled==false">
            {{$t('button.getCode')}}
          </el-button>
          <el-button
            size="small"
            @click="getCode(1)"
            :disabled="disabled"
            v-if="disabled==true"
            class="com_left_sty">
            {{btntxt}}
          </el-button>
          <p class="com_color_sty">{{ statusMsg }}</p>
          <div class="com_font_sty">
            {{ $t('message.inputFoot') }}{{ jobInfo.mobilePhone | phoneCut }}{{ $t('message.isPhoneCode') }}
          </div>
        </el-form-item>
        <el-form-item :label="$t('message.inputNewPwd')+'：'" label-width="130px" prop="newPassword">
          <el-input type="password" v-model="pwdForm.newPassword" style="width:80%;"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('message.confirmPwd')+'：'"
          label-width="130px"
          prop="checkPassword">
          <el-input type="password" v-model="pwdForm.checkPassword" style="width:80%;"></el-input>
        </el-form-item>
      </el-form>
      <div class="com_flex_sty">
        <el-button
          type="primary"
          class="com_right_sty"
          @click="permissions.sys_account_edit ? editPwd() : $notAuthorized()">{{ $t('message.confirmUpdate') }}</el-button>
        <el-button @click="pwdDialog = false;handleClose()">{{ $t('button.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMessage, editInfo, editEmp, checkMessage} from "@/api/admin/user";
import * as staffData from '@/components/staff/staff'
import { mapGetters } from 'vuex';
export default {
  props:{
    jobInfo:{//职位信息
      type: Object,
      require: true
    }
  },
  data(){
    return {
      phoneDialog: false,
      pwdDialog: false,
      statusMsg: '',
      disabled: false,
      time: 0,
      pwdForm: {
        newPassword: "",
        checkPassword: "",
        code: "",
      },
      phoneForm: {
        password: "",
        phoneNumber: "",
        code: "",
      },
      phoneRules: {
        password: [
          {
            required: true,
            message: this.$t("message.inputPwd"),
            trigger: "blur",
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: this.$t("input.newPhoneRequire"),
            trigger: "blur",
            pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
          },
        ],
        code: [
          {
            required: true,
            message: this.$t("message.codeNotNull"),
            trigger: "blur",
          },
        ],
      },
      pwdRules: {
        newPassword: [
          {
            required: true,
            message: this.$t("input.specialPwdRequire"),
            pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,
            trigger: "blur",
          },
        ],
        checkPassword: [
          {
            required: true,
            message: this.$t("input.specialPwdRequire"),
            pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: this.$t("message.codeNotNull"),
            trigger: "blur",
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters:{
    phoneCut(val) {
      if(val){
        return val.substring(7, 11);
      }
    },
    sex(val){
      return staffData.sex(val);
    },
    status(val){
      return staffData.status(val);
    },
    education(val){
      return staffData.education(val);
    },
  },
  methods:{
    getCode(num) {
      let number = "";
      if (num == 0) {
        if (this.phoneForm.phoneNumber == "") {
          this.$message({
            type: "warning",
            message: this.$t("input.newPhoneRequire"),
            offset:300
          });
          return;
        } else {
          number = this.phoneForm.phoneNumber;
        }
      } else {
        number = this.jobInfo.mobilePhone;
      }
      getMessage(number).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.time = 60;
          this.disabled = true;
          this.timer();
          return;
        }
        if (res.data.code == CodeMsg.CODE_1006) {
          this.statusMsg = this.$t("message.sendCodeError");
          return;
        }
        if (res.data.code == CodeMsg.CODE_1001) {
          this.statusMsg = this.$t("message.sendMoreThen");
          return;
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    //60S倒计时
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
    showPhoneDialog() {
      this.statusMsg = "";
      this.phoneDialog = true;
    },
    showPwdDialog() {
      this.statusMsg = "";
      this.pwdDialog = true;
    },
    handleClose(done) {
      this.phoneForm = {};
      this.pwdForm = {};
      done();
    },
    //修改手机号
    editPhone() {
      this.$refs["phoneForm"].validate((val) => {
        if (val) {
          this.checkCode(0);
        }
      });
    },
    //修改密码
    editPwd() {
      this.$refs["pwdForm"].validate((val) => {
        if (val) {
          if (this.pwdForm.newPassword == this.pwdForm.checkPassword) {
            this.checkCode(1);
          } else {
            this.$message({
              type: "warning",
              message: this.$t("message.pwdIsDiffer"),
              offset:300
            });
          }
        }
      });
    },
    checkCode(num) {
      let param = {};
      if (num == 0) {
        param = {
          phone: this.phoneForm.phoneNumber,
          code: this.phoneForm.code,
        };
      } else {
        param = {
          phone: this.jobInfo.mobilePhone,
          code: this.pwdForm.code,
        };
      }
      checkMessage(param).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          if (num == 0) {
            this.setPhone();
          } else {
            this.editInfo1();
          }
        } else if (res.data.code == CodeMsg.CODE_1001) {
          this.$message({
            type: "warning",
            message: this.$t("message.errorCode"),
            offset: 300,
          });
        } else if (res.data.code == CodeMsg.CODE_1003) {
          this.$message({
            type: "warning",
            message: res.data.data,
            offset: 300,
          });
        }
      });
    },
    setPhone() {
      let userDTO = {
        deptId: this.jobInfo.deptId,
        sex: this.jobInfo.sex,
        name: this.jobInfo.name,
        password: this.phoneForm.password,
        number: this.jobInfo.number,
        phone: this.phoneForm.phoneNumber,
        role: [45],
        userId: this.jobInfo.userId,
        username: this.jobInfo.username,
      };
      editInfo(userDTO).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 300,
          });
          this.phoneDialog = false;
          this.phoneForm.password = "";
          this.phoneForm.phoneNumber = "";
          this.phoneForm.code = "";
          this.$parent.getDetail();
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg,
            offset: 300,
          });
        }
      });
    },
    editInfo1(num) {
      let userDTO = {
        deptId: this.jobInfo.deptId,
        sex: this.jobInfo.sex,
        name: this.jobInfo.name,
        password: this.pwdForm.newPassword,
        number: this.jobInfo.number,
        role: [45],
        userId: this.jobInfo.userId,
        username: this.jobInfo.username,
        nickname: this.jobInfo.nickname,
        // entryTime: this.jobInfo.entryTime
      };
      this.setUser(userDTO);
    },
    setUser(params) {
      this.jobInfo.entryTime = this.$moment(this.jobInfo.entryTime).format(
        "YYYY-MM-DD"
      );
      editEmp(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: this.$t("alert.sucessEdit"),
            offset:300
          });
          // this.getDetail();
          this.pwdDialog = false;
        }
      });
    },
  }
}
</script>

<style scoped>
  .basic-info{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  .basic-info-attribute{
    display: flex;
    line-height: 20px;
  }
  .basic-info-attribute :nth-child(2n){
    color: #333333;
  }
  .basic-info-attribute :nth-child(2n+1){
    font-weight: 550;
    width: 200px;
    text-align: right;
  }
  .job-info-title{
    color: #000000;
    border-left: 3px solid #4879fd;
    padding-left: 5px;
  }
  .edit-phone{
    color: #2c64fd; 
    cursor: pointer;
    margin-left: 10px;
    font-size: 12px;
  }
  .rank{
    line-height: 52px;
  }
</style>