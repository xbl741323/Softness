<template>
  <basic-container>
    <div class="work_log">
      <el-tabs v-model="activeName">
        <el-tab-pane label="工作日志" name="log-count"></el-tab-pane>
        <el-tab-pane label="日志设置" name="log-setting"></el-tab-pane>
      </el-tabs>
      <log-count v-if="activeName == 'log-count'"></log-count>
      <log-setting v-if="activeName == 'log-setting'"></log-setting>
    </div>
  </basic-container>
</template>

<script>
import logCount from "@/components/staff/work-log/log-count";
import logSetting from "@/components/staff/work-log/log-setting";
export default {
  components: {
    logCount,
    logSetting,
  },
  data() {
    return {
      activeName: "log-count",
    };
  },
};
</script>

<style scoped>
</style>