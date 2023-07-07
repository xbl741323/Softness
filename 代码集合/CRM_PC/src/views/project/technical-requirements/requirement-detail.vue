<template>
<!-- 排查完成 -->
  <div class="need-container">
    <div class="achievement-detail-frame">
      <el-tabs v-model="tabName">
        <el-tab-pane name="0" label="需求详情" >
          <detail />
        </el-tab-pane>
        <el-tab-pane name="1" label="操作记录" :key="new Date().getTime()">
          <requirement-records />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import detailHead from "@/page/index/top/index";
import Detail from './detail.vue';
import requirementRecords from './records.vue';
export default {
  components:{
    detailHead,
    Detail,
    requirementRecords
  },
  data(){
    return {
      tabName: '0',
    }
  },
}
</script>

<style scoped>
.need-container{
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