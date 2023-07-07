<template>
  <div class="notice">
      <headers :type="2" />
      <div class="notice-cont">
          <tab-views :type="2" />
      </div>
  </div>
</template>
<script>
import Headers from './noticeComponents/headBg'
import tabViews from './noticeComponents/tabViews'
export default {
    components: {
        Headers,
        tabViews
    },
  data(){
    return {
      
    };
  },
  methods:{  
  }
}
</script>
<style scoped>
    .notice{
        width: 100%;
        background: #fff;
    }
    .notice-cont{        
        margin: 0 .426666666rem
    }
</style>
