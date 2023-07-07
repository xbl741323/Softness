<template>
    <div class="wt_login" v-loading="loading">
        <reg-wrapper></reg-wrapper>
        <!-- 微信绑定账号登录  -->
        <div class="info_wrapper" v-if="showStatus == 1">
            <div class="for-safe-title">
                <div class="safe-icon"><img src="@/assets/images/login/icon01_login@2x.png" alt /></div>
                <h3>为了实现快捷登录，请先绑定一个账号</h3>
            </div>
            <div>
                <el-form :model="fixForm" class="input-wrapper" ref="fixForm" :rules="wechatRules">
                    <el-form-item prop="username">
                        <img  class="img_location" src="@/assets/images/login/icon_user.png" alt />
                        <el-input v-model.trim="fixForm.username" placeholder="请输入账号名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <img class="img_location" src="@/assets/images/login/icon_lock.png" alt />
                        <el-input v-model.trim="fixForm.password" placeholder="请输入登录密码"  show-password></el-input>
                    </el-form-item>
                </el-form>
                    <span class="toogle forget-password" @click="otherLogin">切换其他登录方式</span>
                    <el-button class="safe-button" type="primary" @click="fixLogin">下一步</el-button>
            </div>
        </div>
        <!-- 授权信息绑定 -->
        <div class="info_wrapper" v-if="showStatus == 2">
            <div class="for-safe-title">
                <div class="safe-icon"><img src="@/assets/images/login/icon01_login@2x.png" alt /></div>
                <h3>为了实现快捷登录，请先绑定一个账号</h3>
            </div>
            <div>
                <div class="bindAuth">请选择一个授权信息进行绑定</div>
                <div class="authInfo">
                    <el-radio-group v-model="account" class="radioStyle1 myradiogroup" v-for="(item,index) in userList" :key="index">
                        <el-radio :label="item.accountId"  class="radioStyle1" :disabled="item.wxBindFlag">{{item.mobile}}&nbsp;&nbsp;<span style="color:#3DA1FF;font-size:12px;" v-if="item.wxBindFlag">已绑定微信</span></el-radio>
                    </el-radio-group>
                </div>
                <el-button class="safe-button" type="primary" @click="wxBindLogin">确认</el-button>
            </div>
        </div>

        <!-- 微信登录选择关联账号 -->
        <el-dialog width="450px" top="300px"
            title="选择一个关联账号登陆"
            :visible.sync="wxassociatedVisible"
            center >
            <div class="lineStyle">
                <el-radio-group v-model="accountId" v-for="(item,index) in accountList" :key="index" class="radioStyle">
                    <el-radio :label="item.accountId" >{{item.username}}</el-radio>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"  class="wid" @click="chooseAccount">确 定</el-button>
            </span>
        </el-dialog>

        <!--手机号登录没有关联账号提示  -->
        <el-dialog width="350px" top="300px"
            :before-close="handleClose"
            title="提示"
            :visible.sync="unassociatedVisible" center>
            <div class="tipBox">
                <div class="divStyle1">该账号不存在，请使用其他账号或去注册一个吧~</div>
                <div class="divStyle2">
                    <div class="reStyle">
                        <nuxt-link to="/register" rel="nofollow">
                            <span class="go-register reStyle" >去注册></span>
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
import { wechatLogin, getSecurityCode,getUserInfo, wxBindLogin,wxBind, embed,chooseAccount} from "@/api/login";
import { getOnlineOrdersStatistics } from '~/api/order'
import CryptoJS from "crypto-js";
import * as CodeMsg from "@/api/CodeChange"

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
        return {
            extra_data:true,//登录页面是否显示去注册按钮
            embedPoint: '',//收藏下载转登录
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
            wechatRules:{
               username: [{ required: true, message: "请输入4~16位纯字母（或字母+数字组合）", trigger: "blur", pattern:/^(?![0-9]+$)[a-zA-Z0-9]{4,16}$/}],
               password: [{ required: true, message: "密码错误请重新输入",  trigger: "blur",pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/,}]
            },
            security:'',
            fixForm: {
                username: "",
                password: "",
            },
            fromLastPath: "",
            embedToken: '',
            datalist:{},
            state:"",
            unionId:"",//微信公众平台unionId
            accountList:[],
            userList:[],
            wxassociatedVisible:false,
            loading:true,
            loginTemp:'',
            state:'',
            code:'',
            account:null
        };

    },
    beforeRouteEnter(to, from, next) {//路由前置守卫
        next(vm => {
            vm.fromLastPath = from.path;
        });
    },
    methods: {
        // 其他登录方式
        otherLogin(){
            this.$router.push("/login")
        },
        // 微信授权登录
        wechatLogin() {
            let params = {
                state:this.state == '' ? '':this.state,
                code:this.code == '' ? '':this.code,
            }
            wechatLogin(params).then((res) => {  
                if(res.data.code == CodeMsg.CODE_0){
                    this.loading = false;
                    if(res.data.data.status == 0){
                        res.data.data.accountList.forEach(item=>{
                            this.accountId = item.accountId;
                        })
                        this.accountList = res.data.data.accountList;
                        this.unionId = res.data.data.unionId;
                        this.loginTemp = res.data.data.loginTemp;
                        if(this.accountList.length > 1){
                            this.wxassociatedVisible = true;
                        }else{
                            this.chooseAccount()
                        }
                    }else if(res.data.data.status == 2){
                        this.showStatus = 1;
                        this.unionId = res.data.data.unionId;
                    }else{
                        this.$router.push("/wechat");
                    }
                }
            }).catch((error)=>{
                console.log(error)
            });
        },
        //微信绑定账号登录-账号名密码校验    
        fixLogin(){
            this.$refs["fixForm"].validate((valid) => {
            if (valid) {
                let params = {
                    password: CryptoJS.MD5(this.fixForm.password).toString(),
                    username: this.fixForm.username
                }
                wxBind(params).then((res) => {
                    if (res.data.code !== CodeMsg.CODE_0) {
                        if(res.data.code == 10003){
                            this.unassociatedVisible = true;
                            return false;
                        }
                        //失败情况做判断
                        this.$message({
                            type: "warning",
                            message: res.data.msg,
                            offset: 300,
                            duration: 1500
                        });
                        return false;
                    }
                    this.showStatus = 2;
                    this.userList = res.data.data;
                    res.data.data.forEach(item => {
                        if(!item.wxBindFlag ){
                            this.account = item.accountId;
                        }
                    });
                }).catch((error)=>{
                    console.log(error)
                });
            }
           });
    
        },

        //微信绑定账号登录
        wxBindLogin(){
            let params = {
                accountId:this.account,
                unionId:this.unionId
            }
            wxBindLogin(params).then((res) => {
                if(res.data.code == CodeMsg.CODE_0){
                    this.$message({
                        type: "success",
                        message: '登录成功',
                        offset: 300,
                        duration: 1500
                    });
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
                     //失败情况做判断
                    this.$message({
                        type: "warning",
                        message: res.data.msg,
                        offset: 300,
                        duration: 1500
                    });
                }
            }).catch((error)=>{
                console.log(error)
            })
                
            
        },
        // 选择关联账户
        chooseAccount(){
            let param = {
                accountId: this.accountId ,
	            loginTemp: this.loginTemp
            }
            chooseAccount(param).then((res) => {
                if(res.data.code == CodeMsg.CODE_0){
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
                        duration: 1500
                    });
                }
            }).catch((error)=>{
                console.log(error)
            });
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
        //图形验证码
        getCode() {
            getSecurityCode().then((res) => {
                this.securitydata = res.data;
            });
        },
        //登录成功前往的页面
        loginSuccessTo(){
            if(sessionStorage.getItem('productLink')){
                window.location.href = sessionStorage.getItem('productLink')
            }else{
                location.href = "/";
            }
        },
        handleClose(){
            this.unassociatedVisible = false;
        },
        //账号名判断
        judge(val){
            if(val == '' || val == null || val == undefined){
                return true
            }
            return false
        }

    },
    created(){
        this.state = this.$route.query.state;
        this.code = this.$route.query.code;
    },
    mounted(){
        this.wechatLogin();
        if(sessionStorage.getItem('point')){
            this.embedToken = sessionStorage.getItem('point');
        }else{

        };
        if(sessionStorage.getItem('extra_data')){
            this.extra_data = false;
            if(sessionStorage.getItem('extra_data') == '/collection/add'){
                this.embedPoint = 3;//收藏转登录
                this.embedToken = 'collection';
            }else{
                this.embedPoint = 4;//下载转登录
                this.embedToken = 'download'
            }
        }else{
            this.extra_data = true;
        };
    },
    destroyed(){
        if(sessionStorage.getItem('point')){//清除注册跳转带过来的埋点信息id
            sessionStorage.removeItem('point');
        }else{

        };
        sessionStorage.removeItem('extra_data');
        this.embedPoint= '';//清除埋点信息
    },
    watch:{
        security(val, newval) {
            if(val.length>0){
                this.securityButton = false
            } else {
                this.securityButton = true
            }
        },
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
    color:#4B4949;
}
.lineStyle {
    border-top:1px solid #eee;
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
   color: #999999;
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
.info_wrapper {
    position: absolute;
    right: 398px;
    top: 165px;
    width: 480px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;
}

.info_wrapper .login .el-tabs__nav {
    margin-left: 35px;
    margin-top: 60px;
}

.info_wrapper .login .el-tabs__item {
    font-size: 22px !important;
    padding-left: 114px;
}

.info_wrapper .login .el-tabs__nav-wrap::after {
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