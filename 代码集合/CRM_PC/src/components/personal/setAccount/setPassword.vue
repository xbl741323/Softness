<!-- 排查完成 -->
<template>
  <div class="app-container calendar-list-container" style="margin-left:50px;">
    <basic-container>
      <el-row>
        <el-col>
          <div class="grid-content bg-purple">
            <el-form
              ref="ruleForm2"
              :model="ruleForm2"
              :rules="rules2"
              label-width="170px"
              class="demo-ruleForm"
            >
              <el-form-item
                :label="$t('input.phoneCode')+'：'"
                style="margin-bottom:20px;"
                prop="code"
              >
                <el-input v-model="ruleForm2.code" style="width:160px;" readonly onfocus="this.removeAttribute('readonly')" autocomplete="off"></el-input>
                <span>
                  <el-button
                    style="margin-left:20px;"
                    size="small"
                    @click="getCode1"
                    v-if="disabled1==false"
                    :disabled="disabled1"
                  >{{$t('button.getCode')}}</el-button>
                  <!-- 原密码换手机号提交修改 -->
                  <el-button
                    size="small"
                    @click="getCode1"
                    :disabled="disabled1"
                    v-if="disabled1==true"
                    style="margin-left:20px;"
                  >{{btntxt}}</el-button>
                  <p style="color: red">{{ statusMsg1 }}</p>
                </span>
              </el-form-item>
              <!-- <el-form-item :label="$t('label.oldPassword')+'：'" prop="password">
                <el-input
                  v-model="ruleForm2.password"
                  type="password"
                  style="width:260px;"
                  auto-complete="off"
                />
              </el-form-item>-->
              <el-form-item :label="$t('label.password')+'：'" prop="newpassword1">
                <el-input
                  v-model="ruleForm2.newpassword1"
                  type="password"
                  style="width:260px;"
                  auto-complete="off"
                />
              </el-form-item>
              <el-form-item :label="$t('label.confirmPassword')+'：'" prop="newpassword2">
                <el-input
                  v-model="ruleForm2.newpassword2"
                  type="password"
                  style="width:260px;"
                  auto-complete="off"
                />
              </el-form-item>
              <div class="desc">
                <div class="left">{{$t('message.pwdSetRequire')}}：</div>
                <div class="right">
                  <ul>
                    <li>1.{{$t('message.letterAndNum')}}</li>
                    <li>2.{{$t('message.noLessThanSix')}}</li>
                  </ul>
                </div>
              </div>
              <el-form-item style="margin-left:25px;">
                <el-button style="width:70px;" @click="setTo">{{$t('button.cancel')}}</el-button>
                <el-button
                  type="primary"
                  style="width:70px;margin-left:40px;"
                  @click="setPwd('ruleForm2')"
                >{{$t('button.confirm')}}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import {  openWindow } from "@/util/util";
import { mapState } from "vuex";
import store from "@/store";
import * as CodeMsg from "@/api/common/CodeChange";
import { getStore, setStore } from "@/util/store";
import {
  getMessage,
  checkMessage,
  setEmpPwd
} from "@/api/admin/user";

export default {
  props: ["info"],
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.ruleForm2.password !== "") {
        if (value !== this.ruleForm2.newpassword1) {
          callback(new Error(this.$t("message.pwdsAreInconsistent") + "!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      statusMsg1: "",
      btntxt: this.$t("button.sendAgain"),
      disabled1: false,
      switchStatus: "passwordManager",
      avatarUrl: "",
      show: false,
      headers: {
        Authorization: "Bearer " + store.getters.access_token
      },
      form: {
        code: ""
      },
      ruleForm2: {
        username: "",
        password: "",
        newpassword1: "",
        newpassword2: "",
        avatar: "",
        phone: "",
        code: ""
      },
      rules2: {
        code: [
          {
            required: true,
            message: this.$t("input.phoneCode"),
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("input.oldPwdRequire"),
            trigger: "change"
          }
        ],
        newpassword1: [
          {
            required: true,
            pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,
            message: this.$t("input.specialPwdRequire"),
            trigger: "change"
          }
        ],
        newpassword2: [
          {
            required: true,
            validator: validatePass,
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.resetForm();
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    setTo() {
      this.$emit("setTo");
    },
    getCode1() {
      getMessage(this.info.phone).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.time = 60;
          this.disabled1 = true;
          this.timer();
          return;
        }
        if (res.data.code == CodeMsg.CODE_1006) {
          this.statusMsg1 = this.$t("message.sendCodeError");
          return;
        }
        if (res.data.code == CodeMsg.CODE_1001) {
          this.statusMsg1 = this.$t("message.sendMoreThen");
          return;
        }
      });
    },
    //60S倒计时
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time + this.$t("message.secondLaterGet");
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btntxt = this.$t("button.sendAgain");
        this.disabled1 = false;
      }
    },
    switchTab(tab) {
      if (tab.name === "userManager") {
        // handleImg(this.ruleForm2.avatar, "avatar");
      }
      this.switchStatus = tab.name;
    },
    toLast() {},
    setPwd(formName) {
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          let param = {
            phone: this.info.phone,
            code: this.ruleForm2.code
          };
          checkMessage(param).then(res => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.submitForm();
            } else if (res.data.code == CodeMsg.CODE_1003) {
              this.$message({
                type: "warning",
                message: res.data.data
              });
            }
          });
        }
      });
    },
    submitForm() {
      let obj = {
        avatar: this.ruleForm2.avatar,
        newpassword1: this.ruleForm2.newpassword2,
        // newpassword2: this.ruleForm2.newpassword2,
        // password: this.ruleForm2.newpassword1,
        username: this.ruleForm2.username
      };
      setEmpPwd(obj).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.setTo();
          this.$message({
            type: "success",
            message: this.$t("button.modifySuccess") + "!"
          });
        }
      });
    },
    resetForm() {
      this.ruleForm2.password = undefined;
      this.ruleForm2.newpassword1 = undefined;
      this.ruleForm2.newpassword2 = undefined;
      this.ruleForm2.username = this.userInfo.username;
      this.ruleForm2.phone = this.userInfo.phone;
      this.ruleForm2.avatar = this.userInfo.avatar;
      // handleImg(this.userInfo.avatar, "avatar");
      //判断是否选择了租户ID
      const TENANT_ID = getStore({ name: "tenantId" });
      if (TENANT_ID) {
        this.headers["TENANT-ID"] = TENANT_ID; // 租户ID
      }
    },
    handleClick(thirdpart) {
      let appid, client_id, redirect_uri, url;
      redirect_uri = encodeURIComponent(
        window.location.origin + "/#/authredirect"
      );
      if (thirdpart === "wechat") {
        appid = "wxd1678d3f83b1d83a";
        url =
          "https://open.weixin.qq.com/connect/qrconnect?appid=" +
          appid +
          "&redirect_uri=" +
          redirect_uri +
          "&state=WX-BIND&response_type=code&scope=snsapi_login#wechat_redirect";
      } else if (thirdpart === "tencent") {
        client_id = "101322838";
        url =
          "https://graph.qq.com/oauth2.0/authorize?response_type=code&state=QQ-BIND&client_id=" +
          client_id +
          "&redirect_uri=" +
          redirect_uri;
      } else if (thirdpart === "gitee") {
        client_id =
          "235ce26bbc59565b82c989aa3a407ce844cf59a7c5e0f9caa9bb3bf32cee5952";
        url =
          "https://gitee.com/oauth/authorize?response_type=code&state=GITEE-BIND&client_id=" +
          client_id +
          "&redirect_uri=" +
          redirect_uri;
      } else if (thirdpart === "osc") {
        client_id = "neIIqlwGsjsfsA6uxNqD";
        url =
          "https://www.oschina.net/action/oauth2/authorize?response_type=code&client_id=" +
          client_id +
          "&state=OSC-BIND&redirect_uri=" +
          redirect_uri;
      }
      openWindow(url, thirdpart, 540, 540);
    },
    handleAvatarSuccess(res, file) {
      this.avatarUrl = URL.createObjectURL(file.raw);
      this.ruleForm2.avatar = res.data.url;
    },
    // 处理本地数据，避免刷新不同步
    handleLocalData(form) {
      let userInfo = getStore({ name: "userInfo" });

      if (userInfo) {
        userInfo.avatar = form.avatar;
        userInfo.phone = form.phone;
        setStore({
          name: "userInfo",
          content: userInfo,
          type: "session"
        });
      }
    }
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px !important;
  color: #8c939d !important;
  width: 178px !important;
  height: 178px !important;
  line-height: 178px !important;
  text-align: center !important;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.desc {
  width: 300px;
  /* background: red; */
  display: flex;
  margin-left: 72px;
}
.desc .left {
  font-size: 12px;
  color: #666666;
  margin-right: 0px;
}
.desc .right {
  margin-left: -30px;
}
.desc .right li {
  list-style: none;
  font-size: 12px;
  color: #666666;
  margin-bottom: 5px;
}
</style>
