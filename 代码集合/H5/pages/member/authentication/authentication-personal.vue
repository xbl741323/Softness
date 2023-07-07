<template>
  <div style="position: relative">
    <mt-header title="个人认证信息" class="header">
      <router-link to="/member/authentication" slot="left">
        <mt-button icon="back"></mt-button
      ></router-link>
    </mt-header>
    <div
      class="file_item"
      v-loading="loading"
      :element-loading-text="loadcode"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    ></div>
    <div class="content">
      <div class="info">
        <p>1.个人实名信息必须<span style="color: #fd7f43">真实有效</span>；</p>
        <p>
          2.证件有效期在<span style="color: #fd7f43">三个月内</span
          >的个人，请在公安部门更新身份证后再进行提交。
        </p>
      </div>
      <div class="info">
        <p class="info-title">请填写个人信息</p>
        <el-form
          :model="orgAuthenticationForm"
          :rules="rules"
          ref="orgAuthenticationForm"
          label-width="98px"
          label-position="left"
        >
          <el-form-item label="姓名" prop="orgName">
            <el-input
              v-model="orgAuthenticationForm.orgName"
              placeholder="请填写姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="creditCode">
            <el-input
              v-model="orgAuthenticationForm.creditCode"
              placeholder="请填写身份证号"
            ></el-input>
          </el-form-item>
          <!-- 地区margin_bottom -->
          <div
            class="address_sty"
            title="个人所在地"
            @click="visible.region = true"
          >
            <span class="address_title">
              <img slot="icon" :src="imgURL" class="adress_icon" />
              <span style="margin-left: 5px">个人所在地</span>
            </span>
            <span class="address_main">
              <span>{{ account.userVO.orgAddressNameList }}</span>
            </span>
            <span class="angle_sty"></span>
          </div>
        </el-form>
        <div class="submit" @click="submit()">提 交</div>
      </div>
    </div>
    <!-- 成功提示 -->
    <el-dialog
      :visible.sync="successDialog"
      width="88%"
      :before-close="beforeClose"
    >
      <div class="success_box">
        <img src="@/assets/images/member/chenggong@2x.png" />
        <p class="success_title">您的个人实名认证提交成功！</p>
        <p class="success_desc">审核将会在2-3个工作日内完成，请您耐心等待</p>
      </div>
    </el-dialog>
    <!-- 地区选择popup-->
    <div v-if="visible.region">
      <mt-popup v-model="visible.region" position="bottom">
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="visible.region = !visible.region">
            取消
          </div>
          <div class="usi-btn-sure" @click="addSelectOk">确定</div>
        </div>
        <mt-picker
          class="picker"
          ref="refRegion"
          value-key="name"
          :slots="addSlots"
          @change="onAddressChange"
        ></mt-picker>
      </mt-popup>
    </div>
  </div>
</template>

<script>
import { getDropdown, setInfo, getUserDetail } from "@/api/user";
import { getProvince1 } from "@/api/user";
import { getUserInfo } from "@/api/login";
import { getLetter, submitPersonAuth, checkAuth } from "~/api/member";

export default {
  head() {
    return {
      title: "个人认证信息",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description",
        },
      ],
    };
  },
  data() {
    var codeValidator = (rule, value, callback) => {
      if (value && Number(value) !== 0) {
        let pattern =
          /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
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
        let pattern =
          /^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/;
        if (pattern.test(value)) {
          console.log("sddddd");
          callback();
        } else {
          callback(new Error("请填写真实姓名或检查是否存在空格"));
        }
      } else {
        callback(new Error("请填写姓名"));
      }
    };

    return {
      resetStatus: false,  
      //地区
      visible: {
        orgType: false,
        accountType: false,
        worType: false,
        sale: false,
        emCount: false,
        region: false,
      },
      shadow: true,
      account: {
        accountName: "",
        orgTypeName: "",
        userVO: {
          unitVO: {},
          expertVO: {},
        },
      },
      region: "请选择", //地区
      regionId: "",
      accountSlots: [
        {
          flex: 1,
          values: [],
        },
      ],
      saleSlots: [
        {
          flex: 1,
          values: [],
        },
      ],
      orgslots: [
        {
          flex: 1,
          values: [],
        },
      ],
      emSlots: [
        {
          flex: 1,
          values: [],
        },
      ],
      worSlots: [
        {
          flex: 1,
          values: [],
        },
      ],
      province: "北京市",
      city: "北京市",
      area: "东城区",
      proVal: "", //省地区
      addSlots: [
        {
          flex: 1,
          values: [], //省份数组
          className: "slot1",
          textAlign: "center",
        },
        {
          flex: 1,
          values: [],
          className: "slot2",
          textAlign: "center",
        },
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "center",
        },
      ],
      regionInit: false,
      imgURL: require("@/assets/images/home/icon_account_required.png"),
      checkClock: 3,
      loadcode: "请点击右上角···选择浏览器打开",
      loading: false,
      acceptType: "",
      creditCode: "",
      orgName: "",
      orgAuthenticationForm: {
        orgType: null,
        orgMethod: null,
        orgName: "",
        creditCode: "",
      },
      successDialog: false,
      clock: 3,
      clicked: false,
      showprocess: false,
      identShowprocess: false,
      identPercentlength: "",
      percentlength: "",
      isOrgNameCorrect: false,
      isCreditCodeCorrect: false,
      imageUrl: "",
      userInfo: "",
      orgTypeList: [],
      cdnUrl: process.env.CDN_BASE_URL,
      rules: {
        orgName: [
          { required: true, validator: nameValidator, trigger: "blur" },
        ],
        creditCode: [
          { required: true, validator: codeValidator, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //地址下拉框确定
    addSelectOk() {
      this.visible.region = false;
      this.account.userVO.orgAddress = this.region
        .map((item) => {
          return item.id;
        })
        .join(",");
      this.account.userVO.orgAddressNameList = this.region
        .map((item) => {
          return item.name;
        })
        .join(",");
    },
    // 地区联动选择插槽
    onAddressChange(picker, values) {
      if (!this.regionInit) {
        let city = this.proVal[values[0].index].children;
        let slots2 = [];
        let slots3 = [];
        //市
        if (city) {
          for (let i = 0; i < city.length; i++) {
            slots2.push({ id: city[i].id, name: city[i].areaName, index: i });
          }
        }
        picker.setSlotValues(1, slots2);
        //区
        if (values[1]) {
          let area = city[values[1].index].children;
          console.log(area, 22);
          if (area) {
            for (let i = 0; i < area.length; i++) {
              slots3.push({ id: area[i].id, name: area[i].areaName });
            }
          }
        }
        picker.setSlotValues(2, slots3);
      }
      console.log(values, "jieshu");
      this.region = values;
    },
    //初始化信息
    getData() {
      getUserDetail().then((res) => {
        if (res.code == 0) {
          this.account = res.data;
          // console.log(res.data,'初始化')
          // console.log(this.account.userVO.unitVO,'orgLogoUrl')

          if (this.account.accountType == 0) {
            this.account.accountName = "个人";
          } else {
            this.account.accountName = "单位";
          }
          if (this.account.userVO == undefined) {
            this.account.userVO = {};
          }
          if (this.account.userVO.unitVO == undefined) {
            this.account.userVO.unitVO = {};
          }
          if (this.account.userVO.expertVO == undefined) {
            this.account.userVO.expertVO = {};
          }
          this.value =
            this.account.userVO.industrys == null
              ? []
              : this.account.userVO.industrys;
          this.account.userVO.orgName =
            this.account.userVO.orgName == null
              ? ""
              : this.account.userVO.orgName;
          this.industryNameList =
            this.account.userVO.industryNameList == null ||
            this.account.userVO.industryNameList == ""
              ? "请选择"
              : this.account.userVO.industryNameList.join(",");
          // this.account.accountNo=this.account.accountNo==null?'请选择':this.account.accountNo
          this.account.userVO.name =
            this.account.userVO.name == null ? "" : this.account.userVO.name;
          this.account.userVO.unitVO.orgEmployeesNumber =
            this.account.userVO.unitVO.orgEmployeesNumber == null
              ? "请选择"
              : this.account.userVO.unitVO.orgEmployeesNumber;
          this.account.userVO.unitVO.orgSalesYearName =
            this.account.userVO.unitVO.orgSalesYearName == null
              ? "请选择"
              : this.account.userVO.unitVO.orgSalesYearName;
          this.account.userVO.orgDetailAddress =
            this.account.userVO.orgDetailAddress == null
              ? ""
              : this.account.userVO.orgDetailAddress;
          // this.account.userVO.unitVO.industry=this.account.userVO.industry==null?'请选择':this.account.userVO.industry
          this.account.userVO.orgAddressNameList =
            this.account.userVO.orgAddressNameList == null
              ? "请选择"
              : this.account.userVO.orgAddressNameList.join(",");
          this.account.accountName =
            this.account.accountName == null
              ? "单位"
              : this.account.accountName;
          this.account.userVO.orgTypeName =
            this.account.userVO.orgTypeName == null
              ? "请选择"
              : this.account.userVO.orgTypeName;
          if (this.account.portraitUrl) {
            this.unitLogoUrl =
              this.cdnUrl +
              this.account.portraitUrl +
              "?t=" +
              new Date().getTime();
            // console.log(this.unitLogoUrl,"输出头像！")
          }
        }
      });

      //获取地区选择省级数据
      getProvince1().then((res) => {
        this.proVal = res.data;
        // console.log(res.data)
        for (let i = 0; i < res.data.length; i++) {
          this.addSlots[0].values.push({
            id: res.data[i].id,
            name: res.data[i].areaName,
            index: i,
          });
        }
      });
    },

    beforeClose(done) {
      this.$router.push("/member/authentication");
      consle.log("done",done)
      done();
    },
    downloadLetter() {
      var ua = navigator.userAgent.toLowerCase(); //微信浏览器
      var isWeixin =
        ua.indexOf("micromessenger") != -1 || ua.indexOf("mqqbrowser") != -1;
      if (isWeixin) {
        if (ua.indexOf("micromessenger") != -1) {
          this.loadcode = "请点击右上角···选择浏览器打开";
        } else {
          this.loadcode = "请选择其他浏览器打开";
        }
        this.loading = true;
        let countdown = setInterval(() => {
          this.checkClock--;
          if (this.checkClock == 0) {
            this.loading = false;
            clearInterval(countdown);
          }
        }, 1000);
      } else {
        this.clicked = true;
        setTimeout(() => {
          if (this.isCreditCodeCorrect && this.isOrgNameCorrect) {
            let param = {
              orgName: this.orgAuthenticationForm.orgName,
              creditCode: this.orgAuthenticationForm.creditCode,
              mobilPhone: this.userInfo.accountNo,
            };
            getLetter(param).then((res) => {
              let that = this;
              let oReq = new XMLHttpRequest();
              oReq.open("GET", this.cdnUrl + res.data, true);
              oReq.responseType = "blob";
              // oReq.withCredentials = true;//如果跨域
              oReq.onload = function (oEvent) {
                let content = oReq.response;
                let elink = document.createElement("a");
                elink.download = "公函.pdf";
                elink.style.display = "none";
                let blob = new Blob([content]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
              };
              oReq.send();
              this.clicked = false;
            });
          } else {
            this.$toast({
              message: "请填写完正确信息后才可下载公函",
              position: "middle",
              duration: 3000,
            });
            this.clicked = false;
          }
        }, 500);
      }
    },
    submit() {
      this.$refs.orgAuthenticationForm.validate((valid) => {
        if (valid) {
          let param = {
            autClient: 3,
            idCardName: this.orgAuthenticationForm.orgName,
            idCard: this.orgAuthenticationForm.creditCode,
            diyOrgAddress: this.account.userVO.orgAddress,
          };
          this.account.userVO.unitVO.userId = this.account.userVO.id;
          submitPersonAuth(param,this.resetStatus).then((res) => {
            if (res.code == 0) {
              sessionStorage.setItem('resetAuth',false)
              // 跳转到法大大认证页面
              window.location.replace(res.data)
            } else {
              this.$toast({
                message: res.msg,
                position: "middle",
                duration: 3000,
              });
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    if(sessionStorage.getItem('resetAuth')){
      this.resetStatus = Boolean(sessionStorage.getItem('resetAuth'))
    }
    if (!localStorage.getItem("userInfo")) {
      // this.$router.push('/login')
    }
    (this.userInfo = JSON.parse(localStorage.getItem("userInfo"))),
      getDropdown("unittype").then((res) => {
        if (res.code == 0) {
          this.orgTypeList = res.data;
        }
      });
    var ua = navigator.userAgent.toLowerCase(); //微信浏览器
    var isWeixin = ua.indexOf("micromessenger") != -1;
    if (isWeixin) {
      this.acceptType = "*";
    } else {
      this.acceptType = ".jpg,.jpeg,.png";
    }
  },
  created() {
    console.log(this.info, "info");
    this.getData();
  },
};
</script>

<style scoped>
.header {
  background: #ffffff;
  height: 56px;
  font-size: 16px;
  color: rgb(189, 172, 172);
  box-shadow: 3px 3px 4px 0px rgba(0, 0, 0, 0.03);
  color: #333;
}
.content {
  padding: 12px;
  background: #f4f4f4;
}
.clicked {
  opacity: 0.6 !important;
}

.file_item {
  position: absolute;
  width: 100%;
  height: 2.346666666667rem;
  overflow: hidden;
}
.info {
  width: 100%;
  padding: 20px 16px;
  background: #ffffff;
  border: 1px solid #d6d6d6;
  border-radius: 10px;
  color: #666;
  font-size: 12px;
  line-height: 19px;
  margin-bottom: 12px;
}
.info-title {
  font-size: 16px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 20px;
}
.label-top >>> .el-form-item__label {
  padding: 0;
  vertical-align: middle;
  line-height: 16px;
}
.info >>> .el-input__inner {
  border: 0;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  padding: 0;
}
.info >>> .el-form-item {
  margin-bottom: 10px;
}
/* .info >>> .el-form-item__error {
  padding-top: 0px;
  top: 80%;
}
.info .radio-group >>> .el-form-item__error {
  top: 98%;
} */

.picker-toolbar-title {
  display: flex;
  justify-content: space-around;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
.usi-btn-cancel,
.usi-btn-sure {
  color: #0aa1ed;
}
.address_sty {
  width: 100%;
  height: 48px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  /* border-top: 1px solid #eee; */
}
.address_title {
  display: inline-block;
  width: 150px;
  font-size: 14px;
  padding-left: 0px;
  display: flex;
  margin-left: -5px;
  align-items: center;
  justify-content: left;
}
.adress_icon {
  width: 16px;
}
.address_main {
  width: 5.9rem;
  margin-right: 0px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 48px;
  text-align: right;
  line-height: 48px;
  margin-left: 25px;
  padding-right: 7px;
  color: #989898;
}
.submit {
  width: 100%;
  height: 38px;
  background: #36a6fe;
  border-radius: 19px;
  line-height: 38px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 14px;
}
.success_box {
  text-align: center;
  line-height: 25px;
  height: 80%;
}
.success_title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.success_desc {
  font-size: 12px;
  color: #333;
}
.success_box img {
  width: 50px;
  height: 50px;
}
.norwap {
  white-space: nowrap;
}
.special {
  margin-top: 200px;
  background: pink;
  z-index: 9999;
}
</style>
