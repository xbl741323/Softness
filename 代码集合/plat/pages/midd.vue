<template>
  <div class="transition-page">
    <div class="transition-img">
      <img src="@/assets/images/loading.gif" >
      <p class="jump">正在为您跳转...</p>
    </div>
  </div>
</template>

<script>
export default {
  mounted(){
    //PC/MOBILE卧涛问答文件结构不同特殊处理

    if(sessionStorage.getItem('link') || this.$route.query.link){
      try {//获取员工推广码
        if(this.$route.query.link){
            sessionStorage.setItem('link',this.$route.query.link);
        }
      } catch (error) {
        console.log(error);
      };
      if(this.$route.query.No){//详情
        window.location.href = process.env.MOBILE_URL + '/policy/'+this.$route.query.No+2+'?link='+sessionStorage.getItem('link'); 
      }else if(this.$route.query.id == '/policy/troubleshooting'){//列表
        window.location.href = process.env.MOBILE_URL + '/policy/troubleList'+'?link='+sessionStorage.getItem('link');
      }else{//其他页面
        window.location.href = process.env.MOBILE_URL + this.$route.query.id + '?link='+sessionStorage.getItem('link');
      };
    }else{
      if(this.$route.query.No){//详情
        window.location.href = process.env.MOBILE_URL + '/policy/'+this.$route.query.No+2; 
      }else if(this.$route.query.id == '/policy/troubleshooting'){//列表
        window.location.href = process.env.MOBILE_URL + '/policy/troubleList';
      }else{//其他页面
        window.location.href = process.env.MOBILE_URL + this.$route.query.id;
      };
    };
  },
}
</script>

<style lang="stylus" scoped>
.transition-page{
  width 100%;
  height:100%;
  .transition-img{
    width: 150px;
    position absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -35%);
    text-align: center;
    .jump{
      color: #666;
    }
  }
}
</style>