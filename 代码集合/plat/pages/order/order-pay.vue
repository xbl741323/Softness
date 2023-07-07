<template>
  <div>
    <order-property v-if="$route.query.orderType == 0" />
    <order-project v-else/>
  </div>
</template>

<script>
import orderProject from '~/components/order/order-project.vue'
import orderProperty from '~/components/order/order-property.vue'
export default {
  components: { 
    orderProject,
    orderProperty
  },

}
</script>

<style>

</style>