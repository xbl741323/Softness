<template>
  <div class="notice">
      <headers :type="1" />
      <div class="notice-cont">
          <headers :type="0" />
          <tab-views :type="1" />
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
