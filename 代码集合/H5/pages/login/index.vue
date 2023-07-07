<template>
  <div class="wrapper">
      <top-header />
      <div class="content">
          <welcome />
          <div class="tab-switch">
               <ul style="display: flex; align-items: center">
                <li v-for="(tab,index) in tabs" :key="index" @click="toggle(index,tab.view)" :class="[{activeTab:active==index},'tab-title']">
                  {{tab.type}}
                </li>
              </ul>
              <component :is="currentView" ref="child" :lastPath= "fromLastPath" style="margin-top: 1.2rem"></component>
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import topHeader from '~/components/common/topHeader'
import welcome from '~/components/common/welcome'
import account from '~/components/login/account'
import message from '~/components/login/message'
import {toWx} from '@/utils/toWx'
export default {
  layout: "empty",
  components: {
    topHeader,
    account,
    welcome,
    message
  },
  head () {
    return {
      title: this.title,    
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  },
  data(){
    return {
      title: '登录卧涛',
      active:0,
      currentView:'message',
      tabs:[        
        {
          type:'手机号码登录',
          view:'message'
        },{
          type:'账号登录',
          view:'account'
        },
      ],
      lastPath:'',
      fromLastPath:'',
    };
  },
  beforeRouteEnter(to, from, next) {//路由前置守卫
      next(vm => {
          vm.lastPath = from;
          vm.aaa();
      });
  },
  methods:{
    aaa(){
      this.fromLastPath = this.lastPath.path;
      let data = this.fromLastPath;
      this.$refs.child.getPath(data);
    },
    toggle(i,v){
      this.active=i;
      this.currentView=v;
    }
  },
  destroyed(){
    sessionStorage.removeItem('extra_data');
  },
  created(){
    toWx()
  },
}
</script>

<style scoped>
.wrapper{
    width: 100%;
    position: relative;
}
.content{
    margin: 0 .8rem;
}
.tab-switch {
  position: relative;
}
.tab-title{
  font-size:.42rem;
  font-family:PingFang SC;
  font-weight:600;
  line-height:21px;
  color:#999;
}
.tab-title:nth-child(2){
  margin-left: 1.2rem;
}
.activeTab{
  font-size: .58rem;
  color: #666;
}
</style>

