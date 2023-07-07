<template>
  <div class="reg_wrapper">
    <div class="wrapper_top">
      <div class="top_title" style="color:#3d85dc;" @click="toHome">
        WOTAO
        <span style="margin:0 20px;"></span>
        <span style="color:#397DCF;">卧涛 |</span>
        <span style="color:#999999;">欢迎来到卧涛!</span>
      </div>
    </div>
    <div class="wrapper_content">
      <img :src="require('@/assets/images/login/bag_login@2x.jpg')" alt />
      <div class="content_desc">
        <div>卧涛—专注企业服务</div>
        <div>卧，取意“卧龙”；涛，取意“海阔天空”</div>
        <div>卧涛，蕴含中华传统文化“厚积薄发、厚德载物、自强不息“之美德。</div>
      </div>
    </div>
    <div class="wrapper_foot">
      <div>
        <span style="cursor:pointer;" v-for="(item,index) in list" :key="index">
          <nuxt-link v-if="index==0||index==1" :to="item.path" class="nuxt_sty">{{ item.title }}</nuxt-link>
          <span v-else class="nuxt_sty" @click="showMeqia">{{ item.title }}</span>
          <span class="special_class" v-if="index!==3"></span>
        </span>
      </div>
      <div style="margin-top:10px;font-size:14px;color:#999999;">
        <span>版权所有© 卧涛科技有限公司 皖ICP备13016955号-22</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          title: '关于卧涛',
          path: 'aboutWt'
        },{
          title: '项目申报',
          path: 'project'
        },{
          title: '联系我们',
          path: 'project'
        },{
          title: '在线咨询',
          path: 'project'
        }
      ]
    };
  },
  methods:{
      showMeqia(){
        window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
      },
      toHome(){
        this.$router.push('/')
      }
  },  
};
</script>

<style scoped>
.reg_wrapper {
  width: 100%;
  font-family: Microsoft YaHei UI;
}
.wrapper_top {
  /* background: lightblue; */
  width: 100%;
  height: 80px;
}
.top_title {
  /* background: red; */
  height: 80px;
  font-size: 24px;
  line-height: 80px;
  margin-left: 410px;
  cursor: pointer;
}
.wrapper_content {
  /* background: lightYellow; */
  width: 100%;
  height: 720px;
  position: relative;
}
.content_desc {
  color: #fff;
  position: absolute;
  left: 21%;
  top: 128px;
}
.content_desc > div:nth-of-type(1) {
  font-size: 40px;
  font-weight: 400;
}
.content_desc > div:nth-of-type(2) {
  font-size: 16px;
  margin-top: 40px;
  color: #ffffff;
  font-weight: 300;
}
.content_desc > div:nth-of-type(3) {
  font-size: 16px;
  color: #ffffff;
  margin-top: 8px;
  font-weight: 300;
}
.wrapper_content img {
  width: 100%;
  height: 720px;
  position: absolute;
}
.wrapper_foot {
  /* background: lightblue; */
  width: 100%;
  height: 100px;
  font-size: 14px;
  color: #666666;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.special_class {
  display: inline-block;
  width: 0px;
  height: 12px;
  border: 1px solid rgba(207, 207, 207, 1);
  opacity: 1;
  margin: 0 13px 0 9px;
}
.nuxt_sty {
  color: #666666;
  text-decoration: none;
}
</style>