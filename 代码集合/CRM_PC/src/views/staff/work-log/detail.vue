<template>
  <basic-container>
    <div class="work_log">
      <el-tabs v-model="activeName">
        <el-tab-pane label="工作日志" name="work-log"></el-tab-pane>
        <el-tab-pane label="日志设置" name="log-setting"></el-tab-pane>
      </el-tabs>
      <work-log v-if="activeName == 'work-log'"></work-log>
      <log-setting v-if="activeName == 'log-setting'"></log-setting>
    </div>
  </basic-container>
</template>

<script>
import workLog from "@/components/staff/work-log/work-log";
import logSetting from "@/components/staff/work-log/log-setting";
export default {
  components: {
    workLog,
    logSetting,
  },
  data() {
    return {
      activeName: "work-log",
    };
  },
};
</script>

<style scoped>
</style>