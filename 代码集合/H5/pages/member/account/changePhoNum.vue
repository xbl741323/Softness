<template>
  <div class="container">
    <mt-header>
      <router-link to="/member/account/save" slot="left">
        <mt-button icon="back">修改手机号码</mt-button>
      </router-link>
    </mt-header>
    <!-- 自动带入原手机号码 -->
     <div >
      <i class="iconfont icon-phone">&#xe630;</i>
      <mt-field
        :placeholder="userPho"
        disabled
        class=' margin_left'
      >
      </mt-field>
    </div>
    <!-- 短信验证码 -->
    <div>
      <i class="iconfont input-icon">&#xe6a1;</i>
      <mt-field placeholder="请输入短信验证码" v-model="msgCode" class=' margin_left'> </mt-field>
      <mt-button
        size="small"
        class="code-button"
        type="primary"
        :disabled="btnDisabled"
        @click="sendMsg"
        >{{ btnText }}</mt-button>
    </div>
    <!-- 密码方式跳转 -->
    <div class="bottom_link">
      <router-link to="/member/account/changePhoPwd" style="color: #0aa1ed" >手机无法使用，通过密码验证方式</router-link>
    </div>
    <mt-button class='container-button' @click="next">下一步</mt-button>

  </div>
</template>
<script>
import { sendCode } from "@/api/login";
import { Toast, MessageBox } from "mint-ui";
import * as CodeMsg from "@/api/CodeMsg";
import { checkPho,getProvince1 } from "@/api/user";
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
      title:'修改手机号码',
      userPho: this.$store.state.userInfo.accountNo,
      msgCode: '',
      codeTime: 0,
      btnDisabled: false,
      btnText: "发送验证码",
    };
  },
  methods: {
    // 发送验证码
    sendMsg() {
      sendCode(this.userPho).then((res) => {
          if (res.code == CodeMsg.CODE_0) {
            Toast({
              message: "验证码已发送，五分钟内有效",
              position: "middle",
              duration: 5000,
            });
            this.codeTime = 60;
            this.btnDisabled = true;
            this.timer();
          } else if (res.code == CodeMsg.CODE_1) {
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
    // 下一步验证
    next(){
      if(this.msgCode==''){
         Toast({
              message: '请输入短信验证码',
              position: "middle",
              duration: 3000,
            });
      }else{
      let para = {
        mobilephone: this.userPho,
        authcode: this.msgCode,
      };
      checkPho(para)
        .then(res => {
          if (res.data.code ==CodeMsg.CODE_1000) {
            // Toast({
            //   message: "验证成功",
            //   position: "middle",
            //   duration: 1000,
            // });
            setTimeout(() => {
              this.$router.push("/member/account/changePhoNumn");
            }, 0);
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

.container .bottom_link {
  padding: 0.5rem 0.3rem;
}

.container>div {
  position: relative;
}

/* .container input {
  padding: 0.1rem 0.8rem;
  font-size: 0.38rem;
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
.container .margin_left{
  padding-left:.6rem
}
</style>