<template>
  <div class="flex">
      <img src="~assets/images/maintain/img_502.png" alt="">
      <div>
        <h3 class="spanStyle">系统维护中......</h3>
      </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: "系统维护中",
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  }
}
</script>

<style scoped>
.flex {
  /* background:#FFFFFF; */
  display:flex;
  align-items:center;
  justify-content:center;
  text-align: center;
  min-height: 100vh;
  flex-direction: column;
}
.spanStyle {
    font-size: 22px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 700;
    text-align: left;
    color: #555555;
}
</style>

