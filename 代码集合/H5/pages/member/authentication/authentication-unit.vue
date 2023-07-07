<template>
  <div style="position: relative">
    <mt-header title="企业认证信息" class="header">
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
        <p
          style="
            color: #333;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 4px;
          "
        >
          这是一项身份识别服务，请注意以下几点：
        </p>
        <p>
          1.请确认您是具有法人资格的商户，您需提供<span style="color: #fd7f43"
            >可证明您依法设立、依法经营、开展社会活动的执照、证件等（如营业执照副本）</span
          >；
        </p>
        <p>
          2.证件有效期在<span style="color: #fd7f43">三个月内</span
          >的商户，请在工商部门更新资料后再进行提交。
        </p>
      </div>
      <div class="info">
        <p class="info-title">请填写企业信息</p>
        <el-form
          :model="orgAuthenticationForm"
          :rules="rules"
          ref="orgAuthenticationForm"
          label-width="98px"
          label-position="left"
        >
          <!-- <el-form-item label="单位类型" prop="orgType" class="label-top radio-group">
                        <el-radio-group v-model="orgAuthenticationForm.orgType">
                            <el-radio :label="item.id" v-for="(item,index) in orgTypeList" :key="index" class="org-type">{{item.name}}</el-radio>                           
                        </el-radio-group>
                    </el-form-item> -->
          <el-form-item label="认证方式" prop="authWay">
            <el-radio
              v-for="item in unitTypeList"
              v-model="orgAuthenticationForm.authWay"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-form-item>
          <el-form-item label="单位名称" prop="orgName">
            <el-input
              v-model="orgAuthenticationForm.orgName"
              placeholder="请填写单位名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="统一信用码" prop="creditCode">
            <el-input
              v-model="orgAuthenticationForm.creditCode"
              placeholder="请填写真实统一社会信用代码"
            ></el-input>
          </el-form-item>
          <!-- 地区margin_bottom -->
          <div
            class="address_sty"
            title="单位所在地"
            @click="visible.region = true"
          >
            <span class="address_title">
              <img slot="icon" :src="imgURL" class="adress_icon" />
              <span style="margin-left: 5px">单位所在地</span>
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
        <p class="success_title">您的单位实名认证提交成功！</p>
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
import { getLetter, submitAuth, checkAuth} from "~/api/member";

export default {
  head() {
    return {
      title: "单位认证信息",
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
    var codeValidator = (rule, value, callback) => {
      if (value && Number(value) !== 0) {
        // let pattern = /^[0-9a-zA-Z]{1,}$/;
        let pattern =/[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g;
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("请填写真实统一社会信用代码或检查是否存在空格"));
        }
      } else {
        callback(new Error("请填写真实统一社会信用代码"));
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
        orgName: "",
        authWay: 3,
        creditCode: "",
        material: "不必填写",
        identificationPhoto: "",
        materialPhoto: "",
        corporation: "",
        accountBelongUserName: "",
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
      identificationPhoto: "",
      materialPhoto: "",
      imageUrl: "",
      userInfo: "",
      orgTypeList: [],
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
      cdnUrl: process.env.CDN_BASE_URL,
      rules: {
        authWay: [{ required: true, message: "请选择", trigger: "blur" }],
        orgName: [
          { required: true, validator: nameValidator, trigger: "blur" },
          { max: 50, message: "单位名称50字以内", trigger: "blur" },
        ],
        creditCode: [
          { required: true, validator: codeValidator, trigger: "blur" },
          { max: 50, message: "信用代码50字以内", trigger: "blur" },
        ],
        material: [{ required: true }],
        corporation: [
          { required: true, message: "请填写", trigger: "blur" },
          { max: 50, message: "名称50字以内", trigger: "blur" },
        ],
        accountBelongUserName: [
          { required: true, message: "请填写真实姓名", trigger: "blur" },
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
    identificationPhotoChange(event, file, fileList) {
      if (file.size / 1024 / 1024 > 1) {
        if (file.status === "ready") {
          this.identPercentlength = 0;
          this.identShowprocess = true;
          const timer = setInterval(() => {
            if (this.identPercentlength > 99) {
              this.identShowprocess = false;
              clearInterval(timer);
              return;
            }
            this.identPercentlength += 1;
          }, 10);
        }
      }
    },
    identificationPhotoSucess(res, file) {
      console.log(file, "file");
      if (file.status === "success") {
        this.identPercentlength = 100;
        this.identShowprocess = false;
      }
      this.orgAuthenticationForm.identificationPhoto = URL.createObjectURL(
        file.raw
      );
      this.identificationPhoto = file.response.data.data; //传到后台
    },
    materialPhotoSuccess(res, file) {
      if (file.status === "success") {
        console.log(222111);
        this.percentlength = 100;
        this.showprocess = false;
      }
      this.orgAuthenticationForm.materialPhoto = URL.createObjectURL(file.raw);
      this.materialPhoto = file.response.data.data;
    },
    materialPhotoChange(event, file, fileList) {
      if (file.size / 1024 / 1024 > 1) {
        if (file.status === "ready") {
          console.log(222);
          this.percentlength = 0;
          this.showprocess = true;
          const timer1 = setInterval(() => {
            if (this.percentlength > 99) {
              this.showprocess = false;
              clearInterval(timer1);
              return;
            }
            this.percentlength += 1;
          }, 10);
        }
      }
    },
    beforeAvatarUpload(file) {
      let reg = new RegExp(`${file.type}`);
      const isJPG =
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/png";
      if (!isJPG) {
        this.$toast({
          message: "上传图片格式不正确!",
          position: "middle",
          duration: 3000,
        });
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$toast({
          message: "上传图片大小不能超过5MB!",
          position: "middle",
          duration: 3000,
        });
      }
      return isJPG && isLt2M;
    },
    submit() {
      this.$refs.orgAuthenticationForm.validate((valid) => {
        if (valid) {
          let param = {
            autClient: 3,
            verifiedWay: this.orgAuthenticationForm.authWay,
            companyName: this.orgAuthenticationForm.orgName,
            organization: this.orgAuthenticationForm.creditCode,
            diyOrgAddress: this.account.userVO.orgAddress,
          };
         this.account.userVO.unitVO.userId = this.account.userVO.id;
          submitAuth(param,this.resetStatus).then((res) => {
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
    beforeClose(done) {
      this.$router.push("/member/authentication");
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
              // mobilPhone: this.userInfo.accountNo,
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
              message: "请填写完正确单位信息后才可下载公函",
              position: "middle",
              duration: 3000,
            });
            this.clicked = false;
          }
        }, 500);
      }
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .no-border {
  border: 0;
}
/* .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
} */
.avatar-uploader-blank {
  font-size: 12px;
  color: #999;
  width: 210px;
  height: 172px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.avatar-uploader-blank img {
  width: 40px;
  height: 40px;
}
.avatar {
  width: 210px;
  height: 172px;
  border-radius: 6px;
  display: block;
}
.phone-info {
  line-height: 22px;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-left: 100px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.phone-info div {
  height: 18px;
  line-height: 18px;
  font-size: 12px;
  -webkit-transform-origin-x: 0;
  transform: scale(0.9);
  font-weight: 400;
  font-family: DIN, DIN-Regular;
  color: #aaa;
}
.file_item {
  position: absolute;
  margin-top: 40vh;
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
.info >>> .el-form-item__error {
  padding-top: 0px;
  top: 80%;
}
.avatar-uploader >>> .el-form-item__error,
.info .radio-group >>> .el-form-item__error {
  top: 98%;
}
.org-type {
  width: 104px;
  margin-right: 0px;
  margin-bottom: 10px;
}
.org-method {
  width: 104px;
  margin-right: 0px;
  margin-bottom: 10px;
}
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
.pdl {
  padding-left: 28px;
}
</style>
