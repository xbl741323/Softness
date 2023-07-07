<template>
<div class="set_pwd">
    <!-- 导航区域 -->
    <div class="tab_head">
      <span></span>
      <span @click="changeStatus()"> 账号信息</span>
      <span></span>
      <span> 修改密码 </span>
    </div>

    <!-- 内容区域 -->
    <div class="set_main">
      <el-tabs v-model="activeName">
        <el-tab-pane  name="message">
          <el-form  size="medium" label-width="120px" :model="phoneForm" ref="phoneForm" :rules="codeRules">
            <el-form-item label="手机号码：" prop="phone">
              <el-input v-model.trim="phoneForm.phone" class="wid1" placeholder="请输入手机号码" disabled></el-input>
              <span class="set_ski" @click="activeName='account'">手机无法使用，通过密码验证方式</span>
            </el-form-item>
            <el-form-item label="验证码：" prop="code">
              <el-input v-model.trim="phoneForm.code" class="wid2" placeholder="请输入手机验证码"></el-input>
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
            <el-button type="primary" class="btnStyle" size="medium" @click="toNext">下一步</el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane  name="account">
          <el-form  size="medium" label-width="120px" :model="accountForm" ref="accountForm" :rules="accountRules">
            <el-form-item label="账号名：" prop="username">
              <el-input v-model.trim="accountForm.username" class="wid1" placeholder="请输入手机号码" disabled></el-input>
              <span class="set_ski" @click="activeName='message'">手机短信验证方式</span>
            </el-form-item>
            <el-form-item label="密码：" prop="pwd">
              <el-input type="password" show-password v-model.trim="accountForm.pwd" class="wid1" placeholder="请输入新密码（6-16位字母加数字或符号组合）"></el-input>
            </el-form-item>
            <el-button type="primary" class="btnStyle" size="medium" @click="toNext">下一步</el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane  name="pwd">
          <el-form :model="pwdForm" ref="pwdForm" size="medium" label-width="140px" :rules="rules">
            <el-form-item label="新密码：" prop="newPwd">
              <el-input type="password" show-password v-model.trim="pwdForm.newPwd" class="wid1" placeholder="请输入新密码（6-16位字母加数字或符号组合）"></el-input>
            </el-form-item>
            <el-form-item  label="再次确认新密码：" prop="confirmPwd">
              <el-input
                type="password" 
                show-password
                v-model.trim="pwdForm.confirmPwd"
                class="wid1"
                placeholder="请再次确认密码"
              ></el-input>
            </el-form-item>
            <el-button type="primary" class="btnStyle" size="medium" @click="updatePwd">保 存</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import CryptoJS from "crypto-js";
import { changePassword } from "@/api/find";
import { getUserDetail,checkCode ,checkPassword } from "@/api/member";
import { sendcode, smsToManager, smsCheckForManager } from "@/api/register";
import * as CodeMsg from "@/api/CodeChange"
export default {
  setStatus: {
      type: String,
      required:true
  },
  data() {
    return {
      time: 0,
      btntxt: "",
      disabled: false,
      activeName:'message',
      accountId:null,
      phoneForm:{
        phone: "",
        code: "",
      },
      pwdForm: {
        newPwd: "",
        confirmPwd: "",
      },
      accountForm: {
        username: "",
        pwd: "",
      },
      mobile: '',
      accountRules:{
        username:[{ required: true},],
        pwd: [{
            required: true,
            pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/,
            message: "请输入6~16字母加数字或符号组合密码",
            trigger: "blur",
         }],
      },
      codeRules:{
        phone:[{ required: true},],
        code: [
          { required: true, message: "请填写手机验证码", trigger: "change" ,pattern: /^\d{6}$/,},
        ],
      },
      rules: {
        newPwd: [
          {
            required: true,
            pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/,
            message: "请输入6~16字母加数字或符号组合密码",
            trigger: "blur",
          },
        ],
        confirmPwd: [{ required: true, message: "请输入6~16字母加数字或符号组合密码", trigger: "blur" ,pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/}],
      },
    };
  },
  methods: {
    // 下一步
    toNext(){
      if(this.activeName == 'message'){
        this.$refs["phoneForm"].validate((valid) => {
          if(valid){
            smsCheckForManager(this.phoneForm.code).then(res => {
              if (res.data.code == CodeMsg.CODE_0) {
                this.activeName = 'pwd';
              (this.time = 0), (this.btntxt = ""), (this.disabled = false);
              } else{
                this.$message({
                  type: "warning",
                  message: res.data.msg,
                  offset: 300,
                  duration: 1500
                });
              }
            })
          }
        });
      }else if(this.activeName == 'account'){
        this.$refs["accountForm"].validate((valid) => {
          if(valid){
             let params = {
            // username: this.pwdForm.username,
            accountId:this.accountId,
            password:CryptoJS.MD5(this.accountForm.pwd).toString()
          };
          checkPassword(params).then((res) => {
            if (res.data.code !== CodeMsg.CODE_0) {
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
                duration: 1500
              });
              return false;
            }
            this.activeName = 'pwd';
            (this.time = 0), (this.btntxt = ""), (this.disabled = false);
          });
          }
        });
      }
    },
    // 确认修改密码
    updatePwd() {
      if (this.pwdForm.newPwd != this.pwdForm.confirmPwd) {
        this.$message({
          message: "两次密码输入不一致！",
          type: "warning",
          offset: 300,
          duration: 1500
        });
      } else {
        this.$refs["pwdForm"].validate((valid) => {
          if (valid) {
            let params = {
              passWord: CryptoJS.MD5(this.pwdForm.newPwd).toString(),
            };
            changePassword(params).then((res) => {
              if (res.data.code == CodeMsg.CODE_0) {
                this.$message({
                  type: "success",
                  message: "修改密码成功",
                  offset: 300,
                  duration: 1500
                });
                this.$router.push({
                  path:"/login"
                })
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.data.msg,
                  offset: 300,
                  duration: 1500
                });
              }
            });
          }
        });
      }
    },

    getUserData() {
      getUserDetail().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.phoneForm.phone = res.data.data.mobile;
          this.mobile = res.data.data.phone;
          this.accountForm.username = res.data.data.username;
          this.accountId = res.data.data.accountId;
        }
      });
    },
    // 发送验证码
    sendMsg() {
      this.time = 60;
      smsToManager({mobile:this.mobile})
        .then((res) => {
          console.log(res)
          if (res.data.code == CodeMsg.CODE_0) {
            this.time = 60;
            this.disabled = true;
            this.timer();
            this.$message({
              type: "success",
              message: "验证码已发送，5分钟之内有效！",
              offset: 300,
              duration: 2000,
            });
          } else if (res.data.code == CodeMsg.CODE_1) {
            this.$message({
              type: "warning",
              message: res.data.data.cnMsg,
              offset: 300,
              duration: 1500
            });
          }
        })
        .catch((err) => {
          return err;
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
    changeStatus(){
      this.status = 0;
      this.$emit('handle',this.status)
    }
  },
  mounted() {
    this.getUserData();
  },
};
</script>

<style scoped>
.set_pwd {
  margin-left: 25px;
}
.tab_head {
  margin-top: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 400;
}
.tab_head > span:nth-of-type(1) {
  display: inline-block;
  width: 6px;
  height: 18px;
  background: #3d85dc;
  opacity: 1;
  border-radius: 5px;

}
.tab_head > span:nth-of-type(2) {
  font-size: 16px;
  color: #373d40;
  margin-left: 12px;
  margin-right: 8px;
}
.tab_head > span:nth-of-type(2):hover {
  cursor: pointer;
  color: #36a6fe;
}
.tab_head > span:nth-of-type(3) {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-top: 1px solid #373d40;
  border-right: 1px solid #373d40;
  transform: rotate(45deg);
  margin-right: 10px;
}
.tab_head > span:nth-of-type(4) {
  font-size: 16px;
  color: #36a6fe;
}
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
.wid1 {
  width:400px;
}
.wid2 {
  width: 260px;
}
.marle {
  margin-left:25px;
}
.btnStyle {
  width:100px;
  margin:20px 0 0 260px;
}
.set_main >>> .el-tabs__header .el-tabs__nav-scroll {
  display: none;
}
</style>