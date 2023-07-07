<!-- 排查完成 -->
<template>
  <div class="set-password">
    <div class="last" v-if="status == 0">
      <div>
        <h3>{{$t('message.updatePhoneNumber')}}</h3>
      </div>
      <div class="main">
        <div class="code">{{this.$t('input.oldPhoneCode')}}：</div>
        <el-form ref="form1" :model="form1" :rules="rules1" label-width="220px">
          <el-form-item style="margin-bottom:25px;" prop="oldCode">
            <el-input
              v-model="form1.oldCode"
              style="width:260px;margin-right:20px;margin-left:-30px;"
            ></el-input>
            <el-button
              size="small"
              @click="getCode1"
              :disabled="disabled1"
              v-if="disabled1==false"
            >{{$t('button.getCode')}}</el-button>
            <el-button
              size="small"
              @click="getCode1"
              :disabled="disabled1"
              v-if="disabled1==true"
              style="margin-left:20px;"
            >{{btntxt}}</el-button>
            <p style="color: red">{{ statusMsg1 }}</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="confirm">
        <el-button type size="medium" style="width:100px;" @click="toSet">{{$t('button.cancel')}}</el-button>
        <el-button
          type="primary"
          size="medium"
          style="width:100px;"
          @click="toNext"
        >{{$t('button.nextStep')}}</el-button>
      </div>
    </div>
    <div class="next" v-if="status == 1">
      <div>
        <h3>{{$t('message.updatePhoneNumber')}}</h3>
      </div>
      <div class="main">
        <el-form ref="form" :model="form" :rules="rules" label-width="220px">
          <el-form-item
            :label="$t('input.newPhoneRequire')"
            style="margin-bottom:25px;"
            @blur="validateOld"
            prop="newPhone"
          >
            <el-input v-model="form.newPhone" style="width:260px;"></el-input>
          </el-form-item>
          <el-form-item :label="$t('input.newPhoneCode')+'：'" prop="code">
            <el-input v-model="form.code" style="width:260px;"></el-input>
            <el-button
              type="primary"
              size="small"
              style="margin-left:50px;"
              @click="getCode"
              :disabled="disabled"
              v-if="disabled==false"
            >{{$t('button.getCode')}}</el-button>
            <el-button
              type="button"
              size="small"
              @click="getCode"
              :disabled="disabled"
              v-if="disabled==true"
              style="margin-left:20px;"
            >{{btntxt}}</el-button>
            <p style="color: red">{{ statusMsg }}</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="confirm">
        <el-button type size="medium" style="width:100px;" @click="toSet">{{$t('button.cancel')}}</el-button>
        <el-button
          type="primary"
          size="medium"
          style="width:100px;"
          @click="updateTel('form')"
        >{{$t('button.confirm')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange";
import { mapState } from "vuex";
import {
  editInfo,
  getMessage,
  checkMessage,
  getUserDetail
} from "@/api/admin/user";
export default {
  data() {
    return {
      btntxt: this.$t("button.sendAgain"),
      disabled1: false,
      disabled: false,
      statusMsg1: "",
      statusMsg: "",
      empInfo: {},
      status: "0",
      form: {
        oldPhone: "",
        newPhone: "",
        code: ""
      },
      form1: {
        oldCode: ""
      },
      rules1: {
        oldCode: [
          {
            required: true,
            message: this.$t("input.oldPhoneCode"),
            trigger: "blur"
          }
        ]
      },
      rules: {
        newPhone: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
            message: this.$t("input.newPhoneRequire"),
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: this.$t("input.newPhoneCode"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    toLast() {
      this.status = "0";
    },
    toSet() {
      this.$emit("toSet");
    },
    getUserData() {
      getUserDetail(this.userInfo.username).then(res => {});
    },
    validateOld() {
      if (this.form.newPhone == this.userInfo.phone) {
        this.$message({
          type: "warning",
          message: this.$t("message.twoPhoneNumberJudge"),
          offset: 300
        });
      }
    },
    getCode() {
      if (this.form.newPhone == this.userInfo.phone) {
        this.$message({
          type: "warning",
          message: this.$t("message.twoPhoneNumberJudge"),
          offset: 300
        });
        return;
      } else {
        this.$refs["form"].validateField("newPhone", valid => {
          let param = {
            phone: this.form.newPhone
          };
          if (!valid) {
            getMessage(param.phone)
              .then(res => {
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
              .catch(err => {
                console.log(err);
              });
          }
        });
      }
    },
    getCode1() {
      getMessage(this.userInfo.phone)
        .then(res => {
          console.log(res);
          if (res.data.code == CodeMsg.CODE_1000) {
            this.time = 60;
            this.disabled1 = true;
            this.timer();
            return;
          }
          if (res.data.code == CodeMsg.CODE_1006) {
            this.statusMsg1 = this.$t("message.sendCodeError");
            return;
          }
          if (res.data.code == CodeMsg.CODE_1001) {
            this.statusMsg1 = this.$t("message.sendMoreThen");
            return;
          }
          if (res.data.code == CodeMsg.CODE_1003) {
            this.$message({
              type: "warning",
              message: res.data.data
            });
            return;
          }
        })
        .catch(err => {
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
    setPhone() {
      let obj = {
        phone: this.form.newPhone,
        username: this.userInfo.username,
        avatar: this.userInfo.avatar
      };
      editInfo(obj).then(res => {
        if (res.data.code == CodeMsg.CODE_0 && res.data.data == true) {
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess"),
            offset: 300
          });
          this.toSet();
        }
      });
    },
    updateTel() {
      this.$refs["form"].validate(valid => {
        console.log(valid);
        if (valid) {
          let param = {
            phone: this.form.newPhone,
            code: this.form.code
          };
          checkMessage(param).then(res => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.setPhone();
            } else if (res.data.code == CodeMsg.CODE_1001) {
              this.$message({
                type: "warning",
                message: this.$t("message.errorCode"),
                offset: 300
              });
            } else if (res.data.code == CodeMsg.CODE_1003) {
              this.$message({
                type: "warning",
                message: res.data.data,
                offset: 300
              });
            }
          });
        }
      });
    },
    getInfo() {
      let param = {
        employeesNo: this.userInfo.employeesNo
      };
      getOneEmployees(param).then(res => {
        this.empInfo = res.data;
      });
    },
    getEmplInfo() {
      getUpdateInfo().then(res => {
        this.userInfo = res.data;
        this.getInfo();
      });
    },
    toNext() {
      // this.status = "1";
      this.$refs["form1"].validateField("oldCode", valid => {
        console.log(valid);
        if (!valid) {
          // 这里缺少前后台验证码的校验
          let param = {
            phone: this.userInfo.phone,
            code: this.form1.oldCode
          };
          checkMessage(param).then(res => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.status = "1";
            }
            if (res.data.code == CodeMsg.CODE_1001) {
              this.$message({
                type: "warning",
                message: this.$t("message.errorCode"),
                offset: 300
              });
            }
            if (res.data.code == CodeMsg.CODE_1003) {
              this.$message({
                type: "warning",
                message: res.data.data,
                offset: 300
              });
            }
          });
        }
      });
    },
    toLast() {
      this.status = "0";
    },
    toSet() {
      this.$emit("toSet");
    }
  }
};
</script>

<style scoped>
.set-password {
  width: 900px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-left: 150px;
}
h3 {
  margin-left: 300px;
  margin-bottom: 50px;
}
.main {
  width: 700px;
  height: 200px;
}
.main .code {
  font-size: 14px;
  color: #606266;
  font-weight: 700;
  margin-left: 100px;
  margin-bottom: 40px;
}
.confirm {
  margin-left: 200px;
  width: 300px;
  display: flex;
  margin-bottom: 0px;
  justify-content: space-between;
}
</style>