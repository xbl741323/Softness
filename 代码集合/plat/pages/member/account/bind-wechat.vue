<template>
  <div class="safe_set">
    <div v-loading="loading">   
        <!-- 手机号完整性校验 -->
        <div class="bind_wrapper">
            <div class="for-safe-title">
                <div class="safe-icon"><img src="@/assets/images/login/icon01_login@2x.png" alt /></div>
                <h3>为了您的账号安全，请完善身份信息</h3>
            </div>
            <div>
                <div class="bindAuth">请选择一个授权信息进行绑定</div>
                <div class="authInfo">
                  <el-form :model="phoneForm"  size="medium" :rules="phoneRules" ref="phoneForm">
                    <el-form-item prop="invisiblePhone">
                        <el-input  v-model="userInfo.mobile" disabled class="wid"></el-input>
                    </el-form-item>
                    <el-form-item prop="phone">
                        <el-input class="wid" v-model="phoneForm.phone" placeholder="请输入完整手机号码"></el-input>
                    </el-form-item>
                    </el-form>
                </div>
                <el-button class="safe-button" type="primary" @click="checkMobile">确认</el-button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { getUserDetail ,checkMobile,wxBind} from "@/api/member";
import {
  getQrcode,
} from "@/api/login";
export default {
  head() {
      return {
          title:'微信绑定',
      };
  },
  data() {
    return {
      qrcodeImg: "",
      userInfo: {},
      bindVisible: false,
      ruleForm:{
        username:"",
        password:"**********",
      },
      phoneForm:{
        invisiblePhone:"",
        phone:""
      },
      phoneRules:{
          invisiblePhone:[{requird:true,}],
          phone:[{requird:true, message: "手机号码格式错误",trigger: "change",pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,}]
      },
      state:null,
      code:null,
      loading:true
    };
  },
  filters:{
    filterMobile(value) {
      if (value) {
        var reg = /^(\d{3})\d*(\d{4})$/;
        var str = value.replace(reg, "$1****$2");
        return str;
      }
    },
  },
  methods: {
    // 关闭弹窗
    handleClose(){
      this.bindVisible = false
    },
    // 微信绑定
    wxBind() {
      let params={
           state:this.state,
           code:this.code,
      }
      wxBind(params).then(res=>{
        if(res.data.code == 0){
          this.$message({
              type:'success',
              message: '微信绑定成功',
              offset: 300
          })
            this.$router.push({
              path:"/member/account",
              query:{showIndex:1,}
            })
        }
      }).catch(error=>{
          console.log(error)
      })
    },
    // 手机号完整性校验
    checkMobile(){
        this.$refs["phoneForm"].validate((valid) => {
        if (valid) {
            checkMobile({mobile:this.phoneForm.phone}).then(res=>{
                if(res.data.code !== 0){
                  this.$message({
                        type:'error',
                        message: res.data.msg,
                        offset: 300
                    })
                  this.$router.push({
                    path:"/member/account",
                    query:{
                        showIndex:1,
                    }
                  })
                  return false;
                }
               this.wxBind();
            }).catch(error=>{
                console.log(error)
            })
        }
      });
    },
    getUserInfo() {
      getUserDetail().then((res) => {
        if (res.data.code !== 0) {
          this.$message({
            type: "error",
            message: res.data.msg,
            offset: 400,
          });
         return false;
        }
        this.phoneForm.invisiblePhone = this.filterMobile(res.data.data.mobile);
        this.userInfo = res.data.data;
      });
    },
    filterMobile(value) {
      if (value) {
        var reg = /^(\d{3})\d*(\d{4})$/;
        var str = value.replace(reg, "$1****$2");
        return str;
      }
    },
    
  },
  created(){
    this.state = this.$route.query.state;
    this.code = this.$route.query.code;
  },
  mounted() {
    if(this.state){
      this.loading = false;
    }
    this.getUserInfo();
  },
};
</script>

<style scoped>
.safe_set {
  width: 480px;
  height: 451px;
  font-family: "Microsoft YaHei";
  background-color:  rgba(255, 255, 255, 1);
  position: absolute;
  top: 80px;
  right: 380px;
  border-radius: 5px;
}
.tab_head {
  margin-top: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 400;
  margin-bottom: 30px;
}
.tab_head > span:nth-of-type(1) {
  display: inline-block;
  width: 6px;
  height: 18px;
  background: #3d85dc;
  opacity: 1;
  border-radius: 5px;
}
.tab_head > span:nth-of-type(2) {
  font-size: 16px;
  color: #373d40;
  margin-left: 12px;
  margin-right: 8px;
}
.accountInfo {
  margin-top: 30px;
  margin-left: 25px;
}
.text {
  display: inline-block;
  height: 18px;
  vertical-align: middle;

}
.changePwd {
  display: inline-block;
  color: #3da1ff;
  font-size: 14px;
  margin-left: 15px;
}
.changePwd:hover {
  cursor: pointer;
}
.wid {
  width: 360px;
  line-height: 48px;
}
.authText {
  color: #999999;
  line-height: 30px;
}
.authInfo {
  width:350px;
  font-size: 14px;
  font-weight: bold;
  color: #3c3c3c;
  text-align: center;
}
.authColor {
  margin-left: 20px;
  font-size: 14px;
  color: #3da1ff;
}
.authtext {
  font-size: 14px;
  color: #4b4949;
}
.info {
  color:#888888;
  padding-left: 10px;
  height: 30px;
}
.btn1 {
  margin-left: 20px;
}
.btn2 {
  margin-left: 20px;
}
.info + .btn1 {
  padding:5px 15px;
}
.info + .btn1:hover {
  padding:5px 15px;
  color: #409EFF;
  background: #ecf5ff;
  border-color: #b3d8ff;
  cursor: auto;
}
.set_index {
  margin-top: 50px;
  margin-left: 100px;
}
.wechat-qrcode {
  width: 240px;
  margin-left: 18%;
}
.btn-custom-cancel {
  float: right;
  margin-left: 10px;
}
.new-bind {
  font-size: 14px;
  color: #666666;
  margin-left: -14px;
}
.bind-icon-contain{
  margin-top: 15px;
  padding-left: 53px;
}
.wx-icon-sty{
  width: 24px;
  height: 24px;
  margin-right: 10px;
  vertical-align: middle;
}
.bind-icon-item{
  display: inline-block;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
}
.bind-link{
  margin-left: 5px;
}
.wid>>>.el-input__inner {
  padding:0 30px !important;
  height: 48px;

}
.safe_set > .bind_wrapper {
    width: 480px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;
}
.for-safe-title{    
    display: flex;
    align-items: center;
    margin: 50px 0;
}
.for-safe-title h3{
    text-align: center;
    color: #333;
    font-size: 22px;
    font-weight: 500;
    line-height: 40px;
    margin-left: 10px;
}
.safe-icon{
    width: 36px;
    margin-left: 35px;
}
.safe-icon img{
    width: 100%;
}
.bindAuth{
    display: flex;
    align-items: center;
    /* margin-left: 50px; */
    margin-top:-20px;
    font-weight:bold;
    font-size:15px;
    color:#333333;
}
.authInfo{
    margin-left: 50px;
    margin-top:25px;
}
.safe-button{
    /* margin: 30px 0 0 30px; */
    width: 410px;
    height: 46px;
    margin: 40px 0 60px 35px;
    font-size: 12px;
}
.safe-button :hover{
    background: #409eff;
}
</style>