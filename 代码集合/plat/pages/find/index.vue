<template>
  <div class="wt_find_pwd">
    <reg-wrapper></reg-wrapper>
     <el-dialog title="提示" :visible.sync="dialogVisible" width="20%" top="40vh" :close-on-click-modal="false" center>
       <div class="close_span">
      拖动下方滑块完成拼图
        <span @click="dialogVisible = false">+</span>
      </div>
      <div><vertify @msgSlider="rulePass" v-if="msgVerify"></vertify></div>
    </el-dialog>
    <!-- 修改密码 -->
    <div class="find_wrapper">
      <div class="find_box">
        <div class="find_text">忘记密码</div>
        <div class="find_decoration"></div>
      </div>
      <div class="find_content">
        <span class="login_account" @click="toLogin">已有账号 去登录></span>
       <el-tabs  v-model="activeName">
         <el-tab-pane name="message">
          <el-form :model="ruleForm" class="find-wrapper" ref="ruleForm" :rules="rRules">
            <el-form-item prop="phoneNumber" class="marleft">
                <img class="img_local" src="@/assets/images/login/icon_phone.png" alt />
                <el-input placeholder="请输入注册时绑定的手机号" v-model.trim="ruleForm.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item prop="code" class="marleft">
                <img class="img_local" src="@/assets/images/login/icon_lock.png" alt />
                <el-input placeholder="请输入手机验证码" v-model.trim="ruleForm.code"></el-input>
                <el-button size="mini" class="code_button" @click="sliderValidate">发送验证码</el-button>
                <el-button size="mini" class="code-button" @click="sliderValidate" :disabled="disabled" v-if="disabled==true">{{btntxt}}</el-button>
            </el-form-item>
            <el-button class="reg-button" type="primary" @click="toNext">下一步</el-button>
          </el-form>
          <div class="to_register">
            <span class="no_account">手机号码不再使用，</span>
            <span class="custom" @click="findPwd">身份认证找回密码</span>
          </div>
         </el-tab-pane>
         <el-tab-pane name="account">
          <el-form :model="pwdForm" class="find-wrapper" ref="pwdForm" :rules="pwdRules">
            <el-form-item class="marleft" v-show="userList.length>1" prop="userId"> 
              <el-select v-model="pwdForm.userId"  placeholder="请选择关联的账号" size="medium">
                <el-option v-for="(item,index) in userList" :key="index" :label="item.username" :value="item.userId" :disabled="item.isManager!=1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="pawd" class="marleft">
              <el-input type="password" placeholder="新密码（6-16位字母+数字/符号组合）" v-model.trim="pwdForm.pawd" show-password></el-input>
            </el-form-item>
            <el-form-item prop="checkPwd" class="marleft">
              <el-input type="password" placeholder="请再次确认新密码" v-model.trim="pwdForm.checkPwd" show-password></el-input>
            </el-form-item>
          </el-form>
          <el-button class="reg-button" type="primary" @click="updatePassword">确认修改密码</el-button>
         </el-tab-pane>
       </el-tabs>
      </div>
    </div>
    <el-dialog width="350px" top="300px"
        title="提示"
        :visible.sync="unassociatedVisible" center>
        <div class="tipBox">
            <div class="divStyle1">该手机号码尚未关联卧涛账号，请先去注册一个账号吧~</div>
            <div class="divStyle2">
                <div class="reStyle">
                  <nuxt-link to="/register" rel="nofollow">
                    <span class="go-register" >去注册></span>
                  </nuxt-link>
                </div>
            </div>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import vertify from "~/components/login/vetify";
import regWrapper from "~/components/login/regWrapper";
import CryptoJS from 'crypto-js'
import { sendcode } from '@/api/register'
import { checkUser} from '@/api/login'
import { forgetPwdCheck , securityCode, forgetPwdReset} from '@/api/find'
import { codeTxt } from '@/components/codeTxt'
import { MessageBox } from 'element-ui';
export default {
  layout: "empty",
  components: {
    regWrapper,
    vertify
  },
  head () {
    return {
      title: '找回密码',          
    }
  },
  data() {  
    return {
      dialogVisible: false,
      msgSlider: true,
      msgVerify: true,
      time: 0,
      btntxt: "",
      disabled: false,
      dialogAddVisible:false,
      securitydata:'',
      showMsgSlider: true,
      sliderMsgCheck: false,
      activeName: "message",
      rRules: {
        phoneNumber: [
            { required: true, message: "请填写正确的手机号", pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, trigger: "blur"},
        ],
        code: [{ required: true, message: "请填写正确的验证码", trigger: "blur" ,pattern: /^\d{6}$/,}],
      },
      pwdRules:{
        pawd: [
          { required:true, pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/, message: '请输入6~16位字母、数字和符号两种以上组合密码',  trigger: 'blur' },
        ],
        checkPwd: [
          {required:true, pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/, message: '请输入6~16位字母、数字和符号两种以上组合密码', trigger: 'blur' },
        ]
      },
      msgRule: {
        agree: false
      },
      ruleForm: {
        phoneNumber: "",
        code: "",
      },
      pwdForm:{
        userId:null,
        pawd: "",
        checkPwd: ""
      },
      unassociatedVisible:false,
      loginTemp:"",
      userList:[]
    };
  },
  methods: {
    sliderValidate() {
        this.time = 60;
        const self = this;
        let phonePass;
        this.$refs["ruleForm"].validateField("phoneNumber", (valid) => {
            phonePass = valid;
        });
        if (!phonePass) {
            this.msgVerify = true;
            this.dialogVisible = true;
        }
    },
    rulePass(val) {  
      this.msgSlider = val;    
      if(this.msgSlider == true){
        this.msgVerify = false
        this.dialogVisible = false
        this.sendMsg()
      }else{
        this.msgVerify = true
        this.dialogVisible = true
      }
    },
    // 获取图形验证码
    getCode() {
      securityCode().then(res => {
        this.securitydata = res
      })
    },
    // 查询是否有关联账号
    toNext() {
      this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            let params = {
              authCode: this.ruleForm.code,
	            mobile: this.ruleForm.phoneNumber
            }
            forgetPwdCheck(params).then(res=>{
              if(res.data.code != 0){
                if(res.data.code == 10003){
                  this.unassociatedVisible = true;
                  return false;
                }
                this.$message({
                  message: res.data.msg,
                  type: "warning",
                  offset: 300
                });
                return false;
              }
            this.activeName = 'account';
            this.loginTemp = res.data.data.loginTemp;
            this.userList = res.data.data.userList;
            let obj = this.userList.find(item=>item.isManager==1)
            this.pwdForm.userId = obj.userId;
            this.userList.forEach(item=>{
              if(item.isManager!=1){
                item.username = item.username +' 非管理员账号无法选择'
              }
             })
            }).then(error=>{
              console.log(error)
            })
          } 
        });
    },
    // 确认修改密码
    updatePassword(){
      if (this.pwdForm.pawd != this.pwdForm.checkPwd) {
              this.$message({
                message: "两次密码输入不一致！",
                type: "warning",
                offset: 300
              });
              return false;
      } else{
        this.$refs["pwdForm"].validate((valid) => {
          if(valid){
            let params = {
              loginTemp: this.loginTemp,
              password: CryptoJS.MD5(this.pwdForm.pawd).toString(),
              userId: this.pwdForm.userId
            }
            forgetPwdReset(params).then(res=>{
              if(res.data.code != 0){
                this.$message({
                  message: res.data.msg,
                  type: "warning",
                  offset: 300
                });
                return false;
              }
              this.$message({
                message: "找回密码成功",
                type: "success",
                offset: 300
              });
              this.$router.push("/login")
            }).catch(error=>{
              console.log(error)
            })
          }
        })
     }
    },

    // 发送验证码
    sendMsg() {
      this.time = 60;
      const self = this;
      let phonePass;
      this.$refs["ruleForm"].validateField("phoneNumber", (valid) => {
          phonePass = valid;
      });
      if (!phonePass) {
          sendcode(this.ruleForm.phoneNumber).then((res) => {
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
              } else{
                  this.$message({
                      type: "info",
                      message: res.data.msg,
                      offset: 300,
                  });
              }
          });
        }
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
    // 客服工具
    showCustomerTool(){
      window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
    },
    // 跳转登录页
    toLogin() {
        this.$router.push({
            path: "/login",
        });
    },
    // 跳转身份认证找回密码页面
    findPwd(){
      this.$router.push({
          path: "/find/findPwd",
      });
    }
  }
};
</script>


<style>
.find-wrapper input{
  width: 410px;
}
.wt_find_pwd {
  position: relative;
}
.wt_find_pwd .login_er {
  position: absolute;
  right: 0px;
  top: 0px;
}
.find_wrapper {
  position: absolute;
  right: 398px;
  top: 165px;
  width: 480px;
  height: 520px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 4px;
}
.find_box{
  margin:70px 0 10px 30px;
  font-size:22px;
  color:#36A6FE;
}
.find_text{
  margin-left:170px;
  margin-bottom:-3px;
  font-size: 22px;
}
.find_decoration{
  margin-left:145px;
  width:138px;
  height:2px;
  background:rgba(54,166,254,1);
  opacity:1;
  display:inline-block;
  margin-bottom:10px;
}
.wrapper_size {
  font-size: 14px;
  color: #36a6fe;
  margin-left: 285px;
  margin-top: 20px;
  /* cursor: pointer; */
}
.wrapper_size:hover {
  color: #409eff;
  /* text-decoration: underline; */
}
.find-wrapper {
  margin-top: 25px;
}
.find-wrapper .check-agree .el-checkbox__inner {
  background: #fff;
}
.find-wrapper .check-agree .is-checked .el-checkbox__inner {
  background: #409eff;
}
.find-wrapper .error {
  text-align: center;
  margin-top: 2px;
  color: red;
}
.find-wrapper label:before {
  content: "" !important;
}
.find-wrapper input {
  width: 410px;
  padding-left: 30px;
}
.find-wrapper .success .code-button {
  background: #409eff;
}
.find-wrapper .code-button {
  position: absolute;
  top: 0px;
  right: 30px !important;
  border: none;
  border-radius: 0;
  color: #fff;
  width: 120px;
  height: 48px;
  background: rgba(54, 166, 254, 1);
  opacity: 1;
  border-radius: 2px;
  border: 1px solid rgba(54, 166, 254, 1);
}
.find-wrapper .code-button:hover {
  background: rgba(54, 166, 254, 1);
  color: #fff;
  height: 48px;
  border: 1px solid rgba(54, 166, 254, 1);
}
.find-wrapper .el-input__suffix {
  right: 42px;
}
.find-wrapper .agreeAsk .el-form-item__error {
  top: 45px;
  left: 40px;
}
.find-wrapper .check-agree .deal {
  color: #409eff;
}
.find-wrapper  .el-input__inner {
  width: 410px !important;
  height: 48px;
  opacity: 1;
  border-radius: 0px !important;
  border: 1px solid rgba(184, 184, 184, 1);
}
.find_wrapper .code_button {
  position: absolute;
  top: 0px;
  width: 120px;
  height: 48px;
  background: rgba(54, 166, 254, 1);
  opacity: 1;
  right: 30px !important;
  border: none;
  border-radius: 2px;
  color: #fff;
  font-size: 16px;
}
.find_wrapper .code_button:hover {
  background: #409eff;
  color: #fff;
}
.reg-button {
  width: 410px;
  height: 46px;
  background: rgba(54, 166, 254, 1);
  opacity: 1;
  margin-left: 35px;
  font-family: "Microsoft YaHei";
  margin-top: 20px;
  border-radius: 2px;
  font-size: 18px;
}
.custom{
  color:#409eff;
}
.custom:hover{
  cursor: pointer;
}
.to_register {
  font-size: 14px;
  float: right;
  margin-top: 15px;
  margin-right: 40px;
}
.to_register a {
  text-decoration: none;
  color: #666666;
}
.marleft{
  margin-left:40px;
}
.no_account{
  color:#999999;
}
.img_local {
  position: absolute;
  top: 50%;
  transform: translateY(-53%);
  left: 8px;
  z-index: 4;
}
.el-dialog__body {
  padding: 0 0 0 0 !important;
}
.close_span {
  width: 410px;
  height: 40px;
  background: #fff;
  position: absolute;
  top: -132px;
  text-align: center;
  font-size: 16px;
  line-height: 40px;
}
.close_span span {
  position: absolute;
  right: 5px;
  bottom: 1px !important;
  font-size: 40px;
  cursor: pointer;
  transform: rotate(45deg);
}
.tipBox {
    border-top:1px solid #eee;
    padding-top:5px;
}
.divStyle1{
    margin:15px;
    text-indent: 2em;
}
.divStyle2{
    display:flex;
    justify-content:flex-end;
}
.reStyle {
    padding:10px;
}
.go-register{
    color: #409eff;
}
.wt_find_pwd .el-select > .el-input{
  padding-right:30px;
}

.find_content .el-tabs__nav-scroll {
  display: none;
}
</style>