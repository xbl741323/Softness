<template>
  <div class="authentication">
    <p class="authentication_title">身份认证</p>
    <!-- 进行了认证操作-有认证状态 -->
    <div class="result" v-if="hasAuth&&loading">
      <img src="@/assets/images/member/cuowu@2x.png" v-if="authStatus == 4" alt="" />
      <img src="@/assets/images/member/shenhe@2x.png" v-if="authStatus == 3 || authStatus == 5 || authStatus == 1" alt="" />
      <img src="@/assets/images/member/success@2x.png" v-if="authStatus == 2||(authStatus==0&&authorizedType==1)" alt="" />
      <!-- 认证未完成，继续认证 -->
      <div v-if="authStatus == 3 || authStatus == 1">
        <div v-if="authInfo.autType == 2">
          <p class="result_title">您的单位高级实名认证尚未完成，请继续认证！</p>
          <p class="new-auth">单位名称：{{ authInfo.companyName }}</p>
          <p class="new-auth">统一社会信用代码：{{authInfo.organization}}</p>
        </div>
        <div v-if="authInfo.autType == 1">
          <p class="result_title">您的个人实名认证正在进行中</p>
          <p class="new-auth">真实姓名：{{ authInfo.personName }}</p>
          <p class="new-auth">身份证号：{{authInfo.idCard}}</p>
        </div>
        <div class="reset-btn-contain">
          <span @click="resetSubmit()" v-if="authInfo.status != 3">重新认证</span>
          <span @click="continueAuth()">继续认证</span>
        </div>
        <div class="warning-auth">
          <span>选择重新认证，之前已有的认证消息会作废，</span>
          <span>请谨慎选择！</span>
        </div>
      </div>
      <!-- 认证未完成，继续认证/重新认证 status = 6-->
      <div v-if="authStatus == 6">
        <div v-if="authInfo.autType == 2">
          <p class="result_title">您的单位高级实名认证尚未完成，请继续认证！</p>
          <p class="new-auth">单位名称：{{ authInfo.companyName }}</p>
          <p class="new-auth">统一社会信用代码：{{authInfo.organization}}</p>
        </div>
        <div v-if="authInfo.autType == 1">
          <p class="result_title">您的个人实名认证正在进行中</p>
          <p class="new-auth">真实姓名：{{ authInfo.personName }}</p>
          <p class="new-auth">身份证号：{{authInfo.idCard}}</p>
        </div>
        <div class="reset-btn-contain">
          <span @click="againUpdateAuth(authInfo.autType)" v-if="authInfo.status != 3">重新认证</span>
          <span @click="againAuth()">继续认证</span>
        </div>
        <div class="warning-auth">
          <span>选择重新认证，之前已有的认证消息会作废，</span>
          <span>请谨慎选择！</span>
        </div>
      </div>
      <!-- 未通过认证 -->
      <div v-if="authStatus == 4">
        <p class="result_title" v-if="authInfo.autType == 2">很抱歉，您的单位实名认证未通过审核！</p>
        <p class="result_title" v-if="authInfo.autType == 1">很抱歉，您的个人实名认证未通过审核！</p>
        <p class="reslut_desc">未通过原因：{{ authInfo.auditFailReason }}</p>
        <p class="reSubmit" @click="resetSubmit()">重新提交申请</p>
      </div>
      <!-- 已通过认证 -->
      <div v-if="(authStatus == 2||(authStatus==0&&authorizedType==1)) && authInfo.autType == 2">
        <p class="result_title" v-if="authorizedType == 1">您已通过单位初级实名认证！</p>
        <p class="result_title" v-if="authorizedType == 2">您已通过单位高级实名认证审核！</p>
        <p class="result_success">单位名称：{{authInfo.companyName }}</p>
        <p class="result_success">统一社会信用代码：{{authInfo.organization}}</p>
        <el-button type="primary" class="result_btn" @click="updateAuth(2)" v-if="isManager==1 && authorizedType == 2">更新认证</el-button>
        <el-button type="primary" class="result_btn" @click="toAuth(1)" v-if="authorizedType == 1">单位高级认证</el-button>
      </div>
      <div v-if="authStatus == 2 && authInfo.autType == 1">
        <p class="result_title">您已通过个人实名认证审核！</p>
        <p class="result_success">真实姓名：{{authInfo.personName}}</p>
        <p class="result_success">身份证号：{{authInfo.idCard}}</p>
        <el-button type="primary" class="result_btn" @click="updateAuth(1)"  v-if="isManager==1">更新认证</el-button>
      </div>
    </div>
    <!-- 未进行认证操作 -->
    <div v-if="!hasAuth&&loading">
      <div class="tip-sty">
      实名认证时，企业主体请尽量避免使用个人认证方式，以免企业人员变动或交接引起不必要的纠纷。
    </div>
    <p @click="authRules()" class="auth_rules">实名认证规则</p>
    <div class="auhentication_grid" >
      <div class="authentication_dept" :class="userInfo.userType == 2 ? 'active' : ''">
        <div class="label">
          <div v-if="userInfo.userType == 2">
            <img src="@/assets/images/member/tieqian@2x.png" />
            <p>当前账户类型</p>
          </div>
        </div>
        <div class="img">
          <img src="@/assets/images/member/unit@2x.png" alt="单位认证" />
        </div>
        <p>单位认证</p>
        <p>这是一项身份识别服务，请注意以下几点：请确保您是具有法人资格的商户，您需提供可证明您依法设立、依法经营，开展社会活动的执照、证件等(如营业执照副本)，证件有效期在三个月内的商户，请在工商部门更新资料后再进行提交。</p>
        <p @click="toAuth(1)">立即认证</p>
      </div>
      <div class="authentication_dept" :class="userInfo.userType == 1 ? 'active' : ''">
        <div class="label">
          <div v-if="userInfo.userType == 1">
            <img src="@/assets/images/member/tieqian@2x.png" />
            <p>当前账户类型</p>
          </div>
        </div>
        <div class="img">
          <img src="@/assets/images/member/user@2x.png" alt="个人认证" />
        </div>
        <p>个人认证</p>
        <p>个人实名信息必须真实有效，证件有效期在三个月内的个人，请在公安部门更新身份证后再进行提交。</p>
        <p @click="toAuth(0)">立即认证</p>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/CodeChange"
import { getAuthStatus, getAuthUrl} from "@/api/auth";
import { getUserDetail} from "@/api/member";
import { mapState } from "vuex";
export default {
  head() {
    return {
      title: "身份认证",
      meta: [
        { name: "keywords", content: "身份认证" },
        {
          hid: "description",
          name: "description",
          content: "身份认证",
        },
      ],
    };
  },
  data() {
    return {
      loading:false,
      userInfo: {},
      continueUrl:'',
      authInfo:{}, // 认证结果
      authStatus: null, // 认证状态 0:未激活；1:未认证；2:审核通过；3:已提交待审核；4:审核不通过 
      hasAuth: false,
      authorizedType: null,
      updateAuthedUrl: '',
      isManager: null,
      authRule: "<div style='text-align: left;'>&nbsp; &nbsp; &nbsp;实名认证规则为满足法律法规的要求，向您提供产品和服务之目的或您主动对卧涛网账号进行身份认证时，您需要向我们提供以下信息：</div><div style='text-align: left;'>一、如您是单位用户，您需要向我们提供单位名称、营业执照、法人真实姓名等信息；</div><div style='text-align: left;'>二、如您是个人用户，您需向我们提供您的真实姓名、身份证号码信息。</div><div style='text-align: left;'>&nbsp; &nbsp; &nbsp;基于您的主动选择或因法律法规要求或合同履行的必要，我们会收集您的以上信息。为了验证您提供信息的准确性和完整性，或保障您的账号安全，您同意卧涛网可在必要时将您向卧涛网提供的身份信息与法律法规允许的机构或政府机关授权的机构所保存的您的身份信息进行比对核验。如果您不使用相关功能，则无需提供上述信息。</div>",
    };
  },
  computed: {
    ...mapState({
      loginInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    this.getAuthenStatus();
    this.getUserDetail()
    this.userInfo = this.loginInfo
    sessionStorage.removeItem('unitInfo');
  },
  methods: {
    continueAuth(){      
      // 继续认证按钮
      getAuthUrl().then(res=>{
        if(res.data.code == 0){
          this.continueUrl = res.data.data;
          window.open(this.continueUrl,'_self');
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg,
            offset: 300,
            duration: 2000
          });
        }
      }); 
    },
    // 重新发起认证
    resetSubmit() {
      this.hasAuth = false;
      sessionStorage.setItem('resetAuth',true)
    },
    toAuth(val) {
      this.getAuthenStatus()
      let url = val == 1 ? "authentication-unit" : "authentication-personal";
      this.$router.push(`authentication/${url}`);
    },
    // 获取认证状态 
    getAuthenStatus() {
      this.loading = false
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
          this.authStatus = 1
          this.hasAuth = Number(this.authStatus) > 0? true : false
          this.loading = true
          this.updateAuthedUrl = ''
          return false
        }
        // sessionStorage.setItem('unitInfo',JSON.stringify(this.authInfo));
        this.authInfo = res.data.data
        this.authorizedType = res.data.data.authorizedType
        this.authStatus = res.data.data.status
        this.hasAuth = (Number(this.authStatus) > 0 || this.authorizedType)? true : false
        this.loading = true
        this.updateAuthedUrl = res.data.data.updateAuthedUrl
      });
    },
    getUserDetail(){
      getUserDetail().then(res=>{
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
        this.isManager = res.data.data.isManager
      })
    },
    authRules() {
      this.$alert(this.authRule, "实名认证规则", {
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        center: true,
        showCancelButton: false,
      });
    },
    updateAuth(type){
      if(type == 1){
        this.$router.push("/member/update/auth-person")
      }else{
        this.$router.push("/member/update/auth-unit")
      }
    },
    // status = 6时 重新认证
    againUpdateAuth(val){
      if(val == 1){
        this.$router.push({
          path: '/member/update/auth-person',
          query: {
            isAgain: true
          }
        })
      }else{
        this.$router.push({
          path: '/member/update/auth-unit',
          query: {
            isAgain: true
          }
        })
      } 
    },
    // status = 6时 继续认证
    againAuth(){
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
          this.updateAuthedUrl = ''
          return false
        }
        this.authInfo = res.data.data
        this.authStatus = res.data.data.status
        this.hasAuth = Number(this.authStatus) > 0? true : false
        this.updateAuthedUrl = res.data.data.updateAuthedUrl
        window.location.replace(this.updateAuthedUrl)
      })
    }
  },
};
</script>

<style scoped>
.authentication {
  background: #ffffff;
  width: 950px;
  margin-bottom: 0;
}
.authentication_title {
  font-size: 18px;
  font-weight: 550;
  line-height: 55px;
  padding-left: 20px;
  border-bottom: 1px #e0f2fb solid;
}
.empty_box {
  height: 550px;
}
.auhentication_grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.authentication_dept {
  position: relative;
  width: 330px;
  height: 419px;
  color: #333333;
  border: 1px #cecece solid;
  text-align: center;
  margin: 10px auto;
  border-radius: 10px;
  user-select: none;
}
.label {
  width: 96px;
  height: 36px;
  position: relative;
}
.label img {
  position: absolute;
  width: 96px;
  height: 36px;
  left: -13px;
  top: 10px;
}
.label p {
  position: absolute;
  font-size: 12px;
  color: #ffffff;
  top: 23px;
}
.img {
  margin: 0 auto;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #eef5f8;
}
.img img {
  width: 40px;
  height: 40px;
  margin-top: 20px;
}
.authentication_dept :nth-child(3) {
  font-size: 18px;
  font-weight: 550;
  margin-top: 20px;
}
.authentication_dept :nth-child(4) {
  font-size: 14px;
  margin: 25px auto;
  width: 268px;
  height: 125px;
  text-indent: 2em;
  text-align: left;
}
.authentication_dept :nth-child(5) {
  color: #36a6fe;
  width: 180px;
  height: 40px;
  border: 1px #36a6fe solid;
  border-radius: 6px;
  line-height: 38px;
  font-size: 18px;
  font-weight: 540;
  margin: 0 auto;
  margin-bottom: 40px;
  transition: 0.5s;
}
.authentication_dept :nth-child(5):hover {
  background: linear-gradient(132deg, #3f9cfe, #6ec7ff 100%);
  color: #ffffff;
  cursor: pointer;
}
.authentication_dept:hover {
  border: 2px #36a6fe solid;
}
.active {
  border: 2px #36a6fe solid;
}
.auth_rules {
  font-size: 14px;
  color: #36a6fe;
  cursor: pointer;
  text-align: right;
  margin: 20px;
}
.result {
  width: 334px;
  height: 500px;
  margin: 0 auto;
  padding-top: 15%;
  line-height: 25px;
  text-align: center;
  white-space: nowrap;
}
.result_title {
  font-size: 16px;
  font-weight: 550;
  margin: 10px 0;
}
.reslut_desc {
  font-size: 12px;
  color: #4aa6fe;
  white-space: normal;
  width: 500px;
  margin-left: -70px;
}
.result_success {
  font-family: "Microsoft YaHei, Microsoft YaHei-Regular";
  font-size: 16px;
  color: #333333;
  text-align: left;
  margin-left: 20px;
  margin-top: 5px;
}
.result_btn {
  width: 120px;
  height: 40px;
  margin-top: 15px;
}
.new-auth{
  font-size: 16px;
  color: #555555;
  text-align: center;
}
.result img {
  width: 64px;
  height: 64px;
  margin: 0 auto;
}
.reSubmit {
  color: #36a6fe;
  width: 150px;
  height: 40px;
  border: 1px #36a6fe solid;
  border-radius: 6px;
  line-height: 38px;
  font-size: 18px;
  font-weight: 540;
  margin: 10px auto;
  margin-bottom: 40px;
  background: linear-gradient(132deg, #3f9cfe, #6ec7ff 100%);
  color: #ffffff;
  cursor: pointer;
}
.tip-sty {
  padding-top: 50px;
  padding-left: 70px;
  color: #999999;
  font-size: 16px;
}
.reset-btn-contain{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
}
.reset-btn-contain span{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #36a6fe;
  border-radius: 4px;
  color: #36A6FE;
  cursor: pointer;
}

.reset-btn-contain>span:nth-of-type(1){
  margin-right: 48px;
  border: 1px solid #E8E8E8;
  color: #999999;
}

.warning-auth{
  margin-top: 12px;
  font-size: 12px;
  color: #CCCCCC;
}

.warning-auth>span:nth-of-type(2){
  color: #FE9819;
}
.focusTip{
  background: skyblue;
}
</style>