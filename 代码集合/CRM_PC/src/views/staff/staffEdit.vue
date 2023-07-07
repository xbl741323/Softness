<template>
  <div class="edit_user">
    <h3>{{ $t('message.editStaffInfo') }}</h3>
    <table>
      <tr style="flex:1;">
        <th v-for="(item,index) in arrList" :key="index"><span class="staff-sty" v-if="index!==4">*</span>{{ item }}</th>
      </tr>
      <tr style="flex:4;">
        <td>{{ empInfo.number }}</td>
        <td>
          <span
            v-if="nameIndex == true"
            class="com_poin_sty"
            @click="nameIndex = false,nameStatus = true"
            @mouseenter="nameStatus = false"
            @mouseleave="nameStatus = true">
            {{ empInfo.name|nullFilter }}
          </span>
          <i class="el-icon-edit left_one_sty" v-if="nameStatus == false"></i>
          <div v-if="nameIndex == false">
            <el-input
              v-model="empInfo.name"
              size="mini"
              maxlength="10"
              class="staff_edit_one">
            </el-input>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-check"
              class="com_padding_sty"
              @click="setInfo(0)"
              @click.native="nameIndex = true">
            </el-button>
            <el-button
              type="normal"
              size="mini"
              icon="el-icon-close"
              class="com_padding_sty"
              @click="getDetail"
              @click.native="nameIndex = true">
            </el-button>
          </div>
        </td>
        <td>
        <el-radio-group v-model="empInfo.sex" @change="changeGender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
        </td>
        <td>
          <span
            v-if="nickIndex == true"
            class="com_poin_sty"
            @click="nickIndex = false,nickStatus = true"
            @mouseenter="nickStatus = false"
            @mouseleave="nickStatus = true">
            {{ empInfo.nickname|nullFilter }}
          </span>
          <i class="el-icon-edit left_one_sty" v-if="nickStatus == false"></i>
          <div v-if="nickIndex == false">
            <el-input
              @input="checkName"
              v-model="empInfo.nickname"
              size="mini"
              maxlength="10"
              class="staff_edit_one">
            </el-input>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-check"
              class="com_padding_sty"
              @click="setInfo(0)"
              :disabled="btnStatus==false?true:false"
              @click.native="nickIndex = true">
            </el-button>
            <el-button
              type="normal"
              size="mini"
              icon="el-icon-close"
              class="com_padding_sty"
              @click="getDetail"
              @click.native="nickIndex = true,btnStatus=true">
            </el-button>
          </div>
        </td>
        <td>
          <span
            v-show="deptIndex == true"
            class="com_poin_sty"
            @click="deptIndex = false,deptStatus = true"
            @mouseenter="deptStatus = false"
            @mouseleave="deptStatus = true">
            {{ deptValue|nullFilter}}
          </span>
          <i class="el-icon-edit left_one_sty" v-if="deptStatus == false"></i>
          <div v-if="deptIndex == false">
            <avue-input-tree
              v-model="empInfo.deptId"
              :node-click="getNodeData"
              :dic="treeDeptData"
              :props="defaultProps"
              :placeholder="($t('message.chooseEmp'))"
              style="margin-right:30px;"/>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-check"
              class="com_padding_sty"
              @click="setInfo(0)"
              @click.native="deptIndex = true">
            </el-button>
            <el-button
              type="normal"
              size="mini"
              icon="el-icon-close"
              class="com_padding_sty"
              @click.native="deptIndex = true">
            </el-button>
          </div>
        </td>
        <td>
          <span
            v-if="repeatIndex == true"
            class="com_poin_sty"
            @click="repeatIndex = false,repeatStatus = true"
            @mouseenter="repeatStatus = false"
            @mouseleave="repeatStatus = true">
            {{empInfo.businessGroupName}}
          </span>
          <i class="el-icon-edit left_one_sty" v-if="repeatStatus == false"></i>
          <div v-if="repeatIndex == false">
            <avue-select
              v-model="empInfo.businessGroupId"
              :dic="repeatDeptOptions"
              :props="repeatDeptProps"
              placeholder="请选择查重部门"/>
              <el-button
                type="success"
                size="mini"
                icon="el-icon-check"
                class="com_padding_sty"
                @click="setInfo(1)"
                @click.native="repeatIndex = true">
              </el-button>
              <el-button
                type="normal"
                size="mini"
                icon="el-icon-close"
                class="com_padding_sty"
                @click.native="repeatIndex = true">
              </el-button>
          </div>
        </td>
        <!-- <td>
          <span
            v-if="roleIndex == true"
            class="com_poin_sty"
            @click="permissions.sys_role_perm ? (roleIndex = false,roleStatus = true) : $notAuthorized()"
            @mouseenter="roleStatus = false"
            @mouseleave="roleStatus = true">
            {{ rolesValue.toString()|nullFilter }}
          </span>
          <i class="el-icon-edit left_one_sty" v-if="roleStatus == false"></i>
          <div v-if="roleIndex == false">
            <avue-select
              v-model="roleList"
              :dic="rolesOptions"
              :props="roleProps"
              @change="showRole"
              multiple
              :placeholder="($t('message.selectRole'))"
              style="width:300px;margin-right:30px;"/>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-check"
              class="com_padding_sty"
              @click="setInfo(1)"
              @click.native="roleIndex = true">
            </el-button>
            <el-button
              type="normal"
              size="mini"
              icon="el-icon-close"
              class="com_padding_sty"
              @click.native="roleIndex = true">
            </el-button>
          </div>
        </td> -->
        <td>
          <span>{{ empInfo.phone }}</span>
          <el-button
            style="margin-left:100px;"
            size="mini"
            type="primary"
            @click="showPhoneDialog">
            {{ $t('message.updatePhoneNumber') }}
          </el-button>
        </td>
        <td>
          <span>***************</span>
          <el-button
            style="margin-left:104px;"
            size="mini"
            type="primary"
            @click="showPwdDialog">
            {{ $t('message.editPwd') }}
          </el-button>
        </td>
        <td>
          <span
            v-if="timeIndex == true"
            class="com_poin_sty"
            @click="timeIndex = false,timeStatus = true"
            @mouseenter="timeStatus = false"
            @mouseleave="timeStatus = true">
            {{ empInfo.entryTime|nullFilter }}
          </span>
          <i class="el-icon-edit left_one_sty" v-if="timeStatus == false"></i>
          <div v-if="timeIndex == false">
            <el-date-picker
              v-model="empInfo.entryTime"
              type="date"
              format="yyyy-MM-dd"
              @change="changeDate"
              placeholder="选择日期">
            </el-date-picker>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-check"
              class="com_padding_sty com_left_sty"
              @click="setInfo(0)"
              @click.native="timeIndex = true">
            </el-button>
            <el-button
              type="normal"
              size="mini"
              icon="el-icon-close"
              class="com_padding_sty"
              @click="getDetail"
              @click.native="timeIndex = true">
            </el-button>
          </div>
        </td>
      </tr>
    </table>
    <!-- 修改手机号 -->
    <el-dialog
      :title="$t('message.updatePhoneNumber')"
      :visible.sync="dialogVisible"
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
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      :title="$t('message.editPwd')"
      :visible.sync="dialogVisible2"
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
            {{ $t('message.inputFoot') }}{{ empInfo.phone|phoneCut }}{{ $t('message.isPhoneCode') }}
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
        <el-button @click="dialogVisible2 = false">{{ $t('button.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  editInfo,
  getMessage,
  checkMessage,
  getEmpDetail,
  changePhone,
  editEmp,
  getEmpList,
  getStaffEmpDetail,
  repeatDeptList
} from "@/api/admin/user";
import { deptRoleList } from "@/api/admin/role";
import { fetchTree } from "@/api/admin/dept";
import * as CodeMsg from "@/api/common/CodeChange";
import { checkNickname } from "@/api/admin/user";
import { Loading } from "element-ui";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      repeatDeptProps:{
        label: 'businessGroupName',
        value: 'id'
      },
      businessGroupId: 0,
      repeatDeptOptions:[],
      btnStatus: true,
      roleList: [],
      id: "",
      entryTime: null,
      rolesValue: [],
      deptValue: "",
      timeStatus: true,
      timeIndex: true,
      nickStatus: true,
      nickIndex: true,
      nameStatus: true,
      nameIndex: true,
      deptStatus: true,
      deptIndex: true,
      roleStatus: true,
      roleIndex: true,
      repeatStatus: true,
      repeatIndex: true,
      empName: "",
      time: 0,
      btntxt: this.$t("button.sendAgain"),
      statusMsg: "",
      disabled: false,
      dialogVisible: false,
      dialogVisible2: false,
      treeDeptData: [],
      rolesOptions: [],
      empInfo: {},
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
      phoneForm: {
        password: "",
        phoneNumber: "",
        code: "",
      },
      pwdForm: {
        newPassword: "",
        checkPassword: "",
        code: "",
      },
      roleProps: {
        label: "roleName",
        value: "roleId",
      },
      defaultProps: {
        label: "name",
        value: "id",
      },
      arrList: [
        this.$t("label.jobNumber"),
        this.$t("message.name"),
        "性别",
        "昵称",
        this.$t("message.belongEmp"),
        '查重部门',
        this.$t("label.phoneNumber"),
        this.$t("label.password"),
        "入职时间",
      ],
    };
  },
  filters: {
    nullFilter(val) {
      console.log(val, "输出val");
      if (val && val !== "") {
        return val;
      } else {
        return "不详";
      }
    },
    phoneCut(val) {
      return val.substring(7, 11);
    },
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    changeDate(val) {},
    checkName() {
      checkNickname(this.empInfo.nickname).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.btnStatus = true;
        } else if (res.data.code == CodeMsg.CODE_1) {
          this.btnStatus = false;
          this.$message({
            type: "warning",
            message: res.data.msg,
            offset:300
          });
        }
      });
    },
    setInfo(number) {
      // console.log(this.empInfo, "输出empInfoempInfoempInfo");
      var han = /^[\u4e00-\u9fa5]+$/;
      var str = this.empInfo.name;
      if (this.roleList.length == 0) {
        this.$message({
          type: "warning",
          message: this.$t("message.roleNotNull"),
          offset:300
        });
        this.getDetail();
      } else if (this.empInfo.deptId == "") {
        this.$message({
          type: "warning",
          message: "部门值不能为空",
          offset:300
        });
        this.getDetail();
      } else if (this.empInfo.name == "") {
        this.$message({
          type: "warning",
          message: this.$t("message.nameNotNull"),
          offset:300
        });
        this.getDetail();
      // } else if (!han.test(str)) {
      //   this.$message({
      //     type: "warning",
      //     message: this.$t("message.inputChinese"),
      //     offset:300
      //   });
      //   this.getDetail();
      } else if (
        this.empInfo.entryTime == "" ||
        this.empInfo.entryTime == null
      ) {
        this.$message({
          type: "warning",
          message: "时间不能为空",
          offset:300
        });
        this.getDetail();
      } else {
        this.editInfo(number);
      }
    },
    changeGender() {
      this.editInfo(0);
    },
    editInfo(number) {
      let userDTO = {
        businessGroupId: this.empInfo.businessGroupId,
        deptId: this.empInfo.deptId,
        sex: this.empInfo.sex,
        name: this.empInfo.name,
        number: this.empInfo.number,
        role: this.roleList,
        userId: this.empInfo.userId,
        username: this.empInfo.username,
        nickname: this.empInfo.nickname,
        entryTime: this.$moment(this.empInfo.entryTime).format("YYYY-MM-DD"),
      };
      if (number == 1) {
        userDTO.token = "role";
        this.setUser(userDTO);
      } else {
        this.setUser(userDTO);
      }
    },
    editInfo1(num) {
      let userDTO = {
        deptId: this.empInfo.deptId,
        sex: this.empInfo.sex,
        name: this.empInfo.name,
        password: this.pwdForm.newPassword,
        number: this.empInfo.number,
        role: this.roleList,
        userId: this.empInfo.userId,
        username: this.empInfo.username,
        nickname: this.empInfo.nickname,
        entryTime: this.$moment(this.empInfo.entryTime).format("YYYY-MM-DD"),
      };
      this.setUser(userDTO);
    },
    //编辑员工信息
    setUser(params) {
      this.empInfo.entryTime = this.$moment(this.empInfo.entryTime).format(
        "YYYY-MM-DD"
      );
      editEmp(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: this.$t("alert.sucessEdit"),
            offset:300
          });
          this.getDetail();
          this.dialogVisible2 = false;
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
    //修改手机号
    editPhone() {
      this.$refs["phoneForm"].validate((val) => {
        if (val) {
          this.checkCode(0);
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
          phone: this.empInfo.mobilePhone,
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
    showRole() {
      console.log(this.roleList, "roleeeeeeee");
    },
    setPhone() {
      let userDTO = {
        deptId: this.empInfo.deptId,
        sex: this.empInfo.sex,
        name: this.empInfo.name,
        password: this.phoneForm.password,
        number: this.empInfo.number,
        phone: this.phoneForm.phoneNumber,
        role: this.roleList,
        userId: this.empInfo.userId,
        username: this.empInfo.username,
      };
      editInfo(userDTO).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 300,
          });
          this.dialogVisible = false;
          this.phoneForm.password = "";
          this.phoneForm.phoneNumber = "";
          this.phoneForm.code = "";
          this.getDetail();
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg,
            offset: 300,
          });
        }
      });
    },
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
        number = this.empInfo.mobilePhone;
      }
      getMessage(number)
        .then((res) => {
          console.log(res);
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
        })
        .catch((err) => {
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
      this.disabled = false;
      this.statusMsg = "";
      this.dialogVisible = true;
    },
    showPwdDialog() {
      this.disabled = false;
      this.statusMsg = "";
      this.dialogVisible2 = true;
    },
    getDetail() {
      repeatDeptList().then(res=>{
        this.repeatDeptOptions = res.data.data;
      })
      let params = {
        id: this.id,
      };
      getStaffEmpDetail(params).then((res) => {
        this.empInfo = res.data.data;
        this.empInfo.entryTime = this.empInfo.entryTime == "Invalid date"?null:this.empInfo.entryTime
        this.rolesValue = [];
        this.$nextTick(() => {
          this.getEmpList();
          this.getRoleList();
        });
      });
    },
    getNodeData() {},
    //获取部门下拉框
    getEmpList() {
      fetchTree().then((res) => {
        this.treeDeptData = res.data.data;
        this.treeDeptData.forEach((item) => {
        this.getDepartValue(item)
        });
      });
    },
    // 筛选部门value
    getDepartValue(val){
      if(val.id == this.empInfo.deptId){
         this.deptValue = val.name;
        }else if(val.children[0] && val.children[0] != ""){
          val.children.forEach((bnm) => {
          this.getDepartValue(bnm)
        });
      }
    },
    //获取角色下拉框
    getRoleList() {
      deptRoleList().then((res) => {
        this.rolesValue = [];
        this.roleList = [];
        this.rolesOptions = res.data.data;
        this.rolesOptions.forEach((item) => {
          this.empInfo.roleList.forEach((val) => {
            if (item.roleId == val.roleId) {
              this.rolesValue.push(item.roleName);
              this.roleList.push(item.roleId);
              console.log(this.rolesValue, "输出rolesValue");
              return;
            }
          });
        });
      });
    },
    handleClose(done) {
      done();
    },
  },
  created() {
    this.empName = this.$route.query.empName;
    this.id = this.$route.query.id;
  },
  mounted() {
    this.getDetail();
  },
};
</script>

<style scoped>
.edit_user {
  width: 100%;
  margin-left: 10px;
  height: 850px;
  padding: 50px 200px 0 100px;
  background: #ffffff;
}
table,
th,
td {
  list-style: none;
}
table {
  margin-top: 10px;
  border-left: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  display: flex;
  font-size: 14px;
}
tr {
  display: flex;
  flex-direction: column;
}
th,
td {
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  height: 45px;
  line-height: 45px;
}
th {
  text-align: right;
  padding-right: 20px;
}
td {
  padding-left: 40px;
}
.staff-sty {
  color: red;
  margin-right: 2px;
}
.staff_edit_one{
  width:200px;
  margin-right:30px;
}
.com_padding_sty{
  padding:5px 5px;
}
.com_poin_sty{
  cursor:pointer;
}
.com_flex_sty{
  display:flex;
  justify-content:center;
  margin-top:20px;
}
.com_font_sty{
  font-size:12px;
  color:#FF6600;
}
.left_one_sty{
  margin-left:1px;
}
.com_wid_sty{
  width:40%;
  margin-right:30px;
}
.com_right_sty{
  margin-right:50px;
}
.com_left_sty{
  margin-left:20px;
}
.com_color_sty{
  color:red;
}
</style>
<style>
.edit_user .el-input__suffix-inner .el-icon-circle-close {
  display: none !important;
}
.edit_user.el-tabs__nav-wrap::after {
  display: none;
}
</style>
