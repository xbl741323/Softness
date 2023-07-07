<template>
  <div class="pwd_box">
    <div class="account_box">
      <div class="account_tip">
        <div class="tip_box">
            <img src="@/assets/images/home/icon-gantanhao.png" alt="">
            <div>
                请输入您需要找回登录密码的账户名（暂只支持已完成卧涛网实名认证的用户）
            </div>
        </div>
      </div>
      <div class="account_form">
        <el-form :model="ruleForm" ref="ruleForm" label-width="140px" :rules="rRules">
            <el-form-item prop="username" label="账号名" class="label_sty">
                <el-input v-model.trim="ruleForm.username" placeholder="请输入账号名"></el-input>
            </el-form-item>
            <el-form-item>
                <span class="forget">
                    <span @click="forgetUsername" class="find">忘记账号名？</span>
                </span>
                <span class="info">为了你的账号安全，请进行安全校验</span>
                <slide-unlock @success="handler" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="isDisable" @click="submit" class="submit"><span>确  定</span></el-button><br>
                <span class="find" @click="find">手机号码找回密码</span>
            </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import slideUnlock from "~/components/login/slideUnlock";
import {userNameCheck } from '@/api/find'
import * as CodeMsg from "@/api/CodeChange"
export default {
  head () {
    return {
      title: '身份认证找回密码',          
    }
  },
  components: {
      slideUnlock
  },
  data () {
    return {
        isDisable: true,
        slideUnlock: false,
        ruleForm: {
            username: ''
        },
        rRules: {
            username: [{  message: "请输入4~16位纯字母（或字母+数字组合）",pattern: /^(?![0-9]+$)[a-zA-Z0-9]{4,16}$/, trigger: "blur"}],
        },
    }
  },
  created () {

  },

  mounted () {

  },
  methods: {
      handler(val) {
          this.slideUnlock = val
          this.isDisable = false
      },
      find(){
        this.$router.push("/find")
      },
      forgetUsername(){
        this.$router.push("/account")
      },
      submit(){
          if(this.ruleForm.username!=''&&this.slideUnlock){
              this.$refs['ruleForm'].validate(valid=>{
                  if(valid){
                      userNameCheck(this.ruleForm.username).then(res =>{
                          if (res.data.code !== CodeMsg.CODE_0) {
                            this.$message({
                                message: res.data.msg,
                                type: 'warning',
                                offset:200,
                                duration: 1000
                            });
                            return false;     
                          }
                          if(res.data.data.authStatus == '1'){
                                this.$router.push({
                                    path: "/find/authPwd",
                                    query: {
                                        accountId: res.data.data.accountId,
                                    }
                                })
                            }else{
                                this.$message({
                                    message: '您的账号尚未认证，无法通过身份认证找回密码',
                                    type: 'warning',
                                    offset:200,
                                    duration: 2500
                                });
                                this.$router.push({path: "/find"})

                            }
                      })
                  }
              })
          }else{
            this.$message({
                message: '账号名不能为空',
                type: 'warning',
                offset:200,
                duration: 1000
            });
          }
    }
  }

}
</script>

<style lang="stylus" scoped>
.pwd_box {
    width 100%
    height 562px
    min-height 562px
    background-color #eff2f3
    display flex
    align-items center
    justify-content center
    font-family Microsoft YaHei, Microsoft YaHei-Normal
    position relative
    padding-bottom 30px
}
.account_box{
    width 1190px
    height 547px
    background-color #fff
    position absolute
    top 0
}
.account_tip {
    width 100%
    height 43px
    border-bottom 1px solid #e0f2fb
}
.tip_box {
    margin-left 52px
    margin-top 22px
    line-height 20px
}
.tip_box img {
    width 20px
    height 20px
    vertical-align middle
}
.tip_box div {
    display inline-block
    padding-left 4px
    color #6C6C6C
    font-size 14px
    height 20px
    vertical-align middle
}
.account_form {
    position absolute
    top 114px
    left 24%
}
.account_form .forget {
    display block
    width 300px
    text-align right
    font-size 12px
    position absolute
    top -25px
}
.account_form .label {
    font-size 14px
    font-family Source Han Sans CN, Source Han Sans CN-Regular
    font-weight 400
    color #fb0400
    line-height 14px
}
.account_form .info {
    display inline-block
    width 300px
    height 12px
    line-height 12px
    text-align center
    color #7b7b7b
    margin-bottom 20px
}
.account_form .forget:hover {
    cursor pointer
}
.account_form .find {
    display block
    padding-top 5px
    width 300px
    height 12px
    line-height 12px
    font-size 12px
    font-family Source Han Sans CN, Source Han Sans CN-Medium
    text-align right
    color #36a6fe
}
.account_form .find:hover {
    cursor pointer
}
.account_form >>> .el-input__inner {
    width 300px
    height 30px
    line-height 30px
    border 1px solid #B4B4B4
    color #999999
    border-radius 4px
}
.account_form .el-input {
    width 300px
    height 30px
    line-height 30px
    background #ffffff
    border-radius 4px
    font-size 12px
    color #999999
    opacity 1
}
.account_form .label_sty >>> .el-form-item__label {
    font-size 14px
    font-weight bold
    font-family Source Han Sans CN, Source Han Sans CN-Regular
    color #333333
}

.account_form .submit {
    width 300px
    height 40px
    // background #36a6fe
    border-radius 5px
    margin-top 48px
    span {
        font-size 18px
        font-family Source Han Sans CN, Source Han Sans CN-Bold
        font-weight 700
        color #ffffff
    }
}

</style>