<template>
  <div>
    <div class="list-header">
      <p class="rectangle"></p>
      <b class="text">任务信息</b>
    </div>
    <el-table
      :data="taskInfo"
      v-if="taskInfo.length>0"
      :header-cell-style="{ background: '#FAFAFA',color:'#000000D9' }"
      border
      style="margin-bottom: 30px"
    >
      <el-table-column prop="taskNo" label="任务编号" width="180"></el-table-column>
      <el-table-column prop="spuName" label="产品名称" width="180"></el-table-column>
      <el-table-column prop="deliveryName" label="交付物名称" ></el-table-column>
      <el-table-column label="工程师" prop="trTaskEngineer">
        <template slot-scope="scope">
                <el-tooltip effect="dark" :content="'工号：'+ empNo +' 部门：'+ deptName" placement="right">
                  <span @mouseover="showUserInfo(scope.row.trTaskEngineer.engineerId)">{{ scope.row.trTaskEngineer.engineerName }}</span>
                </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryTime" label="计划交付时间"></el-table-column>
      <el-table-column prop="finishTime" label="完成时间"></el-table-column>
      <el-table-column prop="stepName" label="任务进度"></el-table-column>
        <!-- <template slot-scope="scope">
          <span v-show="scope.row.taskStatus==0" class="circleBlue"></span>
          <span v-show="scope.row.taskStatus==1" class="circleBlue in-service"></span>
          <span v-show="scope.row.taskStatus==3" class="success"><b>✔</b></span>
          <span v-show="scope.row.taskStatus==2" class="circleBlue circleRed"></span>
          <span>{{scope.row.taskStatus | taskStatus}}</span>       
        </template> -->
      <el-table-column prop="preFinishLabel" label="任务预处理"></el-table-column>
      <el-table-column prop="refundTaskAmount" label="退款金额"></el-table-column>      
    </el-table>
    <!-- 任务进度 -->
    <el-dialog :visible.sync="scheduleDialog" width="500px" v-if="scheduleDialog">
      <span class="spa">任务进度</span>
      <p><span>产品名称：</span>{{scheduleInfo.task.productName}}</p>
      <div class="schedule">
        <p class="to-start" v-if="activities.length == 0">任务待开始</p>
        <el-timeline v-else>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :color="index == 0 ? '#FF0000' : ''"
            :timestamp="activity.gmtCreate">
            <template>
              <p class="process-name">{{activity.workProcessName}}</p>
              <p class="operate-name">{{activity.operateName}}:{{activity.processDesc}}</p>
            </template>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import taskProgress from '../../task/task-progress.vue';
import { getProgressList } from '@/api/task/index.js'
import refundDataJs from '../refund'
export default {
  components: { taskProgress },
  props:{
    taskInfo:{
      type: Array,
      default: []
    }
  },
  data(){
    return {
      scheduleDialog:false,
      taskId:'',
    }
  },
  filters:{
    filterPrice(val){
      return refundDataJs.filterPrice(val);
    },
    taskStatus(val){
      return refundDataJs.taskStatus(val);
    },
    taskFinishType(val){
      return refundDataJs.taskFinishType(val);
    },
  },
  methods:{
    taskProcess(row){
      this.scheduleInfo = row;
      getProgressList(row.task.id).then(res=>{
        if(res.data.data){
          this.activities = res.data.data;
        }else{
          this.activities = [];
        }
        this.scheduleDialog = true;
      })
    },
  },
  mounted(){
    console.log(this.taskInfo,'------******')
  },
}
</script>

<style scoped>
  @import url('../refund.css');
  
  .task-no{
    display: grid;
    grid-template-columns: 15% 85%;
  }
</style>