<template>
<!-- 排查完成 -->
  <!-- 工商注册 -->
  <div class="gs-register">
    <!-- <commonList :productType="7"></commonList> -->
    <product-list :productType="7" />
  </div>
</template>

<script>
// import commonList from "@/components/project/common-service/index";
import ProductList from '../../index'
export default {
  components: {
    // commonList,
    ProductList
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>