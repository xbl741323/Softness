<template>
  <div :class="['head_main', headerTop > 60 ? 'head_shadow_sty' : '']" id="header">
    <div class="head_contain">
      <div class="head_desc">
        <span @click="toHome">欢迎访问长沙项目申报一站式服务平台</span>
        <span>项目申报客服电话：15855199550</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headerTop: "",
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    handleScroll() {
      this.headerTop = document.documentElement.scrollTop || document.body.scrollTop;
    },
    toHome() {
      this.$router.push({
        path: "/",
      });
    },
  },
};
</script>

<style scoped>
.head_main {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10000;
  height: 60px;
  background: #ffffff;
}
.head_shadow_sty {
  box-shadow: 0px 2px 10px #aaa9a9;
}
.head_contain {
  width: 1190px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.head_desc {
  font-size: 14px;
  display: flex;
  color: #39434a;
  justify-content: center;
  align-items: center;
}
.head_desc > span:nth-of-type(1) {
  cursor: pointer;
}
.head_desc > span:nth-of-type(2) {
  color: #93b874 !important;
  margin-left: 25px;
}
.head_desc > span:nth-of-type(3),
.head_desc > span:nth-of-type(5) {
  width: 0px;
  height: 11px;
  border: 1px solid #9e9e9e;
  opacity: 1;
  margin: 0 15px;
}
</style>
