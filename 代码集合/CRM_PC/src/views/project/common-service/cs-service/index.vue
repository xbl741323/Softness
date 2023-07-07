<template>
  <!-- 财税服务 -->
  <div class="cs-service">
    <product-list :productType="8" />
  </div>
</template>

<script>
import ProductList from '../../index'
export default {
  components: {
    ProductList
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>