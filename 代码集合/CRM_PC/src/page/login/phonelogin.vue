<template>
<div class="phone_login_box">
  <el-form
    ref="loginForm"
    :rules="loginRules"
    :model="loginForm"
    label-width="0" style="padding-top:60px;">
    <el-form-item prop="username">
      <el-input
        class="logininput"
        type=""
        v-model.trim="loginForm.username"
        size="small"
        auto-complete="off"
        placeholder="请输入员工工号"
        @focus="userFocus = true"
        @blur="verifyNum();userFocus = false"
        @keyup.enter.native="handleLogin">
        <i slot="prefix" :class="userFocus ? 'login_common_sty usericonactive' : 'login_common_sty usericon'" />
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        class="logininput"
        :type="passwordType"
        v-model.trim="loginForm.password"
        size="small"
        auto-complete="off"
        placeholder="请输入密码"
        @focus="passwordFocus = true"
        @blur="verifyNum();passwordFocus = false"
        @keyup.enter.native="verifyNum()">
        <i
          slot="suffix"
          :class="passwordType == 'password' ? 'eye displayeye' : 'eye hideeye'"
          @click="showPassword"/>
        <i slot="prefix" :class="passwordFocus ? 'login_common_sty passwordiconactive' : 'login_common_sty passwordicon'" />
      </el-input>
    </el-form-item>
    <el-form-item prop="msgcode">
      <div class="code_box_btn">
        <el-input
        class="logininput msginput"
        type="text"
        v-model.trim="loginForm.msgcode"
        size="small"
        auto-complete="off"
        placeholder="请输入验证码"
        @focus="msgFocus = true"
        @blur="msgFocus = false">
        <i slot="prefix" :class="msgFocus ? 'login_common_sty msgiconactive' : 'login_common_sty msgicon'" />
      </el-input>
      <el-button type="primary" class="msgcode_btn" @click="getVerify" v-if="disabled==false" :disabled="isDisable">获取验证码</el-button>
      <el-button
          type="primary"
          size="medium"
          class="msgcode_btn"
          @click="getVerify"
          :disabled="disabled"
          v-if="disabled==true"
      >{{btntxt}}</el-button>
      </div>
    </el-form-item>
    <el-form-item prop="code">
       <Verify
        @success="verifySuccess"
        :mode="'pop'"
        :captchaType="'blockPuzzle'"
        :imgSize="{ width: '330px', height: '155px' }"
        ref="verify"
      /> 
    </el-form-item>
      <el-button
        type="primary"
        size="small"
        class="login-submit-btn"
        @click.native.prevent="handleLogin">绑定并登录
      </el-button>
  </el-form>
</div>
  
</template>

<script>
  import * as CodeMsg from "@/api/common/CodeChange"
  import {mapGetters} from 'vuex'
  import {verifyNum, getCode, mobileVer, judgeIsBind,wxBind} from '@/api/admin/user'
  import Verify from "@/components/verifition/Verify";

  export default {
    props:{
      unionId:{
        type: String,
        required: true
      }
    },
    name: 'Userlogin',
    components: {
      Verify
    },
    data() {
      return {
        dialogVisible: true,
        userFocus: false,//用户框
        passwordFocus: false,//密码框
        msgFocus: false,//短信框
        isDisable: true,
        socialForm: {
          code: '',
          state: ''
        },
        loginForm: {
          username: '',
          password: '',
          code: '',
          randomStr: 'blockPuzzle'
        },
        filterPhone: '',
        time: 0,
        btntxt: "",
        disabled: false,
        checked: false,
        code: {
          src: undefined,
          len: 4
        },
        userId:'',
        loginRules: {
          username: [
            {required: true, message: '请输入员工工号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '密码长度最少为6位', trigger: 'blur'}
          ],
          msgcode: [
            {required: true, message: '请输入正确的验证码', trigger: 'blur',pattern: /^\d{6}$/},
          ]
        },
        passwordType: 'password'
      }
    },
    computed: {
      ...mapGetters(['tagWel'])
    },
    mounted(){
      
    },
    methods: {
      //获取滑块
      getVerify(){
        this.$refs.verify.show()
      },
      // 发送验证码
      sendMsg() {
        this.time = 60;
        if(this.loginForm.phone!=''){
          getCode(this.loginForm.phone).then(res => {
          if (res.data.code == CodeMsg.CODE_0) {
              this.time = 60;
              this.disabled = true;
              this.timer();
              this.$message({
                type: "success",
                message: "正在向"+ this.filterPhone +"发送验证码",
                offset: 300,
                duration: 1000,
              });
            } else if (res.data.code == CodeMsg.CODE_1) {
              this.$message({
                type: "warning",
                message: res.data.data.cnMsg,
                offset: 300,
                duration: 1000
              });
            }
        }).catch((err) => {
          return err;
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
      showPassword() {
        this.passwordType == ''
          ? (this.passwordType = 'password')
          : (this.passwordType = '')
      },
      handleLogin() {
        let params = {
          number: this.loginForm.username,
          password: this.loginForm.password,
        }
        if(this.loginForm.username!=''&&this.loginForm.password!=''){
          verifyNum(params).then(res => {
            if(res.data.code == CodeMsg.CODE_0){
              this.loginForm.phone = res.data.data
              let num = res.data.data
              this.filterPhone = num.slice(0, 3)+'****'+num.slice(num.length - 4, num.length)
              this.mobileVer()
            }else{
              this.loginForm.phone = ''
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
                duration: 1000
              });
            }
          }).catch(error => {
            console.log(error)
          })
        }
      },
      verifySuccess(params) {
        this.loginForm.code = params.captchaVerification
        if(this.loginForm.code!=''){
          this.sendMsg()
        }
      },
      showWechatCode(){
        this.$router.push('/wechatcode')
      },
      // 员工工号密码校验
      verifyNum(){
        if(this.loginForm.username!='' && this.loginForm.password!=''){
          let params = {
            number: this.loginForm.username,
            password: this.loginForm.password,
          }
          verifyNum(params).then(res => {
            if(res.data.code != CodeMsg.CODE_0){
            this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
                duration: 1500
              });
              this.loginForm.phone = ''
              this.isDisable = true
              return false
            }
            this.loginForm.phone = res.data.data
            let num = res.data.data
            this.filterPhone = num.slice(0, 3)+'****'+num.slice(num.length - 4, num.length)
            this.isDisable = false
          }).catch(error => {
            console.log(error)
          })
        }
      },
      wxBind(){
        let params = {
          userId: this.userId,
          unionId: this.unionId
        }
        wxBind(params).then(res => {
          if(res.data.code != CodeMsg.CODE_0){
            if(res.data.code == CodeMsg.CODE_90007){
              let obj = {}
              obj.dialogVisible = true
              obj.userId = this.userId
              this.$emit('passval', obj)
            }else{
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
                duration: 1000
              });
            }
            return false
          }
          this.judgeIsBind()
        }).catch(error => {
          console.log(error)
        })
      },
      judgeIsBind(){
        judgeIsBind('WECHAT_BIND', this.unionId).then(res=> {
          let data = res.data
          if(data.access_token){
            this.$message({
              type: "success",
              message: '微信绑定成功',
              offset: 300,
              duration: 1000
            });
            this.$store.commit('SET_ACCESS_TOKEN', data.access_token)
            this.$store.commit('SET_REFRESH_TOKEN', data.refresh_token)
            this.$store.commit('SET_EXPIRES_IN', data.expires_in)
            this.$store.commit('SET_USER_INFO', data.user_info)
            this.$store.commit('SET_PERMISSIONS', data.user_info.authorities || [])
            this.$store.commit('CLEAR_LOCK')
            this.$router.push({ path: this.tagWel.value })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 手机号短信验证码校验
      mobileVer(){
        this.$refs["loginForm"].validate(valid => {
          if(valid){
            let params = {
              phone: this.loginForm.phone,
              authCode: this.loginForm.msgcode
            }
            mobileVer(params).then(res => {
              if(res.data.code == CodeMsg.CODE_0){
                this.userId = res.data.data
                this.wxBind()
              }else{
                this.$message({
                  type: "warning",
                  message: res.data.msg,
                  offset: 300,
                  duration: 1000
                });
              }
            }).catch(error => {
              console.log(error)
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
.login_common_sty{
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 32px;
  margin-top: 12px;
  margin-left: 5px;
}
.usericon{
  background: url('../../../public/img/bg/yonghu_icon.png') no-repeat;
  background-size: 100% 100%;
}
.usericonactive{
  background: url('../../../public/img/bg/yonghu_icon_black.png') no-repeat;
  background-size: 100% 100%;
}
.passwordicon{
  background: url('../../../public/img/bg/suo_icon.png') no-repeat;
  background-size: 100% 100%;
}
.passwordiconactive{
  background: url('../../../public/img/bg/jiesuo_icon.png') no-repeat;
  background-size: 100% 100%;
}
.msgicon{
  background: url('../../../public/img/bg/phone_msg.png') no-repeat;
  background-size: 100% 100%;
}
.msgiconactive{
  background: url('../../../public/img/bg/phone_msg_black.png') no-repeat;
  background-size: 100% 100%;
}
.eye{
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-top: 12px;
  margin-right: 9px;
}
.hideeye{
  background: url('../../../public/img/bg/hide_eye_icon.png') no-repeat;
  background-size: 100% 100%;
}
.displayeye{
  background: url('../../../public/img/bg/Display_eye_icon.png') no-repeat;
  background-size: 100% 100%;
}
.logininput {
    margin: 8px;
}
.logininput >>> .el-input__inner{
  height: 40px !important;
  padding-left: 40px !important;
  background: #F5F8FA !important;
  border-radius: 100px !important;
}
.we_sty {
  display: flex;
  color: #7ec4f3;
  justify-content: center;
}
.we_sty:hover {
  cursor: pointer;
}
.phone_login_box {
  position: relative;
}
.phone_login_box .code_box_btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.phone_login_box .msginput {
  width: 200px !important;
}
.phone_login_box .msgcode_btn {
  border-radius: 15px;
  height: 35px;
}
.login-submit-btn {
  width: 100%;
  height: 35px;
  font-size: 14px;
  letter-spacing: 5px;
  border-radius: 50px;
  text-indent: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-family: "neo";
  transition: 0.25s;
}
</style>
