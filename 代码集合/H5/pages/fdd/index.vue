<template>
    <div class="wrapper">
        <div class="head">返回小程序页面</div>
        <div class="back-app">
          <img :src="this.from =='user' ? require('@/assets/images/fdd/auth.png') : require('@/assets/images/fdd/order.png')" alt="">
          <!-- <button @click="openSdaXcx()">返回卧涛商城小程序</button> -->
        </div>
        <p>长按识别小程序码返回卧涛商城小程序</p>
    </div>
  </template>  
  <script>  
  export default {        
    head () {
      return {
        title: '返回小程序',    
        meta: [
          { hid: 'description', name: 'description', content: '卧涛商城小程序' }
        ]
      }
    },
    data(){
      return {
        from:null,
      }
    },
    methods:{  
      openSdaXcx() {
        // 这里退回到上一级页面, 也就是刚刚跳转前的页面
          wx.miniProgram.navigateTo({
              url: '/personal/pages/authentication/authentication',
              success: function(res) {
                this.$toast('success')
                this.$toast(res)
                console.log('res', res)
              },
              fail: function(error) {
                this.$toast('fail')
                this.$toast(error)
                console.log('error', error)
              },
              complete: function(msg) {
                this.$toast('complete')
                this.$toast(msg)
                console.log('msg', msg)
              }
          })
      },
    },
    mounted(){
      
    },
    created(){
      this.from = this.$route.query.root
      console.log(this.from)
    }
  }
  </script>
  
  <style lang="stylus" scoped>
    .wrapper
      width: 100%
      position: relative
      height: 100%
      .head
        position: fixed
        top: 0
        left: 0
        width: 100%
        text-align: center
        font-size: $fs14
        height: $fs42
        line-height: $fs42
        color: #333
        font-weight: bold
      .back-app
        width: 62%
        margin: 6rem auto 2rem auto
        button
          width: 100%
          height: $fs42
          line-height: $fs42
          background: #eee
          color: #666
          border: none
          font-weight: bold
          font-size: $fs14
          border-radius: $fs6
        img
          width: 100%
      p
        font-size: $fs14
        font-weight: bold
        color: #666
        text-align: center
  </style>
  
  