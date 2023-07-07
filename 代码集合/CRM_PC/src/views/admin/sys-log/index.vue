<template>
  <div class="sys_log">
    <!-- 筛选区域 -->
    <!-- <el-radio-group v-model="logType" class="bottom_sty">
       <el-radio-button border :label="0" class="right_sty">{{ $t("message.operateLog") }}</el-radio-button>
       <el-radio-button border :label="1" class="border_sty">{{ $t("message.sysLog") }}</el-radio-button>
    </el-radio-group> -->
    <!-- <operate-log v-if="logType == 0"></operate-log> -->
    <!-- <sys-log v-if="logType == 1"></sys-log> -->
    <sys-log></sys-log>
  </div>
</template>

<script>
// import operateLog from "@/components/sys-log/operate-log"
import sysLog from "@/components/sys-log/sys-log"
import { getEmpOperate } from "@/api/admin/user";
export default {
  components:{
    // operateLog,
    sysLog
  },
  data() {
    return {
        // logType:0,
    };
  }
};
</script>

<style scoped>
.sys_log {
  margin: 0px 10px;
  padding: 40px;
  padding-bottom: 100px;
  background: #fff;
}
.bottom_sty{
  margin-bottom:20px;
}
.right_sty{
  margin-right:20px;
}
.border_sty{
  border-left:1px solid #ccc;
}
</style>