<template>
  <div class="user-contain">
  <h3 class="title-sty">修改账户信息</h3>
  <el-form label-width="80px" ref="userInfo" :model="userInfo" :rules="rules">
    <el-form-item label="用户名" prop="userName">
      <el-input size="small" disabled v-model.trim="userInfo.userName" auto-complete="off" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="原密码" prop="password">
      <el-input @change="userInfo.password = oninputForPhone(userInfo.password)" @keyup.native="userInfo.password = oninputForPhone(userInfo.password)" maxlength="10" size="small" type="number" v-model.trim="userInfo.password" auto-complete="off" placeholder="请输入原密码，密码格式仅支持数字" show-password></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input @change="userInfo.newPassword = oninputForPhone(userInfo.newPassword)" @keyup.native="userInfo.newPassword = oninputForPhone(userInfo.newPassword)" maxlength="10" size="small" type="number" v-model.trim="userInfo.newPassword" auto-complete="off" placeholder="请输入新密码，密码格式仅支持数字" show-password></el-input>
    </el-form-item>
  </el-form>
  <div class="user-foot">
    <el-button size="medium" class="right-sty" @click='clearData()'>清空信息</el-button>
    <el-button size="medium" type="primary" class="title" @click="submitForm()">确认修改</el-button>
  </div>
  </div>
</template>

<script>
import { updatePwd, logout } from "../../api/admin";
import { throttle } from "../../utils/util";
import md5 from "js-md5";
export default {
  data() {
    return {
      userInfo: {
        userName: "admin",
        password: "",
        newPassword: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          { min: 6, max: 10, message: '密码格式仅支持数字，长度需在6到10个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, max: 10, message: '密码格式仅支持数字，长度需在6到10个字符', trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    // 校验手机号
    oninputForPhone(value) {
      return value.replace(/[^\d-+]/g, "");
    },
    userExit() {
      logout().then((res) => {
        if (res.code == 200) {
          sessionStorage.clear();
          setTimeout(() => {
            this.$store.commit("logout", "false");
            this.$router.push({ path: "/login" });
          }, 1000);
        }
      });
    },
    // 编辑用户信息
    submitForm: throttle(function () {
      this.$refs["userInfo"].validate((valid) => {
        if (valid) {
          let params = new FormData();
          params.append("oldPassword", md5(this.userInfo.password));
          params.append("newPassword", md5(this.userInfo.newPassword));
          updatePwd(params).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "密码修改成功，请重新登录！",
              });
              this.clearData();
              this.userExit();
            } else {
              this.$message({
                type: "warning",
                message: res.msg,
              });
            }
          });
        }
      });
    }, 2000),
    clearData() {
      this.userInfo.password = "";
      this.userInfo.newPassword = "";
      this.$refs["userInfo"].clearValidate();
    },
  },
};
</script>

<style scoped>
.user-contain {
  width: 400px;
  height: 400px;
  margin: 50px 0 0 100px;
}

.title-sty {
  transform: translate(38%);
  margin-bottom: 40px;
}
.user-foot {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-left: 60px;
}
.right-sty {
  margin-right: 50px;
}
</style>

 