<template>
  <div class="task-schdule">
    <div v-if="activities.length>0">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities.slice(0,num)"
          :key="index"
          :color="index == 0 ? '#FF0000' : ''"
          :timestamp="activity.updateTime || activity.createTime">
          <template>
            <p class="process-name">
              <span v-if="activity.stepName.indexOf('完成') !=-1">{{ activity.finishLabel }}</span>
              <span v-else>{{ activity.stepName }}</span>
            <p class="operate-name">{{activity.createName}}{{activity.description?'：':''}}{{activity.description}}</p>
          </template>
        </el-timeline-item>
      </el-timeline>
      <div class="operate">
        <el-button type="text" icon="el-icon-arrow-down" v-if="activities.length>10 && !isAll" @click="openMore()">继续展开</el-button>
        <el-button type="text" icon="el-icon-arrow-up" v-if="num>10" @click="close()">收起</el-button>
      </div>
    </div>
    <div v-else class="no-data-msg">
      <p>暂无任务进度提交！</p>
    </div>
  </div>
</template>
<script>
import { getProgressList } from '@/api/task/index.js'
export default {
  props:{
    taskId:{
      type: Number,
      required: true,
    },
    listType:{
      required: true
    },
    apiInfo:{
      type: Object,
      required: true,
      default: ()=>{}
    }
  },
  data(){
    return {
      reverse: false,
      activities: [],
      num: 10,//显示的进度数量
      isAll: false,//数据是否全部展开
    }
  },
  mounted(){
    this.getList();
  },
  methods:{
    openMore(){
      this.num+=10;
      if(this.num >= this.activities.length){
        this.isAll = true;
      }
      this.getList();
    },
    close(){
      this.num = 10;
      this.isAll = false;
      this.getList();
    },
    getList(){
      getProgressList(this.taskId, this.listType, this.apiInfo).then(res=>{
        if(res.data.data){
          this.activities = res.data.data;
        }
      })
    }
  }
}
</script>

<style scoped>
.task-schdule{
  height: 100%;
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
  height: 115% !important;
}
.no-data-msg{
  text-align: center;
  color: #d3d47e;
}
</style>