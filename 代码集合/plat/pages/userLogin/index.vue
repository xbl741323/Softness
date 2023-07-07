<template>
  <div class="wt_register">
     <!-- 文案  -->
    <reg-wrapper></reg-wrapper>
    <!-- 滑块拼图 -->
    <el-dialog  title="提示" :visible.sync="dialogVisible" width="20%" top="40vh" custom-class="dis" :close-on-click-modal="false" center :before-close="handleClose">
      <div class="close_register">
         拖动下方滑块完成拼图<span @click="dialogVisible = false">+</span>
      </div>
      <div><vertify @msgSlider="rulePass" v-if="msgVerify"></vertify></div>
    </el-dialog>
    <!-- 用户注册 -->
    <div class="register_wrapper">
      <img src="~assets/images/login/close.png" alt="" width="16" height="16" class="close_icon" @click="goBack">
      <div class="style1">
          <img src="~assets/images/tip.png" alt="" width="20" height="20" style="flex:1">
          <div style="display:inline-block;flex:20">更新提示：由于系统更新，请先完善账号信息</div>
      </div>
      <div>
        <el-form :model="ruleForm" class="input-wrapper" ref="ruleForm" :rules="rules">
          <el-form-item prop="username">
            <img class="img_location" src="@/assets/images/login/icon_user.png" alt/>
            <el-input v-model.trim="ruleForm.username" placeholder="请输入4~16位纯字母（或字母+数字组合）"></el-input>
          </el-form-item>
          <el-form-item prop="phoneNumber">
            <img class="img_location" src="@/assets/images/login/icon_phone.png" alt/>
            <el-input v-model="ruleForm.phoneNumber" placeholder="请输入注册手机号" disabled></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <img class="img_location" src="@/assets/images/login/icon_lock.png" alt />
            <el-input  v-model="ruleForm.code" placeholder="请输入短信验证码"></el-input>
            <el-button size="mini" class="code_button" @click="sliderValidate" :disabled="this.btn">发送验证码</el-button>
            <el-button size="mini" class="code-button" @click="sliderValidate" :disabled="disabled" v-if="disabled == true">{{ btntxt }}</el-button>
          </el-form-item>
          <el-form-item prop="pwd">
            <img class="img_location" src="@/assets/images/login/icon_lock.png" alt/>
            <el-input type="password" v-model="ruleForm.pwd" placeholder="请输入6~16位字母、数字和符号两种以上组合密码" show-password></el-input>
          </el-form-item>
          <el-form-item prop="confirmpwd">
            <img class="img_location" src="@/assets/images/login/icon_lock.png" alt/>
            <el-input type="password" v-model="ruleForm.confirmpwd" placeholder="请再次输入密码" show-password></el-input>
          </el-form-item>
          <div class="style4">
            <el-checkbox class="check-agree"  name="agree" v-model="ruleForm.agree" @change="checkChange"> 
                <span :class="[ruleForm.agree == false?'style5':'style6']">确认表示您同意</span>
            </el-checkbox>
            <nuxt-link to="/agreement/yhzc" rel="nofollow" class="style6">《用户注册协议》</nuxt-link>
            <span class="txtSty">和</span>
            <nuxt-link to="/agreement/ysbh" rel="nofollow"  class="style6">《隐私保护声明》</nuxt-link>
          </div>
          <div v-if="ruleAgree == true" class="proto_check">请勾选协议</div>
          <el-button class="rege-button style7"  type="primary" @click="submit" :disabled="this.btn">确 认</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import vertify from "~/components/login/vetify"
import regWrapper from "~/components/login/regWrapper"
import { sendcode, oldUserLogin ,checkUsernameExist} from "@/api/register"
import { getUserInfo,logOut} from "@/api/login"
import CryptoJS from "crypto-js"
export default {
    layout: "empty",
    components: {
        regWrapper,
        vertify,
    },
    head() {
        return {
            title: "完善卧涛账号",
        };
    },
    data() {
        var checkUsername = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("账号名不能为空"));
            } else {
                checkUsernameExist(value).then((res) => {
                    if (res.data.code === 0) {
                        this.btn = false;
                        callback();
                    } else {
                        this.btn = true;
                        return callback(new Error("该账号名已被注册，请换个试试吧~"));
                    }
                })
            }
        };
        
        return {
            dialogVisible: false,
            ruleShow: false,
            msgSlider: false,
            msgVerify: false,
            time: 0,
            btntxt: "",
            disabled: false,
            showMsgSlider: true,
            sliderMsgCheck: false,
            activeName: "account",
            btn: false,
            registedTime: 0,
            rgSuccuesstxt: "",
            rules: {
                username:[
                {
                    required: true,
                    pattern: /^(?![0-9]+$)[a-zA-Z0-9]{4,16}$/,
                    message: "请输入4~16位纯字母（或字母+数字组合）",
                    trigger: "blur",
                },    
                { validator: checkUsername, trigger: "blur" },
                ],
                phoneNumber: [
                {
                    required: true,
                    message: "请填写正确的手机号",
                    pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
                    trigger: "change",
                },
                ],
                code: [{ 
                    required: true, 
                    message: "请填写正确的验证码",
                    pattern: /^\d{6}$/,
                    trigger: "blur" }],
                pwd: [
                {
                    required: true,
                    pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/,
                    message: "请输入6~16字母加数字或特殊符号组合的密码",
                    trigger: "blur",
                },
                ],
                confirmpwd: [
                {
                    required: true,
                    pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/,
                    message: "请输入6~16字母加数字或特殊符号组合的密码",
                    trigger: "blur",
                },
                ],

            },
            msgRule: {
                agree: true,
            },
            ruleForm: {
                username:"",
                phoneNumber: "",
                code: "",
                pwd: "",
                confirmpwd: "",
                agree: false
            },
            ruleAgree: false
        };
    },
    mounted(){
        if(JSON.parse(localStorage.getItem('userInfo'))){
            this.ruleForm.phoneNumber = JSON.parse(localStorage.getItem('userInfo')).phone
        }
    },
    methods: {
        handleClose(done) {
            this.$confirm("确认关闭？").then((_) => {
                done();
            }).catch((_) => {});
        },
        rulePass(val) {
            this.msgSlider = val;
            if (this.msgSlider == true) {
                this.msgVerify = false;
                this.dialogVisible = false;
                this.sendMsg();
            } else {
                this.msgVerify = true;
                this.dialogVisible = true;
            }
        },
        // 返回上一页
        goBack(){
            logOut().then(res=>{
                localStorage.removeItem('userInfo');
                sessionStorage.clear();
                location.href='/login'
            })
        },
        timeToLogin() {
            if (this.registedTime > 0) {
                this.registedTime--;
                this.rgSuccuesstxt = this.registedTime + "s后去登录页面";
                setTimeout(this.timeToLogin, 1000);
            } else {
                this.registedTime = 0;
                this.$router.push({
                path: "/login",
                query: {
                    registPath: this.registPath,
                },
                });
            }
        },
        // 滑块校验
        sliderValidate() {
            this.time = 60;
            let phonePass;
            this.$refs["ruleForm"].validateField("phoneNumber", (valid) => {
                phonePass = valid;
            });
            if (!phonePass) {
                this.dialogVisible = true;
                this.msgVerify = true;
            }
        },
        // 发送验证码
        sendMsg() {
            this.time = 60;
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
                } else if (res.data.code == 1) {
                    this.$message({
                        type: "info",
                        message: res.data.msg,
                        offset: 300,
                    })
                }
                })
            }
        },
        // 倒计时
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
        // 提交完善信息
        submit(){
            if(this.ruleForm.agree == false){
                this.ruleAgree = true
            }else{
                this.ruleAgree = false
            }
            this.$refs["ruleForm"].validate((valid) => {
                if (valid && this.ruleForm.agree == true) {
                    if (this.ruleForm.pwd != this.ruleForm.confirmpwd) {
                        this.$message({
                            message: "两次密码输入不一致！",
                            type: "warning",
                            offset: 300,
                            duration: 1500
                        });
                        return false
                    } 
                    let para = {
                        authCode: this.ruleForm.code,//手机验证码
                        mobile: this.ruleForm.phoneNumber,//手机号
                        password: CryptoJS.MD5(this.ruleForm.pwd).toString(),//密码
                        username: this.ruleForm.username//账号名
                    };
                    oldUserLogin(para).then((res) => {
                        if(res.data.code == 0){
                            this.$message({
                                type: "success",
                                message: "账号信息完善成功",
                                offset: 200,
                            });
                            getUserInfo().then((res) => {
                                localStorage.setItem('userInfo', JSON.stringify(res.data.data));
                                this.$store.commit('SET_USERINFO',res.data.data);
                                setTimeout(()=>{
                                    location.href = "/";
                                },1000)
                            });
                        } else{
                            this.$message({
                                type: "warning",
                                message: res.data.msg,
                                offset: 300,
                            });
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            });
        },
        checkChange(val) {
            if (val == true) {
                this.ruleAgree = false;
            }
        },
    },
};
</script>


<style>
.wt_register {
    position: relative;
}
.wt_register .login_er {
    position: absolute;
    right: 0px;
    top: 0px;
}
.wt_register .el-form-item__error {
    left: 30px;
}
.register_wrapper {
    position: absolute;
    right: 398px;
    top: 165px;
    width: 480px;
    height: 590px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;
}
.login_account {
    position: absolute;
    font-size: 14px;
    right: 30px;
    top: 40px;
    color: #409eff;
    cursor: pointer;
}
.wrapper_size {
    font-size: 14px;
    color: #36a6fe;
    margin-left: 285px;
    margin-top: 20px;
}
.wrapper_size:hover {
    color: #409eff;
}
.input-wrapper {
    margin-top: 25px;
}

.input-wrapper .check-agree .el-checkbox__inner {
    background: #fff;
}

.input-wrapper .check-agree .is-checked .el-checkbox__inner {
    background: #409eff;
}

.input-wrapper .error {
    text-align: center;
    margin-top: 2px;
    color: red;
}

.input-wrapper label:before {
    content: "" !important;
}

.input-wrapper label {
    font-size: 16px;
    color: #000;
    text-align-last: justify;
    padding-left: 20px;
}

.input-wrapper input {
    width: 410px;
    height: 48px;
    margin-left: 30px;
    border-radius: 2px;
    line-height: 48;
    padding-left: 30px;
}

.input-wrapper .success .code-button {
    background: #409eff;
}

.input-wrapper .code-button {
    position: absolute;
    top: 0px;
    right: 40px;
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
.input-wrapper .code-button:hover {
    background: rgba(54, 166, 254, 1);
    color: #fff;
    height: 48px;
    border: 1px solid rgba(54, 166, 254, 1);
}

.input-wrapper .el-input__suffix {
    right: 42px;
}

.input-wrapper .agreeAsk .el-form-item__error {
    top: 45px;
    left: 40px;
}

.input-wrapper .check-agree .deal {
    color: #409eff;
}

.code_button {
    position: absolute;
    top: 0px;
    width: 120px;
    height: 48px;
    background: rgba(54, 166, 254, 1) !important;
    opacity: 1;
    right: 40px;
    border: none;
    border-radius: 2px;
    color: #fff !important;
    font-size: 16px;
}
.code_button:hover {
    background: #409eff;
    color: #fff;
    opacity: 0.8;
}
.rege-button {
    width: 410px;
    height: 46px;
    background: rgba(54, 166, 254, 1);
    opacity: 1;
    margin-left: 32px;
    font-family: "Microsoft YaHei";
    margin-top: 20px;
    border-radius: 2px;
    font-size: 18px;
}
.to_register {
    font-size: 14px;
    float: right;
    margin-top: 10px;
    margin-right: 40px;
}
.to_register a {
    text-decoration: none;
    color: #666666;
}
.img_location {
    position: absolute;
    top: 50%;
    transform: translateY(-53%);
    left: 37px;
    z-index: 4;
}
.el-dialog__body {
    padding: 0 0 0 0 !important;
}
.close_register {
    width: 410px;
    height: 40px;
    background: #fff;
    position: absolute;
    top: -132px;
    text-align: center;
    font-size: 16px;
    line-height: 40px;
}
.close_register span {
    position: absolute;
    right: 5px;
    bottom: 1px !important;
    font-size: 40px;
    cursor: pointer;
    transform: rotate(45deg);
}
.close_icon {
    position: absolute;
    right: 20px;
    top: 20px;
}
.style1 {
    display: flex;
    margin: 50px 0 10px 30px;
    font-size: 16px;
    color: #282828;
}
.style4{
    margin: 5px 0 5px 30px;
}
.style5{
    color: #b8b8b8;
}
.style6{
    color: #409eff !important;
}
.style7{
    margin-left: 31px;
}
.style8{
    margin-left: 13px;
    color: #999999;
    margin-top: 5px;
}
.txtSty {
    color: #b8b8b8;
    margin: 0 -6px;
}
.proto_check {
    color: #3b3b3b;
    margin-left: 45px;
}
</style>