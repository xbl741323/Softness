<template>
  <div class="unit_authentication">
    <div class="authentication_title">
      <span>个人实名认证</span>
    </div>
    <div class="unit_form">
      <el-form :model="unitForm" ref="unitForm" :rules="unitRules" label-width="150px" size="medium">
        <el-form-item label-width="65px">
          <div class="tip-sty">请填写真实完善的信息，认证资料审核通过后将与您的账号进行绑定且不可修改</div>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input placeholder="请填写与身份证号码一致的姓名" maxlength="50" :disabled="disabled" v-model.trim="unitForm.name" />
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard">
          <el-input placeholder="请填写身份证号码" maxlength="50" :disabled="idCardDisabled" v-model.trim="unitForm.idCard" />
        </el-form-item>
        <el-form-item label="单位所在地" prop="area">
          <el-cascader v-model="unitForm.area" :options="areaOptions" placeholder="请选择单位所在地" :props="{ value: 'id', label: 'areaName'}" @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <div class="submit" @click="submit()">提 交</div>
    </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/CodeChange"
import { submitPersonAuth, essAddAuthPerson } from "@/api/auth";
import { getAreaList } from "@/api/member";
export default {
  head() {
    return {
      title: "个人认证",
      meta: [
        { name: "keywords", content: "个人认证" },
        {
          hid: "description",
          name: "description",
          content: "个人认证",
        },
      ],
    };
  },
  data() {
    var codeValidator = (rule, value, callback) => {
      if (value && Number(value) !== 0) {
        let pattern = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("请填写正确的身份证号码或检查是否存在空格"));
        }
      } else {
        callback(new Error("请填写身份证号码"));
      }
    };
    var nameValidator = (rule, value, callback) => {
      if (value && Number(value) !== 0) {
        let pattern = /^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/;
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("请填写真实姓名或检查是否存在空格"));
        }
      } else {
        callback(new Error("请填写姓名"));
      }
    };
    return {
      disabled: false,
      idCardDisabled: false,
      resetStatus: false,  
      essAuth: false,
      returnUrl: process.env.PC_URL +'/member/authentication',
      areaOptions: [],
      unitForm: {
        name: "",
        idCard: "",
        area: "",
      },
      unitRules: {
        name: [
          { required: true, validator: nameValidator, trigger: "blur" },
        ],
        idCard: [
          { required: true, validator: codeValidator, trigger: "blur" },
        ],
        area: [
          { required: true, message: "请选择单位所在地", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getAreaSelect();
    if(sessionStorage.getItem('resetAuth')){
      this.resetStatus = Boolean(sessionStorage.getItem('resetAuth'))
    };
    if(sessionStorage.getItem('personName')){
      this.unitForm.name = JSON.parse(sessionStorage.getItem('personName'));
      this.disabled = true;
      this.returnUrl = process.env.PC_URL +'/member/authentication'
    };
    if(JSON.parse(localStorage.getItem('userInfo')).idCardNoSensitive){
      this.unitForm.name = JSON.parse(localStorage.getItem('userInfo')).personName;
      this.unitForm.idCard = JSON.parse(localStorage.getItem('userInfo')).idCardNoSensitive;
      this.disabled = true;
      this.idCardDisabled = true;
      this.essAuth = true;
      this.returnUrl = process.env.PC_URL +'/member/order';
    };
    if(JSON.parse(sessionStorage.getItem('orderPath'))){
      this.returnUrl = JSON.parse(sessionStorage.getItem('orderPath'));
    };
  },
  methods: {
    handleChange(val) {
      console.log(val, "输出地区选择数据");
    },
    getAreaSelect() {
      getAreaList().then((res) => {
        this.areaOptions = res.data.data;
      });
    },
    handleClose() {
      this.$router.push("/member/authentication");
    },
    submit() {
      this.$refs.unitForm.validate((valid) => {
        if (valid) {
          let param = {
            autClient: 1, // 认证来源 1-PC 2-小程序 3-H5
            idCardName: this.unitForm.name,
            idCard: this.unitForm.idCard,
            diyOrgAddress: this.unitForm.area.join(','),
            returnUrl: this.returnUrl
          };
          if(this.essAuth){//老用户处理
            essAddAuthPerson(param).then(res=>{
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
            submitPersonAuth(param,this.resetStatus).then((res) => {
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
              sessionStorage.setItem('resetAuth',false)
              sessionStorage.removeItem('personName');
              sessionStorage.removeItem('orderPath');
              // 跳转到法大大认证页面
              window.location.replace(res.data.data);
            });
          };
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