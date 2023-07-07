<template>
  <div class="init-order-login">
    <div class="order-head">
      <img class="logo" @click="toHome" src="@/assets/images/home/wotao@2x.png" alt="">
      <div class="time-line">
        <div class="now-line">
          <p class="line success-line"></p>
          <p class="num success-num">1</p>
          <p style="color:#CAECB6">确认产品信息</p>
        </div>
        <div class="now-line">
          <p class="line active-line"></p>
          <p class="num now-num">2</p>
          <p style="color:#7ABD54">登录/授权</p>
        </div>
        <div class="now-line">
          <p class="line"></p>
          <p class="num">3</p>
          <p style="color: #CCCCCC">再次确认信息</p>
        </div>
        <div class="now-line">
          <p class="line"></p>
          <p class="num">4</p>
          <p style="color: #CCCCCC">提交订单</p>
        </div>
      </div>
    </div>

    <div class="unit_authentication">
      <div class="authentication_title">
        <span>单位授权认证</span>
      </div>
      <div class="unit_form">
        <el-form :model="unitForm" ref="unitForm" label-width="150px" size="medium">
          <el-form-item label-width="65px">
            <div class="tip-sty">请填写真实完善的信息，认证资料审核通过后将与您的账号进行绑定且不可修改</div>
          </el-form-item>
          <el-form-item label="认证方式">
            <el-radio v-for="item in unitTypeList" v-model="unitForm.authWay" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-form-item>
          <el-form-item label="单位名称" >
            <el-input disabled maxlength="50" v-model.trim="unitForm.orgName" />
          </el-form-item>
          <el-form-item label="统一社会信用代码" >
            <el-input disabled maxlength="50" v-model.trim="unitForm.creditCode" />
          </el-form-item>
          <el-form-item label="签约人手机号">
            <el-input disabled maxlength="50" v-model.trim="unitForm.mobile" />
          </el-form-item>
        </el-form>
        <div class="submit" @click="submit()">提 交</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/CodeChange"
import { addCompanyAuthorizer} from "@/api/auth";
import { getOrderUsrerInfo } from '~/api/order'
export default {
  head() {
    return {
      title: "单位授权",
      meta: [
        { name: "keywords", content: "单位授权" },
        {
          hid: "description",
          name: "description",
          content: "单位授权",
        },
      ],
    };
  },
  data() {
    return {
      pcUrl: process.env.PC_URL,
      resetStatus: false,
      areaOptions: [],
      unitTypeList: [
        {
          name: "法人授权认证（实时）",
          id: 3,
        },
        {
          name: "对公打款认证（3个工作日之内）",
          id: 1,
        },
      ],
      unitForm: {
        authWay: 3,
        orgName: "",
        creditCode: "",
        area: "",
      },
    };
  },
  mounted() {
    this.getConfirmOrderUserInfo(this.$route.query.id);
  },
  methods: {
    toHome(){
      window.open('/','_self');
    },
    getConfirmOrderUserInfo(orderId){
      getOrderUsrerInfo({orderId: orderId}).then(res=>{
        this.orderUserInfo = res.data.data;
        this.unitForm.orgName = this.orderUserInfo.companyName;
        this.unitForm.creditCode = this.orderUserInfo.organization;
        this.unitForm.mobile = this.orderUserInfo.mobile;
      })
    },
    submit() {
      this.$refs.unitForm.validate((valid) => {
        if (valid) {
          let param = {
            autClient: 1, // 认证来源 1-PC 2-小程序 3-H5
            verifiedWay: this.unitForm.authWay, // 授权方式 1：对公打款；3：法人身份（授权）认证
            organization: this.orderUserInfo.organization,
            companyName: this.unitForm.orgName,
            mobile: this.orderUserInfo.mobile,
            returnUrl: this.pcUrl +'/order/order-initInfo?id='+ this.$route.query.id
          };
          //addCompanyAuthorizer
          addCompanyAuthorizer(param,this.resetStatus).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              // 跳转到法大大认证页面
              window.location.replace(res.data.data)
            }else{
              this.$message({
                type:"warning",
                message:res.data.msg,
                offset:300
              })
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.init-order-login{
  width: 1190px;
  min-height: 200px;
  margin: 0 auto;
  color: #666666;
}
.now-line{
  text-align: center;
}
.logo{
  width: 222px;
  height: 64px;
  margin-top: 20px;
  cursor: pointer;
}
.time-line{
  display: flex;
  margin-top: 46px;
  font-size: 14px;
}
.line{
  width: 131px;
  border: 1px solid #CCCCCC;
}
.success-line{
  border: 1px solid #CAECB6;
}
.active-line{
  border: 1px solid #7ABD54;
}
.num{
  width: 19px;
  height: 19px;
  line-height: 19px;
  margin: 0 auto;
  margin-top: -10px;
  color: #FFFFFF;
  border-radius: 50%;
  background: #CCCCCC;
}
.success-num{
  background: #CAECB6;
}
.now-num{
  background: #7ABD54;
}
.order-head{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.logo{
  width: 206px;
  height: 60px;
  margin-top: 20px;
}
.unit_authentication {
  background: #ffffff;
  width: 1189px;
  min-height: 600px;
  margin: 0 auto;
  margin-top: 30px;
  border: 1px solid #e8f5fc;
  /* background: #e8f5fc; */
  border-radius: 5px;
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
  width: 700px;
  margin: 0 auto;
  margin-top: 40px;
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