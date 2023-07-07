<template>
<!-- 排查完成 -->
  <div class="result_container">
    <div class="achievement-detail-frame">
      <el-tabs v-model="tabName">
        <el-tab-pane name="0" label="成果详情" >
          <detail />
        </el-tab-pane>
        <el-tab-pane name="1" label="操作记录" :key="new Date().getTime()">
          <achievement-records />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import detailHead from "@/page/index/top/index";
import Detail from '@/components/achievement/detail.vue';
import AchievementRecords from '@/components/achievement/achievement-records.vue';
export default {
  components:{
    detailHead,
    Detail,
    AchievementRecords
  },
  data(){
    return {
      tabName: '0',
    }
  },
}
</script>

<style scoped>
.result_container{
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 30px 0;
}
.achievement-detail-frame{
  width: 80%;
  margin-left: 5%;
}
</style>