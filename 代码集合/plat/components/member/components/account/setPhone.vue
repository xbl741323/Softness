<template>
  <div class="set_phone">
    <!-- 导航区域 -->
    <div class="tab_head">
      <span></span>
      <span @click="changeStatus()"> 账号信息</span>
      <span></span>
      <span> 修改手机号 </span>
    </div>

    <!-- 内容区域-验证码修改手机号 -->
    <codeSetPhone @to-ski='skiPwd' v-if="showStaus == 0" @handle="handle"></codeSetPhone>
    <!-- 内容区域-密码修改手机号 -->
    <pwdSetPhone @to-ski='skiCode' v-if="showStaus == 1"  @handle="handle"></pwdSetPhone>
  </div>
</template>

<script>
import pwdSetPhone from "./setPhone/pwdSetPhone"
import codeSetPhone from "./setPhone/codeSetPhone"
export default {
  setStatus: {
      type: String,
      required:true
  },
    components:{
        pwdSetPhone,
        codeSetPhone
    },
  data() {
    return {
         phone:"",
         showStaus:0,
    };
  },
  methods:{
      skiPwd(){
          this.showStaus = 1
      },
      skiCode(){
          this.showStaus = 0
      },
      changeStatus(){
        this.status = 0;
        this.$emit('handle',this.status)
      },
      handle(str){
        this.status = str;
        this.$emit('handle',this.status)
      }
  }
};
</script>

<style scoped>
.set_phone {
  margin-left: 25px;
}
.tab_head {
  margin-top: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 400;
}
.tab_head > span:nth-of-type(1) {
  display: inline-block;
  width: 6px;
  height: 18px;
  background: #3d85dc;
  opacity: 1;
  border-radius: 5px;
}
.tab_head > span:nth-of-type(2) {
  font-size: 16px;
  color: #373d40;
  margin-left: 12px;
  margin-right: 8px;
}
.tab_head > span:nth-of-type(2):hover {
  cursor: pointer;
  color: #36a6fe;
}
.tab_head > span:nth-of-type(3) {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-top: 1px solid #373d40;
  border-right: 1px solid #373d40;
  transform: rotate(45deg);
  margin-right: 10px;
}
.tab_head > span:nth-of-type(4) {
  font-size: 16px;
  color: #36a6fe;
}
</style>