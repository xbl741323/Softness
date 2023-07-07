<template>
  <div class="set_main">
    <!-- 验证当前登录密码 -->
    <el-form :model="pwdForm" ref="pwdForm" size="medium" label-width="130px" :rules="pwdRules" v-if="showStatus==0">
      <el-form-item label="账号名：" prop="username">
        <el-input  v-model.trim="pwdForm.username" class="wid" placeholder="请输入账号名" disabled></el-input>
        <span class="set_ski" @click="toSki">手机短信验证方式</span>
      </el-form-item>
      <el-form-item label="登录密码：" prop="pwd">
        <el-input show-password type="password" v-model.trim="pwdForm.pwd" class="wid" placeholder="请输入登录密码"></el-input>
      </el-form-item>
      <el-button type="primary" class="btn" size="medium" @click="toNext">下一步</el-button>
    </el-form>

    <!-- 下一步后的操作 -->
    <el-form :model="phoneForm" ref="phoneForm" size="medium" label-width="120px" :rules="phoneRules" v-if="showStatus==1">
      <el-form-item label="新手机号码：" prop="newPhone">
        <el-input v-model.trim="phoneForm.newPhone" class="wid" placeholder="请输入新手机号码"></el-input>
      </el-form-item>
      <el-form-item label="验证码：" prop="code">
        <el-input v-model.trim="phoneForm.code" class="wid" placeholder="请输入新手机号码接收的验证码"></el-input>
        <el-button type="primary" class="marle" @click="sendMsg" v-if="disabled==false">获取验证码</el-button>
              <el-button
                  type="primary"
                  size="medium"
                    class="marle"
                  @click="sendMsg"
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
import { getUserDetail, changePhone ,checkPassword} from "@/api/member";
import { sendcode } from "@/api/register";
export default {
  data() {
    return {
      time: 0,
      btntxt: "",
      disabled: false,
      originPhone:"",
      accountId:null,
      showStatus:0,
      pwdForm: {
        username: "",
        pwd: "",
      },
      phoneForm: {
        oldPhone:"",
        newPhone: "",
        code: "",
      },
      pwdRules: {
        username:[{required:true}],
        pwd: [
          { required: true, message: "请输入正确的密码", trigger: "blur",pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/ },
        ]
      },
      phoneRules: {
        newPhone: [
          {
            required: true,
            message: "请填写正确的新手机号",
            trigger: "change",
            pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
          },
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur",pattern: /^\d{6}$/, }],
      },
    };
  },
  mounted(){
    this.getUserDetail()
  },
  methods: {
    getUserDetail(){
      getUserDetail().then(res=>{
        this.pwdForm.username = res.data.data.username
        this.accountId = res.data.data.accountId
      })
    },
    toNext(){
       this.$refs["pwdForm"].validate((valid) => {
        if (valid) {
          let params = {
            // username: this.pwdForm.username,
            accountId:this.accountId,
            password:CryptoJS.MD5(this.pwdForm.pwd).toString()
          };
          checkPassword(params).then((res) => {
            if (res.data.code !== 0) {
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
              });
              return false;
            }
            this.showStatus = 1;
            (this.time = 0), (this.btntxt = ""), (this.disabled = false);
          });
        }
      });
    },
    refresh(){
      this.getUserInfo();
      getUserInfo().then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res.data.data));
      });
    },
    updatePhone() {
      this.$refs["phoneForm"].validate((valid) => {
        if (valid) {
          let params = {
            authCode: this.phoneForm.code,
            mobile:this.phoneForm.newPhone
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
            this.$emit('handle',0)
          });
        }
      });
    },
    toSki() {
      this.$emit("to-ski");
    },
    // 发送验证码
    sendMsg() {
      this.$refs["phoneForm"].validateField("newPhone", (valid) => {
        if (!valid) {
          this.time = 60;
          sendcode(this.phoneForm.newPhone)
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
        this.phoneForm.oldPhone = res.data.data.mobile;
      });
    },
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
.marle {
  margin-left: 25px;
}
.btn {
  width:100px;
  margin:20px 0 0 260px;
}
</style>