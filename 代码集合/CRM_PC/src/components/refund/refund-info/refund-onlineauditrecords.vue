<template>
  <div>
    <!-- 审核记录 -->
    <div class="process-record">
      <div class="list-header">
        <p class="rectangle"></p>
        <b class="text">审核记录</b>
      </div>
      <div class="record-top">
        <el-timeline v-if="recordData.length > 0">
          <el-timeline-item v-for="(element, index) in recordData" :key="index" :color="index == 0 ? '#ff6600' : ''" placement="top" hide-timestamp>
            <p>
              {{ element.title }}
              <span v-if="element.auditState">{{ element.auditState == 1 ? '：审批通过' : '：审批拒绝' }}</span>
            </p>
            <p>审批备注：{{element.auditReason ? element.auditReason : "暂无"}}</p>
            <p>操作人：{{element.createByName ? element.createByName : "暂无"}}</p>
            <!-- <p v-if="element.auditReason">原因：{{ element.auditReason }}</p> -->
            <p style="color: #999">操作时间：{{ element.updateTime }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    recordData:{
      type: Array,
      default: []
    }
  },
  data(){
    return {
      data:[]
    }
  },
  filters:{
    operatorName(val){
      return val ? val : '暂无';
    },
    remark(val){
      return val ? val :'暂无';
    }
  },
  mounted(){
    this.data = this.recordData.reverse();
  }
}
</script>

<style scoped>
  @import url('../refund.css');
</style>
