<template>
  <div class="container">
    <mt-header>
      <router-link to="/member/account/save" slot="left">
        <mt-button icon="back">修改密码</mt-button>
      </router-link>
    </mt-header>
    <!-- 带入手机号码 -->
    <div>
      <i class="iconfont icon-phone">&#xe630;</i>
      <mt-field
        :placeholder="userPho"
        disabled
        class='padding_left'
      >
      </mt-field>
    </div>
    <!-- 短信验证码 -->
    <div>
      <i class="iconfont input-icon">&#xe6a1;</i>
      <mt-field placeholder="请输入短信验证码" v-model="msgCode" class='padding_left'> </mt-field>
      <mt-button
        size="small"
        class="code-button"
        type="primary"
        :disabled="btnDisabled"
        @click="sendMsg"
        >{{ btnText }}</mt-button
      >
    </div>
    <!-- 新密码的验证 -->
    <div>
      <i class="iconfont input-icon">&#xe62f;</i>
      <mt-field class='padding_left' placeholder="请设置新密码，字母加数字或符号组合6~16位" v-model="userPwd" :state="pwdStatus" type='password' @blur.native.capture="checkPwd"> </mt-field>
    </div>
    <!-- 再次确认密码 -->
     <div>
      <i class="iconfont input-icon">&#xe62f;</i>
      <mt-field class='padding_left' placeholder="请再次确认新密码" v-model="userPwd2" :state="pwd2Status" type='password'   @blur.native.capture="checkPwd2"> </mt-field>
    </div>
    <button class="container-button" @click="changePwd">确认修改</button>
  </div>
</template>
<script>
import { sendCode,findPassword } from "@/api/login";
import { Toast, MessageBox } from "mint-ui";
import * as CodeMsg from "@/api/CodeMsg";
import CryptoJS from 'crypto-js'
export default {
  layout: 'empty',
  head () {
    return {
      title: this.title,    
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  },
  data() {
    return {
      title:'修改密码',
      pwdStatus: "",
      pwd2Status: "",
      userPho: this.$store.state.userInfo.accountNo,
      userPwd: null,
      userPwd2: null,
      msgCode: null,
      codeTime: 0,
      btnDisabled: false,
      btnText: "发送验证码",
    };
  },
  methods: {
    // 短信验证码
    sendMsg() {
        sendCode(this.userPho)
          .then((res) => {
            if (res.code == 0) {
              Toast({
                message: "验证码已发送，五分钟内有效",
                position: "middle",
                duration: 5000,
              });
              this.codeTime = 60;
              this.btnDisabled = true;
              this.timer();
            } else if (res.code == 1) {
              Toast({
                message: res.data.cnMsg,
                position: "middle",
                duration: 3000,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
    },
    timer() {
      if (this.codeTime > 0) {
        this.codeTime--;
        this.btnText = this.codeTime + "s后重新获取";
        setTimeout(this.timer, 1000);
      } else {
        this.codeTime = 0;
        this.btnText = "获取验证码";
        this.btnDisabled = false;
      }
    },
  // 新密码的验证
  checkPwd(){
    let reg=/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/
    if(reg.test(this.userPwd)){
      this.pwdStatus= "success"
    }else{
      this.pwdStatus= "error";
      // Toast({
      //         message: "密码格式不正确，请重新输入",
      //         position: "middle",
      //         duration: 3000,
      //       })
    }
  },
  //确认密码
  checkPwd2(){
    if(this.userPwd==this.userPwd2){
      this.pwd2Status='success'
    }else{
      this.pwd2Status='error'
      // Toast({
      //         message: "两次密码不一致，请重新输入",
      //         position: "middle",
      //         duration: 3000,
      //       })
    }
  },
  //确认修改
  changePwd() {
    if (this.pwdStatus == "success" && this.pwd2Status=='success') {
      let para = {
        accountNo: this.userPho,
        authcode: this.msgCode,
        accountPassword:CryptoJS.MD5(this.userPwd).toString(),// CryptoJS.MD5(this.ruleForm.pwd).toString()
      };
      findPassword(para)
        .then(res => {
          if (res.code === 0) {
            Toast({
              message: "修改成功,请重新登录",
              position: "middle",
              duration: 1000,
            });
            setTimeout(() => {
              this.$router.push("/login");
            }, 1000);
          } else {
            //失败情况做判断
            Toast({
              message: res.data.cnMsg,
              position: "middle",
              duration: 1000,
            });
          }
        })
        .catch((err) => {
          // this.error = "服务器内部错误"
        });
    } else {
      Toast({
        message: "请填写正确信息后修改",
        position: "middle",
        duration: 3000,
      });
    }
  },
  },
};
</script>
<style scoped>
.container {
  background: #f4f4f4;
}
.container .padding_left{
  padding-left:.6rem
}
.container header {
  background: transparent;
  color: #000;
  font-size: 0.4rem;
  height: 1.2rem;
}

.container a {
  margin-top: 0.1rem;
  text-decoration: none;
}

.container>div {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.2rem;
  top: 0.3rem;
  color: #666;
  font-size: 0.58rem;
  z-index: 2;
}
 .icon-phone{
  position: absolute;
  left: 0.1rem;
  top: 0.3rem;
  color: #666;
  z-index: 2;
  font-size: 0.75rem;
}
.code-button {
  position: absolute;
  right: 0.2rem;
  top: 0.2rem;
  color: #fff;
  z-index: 2;
}

.container-button {
  width: 100%;
  margin-top: 1rem;
  font-size: 0.38rem;
  font-family: 'Microsoft YaHei';
  font-weight: 400;
  border-radius: 0.2rem;
  background: #36A6FE;
  color: #fff;
  border: none;
  padding: 0.28rem 0;
}
</style>