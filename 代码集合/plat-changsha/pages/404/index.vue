<template>
  <div class="unknow">
    <div class="page-empty-img">
      <img src="@/assets/images/xunlu/pic-404@2x.png" alt="404页面" srcset="">
      <div>
        <p class="title">404</p>
        <p class="subtitle">OH! 页面丢失</p>
        <p class="content">您所寻找的页面不存在，先看看其他的内容吧。</p>
        <div class="home-button">
          <a href="/">返回首页</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.unknow{
  min-height: 100%;
  background: #f7f8fb;
}
.page-empty-img{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 912px;
  height: 402px;
  color: #555555;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%)
}
.page-empty-img img{
  width: 486px;
  height: 402px;
}
/* .page-empty-img p{
  margin: 20px;
  letter-spacing: 1px;
  font-size: 20px;
  color: #555555;
} */
.title{
  font-size: 122px;
}
.subtitle{
  font-size: 26px;
  margin-top: 20px;
}
.content{
  width: 300px;
  margin-top: 20px;
  font-size: 16px;
  line-height: 24px;
}
.home-button{
  width: 144px;
  height: 40px;
  background: #36a6fe;
  border-radius: 20px;
  line-height: 40px;
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
}
.home-button a{
  text-decoration: none;
  color: #FFFFFF;
}
</style>