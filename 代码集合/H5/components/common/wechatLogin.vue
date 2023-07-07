<template>
  <div class="cont">
      <div style="display: flex; align-items: center; margin-top: 1.1rem">
        <div class="line-divide"></div>
        <div class="iconfont wechat-ico">&#xe601;</div>
        <div class="line-divide"></div>
      </div>
      <p style="text-align: center; color: #999; margin: .3rem 0 .8rem 0; font-size: .37rem">第三方账号登录</p>
  </div>
</template>

<script>
export default {
  data(){
    return {
      
    };
  },
  methods:{   
  },
  mounted(){
  },
}
</script>

<style>
.cont{
  position: relative;
}
.line-divide{
  width: 40%;
  border: 1px dashed #B8B8B8;
}
.wechat-ico{
  width: 20%;
  text-align: center;
  color: #12C430;
  font-size: 1.2rem;
}
</style>
