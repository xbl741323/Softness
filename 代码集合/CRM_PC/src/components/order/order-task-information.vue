<!--排查完成-->
<template>
  <div class="task-information">
    <p class="no-data" v-if="taskInfo.length == 0 && orderStatus !=5">任务还未生成，点击<span class="allot-engineers" @click="allotEngineer()">分配工程师</span>生成任务</p>
    <p class="no-data" v-else-if="taskInfo.length == 0 && orderStatus == 5">暂无数据</p>
    <div v-else>
      <span class="spa">任务信息</span>
      <el-table border :data="taskInfo" class="task-table" >
        <el-table-column label="任务编号" prop="task.taskNo" show-overflow-tooltip >
          <template slot-scope="scope">
            <div class="task-no">
              <p class="refund-flag" v-if="scope.row.task.isRefund == 1">退</p>
              <p v-else></p>
              <p> {{scope.row.task.taskNo}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" prop="task.productName" show-overflow-tooltip ></el-table-column>
        <el-table-column label="交付物名称" prop="task.deliverableName"></el-table-column>
        <el-table-column label="工程师" >
          <template slot-scope="scope">
            <el-tooltip class="emp-name" effect="dark" :content="'工号：'+scope.row.task.engineerNo +'   部门：'+scope.row.task.engineerDeptName" placement="left">
              <p>{{scope.row.task.engineerName}}</p>
            </el-tooltip>
            <el-tooltip class="emp-name" effect="dark" :content="'工号：'+scope.row.task.financialNo +'   部门：'+scope.row.task.financialDeptName" placement="left">
              <p>{{scope.row.task.financialName}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="计划交付时间" prop="task.deliveryTime"  show-overflow-tooltip ></el-table-column>
        <el-table-column label="完成时间" prop="task.finishTime" show-overflow-tooltip ></el-table-column>
        <!-- 任务进度taskStatus,0-待开始,1-服务中，-1-已暂停，2-已完成，-2-已关闭 -->
        <el-table-column label="任务进度" prop="task.taskStatus">
          <template slot-scope="scope">
            <span v-show="scope.row.task.taskStatus==0" class="circleBlue"></span>
            <span v-show="scope.row.task.taskStatus==1" class="circleBlue in-service"></span>
            <span v-show="scope.row.task.taskStatus==2" class="success"><b>✔</b></span>
            <span v-show="scope.row.task.taskStatus==-1" class="circleBlue circleRed"></span>
            <span v-if="scope.row.task.taskStatus==1">{{scope.row.task.stepName}}</span>
            <span v-else-if="scope.row.task.taskStatus==2">{{scope.row.task.finishType | taskFinishType}}</span>
            <span v-else>{{scope.row.task.taskStatus | taskStatus }}</span>           
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="menu">
          <template slot-scope="scope">
            <el-button type="text" @click="checkSchedule(scope.row)">查看进度</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
              <p class="operate-name">{{activity.operateName}}：{{activity.processDesc}}</p>
            </template>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderData from './order-data'
import { getProgressList } from '@/api/task/index.js'
export default {
  props:{
    taskInfo: {
      type: Array,
      required: false
    },
    orderStatus:{
      type: Number,
      required: true
    }
  },
  data(){
    return {
      scheduleDialog: false,
      scheduleInfo: {},
      activities: [],
      num: 10
    }
  },
  filters:{
    taskStatus(value){
      return orderData.taskStatus(value);
    },
    taskFinishType(value){
      return orderData.taskFinishType(value);
    }
  },
  methods:{
    checkSchedule(row){
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
    allotEngineer(){
      this.$emit('allotEngineer');  
    },
  }
}
</script>

<style scoped>
.circleRed{
  background: #ff0000 !important;
}
.task-information{
  font-size: 14px;
  min-height: 400px;
}
.allot-engineers{
  color: #3069e2;
  cursor: pointer;
}
.no-data{
  text-align: center;
}
.spa{
  padding-left: 5px;
  border-left: #36a6fe 3px solid;
}
.task-table{
  margin-top: 10px;
}
.circleBlue{
  width: 7px;
  height: 7px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 6px;
  margin-top: 7px !important;
}
.schedule{
  max-height: 520px;
  overflow: auto;
  /* display: grid;
  grid-template-columns: repeat(2,1fr); */
}
.schedule span{
  font-size: 14px;
  font-weight: 600;
}
.to-start{
  color: #FF6600;
  font-weight: 600;
}
.in-service{
  background: #f3ab03;
}
.success {
  font-weight: bolder;
  font-size: 12px;
  display: inline-block;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
.process-name{
  font-size: 14px;
  font-weight: 550;
  color: #000;
}
.operate-name{
  color: #666;
}
.operate{
  margin-left: 40px;
}
</style>
<style>
.el-timeline-item__tail{
  height: 122% !important;
}
.emp-name{
  margin: 0;
}
.task-no{
  display: grid;
  grid-template-columns: 20% 80%;
}
</style>