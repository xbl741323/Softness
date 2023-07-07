<template>
  <!-- 订阅消息页面关注提示 -->
  <div class="focus-tip" v-if="!showTip">
    <span>为了让您能够及时了解服务进度，建议您订阅消息提醒</span>
    <span @click="showWxFocus()">订阅消息</span>
    <el-dialog title="订阅消息" :visible.sync="dialogVisible" width="340px" center :close-on-click-modal="false" :before-close="handleClose">
      <div class="img-contain">
        <img :src="imgUrl" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWxFocus } from "@/api/order";
import { getUserDetail } from "@/api/member";
export default {
  data() {
    return {
      showTip: true,
      dialogVisible: false,
      accountId: "",
      imgUrl: "",
      timerLogin: "",
    };
  },
  methods: {
    // 定时器
    startFocusTimr() {
      this.timerLogin = setInterval(() => {
        this.getUserData(false);
      }, 2000);
    },
    // 展示弹窗
    showWxFocus() {
      this.dialogVisible = true;
      this.startFocusTimr();
      this.getUserData(true);
    },
    handleClose() {
      this.dialogVisible = false;
      this.getUserData(false);
      clearInterval(this.timerLogin);
    },
    // 获取订阅状态
    getUserData(status) {
      if (localStorage.getItem("userInfo")) {
        getUserDetail().then((res) => {
          if (res.data.code == 0) {
            let result = res.data.data;
            this.accountId = result.accountId;
            this.showTip = result.wxSubscribeFlag;
            status == false ? this.showMessage(result.subscribeAccount) : "";
            status == true ? this.getFocusData() : "";
          }
        });
      }
    },
    // 订阅成功提示
    showMessage(status) {
      if (status) {
        clearInterval(this.timerLogin);
        this.$message({
          type: "success",
          message: "订阅成功！",
          offset: 300,
        });
      }
    },
    // 获取二维码url
    getFocusData() {
      let params = {
        accountId: this.accountId,
      };
      getWxFocus(params).then((res) => {
        if (res.data.code == 0) {
          this.imgUrl = res.data.data;
        }
      });
    },
  },
  mounted() {
    this.getUserData(true);
  },
};
</script>

<style scoped>
.focus-tip {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999999;
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.focus-tip > span:nth-of-type(2) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #36a6fe;
  color: #36a6fe;
  text-align: center;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
}
.img-contain {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.img-contain img {
  width: 250px;
  height: 250px;
}
</style>