<template>
    <div class="wt_login">
        <reg-wrapper></reg-wrapper>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="20%" top="40vh" :close-on-click-modal="false" center>
            <div class="close_find">
                拖动下方滑块完成拼图
                <span @click="dialogVisible = false">+</span>
            </div>
            <div>
                <vertify @msgSlider="rulePass" v-if="msgVerify"></vertify>
            </div>
        </el-dialog>
        <div class="login_wrapper height1"  v-if="showStatus == 0">
            <el-tabs v-model="activeName" class="login">
                <!-- 手机快捷登录 -->
                <el-tab-pane label="手机快捷登录" name="message">
                    <el-form :model="ruleForm" class="input-wrapper" ref="ruleForm" :rules="rRules" >
                        <el-form-item prop="phoneNumber">
                            <img class="img_location" src="@/assets/images/login/icon_phone.png" alt />
                            <el-input v-model="ruleForm.phoneNumber" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item prop="code">
                            <img  class="img_location"
                                src="@/assets/images/login/icon_lock.png"
                                alt
                            />
                            <el-input v-model="ruleForm.code" placeholder="请输入验证码" @keyup.enter.native="ruleLogin"></el-input>
                            <el-button size="mini" class="code_button" @click="sliderValidate">发送验证码</el-button>
                            <el-button size="mini" class="code-button" @click="sliderValidate" :disabled="disabled" v-if="disabled == true">{{ btntxt }}</el-button>
                        </el-form-item>
                        <div class="user-agreement">
                            <el-checkbox class="check-agree"  name="agree" v-model="ruleForm.agree" @change="checkChange"> 
                                <span :class="[ruleForm.agree==false?'fontStyle':'']">
                                    登录即表示同意
                                </span>
                            </el-checkbox>
                            <span class="deal">
                                <nuxt-link class="user-register" rel="nofollow" to="/agreement/yhzc" >《用户注册协议》</nuxt-link>
                                <span class="and">和</span>
                                 <span class="protect">
                                    <nuxt-link to="/agreement/ysbh" rel="nofollow" class="statement">《隐私保护声明》</nuxt-link>
                                </span>
                            </span>
                        </div>
                        <div v-if="ruleAgree == true" class="checked">请勾选协议</div>
                        <el-button class="re-button login1"  type="primary" @click="ruleLogin">登 录</el-button>
                        <div class="to_register" >
                            <nuxt-link to="/register" rel="nofollow" v-if="extra_data">
                                <span class="no-account">还没有账号，</span>
                                <span class="go-register">去注册></span>
                            </nuxt-link>
                        </div>
                    </el-form>
                </el-tab-pane>
                <!-- 账号密码登录 -->
                <el-tab-pane label="账号密码登录" name="account">
                    <el-form :model="phoneForm" class="input-wrapper" ref="phoneForm" :rules="phoneRules">
                        <el-form-item prop="username">
                            <img  class="img_location" src="@/assets/images/login/icon_user.png" alt />
                            <el-input v-model.trim="phoneForm.username" placeholder="请输入账号名"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <img class="img_location" src="@/assets/images/login/icon_lock.png" alt />
                            <el-input v-model="phoneForm.password" placeholder="请输入密码" show-password  @keyup.enter.native="usernameLogin"></el-input>
                        </el-form-item>
                        <div class="to_register forget">
                            <nuxt-link to="/find" rel="nofollow">
                                <span class="forget-password">忘记密码？</span>
                            </nuxt-link>
                            <nuxt-link to="/account" rel="nofollow">
                                <span class="forget-password">忘记账号？</span>
                            </nuxt-link>
                        </div>
                        <el-button class="re-button login2"  type="primary" @click="usernameLogin">登 录</el-button>
                        <div class="to_register" @click="setMark()">
                            <nuxt-link to="/register" rel="nofollow" >
                                <span class="no-account">还没有账号，</span>
                                <span class="go-register">去注册></span>
                            </nuxt-link>
                        </div>
                        
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <div class="third-login" @click="wechatLogin">
                <div class="wrapper_inner">
                    <span></span>
                    <img src='@/assets/images/login/icon_wet_login.png' alt />
                    <span></span>
                </div>
                <div class="login3">第三方账号登录</div>
            </div>
        </div>

        <!-- 图形验证码 -->
        <el-dialog width="450px" top="300px" title="请输入图中的验证码" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" :rules="rRules" label-width="130px" @submit.native.prevent>
                <div class="codeBox">
                    <input v-model="security" class="codeinput"  placeholder="请输入右图中的验证码" />
                    <span class="get-code" @click="getCode">
                        <img :src="'data:image/jpeg;base64,' + securitydata" class="imgStyle" alt />
                    </span>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer centerText" >
                <el-button type="primary" @click="submitNewAdd" :disabled="securityButton" class="make-sure">确定</el-button>
            </div>
        </el-dialog>

        <!-- 选择关联账号 -->
        <el-dialog width="450px" top="250px"
            title="选择一个关联账号登陆"
            :visible.sync="associatedVisible"
            center >
            <div :class="[len > 10 ?'over lineStyle':'lineStyle']">
                <el-radio-group v-model="accountId" v-for="(item,index) in datalist.list" :key="index" class="radioStyle" :disabled="item.isDisabled == 1">
                    <el-radio :label="item.accountId" >
                        <span v-if="item.username == undefined || item.username == ''">请先完善该账号信息</span>
                        <span v-else>{{item.username}}<span v-show="item.isDisabled == 1">&nbsp;&nbsp;该账号已被禁用</span></span>
                    </el-radio>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="chooseAccount" style="width:300px">确 定</el-button>
            </span>
        </el-dialog>

        <!--手机号登录没有关联账号提示  -->
        <el-dialog width="350px" top="300px"
            title="提示"
            :visible.sync="unassociatedVisible" center>
            <div class="tipBox">
                <div class="divStyle1">该手机号码尚未关联卧涛账号，请先去注册一个账号吧~</div>
                <div class="divStyle2">
                    <div class="reStyle">
                        <nuxt-link to="/register" rel="nofollow" v-if="extra_data">
                            <span class="go-register reStyle" >去注册></span>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!--账号密码登录未注册提示  -->
        <el-dialog width="350px" top="300px"
            title="提示"
            :visible.sync="unregistered" center>
            <div class="tipBox">
                <div class="divStyle1">该账号尚未注册，请先去注册一个账号吧~</div>
                <div class="divStyle2">
                    <div class="reStyle">
                        <nuxt-link to="/register" rel="nofollow" v-if="extra_data">
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
import { sendcode } from "@/api/register";
import {accountLogin,newLogin,chooseAccount, getSecurityCode,checkUser,getUserInfo,  embed} from "@/api/login";
import { getOnlineOrdersStatistics } from '~/api/order'
import CryptoJS from "crypto-js";

export default {
    layout: "empty",
    components: {
        regWrapper,
        vertify,
    },
    head() {
        return {
            title: "登录卧涛",
        };
    },
    data() {
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("手机号不能为空"));
            } else {
                checkUser(value).then((res) => {
                    if (res.data.data === 10003) {
                        return callback(new Error("该手机号码尚未注册"));
                    } else if (res.data.data === 10002) {
                        return callback(
                            new Error("该手机号码尚未绑定密码请使用快捷登录")
                        );
                    } else {
                        callback();
                    }
                }).catch(() => {
                    return false;
                });
            }
        };
        return {
            extra_data:true,//登录页面是否显示去注册按钮
            dialogVisible: false,
            securitydata: "",
            dialogAddVisible: false,
            associatedVisible: false,
            unassociatedVisible: false,
            unregistered:false,
            accountId:null,
            cdnPath: process.env.CDN_BASE_URL,
            cPath: process.env.PC_URL,
            qrcodeImg: "",
            fixStatus: false,
            fixShow: false,
            phoneStatus: false,
            phoneShow: false,
            ruleAgree: false,
            ruleShow: false,
            accountSlider: false,
            msgSlider: false,
            isVerify: false,
            msgVerify: false,
            showStatus: 0,
            time: 0,
            btntxt: "",
            disabled: false,
            securityButton:true,
            showMsgSlider: true,
            sliderMsgCheck: false,
            magSliderStatus: false,
            certification:false,
            orderCount:null,
            activeName: "message",
            qrscene:"",
            addForm: {
                code: "",
            },
            rRules: {
                phoneNumber: [
                    { required: true, message: "请填写正确的手机号", pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, trigger: "change",},
                ],
                code: [{ required: true, message: "请填写正确的验证码", trigger: "blur" ,pattern: /^\d{6}$/,}],
            },
            phoneRules: {
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/, message: "请输入6~16位字母、数字和符号两种以上组合密码", trigger: "blur",},
                ],
                username: [
                    { required: true, pattern: /^(?![0-9]+$)[a-zA-Z0-9]{4,16}$/, message: "请输入4~16位纯字母（或字母+数字组合）", trigger: "blur",},
                ],
            },
            wechatRules:{
               username: [{ required: true, message: "请输入4~16位纯字母（或字母+数字组合）", trigger: "blur", pattern:/^(?![0-9]+$)[a-zA-Z0-9]{4,16}$/}],
               password: [{ required: true, message: "密码错误请重新输入",  trigger: "blur",pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/,}]
            },
            msgRule: {
                agree: false,
            },
            ruleForm: {
                phoneNumber: "",
                code: "",
                agree: false
            },
            security:'',
            phoneForm: {
                username: "",
                password: "",
            },
            fixForm: {
                username: "",
                password: "",
            },
            fromLastPath: "",
            fullPath: "",
            timerLogin:"",
            thirdAccount: "",
            embedToken: '',
            datalist:{},
            len: 0
        };

    },
    mounted(){
        
    },
    beforeRouteEnter(to, from, next) {//路由前置守卫
        next(vm => {
            vm.fromLastPath = from.path;
            vm.fullPath = from.fullPath
        });
    },
    methods: {
        setMark(){
            this.$router.push('/register')
            if(sessionStorage.getItem('extra_data')){
                sessionStorage.setItem('embedPoint',sessionStorage.getItem('extra_data'));
            }
        },
        submitNewAdd() {
            if (this.activeName == "account") {
            this.usernameLogin();
            } else {
            this.loginMsg();
            }
        },
        // 微信登陆
        wechatLogin(){
            this.$router.push('/wechat')
        },
        fixPass(val) {
            if (val == true) {
                this.fixStatus = true;
                this.fixShow = false;
            }
        },
        phonePass(val) {
            this.accountSlider = val;
            if (val == true) {
                this.phoneStatus = true;
                this.phoneShow = false;
            }
        },
        checkChange(val) {
            if (val == true) {
                this.ruleAgree = false;
            }
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
        resetVerify() {
            this.accountSlider = false;
            this.isVerify = false;
            this.$nextTick(() => {
                this.isVerify = true;
            });
        },
        //手机号登录
        ruleLogin() {
            if (this.ruleForm.agree == false) {
                this.ruleAgree = true;
            } else {
                this.ruleAgree = false;
            }
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    if (this.ruleForm.agree == true) {
                        this.loginMsg();
                    }
                }
            });
        },
        //图形验证码
        getCode() {
            getSecurityCode().then((res) => {
                this.securitydata = res.data;
            });
        },
        // 手机号登录
        loginMsg() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    let param = {
                        mobile: this.ruleForm.phoneNumber,
                        authcode: this.ruleForm.code,
                    }
                    try {
                        if(sessionStorage.getItem('link')){
                            param.inviteCode = sessionStorage.getItem('link');
                        }
                    } catch (error) {
                        console.log(error);
                    };
                    newLogin(param).then((res) => {
                        if (res.data.code == 0) {
                            this.datalist = res.data.data;
                            this.len = res.data.data.list.length
                            this.dialogAddVisible = false;
                            if(this.len > 1){
                                this.datalist.list.forEach((item,index) => {
                                    if(item.isDisabled ==  1){
                                        this.$message({
                                            type: "warning",
                                            message: '该账号已被禁用',
                                            offset: 300,
                                        }); 
                                        return false
                                    }
                                    this.accountId = this.datalist.list[0].accountId;
                                    this.associatedVisible = true;
                                });
                                
                            }else{
                                this.datalist.list.forEach((item,index) => {
                                    if(item.isDisabled ==  1){
                                        this.$message({
                                            type: "warning",
                                            message: '该账号已被禁用',
                                            offset: 300,
                                        }); 
                                        return false
                                    }
                                    this.accountId = this.datalist.list[0].accountId;
                                    this.chooseAccount()
                                });
                            }
                        } else if(res.data.code == 10003){
                            this.unassociatedVisible = true; 
                        }else{
                            this.$message({
                                type: "warning",
                                message: res.data.msg,
                                offset: 300,
                            }); 
                        }
                         
                    }).catch((error) => {
                        // this.error = "服务器内部错误"
                        console.log(error);
                    });
                }
            });
        },

        // 选择关联账户
        chooseAccount(){
            let param = {
                accountId: this.accountId,
	            loginTemp: this.datalist.loginTemp
            }
            chooseAccount(param).then((res) => {
                if(res.data.code==0){
                    getUserInfo().then(res => {
                        let data = res.data.data
                        this.judge(data.username) && this.$router.push("/userLogin")
                        !this.judge(data.username) && this.$message({
                            type: "success",
                            message: '登录成功',
                            offset: 300,
                        }) && this.loginSuccessTo()
                        localStorage.setItem("userInfo", JSON.stringify(res.data.data));
                        this.$store.commit('SET_USERINFO',res.data.data);
                    }).catch(()=>{
                        return false;
                    })
                }else{
                    this.$message({
                        type: "warning",
                        message: res.data.msg,
                        offset: 300,
                    });
                }
            }).catch((error)=>{
                console.log(error)
            });
        },

        //登录成功前往的页面
        loginSuccessTo(){
            if(sessionStorage.getItem('productLink')){
                window.location.href = sessionStorage.getItem('productLink')
            }else if(sessionStorage.getItem('collectLink')){
                window.location.href = sessionStorage.getItem('collectLink')
            }else{
                location.href = "/";
            }
        },
        //账号密码登录
        usernameLogin() {
            this.$refs["phoneForm"].validate((valid) => {
                if (valid) {
                    accountLogin({
                        username: this.phoneForm.username,
                        password: CryptoJS.MD5(this.phoneForm.password).toString(),
                        captchaCode: this.security,
                    }).then((res) => {
                        if (res.data.code == 0) {
                            this.dialogAddVisible = false;
                            getUserInfo().then(res => {
                                localStorage.setItem('userInfo', JSON.stringify(res.data.data));
                                this.$store.commit('SET_USERINFO',res.data.data);
                                this.loginSuccessTo()
                            }).catch(()=>{
                                return false;
                            })
                        } else if (res.data.code == 10009) {
                                //登录频繁弹框进行二次操作
                                this.getCode();
                                this.dialogAddVisible = true;
                        }else if(res.data.code == 10003){
                                this.unregistered = true
                        }else if(res.data.code == 10007){
                                this.$message({
                                    type: "warning",
                                    message: '该账号已被禁用',
                                    offset: 300,
                                });
                        }else{
                            //其他登录异常情况给出提示
                            this.$message({
                                type: "warning",
                                message: res.data.msg,
                                offset: 300,
                            });
                        }                 
                        this.security = '';
                    }).catch((err)=>{
                        console.log(err)
                    });
                } else {
                    this.resetVerify();
                }
            });
        },
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
        //账号名判断
        judge(val){
            if(val == '' || val == null || val == undefined){
                return true
            }
            return false
        }
    },
    destroyed(){
        if(sessionStorage.getItem('point')){//清除注册跳转带过来的埋点信息id
            sessionStorage.removeItem('point');
        }else{

        };
        sessionStorage.removeItem('extra_data');
        this.embedPoint= '';//清除埋点信息
        clearInterval(this.timerLogin) //清除定时器
    },
    watch:{
        security(val, newval) {
            if(val.length>0){
                this.securityButton = false
            } else {
                this.securityButton = true
            }
        }
    }
};
</script>

<style lang="stylus" scoped>
.reStyle {
    padding:10px;
}
.radioStyle{
    display:block;
    margin:10px;
}
.radioStyle1{
    display:block;
    margin:10px;
    color:#C9C9C9;
}
.lineStyle {
    border-top:1px solid #eee;
}
.over {
    overflow-y: scroll;
    height: 275px;
}
.height1 {
    height:520px;
}
.height2 {
    height:480px;
}
.user-agreement {
    width: 90%;
    margin-left: 12px;
    margin-top: 6px;
    margin-bottom: -7px;
    padding-left:0;
}
.user-register{
    color: #36a6fe;
    font-size: 13px;
    text-decoration: none;
    margin-left: -8px;
}
.statement{
    color: #409eff;
    text-decoration: none;
}
.checked {
    font-size: 12px;
    color: #f56c6c;
    margin: 5px 0 0 30px;
}
.login1{
    margin-left: 31px;
}
.tel_input{
    width:410px;
    height:50px;
    border:1px solid rgba(184, 184, 184, 1);
    outline:none;
    padding-left:30px;
    font-size:14px;
    overflow: hidden;
    white-space:nowrap; 
    text-overflow:ellipsis;
}
.fontStyle{
   color:#B8B8B8;
}
.and {
    color: #b8b8b8;
    margin: 0 -6px;
    font-size: 13px;
}
.protect {
    color: #409eff;
    font-size: 13px;
    margin-left: 0px;
}
.no-account{
    color: #b8b8b8;
}
.go-register{
    color: #409eff;
}
.toogle{
    display:block;
    margin-right: 40px;
    color: #409eff;
    margin-top:-12px;
    float:right;
}
.forget {
    margin-top: 6px;
    margin-right: 35px;
    margin-bottom: -5px;
}
.forget-password{
    color: #409eff;
}
.forget-password:hover{
    cursor:pointer;
}
.login2{
    margin-left: 31px;
}
.login3{
    color:#B8B8B8;
    font-size:12px;
    margin-top:2px;
}
.slideStyle {
    font-size: 12px;
    color: #f56c6c;
    margin-top: 2px;
    margin-left: 30px;
}
.slide-check {
    margin-left: 30px;
}
.codeBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin:0 20px;
}
.codeinput {
    width:280px;
    height:40px;
    padding-left:30px;
}
.get-code{
    display: inline-block;
    height: 48px;
    width: 110px;
    background: #f3f4f8;
}
.pwd_input{
    width:410px;
    height:48px;
    border:1px solid rgba(184, 184, 184, 1);
    outline:none;
    padding-left:30px;
    font-size:14px;
    overflow: hidden;
    white-space:nowrap; 
    text-overflow:ellipsis;
}
.imgStyle {
    height: 48px;
    width: 110px;
    cursor: pointer;
}
.code_input{
    width:300px;
    height:48px;
    border:1px solid rgba(184, 184, 184, 1);
    outline:none;
    padding-left:30px;
    font-size:14px;
    overflow: hidden;
    white-space:nowrap; 
    text-overflow:ellipsis;
}
.centerText {
    text-align: center;
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
.make-sure {
    width: 100px;
    height: 40px;
}
input:focus{
    border:1px solid #36A6FE;
    outline:#36A6FE;
    // padding-left:30px;
}
.for-safe-title{    
    display: flex;
    align-items: center;
    margin: 50px 0;
}
.for-safe-title h3{
    text-align: center;
    color: #333;
    font-size: 22px;
    font-weight: 500;
    line-height: 40px;
    margin-left: 10px;
}
.safe-icon{
    width: 36px;
    margin-left: 40px;
}
.safe-icon img{
    width: 100%;
}
.safe-button{
    // margin: 30px 0 0 30px;
    width: 410px;
    height: 46px;
    margin: 40px 0 60px 30px;
    font-size: 12px;
}
.safe-button :hover{
    background: #409eff;
}
.third-login{
    width: 85%;
    height: 78px;
    margin: 0 auto;
    margin-top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.third-login .wrapper_inner {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2px;
}
.third-login .wrapper_inner > span:nth-of-type(1) {
    display: inline-block;
    width: 166px;
    height: 0px;
    border-top: 1.5px dotted rgba(184, 184, 184, 1);
    opacity: 0.7;
}
.third-login .wrapper_inner > span:nth-of-type(2) {
    display: inline-block;
    width: 166px;
    height: 0px;
    border-top: 1.5px dotted #b8b8b8;
    opacity: 0.7;
}
.third-login img {
    width: 34px;
    height: 34px;
    border-radius: 25px;
    opacity: 1;
    color: #fff;
    margin: 0 13px;
    cursor: pointer;
}
.myradiogroup .el-radio__input.is-checked + .el-radio__label {
  color: #4B4949 !important;
}
.bindAuth{
    display: flex;
    align-items: center;
    margin-left: 50px;
    margin-top:-20px;
    font-weight:bold;
    font-size:15px;
    color:#333333;
}
.authInfo{
    margin-left: 50px;
    margin-top:25px;
}
</style>

<style lang="stylus">
.wt_login {
    position: relative;
}
.wt_login .login_er {
    cursor: pointer;
    position: absolute;
    right: 0px;
    top: 0px;
}
.wt_login .el-form-item__error {
    left: 30px;
}
.login_wrapper {
    position: absolute;
    right: 398px;
    top: 165px;
    width: 480px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;
}

.login_wrapper .login .el-tabs__nav {
    margin-left: 35px;
    margin-top: 60px;
}

.login_wrapper .login .el-tabs__item {
    font-size: 22px !important;
    padding-left: 114px;
}

.login_wrapper .login .el-tabs__nav-wrap::after {
    height: 0;
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
    background: rgba(54, 166, 254, 1);
    opacity: 1;
    right: 40px;
    border: none;
    border-radius: 2px;
    color: #fff;
    font-size: 16px;
}
.code_button:hover {
    background: #409eff;
    color: #fff;
}
.el-dialog__body {
  padding: 0 0 0 0 !important;
}
.re-button {
    width: 410px;
    height: 46px;
    background: rgba(54, 166, 254, 1);
    opacity: 1;
    margin-left: 30px;
    font-family: "Microsoft YaHei";
    margin-top: 20px;
    border-radius: 2px;
    font-size: 18px;
}
.to_register {
    min-height:30px;
    font-size: 14px;
    float: right;
    margin-top: 10px;
    margin-right: 40px;
}
.to_register a {
    text-decoration: none;
    color: #666666;
}
.wrapper_er {
    width: 85%;
    height: 78px;
    margin: 0 auto;
    margin-top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.sm_top {
    margin-top: 10px;
    height: 35px;
    color: #5f6365;
    font-size: 14px;
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.sm_top_point {
    display: inline-block;
    width: 11px;
    height: 11px;
    border-left: 2px solid #86898b;
    border-bottom: 2px solid #86898b;
    transform: rotate(45deg);
    margin-left: 28px;
    cursor: pointer;
}
.sm_top_point:hover {
    border-color: #36a6fe;
}
.sm_top_skip {
    margin-right: 310px;
    cursor: pointer;
}
.sm_top_skip:hover {
    color: #36a6fe;
}
.sm_top_cancel {
    display: inline-block;
    font-size: 34px;
    transform: rotate(45deg);
    margin-right: 12px;
    cursor: pointer;
}
.sm_content {
    height: 340px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.wechat-qrcode{
    width: 500px;
}
.wechat-qrcode img {
    width: 100%;
}
.wechat-foot{
    font-size: 14px;
    color: #666;
    margin-top: 14px;
    text-align:center;
}
.content_wx {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    color: #333;
}
.content_wx img {
    width: 16px;
    height: 16px;
    margin: 6px 6px 0 0;
}
.img_location {
    position: absolute;
    top: 50%;
    transform: translateY(-53%);
    left: 37px;
    z-index: 4;
}

.close_find {
    width: 410px;
    height: 40px;
    background: #fff;
    position: absolute;
    top: -132px;
    text-align: center;
    font-size: 16px;
    line-height: 40px;
}
.close_find span {
    position: absolute;
    right: 5px;
    bottom: 1px !important;
    font-size: 40px;
    cursor: pointer;
    transform: rotate(45deg);
}
.del-box{
    background #FFFFFF
    position fixed
    top 25%
    left 35%
    z-index 9999
    width 458px
    padding-bottom 16px
    border-radius 5px
    color #333333
    overflow hidden
    .del-title{
      font-size 20px
      line-height 58px
      background #eef5f8
      text-align center
    }
    .del-content{
      font-size: 16px
      text-align: center
      padding 40px 60px
    }
    .del-btn{
      margin-left 112px
      text-align center
      display flex
      .cancel-del-btn{
        width 102px
        height 40px
        margin-right 20px
        border-radius 3px
        font-size 16px
        line-height 40px
        text-align center
        color #FFFFFF
        background #36A6FE
        cursor pointer
      }
      .confirm-del-btn{
        color #666
        background rgb(224,242,251)
      }
    }
  }
  .del-box img{
    width 16px
    height 16px
    position absolute
    right 21px
    top 21px
    cursor pointer
  }
  .wid {
      width 300px
  }
</style>