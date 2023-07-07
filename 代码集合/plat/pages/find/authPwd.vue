<template>
  <div class="auth_pwd_container">
      <div class="progress_container">
        <div class="top_box">
          <p class="top_text">管理员实名认证</p>
        </div>
        <div class="step_box">
          <div class="theSteps">
              <el-steps :active="active" align-center>
                  <el-step title="验证身份"></el-step>
                  <el-step title="找回密码"></el-step>
                  <el-step title="完成"></el-step>
              </el-steps>
          </div>
          <div class="content_box" v-show="active == 0 && showStatus == 0">
            <div class="content_form">
              <el-form :model="infoForm" ref="infoForm" :rules="infoRules" label-width="110px">
                <el-form-item label="姓名：" prop="name" class="label_sty">
                    <el-input placeholder="请输入姓名"  v-model.trim="infoForm.name" />
                </el-form-item>
                <el-form-item label="身份证号：" prop="idNumber" class="label_sty">
                    <el-input placeholder="请输入身份证号"  v-model.trim="infoForm.idNumber" />
                </el-form-item>
                <el-form-item label="手机号：" prop="phone" class="label_sty">
                    <el-input placeholder="请输入手机号"  v-model.trim="infoForm.phone" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="submit_btn" @click="sumbitInfo"><span>提 交</span></el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="content_box" v-show="active == 1">
            <div class="content_form">
              <el-form :model="pwdForm" ref="pwdForm" :rules="pwdRules" label-width="130px">
                <el-form-item label="账号名：" prop="username" class="label_sty">
                    <el-input placeholder="请输入账号名"  v-model.trim="pwdForm.username" disabled/>
                </el-form-item>
                <el-form-item label="新密码：" prop="pwd" class="label_sty">
                    <el-input placeholder="新密码（6-16位字母+数字/符号组合）" type="password" show-password  v-model.trim="pwdForm.pwd" />
                </el-form-item>
                <el-form-item label="再次确认密码：" prop="confirmpwd" class="label_sty">
                    <el-input placeholder="再次确认密码"  type="password" show-password v-model.trim="pwdForm.confirmpwd" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="submit_btn" @click="submitPwd"><span>提 交</span></el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="content_box" v-show="active == 2 && showStatus == 2">
            <div class="success_form">
              <img src="@/assets/images/home/icon-zhengque.png" alt="">
              <div class="text_sty1">重置成功，请牢记新的登录密码</div>
              <div class="text_sty2" @click="goLogin">重新登录</div>
            </div>
          </div>
          <div class="content_box" v-show="active == 0 && showStatus==1">
            <div class="success_form">
              <img src="@/assets/images/home/icon-dengdai.png" alt="">
              <div class="text_sty1">您的认证信息已提交，请耐心等待~</div>
            </div>
          </div>
          <div class="content_box" v-show="active == 0 && showStatus == 3">
            <div class="success_form">
              <img src="@/assets/images/home/icon-cuowu.png" alt="">
              <div class="text_sty1">很抱歉，您的单位实名认证未通过审核！</div>
              <div class="text_sty3">未通过原因:{{auditFailReason}}</div>
              <el-button type="primary" class="auth_btn"><span>重新认证</span></el-button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import {authByOnlyPerson, getAuthPersonStatus, updatePwdByAuth } from '@/api/find'
import * as CodeMsg from "@/api/CodeChange"
export default {
  head () {
    return {
      title: '身份认证找回密码',          
    }
  },
  components: {

  },
  data () {
    return {
      showStatus: 0,
      active: 0,
      infoForm: {
        name: '',
        idNumber: '',
        phone: ''
      },
      pwdForm: {
        username: '',
        pwd: '',
        confirmpwd: ''
      },
      transactionNo:'',//交易号
      auditFailReason:'',//未通过原因
      status:'',
      userName:'',
      infoRules:{
          name:[{required: true, message:'请输入姓名',pattern:/^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/,trigger:'change'}],
          idNumber:[{required: true, pattern:/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message:'请输入正确的身份证号',trigger:'blur'}],
          phone:[{required: true, pattern:/^1[3456789]\d{9}$/, message:'请输入正确的手机号码',trigger:'blur'}]
      },
      pwdRules:{
          username:[{required: true, message:'请输入4~16位纯字母（或字母+数字组合）',pattern:/^(?![0-9]+$)[a-zA-Z0-9]{4,16}$/,trigger:'change'}],
          pwd:[{required: true, pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/, message:'请输入6~16位字母、数字和符号两种以上组合密码',trigger:'blur'}],
          confirmpwd:[{required: true, pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/,message:'请输入6~16位字母、数字和符号两种以上组合密码',trigger:'blur'}]
      },
    }
  },

  created () {
    if(this.$route.query.accountId){
      this.accountId = this.$route.query.accountId
    }
  },

  mounted () {
    if(this.$route.query.transactionNo){
      this.transactionNo = this.$route.query.transactionNo
      this.getAuthPersonStatus(this.$route.query.transactionNo)
    }
  },
  watch:{
    $route:{
      handler(val){
        this.transactionNo = val.query.transactionNo
        if(val.query.transactionNo){
          this.getAuthPersonStatus(val.query.transactionNo)
        }
      }
    }
  },
  methods: {
    goLogin(){
      this.$router.push("/login")
    },
    // 提交身份认证信息
    sumbitInfo(){
      this.$refs['infoForm'].validate(valid=>{
        if(valid){
          let params = {
            accountId: this.$route.query.accountId,
            autClient: 1, // 1 PC 2 小程序 3 H5
            idCard: this.infoForm.idNumber,
            idCardName: this.infoForm.name,
            mobile: this.infoForm.phone,
            returnUrl: process.env.PC_URL+'/find/authPwd'
          }
          authByOnlyPerson(params).then(res=>{
            if (res.data.code == CodeMsg.CODE_0) {
              window.location.replace(res.data.data.url)
            }else{
               this.$message({
                    message: res.data.msg,
                    type: 'warning',
                    offset:200,
                    duration: 1000
                });
            }
          })
        }
      })
    },
    // 修改密码
    submitPwd(){
      if (this.pwdForm.confirmpwd != this.pwdForm.pwd) {
        this.$message({
          message: "两次密码输入不一致！",
          type: "warning",
          offset: 300,
        });
      } else {
        this.$refs['pwdForm'].validate(valid=>{
          if(valid){
            let params = {
              accountId: this.accountId,
              password: CryptoJS.MD5(this.pwdForm.pwd).toString(),
              transactionNo: this.transactionNo
            }
            updatePwdByAuth(params).then(res=>{
              if (res.data.code == CodeMsg.CODE_0) {
                this.showStatus = 2
                this.active = 2
              }else{
                this.showStatus = 3
                this.active = 0
              }
            })
          }
        })
      }
    },
    // 根据交易号判断
    getAuthPersonStatus(transactionNo){
      getAuthPersonStatus(transactionNo).then(res=>{
        if (res.data.code == CodeMsg.CODE_0) {
          this.accountId = res.data.data.accountId
          this.pwdForm.username = res.data.data.username
          this.auditFailReason = res.data.data.auditFailReason
          this.status = res.data.data.status
          this.userName = res.data.data.username
          this.active = 1
        }
      })
    }
  }

}
</script>

<style lang="stylus" scoped>
.auth_pwd_container {
    width 100%
    height 100%
    background-color #eff2f3
    display flex
    align-items center
    justify-content center
}
.auth_pwd_container .progress_container{
    width 1190px
    height 700px
    background-color #fff
    position relative
    .top_box {
      border-bottom 1px solid #e0f2fb
      height 63px
    }
    .top_text {
      font-size 20px
      font-family Microsoft YaHei, Microsoft YaHei-Bold
      font-weight 700
      text-align left
      color #333333
      padding 19px 0 0 40px
    }
}
.step_box {
  width 100%
  margin-top 320px
  margin-left 95px
  position absolute
  left 50%
  transform translate(-50%,-50%)
  .content_box {
    width 85%
    display flex
    justify-content center
    align-items center
    height 400px
    margin-top 60px
  }
  .content_form {
    width 450px
    height 100%
  }
  .success_form {
    width 330px
    margin-top -130px !important
    display flex
    justify-content center
    align-items center
    flex-direction column
    .text_sty1 {
      margin-top 20px
      font-size 18px
      font-family Microsoft YaHei, Microsoft YaHei-Bold
      font-weight 700
      text-align center
      color #333333
    }
    .text_sty2 {
      margin-top 12px
      font-size 16px
      font-family Source Han Sans CN, Source Han Sans CN-Regular
      font-weight 400
      text-align center
      color #4aa6fe
      line-height 21px
    }
    .text_sty2:hover {
      cursor pointer
    }
    .text_sty3 {
      margin-top 14px
      font-size 16px
      font-family Source Han Sans CN, Source Han Sans CN-Regular
      font-weight 400
      color #4aa6fe
    }
    .auth_btn {
      width 148px
      height 38px
      background #36a6fe
      border-radius 5px
      margin-top 14px
      span {
        font-size: 14px;
        font-family: Source Han Sans CN, Source Han Sans CN-Bold;
        font-weight: 700;
        color: #ffffff;
      }
    }
  }
  .content_form >>> .el-input__inner {
    width  300px
    height 32px
    line-height 32px
    border 1px solid #B4B4B4
    border-radius 4px
    vertical-align middle
  }
  .content_form .el-input {
      width 300px
      height 32px
      line-height 32px
      background #ffffff
      border-radius 4px
      font-size 14px
      color #999999
      vertical-align middle
  }
  .content_form .label_sty >>> .el-form-item__label {
      font-size 14px
      font-weight bold
      font-family Source Han Sans CN, Source Han Sans CN-Regular
      color #333333
  }
  .content_form .submit_btn {
    margin-top 48px
    width 300px
    height 40px
    background #36a6fe
    border-radius 5px
  }
  .submit_btn span {
        font-size 18px !important
        font-family Source Han Sans CN, Source Han Sans CN-Bold
        font-weight bold !important
        text-align center
        color #ffffff
     }
}
.theSteps >>> .el-step__line {
  position absolute
  border-color inherit
  background-color #36A6FE
  z-index -50
}
.theSteps >>> .el-step__head.is-finish {
  color white
  border-color #36A6FE
}
.theSteps >>> .el-step__head.is-wait {
  color white
  border-color #36A6FE
  opacity 0.5
}
.theSteps >>> .el-step__head.is-process {
  color white
  border-color #36A6FE
}
.theSteps >>> .el-step__title.is-process {
  font-weight 400
  color #36A6FE
}
.theSteps >>> .el-step__icon.is-text {
  border-radius 50%
  border 2px solid
  border-color inherit
  background-color #36A6FE
}
.theSteps >>> .el-step__title.is-finish {
  color #36A6FE
}
.theSteps >>> .el-step.is-horizontal .el-step__line {
  height 2px
  top 11px
  width 290px
}
.theSteps >>> .el-step.is-horizontal.is-center {
  margin-right -95px !important
}

</style>