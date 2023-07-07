<template>
    <div>        
      <div class="member-certification">
        <mt-popup position="middle" v-model="showPop">
          <div class="certification">
            <img src="~assets/images/member/geren_pic@2x.png" alt="">
            <h3 class="approve-title">认证提醒</h3>
            <p class="approve-desc">检测到您存在待认证的订单， 为了不影响您的订单进度，请尽快完成认证</p>
          </div>
          <div class="approve-btn">
            <nuxt-link :to="'/member/authentication'">好的，去认证</nuxt-link>
            <a @click="parentMethod()">再想想</a>
          </div>
          <div class="close-box" @click="parentMethod()"><img src="~assets/images/member/guanbi_icon@2xm.png" alt=""></div>
        </mt-popup>
      </div>
    </div>
</template>

<script>
export default {
    props:['showPop'],
    data(){
        return{
        }
    },
    methods:{
        parentMethod() {
            this.$parent.loginSuccessTo();
        }

    },
    mounted(){        
    }
}
</script>

<style lang="stylus" scoped>
    @import '~assets/css/member/member.styl'
</style>