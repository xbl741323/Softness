<template>
  <div class="unit_authentication">
    <div v-if="userType==1" >
        <div class="authentication_title"> 
          <span>个人实名认证</span>
        </div>
        <div class="unit_form">
          <el-form :model="personForm" ref="personForm" :rules="personRules" label-width="150px" size="medium">
              <el-form-item label-width="65px">
                <div class="tip-sty">请填写真实完善的信息，认证资料审核通过后将与您的账号进行绑定且不可修改</div>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input placeholder="请填写与身份证号码一致的姓名" maxlength="50" v-model.trim="personForm.name" />
              </el-form-item>
              <el-form-item label="身份证号码" prop="idCard">
                <el-input placeholder="请填写身份证号码" maxlength="50" v-model.trim="personForm.idCard" disabled/>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input placeholder="请填写手机号码" maxlength="11" v-model.trim="personForm.phone"/>
              </el-form-item>
          </el-form>
          <div class="submit" @click="submit">提 交</div>
        </div>
    </div>
     <div  v-if="userType==2">
        <div class="authentication_title"> 
          <span>单位实名认证</span>
        </div>
        <div class="unit_form">
          <el-form :model="unitForm" ref="unitForm" :rules="unitRules" label-width="150px" size="medium">
              <el-form-item label-width="65px">
                <div class="tip-sty">请填写真实完善的信息，认证资料审核通过后将与您的账号进行绑定且不可修改</div>
              </el-form-item>
              <el-form-item label="认证方式" prop="authWay">
                <el-radio-group v-model="unitForm.authWay">
                    <el-radio :label="3">法人授权认证（实时）</el-radio>
                    <el-radio :label="1">对公打款认证（3个工作日之内）</el-radio>
                    <el-radio :label="2">纸质材料认证</el-radio>
                </el-radio-group>   
              </el-form-item>
              <el-form-item label="单位名称" prop="orgName">
                <el-input placeholder="请填写单位名称" maxlength="50" v-model.trim="unitForm.orgName" disabled />
              </el-form-item>
              <el-form-item label="统一社会信用代码" prop="creditCode">
                <el-input placeholder="请填写真实统一社会信用代码" maxlength="50" v-model.trim="unitForm.creditCode" disabled/>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile">
                <el-input placeholder="请填写手机号码" maxlength="11" v-model.trim="unitForm.mobile"/>
              </el-form-item>
          </el-form>
          <div class="submit" @click="submit">提 交</div>
        </div>
     </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/CodeChange"
import { modPerson,modCompany } from "@/api/auth";
import { getUserDetail } from "@/api/member";
import focusTip from "@/components/order/focus-tip";
export default {
  head() {
    return {
      title: "修改授权人信息",
      meta: [
        { name: "keywords", content: "修改授权人信息" },
        {
          hid: "description",
          name: "description",
          content: "修改授权人信息",
        },
      ],
    };
  },
  data() {
    return {
      personForm: {
        name: "",
        idCard: "",
        phone: ""
      },
      unitForm: {
        authWay:3,
        orgName: "",
        creditCode: "",
        mobile: ""
      },
      unitRules: {
        authWay: [{ required: true}],
        orgName: [{ required: true}],
        creditCode: [{ required: true,}],
        mobile: [{ required: true, pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, message: "请填写正确的手机号"}],
      },
      personRules: {
        name: [{ required: true,pattern:/^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/,message:'请输入正确的姓名'}],
        idCard: [{ required: true, }],
        phone: [{ required: true, pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,message: "请填写正确的手机号"}],
      },
      // 0未知 1个人 2单位
      userinfo:{},
      userType:null,
    };
  },
  mounted() {
    if(sessionStorage.getItem('resetAuth')){
      this.resetStatus = Boolean(sessionStorage.getItem('resetAuth'))
    }
    this.getUserInfo();
  },
  methods: {
    //获取用户信息
    getUserInfo() {
      getUserDetail().then((res) => {
        if (res.data.code !== CodeMsg.CODE_0) {
          this.$message({
            type: "error",
            message: res.data.msg,
            offset: 400,
            duration: 1500
          });
         return false;
        }
        let basicInfo = res.data.data;
        console.log(basicInfo)
        this.userType = basicInfo.userType&& basicInfo.userType!= null ? basicInfo.userType:null;
        this.unitForm.orgName = basicInfo.companyName&&basicInfo.companyName!=null ? basicInfo.companyName:'';
        this.unitForm.creditCode = basicInfo.organizationNoSensitive&&basicInfo.organizationNoSensitive!= null ? basicInfo.organizationNoSensitive:'';
        this.personForm.idCard= basicInfo.idCard&&basicInfo.idCard!= null ? basicInfo.idCard:'';
        basicInfo.userType == '1' ? this.personForm.phone = basicInfo.phone : this.unitForm.mobile = basicInfo.phone
      });
    },
    // 修改授权人信息
    // 单位
    modCompany(){
      this.$refs["unitForm"].validate((valid) => {
        if (valid) {
          let params = {
              autClient: 1,
              verifiedWay: this.unitForm.authWay,
              mobile: this.unitForm.mobile
          };
          modCompany(params).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              location.href = res.data.data;
            }else {
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
                duration: 1500
              });
            }
          }).catch(error=>{
              console.log(error)
          })
        }
      })
    },
    // 个人
    modPerson(){
      this.$refs["personForm"].validate((valid) => {
        if (valid) {
          let params = {
            autClient:1,
            idCardName:this.personForm.name
          }
          modPerson(params).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              location.href = res.data.data;
            }else {
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
                duration: 1500
              });
            }
          }).catch(error=>{
              console.log(error)
          })
        }
      })
    },
    submit(){
        if(this.userType == 1){
          this.modPerson();
        }
        if(this.userType==2){
          this.modCompany();
        }
    }
  
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

.unit_form :deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 550;
  color: #000000 !important;
}

.unit_form :deep( .el-input__inner) {
  width: 530px;
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