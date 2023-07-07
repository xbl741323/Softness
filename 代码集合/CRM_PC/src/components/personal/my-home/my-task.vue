<!-- 排查完成 -->
<template>
    <div :class="['my-task',num==1?'complete-sty':num==3?'complete-sty':'']">
      <div class="my-task-lang">
        <div class="tool-title">
          <span>任务简报</span>
        </div>
        <p class="task-title task-pointer-sty" @click="toMore">查看更多</p>
      </div>
      <el-tabs v-model="taskStatus" @tab-click="handleClick" stretch>
        <el-tab-pane v-for="item in taskStatusList"
          :key="item.taskStatus"
          :label="item.label"
          :name="item.taskStatus"
        ></el-tab-pane>
      </el-tabs>
      <avue-crud
        class="clue-avue"
        ref="crud"
        :option="option"
        :data="dataList"
        @current-row-change="toViewTask"
        @on-load="getList">
        <template slot="taskNo" slot-scope="scope">
          <span>{{ scope.row.taskNo }}</span>
        </template>
        <template slot="priority" slot-scope="scope">
           <!-- <span :class="['common-level-sty',scope.row.priority ==0?'level-sty-one':scope.row.priority ==1?'level-sty-two':scope.row.priority ==2?'level-sty-three':scope.row.priority ==3?'level-sty-four':scope.row.priority ==4?'level-sty-five':'']">{{ scope.row.priority|priority }}</span> -->
           <span class='common-level-sty'>{{ scope.row.priority|priority }}</span>
        </template>
        <template slot="taskStatus" slot-scope="scope">
          <span :class="{'waitAllot': scope.row.taskStatus == 1}">
            <span :class="[scope.row.taskStatus == 0 ? 'tostart' : '']"></span>
            <span>{{scope.row.taskStatus | taskStatus }}</span>
          </span>
        </template>
      </avue-crud>
    </div>
</template>

<script>
import { clearDetail } from "@/util/clearDetail";
import taskData from "@/components/task/js/task.js";
import { soloOption } from "@/const/crud/my-home/my-task";
import * as tableData from './worktable'
export default {
  props:['num'],
  data() {
    return {
      option: soloOption,
      dataList: [],
      taskStatusList: tableData.taskStatusList,
      taskStatus: null
    };
  },
  filters: {
    taskStatus(value) {
      return taskData.taskStatus(value);
    },
    priority(value) {
      return taskData.priority(value);
    },
  },
  methods: {
    handleClick(){
      console.log(this.taskStatus);
      this.getList();
    },
    getList() {
      let param = {
        pageSize: 8,
        pageNo: 1,
        listType: "personal",
        taskStatus: this.taskStatus,
      };
      taskData.taskList(param).then((res) => {
        this.dataList = res.records;
      });
    },
    toMore() {
      clearDetail("/personal/my-task");
      this.$router.push({
        path: "/personal/my-task",
      });
    },
    toViewTask(row) {
      this.$router.push({
        path: "/task-detail",
        query: {
          id: row.id,
          listType: "personal",
          showEdit: true,
        },
      });
    },
  },
};
</script>

<style scoped>
.my-task {
  background: #fff;
  border-radius: 10px;
  margin-top: 10px;
  min-height: 370px;
}
/* #handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
} */
.complete-sty{
  width: 100% !important;
}
.tool-title {
  margin: 10px 0 0 15px;
  display: flex;
  align-items: center;
  color: #333333;
  font-size: 22px;
  font-weight: 700;
}
.tool-title img {
  width: 26px;
  height: 26px;
  margin-right: 1px;
}
.my-task-lang {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  margin-bottom: 10px;
}
.my-task-lang :nth-child(2n){
  text-align: right;
}
.task-title {
  margin: 15px 0 15px 45px;
}
.clue-avue {
  width: 95%;
  margin: 0 auto !important;
}
.task-pointer-sty {
  font-size: 12px;
  cursor: pointer;
  transition: 0.3s;
  margin-right: 10px;
  color: #409eff;
  text-decoration: underline;
}
.task-pointer-sty:hover {
  color: #409eff;
}
.waitAllot {
  color: #ff6600;
}
.tostart {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 7px;
}
.common-level-sty{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center !important;
}
.level-sty-one{
  color: #FF150A;
  background:rgba(255,0,0,0.2);
}
.level-sty-two{
  color: #FF3300;
  background:rgba(255,0,0,0.1);
}
.level-sty-three{
  color: #FF9900;
  background:rgba(255,153,0,0.1);
}
.level-sty-four{
  color: #008000;
  background:rgba(0,128,0,0.1)
}
.level-sty-five{
  color: #6ECC97;
  background:rgba(110,204,151,0.1);
}
</style>