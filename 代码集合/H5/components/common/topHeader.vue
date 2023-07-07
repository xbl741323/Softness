<template>
  <div class="wrapper">
      <div class="header">
        <div class="header-left">
            <div class="iconfont back-icon" @click='prev'>&#xe641;</div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return {
      
    };
  },
  methods:{   
    prev(){
      this.$router.go(-1)
    }
  },
  mounted(){
  },
}
</script>

<style lang="stylus" scoped>
  .header
    display: flex
    line-height: 1.3rem
    .header-left
      width: 1rem
      float: left
      .back-icon
        text-align: center
        font-size: .6rem
        color #999
</style>
