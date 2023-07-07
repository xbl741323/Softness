<template>
  <div class="wt_find_pwd">
    <reg-wrapper></reg-wrapper>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="20%" top="40vh" :close-on-click-modal="false" center>
            <div class="close_find">
                拖动下方滑块完成拼图
                <span @click="dialogVisible = false">+</span>
            </div>
            <div>
                <vertify @msgSlider="rulePass" v-if="msgVerify"></vertify>
            </div>
        </el-dialog>
    <!-- 忘记账号 -->
    <div class="find_wrapper" >
      <div class="find_container">
          <div v-if="forgetAccount">
            <div class="find_text">忘记账号</div>
            <div class="find_tip" >
              <img src="@/assets/images/tip.png" alt="" class="find_img">&nbsp;请输入您认证时的真实信息用于找回账号名（暂只支持已完成卧涛网实名认证的用户）
            </div>
            <div class="info">
              <el-tabs v-model="tabName" stretch>
                <el-tab-pane name="unit" label="单位认证信息">
                  <el-form :model="unitForm" ref="unitForm" label-width="140px" :rules="unitRules">
                    <el-form-item prop="unitName" label="单位名称:">
                        <el-input v-model.trim="unitForm.unitName" placeholder="请输入所认证的单位名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="code" label="统一社会信用代码:">
                        <el-input v-model.trim="unitForm.code" placeholder="请填写真实统一社会信用代码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="submit1" @click="unitValidate">确定</el-button>
                  </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane name="person" label="个人认证信息">
                  <el-form :model="personForm" ref="personForm"  label-width="100px" :rules="personRules">
                    <el-form-item prop="personalName" label="真实姓名:">
                        <el-input v-model.trim="personForm.personalName" placeholder="请输入所认证的真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item prop="idNumber" label="身份证号码:">
                        <el-input v-model.trim="personForm.idNumber" placeholder="请填写身份证号码"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" class="submit2" @click="personValidate">确定</el-button>
                    </el-form-item>
                </el-form>
                </el-tab-pane>
              </el-tabs>
              <div class="goNext">
                <span @click="toRegister">注册</span>
                <span>|</span>
                <span @click="toLogin">登录</span>
              </div>
            </div>
          </div>

        <!-- 找回账号成功弹窗 -->
        <div v-if="success&&userList&&userList!=null" class="success">
          <div class="success_box">
            <div class="success_content">
              <div class="img_box">
                <img src="@/assets/images/member/success.png" alt="" class="success_img">
              </div>
              <div class="success_text">找回账号名成功！请牢记你的账号信息</div>
              <div class="success_info">
                <span>账号名：{{userName}}</span>&nbsp;&nbsp;
                <span>手机：{{mobile}}</span>
              </div>
              <div>
                <span @click="toLogin" class="tologin">重新登录</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vertify from "~/components/login/vetify";
import regWrapper from "~/components/login/regWrapper";
import { findAccount} from '@/api/find'
export default {
  layout: "empty",
  components: {
    regWrapper,
    vertify
  },
  head () {
    return {
      title: '找回账号',          
    }
  },
  data() {   
    return {
      dialogVisible: false,
      msgVerify:true,
      tabName:"unit",
      unitForm:{
        unitName:"",
        code:""
      },
      personForm:{
        personalName:"",
        idNumber:""
      },
      unitRules: {
        unitName: [{ required: true, message: "请输入单位名称",pattern: /^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/, trigger: "blur"}],
        code: [{ required: true, message: "请输入正确的信用代码", pattern: /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/,trigger: "blur"}]
      },                                                                  
      personRules: {
        personalName: [{ required: true,message: "请输入真实姓名",  trigger: "blur",pattern: /^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/}],
        idNumber: [{ required: true, message: "请输入正确的身份证号码", trigger: "blur",pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/}]
      },
      forgetAccount:true,
      success:false,
      userList:[],
      mobile:"",
      userName:""
    }
  },
  methods: {
    rulePass(val) {  
      this.msgSlider = val;    
      if(this.msgSlider !== true){
        this.msgVerify = true
        this.dialogVisible = true
        return false;
      }
      if(this.tabName == 'unit'){
        this.unitValidate()
        this.findAccount();
      }else{
        this.personValidate()
        this.findAccount();

      }
      this.msgVerify = false
      this.dialogVisible = false
      
    },
    unitValidate() {
        if(this.tabName=='unit'){
          this.$refs["unitForm"].validate((valid) => {
            if (valid) {
              this.msgVerify = true
              this.dialogVisible = true
            }
          });
        }
    },
    personValidate(){
        this.$refs["personForm"].validate((valid) => {
            if (valid) {
              this.msgVerify = true
              this.dialogVisible = true
            }
        });
    },
    findAccount(){
      let params = {
        authType: this.tabName == 'unit' ? "2":"1",
        name:this.tabName == 'unit' ? this.unitForm.unitName : this.personForm.personalName,
        code:this.tabName == 'unit' ? this.unitForm.code : this.personForm.idNumber
      }
      findAccount(params).then(res=>{
        if(res.data.code !== 0){
          this.$message({
              message: res.data.msg,
              type: 'warning',
              showClose: true,
              offset:200,
          });
          return false;
        }
        this.userList = res.data.data;
        this.userList.forEach(item=>{
          this.mobile = item.mobile;
          this.userName = item.userName;
        })
        this.forgetAccount = false;
        this.success = true;
      })
    },
    toRegister(){
      this.$router.push({
          path: "/register",
      });
    },
    toLogin() {
        this.$router.push({
            path: "/login",
        });
      },
    },
};
</script>


<style>
.wt_find_pwd {
  position: relative;
}
.find_wrapper {
  position: absolute;
  right: 398px;
  top: 165px;
  width: 500px;
  height: 564px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 4px;
}
.find_container{
  margin:50px 0 10px 30px;
  font-size:16px;
  color:#36A6FE;
  width: 90%;
  height: 500px;
}
.find_img{
  width: 20px;
  height: 20px;
  line-height: 20px;
  vertical-align: middle;
}
.find_tip{
  margin-top: 20px;
  font-size: 14px;
  font-family: "Microsoft YaHei";
  font-weight: normal;
  text-align: left;
  color: #6c6c6c;
}
.find_text{
  margin-bottom:20px;
  font-size: 16px;
}
.close_find {
    width: 410px;
    height: 40px;
    background: #fff;
    position: absolute;
    top: -132px;
    text-align: center;
    font-size: 16px;
    line-height: 40px;
}
.close_find span {
    position: absolute;
    right: 5px;
    bottom: 1px !important;
    font-size: 40px;
    cursor: pointer;
    transform: rotate(45deg);
}
.info .el-input__inner{
  padding: 0 15px !important;
}
.info{
  margin-top:30px;
  height: 320px;
}
.info .el-tabs--top .el-tabs__item.is-top{
  font-size: 16px;
}
.info .submit1{
  width: 410px;
  height: 46px;
  background: rgba(54, 166, 254, 1);
  opacity: 1;
  margin-left: -130px;
  font-family: "Microsoft YaHei";
  margin-top: 20px;
  border-radius: 2px;
  font-size: 18px;
  text-align: center;
}
.info .submit2{
  width: 410px;
  height: 46px;
  background: rgba(54, 166, 254, 1);
  opacity: 1;
  margin-left: -90px;
  font-family: "Microsoft YaHei";
  margin-top: 20px;
  border-radius: 2px;
  font-size: 18px;
  text-align: center;
}
.success{
  margin-top: 50px;
  height: 400px;
    text-align:center;
}
.success .tologin{
  font-size: 14px;
  font-family: "Microsoft YaHei";
  font-weight: bold;
  text-align: left;
  color: #3da1ff;
}
.success .tologin:hover{
  cursor: pointer;
}
.success_box{
  display: flex;
  position: relative;
  height: 400px;
  width:100%;
}
.success_content {
  width:350px;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.img_box{
  display: flex;
}
.success_img{
  margin: 20px auto;
}
.success_text{
  margin:10px;
  font-size: 14px;
  font-family: "Microsoft YaHei";
  font-weight: normal;
  color: #333333;
  text-align: center;

}
.success_info{
  margin: 10px;
  font-size: 12px;
  font-family: "Microsoft YaHei";
  color: #999999;
  text-align: center;
}
.goNext {
  cursor: pointer;
  float: right;
}
</style>