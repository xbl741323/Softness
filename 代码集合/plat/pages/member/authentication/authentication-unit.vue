<template>
  <div class="unit_authentication">
    <div class="authentication_title">
      <span>单位实名认证</span>
    </div>
    <div class="unit_form">
      <el-form :model="unitForm" ref="unitForm" :rules="unitRules" label-width="150px" size="medium">
        <el-form-item label-width="65px">
          <div class="tip-sty">请填写真实完善的信息，认证资料审核通过后将与您的账号进行绑定且不可修改</div>
          <div class="tip-sty">温馨提示：无法人代表的企业、事业单位及其他组织请选择对公打款认证</div>
        </el-form-item>
        <el-form-item label="认证方式" prop="authWay">
          <el-radio v-for="item in unitTypeList" v-model="unitForm.authWay" :key="item.id" :label="item.id">{{item.name}}</el-radio>
        </el-form-item>
        <el-form-item label="单位名称" prop="orgName">
          <el-input placeholder="请填写单位名称" maxlength="50" v-model.trim="unitForm.orgName" />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input placeholder="请填写真实统一社会信用代码" maxlength="50" :disabled="disabled" v-model.trim="unitForm.creditCode" />
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
import * as CodeMsg from "@/api/CodeChange"
import { submitUnitAuth, essAddAuthCompany } from "@/api/auth";
import { getAreaList } from "@/api/member";
export default {
  head() {
    return {
      title: "单位认证",
      meta: [
        { name: "keywords", content: "单位认证" },
        {
          hid: "description",
          name: "description",
          content: "单位认证",
        },
      ],
    };
  },
  data() {
    var codeValidator = (rule, value, callback) => {
      if (value && Number(value) !== 0) {
        let pattern = /^[0-9a-zA-Z]{1,}$/;
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("请填写真实统一社会信用代码或检查是否存在空格"));
        }
      } else {
        callback(new Error("请填写真实统一社会信用代码"));
      }
    };
    var nameValidator = (rule, value, callback) => {
      if (value && Number(value) !== 0) {
        let reg = /[\s]+/;
        if (!reg.test(value)) {
          callback();
        } else {
          callback(new Error("单位名称不能有空格"));
        }
      } else {
        callback(new Error("请填写单位名称"));
      }
    };
    return {
      disabled:false,
      essAuth: false,
      resetStatus: false,
      areaOptions: [],
      certifiedType: null,
      returnUrl: process.env.PC_URL +'/member/authentication',
      unitTypeList: [
        {
          name: "法人授权认证（实时）",
          id: 3,
        },
        {
          name: "对公打款认证（3个工作日之内）",
          id: 1,
        },
        {
          name: "纸质材料认证",
          id: 2,
        }
      ],
      unitForm: {
        authWay: 3,
        orgName: "",
        creditCode: "",
        area: "",
      },
      unitRules: {
        authWay: [
          { required: true, message: "请选择单位所在地", trigger: "blur" },
        ],
        orgName: [
          { required: true, validator: nameValidator, trigger: "blur" },
        ],
        creditCode: [
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
    if(sessionStorage.getItem('unitInfo')){
      this.unitForm.orgName = JSON.parse(sessionStorage.getItem('unitInfo')).companyName;
      this.unitForm.creditCode = JSON.parse(sessionStorage.getItem('unitInfo')).organization;
      this.disabled = true
      this.returnUrl = process.env.PC_URL +'/member/authentication';
    }
    if(JSON.parse(localStorage.getItem('userInfo')).organizationNoSensitive){
      this.unitForm.orgName = JSON.parse(localStorage.getItem('userInfo')).companyName;
      this.unitForm.creditCode = JSON.parse(localStorage.getItem('userInfo')).organizationNoSensitive;
      this.disabled = true
      this.essAuth = true;
      this.returnUrl = process.env.PC_URL +'/member/order';
    };
    if(JSON.parse(sessionStorage.getItem('orderPath'))){
      this.returnUrl = JSON.parse(sessionStorage.getItem('orderPath'));
    };
    if(JSON.parse(localStorage.getItem('userInfo')).certifiedType){
      this.certifiedType = JSON.parse(localStorage.getItem('userInfo')).certifiedType;
    };
        console.log(this.returnUrl);
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
            verifiedWay: this.unitForm.authWay, // 授权方式 1：对公打款；3：法人身份（授权）认证 2 纸质材料认证
            organization: this.unitForm.creditCode,
            companyName: this.unitForm.orgName,
            diyOrgAddress: this.unitForm.area.join(','),
            returnUrl: this.returnUrl
          };
          if(this.essAuth&&this.certifiedType != 1){
            param.Delete()
            essAddAuthCompany(param).then((res) => {
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
            });
          }else{
            submitUnitAuth(param,this.resetStatus).then((res) => {
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
              sessionStorage.removeItem('orderPath');
              // 跳转到法大大认证页面
              window.location.replace(res.data.data)
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
  margin-left: 255px;
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