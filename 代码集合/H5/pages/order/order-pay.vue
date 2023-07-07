<template>
  <div>
    <!-- <order-property v-if="$route.query.orderType == 0" /> -->
    <order-project />
  </div>
</template>

<script>
import orderProject from '~/components/order/order-project.vue'
import OrderProperty from '~/components/order/order-property.vue'

export default {
  components: { 
    orderProject, 
    OrderProperty 
  },
  data(){
    return {

    }
  }
}
</script>

<style>

</style>