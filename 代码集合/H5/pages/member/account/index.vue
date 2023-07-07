<template>
  <div class='container wrap'>
    <div class="head-box">
        <mt-header title="账户设置" class="mutice_header_title">
            <router-link to='/member' slot="left" class="mutice_header_left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- <mt-button icon="search" class="mutice_header_right" slot="right" @click="search"></mt-button> -->
        </mt-header>
    </div>
    <div class="count-items">
      <mt-cell title="基本信息" is-link to='/member/account/info' value="去完善"></mt-cell>
      <mt-cell title="安全设置" is-link to='/member/account/save'></mt-cell>
      <mt-cell title="地址管理" is-link to='/member/account/address'></mt-cell>
      <mt-cell v-if="certification" class="approve" title="实名认证" is-link to='/member/authentication' value="去认证"></mt-cell>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'empty',
  head () {
    return {
      title: '账户设置',    
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  },
  data(){
    return{
      shadow:true,            
    }
  },
  computed: {
    certification(){
      return this.$store.state.userInfo.certificationStatus == '0'
    }
  },
  methods:{
    
  },
  mounted(){
    
  }
}
</script>
<style scoped lang="stylus">
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
.approve{
  margin-top: .32rem !important
}

</style>
    
