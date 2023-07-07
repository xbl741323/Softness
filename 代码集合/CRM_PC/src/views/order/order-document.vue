<template>
    <!-- 财税服务 -->
    <div class="personal-order">
       <div class="ml">
      </div> 
      <order-list/>
    </div>
  </template>
  <script>
  import orderList from '@/components/order/document-list.vue'
  export default {
    components: { 
      orderList 
    },
    data(){
      return{
      }
    },
    methods:{
    }
  
  }
  </script>
  
  <style scoped>
  .personal-order{
    background: #FFF;
    padding: 10px;
    font-size: 14px;
  }
  .ml{
      margin-left: 12px;
  }
  </style>