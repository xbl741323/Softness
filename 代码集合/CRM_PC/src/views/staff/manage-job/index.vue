<template>
  <div class="position-rank-frame">
    <el-tabs v-model="activeName">
      <el-tab-pane label="职位管理" name="1"></el-tab-pane>
      <el-tab-pane label="职级管理" name="2"></el-tab-pane>
    </el-tabs>
    <position v-if="activeName == 1" />
    <rank v-if="activeName == 2"/>
  </div>
</template>

<script>
import position from '@/components/staff/manage-job/position'
import Rank from '@/components/staff/manage-job/rank.vue'
export default {
  components: {
    position,
    Rank
  },
  data(){
    return {
      activeName: '1'
    }
  }
}
</script>

<style scoped>
  .position-rank-frame{
    background: #FFFFFF;
    padding: 20px;
  }
</style>