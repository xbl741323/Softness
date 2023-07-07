
<template>
  <div class="aaa">
    <div class="task-detail-info">
     <!-- 任务状态taskStatus,0-待开始,1-进行中，2-已完成，-1-已暂停，-2-已关闭 -->
     <div class="task-detail-theme">
       <div style="display: flex;">
         <p class="task-detail-no"><img :src="img_url+'images/任务.png'" class="img" />任务编号：{{taskInfo.taskNo}}</p>
         <p class="refund-flag" @click="toRefundDetail" v-if="taskInfo.isRefund == 1">退</p>
         <el-button type="primary" plain size="mini" class="task-btn" v-if="$route.query.listType == 'personal'" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? followClueDialog = true : $notAuthorized()">客户跟进</el-button>
         <el-button type="primary" plain size="mini" class="task-btn" v-if="taskInfo.taskStatus != 2" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? submitScheduleDialog = true : $notAuthorized()">提交进度</el-button>
         <el-button type="primary" plain size="mini" class="task-btn" v-if="!currentAccountInfo.isPartner" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfAllot') ? taskAllot() : $notAuthorized()">任务分配</el-button>
       </div>
       <div class="task-info" v-if="taskInfo">
         <div v-for="(item,index) in list" :key="index">
         <p class="task-info-name">
           <span>{{item.label}}</span>
           <i class="el-icon-edit edit" v-if="item.value == 1" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? editName() : $notAuthorized()"></i>
           <i class="el-icon-edit edit" v-if="item.value == 0" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? changeStatus() :  $notAuthorized()"></i>
           <i class="el-icon-edit edit" v-if="item.value == 5" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? (isShow = !isShow) : $notAuthorized()"></i>
           <i class="el-icon-edit edit" v-if="item.value == 3" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? setOldTime() : $notAuthorized()"></i>
           <i class="el-icon-edit edit" v-if="item.value == 2 && !currentAccountInfo.isPartner" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? editEngineer(taskInfo) : $notAuthorized()"></i>
           <i class="el-icon-edit edit" v-if="item.value == 8&&(listType!='personal')&&(!currentAccountInfo.isPartner)&&(permissions.bt_edit_intellectual_patent_task)" @click="showEditPatentNo()"></i>
           <a v-if="item.value ==5 && isShow" class="cancleEdit" @click="isShow = !isShow">取消编辑</a>
           <a v-if="item.value ==3 && !show" class="cancleEdit" @click="show = !show,getInfo()">取消编辑</a>
           <a v-if="item.value ==2 && !showEngineer" class="cancleEdit" @click="cancleEngineer">取消编辑</a>
         </p>
         <span class="task-info-data" v-if="item.value == -2">{{taskInfo.orderSpuName}}</span>
         <span class="task-info-data" v-if="item.value == -1">{{taskInfo.spec}}</span>
         <!-- 任务进度 -->
         <span v-if="item.value== 0" :class="{'wait': taskInfo.taskStatus == 1}" class="task-info-data">
           <span :class="[
             taskInfo.taskStatus == 0 ? 'blue-circle' :
             taskInfo.taskStatus == 1 ? 'blue-circle in-service' :
             taskInfo.taskStatus == -1 ? 'blue-circle in-service' :
             taskInfo.taskStatus == -2 ? 'blue-circle circleRed' :
             taskInfo.taskStatus == 2 ? 'success' : '']">
           <b v-if="taskInfo.taskStatus == 2">✔</b></span>
           <span v-if="taskInfo.taskStatus==1" style="color:#333">{{taskInfo.stepName}}</span>
           <span v-else-if="taskInfo.taskStatus==2" style="color:#333">{{taskInfo.finishLabel}}</span>
           <span v-else style="color:#333">{{taskInfo.taskStatus | taskStatus }}</span>
         </span>
         <!-- 交付物名称 -->
         <div v-if="item.value== 1">
           <p v-if="!isEditName" class="task-info-data" >{{taskInfo.deliveryName?taskInfo.deliveryName:"暂无数据" }}</p>
           <template  v-if="isEditName">
             <el-input type="textarea" show-word-limit  ref="nameinput" maxlength="30"  @blur="updateDeliverableName()"  v-model="taskInfo.deliveryName" placeholder="请输入内容"></el-input>
           </template>
         </div>
          <!-- 工程师 -->
         <div class="emps" v-if="item.value== 2">
           <div v-if="taskInfo.trTaskEngineerList!=null&&!isEditEngineer" class="emp-info-data">
             <div v-for="item in taskInfo.trTaskEngineerList" :key="item.id">
               <el-tooltip effect="dark" :content="tooltipContent" placement="right">
                 <span class="name-flow" @mouseover="showUserInfo(item.engineerId)" >{{ item.engineerName }}</span>
               </el-tooltip>
             </div>
           </div>
         <template v-if="isEditEngineer && showEngineer==false">
           <el-cascader
             ref="engineerOne"
             filterable
             :show-all-levels='false'
             :key="isResouceShow"
             :options="empList"
             clearable
             :before-filter="beforeFilter"
             v-model="cValue"
             :props="{value: 'customerNo',label: 'label',multiple:true,emitPath: false}"
             style="width:145px"
             @change="editEngineerName(taskInfo)">
               <template slot-scope="{data}">
                 <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                   <div slot="content">{{data.customerNo}}</div>
                   <span>{{data.label}}</span>
                 </el-tooltip>
               </template>
           </el-cascader>
         </template>
         </div>
         <!-- 交付时间 -->
         <p class="task-info-data" @click="setOldTime" v-if="item.value== 3 && show == true && $route.query.listType == 'personal'">{{taskInfo.deliveryTime }}</p>
         <p class="task-info-data"  @click="setOldTime"  v-if="item.value== 3 && show == true && $route.query.listType != 'personal'">{{taskInfo.deliveryTime}}</p>
         <el-date-picker
           v-if="item.value== 3 && show == false"
           v-model="taskInfo.deliveryTime"
           :ref="taskInfo.id+'datepicker'"
           type="datetime"
           placeholder="选择交付时间"
           format="yyyy-MM-dd HH:mm:ss"
           value-format="yyyy-MM-dd HH:mm:ss"
           :clearable='false'
           @blur="editDate(taskInfo)"
           class="date_sty">
         </el-date-picker>
         <!-- 优先级 -->
         <p class="task-info-data"
           :style="'color:'+(taskInfo.priority ==0 ? 'red': taskInfo.priority ==1 ? '#FF3300' : taskInfo.priority == 2 ? '#FF9900' : taskInfo.priority == 3 ? '#33CC66' : '')"
           v-if="item.value== 5 && !isShow">{{taskInfo.priority | priority }}</p>
         <template v-if="item.value == 5 && isShow" >
           <el-select v-model="taskInfo.priority" @change="editTask(taskInfo)">
             <el-option
               ref="selection"
               v-for="item in priorityList"
               :key="item.label"
               :label="item.value"
               :value="item.label"
               :style="'color:'+item.color">
             </el-option>
           </el-select>
         </template>
         <!-- 客户名称 -->
         <p class="task-info-data" v-if="item.value== 6">{{taskInfo.subjectName ? taskInfo.subjectName : '暂无数据' }}</p>
         <!-- 业务员 -->
         <el-tooltip effect="dark" :content="tooltipContent" placement="left" :disabled="hidden" v-if="Number(taskInfo.clueSalesmanEmpId)!=0">
           <p class="task-info-data" v-if="item.value== 7" @mouseover="showUserInfo(taskInfo.clueSalesmanEmpId)">
             {{taskInfo.clueSalesmanEmpName ? taskInfo.clueSalesmanEmpName : '暂无数据' }}</p>
         </el-tooltip>
         <p class="task-info-data" v-if="item.value== 7&&Number(taskInfo.clueSalesmanEmpId)==0">{{taskInfo.clueSalesmanEmpName ? taskInfo.clueSalesmanEmpName : '暂无数据' }}</p>
         <!-- 专利申请号 -->
         <p class="task-info-data" v-if="item.value== 8">{{taskInfo.patentApplicationNo|filterPatentNo}}</p>
         <!-- 创建时间 -->
         <p class="task-info-data" v-if="item.value== 4">{{taskInfo.createTime }}</p>
         </div>
       </div>
       <!-- 任务描述 -->
       <p class="task-info-desc">任务描述：<i class="el-icon-edit edit" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? showInput() : $notAuthorized()"></i></p>
       <p class="task_desc" v-if="!showTxtBox">{{taskInfo.description ? taskInfo.description : '暂无描述'}}</p>
       <template v-if="showTxtBox">
         <el-input type="textarea" show-word-limit  ref="nameinput" maxlength="30"  @blur="updateDescription()" v-model="taskInfo.description" placeholder="请输入内容"></el-input>
       </template>
     </div>
     <!-- tab栏 -->
     <el-tabs type="border-card" class="task-detail-theme tabs" v-model="tabName">
       <el-tab-pane name="3" label="维护记录">
         <task-active-record ref="child" v-if="tabName == 3 && taskInfo.id" :showEdit="$route.query.showEdit" :taskInfo="taskInfo" :apiInfo="apiInfo" :listType="$route.query.listType" :customerFollow="customerFollow" @closeFollow="closeFollow" />
       </el-tab-pane>
       <el-tab-pane name="0" label="任务进度">
         <task-progress ref='progress' v-if="tabName == 0 && taskInfo" :taskId="taskInfo.id" :apiInfo="apiInfo" :listType="$route.query.listType" />
       </el-tab-pane>
       <el-tab-pane name="4" label="客户信息">
         <customer-info  :orderSpuName="taskInfo.orderSpuName" v-if="tabName == 4 && taskInfo.id && checkTaskPermissions($route.query.listType, apiInfo, 'permissionsOfCustomer')" :taskId="taskInfo.id" :taskNo="taskInfo.taskNo" :userId="taskInfo.userId" :clueId="taskInfo.clueId" :clueType="taskInfo.clueType" :listType="this.$route.query.listType"></customer-info>
       </el-tab-pane>
       <el-tab-pane name="5" label="订单信息" v-if="!currentAccountInfo.isPartner">
         <sign-info v-if="tabName == 5 && taskInfo.id"  :taskId="taskInfo.id" :listType="this.$route.query.listType" :apiInfo="apiInfo"></sign-info>
       </el-tab-pane>
       <!-- v-if="orderType==2||[3, 4, 5, 6].includes(Number(categoryId))" -->
       <el-tab-pane name="6" label="文件柜" >
        <filing-cabinet :orderSpuName="taskInfo.orderSpuName" :taskNo="taskInfo.taskNo" :categoryId="categoryId" :orderType="orderType" v-if="tabName == 6" :taskId="taskInfo.id" :userId="taskInfo.userId" :clueId="taskInfo.clueId" :clueType="taskInfo.clueType" :listType="this.$route.query.listType"></filing-cabinet>
       </el-tab-pane>
     </el-tabs>

     <!-- 任务分配 -->
     <el-dialog :visible.sync='taskAllotDialog' width="600px" title="任务分配" :close-on-click-modal='false'>
       <task-allocation :taskInfo="taskInfo" :apiInfo="apiInfo" :listType="$route.query.listType" @closeAllotDialog="closeAllotDialog" @cancelAllotDialog="cancelAllotDialog" v-if="taskAllotDialog" />
     </el-dialog>
     <!-- 客户跟进 -->
     <el-dialog title="客户跟进" :visible.sync="followClueDialog"  width="600px" :close-on-click-modal= "false">
       <customer-follow :operateType="0" :taskInfo="taskInfo" @closeDialog="closeDialog" :apiInfo="apiInfo" :listType="$route.query.listType" v-if="followClueDialog"  />
     </el-dialog>
     <!-- 提交进度 -->
     <el-dialog :visible.sync="submitScheduleDialog" width="700px" title="提交进度" :close-on-click-modal="false">
       <task-submit-schedule :operateType="0" :taskInfo="taskInfo" :apiInfo="apiInfo" :listType="$route.query.listType" v-if="submitScheduleDialog"  @colseProcessDialog="colseProcessDialog"></task-submit-schedule>
     </el-dialog>
      <!-- 专利编号修改 -->
      <edit-patent-no @refresh="getInfo()" ref="patent-no"></edit-patent-no>
   </div>
 </div>
</template>

<script>
import { editTaskList, updateEngineerName } from "@/api/task/index";
import detailHead from "@/page/index/top/index";
import taskData from "@/components/task/js/task.js";
import TaskActiveRecord from "./task-active-record.vue";
import TaskAllocation from "./task-allocation.vue";
import customerFollow from "./customer-follow";
import TaskSubmitSchedule from "./task-submit-schedule";
import TaskProgress from "./task-progress";
import DocumentRoom from "./document-room";
import CustomerInfo from "./customer-info";
import SignInfo from "./sign-info";
import FilingCabinet from "./filing-cabinet"
import SignOnlineinfo from "./online/sign-onlineinfo.vue";
import editPatentNo from "@/components/task/edit-patent-no";
import userinfo from "@/components/task/online/userinfo";
import { allByDeptAndPartnerDept } from "@/api/clue/clue";
import { mapGetters } from "vuex";
export default {
  components: {
    detailHead,
    TaskAllocation,
    TaskActiveRecord,
    customerFollow,
    TaskSubmitSchedule,
    TaskProgress,
    DocumentRoom,
    CustomerInfo,
    SignInfo,
    SignOnlineinfo,
    userinfo,
    editPatentNo,
    FilingCabinet
  },
  data() {
    return {
      listType: "", // 'personal' 个人中心
      orderType: "", // 任务对应订单类型
      show: true,
      initialName: "", //交付物的初始值
      isEditName: false,
      cValue: [],
      value: "",
      isEditEngineer: false,
      img_url: process.env.BASE_URL,
      tabName: "3",
      empList: [],
      taskInfo: {
        taskNo: "",
        deliveryName: "",
      },
      isResouceShow: 0,
      list: taskData.taskInfoList,
      priorityList: taskData.priorityList,
      showEngineer: true,
      isShow: false, //编辑优先级
      isShowProess: false, //编辑任务进度
      showTxtBox: false, //编辑任务描述
      taskAllotDialog: false,
      customerFollow: false,
      followClueDialog: false,
      submitScheduleDialog: false,
      apiInfo: {},
      categoryId:null,
    };
  },
  filters: {
    filterPatentNo(val) {
      return Number(val) == 0 ? "暂无数据" : val;
    },
    taskStatus(value) {
      return taskData.taskStatus(value);
    },
    priority(value) {
      return taskData.priority(value);
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    // 保存页面信息
    sessionStorage.setItem(
      JSON.parse(sessionStorage.getItem("pigx-tag")).content.value,
      JSON.stringify({
        page: JSON.parse(
          sessionStorage.getItem(
            JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
          )
        ).page,
        screening: JSON.parse(
          sessionStorage.getItem(
            JSON.parse(sessionStorage.getItem("pigx-tag")).content.value
          )
        ).screening, //表单筛选信息
        ID: JSON.parse(sessionStorage.getItem("pigx-tag")).content.label, //页面标识
        detail: { query: this.$route.query, path: this.$route.path },
      })
    );
    if (this.$route.query.listType) {
      this.listType = this.$route.query.listType;
    }
    if (this.$route.query.type) {
      this.orderType = this.$route.query.type;
    }
    if (this.$route.query.categoryId) {
      this.categoryId = this.$route.query.categoryId;
    }
    this.list =
      this.orderType == 2 || this.listType == "personal"
        ? taskData.taskInfoPropertyList
        : taskData.taskInfoList;
  },
  mounted() {
    if (this.$route.query.listType != "personal") {
      [this.apiInfo] = taskData.taskApiList.filter(
        (item) => item.type == this.$route.query.type
      );
    }
    this.getDropList();
    this.getInfo();
  },
  methods: {
    changeStatus() {
      let row = this.taskInfo
      if((row.taskStatus == 2)&&(row.finishLabel=="通过"||row.finishLabel=="不通过"||row.finishLabel=="完成")){
        return
      }
      this.isShowProess = !this.isShowProess
      this.submitScheduleDialog = true;
    },
    // 专利号弹窗显示控制
    showEditPatentNo() {
      if (this.$refs["patent-no"]) {
        this.$refs["patent-no"].showPatentBtn = true;
        this.$refs["patent-no"].taskInfo = this.taskInfo;
        this.$refs["patent-no"].rowForm.patentNo = this.taskInfo.patentApplicationNo;
      }
    },
    // 获取数据员工 false-去除禁用后的员工 true-获取所有员工
    getDropList() {
      allByDeptAndPartnerDept().then((res) => {
        ++this.isResouceShow;
        const emp = res.data.data;
        this.empList = [...emp.deptTree, ...emp.partnerDeptTree];
      });
    },
    //显示工号
    async beforeFilter() {
      await allByDeptAndPartnerDept(false).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          const emp = res.data.data;
          this.empList = [...emp.deptTree, ...emp.partnerDeptTree];
        }
      });
      this.$loop(this.empList[0], this.empList[0]);s
      return false;
    },
    // 编辑工程师
    editEngineerName(row) {
      this.$nextTick(() => {
        let rList = this.$refs.engineerOne[0].getCheckedNodes(true);
        if (this.cValue.length > 3||this.cValue.length == 0) {
          this.$message({
            type: "warning",
            message:this.cValue.length > 3? "至多选择三个工程师！":"至少选择一个工程师！"
          });
          this.isEditEngineer = false;
          this.showEngineer = true;
          this.getInfo();
        } else {
          let eList = [];
          rList.forEach((item) => {
            if (item.data.customerId != null) {
              eList.push({
                engineerId: item.data.value,
                engineerNo: item.data.customerNo,
                engineerName: item.data.label,
              });
            }
          });
          this.setEngineerName(row, eList);
        }
      });
    },
    // 工程师编辑
    setEngineerName(row, list) {
      let params = {
        id: row.id,
        trTaskEngineerList: list,
      };
      updateEngineerName(params, this.listType, this.apiInfo).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "编辑成功！",
            offset: 300,
          });
          this.isEditEngineer = false;
          this.showEngineer = true;
          this.refreshChild();
          this.getInfo();
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg,
          });
        }
      });
    },
    toRefundDetail() {
      this.$router.push({
        path: "/refund-detail",
        query: {
          refundSource: this.taskInfo.source, //0-线下 1-线上
          taskNo: this.taskInfo.refundNo,
          id: this.taskInfo.refundId,
          time: Date.now(),
        },
      });
    },
    editName() {
      this.isEditName = true;
    },
    editEngineer(row) {
      this.showEngineer = false;
      this.isEditEngineer = true;
      this.cValue = [];
      if (row.trTaskEngineerList) {
        row.trTaskEngineerList.forEach((item) => {
          this.cValue.push(item.engineerNo);
        });
      }
    },
    cancleEngineer() {
      this.showEngineer = !this.showEngineer;
      this.isEditEngineer = false;
      this.getInfo();
    },
    //编辑交付物名称
    updateDeliverableName() {
      this.isEditName = false;
      if (this.taskInfo.deliveryName != this.initialName) {
        let params = {
          deliveryName: this.taskInfo.deliveryName,
          id: this.taskInfo.id,
        };
        editTaskList(params, this.$route.query.listType, this.apiInfo).then(
          (res) => {
            if (res.data.code == 0) {
              this.$message.success("编辑成功");
              this.refreshChild();
              this.getInfo();
            } else {
              this.$message({
                type: "warning",
                message: res.data.msg,
              });
            }
          }
        );
      }
    },
    //编辑任务描述
    updateDescription() {
      this.showTxtBox = false;
      let params = {
        description: this.taskInfo.description,
        id: this.taskInfo.id,
      };
      editTaskList(params, this.$route.query.listType, this.apiInfo).then(
        (res) => {
          if (res.data.code == 0) {
            this.$message.success("编辑成功");
            this.refreshChild();
            this.getInfo();
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg,
            });
          }
        }
      );
    },
    setOldTime() {
      this.oldTime = JSON.parse(JSON.stringify(this.taskInfo.deliveryTime));
      this.show = false;
    },
    // 修改交付时间
    editDate(row) {
      let param = {
        id: row.id,
        deliveryTime: this.taskInfo.deliveryTime,
      };
      if (this.oldTime != row.deliveryTime && row.deliveryTime != null) {
        editTaskList(param, this.$route.query.listType, this.apiInfo).then(
          (res) => {
            this.$message.success("编辑成功");
            this.refreshChild();
            this.show = true;
            this.getInfo();
          }
        );
      } else {
        this.taskInfo.deliveryTime = this.oldTime;
        this.show = true;
      }
    },
    // 添加文件
    addLibrary() {
      this.tabName = "1";
      this.$nextTick(() => {
        this.$refs.library.uploadDialog = true;
      });
    },
    // 刷新子组件
    refreshChild() {
      if (this.$refs.child) {
        this.$nextTick(() => {
          this.$refs.child.getEditRecords();
          this.$refs.child.getRecords();
          this.$refs.child.getCount();
        });
      }
    },
    closeDialog(val) {
      this.followClueDialog = val;
      this.getInfo();
      // 刷新子组件
      setTimeout(() => {
        this.$refs.child.getEditRecords();
        this.$refs.child.getRecords();
        this.$refs.child.getCount();
      }, 300);
    },
    colseProcessDialog(val) {
      this.submitScheduleDialog = val;
      this.getInfo();
      if (this.$refs.progress) {
        this.$refs.progress.getList();
      }
      // 刷新子组件
      setTimeout(() => {
        this.$refs.child.getEditRecords();
        this.$refs.child.getRecords();
        this.$refs.child.getCount();
      }, 300);
    },
    taskAllot() {
      this.taskAllotDialog = true;
    },
    cancelAllotDialog(val) {
      this.taskAllotDialog = val;
    },
    closeAllotDialog(val) {
      this.taskAllotDialog = val;
      setTimeout(() => {
        history.go(-1);
      }, 500);
    },
    showInput() {
      this.showTxtBox = !this.showTxtBox;
    },
    //修改优先级
    editTask(row, isNote) {
      let params = {
        id: row.id,
        priority: this.taskInfo.priority,
      };
      if (isNote) {
        if (
          this.note != this.taskInfo.description &&
          this.taskInfo.description.length > 0
        ) {
          editTaskList(params, true).then((res) => {
            this.isShow = false;
            this.getInfo();
          });
        }
      } else {
        editTaskList(params, this.$route.query.listType, this.apiInfo).then(
          (res) => {
            this.$message.success("编辑成功");
            this.refreshChild();
            this.isShow = false;
            this.getInfo();
          }
        );
      }
      // 刷新子组件
      setTimeout(() => {
        this.$refs.child.getEditRecords();
        this.$refs.child.getRecords();
        this.$refs.child.getCount();
      }, 300);
    },
    getInfo() {
      taskData.taskDetail(
          this.$route.query.id,
          this.$route.query.listType,
          this.apiInfo
        ).then((res) => {
          this.taskInfo = res;
          this.initialName = res.deliveryName;
          this.note = res.description;
        });
    },
    // 关闭弹窗
    closeFollow(val) {
      this.customerFollow = val;
    },
  },
};
</script>

<style scoped>
.aaa {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 20px 100px 20px 30px;
}
.task-detail-info {
  background: #f8f5f5;
}
.task-info {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 20px;
  margin-left: 22px;
}
.task-detail-theme {
  min-width: 960px;
  background-color: #fff;
  margin: 0 auto;
  padding: 20px;
}
.task-detail-no {
  font-size: 16px;
  font-weight: 600;
  margin-right: 10px;
  margin-left: 20px;
  line-height: 24px;
  position: relative;
}
.img {
  position: absolute;
  left: -25px;
  margin-right: 3px;
  margin-top: -2px;
}

.task-info-desc {
  font-size: 14px;
  font-weight: 600;
  margin-left: 22px;
}
.task-info-name {
  font-size: 14px;
  font-weight: 600;
}
.task_desc {
  font-size: 14px;
  color: #9e9d9d;
  margin-left: 22px;
}
.wait {
  color: #ccca4d;
}
.blue-circle {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #0b5fa0;
  margin-right: 7px;
}
.success {
  font-weight: bolder;
  font-size: 14px;
  display: inline-block;
  color: #027502;
  margin-right: 6px;
}
.circleRed {
  background: #ff0000;
}
.in-service {
  background: #f3ab03;
}
.edit {
  cursor: pointer;
}
.cancleEdit {
  color: #f3d19e;
  cursor: pointer;
}
.task-info-data {
  font-size: 14px;
  color: #9e9d9d;
  margin: 5px 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.emp-info-data {
  color: #9e9d9d;
  margin: 5px 0;
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.date_sty {
  width: 150px;
}
.task-btn {
  height: 30px;
  margin: auto 0;
  margin-left: 5px;
}
.name-flow {
  font-size: 14px;
  padding: 0;
  margin: 0;
}
</style>
