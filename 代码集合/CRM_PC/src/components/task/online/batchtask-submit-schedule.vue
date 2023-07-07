<template>
  <div class="schedule-form">
      <!-- 任务0 ? '待开始' : value == 1 ? '进行中' : value == 2 ? '已暂停' : value == 3 ? '已完成' : value == 4 ? '已关闭' : '' -->
      <!--订单 1 ? '待分配' : value == 0 ? '待开始' : value == 2 ? '进行中' : value == 3 ? '已暂停' : value == 4 ? '已完成' : value == 5 ? '已关闭' : value == 6 ?'待付款':value == 7?'已取消':value == 8?'已删除':'' -->
    <el-form :model="taskSchduleForm" ref="taskSchduleForm" :rules="rules">
      <el-form-item label="选择进度：" prop="workflowId">
        <!-- 任务已完成的进度提交进度 -->
        <el-radio-group v-if="taskSchduleForm.currentFlag==99" v-model="taskSchduleForm.workflowId" class="task-schedule" @change="getProcessName(1)">
          <el-radio :label="99" >完成<span style="color:#aaa;font-size:12px" v-if="taskSchduleForm.currentWorkflowFinishType=='B' || taskSchduleForm.currentWorkflowFinishType=='C'">（请选择具体的完成结果）</span></el-radio>
          <el-form-item v-if="isShow " style="margin-left:30px;margin-bottom:20px" prop="taskFinishType">
            <el-radio-group  v-model="taskSchduleForm.taskFinishType">
                <el-radio :label="0" v-if="taskSchduleForm.currentWorkflowFinishType=='C'">完成，不记录是否通过</el-radio>
                <el-radio :label="1">完成，且结果通过</el-radio>
                <el-radio :label="2">完成，结果未通过</el-radio>
            </el-radio-group> 
          </el-form-item>
          <el-radio  label="4" style="color:red">任务关闭</el-radio>
        </el-radio-group>
        <!-- 任务已关闭且订单关闭或完成 的进度提交进度 -->
        <el-radio-group @change="getProcessName(1)" v-else-if="taskSchduleForm.currentWorkflowId==4 && (taskSchduleForm.orderStatus==4 || taskSchduleForm.orderStatus==5 )" v-model="taskSchduleForm.workflowId" class="task-schedule">
          <el-radio :label="99" >完成<span style="color:#aaa;font-size:12px" v-if="taskSchduleForm.currentWorkflowFinishType=='B' || taskSchduleForm.currentWorkflowFinishType=='C'">（请选择具体的完成结果）</span></el-radio>
          <el-form-item v-if="isShow" style="margin-left:30px;margin-bottom:20px" prop="taskFinishType">
            <el-radio-group  v-model="taskSchduleForm.taskFinishType">
                <el-radio :label="0" v-if="taskSchduleForm.currentWorkflowFinishType=='C'">完成，不记录是否通过</el-radio>
                <el-radio :label="1">完成，且结果通过</el-radio>
                <el-radio :label="2">完成，结果未通过</el-radio>
            </el-radio-group> 
          </el-form-item>
         </el-radio-group>
         <el-radio-group v-else v-model="taskSchduleForm.workflowId" class="task-schedule" @change="getProcessName()">
          <!-- 任务（不是已暂停且不是已关闭）且订单不是已关闭 -->
          <el-radio v-if="orderStatus != 5" :label="taskSchduleForm.nextWorkflowId">下一进度：{{taskSchduleForm.nextWorkflowName}}</el-radio>
          <el-form-item v-if="isShow" style="margin-left:30px;margin-bottom:20px" prop="taskFinishType">
            <el-radio-group v-model="taskSchduleForm.taskFinishType">
                <el-radio :label="0" v-if="nextWorkflowFinishType=='C'">完成，不记录是否通过</el-radio>
                <el-radio :label="1">完成，且结果通过</el-radio>
                <el-radio :label="2">完成，结果未通过</el-radio>
            </el-radio-group> 
          </el-form-item>
          <!-- 任务进行中 或 任务待开始且订单不是已关闭  或  任务已暂停且（订单不是已完成或已关闭）  或  任务已暂停且订单已关闭 -->
          <el-radio v-if="orderStatus !=4 && orderStatus !=5" label="4">
              <span style="color:red;">任务关闭</span>
             <span class="note" v-if="orderStatus !=4 && orderStatus !=5">(谨慎选择，订单完成前可重启任务)</span>
          </el-radio>
          <!-- 任务进行中 -->
          <el-radio v-if="showContinue==true" label="2">任务暂停<span class="note">(订单完成或关闭前可重启任务)</span></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="进度描述：" >
        <el-input 
          v-model="taskSchduleForm.processDesc"
          type="textarea"
          maxlength="100"
          show-word-limit
          :rows="5"
        />
      </el-form-item>
    </el-form>
    <div class="btn-schedule">
      <el-button type="primary" @click="submitSchedule()" v-preventReClick>确定</el-button>
      <el-button type="warning" @click="cancel()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { commitProcess,batchcommitToFinish } from '@/api/task/index.js' 
import { submitProgress } from "@/api/task/new-task";
export default {
  props:{
    taskInfo:{
      type: Object,
      required: true
    },
    taskId: {
      type: Number,
      required: true
    },
    taskStatus:{
      type: Number,
      required: true
    },
    orderStatus:{
      type: Number,
      required: true
    },
    listType:{    
      type: String,
      default: null
    },
    taskIds:{
      type:Array,
      default:[]  
    },
    alltasks:{
      type:Array,
      default:[] 
    },
    whichUrl:{
        type:Boolean,
        required: true
    }
  },
  data(){
    return {
      taskSchduleForm: {
        taskFinishType:null,        
        workflowId:null,          
        processDesc:null,          
        currentWorkflowFinishType:null   
      },
      originalTaskFinishType:null,
      nextWorkflowFinishType:"",
      isShow:false,
      rules:{
        workflowId: [{required: true, message: '请选择进度',trigger: 'change'}],
        taskFinishType:[{required: true, message: '请选择完成类别', trigger: 'change'}]
      },
      showContinue:false,
      specialform:{}
    }
  },
  mounted(){
    this.showContinue = this.alltasks.every(item=>item.taskStatus==1 || item.taskStatus==2)?true:false
    this.getCurrentSchedule();
  },
  methods:{
    cancel(){
      this.$emit('ccolsebatchProcessDialog',this.alltasks);
    },
    getProcessName(type){//type:1-"已完成、已关闭"提交进度
      if(type==1){
        if(this.taskSchduleForm.workflowId == 99){
          if(this.taskSchduleForm.currentWorkflowFinishType=="B" || this.taskSchduleForm.currentWorkflowFinishType=="C" ){
            this.isShow=true;
          }else if(this.taskSchduleForm.currentWorkflowFinishType=="A" ){
            this.isShow=false;
            this.taskSchduleForm.taskFinishType=0;
          }else{
            this.isShow=false;
            this.taskSchduleForm.taskFinishType=null;
          }
            this.taskSchduleForm.flag=99;  
        }else{
          this.isShow=false;
          this.taskSchduleForm.taskFinishType=this.originalTaskFinishType;
        }
      }else{
        // 当前进度
        if(this.taskSchduleForm.workflowId == this.taskSchduleForm.currentWorkflowId){
          this.taskSchduleForm.workProcessName = this.taskSchduleForm.currentWorkflowName;
          this.taskSchduleForm.flag = this.taskSchduleForm.currentFlag;
        // 下一进度
        }else if(this.taskSchduleForm.workflowId == this.taskSchduleForm.nextWorkflowId){
          this.taskSchduleForm.workProcessName = this.taskSchduleForm.nextWorkflowName;
          this.taskSchduleForm.flag = this.taskSchduleForm.nextFlag;
        }
        if(this.taskSchduleForm.workflowId == this.taskSchduleForm.nextWorkflowId){
          if(this.nextWorkflowFinishType=="B" || this.nextWorkflowFinishType=="C" ){
            this.isShow=true;
          }else if(this.nextWorkflowFinishType=="A" ){
            this.isShow=false;
            this.taskSchduleForm.taskFinishType=0;
          }else{
            this.isShow=false;
            this.taskSchduleForm.taskFinishType=null;
          }
        }else{
          this.isShow=false;
          this.taskSchduleForm.taskFinishType=null;
        }
      }     
    },
    getCurrentSchedule(){
     // 获取可操作的进度选项
     submitProgress(this.taskId,this.whichUrl).then(res=>{
        if(res.data.code ==1){
          this.$message({
            type: 'warning',
            message: res.data.msg
          });
        }else{
          this.taskSchduleForm = res.data.data;
          this.specialform = JSON.parse(JSON.stringify(res.data.data))
          this.originalTaskFinishType=res.data.data.taskFinishType;
          if(res.data.data.currentFlag==99){//"已完成"的提交进度
            this.taskSchduleForm.workflowId=99;
            if(this.taskSchduleForm.currentWorkflowFinishType=="B" || this.taskSchduleForm.currentWorkflowFinishType=="C"){
              this.isShow=true;
            }            
          }
          // 下一进度类型
          this.nextWorkflowFinishType=res.data.data.nextWorkflowFinishType?res.data.data.nextWorkflowFinishType:"";
        }        
      })
    },
    submitSchedule(type){
      var list = ['1','2','4',1,2,4];
      this.$refs.taskSchduleForm.validate(valid=>{
        if(valid){
          if(this.taskSchduleForm.currentWorkflowId==4 && (this.taskSchduleForm.orderStatus==4 || this.taskSchduleForm.orderStatus==5 )){
            //已关闭的任务提交进度（订单已完成/已关闭）:单独接口
            let params={
              taskList:this.taskIds,
              flag: this.taskSchduleForm.currentFlag,
              processDesc:this.taskSchduleForm.processDesc,
              taskFinishType:this.taskSchduleForm.taskFinishType,
              source:this.taskInfo.source,
              taskList : this.taskIds
            }
            batchcommitToFinish(params).then(res=>{
              if(res.data.code ==0 ){
                this.$message({
                  type:'success',
                  message: '提交进度成功！'
                });
                this.$emit('colsebatchProcessDialog',false);
              }else if(res.data.code == 1){
                this.$message({
                  type: 'warning',
                  message: '当前工作流不一致！'
                })
                this.$emit('colsebatchProcessDialog',false);
              }
            })
             console.log('1','已关闭的任务提交进度（订单已完成/已关闭)',params);
          }else{
            if(list.indexOf(this.taskSchduleForm.workflowId)>-1){    //任务（关闭 继续 暂停）                       
              let param = {
                taskList:this.taskIds,
                flag: this.taskSchduleForm.currentFlag,
                taskStatus: this.taskSchduleForm.workflowId,
                taskNo: this.taskInfo.taskNo,
                processDesc: this.taskSchduleForm.processDesc,
                taskFinishType:this.originalTaskFinishType,
                source:this.taskInfo.source
              };
                // 待开始到提交到关闭
              if(this.taskStatus==0){
                  param.workflowId = this.taskSchduleForm.currentWorkflowId
              }
              console.log('2','任务（关闭 继续 暂停',param);
              var para = param;
              // 我的任务
              if(this.listType =='personal'){
                var url = '/wtcrm/order/task/processBatchCommit';
              }else{
                var url = '/wtcrm/order/task/processBatchCommit';   // 权限接口
              }                         
            }else{
                // 任务正常提交
                this.taskSchduleForm.taskNo = this.taskInfo.taskNo;
                var para =this.taskSchduleForm;
                para.flag=this.taskSchduleForm.flag;
                if(this.taskSchduleForm.workflowId==99){//已完成
                  para.taskStatus=null;
                  para.flag=99;
                }
                para.taskList = this.taskIds
                para.source = this.taskInfo.source
                if(para.workProcessName==null){
                  para.workProcessName = this.specialform.nextWorkflowName || this.specialform.currentWorkflowName
                }
                 console.log('3','正常',para);
                // 我的任务
                if(this.listType == 'personal'){
                    var url = '/wtcrm/order/task/processBatchCommit';
                }else{
                    var url = '/wtcrm/order/task/processBatchCommit';     // 权限接口
                }            
            };
            commitProcess(para,url).then(res=>{
              if(res.data.code ==0 ){
                this.$message({
                  type:'success',
                  message: '提交进度成功！'
                });
                this.$emit('colsebatchProcessDialog',false);
              }else if(res.data.code == 1){
                this.$message({
                  type: 'warning',
                  message: '当前工作流不一致！'
                })
                this.$emit('colsebatchProcessDialog',false);
              }
            });
          }
        }else{
          return false;
        }
      })
     
    }
  }
}
</script>

<style scoped>
.schedule-form{
  width: 570px;
}
.task-schedule{
  width: 100%;
  float: left;
}
.task-schedule > *{
  display: block;
  margin: 10px;
}
.btn-schedule{
  text-align: center;
}
.note{
  font-size: 12px;
  color: #999;
  margin-left: 5px;
}
</style>