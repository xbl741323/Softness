<template>
  <div class="policy-box">
    <ul class="tab-box">
      <li v-for="(tab,index) in tabs" :key="index" @click="toggle(index,tab.view)" :class="[{active:active==index},'tab-item']">
        <p>{{tab.title}}</p>
      </li>
    </ul>
    <!--:is实现多个组件实现同一个挂载点-->
    <component :is="currentView"></component>
  </div>
</template>

<script>
import timeC from './noticeList'
import industry from './areaSlider'
export default {
  props: ["type"],
  data(){
    return {
        policyBg: '/images/home/img01_home@3x.png',
        questionBg: '/images/home/img02_home@3x.png',
        active:0,
        currentView:'timeC',
        tabs:[
            {
            title: this.$t('home.timeClass'),
            view:'timeC'
            },
            {
            title: this.$t('home.industryClass'),
            view:'industry'
            }
        ]
    }
  },
  methods:{
    toggle(i,v){
      this.active=i;
      this.currentView=v;
    }
  },
  components:{
    timeC,
    industry
  }
}
</script>

<style scoped>
.policy-box{
    width: 100%;
    position: relative;
}
.tab-box{
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    z-index: 10;
}
.tab-item{
    flex: 1; 
}
.tab-item p{
    height: 1.6rem;
    width: 2.2rem;
    margin: 0 auto;
    line-height: 1.6rem;
    font-size: .37333333rem;
    color: #666;
    text-align: center;
    justify-content: center;
    align-items: center;  
}
.tab-item.active p{
    color: #36A6FE;
    border-bottom: 2px solid #36A6FE;
    font-weight: 600;
}
</style>