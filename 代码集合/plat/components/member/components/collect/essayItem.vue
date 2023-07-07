<template>
  <div class="essay_item">
    <div class="essay_left">
      <div class="check_choose" v-if="showStatus == 1">
        <el-checkbox v-model="checkValue" @change="checkChange"></el-checkbox>
      </div>
      <span @click="toDetail">
        <i class="iconfont color_sty" v-if="collectInfo.type == 0">&#xe602;</i>
        <i class="iconfont color_sty" v-if="collectInfo.type == 1">&#xe628;</i>
        <i class="iconfont color_sty" v-if="collectInfo.type == 2">&#xe629;</i>
        <i class="iconfont color_sty" v-if="collectInfo.type == 10">&#xe626;</i>
      </span>
      <span @click="toDetail">{{ collectInfo.type | typeFilter }}</span>
      <span class="title_len" @click="toDetail">{{ collectInfo.title }}</span>
      <span class="fail_sty" v-if="collectInfo.deleted == 1||collectInfo.showStatus == 2" @click="toDetail">已失效</span>
    </div>
    <div class="essay_right" @click="toDetail">{{ collectInfo.policyCreateTime }}</div>
  </div>
</template>

<script>
export default {
  props: ["collectInfo", "showStatus"],
  data() {
    return {
      checkValue: false,
    };
  },
  filters: {
    typeFilter(val) {
      switch (val) {
        case 0:
          return "【通知公告】";
          break;
        case 1:
          return "【政策汇编】";
          break;
        case 2:
          return "【卧涛问答】";
          break;
        case 10:
          return "【行业资讯】";
          break;
      }
    },
  },
  methods: {
    toDetail() {
       if (this.collectInfo.type == 2) {
          const { href } = this.$router.resolve({
            // path: "/wtClass/" + this.collectInfo.number + 1
            path: "/policy/trouble/" + this.collectInfo.number + 1
          });
          window.open(href, "_blank");
        }else if(this.collectInfo.type == 10){
          console.log(this.collectInfo.number)
          const { href } = this.$router.resolve({
            path: "/policy/" + this.collectInfo.number + this.collectInfo.type +  1
          });
          window.open(href, "_blank");
        } else {
          const { href } = this.$router.resolve({
            path: "/policy/" + this.collectInfo.number + this.collectInfo.type + 1,
          });
          window.open(href, "_blank")
        }
    },
    checkChange(val) {
      this.$emit("project-change");
    },
  },
};
</script>

<style scoped>
.essay_item {
  cursor: pointer;
  width: 910px;
  height: 18px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}
.essay_left {
  display: flex;
  justify-content: center;
  align-items: center;
}
.essay_left > span:nth-of-type(1) {
  width: 18px;
  height: 18px;
  display: flex;
  opacity: 1;
  justify-content: center;
  align-items: center;
}
.essay_left > span:nth-of-type(1) i {
  padding-top: 3px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.essay_left > span:nth-of-type(2) {
  display: inline-block;
  width: 88px;
  height: 18px;
  font-size: 14px;
  font-weight: 400;
  color: #36a6fe;
  opacity: 1;
}
.essay_left > span:nth-of-type(3) {
  display: inline-block;
  height: 18px;
  font-size: 14px;
  font-weight: 400;
  color: #656565;
  opacity: 1;
}
.essay_right {
  height: 18px;
  font-size: 14px;
  font-weight: 400;
  color: #a8a8a8;
  opacity: 1;
}
.fail_sty {
  width: 46px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  background: #dedede;
  opacity: 1;
  border-radius: 2px;
  color: #8d8d8d;
  font-size: 12px;
  margin-left: 10px;
}
.check_choose {
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin: 0 5px;
}
.color_sty {
  color: #36a6fe;
}
.title_len{
  width:650px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>