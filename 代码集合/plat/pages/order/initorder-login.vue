<template>
  <div class="init-login-frame">
    <div class="init-order-login">
      <div class="order-head">
        <img class="logo" @click="toHome" src="@/assets/images/home/wotao@2x.png" alt="">
        <div class="time-line">
          <div class="now-line">
            <p class="line success-line"></p>
            <p class="num success-num">1</p>
            <p style="color:#CAECB6">确认产品信息</p>
          </div>
          <div class="now-line">
            <p class="line active-line"></p>
            <p class="num now-num">2</p>
            <p style="color:#7ABD54">登录/授权</p>
          </div>
          <div class="now-line">
            <p class="line"></p>
            <p class="num">3</p>
            <p style="color: #CCCCCC">再次确认信息</p>
          </div>
          <div class="now-line">
            <p class="line"></p>
            <p class="num">4</p>
            <p style="color: #CCCCCC">提交订单</p>
          </div>
        </div>
      </div>
      <!-- 登录框 -->
      <div class="login-box" v-if="!registerStatus">
        <p class="login-title">手机快捷登录</p>
        <el-form :model="ruleForm" class="input-wrapper" ref="ruleForm" :rules="rRules" >
          <el-form-item prop="phoneNumber">
            <img class="img_location" src="@/assets/images/login/icon_phone.png" alt />
            <el-input :disabled="true" v-model="ruleForm.phoneNumber" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <img  class="img_location" src="@/assets/images/login/icon_lock.png" alt />
            <el-input v-model="ruleForm.code" placeholder="请输入验证码"></el-input>
            <el-button size="mini" class="code_button" @click="sliderValidate">发送验证码</el-button>
            <el-button size="mini" class="code-button" @click="sliderValidate" :disabled="disabled" v-if="disabled == true">{{ btntxt }}</el-button>
          </el-form-item>
          <div class="user-agreement">
            <el-checkbox class="check-agree fontStyle"  name="agree" v-model="ruleForm.agree" @change="checkChange"> 登录即表示同意</el-checkbox>
            <span class="deal">
              <nuxt-link class="user-register" rel="nofollow" to="/agreement/yhzc" >《用户注册协议》</nuxt-link>
              <span class="and">和</span>
              <span class="protect">
                <nuxt-link to="/agreement/ysbh" rel="nofollow" class="statement">《隐私保护声明》</nuxt-link>
              </span>
            </span>
          </div>
          <div v-if="ruleAgree == true" class="checked">请先勾选服务协议</div>
          <el-button class="re-button login1"  type="primary" @click="ruleLogin">登 录</el-button>
          <div class="to_register" @click="registerStatus = true">
            <span class="no-account">还没有账号，</span>
            <span class="go-register">去注册></span>
          </div>
        </el-form>
      </div>
    </div>

    <div class="login-box" v-if="registerStatus">
      <div class="regist">
        <p class="register-title">注册账号</p>
        <!-- <p @click="registerStatus = false" class="tologin">已有帐号 去登陆 ></p> -->
      </div>
      <el-form :model="registerForm" class="input-wrapper" ref="registerForm" :rules="rules">
        <el-form-item prop="username">
          <img class="img_location" src="@/assets/images/login/icon_user.png" alt/>
          <el-input v-model.trim="registerForm.username" placeholder="请输入4~16位纯字母（或字母+数字组合）"></el-input>
        </el-form-item>
        <el-form-item prop="phoneNumber">
          <img class="img_location" src="@/assets/images/login/icon_phone.png" alt/>
          <el-input disabled v-model="registerForm.phoneNumber" placeholder="请输入注册手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <img class="img_location" src="@/assets/images/login/icon_lock.png" alt />
          <el-input  v-model="registerForm.code" placeholder="请输入短信验证码"></el-input>
          <el-button size="mini" class="code_button" @click="registerSliderValidate" :disabled="this.btn">发送验证码</el-button>
          <el-button size="mini" class="code-button" @click="registerSliderValidate" :disabled="disabled" v-if="disabled == true">{{ btntxt }}</el-button>
        </el-form-item>
        <el-form-item prop="pwd">
          <img class="img_location" src="@/assets/images/login/icon_lock.png" alt/>
          <el-input type="password" v-model="registerForm.pwd" placeholder="请输入6~16位字母、数字和符号两种以上组合密码" show-password></el-input>
        </el-form-item>
        <div class="style4">
          <el-checkbox class="check-agree"  name="agree" v-model="registerForm.agree" @change="checkChange"> 
              <span :class="['style5', registerForm.agree == true?'style6':'']">注册表示您同意</span>      
          </el-checkbox>
          <nuxt-link to="/agreement/yhzc" rel="nofollow" class="style6">《用户注册协议》</nuxt-link>
          <span class="txtSty">和</span>
          <nuxt-link to="/agreement/ysbh" rel="nofollow"  class="style6">《隐私保护声明》</nuxt-link>
        </div>
        <div v-if="ruleAgree == true" class="checked">请勾选协议</div>
        <el-button class="rege-button style7"  type="primary" @click="register" :disabled="this.btn">注 册</el-button>
        <!-- <el-checkbox class="check-agree style8"  name="agree" v-model="msgRule.agree">注册成功后自动登录</el-checkbox> -->
      </el-form>
    </div>
    
    <el-dialog title="提示" :visible.sync="dialogVisible" width="20%" top="40vh" :close-on-click-modal="false" center>
        <div class="close_find">
            拖动下方滑块完成拼图
            <span @click="dialogVisible = false">+</span>
        </div>
        <div>
            <vertify @msgSlider="rulePass" v-if="msgVerify"></vertify>
        </div>
    </el-dialog>
    
    <!-- 选择关联账号 -->
    <el-dialog width="450px" top="300px"
      title="选择一个关联账号登陆"
      :visible.sync="associatedVisible"
      center >
      <div class="lineStyle">
        <el-radio-group v-model="accountId" v-for="(item,index) in datalist.list" :key="index" class="radioStyle">
          <el-radio :label="item.accountId" >{{item.username}}</el-radio>
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
              <span class="go-register reStyle" @click="toRegister()" >去注册></span>
            </div>
          </div>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import vertify from "~/components/login/vetify";
import { newLogin, chooseAccount, getUserInfo } from "@/api/login";
import { getInitOrderDetail, getOrderUsrerInfo } from '~/api/order'
import { sendcode, registed ,userRegister,checkUsernameExist} from "@/api/register"
import Encrypt from '~/plugins/Encrypt'
import CryptoJS from "crypto-js"
export default {
  components:{
    vertify
  },
  data(){
      var checkUsername = (rule, value, callback) => {
        if (value=='' && value==null) {
          return callback(new Error("账户名不能为空"));
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
      ruleForm: {},
      registerForm: {},
      rRules: {},
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
            trigger: "blur" }
          ],
          pwd: [
            {
              required: true,
              pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/,
              message: "请输入6~16字母加数字或特殊符号组合的密码",
              trigger: "blur",
            },
          ],

      },
      ruleAgree: false,
      disabled: false,
      time: 60,
      msgVerify: false,
      dialogVisible: false,
      unassociatedVisible: false,
      associatedVisible: false,
      btntxt: '',
      accountId: '',
      datalist: [],
      orderId: '',
      registerStatus: false,
      btn: false,
      currentAccountId: ''
    }
  },
  mounted(){
    this.orderId = this.$route.query.id;
    this.registerStatus = JSON.parse(this.$route.query.registerStatus);
    this.getConfirmOrderUserInfo(this.orderId);
  },
  methods:{
    toHome(){
      window.open('/','_self');
    },
    getConfirmOrderUserInfo(orderId){
      getOrderUsrerInfo({orderId: orderId}).then(res=>{
        this.currentAccountId = res.data.data.accountId; //当前订单主体
        this.$set(this.ruleForm, 'phoneNumber', res.data.data.mobile);
        this.$set(this.registerForm, 'phoneNumber', res.data.data.mobile);
      })
    },
    getDetail(){
      getInitOrderDetail({id: this.orderId}).then(res=>{
        if(res.data.data.orderStatus == 8){
          // this.$router.push({
          //   path:'/member/order'
          // })
        }else{
          if(this.$route.query.status == 1){
            this.$router.push({
              path:'/member/authentication'
            })
          }else{
            var encrypt = Encrypt.encrypt(JSON.stringify(res.data.data),'Y2FsdGVkX184Asts');//密钥自定义 加密解密时保持一致即可
            let codeList = JSON.parse(sessionStorage.getItem('orderCode')) || [];
            let staffIdlist = codeList.filter( item =>{
              return item.orderId == this.orderId
            })
            this.$router.push({
              path: '/order/order-pay',
              query: Object.assign({
                source: 'pay-detail',
                data: encrypt,
                areaSelect: true
              }, staffIdlist.length > 0 ? {
                code: staffIdlist[0].code
              }:{})
            })
          };
        };
      })
    },
    toRegister(){
      this.unassociatedVisible = false;
      this.registerStatus = true;
    },
    register(){
      if(this.registerForm.agree == false){
        this.ruleAgree = true
      }else{
        this.ruleAgree = false
        this.$refs["registerForm"].validate((valid) => {
          if (valid) {
            let para = {
              authCode: this.registerForm.code,
              inviteCode: null,
              mobile: this.registerForm.phoneNumber,
              password: CryptoJS.MD5(this.registerForm.pwd).toString(),
              registerClient: "1",
              username: this.registerForm.username
            };
            try {//推广码
              if(sessionStorage.getItem('link')){
                para.inviteCode = this.$route.query.code;
              }
            } catch (error) {
              console.log(error);
            };
            userRegister(para).then((res) => {
              if (res.data.code == 0) {
                getUserInfo().then((res) => {
                  localStorage.setItem('userInfo', JSON.stringify(res.data.data));
                  this.$store.commit('SET_USERINFO',res.data.data);
                  this.getDetail();
                });
                this.$message({
                  type: "success",
                  message: "注册成功，即将跳转",
                  offset: 200,
                  duration: 1000
                });
              } else{
                this.$message({
                  type: "warning",
                  message: res.data.msg,
                  offset: 200,
                  duration: 1000
                });
              }
            }).catch((error) => {
              console.log(error);
            });
          }
        });
      };
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
      };
    },
    // 发送验证码
    sendMsg() {
      let ref = this.registerStatus ? 'registerForm' : 'ruleForm'
      this.time = 60;
      let phonePass;
      this.$refs[ref].validateField("phoneNumber", (valid) => {
        phonePass = valid;
      });
      if (!phonePass) {
        sendcode(this.registerStatus ? this.registerForm.phoneNumber :this.ruleForm.phoneNumber).then((res) => {
          if (res.data.code == 0) {
            this.time = 60;
            this.disabled = true;
            this.timer();
            this.$message({
              type: "success",
              message: "验证码已发送，5分钟之内有效！",
              offset: 200,
              duration: 1000,
            });
          } else{
            this.$message({
              type: "info",
              message: res.data.msg,
              offset: 200,
              duration: 1000
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
      };
    },
    checkChange(val) {
      if (val == true) {
        this.ruleAgree = false;
      }
    },
    //手机号登录
    ruleLogin() {
      if (!this.ruleForm.agree) {
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
              param.inviteCode = this.$route.query.code;
            }
          } catch (error) {
            console.log(error);
          };
          newLogin(param).then((res) => {
            if (res.data.code == 0) {
              this.dialogAddVisible = false;
              if(res.data.data.list.length > 1){
                this.datalist = res.data.data;
                let associated = false;
                res.data.data.list.forEach((item,index) => {
                  this.accountId = item.accountId;
                  if(item.accountId == this.currentAccountId){
                    associated = true;
                    this.chooseAccount()
                  }
                });
                if(!associated){
                  this.datalist.list = this.datalist.list.filter(item=>{
                    return item.authStatus == 0;
                  })
                  if(this.datalist.list.length == 0){
                    this.unassociatedVisible = true;
                  }else{
                    this.associatedVisible = true;
                  };
                }
              }else{
                res.data.data.list.forEach((item,index) => {
                  this.accountId = res.data.data.list[0].accountId;
                });
                this.datalist = res.data.data;
                this.chooseAccount()
              }
            } else if(res.data.code == 10003){
              this.unassociatedVisible = true; 
            }else{
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 200,
                duration: 1000
              }); 
            }    
        }).catch((error) => {
          console.log(error);
        });
        }
      });
    },
    // 账号名判断
    judge(val){
      if(val == '' || val == null || val == undefined){
        return true
      }
      return false
    },
    // 选择关联账户
    chooseAccount(){
      let param = {
        accountId: this.accountId,
        loginTemp: this.datalist.loginTemp
      }
      chooseAccount(param).then((res) => {
        if(res.data.code==0){
          // this.$message({
          //   type: "success",
          //   message: '登录成功',
          //   offset: 200,
          //   duration: 1000
          // });
          getUserInfo().then(res => {
            let data = res.data.data
            localStorage.setItem("userInfo", JSON.stringify(res.data.data));
            this.$store.commit('SET_USERINFO',res.data.data);
            if(this.judge(data.username)){
              this.$router.push("/userLogin")
            }else{
              this.$message({
                type: "success",
                message: '登录成功',
                offset: 200,
              })
              localStorage.setItem("userInfo", JSON.stringify(res.data.data));
              this.$store.commit('SET_USERINFO',res.data.data);
              this.getDetail();
            };
          }).catch(()=>{
            return false;
          })
        }else{
          this.$message({
            type: "warning",
            message: res.data.msg,
            offset: 200,
              duration: 1000
          });
        }
      }).catch((error)=>{
        console.log(error)
      });
    },
    sliderValidate() {
      this.time = 60;
      let phonePass;
      this.$refs["ruleForm"].validateField("phoneNumber", (valid) => {
        phonePass = valid;
      });
      if (!phonePass) {
        this.msgVerify = true;
        this.dialogVisible = true;
      }
    },
    registerSliderValidate() {
      this.time = 60;
      let phonePass;
      this.$refs["registerForm"].validateField("phoneNumber", (valid) => {
        phonePass = valid;
      });
      if (!phonePass) {
        this.msgVerify = true;
        this.dialogVisible = true;
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
.init-login-frame{
  min-height:600px
  .init-order-login{
    width 1190px
    min-height 150px
    margin 0 auto
    color #666666
    .order-head{
      display grid
      grid-template-columns repeat(2, 1fr)
    }
    .logo{
      width: 206px;
      height: 60px;
      margin-top: 20px;
      cursor: pointer;
    }
    .time-line{
      display flex
      margin-top 46px
      font-size 14px
      .now-line{
        text-align center
        .line{
          width 131px
          border 1px solid #CCCCCC
        }
        .success-line{
          border 1px solid #CAECB6
        }
        .active-line{
          border 1px solid #7ABD54
        }
        .num{
          width 19px
          height 19px
          line-height 19px
          margin 0 auto
          margin-top -10px
          color #FFFFFF
          border-radius 50%
          background #CCCCCC
        }
        .success-num{
          background #CAECB6
        }
        .now-num{
          background #7ABD54
        }
      }
    }
  }
  .login-box{
    width: 480px;
    height: 500px;
    margin: 30px auto;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;
    .regist{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      padding-top: 20px;
      margin: 30px;
      color: #3DA1FF;
      .register-title{
        font-size: 18px;
      }
      .tologin{
        text-align: right;
        cursor: pointer;
      }
    }
    .img_location {
      position: absolute;
      top: 50%;
      transform: translateY(-53%);
      left: 37px;
      z-index: 4;
    }
    .login-title{
      margin-left: 30px
      padding-top: 46px
      font-size: 18px;
      color: #409eff;
    }
    .re-button {
      width: 410px;
      height: 46px;
      background: rgba(54, 166, 254, 1);
      opacity: 1;
      margin-left: 30px;
      font-family: "Microsoft YaHei";
      margin-top: 40px;
      border-radius: 2px;
      font-size: 18px;
    }
  }
  .input-wrapper {
    margin-top: 35px;
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
  .radioStyle{
    display: block;
    margin: 15px 20px;
  }
  .style4{
    margin-left: 33px;
  }
}
</style>