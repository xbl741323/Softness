<template>
<!-- 排查完成 -->
  <!-- 法律服务 -->
  <div class="legal-service">
    <product-list :productType="10" />
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