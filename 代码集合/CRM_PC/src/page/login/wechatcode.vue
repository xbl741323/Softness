<template>
    <div class="login-container" :style="backImg" v-loading="isLoading">
      <div class="login-weaper  animated bounceInDown" :style="loginImg" v-if="isShow">
        <div class="login-logo">
          <img :src="baseUrl+'img/bg/wotao_icon.png'" alt="">
        </div>
        <div @click="goBack()" class="we_login">
          <img src="@/assets/images/my-home/wx_back.png" alt="" class="wx_back">
          <span class="wx_text">&nbsp;微信登录</span>
        </div>
        <div class="login-border">
          <div class="login-main">
                <div class="code_box">
                  <iframe :src="qrcodeImg" frameborder="0" scrolling="no"   width="310" height="330" sandbox="allow-scripts allow-top-navigation allow-same-origin" ></iframe>
                </div>
            <div class="login-menu"></div>
          </div>
        </div>
      </div>
      <div class="login-copyright">
        {{ website.copyright}}com
      </div>
      <top-color v-show="false" />
    </div>
</template>
<script>
import * as CodeMsg from "@/api/common/CodeChange"
import { mapGetters } from 'vuex'
import { getWxUrl } from '@/api/admin/user'
import { judgeIsBind} from '@/api/admin/user'
import topColor from '@/page/index/top/top-color'

export default {
  name: 'Login',
  components: {
    topColor
  },
  data () {
    return {
      isLoading: false,
      isShow: true,
      code:'',
      state:'',
      backImg:{ 
        backgroundImage: "url('" + process.env.BASE_URL + "img/bg/fast_bg.png'),url('" + process.env.BASE_URL + "img/bg/fast_bg.png'),url('" + process.env.BASE_URL + "img/bg/jianbian_bg.png')"
      },
      loginImg:{
        backgroundImage: "url('" + process.env.BASE_URL + "img/bg/dlk_bg.png')",
        backgroundSize: '100% 100%'
      },
      baseUrl: process.env.BASE_URL,
      qrcodeImg: '',
      loginForm: {
        username: '',
        password: '',
        code: '',
        randomStr: 'blockPuzzle'
      },
      socialForm: {
        code: '',
        state: ''
      },
    }
  },
  created () {
    this.watermark()
  },
  mounted () {
    this.getWxUrl()
  },
  watch: {
    $route: {
      handler (val) {
        if(val.query.code){
          this.code = val.query.code 
          this.state = val.query.state
          this.isLoading = true
          this.isShow = false
          this.judgeIsBind()
        }
        
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['website', 'tagWel'])
  },
  methods: {
    watermark () {
      const text = ''
      const canvas = document.createElement('canvas')
      canvas.width = '500'
      canvas.height = '200'
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, 200, 200) // 绘制之前画布清除
      ctx.font = '30px 黑体'
      ctx.rotate(-20 * Math.PI / 180) // 为了实现水印倾斜效果,旋转画布坐标系
      ctx.fillStyle = 'rgba(100,100,100,0.15)' // 画笔颜色
      ctx.fillText(text, -20, 200) // 书写的内容及位置
      ctx.rotate('20*Math.PI/180') // 坐标系还原,如果后续没有其他操作,这一步可以省略
      // 将canvas的内容转换为base64编码
      const data = canvas.toDataURL('image/png', 1) // 1表示质量(无损压缩)

      window.onload = () => {
        const background = 'url(' + data + ') repeat'
        var watermark = document.createElement('div')
        watermark.style.width = '100%'
        watermark.style.height = '100%'
        watermark.style.position = 'fixed'
        watermark.style.left = '0'
        watermark.style.top = '0'
        watermark.style.pointerEvents = 'none'
        watermark.style.background = background
        watermark.style.zIndex = '9999'
        document.body.append(watermark)
      }
    },
    goBack(){
      this.$router.push('/login')
    },
    getWxUrl(){
      getWxUrl({type: 1}).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          this.qrcodeImg = res.data.data
        }
      })
    },
    //判断是否绑定微信
    judgeIsBind(){
      judgeIsBind(this.state, this.code).then(res => {
        this.isLoading = false
        let data = res.data
        if(data.access_token){
          this.$store.commit('SET_ACCESS_TOKEN', data.access_token)
          this.$store.commit('SET_REFRESH_TOKEN', data.refresh_token)
          this.$store.commit('SET_EXPIRES_IN', data.expires_in)
          this.$store.commit('SET_USER_INFO', data.user_info)
          this.$store.commit('SET_PERMISSIONS', data.user_info.authorities || [])
          this.$store.commit('CLEAR_LOCK')
          this.$router.push({ path: this.tagWel.value })
        }else if(res.data.code == CodeMsg.CODE_90002){
          this.$message({
            type: "warning",
            message: '该微信未绑定员工账号，请输入信息进行绑定',
            offset: 300,
            duration: 1000
          });
          this.$router.push({
            path: "/wechatlogin",
            query: {
              unionId: res.data.data
            }
          })
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/wechat.scss";
</style>

