<template>
  <div class="wrapper">
      <top-header />
      <div class="content">
          <welcome />
          <div class="handle">
              <h3>账号注册</h3>
               <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm home-input-wrapper">
                <el-form-item prop="username">
                    <img class="img_location" src="@/assets/images/register/icon_user.png" alt/>
                    <el-input v-model.trim="ruleForm.username" placeholder="请输入4~16位纯字母（或字母+数字组合）" ></el-input>
                </el-form-item>
                <el-form-item prop="mobilePhone">
                    <img class="img_location" src="@/assets/images/register/icon_phone.png" alt/>
                    <el-input v-model="ruleForm.mobilePhone" placeholder="请输入绑定的手机号码" clearable></el-input>
                </el-form-item>
                <el-form-item prop="code" class="code">
                  <i class="iconfont input-icon">&#xe6a1;</i>
                  <el-input placeholder="请输入验证码" v-model="ruleForm.code" maxlength="6"></el-input>
                  <el-button size="mini" class="code-button"  @click="sendMsg" :disabled="codeDisabled"  v-if="codeDisabled==false">发送验证码</el-button>
                  <el-button class="code-button" @click="sendMsg" :disabled="codeDisabled" v-if="codeDisabled==true">{{btntxt}}</el-button>
                </el-form-item>
                <el-form-item prop="pwd">
                    <img class="img_location" src="@/assets/images/register/icon_lock.png" alt/>
                    <el-input type="password" v-model.trim="ruleForm.pwd" placeholder="请输入6~16位字母加数字或符号的组合密码" onkeyup="this.value=this.value.replace(/[, ]/g,'')" show-password></el-input>
                </el-form-item>
                <el-form-item prop="check">
                    <el-checkbox v-model="ruleForm.check">注册后自动登录</el-checkbox>
                </el-form-item>
              </el-form> 
              <button class="handle-button" @click="handleRegist" :disabled="this.btn">注 册</button>
              <div style="text-align: center; color: #999; margin-top: .32rem; font-size: .34rem">注册代表您同意 
                <a style="font-size: .32rem; color: #409EFF" rel="nofollow" @click="toAgreement">《用户注册协议》</a>和 
                <a style="font-size: .32rem; color: #409EFF" rel="nofollow" @click="toPrivacy">《隐私保护声明》</a>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { sendCode, phoneRegist, checkUsernameExist,userRegister,getUserInfo } from "@/api/login";
import * as CodeMsg from "@/api/CodeMsg";
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { Toast } from 'mint-ui';
import topHeader from '~/components/common/topHeader'
import welcome from '~/components/common/welcome'
import wechat from '~/components/common/wechatLogin'
import {toWx} from '@/utils/toWx'
export default {
  layout: "empty",
  components: {
    topHeader,
    welcome,
    wechat
  },
  head () {
    return {
      title: this.title,    
      phone:'',
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  },
  data(){
    var checkUsername = (rule, value, callback) => {
        if (value=='' && value==null) {
            return callback(new Error("账户名不能为空"));
        } else {
            checkUsernameExist(value).then((res) => {
                if (res.code === 0) {
                    this.btn = false;
                    callback();
                } else {
                    this.btn = true;
                    return callback(new Error("该用户名已被注册，请换个试试吧~"));
                }
            })
        }
      };
    var checkPassword = (rule, value, callback) => {        
        if (value) {
          if (/[\u4E00-\u9FA5]/g.test(value)) {
            return callback(new Error('密码不能输入汉字!'));
          } else {
            callback();
          }
       }
    };
    return {
      embedPoint: '',
      title:"注册账号",
      ruleForm:{
        check:true,
      },
      codeTime:0,
      codeDisabled:false,
      btntxt:'',
      btn: false,
      rules: {
        username: [
          { required: true, message: "请输入账号名", trigger: "blur" },
          { pattern: /^[A-Za-z][A-Za-z0-9]{3,15}$/,  message: '请输入4~16位纯字母（或字母+数字组合）', trigger: 'blur' },
          { validator: checkUsername,trigger: "blur" }
        ],
        mobilePhone: [
          {required: true, pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, message: "请输入正确的手机号码", trigger: "change"},
        ],
        code: [
          {required: true, pattern: /^\d{6}$/, message: "请输入正确的验证码", trigger: "change"},
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z][0-9A-Za-z_-`!@#$%^&*()\[\]{}<>\\|/?,.:"']{5,15}$/,  message: '请输入6~16字母加数字或符号组合密码', trigger: 'blur' },
          // { validator: checkPassword,trigger: "blur" }
        ],
      },
    };
  },
  methods:{  
    // 发送验证码
    sendMsg() {  
          let phonePass;
          this.$refs["ruleForm"].validateField("mobilePhone", (valid) => {
              phonePass = valid;
          });
          if (!phonePass) {
            sendCode(this.ruleForm.mobilePhone).then(res=>{
              if(res.code !== CodeMsg.CODE_0){ 
                Toast({
                  message: res.msg,
                  position: 'middle',
                  duration: 3000
                }); 
                return false;                    
              } 
              Toast({
                    message: '验证码已发送，5分钟内有效',
                    position: 'middle',
                    duration: 5000
                  }); 
              this.codeTime = 60;
              this.codeDisabled = true;
              this.timer(); 
            }).catch(err=>{
                console.log(err);
            });        
          }
    }, 
    timer() {
      if (this.codeTime > 0) {
        this.codeTime--;
        this.btntxt = this.codeTime + "s后重新获取";
        setTimeout(this.timer, 1000);
      } else {
        this.codeTime = 0;
        this.codeDisabled = false;
        this.btntxt = "获取验证码";        
      }
    },
    // 注册
    handleRegist(){
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
            let para = {
                authCode: this.ruleForm.code,
                inviteCode: "",
                mobile: this.ruleForm.mobilePhone,
                password: CryptoJS.MD5(this.ruleForm.pwd).toString(),
                registerClient: "1",
                username: this.ruleForm.username
            };
            try {//推广码
                if(localStorage.getItem('link')){
                    para.inviteCode = localStorage.getItem('link');
                }
            } catch (error) {
                console.log(error);
            }
            userRegister(para).then((res) => {
              if (res.code !== 0) {
                Toast({
                    message: res.msg,
                    position: 'middle',
                    duration: 3000
                  }); 
                return false;
              }
              if (!this.ruleForm.check) {
                Toast({
                    message: '注册成功，即将跳转至登录页面',
                    position: 'middle',
                    duration: 3000
                  }); 
                  setTimeout(() => {
                      this.$router.push('/login');
                      if(sessionStorage.getItem('embedPoint')){//登录埋点信息id添加
                        if(sessionStorage.getItem('embedPoint') == '/collection/add'){
                          sessionStorage.setItem('point','collection');
                        }else{
                          sessionStorage.setItem('point','download');
                        }
                      }
                  }, 3000);
                  return false;
              } 
              //埋点
              // embed(this.embedPoint).then(res=>{});
              Toast({
                  message: '注册成功，即将跳转至首页',
                  position: 'middle',
                  duration: 3000
                }); 
                getUserInfo().then((res) => {
                  localStorage.setItem("userInfo", JSON.stringify(res.data));
                  this.$store.commit('SET_USERINFO',res.data);
                  setTimeout(() => {
                      this.$router.push('/');
                  }, 3000);
                });
              
            }).catch((error) => {
                // this.error = "服务器内部错误"
                console.log(error);
            });
        }
    });
    },
    toPrivacy(){
      this.$router.push('/privacy')
    },
    toAgreement(){
      this.$router.push('/agreement')
    }
  },
  destroyed(){
      //清除埋点信息
      sessionStorage.removeItem('embedPoint');
      this.embedPoint = '';
  },
  created(){
    toWx()
  },
  mounted(){
    if(sessionStorage.getItem('embedPoint')){
      if(sessionStorage.getItem('embedPoint') == '/collection/add'){
        this.embedPoint = 0;
        this.embedToken = 'collection';
      }else{
        this.embedPoint = 1;
        this.embedToken = 'download';
      }
    }
  },
}
</script>

<style scoped>
.wrapper{
    width: 100%;
    position: relative;
}
.content{
    margin: 0 .8rem;
}
.handle {
  position: relative;
}
.handle h3{
    color: #666;
    font-size: .6rem;
    font-weight: 600  
}
.handle .input-icon {
  position: absolute;
  left: .1rem;
  top: 0;
  color: #666;
  z-index: 2;
  font-size: .58rem;
}
.handle .input-icon-phone{
  position: absolute;
  left: 0.02rem;
  top: 0;
  color: #666;
  z-index: 2;
  font-size: 0.75rem;
}
.handle .el-form-item__content{
  line-height: 1.18rem;
}
.handle .el-form-item {
  margin-bottom: .42rem;
}
.home-input-wrapper{
  margin: .68rem 0;
}
.home-input-wrapper .error {
  text-align: center;
  margin-bottom: 10px;
  color: red;
}

.home-input-wrapper label:before {
  content: '' !important;
}

.home-input-wrapper label {
  font-size: .4rem;
  color: #333;
  text-align: left;
}
.home-input-wrapper .el-input .el-input__clear{
  font-size: .38rem;
  line-height: 1.17rem;
}
.home-input-wrapper input {
  border: none;
  border-radius: 0;
  padding-left: .9rem;
  line-height: 1.17rem;
  height: 1.17rem;
  font-size: .38rem;
  border-bottom: 1px solid #D9D9D9;
}
.home-input-wrapper .el-input--suffix .el-input__inner{
  font-size: .38rem;
}
.home-input-wrapper .code-button {
  position: absolute;
  top: 2px;
  right: 0;
  border-radius: 4px;
  height: 1rem;
  line-height: 1rem;
  padding: 0 .3rem;
  border:1px solid #3D85DC;
  color: #3D85DC;
}

.home-input-wrapper .deal {
  color: #409EFF;
}
.handle-button {
  width: 100%;
  font-size: .38rem;
  font-family: 'Microsoft YaHei';
  font-weight: 400;
  border-radius: .54rem;
  background: #36A6FE;
  color: #fff;
  border: none;
  padding: .28rem 0;
}
.img_location {
    position: absolute;
    top: 50%;
    transform: translateY(-53%);
    left: 5px;
    z-index: 4;
}
</style>

