<template>
  <div class="safe_set">
     <!-- 绑定微信二维码 -->
    <el-dialog :before-close="handleClose" :visible.sync="bindVisible" width="420px" top="300px" center :close-on-click-modal="false">
      <span class="out-img"> 
        <iframe :src="qrcodeImg" frameborder="0" scrolling="no"   width="420" height="340" sandbox="allow-scripts allow-top-navigation allow-same-origin"></iframe>
      </span>
      <span slot="footer" class="dialog-footer font-footer"></span>
    </el-dialog>
    
    <!-- 账号信息 -->
    <div v-if="setStatus == 0">
      <div class="accountInfo">
        <div class="tab_head">
          <span></span>
          <span>账号信息</span>
        </div>
        <el-form :model="ruleForm"  size="medium" label-width="120px">
          <el-form-item label="账号名：" prop="username">
            <el-input  v-model.trim="userInfo.username" disabled class="wid"></el-input>
          </el-form-item>
          <el-form-item label="登录密码：" prop="password">
            <el-input type="password" v-model.trim="ruleForm.password" disabled class="wid" show-password></el-input>
            <span class="changePwd" @click="setStatus = 2" v-if="userInfo.isManager == 1">修改密码</span>
          </el-form-item>
        </el-form>
      </div>
      <!-- 授权信息 -->
      <div class="accountInfo" v-show="userInfo">
        <div class="tab_head">
          <span></span>
          <span>授权人信息</span>
            <div class="attestation-low" v-if="userInfo.authorizedType == 1">初级授权</div>
            <div class="attestation-high" v-if="userInfo.authorizedType == 2">高级授权</div>
          <span class="authText" v-if="userInfo.status == 0 || userInfo.status == 1 || userInfo.status == 4">(授权账号可用于快捷登录)</span>
          <span class="authText" v-else>(第三方账号可用于快捷登录)</span>
        </div>
        <div>
          <div class="authStyle">
            <span class="authInfo">授权人信息</span>
            <span class="authColor" v-show="userInfo.authorizedType == 1 || userInfo.authorizedType == 2" @click="toModify()">修改授权人信息</span>
          </div>
          <div class="userStyle">
            <span class="authtext" style="margin-right: 10px">联系人:</span>
            <span v-if="!userInfo.authorizedType">
              <span class="info">/</span>
              <el-button type="primary" plain class="btn1" @click="goAuth()">去授权</el-button>
            </span>
            <span v-else-if="userInfo.authorizedType == 1">
              <span class="info">{{userInfo.personName}}</span>
            </span>
            <span v-else>
                <span class="info">{{userInfo.personName}}</span>
                <el-button type="primary" plain class="btn1" @click="toModify()">授权中</el-button>
            </span>
          </div>
          <div class="userStyle">
            <span class="authtext">手机授权：</span>
            <span class="info">{{userInfo.mobile}}</span>
            <el-button type="text" class="btn2" @click="setStatus = 1" v-show="userInfo.status == 0 || userInfo.status == 1 || userInfo.status == 4">修改手机号码</el-button>
          </div>
          <div class="bind-icon-contain">
            <span class="authtext">微信授权：</span>
            <div v-if="userInfo.wxBindFlag == true" class="bind-icon-item">
              <!-- <img src="@/assets/images/login/icon_wet_login.png" class="wx-icon-sty" /> -->
              <img :src="userInfo.avatar" class="wx-icon-sty" />
              <span class="spanSty1">{{userInfo.nickname}}</span>
              <el-link @click="checkVisible = true" type="primary" class="bind-link" :underline="false">/解绑</el-link>
            </div>     
            <div v-else class="bind-icon-item">
              <img src="@/assets/images/login/icon_wet_unlogin.png" class="wx-icon-sty" />
              <span class="spanSty2">{{userInfo.nickname}}</span>
              <el-link @click="useWechat" type="primary" class="bind-link" :underline="false">/绑定</el-link>
            </div>  
          </div>
        </div>
      </div>
    </div>
    
    <!-- 手机号完整性校验 -->
    <div class="unwechat_wrapper" v-show="checkVisible">
        <div class="for-safe-title">
            <img src="@/assets/images/login/close.png" alt="" width="16" height="16" class="close_img" @click="closeDialog">
            <div class="safe-icon"><img src="@/assets/images/login/icon01_login@2x.png" alt /></div>
            <h3>为了您的账号安全，请完善身份信息</h3>
        </div>
        <div>
            <div class="authInfo">
              <el-form :model="phoneForm"  size="medium" :rules="phoneRules" ref="phoneForm">
                <el-form-item prop="invisiblePhone">
                    <el-input  v-model="userInfo.mobile" disabled class="wid"></el-input>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input class="wid" v-model="phoneForm.phone" placeholder="请输入完整手机号码"></el-input>
                </el-form-item>
                </el-form>
            </div>
            <el-button class="safe-button" type="primary" @click="checkMobile">确认</el-button>
        </div>
    </div>

    <!-- 内容区域 -->
    <set-phone :userInfo="userInfo" v-if="setStatus == 1" :status="setStatus" @handle="handle"></set-phone>
    <set-pwd :userInfo="userInfo" v-if="setStatus == 2" :status="setStatus" @handle="handle"></set-pwd>
  </div>
</template>

<script>
import { getUserDetail ,wxUnbind, checkMobile} from "@/api/member";
import * as CodeMsg from "@/api/CodeChange"
import {
  getQrcode,
  delWechatBind,
  checkWechatLogin,
  bindWechat,
} from "@/api/login";
import setPwd from "./setPwd";
import setPhone from "./setPhone";
export default {
  components: {
    setPwd,
    setPhone,
  },
  data() {
    return {
      qrcodeImg: "",
      userInfo: {},
      setStatus: 0,
      bindVisible: false,
      checkVisible: false,
      timerLogin: "",
      thirdAccount: "",
      ruleForm:{
        username:"",
        password:"**********",
      },
      phoneForm:{
        invisiblePhone:"",
        phone:""
      },
      phoneRules:{
          invisiblePhone:[{requird:true,}],
          phone:[{requird:true, message: "手机号码格式错误",trigger: "blur",pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,}]
      },
    };
  },
  methods: {
    // 关闭弹窗时
    handleClose(){
      this.bindVisible = false
    },
    closeDialog(){
      this.checkVisible = false
      this.phoneForm.phone = ''
    },
    // 去授权
    goAuth(){
      this.$router.push({
        path: "/member/authentication",
      });
    },
    // 修改授权人信息
    toModify(){
      this.$router.push('/member/auth-info');
    },
    // 获取微信二维码
    useWechat() {
      this.bindVisible = true;
      getQrcode({type:2}).then((res) => {     
          this.qrcodeImg = res.data.data;   
      }).catch((err)=>{
          console.log(err)
      });
    },
    getUserInfo() {
      getUserDetail().then((res) => {
        if(res.data.code != CodeMsg.CODE_0){
          if(res.data.code == 10002){
            localStorage.removeItem('userInfo');
            location.href = "/login";
          }else{
            this.$message({
              type:"warning",
              message:res.data.msg,
              offset:300,
              duration: 2000
            })
          }
          return false
        }
        this.phoneForm.invisiblePhone = this.filterMobile(res.data.data.mobile);
        this.userInfo = res.data.data;
      });
    },
    handle(str){
      this.setStatus = str;
      this.getUserInfo();
    }, 
    // 手机号完整性校验
    checkMobile(){
      this.$refs["phoneForm"].validate((valid) => {
      if (valid) {
        checkMobile({mobile:this.phoneForm.phone}).then(res=>{
          if(res.data.code !== CodeMsg.CODE_0){
            this.$message({
              type:'error',
              message: res.data.msg,
              offset: 300,
              duration: 1500
            })
            this.$router.push({
              path:"/member/account",
              query:{
                showIndex:1,
              }
            })
            return false;
          }
          this.wxUnbind();
        }).catch(error=>{
          console.log(error)
        })
       }
      });
    },
    // 解绑
    wxUnbind(){
      this.$confirm("解除绑定后您将无法使用该第三方账号登录及接收通知", "解除绑定", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        }).then(()=>{
          wxUnbind().then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.checkVisible = false;
            this.$message({
              type:'success',
              message: '解绑成功',
              offset: 300,
              duration: 1500
            })
            setTimeout(()=>{
              this.getUserInfo()
            },1000)
          }else{
            this.$message({
              type:'warning',
              message: res.data.msg,
              offset: 300,
              duration: 1500
            })
          }
        })
      }).catch(() => {
        this.closeDialog()
      })
    },
    // 授权中状态跳转第三方页面
    toThird(){
      location.href = this.userInfo.authUrl;
    },
    filterMobile(value) {
      if (value) {
        var reg = /^(\d{3})\d*(\d{4})$/;
        var str = value.replace(reg, "$1****$2");
        return str;
      }
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>

<style scoped>
.safe_set {
  padding-bottom: 100px;
  overflow: hidden;
  font-family: "Microsoft YaHei";
}
.tab_head {
  margin-top: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 400;
  margin-bottom: 15px;
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
.accountInfo {
  margin-top: 30px;
  margin-left: 25px;
}
.text {
  display: inline-block;
  height: 18px;
  vertical-align: middle;

}
.changePwd {
  display: inline-block;
  color: #3da1ff;
  font-size: 14px;
  margin-left: 15px;
}
.changePwd:hover {
  cursor: pointer;
}
.wid {
  width: 300px;
}
.authText {
  color: #999999;
  line-height: 30px;
}
.authInfo {
  font-size: 14px;
  font-weight: bold;
  color: #3c3c3c;
}
.authColor {
  margin-left: 20px;
  font-size: 14px;
  color: #3da1ff;
}
.authColor:hover {
  cursor: pointer;
}
.authtext {
  font-size: 14px;
  color: #4b4949;
}
.info {
  color:#888888;
  height: 30px;
}
.btn1 {
  margin-left: 20px;
}
.btn2 {
  margin-left: 20px;
}
.info + .btn1 {
  padding:5px 15px;
}
.info + .btn1:hover {
  padding:5px 15px;
  color: #409EFF;
  background: #ecf5ff;
  border-color: #b3d8ff;
  cursor: auto;
}
.set_index {
  margin-top: 50px;
  margin-left: 100px;
}
.wechat-qrcode {
  width: 240px;
  margin-left: 18%;
}
.btn-custom-cancel {
  float: right;
  margin-left: 10px;
}
.new-bind {
  font-size: 14px;
  color: #666666;
  margin-left: -14px;
}
.bind-icon-contain{
  margin-top: 15px;
  padding-left: 50px;
}
.wx-icon-sty{
  width: 24px;
  height: 24px;
  margin-right: 10px;
  vertical-align: middle;
}
.bind-icon-item{
  display: inline-block;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
}
.bind-link{
  margin-left: 5px;
}
.wid>>>.el-input__inner {
  padding:0 30px !important;

}
.safe_set > .unwechat_wrapper {
    position: absolute;
    left: 320px;
    top: 180px;
    width: 480px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;
}
.for-safe-title{    
    display: flex;
    align-items: center;
    margin: 50px 0;
    position: relative;
}
.for-safe-title h3{
    text-align: center;
    color: #333;
    font-size: 22px;
    font-weight: 500;
    line-height: 40px;
    margin-left: 10px;
}
.close_img {
   position: absolute;
   top:-30px;
   right: 10px;
}
.safe-icon{
    width: 36px;
    margin-left: 40px;
}
.safe-icon img{
    width: 100%;
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
.safe-button{
    /* margin: 30px 0 0 30px; */
    width: 410px;
    height: 46px;
    margin: 40px 0 60px 30px;
    font-size: 12px;
}
.safe-button :hover{
    background: #409eff;
}
.userStyle {
  margin-left:50px;
  height:40px;
  line-height:40px;
}
.authStyle {
  height:40px;
  line-height:40px;
}
.spanSty1 {
   color:#3DA1FF;
}
.spanSty2 {
  color: #999999;
}
.attestation-low{
  width: 68px;
  height: 24px;
  background: #e2860f;
  border-radius: 12px;
  font-size: 10px;
  color: #fff;
  line-height: 24px;
  font-weight: 700;
  text-align: center;
  margin: 0 10px;
}
.attestation-high{
  width: 68px;
  height: 24px;
  border-radius: 12px;
  background: #0f54e2;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  line-height: 24px;
  text-align: center;
  margin: 0 10px;
}
</style>