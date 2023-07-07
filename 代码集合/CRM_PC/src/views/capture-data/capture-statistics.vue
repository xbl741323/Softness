<template>
  <div class="statistical_frame">
    <el-tabs v-model="captureTab" class="tabs">
      <el-tab-pane label="抓取统计" name="1">
        <capture-statistics v-if="captureTab == '1'" />
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="2">
        <capture-records v-if="captureTab == '2'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import captureRecords from '../../components/capture/capture-records.vue'
import captureStatistics from '../../components/capture/capture-statistics.vue'
export default {
  components: {
    captureRecords,
    captureStatistics 
  },
  data(){
    return {
      captureTab: "1"
    }
  }
}
</script>

<style scoped>
.statistical_frame{
  background: #FFFFFF;
  /* height: 100%;
  padding: 10px; */
}
.tabs{
  padding-left: 10px;
}
</style>