<template>
<div class="set_main">
    <el-form :model="formOne" ref="formOne" size="medium" label-width="130px" :rules="rulesOne" v-if="showStatus==0">
      <!-- 验证当前手机号 -->
        <el-form-item label="当前手机号码：" prop="currentPhone">
          <el-input disabled v-model.trim="formOne.currentPhone" class="wid"></el-input>
          <span class="set_ski" @click="toSki">手机无法使用，通过密码验证方式</span>
        </el-form-item>
        <el-form-item label="验证码：" prop="codeOne">
          <el-input v-model.trim="formOne.codeOne" class="wid" placeholder="请输入当前手机验证码"></el-input>
          <el-button type="primary" class="marle" @click="sendMsg(formOne.currentPhone)" v-if="disabled==false">获取验证码</el-button>
                <el-button
                    type="primary"
                    size="medium"
                    class="marle"
                    @click="sendMsg(formOne.currentPhone)"
                    :disabled="disabled"
                    v-if="disabled==true"
                >{{btntxt}}</el-button>
        </el-form-item>
        <el-button type="primary" class="btn" size="medium" @click="toNext">下一步</el-button>
      </el-form>

      <!-- 下一步后的操作 -->
      <el-form :model="formTwo" ref="formTwo" size="medium" label-width="120px" :rules="rulesTwo" v-if="showStatus == 1">
        <el-form-item label="新手机号码：" prop="newPhone">
          <el-input v-model.trim="formTwo.newPhone"  class="wid" placeholder="请输入新手机号码"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="codeTwo">
          <el-input v-model.trim="formTwo.codeTwo"  class="wid" placeholder="请输入新手机号码接收的验证码"></el-input>
          <el-button type="primary" class="marle" @click="sendMsg2(formTwo.newPhone)" v-if="disabled==false">获取验证码</el-button>
                <el-button
                    type="primary"
                    size="medium"
                    class="marle"
                    @click="sendMsg(formTwo.newPhone)"
                    :disabled="disabled"
                    v-if="disabled==true"
                >{{btntxt}}</el-button>
        </el-form-item>
        <el-button type="primary" class="btn" size="medium" @click="updatePhone">提交</el-button>
      </el-form>
      </div>
</template>

<script>
import CryptoJS from "crypto-js";
import { changePassword } from "@/api/find";
import { getUserDetail, changePhone, checkCode } from "@/api/member";
import { sendcode } from "@/api/register";
export default {
  props: ["phone"],
  data() {
    return {
      time: 0,
      btntxt: "",
      status:0,
      disabled: false,
      showStatus: 0,
      formOne: {
        oldPhone:"",
        currentPhone: "",
        codeOne: "",
      },
      formTwo: {
        newPhone: "",
        codeTwo: "",
      },
      rulesOne: {
        currentPhone:[{required:true}],
        codeOne: [{ required: true, message: "验证码错误", trigger: "blur" ,pattern: /^\d{6}$/,}],
      },
      rulesTwo: {
        newPhone: [
          {
            required: true,
            message: "手机号码格式错误",
            trigger: "change",
            pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
          },
        ],
        codeTwo: [{ required: true, message: "验证码错误", trigger: "blur",pattern: /^\d{6}$/, }],
      },
    };
  },
  methods: {
    updatePhone() {
      this.$refs["formTwo"].validate((valid) => {
        if (valid) {
          if(this.formOne.oldPhone == this.formTwo.newPhone){
            this.$message({
              type: "warning",
              message: "更换的手机号不能和原手机号相同！",
              offset: 300,
            });
            return false;
          }
          let params = {
            authCode: this.formTwo.codeTwo,
            mobile:this.formTwo.newPhone
          };
          changePhone(params).then((res) => {
            if (res.data.code !== 0) {
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
              });
              return false;
            } 
            this.$message({
              type: "success",
              message: "修改成功！",
              offset: 300,
            });
            this.getUserData();
            this.$emit('handle',this.status)
          });
        }
      });
    },
    toNext() {
      this.$refs["formOne"].validate((valid) => {
        if (valid) {
          let params = {
            mobilephone: this.formOne.currentPhone,
            authcode: this.formOne.codeOne,
          };
          checkCode(params).then((res) => {
            if (res.data.data.code == 1000) {
              this.showStatus = 1;
            (this.time = 0), (this.btntxt = ""), (this.disabled = false);
            } else{
               this.$message({
                type: "warning",
                message: res.data.data.cnMsg,
                offset: 300,
              });
            }
          });
        }
      });
    },
    getUserData() {
      getUserDetail().then((res) => {
         if (res.data.code !== 0) {
          this.$message({
            type: "error",
            message: res.data.msg,
            offset: 400,
          });
         return false;
        }
        this.formOne.oldPhone = res.data.data.mobile;
        this.formOne.currentPhone = this.filterMobile(res.data.data.mobile);
      });
    },
    filterMobile(value) {
      if (value) {
        var reg = /^(\d{3})\d*(\d{4})$/;
        var str = value.replace(reg, "$1****$2");
        return str;
      }
    },
    toSki() {
      this.$emit("to-ski");
    },
    refresh(){
      this.getUserInfo();
      getUserInfo().then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res.data.data));
      });
    },
    // 发送验证码
    sendMsg(phone) {
      this.time = 60;
      sendcode(phone)
        .then((res) => {
          if (res.data.code == 0) {
            this.time = 60;
            this.disabled = true;
            this.timer();
            this.$message({
              type: "success",
              message: "验证码已发送，5分钟之内有效！",
              offset: 300,
              duration: 2000,
            });
          } else if (res.data.code == 1) {
            this.$message({
              type: "warning",
              message: res.data.data.cnMsg,
              offset: 300,
            });
          }
        })
        .catch((err) => {
          return err;
        });
    },
    sendMsg2(phone) {
      this.$refs["formTwo"].validateField("newPhone", (valid) => {
        if (!valid) {
          this.time = 60;
          sendcode(phone)
            .then((res) => {
              if (res.data.code == 0) {
                this.time = 60;
                this.disabled = true;
                this.timer();
                this.$message({
                  type: "success",
                  message: "验证码已发送，5分钟之内有效！",
                  offset: 300,
                  duration: 2000,
                });
              } else if (res.data.code == 1) {
                this.$message({
                  type: "warning",
                  message: res.data.data.cnMsg,
                  offset: 300,
                });
              }
            })
            .catch((err) => {
              return err;
            });
        }
      });
    },
    //60S倒计时
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time + "s后重新获取";
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btntxt = "获取验证码";
        this.disabled = false;
      }
    },
  },
  mounted() {
    this.getUserData();
  },
};
</script>

<style scoped>
.set_main {
  margin-top: 50px;
  margin-left: 80px;
}
.set_ski {
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  color: #36a6fe;
  margin-left: 10px;
  cursor: pointer;
}
.wid {
   width: 260px;
}
.wid>>>.el-input__inner {
  padding:0 30px !important;
}
.marle{
  margin-left: 25px;
}
.btn {
  width:100px;
  margin:20px 0 0 260px;
}
</style>