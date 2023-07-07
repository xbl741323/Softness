<template>
  <div class="handle">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm home-input-wrapper"
    >
      <el-form-item prop="username">
        <img class="img_location" src="@/assets/images/register/icon_user.png" alt/>
        <el-input
          v-model.trim="ruleForm.username"
          placeholder="请输入账号名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <i class="iconfont input-icon-pwd">&#xe62f;</i>
        <el-input
          type="password"
          v-model.trim="ruleForm.pwd"
          placeholder="请输入登录密码"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: right; margin: 0.6rem 0">
      <nuxt-link
        style="text-decoration: none; color: #36a6fe; font-size: 0.36rem"
        to="/reset"
        rel="nofollow"
        >忘记密码？</nuxt-link
      >
    </div>
    <button class="handle-button" @click="handleLogin">登 录</button>
    <div style="text-align: right; margin: 0.6rem 0">
      <span style="text-decoration: none; color: #36a6fe; font-size: 0.36rem" to="/regist" @click="setMark()">去注册 ></span>
    </div>
    <mt-popup v-model="popupVisible" modal="true" position="bottom">
      <div class="pop-content">
        <p class="pop-title">登录频繁，请输入图形验证码</p>
        <div class="pop-code">
          <el-form
            :model="codeForm"
            :rules="rules"
            ref="codeForm"
            class="pop-Form"
            @submit.native.prevent
          >
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <el-form-item prop="code">
                <el-input
                  v-model="codeForm.code"
                  placeholder="请输入右图中的验证码"
                  @keyup.enter.native="submitCode"
                ></el-input>
                <span
                  style="
                    display: inline-block;
                    height: 40px;
                    width: 50%;
                    background: #f3f4f8;
                  "
                  @click="getCode"
                >
                  <img
                    :src="'data:image/jpeg;base64,' + securitydata"
                    style="height: 40px; width: 100%"
                    alt
                  />
                </span>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="pop-footer">
            <el-button type="primary" @click="submitCode">确定</el-button>
            <el-button @click="popupVisible = false">取消</el-button>
          </div>
        </div>
      </div>
    </mt-popup>

    <!-- 账号密码登录未注册提示 -->
    <mt-popup  v-model="unregistered" position="bottom" class="popup2">
      <div class="tipBox">
        <div class="title">提示
          <img src="@/assets/images/order/close_icon.png" alt="" @click="unregistered = false" class="close">
        </div>
        <p class="divStyle1">该账号尚未注册，请先去注册一个账号吧~</p>
        <div class="divStyle2">
            <nuxt-link to="/regist" rel="nofollow">
                <span class="go-register" >去注册></span>
            </nuxt-link>
        </div>
      </div>
    </mt-popup>
    <dialogC :showPop="certification" />
  </div>
</template>

<script>
import { phoneLogin, securityCode, checkUser,getUserInfo,embed,accountLogin} from "@/api/login";
import * as CodeMsg from "@/api/CodeMsg";
import { Toast, MessageBox, Popup, Field } from "mint-ui";
import { getOnlineOrdersStatistics } from '@/api/order'
import CryptoJS from "crypto-js";
import wechat from "~/components/common/wechatLogin";
import dialogC from "./dialogC";
export default {
  layout: "empty",
  components: {
    wechat,
    dialogC
  },
  props:["lastPath"],
    data() {
        return {
            embedPoint: '',
            ruleForm: {
                username: "",
                pwd: "",
            },
            codeForm: {
                code: "",
            },
            rules: {
                username:[
                  { required: true, message: "请输入账号名", trigger: "blur" },
                  {
                      pattern:/^[A-Za-z][A-Za-z0-9]{3,15}$/,
                      message: "请输入4~16位纯字母（或字母+数字组合）",
                      trigger: "blur",
                  },
                ],
                pwd: [
                  { required: true, message: "请输入密码", trigger: "blur" },
                  {
                      pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z][0-9A-Za-z_-`!@#$%^&*()\[\]{}<>\\|/?,.:"']{5,15}$/,
                      message: "请输入正确的密码",
                      trigger: "blur",
                  },
                ],
                code: [
                { required: true,message: "请输入图形验证码", trigger: "blur" },
                ],
            },
            popupVisible:false,
            unregistered:false,
            securitydata: "",
            fromLastPath:'',
            embedToken: '',
            orderCount:null,
            certification:false,
        };
    },
    methods: {
       setMark(){
            this.$router.push('/regist')
            if(sessionStorage.getItem('extra_data')){
                sessionStorage.setItem('embedPoint',sessionStorage.getItem('extra_data'));
            }
        },
        handleLogin() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                  accountLogin({
                        username: this.ruleForm.username,
                        password: CryptoJS.MD5(this.ruleForm.pwd).toString(),
                        captchaCode: this.codeForm.code,
                    }).then((res) => {
                      if(res.code !== 0){
                        if (res.code == 10009) {
                          //登录频繁弹框进行二次操作
                          this.getCode();
                          this.popupVisible = true;
                          return false;
                        }
                        if(res.code == 10003){
                          this.unregistered = true
                          return false;
                        }
                        Toast({
                          message: res.msg,
                          position: "middle",
                          duration: 3000,
                        });
                        return false;
                      }
                      this.popupVisible = false;
                      Toast({
                        message: '登录成功',
                        position: "middle",
                        duration: 3000,
                      });
                      getUserInfo().then(res => {
                        localStorage.setItem("userInfo", JSON.stringify(res.data));
                        this.$store.commit('SET_USERINFO',res.data);
                        this.loginSuccessTo()
                      }).catch(()=>{
                          return false;
                      })     
                    }).catch((err)=>{
                        console.log(err)
                    });
                }
            });
        },
        //登录成功前往的页面
        loginSuccessTo(){
            if(this.fromLastPath == '/regist' || this.fromLastPath == '/reset' || this.fromLastPath == '/member' || this.fromLastPath == '/login'){
                this.$router.push({
                    path:"/"
                })
            }else if(this.fromLastPath == '/productdetails/details'){
              window.open('/productdetails/details?spuId='+localStorage.getItem('spuId'), "_self");
            } else {
                this.$router.go(-1);
                return false;
            }
        },
        submitCode() {
            this.$refs["codeForm"].validate((valid) => {
                if (valid) {
                    this.handleLogin();
                }else{
                    return false;
                }
            });
        },
        getCode() {
            securityCode().then((res) => {
              this.securitydata = res;
            });
        },
        getPath(data){
            this.fromLastPath = data;
        },
    },
    mounted() {
      console.log(this.lastPath,localStorage.getItem('spuId'),'1------');
      if(sessionStorage.getItem('point')){//注册转登录数据埋点id
        this.embedToken = sessionStorage.getItem('point');
      }else{

      };
      if(sessionStorage.getItem('extra_data')){
      this.extra_data = false;
      if(sessionStorage.getItem('extra_data') == '/collection/add'){
        this.embedPoint = 3;//收藏转登录
        this.embedToken = 'collection';
      }else{
        this.embedPoint = 4;//下载转登录
        this.embedToken = 'download';
      }
    }else{
      this.extra_data = true;
    }
      this.fromLastPath = this.lastPath; //上一页面path
    },
};
</script>

<style>
.handle {
  position: relative;
}
.v-modal {
  opacity: 0.3 !important;
}
.handle h3 {
  color: #666;
  font-size: 0.6rem;
  font-weight: 600;
}
.handle .input-icon-pwd {
  position: absolute;
  left: 0.1rem;
  top: 0;
  color: #666;
  z-index: 2;
  font-size: 0.58rem;
}
.handle .input-icon-phone{
  position: absolute;
  left: 0.02rem;
  top: 0;
  color: #666;
  z-index: 2;
  font-size: 0.75rem;
}
.handle .el-form-item__content {
  line-height: 1.18rem;
}
.handle .el-form-item {
  margin-bottom: 0.42rem;
}
.home-input-wrapper {
  margin: 0.68rem 0;
}
.home-input-wrapper .error {
  text-align: center;
  margin-bottom: 10px;
  color: red;
}

.home-input-wrapper label:before {
  content: "" !important;
}

.home-input-wrapper label {
  font-size: 0.4rem;
  color: #333;
  text-align: left;
}
.home-input-wrapper .el-input .el-input__clear {
  font-size: 0.38rem;
  line-height: 1.17rem;
}
.home-input-wrapper input {
  border: none;
  border-radius: 0;
  padding-left: 0.9rem;
  line-height: 1.17rem;
  height: 1.17rem;
  font-size: 0.38rem;
  border-bottom: 1px solid #d9d9d9;
}
.home-input-wrapper .el-input--suffix .el-input__inner {
  font-size: 0.38rem;
}
.handle-button {
  width: 100%;
  font-size: 0.38rem;
  font-family: "Microsoft YaHei";
  font-weight: 400;
  border-radius: 0.54rem;
  background: #36a6fe;
  color: #fff;
  border: none;
  padding: 0.28rem 0;
}
.pop-content {
  padding: 0.4rem 0;
}
.pop-title {
  text-align: center;
  font-size: 0.42rem;
  color: #333;
}
.pop-code {
  margin: 0.6rem 0.4rem;
}
.pop-footer {
  margin-top: 0.32rem;
  text-align: center;
}
.img_location {
    position: absolute;
    top: 50%;
    transform: translateY(-53%);
    left: 5px;
    z-index: 4;
}
.close{
  position: absolute;
  right: .125rem;
  top: .125rem;
}
.popup2 .tipBox {
    font-size: 0.4rem;
}
.popup2 .title {
  height: 1rem;
  border-bottom:1px solid #eee;
  padding-top:.125rem;
  text-align: center;
  font-size: 0.4rem;
  font-weight: bold;
  color: #333;
  position: relative;
}
.popup2 .divStyle1{
  text-indent: 0.7rem;
  margin:.5rem;
  color: #999999;
}
.popup2 .divStyle2{
    display:flex;
    justify-content:flex-end;
}
.popup2 .go-register{
  color: #409eff;
  display:block;
  margin:5px;
}
</style>
