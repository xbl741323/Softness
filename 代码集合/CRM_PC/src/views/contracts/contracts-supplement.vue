<template>
<!-- 排查完成 -->
  <div class="supplement-list">
    <supplement-contracts :source="'list'" />
  </div>
</template>

<script>
import supplementContracts from '@/components/contracts/supplement-contracts'
export default {
  components:{
    supplementContracts
  }
}
</script>

<style scoped>
.supplement-list{
  background: #FFFFFF;
  height: 100%;
  padding: 20px;
}
</style>