<template>
    <div class="wt_login">
        <reg-wrapper></reg-wrapper>
        <!-- 微信扫码登录 -->
        <div class="login_wrapper height2">
            <div class="sm_top">
                <span class="sm_top_point" @click="otherLogin"></span>
                <span class="sm_top_skip" @click="otherLogin">其他登录方式</span>
                <span class="sm_top_cancel" @click="otherLogin">+</span>
            </div>
            <div class="sm_content">
                <iframe :src="qrcodeImg" frameborder="0" scrolling="no"   width="100%" height="100%" sandbox="allow-scripts allow-top-navigation allow-same-origin"></iframe>
            </div>
                <p class="wechat-foot">扫码关注“卧涛科技”公众号进行登录</p>
        </div>
    </div>
</template>
<script>
import vertify from "~/components/login/vetify";
import regWrapper from "~/components/login/regWrapper";
import {getQrcode, checkWechatLogin, embed} from "@/api/login";

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
            cdnPath: process.env.CDN_BASE_URL,
            cPath: process.env.PC_URL,
            qrcodeImg: "",
            time: 0,
            btntxt: "",
            disabled: false,
            fromLastPath: "",
            timerLogin:"",
            embedToken: '',
            radioValue:1,
            unionId:"",//微信公众平台unionId
            wxaccountId:null,
            accountList:[],
            wxassociatedVisible:false,
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
        // 获取二维码
        useWechat(){
            getQrcode({type:1}).then((res) => {  
                this.qrcodeImg = res.data.data;   
            }).catch((err)=>{
                console.log(err)
            });
        },
    },
    mounted(){
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
        this.useWechat();
    },
    destroyed(){
        if(sessionStorage.getItem('point')){//清除注册跳转带过来的埋点信息id
            sessionStorage.removeItem('point');
        }else{

        };
        sessionStorage.removeItem('extra_data');
        this.embedPoint= '';//清除埋点信息
    },
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