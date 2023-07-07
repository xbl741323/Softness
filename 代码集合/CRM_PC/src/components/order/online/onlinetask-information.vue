<template>
  <div class="task-information">
    <p class="no-data" v-if="orderStatus == 0 || orderStatus == 1" >任务还未生成，{{orderStatus | statusTransfer}}后生成任务</p>
    <div v-else>
      <p class="no-data" v-if="taskInfo.length == 0" >任务还未生成，等待用户认证后生成任务</p>
      <div v-if="taskInfo && taskInfo.length>0&&autStatus != 0">
        <span class="spa">任务信息</span>
        <el-table border :data="taskInfo" class="task-table" >
          <el-table-column label="任务编号" prop="taskNo" show-overflow-tooltip >
            <template slot-scope="scope">
              <div class="task-no">
                <!-- <p class="refund-flag" v-if="scope.row.task.isRefund == 1">退</p>
                <p v-else></p> -->
                <p> {{scope.row.taskNo}}</p>
                <span v-if="'1,2,3,4'.includes(scope.row.refundStatus)" class="refundFont" :style="scope.row.refundStatus == 4 ? 'border: 2px solid #70b603' : ''">退</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" prop="spuName" show-overflow-tooltip ></el-table-column>
          <el-table-column label="交付物名称" prop="deliveryName"></el-table-column>
          <el-table-column label="工程师" >
            <template slot-scope="{row}">
              <div v-for="item in row.trTaskEngineerList" :key="item.id">
                <el-tooltip class="emp-name" effect="dark" :content="'工号：'+ empNo +'   部门：'+ deptName" placement="left">
                  <p @mouseover="showUserInfo(item.engineerId)">{{item.engineerName}}</p>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="计划交付时间" prop="deliveryTime"  show-overflow-tooltip ></el-table-column>
          <el-table-column label="完成时间" prop="finishTime" show-overflow-tooltip ></el-table-column>
          <!-- 任务状态taskStatus,0-待开始,1-服务中，2-冻结中，3-已完成，4-已关闭 -->
          <el-table-column label="任务进度" prop="taskStatus">
            <template slot-scope="scope">
              <span v-show="scope.row.taskStatus==0" class="circleBlue"></span>
              <span v-show="scope.row.taskStatus==1" class="circleBlue in-service"></span>
              <span v-show="scope.row.taskStatus==2" class="success"><b>✔</b></span>
              <span v-show="scope.row.taskStatus==-1" class="circleBlue circleRed"></span>
              <span v-if="scope.row.taskStatus==1">{{scope.row.stepName}}</span>
              <span v-else-if="scope.row.taskStatus==2">{{scope.row.finishType | taskFinishType}}</span>
              <span v-else>{{scope.row.taskStatus | taskStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="menu">
            <template slot-scope="scope">
              <el-button type="text" @click="checkSchedule(scope.row)">查看进度</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div> 
    <!-- 任务进度弹窗 -->
   <el-dialog :visible.sync="scheduleDialog" width="500px" v-if="scheduleDialog">
      <span class="spa">任务进度</span>
      <p><span>产品名称：</span>{{scheduleInfo.spuName}}</p>
      <div class="schedule">
        <p class="to-start" v-if="activities.length == 0">任务待开始</p>
        <el-timeline v-else>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :color="index == 0 ? '#FF0000' : ''"
            :timestamp="activity.createTime">
            <template>
              <p class="process-name">{{activity.createName}}</p>
              <p class="operate-name">{{activity.stepName}}{{activity.processDesc!=null?(':'+activity.processDesc):''}}</p>
            </template>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderData from '@/components/order/order-data.js'
import { getProgressList } from '@/api/task/index.js'
export default {
  props:{
    taskInfo: {
      type: Array,
      required: false
    },
    orderStatus:{
      type: Number,
      required: false
    },
    autStatus:{
      type: Number,
      required: false
    },
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
    },
    statusTransfer(value){
      return orderData.statusTransfer(value);
    }
  },
  methods:{
    checkSchedule(row){
      this.scheduleInfo = row;
      getProgressList(row.id,'personal').then(res=>{
        if(res.data.data){
          this.activities = res.data.data;
        }else{
          this.activities = [];
        }
        this.scheduleDialog = true;
      })
    }
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
}
.no-data{
  margin-top: 100px;
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
  display: flex;
}
.refundFont{
  display: inline-block;
  position: relative;
  left: 0px;
  top: 0;
  width: 26px;
  height: 26px;
  font-size: 16px;
  border: 2px solid #bfbf00;
  line-height: 26px;
  text-align: center;
  border-radius: 50%;
}
</style>