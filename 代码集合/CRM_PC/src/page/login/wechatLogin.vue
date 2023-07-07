<template>
    <div class="login-container" :style="backImg">
      <div class="login-weaper  animated bounceInDown" :style="loginImg">
        <div @click="goBack()" class="we_login">
          <img src="@/assets/images/my-home/wx_back.png" alt="" class="wx_back">
          <span class="wx_text">&nbsp;微信绑定</span>
        </div>
        <div class="login-logo">
          <img :src="baseUrl+'img/bg/wotao_icon.png'" alt="">
        </div>
        <div class="login-border">
          <div class="login-main">
            <phoneLogin :unionId="unionId" @passval="getValue"></phoneLogin>
            <div class="login-menu"></div>
          </div>
        </div>
      </div>
      <div class="login-copyright">
        {{ website.copyright}}com
      </div>
      <top-color v-show="false" />
      <el-dialog
        :visible.sync="dialogVisible"
        width="25%"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        center
        custom-class="dialog-sty">
        <div>
            <div class="dialog-txt">该账户已绑定其他微信</div>
            <div class="dialog-btn">
              <el-button @click="dialogVisible = false">不换绑</el-button>
              <el-button type="primary" @click="changeBind">换绑并登录</el-button>
            </div>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import * as CodeMsg from "@/api/common/CodeChange"
import phoneLogin from './phonelogin'
import { mapGetters } from 'vuex'
import { getStore, setStore } from '@/util/store'
import topColor from '@/page/index/top/top-color'
import { judgeIsBind, changeWxBind } from '@/api/admin/user';

export default {
  name: 'Login',
  components: {
    phoneLogin,
    topColor
  },
  data () {
    return {
      backImg:{ 
        backgroundImage: "url('" + process.env.BASE_URL + "img/bg/fast_bg.png'),url('" + process.env.BASE_URL + "img/bg/fast_bg.png'),url('" + process.env.BASE_URL + "img/bg/jianbian_bg.png')"
      },
      loginImg:{
        backgroundImage: "url('" + process.env.BASE_URL + "img/bg/dlk_bg.png')",
        backgroundSize: '100% 100%'
      },
      tenantList: [],
      active: '',
      activeName: 'user',
      socialForm: {},
      baseUrl: process.env.BASE_URL,
      code: '',
      state: '',
      unionId: '',
      newUnionId: '',
      dialogVisible: false,
      userId: ''
    }
  },
  created () {
    this.watermark()
    if(this.$route.query.unionId){
      this.unionId = this.$route.query.unionId
    }   
  },
  mounted () {
    
  },
  computed: {
    ...mapGetters(['website', 'tagWel'])
  },
  methods: {
    handleCommand (command) {
      setStore({ name: 'tenantId', content: command })
    },
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
      this.$router.push('/wechatcode')
    },
    // 获取子组件传值
    getValue(val){
      this.dialogVisible = val.dialogVisible
      this.userId = val.userId
    },
    // 换绑
    changeBind(){
      this.dialogVisible = false
      let params = {
        userId: this.userId,
        unionId: this.unionId,
      }
      changeWxBind(params).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          this.newUnionId = res.data.data
          this.judgeIsBind()
        }else{
          this.$message({
            type: "warning",
            message: res.data.msg,
            offset: 300,
            duration: 1000
          });
        }
      })
    },
    //登录
     judgeIsBind(){
        judgeIsBind('WECHAT_BIND', this.newUnionId).then(res=> {
          let data = res.data
          if(data.access_token){
            this.$message({
              type: "success",
              message: '微信换绑成功',
              offset: 300,
              duration: 1000
            });
            this.$store.commit('SET_ACCESS_TOKEN', data.access_token)
            this.$store.commit('SET_REFRESH_TOKEN', data.refresh_token)
            this.$store.commit('SET_EXPIRES_IN', data.expires_in)
            this.$store.commit('SET_USER_INFO', data.user_info)
            this.$store.commit('SET_PERMISSIONS', data.user_info.authorities || [])
            this.$store.commit('CLEAR_LOCK')
            this.$router.push({ path: this.tagWel.value })
          }
        }).catch(error => {
          console.log(error)
        })
      },

  }
}
</script>

<style lang="scss">
  @import "@/styles/login.scss";
</style>
