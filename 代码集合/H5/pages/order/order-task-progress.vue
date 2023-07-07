<template>
  <div class="task-progress-frame">
    <div class="order-head">
      <img src="~/assets/images/home/back@2x.png" @click="goback()" />
      <p>任务进度</p>
    </div>
    <!-- 任务进度 -->
    <div class="progress-box">
      <p class="task-progress">任务名称：<span class="task-name">{{taskName}}</span></p>
      <div class="progress-content" v-if="!toStart">
        <div v-for="(item, index) in progressList" :key="index">
          <div :class="item.gmtCreate ? 'vertical-line' : 'vertical-line bright-line'" v-if="index !=0"></div>
          <div style="position: relative">
            <div class="progress-img-box">
              <img src="~/assets/images/order/jinxingzhong@2x.png" class="progress-img progress-now" v-if="index == 0" />
              <img src="~/assets/images/order/huise@2x.png" class="progress-img" v-else />
              <p :class="index == 0 ? 'progress-name' : 'progress-name complete'">{{item.workProcessName}} </p>
            </div>
            <div v-if="item.processDesc || item.gmtCreate" class="progress-desc">
              <p>备注：{{item.processDesc}}</p>
              <p class="progress-time">{{item.gmtCreate}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="to-start" v-else>
        <img src="~/assets/images/order/jinxingzhong@2x.png" class="progress-img progress-now" />
        <p class="progress-name">待开始</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getTaskProcessList } from '@/api/order'
export default {
  head() {
    return {
      title: '任务进度',
      meta: [
        { name: 'keywords', content: '任务进度' },
        {
          hid: 'description',
          name: 'description',
          content:'任务进度'
        }
      ]
    }
  },
  data(){
    return {
      toStart: 1,//待开始
      taskName:'',
      progressList:[],
    }
  },
  mounted(){
    this.progress(this.$route.query.item,this.$route.query.toStart)
  },
  methods:{
    progress(item,toStart){
      let row = JSON.parse(item);
      this.toStart = Number(toStart);
      console.log(row,this.toStart);
      if(Number(toStart)){
        this.taskName = row.spuName;
      }else{
        getTaskProcessList({taskId: row.id, name: row.workflowName}).then(res=>{
          this.progressList = res.data;
          this.taskName = row.productName;
        })
      };
    },
    goback(){
      history.go(-1);
    }
  }
}
</script>

<style scoped>
.task-progress-frame{
  background: #F4F4F4;
  min-height: 100vh;
  padding-bottom: .32rem;
  padding-top: 50px;
}
.order-head{
  display: flex;
  line-height: 50px;
  background: #FFFFFF;
  position: fixed;
  width: 100%;
  height: 50px;
  top: 0;
  z-index: 1;
}
.order-head p{
  margin: 0 auto;
  font-size: .427rem;
}
.order-head img{
  margin: auto 0;
  width: 15px;
  height: 15px;
  margin-left: 15px;
}
.task-name{
  font-size: .37333rem;
  color: #333333;
  font-weight: 400;
}
.progress-box{
  background: #FFFFFF;
  width: 95%;
  min-height: 150px;
  margin: 10px auto;
  padding: .32rem;
  padding-bottom: 100px;
  border-radius: 5px;
  color: #333333;
  overflow: hidden;
}
.task-progress{
  font-size: 14px;
  font-weight: 550;
  margin-bottom: .32rem;
}
.progress-content{
  font-size: 12px;
}
.progress-name{
  margin-left: 10px;
  margin-top: -0.1rem;
  font-size: .37333rem;
  font-weight: bold;
}
.progress-time{
  color: #C9C9C9;
  margin-top: 0.1rem;
}
.progress-content::-webkit-scrollbar { 
  width: 0 !important;
}
.vertical-line{
  border-left: 1px solid #999999;
  min-height: 3.2rem;
  margin-top: -0.31333rem;
  margin-left: .1rem;
  padding: .2666rem .5333rem;
}
.progress-img-box{
  display: flex;
}
.progress-desc{
  position: absolute;
  padding-left: 20px;
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 30px;
  color: #999999;
}
.progress-img{
  margin-left: 0.015rem;
  width: .21333rem;
  height: .21333rem;
}
.progress-now{
  margin-left: -0.03rem;
  width: .32rem;
  height: .32rem;
}
.complete{
  color: #666666;
  font-weight: normal;
}
.to-start{
  margin-top: .64rem;
  display: flex;
}
</style>