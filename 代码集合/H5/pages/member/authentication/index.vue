<template>
  <div v-loading="loading" class="auth-sty">
    <!-- 未实名认证 -->
    <div
      v-if="authenticationStatus === null || authenticationStatus == 0"
      style="background: #f4f4f4; min-height: 100vh"
    >
      <mt-header title="选择实名认证" class="header">
        <router-link to="/member" slot="left">
          <mt-button icon="back"></mt-button
        ></router-link>
      </mt-header>
      <div class="content">
        <div
          class="item"
          v-for="(item, index) in list"
          :key="index"
          @click="toComfirm(item.type)"
        >
          <div style="display: flex">
            <img :src="require('@/assets/images/' + item.imgurl)" />
            <div style="margin-left: 16px">
              <span style="font-weight: 700">{{ item.title }}</span>
              <span class="account-type" v-if="item.type == info.accountType"
                >当前账户类型</span
              >
              <p style="font-size: 12px; color: #999; margin-top: 2px">
                {{ item.desc }}
              </p>
            </div>
          </div>
          <img
            src="@/assets/images/member/back@2x.png"
            style="width: 12px; height: 12px"
          />
        </div>
      </div>
    </div>
    <!-- 实名认证过 -->
    <div v-else>
      <auth-status
        @confirmNext="confirmNext"
        @resetComfirm="resetComfirm"
        :authenticationStatus.sync="authenticationStatus"
        :accountType="info.accountType"
        :authInfo="authInfo"
      ></auth-status>
    </div>
  </div>
</template>

<script>
import authStatus from "@/components/authentication/authStatus";
import { getAuthStatus } from "~/api/member";

export default {
  components: { authStatus },
  layout: "empty",
  head() {
    return {
      title: "身份认证",
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
    return {
      loading: false,
      authInfo: "",
      autType: null, //用户选择的认证类型：0-个人，1-单位
      authenticationStatus: "", // 认证状态 0:未激活；1:未认证；2:审核通过；3:已提交待审核；4:审核不通过
      list: [
        {
          type: 1,
          imgurl: "member/qiye_icon@2x.png",
          title: "单位实名认证",
          desc: "适用于企业、机构、政府、校园等",
        },
        {
          type: 0,
          imgurl: "member/geren_icon@2x.png",
          title: "个人实名认证",
          desc: "适用于个人的真实身份确认",
        },
      ],
    };
  },
  computed: {
    info() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    resetComfirm() {
      this.authenticationStatus = null;
    },
    confirmNext() {
      // 跳转到法大大认证页面
      window.location.replace(this.authInfo.authUrl);
    },
    toComfirm(index) {
      this.autType = index;
      this.toComfirmNext();
    },
    toComfirmNext() {
      this.isShow = false;
      if (this.autType == 1) {
        //单位认证
        this.$router.push({
          path: "/member/authentication/authentication-unit",
        });
      } else if (this.autType == 0) {
        //个人认证
        this.$router.push({
          path: "/member/authentication/authentication-personal",
        });
      } else {
        this.$router.push({
          path: "/member/authentication",
        });
      }
    },
    // 获取认证状态
    getAuthenStatus() {
      this.loading = true;
      getAuthStatus().then((res) => {
        console.log("getAuthStatus",res)
        if (res.code == 0) {
          this.authInfo = res.data;
          this.authenticationStatus = res.data.status;
          this.loading = false;
        } else {
          this.authenticationStatus = 0;
          this.loading = false;
        }
      });
    },
  },
  mounted() {
    this.getAuthenStatus();
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
}
.item {
  width: 100%;
  height: 80px;
  padding: 20px;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 10px;
  font-size: 16px;
  font-family: Source Han Sans CN;
  color: #333333;
  margin-bottom: 20px;
  justify-content: space-between;
}
.item img {
  width: 40px;
  height: 40px;
}
.account-type {
  width: 83px;
  height: 20px;
  line-height: 20px;
  color: #ffffff;
  display: inline-block;
  font-size: 10px;
  -webkit-transform-origin-x: 0;
  transform: scale(0.8);
  padding: 0 3px;
  letter-spacing: 0.7px;
  background: #fe9819;
  border-radius: 2px;
}
.bg {
  width: 100%;
  height: 100vh;
  opacity: 0.25;
  background: #000000;
  position: fixed;
  top: 0;
  padding: 0 20px;
}
.dialog {
  width: 90%;
  position: fixed;
  top: 210px;
  z-index: 999999;
  left: 50%;
  transform: translateX(-50%);
}
.dialog-box {
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
}
.dialog-title {
  width: 100%;
  height: 54px;
  background: #eef5f8;
  padding: 0 14px;
  display: flex;
  border-radius: 8px 8px 0 0;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: #333333;
}
.dialog-title img {
  width: 20px;
  height: 20px;
}
.info {
  text-indent: 1em;
  font-size: 14px;
  line-height: 2;
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 3px;
}
.auth-sty {
  min-height: 100vh;
}
</style>