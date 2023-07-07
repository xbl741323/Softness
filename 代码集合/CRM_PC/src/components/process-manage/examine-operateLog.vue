<template>
  <div class="log-operate">
    <div class="record-top" v-if="resultList.length > 0">
      <p class="sub-title">结果值记录</p>
      <el-timeline>
        <el-timeline-item v-for="(element, index) in resultList" :key="index" :color="index == 0 ? '#ff6600' : ''" placement="top" hide-timestamp >
          <p class="title">{{ element.indexName }}</p>
          <p><span class="before">{{element.contentBefore}}</span>改为<span class="after">{{element.contentAfter}}</span></p>
          <p>操作人：{{element.opName ? element.opName : "暂无"}}</p>
          <p v-if="element.auditReason">原因：{{ element.auditReason }}</p>
          <p style="color: #999">{{ element.createTime }}</p>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="record-top" v-if="auditList.length > 0">
      <p class="sub-title">审核记录</p>
      <el-timeline>
        <el-timeline-item v-for="(element, index) in auditList" :key="index" :color="index == 0 ? '#ff6600' : ''" placement="top" hide-timestamp>
          <p class="title">{{ element.title }}</p>
          <p>操作人：{{element.createByName ? element.createByName : "暂无"}}</p>
          <p v-if="element.remark" style="white-space: pre-wrap;">{{element.remark}}</p>
          <p style="color: #999">{{ element.createTime }}</p>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { getResultLog, getAuditLog } from "@/api/processmanage/salary";
export default {
  props:{
    flowId: {
      required: true
    }
  },
  data(){
    return {
      resultList: [],
      auditList: []
    }
  },
  mounted(){
    this.getLog();
  },
  methods:{
    getLog(){
      getResultLog(this.flowId).then(res=>{
        this.resultList = res.data.data;
      })
      getAuditLog({type:6, taskId: this.flowId}).then(res=>{
        this.auditList = [];
        // this.auditList = Object.values(res.data.data).map(item => Object.values(item)[0])
        Object.values(res.data.data).forEach(item => {
          item.forEach(element => {
          this.auditList.push(element)
          });
        });
      })
    }
  }
}
</script>

<style scoped>
  .record-top {
    margin-top: 10px;
  }
  .record-top >>> .el-timeline-item__tail {
    position: absolute;
    left: 4px;
    height: 115%;
    border-left: 2px solid #e4e7ed;
  }
  .log-operate{
    display: grid;
    grid-template-columns: repeat(2,1fr);
    max-height: 500px;
    overflow: auto;
  }
  .sub-title{
    padding-left: 5px;
    border-left: 3px solid #62B4FF;
  }
  .before{
    text-decoration: line-through;
    color: #7F7F94;
  }
  .after{
    color: #62B4FF;
  }
  .title{
    color: #333333;
    font-weight: 550;
  }
</style>