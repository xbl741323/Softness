<!--排查完成-->
<template>
  <div class="schedule-form">
    <!-- 选择进度 -->
    <el-form :model="taskForm" ref="taskForm" :rules="rules">
      <div class="flex-sty">
        <el-form-item label="选择进度：" prop="chooseProgress"><br/>
          <div class="progress-contain">
            <span v-for="(item,index) in progressList.slice(0,progressList.length-1)" :key="index" class="progress-item">
              <span @click="changeProgress(item)" :class="[activeValue == item.id?'active-sty':'']">{{ item.stepName }}</span>
              <span class="pointer-sty"></span>
            </span>
          </div>
        </el-form-item>
        <el-form-item prop="selectProgress">
          <el-select @change="changeSelect" v-model="taskForm.selectProgress" placeholder="请选择" class="task-select">
            <el-option v-if="endType == 'A'||endType == 'C'" label="完成" value="完成"></el-option>
            <el-option v-if="endType == 'B'||endType == 'C'" label="通过" value="通过"></el-option>
            <el-option v-if="endType == 'B'||endType == 'C'" label="不通过" value="不通过"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="其他进度：" style="margin-left:10px">
        <el-radio-group v-model="taskForm.otherProgress" @change="changeOtherProgress">
        <el-radio :label="-1">任务暂停</el-radio>
        <el-radio :label="-2">任务关闭</el-radio>
        </el-radio-group> 
      </el-form-item> 
      <!-- 进度描述 -->
      <el-form-item label="进度描述：">
        <el-input class="textarea-sty" v-model="taskForm.progressDesc" type="textarea" maxlength="100" show-word-limit :rows="5"/>
      </el-form-item>
    </el-form>
    <div class="btn-schedule">
      <el-button type="primary" class="confirm-btn" @click="submitSchedule()" v-preventReClick>确定</el-button>
      <el-button type="warning" @click="cancel()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { submitProgress, getTaskFlow } from "@/api/task/new-task";
export default {
  props: {
    taskInfo: {
      // 任务信息
      type: Object,
      required: true,
    },
    taskInfoList: {
      // 任务信息列表
      type: Array,
      required: false,
    },
    operateType: { 
      // 0-单个提交 1-批量提交
      type: Number,
      required: false,
    },
    listType:{//'personal'-我的任务 其他值-任务管理
      required: true,
      default: null
    },
    apiInfo:{
      type: Object,
      required: true,
      default: ()=>{}
    }
  },
  data() {
    // 完成下拉框状态必填项校验
    var validateSelect = (rule, value, callback) => {
      if(this.finishType!=null&&value==''){
        callback(new Error("请选择！"));
      }else{
        callback()
      }
    };
    return {
      endType: "", // 完成类型 A B C
      activeValue: "", // 步骤id
      activeName: "", // 步骤名称
      finishType: null, // 结束类型
      stepType: "", // 步骤类型
      taskForm: {
        chooseProgress: "", // 选择进度
        selectProgress: "", // 完成下拉框状态 （完成 通过 不通过）
        otherProgress: "", // 其他进度
        progressDesc: "", // 进度描述
      },
      rules: {
        selectProgress: [{ validator: validateSelect, trigger: "change" }],
      },
      progressList: [],
      progressOptions: [
        {
          value: 0,
          label: "完成",
        },
        {
          value: 1,
          label: "通过",
        },
        {
          value: 2,
          label: "不通过",
        },
      ],
    };
  },
  mounted() {
    this.getFlowList();
  },
  methods: {
    // 修改下拉框显示
    changeSelect(){
      if(this.taskForm.selectProgress!=''){
        let item = this.progressList[this.progressList.length-1]
        this.activeValue = item.id;
        this.activeName = item.stepName;
        this.finishType = item.finishType;
        this.stepType = item.stepType;
        this.taskForm.otherProgress = "";
      }
    },
    getFlowList() {
      let params = {
        flowId: this.taskInfo.flowId,
        version: this.taskInfo.flowVersion,
      };
      getTaskFlow(params).then((res) => {
        if (res.data.code == 0) {
          this.progressList = res.data.data;
          this.activeValue = this.taskInfo.stepId;
          let result = this.progressList.filter((item) => {
            return item.id == this.taskInfo.stepId;
          });
          this.endType =
            this.progressList[this.progressList.length - 1].finishType;
          this.taskForm.otherProgress =result.length > 0 ? "" : this.taskInfo.stepId;
          this.activeName =result.length > 0? result[0].stepName: this.activeValue == -1
              ? "任务暂停": "任务关闭";
          this.finishType = result.length > 0 ? result[0].finishType : null;
          this.stepType = result.length > 0 ? result[0].stepType : 1;
        }
      });
    },
    // 修改其他进度
    changeOtherProgress() {
      this.activeValue = this.taskForm.otherProgress;
      this.activeName = this.activeValue == -1 ? "任务暂停" : "任务关闭";
      this.finishType = null;
      this.stepType = this.taskForm.otherProgress;
      this.taskForm.selectProgress = ""
    },
    // 切换进度
    changeProgress(item) {
      this.activeValue = item.id;
      this.activeName = item.stepName;
      this.finishType = item.finishType;
      this.stepType = item.stepType;
      this.taskForm.otherProgress = "";
      this.taskForm.selectProgress = ""
    },
    cancel() {
      this.$emit("colseProcessDialog", false, false);
    },
    // 提交进度操作
    submitSchedule() {
      if(this.taskForm.selectProgress){//选择已完成状态时添加提示
        this.$confirm('任务进度确定后不能修改，是否确定？','任务进度',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=>{
          this.confirmSubmit();
        })
      }else{
        this.confirmSubmit();
      }
    },
    confirmSubmit(){
      this.$refs["taskForm"].validate((val) => {
        if (val) {
          let params = {
            stepId: this.activeValue, // 任务步骤id
            stepName: this.activeName, // 任务步骤名称
            finishType: this.finishType, // 结束类型（A:仅可选完成；B:可选完成、不通过；C:可选完成、通过、不通过）
            stepType: this.stepType, // 步骤类型（0:开始步骤；1:中间步骤；2:结束步骤 -1:任务暂停 -2:任务关闭）
            finishLabel: this.finishType!=null?this.taskForm.selectProgress:null,
            description: this.taskForm.progressDesc,
          };
          if(this.operateType == 1){
          let result = []
          this.taskInfoList.forEach(item=>{
            result.push({
              id: item.id,
              orderId: item.orderId
            })
          })
            params.tmOrderTaskVoList = result // 任务集合
          }else{
            params.id = this.taskInfo.id // 任务id
          }
          submitProgress(params, this.operateType, this.listType, this.apiInfo).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "操作成功！",
                offset: 300,
              });
              this.$emit("colseProcessDialog",false, true);
            } else if (res.data.code == -1) {
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
              });
            }
          });
        }
      });
    }
  },
};
</script>

<style scoped>
.schedule-form {
  width: 100%;
}
.task-schedule {
  width: 100%;
  float: left;
}
.btn-schedule {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.progress-contain {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.progress-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.progress-item > span:nth-of-type(1) {
  display: inline-block;
  color: #409eff;
  cursor: pointer;
}
.active-sty {
  background: #409eff !important;
  color: #ffffff !important;
  padding: 0 10px !important;
  border-radius: 10px;
}
.confirm-btn {
  margin-right: 100px;
}
.pointer-sty {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-top: 1px solid#555555;
  border-right: 1px solid#555555;
  transform: rotate(45deg);
}
.task-select {
  width: 130px !important;
}
.textarea-sty {
  width: 100% !important;
  margin-top: 10px;
}
.flex-sty {
  display: flex;
  align-items: flex-end;
}
</style>