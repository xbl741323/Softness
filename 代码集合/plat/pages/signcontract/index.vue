<template>
    <div>
        <memberHead></memberHead>
        <div class="scancontent">
           <div class="scanInfo">
               <img class="scanimg" />
           </div>
           <p>请使用手机微信扫描二维码</p>
        </div>
    </div>
</template>
<script>
import memberHead from '@/components/member/head.vue'
export default {
  components:{
    memberHead
  },
  data(){
      return {

      }
  },
  mounted(){

  },
  methods:{

  }
}
</script>
<style scoped>
.scancontent{
    width: 100%;
    height: 650px;
    margin: 0 auto;
    text-align: center;
    padding-top: 180px;
}
.scanimg{
    width:240px;
    height: 240px;
    border-radius: 8px;
    padding:15px;
}
</style>