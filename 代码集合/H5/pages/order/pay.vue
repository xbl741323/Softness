<template>
  <div class="pay">
  </div>
</template>

<script>
import Encrypt from '~/plugins/Encrypt'
import { submitPay } from '@/api/order'
export default {
  mounted(){
    history.pushState(null, null, document.URL);
    if(window.history && window.history.pushState){
      window.addEventListener('popstate', this.goBack, false);
    }
      document.querySelector('html').innerHTML = this.$route.query.zfbData;
      document.forms[0].submit();
    // submitPay(JSON.parse(Encrypt.decrypt(this.$route.query.data,'v4kgOl8v7SKJlxXM'))).then(res=>{
    //     if(res.code==0){
    //         document.querySelector('html').innerHTML = res.data.alipayTradeWapPayResponse.body
    //         document.forms[0].submit();
    //     }else{
    //         this.$message({
    //             type: 'error',
    //             message: res.data.msg,
    //             offset: 80,
    //             duration: 3000
    //         })
    //     }
    // })
  },
  destroyed(){
    window.removeEventListener('popstate', this.goBack, false);
  },
  methods:{
    goBack(){
      history.pushState(null, null, document.URL);
    }
  }
}
</script>

<style scoped>
.pay{
  height: 660px;
  background: #FFFFFF;
}
</style>