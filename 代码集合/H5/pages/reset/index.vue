<template>
  <div class="wrapper">
      <top-header />
      <div class="content">
          <welcome />
          <div class="handle">
              <h3>密码重置</h3>
               <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                class="demo-ruleForm home-input-wrapper"
                >
                <el-form-item prop="mobilePhone">
                    <i class="iconfont input-icon-phone">&#xe630;</i>
                    <el-input v-model="ruleForm.mobilePhone" placeholder="请输入手机号码" clearable></el-input>
                </el-form-item>
                <el-form-item prop="code" class="code">
                  <i class="iconfont input-icon">&#xe6a1;</i>
                  <el-input placeholder="请输入验证码" v-model="ruleForm.code" maxlength="6"></el-input>
                  <el-button size="mini" class="code-button"  @click="sendMsg" :disabled="codeDisabled"  v-if="codeDisabled==false">发送验证码</el-button>
                  <el-button class="code-button" @click="sendMsg" :disabled="codeDisabled" v-if="codeDisabled==true">{{btntxt}}</el-button>
                </el-form-item>
                <el-form-item prop="pwd">
                    <i class="iconfont input-icon">&#xe62f;</i>
                    <el-input type="password" v-model="ruleForm.pwd" placeholder="请设置6-16位字母加数字或符号组合密码" show-password></el-input>
                </el-form-item>
                <el-form-item prop="repwd">
                    <i class="iconfont input-icon">&#xe62f;</i>
                    <el-input type="password" v-model="ruleForm.repwd" placeholder="请再次确认登录密码" show-password></el-input>
                </el-form-item>
              </el-form> 
              <button class="handle-button" @click="handleFind">确认修改密码</button>             
              <div style="text-align:right; margin: .6rem 0;"><nuxt-link rel="nofollow" style="text-decoration:none; color: #36A6FE; font-size: .36rem" to="/regist">还没注册？去注册 ></nuxt-link></div>      
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import { sendCode, findPassword, checkUser,checkExist } from "@/api/login";
import topHeader from '~/components/common/topHeader'
import welcome from '~/components/common/welcome'
import CryptoJS from 'crypto-js'
import * as CodeMsg from "@/api/CodeMsg";
import { Toast } from 'mint-ui';
import wechat from '~/components/common/wechatLogin'
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
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        checkExist(value).then(res => {
            if (res.code == CodeMsg.CODE_1) {
              return callback(new Error("该手机号码尚未注册,请先去注册"));
            } else {
              callback();
            }
          }).catch(err => {
            console.log(err);
          });
      }
    };
    return {
      title:"注册账号",
      ruleForm:{
        check:true,
      },
      codeTime:0,
      registStatus: false,
      codeDisabled:false,
      btntxt:'',
      rules: {
        mobilePhone: [
          {required: true, pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, message: "请输入正确手机号码", trigger: "blur"},
          {validator: checkPhone,trigger: "blur"}
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,  message: '请输入6~16字母加数字或符号组合密码', trigger: 'blur' }
        ],
        repwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,  message: '请输入6~16字母加数字或符号组合密码', trigger: 'blur' }
        ],
      },
    };
  },
  methods:{  
    sendMsg() {
      let phonePass                        
      this.$refs['ruleForm'].validateField('mobilePhone', (valid) => {
        phonePass = valid
      })
      if (!phonePass) {
        checkUser(this.ruleForm.mobilePhone).then(res=>{
          console.log(res.data,"输出验证码")
           if(res.data == 10003) {
           }else{
              sendCode(this.ruleForm.mobilePhone).then(res=>{
              if(res.code==CodeMsg.CODE_0){  
                  Toast({
                    message: '验证码已发送，五分钟内有效',
                    position: 'middle',
                    duration: 5000
                  }); 
                  this.codeTime = 60;
                  this.codeDisabled = true;
                  this.timer();                    
              } else if(res.code == CodeMsg.CODE_1){
                Toast({
                  message: res.data.cnMsg,
                  position: 'middle',
                  duration: 3000
                }); 
              }
          }).catch(err=>{
              console.log(err);
          }); 
           }
        })       
      }
    }, 
    handleFind(){
        this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              if(this.ruleForm.pwd == this.ruleForm.repwd){
                let para = {
                  accountNo: this.ruleForm.mobilePhone,
                  authcode: this.ruleForm.code,              
                  accountPassword: CryptoJS.MD5(this.ruleForm.pwd).toString(),  
                  accountSource: 1,
                  terminalType: 0,
                  platFlag:'A',
                }
                findPassword(para).then(res=>{
                    if(res.code === CodeMsg.CODE_0){
                        Toast({
                          message: '修改成功，即将跳转至登录页面',
                          position: 'middle',
                          duration: 3000
                        }); 
                        setTimeout(() => {
                            this.$router.push('/login');
                        }, 3000);
                    } else if(res.code === CodeMsg.CODE_1){
                        Toast({
                            message: res.data.cnMsg,
                            position: 'middle',
                            duration: 3000
                        });    
                    }
                }).catch(err=>{
                  // this.error = "服务器内部错误"
                });
              } else {
                Toast({
                  message: '两次密码输入不一致！',
                  position: 'middle',
                  duration: 5000
                }); 
              }
            }
        })
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
    registStatement(){
      
    },
    privacy(){},
  },
  mounted(){
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
</style>

