<!-- 排查完成 -->
<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <el-row>
        <el-col>
          <div class="grid-content bg-purple">
            <el-form
              ref="ruleForm2"
              :model="ruleForm2"
              :rules="rules2"
              class="demo-ruleForm">
              <el-form-item prop="username" v-show="false">
                <el-input v-model="ruleForm2.username" type="text" disabled />
              </el-form-item>
              <el-form-item prop="phone" v-show="false">
                <el-input v-model="ruleForm2.phone" />
              </el-form-item>
              <el-form-item label>
                 <div class="img-show-home" @click="dialogVisible=true">
                    <img
                    v-if="ruleForm2.avatar"
                    @click="dialogVisible=true"
                    id="avatar"
                    :src="avatarUrl"
                    class="avatar"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                  <span v-if="ruleForm2.avatar" class="set-img-sty">修改头像</span>
                 </div>
              </el-form-item>
            </el-form>
          </div>
          <!-- 修改头像 -->
          <el-dialog
            title="修改头像"
            :visible.sync="dialogVisible"
            width="20%"
            :before-close="handleClose">
                 <img
                    v-if="ruleForm2.avatar"
                    @click="dialogVisible=true"
                    id="avatar"
                    :src="avatarUrl"
                    class="avatar-up-sty"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon avatar-up-sty" />
                <div class="img-avator-sty">
                  <el-upload
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  action="wtcrm/file/upload">
                  <el-button type="primary" icon="el-icon-upload">上传头像</el-button>
                </el-upload>
                  <el-button type="primary" class="btn-edit-sty" icon="el-icon-edit" @click="submitForm('ruleForm2')" :disabled="btnStatus">确认修改</el-button>
                </div>
          </el-dialog>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "@/store";
import { getStore, setStore } from "@/util/store";
import * as CodeMsg from "@/api/common/CodeChange"
import { editInfo } from "@/api/admin/user";

export default {
  data() {
    return {
      dialogVisible:false,
      btnStatus: true,
      imgBaseUrl: "",
      switchStatus: "userManager",
      avatarUrl: "",
      show: false,
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      ruleForm2: {
        username: "",
        password: "",
        newpassword1: "",
        newpassword2: "",
        avatar: "",
        // phone: ""
      },
      rules2: {
        password: [
          {
            required: true,
            min: 6,
            message: "",
            trigger: "change",
          },
        ],
        newpassword1: [
          { required: false, min: 6, message: "", trigger: "change" },
        ],
        newpassword2: [{ required: false, trigger: "blur" }],
      },
    };
  },
  created() {},
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  mounted() {
    this.switch();
    this.resetForm();
  },
  methods: {
    handleClose(){
      this.dialogVisible = false
      this.resetForm();
    },
    changeImg(val) {
      console.log(val, "输出头像信息！");
    },
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
    switchTab(tab) {
      // if (tab.name === "userManager") {
      //   handleImg(this.ruleForm2.avatar, "avatar");
      // }
      this.switchStatus = tab.name;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        if (this.ruleForm2.avatar !== "") {
          editInfo(this.ruleForm2).then((res) => {
            if(res.data.code == CodeMsg.CODE_0){
              this.handleLocalData(this.ruleForm2);
              this.dialogVisible = false
              this.$notify.success(this.$t("button.modifySuccess"));
            // 修改密码之后强制重新登录
            if (this.switchStatus === "passwordManager") {
              this.$store.dispatch("LogOut").then(() => {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
              });
            }
            }
          });
        } else {
          this.$message({
            type: "warning",
            message: "请先选择头像再进行修改！",
          });
        }
      });
    },
    resetForm() {
      this.ruleForm2.avatar = this.userInfo.avatar;
      this.avatarUrl = this.imgBaseUrl + this.userInfo.avatar;
      if (this.userInfo.avatar == "" || this.userInfo.avatar == null) {
        this.btnStatus = true;
      } else {
        this.btnStatus = false;
      }
      this.ruleForm2.password = undefined;
      this.ruleForm2.newpassword1 = undefined;
      this.ruleForm2.newpassword2 = undefined;
      this.ruleForm2.username = this.userInfo.username;
      // this.ruleForm2.phone = this.userInfo.phone;
      // handleImg(this.userInfo.avatar, "avatar");
      //判断是否选择了租户ID
      const TENANT_ID = getStore({ name: "tenantId" });
      if (TENANT_ID) {
        this.headers["TENANT-ID"] = TENANT_ID; // 租户ID
      }
    },
    handleAvatarSuccess(res, file) {
      if (file) {
        this.btnStatus = false;
      } else {
        this.btnStatus = true;
      }
      console.log(file, "file");
      this.avatarUrl = URL.createObjectURL(file.raw);
      console.log(this.avatarUrl, " this.avatarUrl");
      this.ruleForm2.avatar = res.data;
      console.log(this.ruleForm2.avatar, "ccccccccccccc");
    },
    // 处理本地数据，避免刷新不同步
    handleLocalData(form) {
      let userInfo = getStore({ name: "userInfo" });
      this.userInfo.avatar = form.avatar
      if (userInfo) {
        userInfo.avatar = form.avatar;
        userInfo.phone = form.phone;
        console.log(userInfo)
        setStore({
          name: "userInfo",
          content: userInfo,
          type: "session",
        });
      }
    },
  },
};
</script>
<style>
.app-container .el-card.is-always-shadow {
  -webkit-box-shadow: none !important;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0) !important;
  border-radius: 90px;
}
.app-container .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 90px !important;
}

.app-container .avatar-uploader .el-upload:hover {
  border-color: #409eff;
  border-radius: 90px;
  transition: 0.5s;
}

.app-container .avatar-uploader-icon {
  font-size: 28px !important;
  color: #8c939d !important;
  width: 150px !important;
  height: 150px !important;
  line-height: 152px !important;
  text-align: center;
}
.app-container .avatar-uploader .el-upload:hover .set-img-sty {
  opacity: 1;
}
.set-img-sty {
  position: absolute;
  color: #dfebf6;
  bottom: 0px;
  font-size: 13px;
  left: 50%;
  opacity: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: rgba(44, 42, 42, 0.8);
  transform: translateX(-50%);
  transition: 0.5s;
}

.app-container #avatar {
  width: 150px;
  height: 150px;
  display: block;
  border-radius: 90px;
}
.img-avator-sty{    
  margin-top: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-upload-sty{
  margin-left: 100px;
}
.submit-avator-sty{
  margin-left: 40px;
}
.img-show-home{
  position: relative;
  width: 150px !important;
  height: 150px !important;
  line-height: 150px !important;
  text-align: center !important;
  overflow: hidden;
  border-radius: 90px !important;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-show-home:hover .set-img-sty{
 opacity: 1;
}
.avatar-up-sty{
  margin-top: -5px;
  margin-left: 50%;
  transform: translateX(-52%);
}
.btn-edit-sty{
  margin-left: 30px !important;
}
.el-icon-plus{
  transition: 0.3s;
  /* border: 1px dashed rgba(82, 81, 81, 0.8); */
  border-radius: 100%;
}
.el-icon-plus:hover{
  border: 1px dashed #409EFF;
}
</style>
