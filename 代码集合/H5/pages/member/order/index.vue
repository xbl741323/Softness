<template>
  <div class="wrap">
    <mt-header title="我的订单" />
    <all-order :orderStatus="orderStatus" />
  </div>
</template>

<script>
import mtHeader from '~/components/common/mtHeader'
import allOrder from '~/components/order/allOrder'
export default {
  components: {
    mtHeader,
    allOrder
  },
  head() {
    return {
      title: '我的订单',
      meta: [
        { charset: "utf-8" },
        {
          name: "keywords",
          content:"卧涛-专注企业服务"
        },
        {
          hid: "description",
          name: "description",
          content:
              "卧涛网平台汇集全国各地市科技项目申报通知、项目政策公告，及时更新，快速查询。落地企业项目申报最后一公里。"
          }
      ],
    };
  },
  data(){
    return{        
      orderStatus:''
    }
  },
  destroyed(){
    window.removeEventListener('popstate', this.goMember, false);
  },
  mounted(){
    if(window.history && window.history.pushState){
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goMember, false);
    }
    this.orderStatus = this.$route.query.status;
  },
  methods:{
    goMember(){
      history.pushState(null, null, document.URL);
      this.$router.push({
        path:'/member'
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
.wrap{
    background: #EEF1F2;
    height: 100%;
    padding-bottom: 20px;    
}
</style>