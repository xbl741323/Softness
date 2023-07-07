<template>
<div>
  <el-form
    ref="loginForm"
    :rules="loginRules"
    :model="loginForm"
    label-width="0">
    <!-- <el-form-item prop="username">
      <el-input class="input_style" v-model="loginForm.username" placeholder="请输入用户名" >
        <i slot="prefix" class="usericon"></i>
      </el-input>
    </el-form-item> -->
    <el-form-item prop="username">
      <el-input
        class="logininput"
        type=""
        v-model="loginForm.username"
        size="small"
        auto-complete="off"
        placeholder="请输入员工工号"
        @focus="userFocus = true"
        @blur="userFocus = false"
        @keyup.enter.native="handleLogin">
        <i slot="prefix" :class="userFocus ? 'login_common_sty usericonactive' : 'login_common_sty usericon'" />
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        class="logininput"
        :type="passwordType"
        v-model="loginForm.password"
        size="small"
        auto-complete="off"
        placeholder="请输入密码"
        @focus="passwordFocus = true"
        @blur="passwordFocus = false"
        @keyup.enter.native="handleLogin">
        <i
          slot="suffix"
          :class="passwordType == 'password' ? 'eye displayeye' : 'eye hideeye'"
          @click="showPassword"/>
        <!-- <i slot="prefix" class="iconfont icon-mima"></i> -->
        <i slot="prefix" :class="passwordFocus ? 'login_common_sty passwordiconactive' : 'login_common_sty passwordicon'" />
      </el-input>
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
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        class="login-submit"
        @click.native.prevent="handleLogin">登录
      </el-button>
    </el-form-item>
    <div class="we_sty" @click="showWechatCode()">
        <div class="wrapper_inner">
            <span></span>
            <img src='@/assets/images/my-home/icon_wechat.png' alt />
            <span></span>
        </div>
        <div class="login_txt">微信登录</div>
    </div>
  </el-form>
</div>
  
</template>

<script>
  import {randomLenNum} from '@/util/util'
  import {mapGetters} from 'vuex'
  import {getCode} from '@/api/code'
  import Verify from "@/components/verifition/Verify";

  export default {
    name: 'Userlogin',
    components: {
      Verify
    },
    data() {
      return {
        userFocus: false,//用户框
        passwordFocus: false,//密码框
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
        checked: false,
        code: {
          src: undefined,
          len: 4
        },
        loginRules: {
          username: [
            {required: true, message: '请输入员工工号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '密码长度最少为6位', trigger: 'blur'}
          ]
        },
        passwordType: 'password',
      }
    },
    computed: {
      ...mapGetters(['tagWel'])
    },
    methods: {
      showPassword() {
        this.passwordType == ''
          ? (this.passwordType = 'password')
          : (this.passwordType = '')
      },
      handleLogin() {
        this.$refs.verify.show()
      },
      verifySuccess(params) {
        this.loginForm.code = params.captchaVerification
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
              try {
                // 获取类目信息
                this.$store.dispatch('setCategory');
                // 获取地区信息
                this.$store.dispatch('setArea');
                // 获取部门信息
                this.$store.dispatch('setDept');
                // 获取设置地区数据
                this.$store.dispatch('setNotices');
              } catch (error) {
                
              }finally{
                this.$router.push({path: this.tagWel.value})
              };
            })
          }
        })
      },
      showWechatCode(){
        this.$router.push('/wechatcode')
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
.logininput >>> .el-input__inner{
  height: 40px !important;
  padding-left: 40px !important;
  background: #F5F8FA !important;
  border-radius: 100px !important;
}
.we_sty {
    width: 85%;
    height: 60px;
    margin: 0 auto;
    margin-top: 0;
    padding-top: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.we_sty:hover {
  cursor: pointer;
}
.we_sty .wrapper_inner {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2px;
}
.we_sty .wrapper_inner > span:nth-of-type(1) {
    display: inline-block;
    width: 150px;
    height: 0px;
    border-top: 1.5px solid rgba(163, 163, 163, 1);
    opacity: 0.7;
}
.we_sty .wrapper_inner > span:nth-of-type(2) {
    display: inline-block;
    width: 150px;
    height: 0px;
    border-top: 1.5px solid #8b8a8a;
    opacity: 0.7;
}
.we_sty img {
    width: 34px;
    height: 34px;
    border-radius: 25px;
    opacity: 1;
    color: #fff;
    margin: 0 13px;
    cursor: pointer;
}
.we_sty .login_txt{
    color:#8b8a8a;
    font-size:13px;
    margin-top:2px;
}
</style>
