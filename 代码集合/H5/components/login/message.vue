<template>
  <div class="handle">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm home-input-wrapper"
    >
      <el-form-item prop="mobilePhone">
        <i class="iconfont input-icon-phone">&#xe630;</i>
        <el-input
          v-model="ruleForm.mobilePhone"
          placeholder="请输入手机号码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="code" class="code">
        <i class="iconfont input-icon">&#xe6a1;</i>
        <el-input
          placeholder="请输入验证码"
          v-model="ruleForm.code"
          maxlength="6"
        ></el-input>
        <el-button
          size="mini"
          class="code-button"
          @click="sendMsg"
          :disabled="codeDisabled"
          v-if="codeDisabled == false"
          >发送验证码</el-button
        >
        <el-button
          class="code-button"
          @click="sendMsg"
          :disabled="codeDisabled"
          v-if="codeDisabled == true"
          >{{ btntxt }}</el-button
        >
      </el-form-item>
      <el-form-item class="cluse_content" prop="checkBox">
        <el-checkbox style="line-height: 0.24rem" v-model="ruleForm.checkBox"></el-checkbox>
        <span style="font-size: 0.34rem; color: #3d85dc; ">登录即表示同意</span>
        <a rel="nofollow" style="font-size: 0.34rem; color: #3d85dc; " @click="toAgreement">《用户注册协议》</a><span style="font-size: 0.34rem; color: #3d85dc">和</span>
        <a rel="nofollow" @click="toPrivacy" style="font-size: 0.34rem; color: #3d85dc">《隐私保护声明》</a>
      </el-form-item>
    </el-form>
    <button class="handle-button" @click="toLogin">登 录</button>
    <div style="text-align: right; margin: 0.6rem 0">
      <span
        rel="nofollow"
        style="text-decoration: none; color: #36a6fe; font-size: 0.36rem"
        to="/regist"
        v-if="extra_data"
        @click="setMark()"
        >去注册 ></span>
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
            <div style=" display: flex; justify-content: space-between; align-items: center;">
              <el-form-item prop="code">
                <el-input v-model="codeForm.code" placeholder="请输入右图中的验证码" @keyup.enter.native="submitCode"></el-input>
                <span style=" display: inline-block; height: 40px; width: 50%; background: #f3f4f8;" @click="getCode">
                  <img :src="'data:image/jpeg;base64,' + securitydata" style="height: 40px; width: 100%" alt />
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

    <!-- 选择关联账户 -->
    <mt-popup v-model="associatedVisible" position="bottom" class="popup1" v-if="datalist.list && datalist.list.length">
      <div class="title">请选择一个关联账号登录
        <img src="@/assets/images/order/close_icon.png" alt="" @click="associatedVisible = false" class="close">
      </div>
      <div class="lineStyle">
            <el-radio-group v-model="accountId" v-for="(item,index) in datalist.list" :key="index" class="radioStyle">
                <el-radio :label="item.accountId" >{{item.username}}</el-radio>
            </el-radio-group>
      </div>
      <div class="btn">
        <el-button type="primary" @click="chooseAccount" style="width:100%;">确定</el-button>  
      </div>        
    </mt-popup>

    <!-- 验证码登录没有关联账号提示 -->
    <mt-popup  v-model="unassociatedVisible" position="bottom" class="popup2">
      <div class="tipBox">
        <div class="title">提示
          <img src="@/assets/images/order/close_icon.png" alt="" @click="unassociatedVisible = false" class="close">
        </div>
        <p class="divStyle1">该手机号码尚未关联卧涛账号，请先去注册一个账号吧~</p>
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
import { sendCode, phoneLogin, securityCode,getUserInfo,embed,chooseAccount} from "@/api/login";
import { Toast, MessageBox, Popup } from "mint-ui";
import { getOnlineOrdersStatistics } from '@/api/order'
import * as CodeMsg from "@/api/CodeMsg";
import wechat from "~/components/common/wechatLogin";
import dialogC from "./dialogC";
export default {
  layout: "empty",
  components: {
    wechat,
    dialogC
  },
  props:['lastPath'],
  data() {
    return {
      embedPoint:'',
      embedToken: '',
      ruleForm: {
        mobilePhone: "",
        pwd: "",
        checkBox: false,
      },
      codeForm: {
        code: "",
      },
      codeTime: 0,
      codeDisabled: false,
      btntxt: "",
      rules: {
        mobilePhone: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        code: [{ required: true, pattern: /^\d{6}$/,message: "请输入验证码", trigger: "blur" }],
      },
      popupVisible: false,
      associatedVisible:false,
      unassociatedVisible:false,
      securitydata: "",
      fromLastPath:'',
      extra_data: true,//是否显示注册
      orderCount:null,
      certification:false,
      radio:3,
      datalist:{},
      accountId:null
    };
  },
  mounted(){
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
    this.fromLastPath = this.lastPath;//上一页面path
  },
  methods: {
    setMark(){
      this.$router.push('/regist')
      if(sessionStorage.getItem('extra_data')){
          sessionStorage.setItem('embedPoint',sessionStorage.getItem('extra_data'));
      }
    },
    getPath(data){
        this.fromLastPath = data;
    },
    toLogin() {
      this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            if (!this.ruleForm.checkBox) {
              Toast({
                message: "请勾选协议",
                position: "middle",
                duration: 1000,
              });
              return  false;
            }
            this.handleLogin();
          }
          
      });
    },
    // 发送验证码
    sendMsg() {
      let phonePass;
      this.$refs["ruleForm"].validateField("mobilePhone", (valid) => {
        phonePass = valid;
      });
      if (!phonePass) {
        sendCode(this.ruleForm.mobilePhone).then((res) => {
            if (res.code == 0) {
              Toast({
                message: "验证码已发送，5分钟内有效",
                position: "middle",
                duration: 3000,
              });
              this.codeTime = 60;
              this.codeDisabled = true;
              this.timer();
            } else if (res.code == 1) {
              Toast({
                message: res.msg,
                position: "middle",
                duration: 3000,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    handleLogin() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let para = {
              mobile: this.ruleForm.mobilePhone,
              authcode: this.ruleForm.code,
          }
          try {//推广码
            if(localStorage.getItem('link')){
              para.inviteCode = localStorage.getItem('link');
            }
          } catch (error) {
            console.log(error);
          };
          phoneLogin(para).then((res) => {
              if (res.code !== CodeMsg.CODE_0) {
                if(res.code == 10003){
                  this.unassociatedVisible = true;
                  return false;
                }
                Toast({
                  message: res.msg,
                  position: "middle",
                  duration: 3000,
                });
                return false;
              }
              //埋点
              // embed(this.embedPoint).then(res=>{})
              if(res.data.list.length > 1){
                this.associatedVisible = true;
                res.data.list && res.data.list.forEach((item,index) => {
                    this.accountId = res.data.list[0].accountId;
                });
                this.datalist = res.data;
              }else{
                res.data.list && res.data.list.forEach((item,index) => {
                    this.accountId = res.data.list[0].accountId;
                });
                this.datalist = res.data;
                this.chooseAccount();
              }
            }).catch((err) => {
              console.log(err);
            });
        }
      });
    },

    // 选择关联账户登录
    chooseAccount(){
        let param = {
          accountId: this.accountId,
          loginTemp: this.datalist.loginTemp
        }
        chooseAccount(param).then((res) => {
          if(res.code != CodeMsg.CODE_0){
            if(res.code == CodeMsg.CODE_10009){
                //登录频繁弹框进行二次操作
                this.getCode();
                this.popupVisible = true;
            }
            Toast({
              message: res.msg,
              position: "middle",
              duration: 3000,
            });
            return false;
          }
          Toast({
            message: '登录成功',
            position: "middle",
            duration: 3000,
          });
          getUserInfo().then(res => {
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            this.$store.commit('SET_USERINFO',res.data);
            this.judgeOrder();
          }).catch(()=>{
              return false;
          })   
        }).catch((err)=>{
            console.log(err)
        });
    },

    //判断认证状态和订单数量
    judgeOrder(){
        this.loginSuccessTo()
        // let certificationStatus = JSON.parse(localStorage.getItem('userInfo')).certificationStatus
        // getOnlineOrdersStatistics({accountId: JSON.parse(localStorage.getItem('userInfo')).userId}).then(res=>{ //订单数量
        //     if(res.code == 0){
        //         this.orderCount = res.data.allCount;
        //         if( (certificationStatus == 0 ||certificationStatus == 2) && this.orderCount > 0 ){
        //             this.certification = true;
        //         } else {
        //             this.loginSuccessTo()
        //         }
        //     }
        // });               
    },
    //登录成功前往的页面
    loginSuccessTo(){
        window.open('/', "_self");
        if(this.fromLastPath == '/regist'  || this.fromLastPath == '/reset'|| this.fromLastPath == '/member' || this.fromLastPath == '/login'){
            this.$router.push({
                path:"/"
            })
        } else if(this.fromLastPath == '/productdetails/details'){
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
        }
      });
    },
    getCode() {
      securityCode().then((res) => {
        this.securitydata = res;
      });
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
    toPrivacy() {
      this.$router.push("/privacy");
    },
    toAgreement() {
      this.$router.push("/agreement");
    },
  },
};
</script>

<style>
.handle {
  position: relative;
}
.handle h3 {
  color: #666;
  font-size: 0.6rem;
  font-weight: 600;
}
.handle .input-icon {
  position: absolute;
  left: 0.1rem;
  top: 0;
  color: #666;
  z-index: 2;
  font-size: 0.58rem;
}
.handle .input-icon-phone{
  position: absolute;
  left: 0.015rem;
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
.home-input-wrapper .code-button {
  position: absolute;
  top: 2px;
  right: 0;
  border-radius: 4px;
  height: 1rem;
  line-height: 1rem;
  padding: 0 0.3rem;
  border: 1px solid #3d85dc;
  color: #3d85dc;
}

.home-input-wrapper .deal {
  color: #409eff;
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
.cluse_content .el-form-item__content {
  line-height: 0.4rem !important;
  margin-top: 0.4rem;
}
.popup1 {
  max-height:16rem;
  overflow-y:scroll;
}
.popup1 .title {
  height:1rem;
  line-height: 1rem;
  font-weight: bold;
  font-size: 0.4rem;
  text-align: center;
  position: relative;
}
.popup1 .btn {
  width: 90%;
  margin: auto;
}
.popup1 .radioStyle{
    display:block;
    margin:0.4rem;
}
.popup1 .lineStyle {
    border-top:1px solid #eee;
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
