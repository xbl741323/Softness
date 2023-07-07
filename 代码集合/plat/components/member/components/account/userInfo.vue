<template>
  <div class="user_info">
    <!-- 账户主体切换 -->
    <div class="account_tab">
      <span class="account_main"> 账户主体:</span>
      <el-radio-group v-model="accountType">
        <el-radio :label="1" :disabled="accountStatus == '1'">单位</el-radio>
        <el-radio :label="0" :disabled="accountStatus == '1'">个人</el-radio>
      </el-radio-group>
    </div>
    <!-- 内容切换 -->
    <unit @to-safe='toSafe' :unitForm='unitForm' @refresh='refresh' v-if="accountType == 1"></unit>
    <personal @to-safe='toSafe' :unitForm='unitForm' @refresh='refresh' v-if="accountType == 0"></personal>
  </div>
</template>

<script>
import { getUserDetail } from "@/api/member";
import { getUserInfo } from "@/api/login";
import unit from "./unit";
import personal from "./personal";
export default {
  components: {
    unit,
    personal,
  },
  data() {
    return {
      accountStatus: "1", //认证状态
      accountType: 1,
      cdnPath: process.env.CDN_BASE_URL,
      unitForm: {
        id: "",
        userId: "",
        unitName: "",
        unitType: "",
        industryType: [],
        area: [],
        detailArea: "",
        saleCount: "",
        patentCount: "",
        unitCount: "",
        contactMan: "",
        phone: "",
        jobTitle: "",
        unitLogoUrl:"https://static.wotao.com/icon/head/d1f4aae31a3b464aa1cc4db3e2aee0ab.png",
        logoBase64: null,
        soloLogoUrl:"https://static.wotao.com/icon/head/d1f4aae31a3b464aa1cc4db3e2aee0ab.png",
      },
    };
  },
  computed: {
    authStatus() {
      return this.$store.state.certificationStatus;
    },
  },
  methods: {
    toSafe() {
      this.$emit("to-safe");
    },
    refresh() {
      this.getUserInfo();
      getUserInfo().then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res.data.data));
      });
    },
    getUserInfo() {
      getUserDetail().then((res) => {
        let userObj = res.data.data;
        this.accountStatus = res.data.data.userVO.certificationStatus; //认证状态
        this.accountType = userObj.accountType == null ? 1 : userObj.accountType;
        this.unitForm.accountStatus = this.accountStatus;
        this.unitForm.id = userObj.id;
        this.unitForm.phone = userObj.phone;
        this.unitForm.userId = userObj.userVO.id == null ? "" : userObj.userVO.id;
        this.unitForm.accountId = userObj.id == null ? "" : userObj.id;
        this.unitForm.unitName = userObj.userVO.orgName == null ? "" : userObj.userVO.orgName;
        this.unitForm.unitType = userObj.userVO.orgType == null ? "" : Number(userObj.userVO.orgType);
        this.unitForm.detailArea = userObj.userVO.orgDetailAddress == null ? "" : userObj.userVO.orgDetailAddress;
        // 单位专有
        this.unitForm.saleCount = userObj.userVO.unitVO.orgSalesYear == null ? "" : Number(userObj.userVO.unitVO.orgSalesYear);
        this.unitForm.patentCount = userObj.userVO.unitVO.orgPatentNumber == null ? "" : userObj.userVO.unitVO.orgPatentNumber;
        this.unitForm.unitCount = userObj.userVO.unitVO.orgEmployeesNumber == null ? "" : Number(userObj.userVO.unitVO.orgEmployeesNumber);
        this.unitForm.industryType = userObj.userVO.industrys;
        if (userObj.userVO.industrys == null) {
          this.unitForm.industryType = [];
        } else {
          this.unitForm.industryType = [];
          userObj.userVO.industrys.forEach((item) => {
            this.unitForm.industryType.push(Number(item));
          });
        }
        this.unitForm.contactMan = userObj.userVO.name == null ? "" : userObj.userVO.name;
        this.unitForm.jobTitle = userObj.userVO.job == null ? "" : userObj.userVO.job;
        if (userObj.userVO.orgAddressList == null) {
          this.unitForm.area = [];
        } else {
          this.unitForm.area = [];
          userObj.userVO.orgAddressList.forEach((item) => {
            if (item) {
              this.unitForm.area.push(Number(item));
            }
          });
        }
        this.unitForm.unitLogoUrl =
          userObj.portraitUrl == null
            ? "https://static.wotao.com/icon/head/d1f4aae31a3b464aa1cc4db3e2aee0ab.png"
            : this.cdnPath + userObj.portraitUrl + "?t=" + new Date().getTime();
        this.unitForm.soloLogoUrl =
          userObj.portraitUrl == null
            ? "https://static.wotao.com/icon/head/d1f4aae31a3b464aa1cc4db3e2aee0ab.png"
            : this.cdnPath + userObj.portraitUrl + "?t=" + new Date().getTime();
      });
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>

<style scoped>
.user_info {
  margin-left: 80px;
  padding-bottom: 100px;
}
.account_tab {
  margin-top: 40px;
  width: 300px;
}
.account_main {
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  opacity: 1;
  margin-left: 38px;
}
</style>