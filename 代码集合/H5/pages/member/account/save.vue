<template>
  <div class='container wrap'>
    <div class="head-box">
        <mt-header title="安全设置" class="mutice_header_title">
            <router-link to='/member/account' slot="left" class="mutice_header_left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- <mt-button icon="search" class="mutice_header_right" slot="right" @click="search"></mt-button> -->
        </mt-header>
    </div>
    <div class="count-items">
      <mt-cell title="绑定手机" is-link to='/member/account/changePhoNum'>
          <span>{{this.$store.state.userInfo.accountNo}}</span>
      </mt-cell>
      <mt-cell title="修改密码" is-link to='/member/account/changePwd'></mt-cell>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'empty',
  head () {
    return {
      title: '安全设置',    
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  },
  data(){
    return{
      shadow:true,      
    }
  }
}
</script>
<style scoped>
.container {
  background: #f4f4f4;
}
.container header {
  background: transparent;
  color: #000;
  font-size:0.4rem;
  height:1.2rem
}
.container a{
    margin-top:1px;
    text-decoration :none
}
</style>