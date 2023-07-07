<template>
  <div class="container">
    <mt-header>
      <router-link to="/member/account/save" slot="left">
        <mt-button icon="back">修改手机号码</mt-button>
      </router-link>
    </mt-header>
    <!-- 登录密码的验证 -->
    <div>
      <i class="iconfont input-icon">&#xe62f;</i>
      <mt-field
        :type="pwdView"
        placeholder="请输入登录密码"
        v-model="userPwd"
         class='padding_left'
      >
      <i @click="show_pwd" :class="[pwdView=='text'?'view-sty':'','el-icon-view']"></i> 
      </mt-field>
    </div>
    <!-- 新手机号码格式的验证 -->
    <div>
      <i class="iconfont icon-phone">&#xe630;</i>
      <mt-field
        placeholder="请输入新手机号码"
        :state="phoStatus"
        v-model="userPho"
        @blur.native.capture="checkPho"
         class='padding_left'
      >
      </mt-field>
    </div>
    <!-- 短信验证码 -->
    <div>
      <i class="iconfont input-icon">&#xe6a1;</i>
      <mt-field placeholder="请输入短信验证码" v-model="msgCode" class='padding_left' > </mt-field>
      <mt-button
        size="small"
        class="code-button"
        type="primary"
        :disabled="btnDisabled"
        @click="sendMsg"
        >{{ btnText }}</mt-button
      >
    </div>
    <div class='bottom_link'><router-link to='/member/account/changePhoNum'  style='color:#0aa1ed'>手机短信验证方式修改号码</router-link></div>
    <button class="container-button" @click="changePhoNum">确认修改</button>
    
  </div>
</template>
<script>
import { sendCode} from "@/api/login";
import { Toast, MessageBox } from "mint-ui";
import * as CodeMsg from "@/api/CodeMsg";
import { changePho } from "@/api/user";
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
      pwdView:"password",
      title:'修改手机号码',
      phoStatus: "",
      userPho: null,
      userPwd: null,
      msgCode: null,
      codeTime: 0,
      btnDisabled: false,

      btnText: "发送验证码",
    };
  },
  methods: {
    show_pwd(){
        if(this.pwdView == 'password'){
         this.pwdView = 'text'
      } else{
        this.pwdView = 'password'
      }
    },
    checkPho() {
      let reg = /^1[3-9]\d{9}$/;
      if (this.userPho == this.$store.state.userInfo.accountNo){
        Toast({
          message: "此手机号与当前绑定的手机号相同",
          position: "middle",
          duration: 3000,
        });
      } else if (reg.test(this.userPho)) {
        this.phoStatus = "success";
      } else {
        this.phoStatus = "error";
        // Toast({
        //   message: "手机号码不正确，请重新输入",
        //   position: "middle",
        //   duration: 3000,
        // });
      }
    },
    sendMsg() {
      if (this.phoStatus == "success") {
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
      } else {
        Toast("请先输入一个正确手机号码");
      }
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
  
  changePhoNum() {
    if(!this.userPwd){
      Toast({
              message: "密码不能为空",
              position: "middle",
              duration: 3000,
            })
    }else {
      let para = {
        accountNo: this.userPho,
        authcode: this.msgCode,
        oldMobilephone:this.$store.state.userInfo.accountNo,
        accountPassword:CryptoJS.MD5(this.userPwd).toString()
      };
      changePho(para)
        .then(res => {
          console.log(res,"jij")
          if (res.code == 0) {
            Toast({
              message: "修改成功,请重新登录",
              position: "middle",
              duration: 2000,
            });
            setTimeout(() => {
              this.$router.push("/login");
            }, 3000);
          } else {
            //失败情况做判断
            Toast({
              message: res.data.cnMsg,
              position: "middle",
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          // this.error = "服务器内部错误"
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
.container .bottom_link{
  padding:.5rem .3rem;
 
  
}
.container>div {
  position: relative;
}

/* .container input {
  padding: 0.1rem 0.8rem;
  font-size: 0.38rem;
  text-align:left !important;

} */

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
.view-sty{
  color: #36A6FE;
}
</style>