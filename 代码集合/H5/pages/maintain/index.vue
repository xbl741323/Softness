<template>
 <div>
     <div class="header_top">
      <!-- 改为标签跳转 -->
      <router-link  to>
        <i class="back" @click="$router.back(-1)"></i>
      </router-link>
      <span class="spanStyle1">系统维护中</span>
    </div>
    <div class="flex">
        <img src="~assets/images/maintain/img_502.png" alt="" class="img">
        <div>
            <h3 class="spanStyle2">系统维护中......</h3>
        </div>
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
.header_top {
  position: fixed;
  top: 0;
  width: 100%;
  height: 1.17333333333rem;
  font-size: 0.42666666666rem;
  line-height: 1.17333333333rem;
  padding: 0 0.42666666666rem;
  color: #545454;
  z-index: 12;
  background: #ffffff;
  text-align: center !important;
}

.back {
  float: left;
  margin-top: 0.42666666666rem;
  content: "";
  height: 0.32rem;
  width: 0.32rem;
  border-width: 0 0 0.02666666666rem 0.02666666666rem;
  border-color: #545454;
  border-style: solid;
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
}

.spanStyle1 {
    font-size: 18px;
    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
    font-weight: 500;
    text-align: center;
    color: #333333;
}

.flex {
  /* background:#FFFFFF; */
  display:flex;
  align-items:center;
  justify-content:center;
  text-align: center;
  min-height: 100vh;
  flex-direction: column;
}

.img {
    width: 100%;
}

.spanStyle2 {
    font-size: 18px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 600;
    text-align: left;
    color: #555555;
}
</style>

