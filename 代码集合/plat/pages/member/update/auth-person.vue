<template>
  <div>
    <div class="unit_authentication">
      <div class="authentication_title">
        <span>个人更新认证</span>
      </div>
      <div class="unit_form">
        <el-form :model="unitForm" ref="unitForm" :rules="unitRules" label-width="150px" size="medium">
          <el-form-item label-width="65px">
            <div class="tip-sty">请填写真实完善的信息，认证资料审核通过后将与您的账号进行绑定且不可修改</div>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input placeholder="请输入与身份证号码一致的姓名" maxlength="50" v-model.trim="unitForm.name" />
          </el-form-item>
          <el-form-item label="身份证号码" prop="idCard">
            <el-input placeholder="请输入身份证号码" maxlength="50" :disabled="idCardDisabled" v-model.trim="unitForm.idCard" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input placeholder="请输入手机号码" maxlength="11"  v-model.trim="unitForm.phone" />
          </el-form-item>
        </el-form>
        <div class="submit" @click="submit()">提 交</div>
      </div>
    </div>
    <!-- 订阅消息 -->
    <focusTip></focusTip>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/CodeChange"
import { getAuthStatus, updatePersonAuth, againUpdatePersonAuth, againUpdateCompanyAuth  } from "@/api/auth";
import focusTip from "@/components/order/focus-tip"
export default {
  head() {
    return {
      title: "个人更新认证",
      meta: [
        { name: "keywords", content: "个人更新认证" },
        {
          hid: "description",
          name: "description",
          content: "个人更新认证",
        },
      ],
    };
  },
  components: {
    focusTip
  },
  data() {
    var codeValidator = (rule, value, callback) => {
      if (value && Number(value) !== 0) {
        let pattern = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的身份证号码或检查是否存在空格"));
        }
      } else {
        callback(new Error("请输入身份证号码"));
      }
    };
    var nameValidator = (rule, value, callback) => {
      if (value && Number(value) !== 0) {
        let pattern = /^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/;
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("请输入真实姓名或检查是否存在空格"));
        }
      } else {
        callback(new Error("请输入姓名"));
      }
    };
    return {
      idCardDisabled: false,
      resetStatus: false,  
      essAuth: false,
      isAgain: false,
      returnUrl: process.env.PC_URL +'/member/authentication',
      status: '',
      areaOptions: [],
      unitForm: {
        name: "",
        idCard: "",
        phone: "",
      },
      unitRules: {
        name: [
          { required: true, validator: nameValidator, trigger: "blur" },
        ],
        idCard: [
          { required: true, validator: codeValidator, trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号码", pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    if(sessionStorage.getItem('resetAuth')){
      this.resetStatus = Boolean(sessionStorage.getItem('resetAuth'))
    };
    if(sessionStorage.getItem('personName')){
      this.unitForm.name = JSON.parse(sessionStorage.getItem('personName'));
    };
    if(JSON.parse(localStorage.getItem('userInfo')).idCardNoSensitive){
      this.unitForm.name = JSON.parse(localStorage.getItem('userInfo')).personName;
      this.unitForm.idCard = JSON.parse(localStorage.getItem('userInfo')).idCardNoSensitive;
      this.idCardDisabled = true;
      this.essAuth = true;
    };
    if(JSON.parse(localStorage.getItem('userInfo')).phone){
      this.unitForm.phone = JSON.parse(localStorage.getItem('userInfo')).phone
    }
    if(JSON.parse(sessionStorage.getItem('orderPath'))){
      this.returnUrl = JSON.parse(sessionStorage.getItem('orderPath'));
    };
    if(this.$route.query.isAgain){
      this.isAgain = this.$route.query.isAgain
    }
    this.getAuthStatus()
  },
  methods: {
    // 获取认证状态 
    getAuthStatus() {
      getAuthStatus().then((res) => {
        if(res.data.code != CodeMsg.CODE_0){
          if(res.data.code == 10002){
            localStorage.removeItem('userInfo');
            location.href = "/login";
          }else{
            this.$message({
              type:"warning",
              message:res.data.msg,
              offset:300,
              duration: 2000
            })
          }
          return false
        }
        this.status = res.data.data.status
      });
    },
    submit() {
      this.$refs.unitForm.validate((valid) => {
        if (valid) {
          let param = {
            autClient: 1, // 认证来源 1-PC 2-小程序 3-H5
            idCardName: this.unitForm.name,
            idCard: this.unitForm.idCard,
            returnUrl: this.returnUrl,
            mobile: this.unitForm.phone
          };
          if(this.status == '2' && this.isAgain == false){
            updatePersonAuth(param).then(res=>{
              if(res.data.code != CodeMsg.CODE_0){
                if(res.data.code == 10002){
                  localStorage.removeItem('userInfo');
                  location.href = "/login";
                }else{
                  this.$message({
                    type:"warning",
                    message:res.data.msg,
                    offset:300,
                    duration: 2000
                  })
                }
                return false
              }
              window.location.replace(res.data.data);
            })
          }else{
            againUpdatePersonAuth(param).then(res => {
              if(res.data.code != CodeMsg.CODE_0){
                if(res.data.code == 10002){
                  localStorage.removeItem('userInfo');
                  location.href = "/login";
                }else{
                  this.$message({
                    type:"warning",
                    message:res.data.msg,
                    offset:300,
                    duration: 2000
                  })
                }
                return false
              }
              window.location.replace(res.data.data)
            })
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.unit_authentication {
  background: #ffffff;
  width: 950px;
  height: 880px;
  margin-bottom: 0;
}
.authentication_title {
  padding-left: 20px;
  border-bottom: 1px #e0f2fb solid;
}

.authentication_title span {
  font-size: 18px;
  font-weight: 550;
  line-height: 50px;
}

.authentication_title a {
  font-size: 12px;
  color: #666666;
}

.unit_form {
  margin-top: 28px;
  margin-left: 100px;
}
.download {
  color: #fb0400;
  margin-left: 20px;
}

.unit_form >>> .el-form-item__label {
  font-size: 14px;
  font-weight: 550;
  color: #000000 !important;
}

.unit_form >>> .el-input__inner {
  width: 420px;
}

.submit {
  margin: 50px auto;
  width: 182px;
  height: 40px;
  background: #36a6fe;
  border-radius: 5px;
  text-align: center;
  line-height: 40px;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  margin-left: 250px;
}

.success_box {
  text-align: center;
  line-height: 25px;
  height: 156px;
  margin-top: 40px;
}
.success_title {
  font-size: 16px;
  font-weight: 550;
  color: #333333;
}

.success_desc {
  font-size: 12px;
  color: #333333;
}

.success_box img {
  width: 64px;
  height: 64px;
}

.tip-sty{
  color: #999999;
  font-size: 16px;
}
</style>