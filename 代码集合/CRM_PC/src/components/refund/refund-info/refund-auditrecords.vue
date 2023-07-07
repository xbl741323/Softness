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
          <el-timeline-item
            v-for="(element, index) in recordData"
            :key="index"
            :color="index == 0 ? '#ff6600' : ''"
            placement="top"
            hide-timestamp
          >
            <p>{{ element.auditStatus | cancleStatus }} </p>
            <el-tooltip v-if="element.operatorNo" effect="dark" :content=" '工号：' + element.operatorNo +'  部门：' + element.operatorDept" placement="right">
              <span> 操作人：{{ element.operatorName ? element.operatorName : "暂无"}}</span>
            </el-tooltip>
            <el-tooltip v-else effect="dark" content="暂无" placement="right">
              <span> 操作人：{{ element.operatorName ? element.operatorName : "暂无" }}
              </span>
            </el-tooltip>
            <p v-if="element.auditStatus != 0 && element.auditStatus != 5"> 审批意见： {{ element.auditNote ? element.auditNote : "暂无" }}</p>
            <p>{{ element.gmtCreate }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script>
import refundDataJs from '../refund'
export default {
  props:{
    recordData:{
      type: Array,
      default:[]
    }
  },
  filters:{
    cancleStatus(val){
      return refundDataJs.cancleStatus(val);
    }
  }
}
</script>

<style scoped>
  @import url('../refund.css');
</style>
