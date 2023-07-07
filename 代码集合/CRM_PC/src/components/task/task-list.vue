<!-- 排查完成 -->
<template>
  <div class="task-list" v-if="checkTaskPermissions(listType, apiInfo, 'permissionsOfPage')">
    <div class="task-status" v-if="orderType == 2">
      <span>知产类型：</span>
      <el-radio-group v-model="taskForm.productSubType" @change="changeSubType">
        <el-radio-button
          class="radio-sty"
          :class="{'radio-sty-left': index > 0}"
          v-for="(item, index) in filterpropertyList"
          :key="index" :label="item.value"
          size="mini">{{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="task-status">
      <span>任务进度：</span>
      <el-radio-group v-model="taskForm.taskStatus" @change="(page.currentPage = 1), (hasTapBtn = true), changeTaskStatus()" size="medium">
        <el-radio-button class="radio-sty"
          :class="{'radio-sty-left': item.taskStatus >= 0 && item.taskStatus !== null,'remove-padding': item.taskStatus == 1 || item.taskStatus == 2,'radio-left-sty': item.taskStatus == -1 || item.taskStatus == -2}"
          v-for="item in taskStatusList"
          :key="item.taskStatus"
          :label="item.taskStatus">
          <span v-show="item.label == '全部'">
            <img src="@/assets/images/task/all.png" v-if="taskForm.taskStatus == null" class="statusImg" />
            <img src="@/assets/images/task/allactive.png" v-else class="statusImg" />
          </span>
          <span v-show="item.label == '待开始'">
            <img  src="@/assets/images/task/wait.png" v-if="taskForm.taskStatus == 0" class="statusImg" />
            <img src="@/assets/images/task/waitactive.png" v-else class="statusImg" />
          </span>
          <span v-show="item.label == '进行中'">
            <img src="@/assets/images/task/process.png" v-if="taskForm.taskStatus == 1" class="statusImg" />
            <img src="@/assets/images/task/processactive.png" v-else class="statusImg" />
          </span>
          <span v-show="item.label == '已暂停'">
            <img src="@/assets/images/task/stop.png" v-if="taskForm.taskStatus == -1"  class="statusImg" />
            <img src="@/assets/images/task/stopactive.png" v-else class="statusImg" />
          </span>
          <span v-show="item.label == '已完成'">
            <img src="@/assets/images/task/success.png" v-if="taskForm.taskStatus == 2" class="statusImg" />
            <img src="@/assets/images/task/successactive.png" v-else class="statusImg" />
          </span>
          <span v-show="item.label == '已关闭'">
            <img src="@/assets/images/task/close.png" v-if="taskForm.taskStatus == -2" class="statusImg" />
            <img src="@/assets/images/task/closeactive.png" v-else class="statusImg" />
          </span>
          <span v-if="item.label == '全部'||item.label == '已完成'||item.label == '已关闭'" :class="['taskmr', item.label == '已完成' ? 'istop' : '']">
            <i v-if="item.label == '已完成'">&nbsp;&nbsp;</i>{{ item.label }}</span>
          <!-- 任务数量 -->
          <span v-else :class="['taskmr', item.label == '进行中' ? 'istop' : '']"><i v-if="item.label == '进行中'">&nbsp;&nbsp;</i>{{ item.label }}
            <span v-if="item.count !== 0">({{ item.count }})</span>
          </span>
          <!-- 进行中 -->
          <span v-show="item.label == '进行中'">&nbsp;&nbsp;
            <el-select v-model="taskForm.processName" placeholder="请选择" @change="dochange(1)" size="mini">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="newitem in processList" :key="newitem.stepName" :label="newitem.stepName" :value="newitem.stepName">
              </el-option>
            </el-select>
          </span>
          <!-- 已完成 -->
          <span v-show="item.label == '已完成'">&nbsp;&nbsp;
            <el-select v-model="taskForm.finishType" @change="dochange(2)" size="mini">
              <el-option label="全部" :value="null"></el-option>
              <el-option
                v-for="newitem in completeStatusList"
                :key="newitem.dropdownKey"
                :label="newitem.dropdownValue"
                :value="newitem.dropdownKey">
              </el-option>
            </el-select>
          </span>
        </el-radio-button>
      </el-radio-group>
    </div>
    <el-form :model="taskForm" inline @keyup.enter.native="(hasTapBtn = true), getAllList()">
      <el-form-item label="关键字：" class="keywords-sty">
        <el-input v-model.trim="taskForm.keyWords" :class="[(listType == 'personal'||orderType == 2)?'task-keywords':'task-short-keywords']" :placeholder="getInputText" />
      </el-form-item>
      <el-form-item label="任务类型：" v-if="listType == 'personal'">
        <el-select v-model="taskForm.taskType" class="task-sty">
          <el-option v-for="item in taskTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务员：">
       <el-input v-model="taskForm.salesmanNo" placeholder="请输入员工姓名/工号"></el-input>
      </el-form-item>
      <el-form-item label="工程师：" v-if="showEngineer">
        <el-input v-model="taskForm.engineerNo" placeholder="请输入员工姓名/工号"></el-input>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
         v-model="taskForm.createTime"
         class="order-time"
         type="daterange"
         range-separator="-"
         :default-time="['00:00:00', '23:59:59']"
         value-format="yyyy-MM-dd HH:mm:ss"
         start-placeholder="开始日期"
         end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
        <!-- 区分仅做样式判断 -->
        <el-button v-if="listType == 'personal'" type="primary" icon="el-icon-search" @click="(hasTapBtn = true), getAllList()">搜索</el-button>
        <el-button v-if="listType == 'personal'" type="warning" @click="(hasTapBtn = true), resetTask()">重置</el-button>
      <div class="task-btn-contain" v-if="listType != 'personal'">
        <el-form-item label="任务消化方：" v-if="listType != 'personal' || (listType == 'personal' && !currentAccountInfo.isPartner)">
        <el-select v-model="taskForm.partnerId">
          <el-option v-for="item in partnerList" :key="item.partnerId" :label="item.partnerName" :value="item.partnerId"></el-option>
        </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="(hasTapBtn = true), getAllList()">搜索</el-button>
        <el-button type="warning" @click="(hasTapBtn = true), resetTask()">重置</el-button>
      </div>
    </el-form>
    <!-- 按钮区域 -->
    <el-button :disabled="taskInfoList.length==0?true:false" v-if="!currentAccountInfo.isPartner" class="batch-allot-sty"  @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfAllot') ? taskAllot(1) : $notAuthorized()" type="primary">批量分配</el-button>
    <el-button :disabled="taskInfoList.length==0?true:false" class="batch-submit-sty" type="primary" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? handleBatch() : $notAuthorized()">批量提交进度</el-button>
    <el-button :disabled="taskInfoList.length==0?true:false" class="customer-follow-sty" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? handlFollow() : $notAuthorized() " type="primary">客户跟进</el-button>
    <el-button v-if="orderType==2&&(!currentAccountInfo.isPartner)&&permissions.bt_batch_patent_intellectual_task" type="primary" @click="showPatentDemo(0)">导入专利申请号</el-button>
    <el-button v-if="orderType==2&&(!currentAccountInfo.isPartner)&&permissions.bt_batch_result_intellectual_task" type="primary" @click="showPatentDemo(1)">导入专利申请结果</el-button>
    <el-tooltip effect="dark" content="显 隐" placement="top">
      <el-button icon="el-icon-s-operation" circle @click="changeColumn()" class="show-sty"></el-button>
    </el-tooltip>
    <!-- 列表 -->
    <avue-crud :defaults.sync="defaults" :option="taskTableOption" :table-loading="tableLoading" :data="tasksListData" :page.sync="page" ref="crud"
      @selection-change="selectionChange"
      @size-change="sizeChange"
      @current-change="currentChange"
      @sort-change="changeSort"
      @select="selectRows"
      @select-all="selectAll">
      <!-- 交付时间 -->
      <template slot="deliveryTime" slot-scope="scope">
        <div class="time common-contain" @mouseenter="showIcon(scope.row)" @mouseleave="closeIcon(scope.row)">
          <div v-if="!scope.row.editTime" class="common-flex" >
            <span  style="cursor: pointer">
              <span v-if="scope.row.deliveryTime" >{{ scope.row.deliveryTime }}</span>
              <span v-else style="width: 80px; height: 34px; display: inline-block"></span>
            </span>
            <div class="common-btn" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? editTime(scope.row): $notAuthorized()">
              <i class="el-icon-edit" v-if="scope.row.repeatStatus == false"></i>
            </div>
          </div>
          <template v-else>
            <el-date-picker
              :ref="scope.row.id + 'datepicker'"
              v-model="scope.row.deliveryTime"
              type="datetime"
              placeholder="选择交付时间"
              format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              @blur="updateDeliverableTime(scope.row)"
              class="date_picker"/>
          </template>
        </div>
      </template>
      <!-- 优先级 -->
      <template slot="priority" slot-scope="scope" >
        <div class="common-contain"  @mouseenter="showIcon(scope.row)" @mouseleave="closeIcon(scope.row)">
          <div class="common-contain" v-if="scope.row.editPriority">
            <el-select style="width:60px !important" :ref="'input' + scope.row.id" v-model="scope.row.priority"
            @change="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? updatePriority(scope.row) : $notAuthorized()" @blur="cancelEdit(scope.row)" >
              <el-option
                v-for="item in priorityList"
                :key="item.value"
                :label="item.value"
                :value="item.label"
                :style="'color:' + item.color">
              </el-option>
            </el-select>
          </div>
          <div class="common-contain" v-else >
            <span v-if="scope.row.priority||scope.row.priority==0" class="task-priority" :style=" 'color:' +
              (scope.row.priority == 0
                ? 'red'
                : scope.row.priority == 1
                ? '#FF3300'
                : scope.row.priority == 2
                ? '#FF9900'
                : scope.row.priority == 3
                ? '#33CC66'
                : '')">
              {{ scope.row.priority | priority }}
            </span>
            <span v-else>-</span>
            <div class="common-btn" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? editPriority(scope.row) : $notAuthorized()">
              <i class="el-icon-edit" v-if="scope.row.repeatStatus == false" ></i>
            </div>
          </div>
        </div>
      </template>
      <!-- 交付物名称 -->
      <template slot="deliveryName" slot-scope="scope">
        <div class="common-contain" @mouseenter="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? showIcon(scope.row) : ''" @mouseleave="closeIcon(scope.row)">
          <div class="common-flex" v-if="!scope.row.editName" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? editName(scope.row) : $notAuthorized()">
            <p class="name-flow" v-if="scope.row.deliveryName">
              <span v-if="scope.row.deliveryName!=null">{{ scope.row.deliveryName }}</span>
              <span v-else>-</span>
              <i class="el-icon-edit" v-if="scope.row.repeatStatus == false "></i>
            </p>
            <div v-else style="width: 160px; height: 34px">
              <span>-</span>
              <i class="el-icon-edit" v-if="scope.row.repeatStatus == false"></i>
            </div>
          </div>
          <template v-else>
            <div class="common-flex">
              <el-input v-focus maxlength="30" :ref="'deliverableNameInput' + scope.row.id" @blur="updateDeliverableName(scope.row)" v-model="scope.row.deliveryName" placeholder="请输入内容"></el-input>
            </div>
          </template>
        </div>
      </template>
      <!-- 订单编号 -->
      <template slot="orderNo" slot-scope="scope">
        <div :class="listType == 'personal' || currentAccountInfo.isPartner ? '' : 'list-order-no'"  @mouseover="getOrderPermissions(scope.row)">
          <p class="task-no-text" @click="checkTaskPermissions(listType, orderPermissions, 'permissionsOfOrderDetail') && listType != 'personal' && !currentAccountInfo.isPartner ? toViewOrder(scope.row) : (listType != 'personal' && !currentAccountInfo.isPartner ? $notAuthorized() : '')">{{ scope.row.orderNo }}</p>
        </div>
      </template>
      <!-- 任务编号 -->
      <template slot="taskNo" slot-scope="scope">
        <div class="list-task-no">
          <p class="refund-flag" v-if="scope.row.isRefund == 1">退</p>
          <p v-else></p>
          <p class="task-no-text" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfDetail') ? toViewTask(scope.row) : $notAuthorized()">{{ scope.row.taskNo }}</p>
        </div>
      </template>
      <!-- 业务员 -->
      <template slot="clueSalesmanEmpName" slot-scope="scope">
        <el-tooltip effect="dark" :content="tooltipContent" placement="top" :disabled='hidden'>
          <span @mouseover="showUserInfo(scope.row.clueSalesmanEmpId)"><img src="/img/disable.png" class="emp_disabled" v-if="scope.row.salesLockFlag == 9" alt=""/>
            {{ scope.row.clueSalesmanEmpName }}
          </span>
        </el-tooltip>
      </template>
      <!-- 工程师 -->
      <template slot="engineerName" slot-scope="scope">
        <div class="common-contain" @mouseenter="checkTaskPermissions(listType, apiInfo, 'permissionsOfAllot') && !currentAccountInfo.isPartner ? showIcon(scope.row) : ''" @mouseleave="closeIcon(scope.row)">
          <div @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfAllot') && !currentAccountInfo.isPartner ? showChangeEngineer(true, scope.row) : $notAuthorized()"  >
            <div v-if="scope.row.trTaskEngineerList!=null&&scope.row.trTaskEngineerList.length>0" class="common-flex">
              <div class="enginner">
                <div v-for="item in scope.row.trTaskEngineerList" :key="item.id">
                  <el-tooltip effect="dark" :content="tooltipContent" placement="right">
                    <p class="name-flow" @mouseover="showUserInfo(item.engineerId)">{{ item.engineerName }}</p>
                  </el-tooltip>
                </div>
              </div>
              <div class="common-btn">
                <i class="el-icon-edit" v-if="scope.row.repeatStatus == false && !currentAccountInfo.isPartner "></i>
              </div>
            </div>
            <div v-else>暂无数据</div>
          </div>
        </div>
      </template>
      <!-- 任务进度（0：待开始；1：进行中；2：已完成；-1暂停；-2：已关闭） -->
      <template slot="taskStatus" slot-scope="scope">
        <div class="common-contain" @click="checkTaskPermissions(listType, apiInfo, 'permissionsOfEdit') ? changeStatus(scope.row) : $notAuthorized()" @mouseenter="showIcon(scope.row)" @mouseleave="closeIcon(scope.row)">
        <div class="pointer-sty">
          <span :class="[
              scope.row.taskStatus == 0? 'blue-circle':
              scope.row.taskStatus == 1? 'blue-circle in-service':
              scope.row.taskStatus == -1? 'blue-circle circleRed':
              scope.row.taskStatus == 2? 'newsuccess': '']">
            <b v-if="scope.row.taskStatus == 2">✔</b></span>
            <span v-if="scope.row.taskStatus == 1">
            {{ scope.row.stepName}}</span>
          <span v-else-if="scope.row.taskStatus == 2">{{ scope.row.finishLabel }}</span>
          <span v-else>{{ scope.row.taskStatus | taskStatus }}</span>
        </div>
        <div class="common-btn">
          <i class="el-icon-edit" v-if="scope.row.repeatStatus == false && scope.row.taskStatus != 2"></i></div>
        </div>
      </template>
      <!-- 专利申请号 -->
      <template slot="patentNo" slot-scope="scope">
        <div class="common-btn pointer-sty" @click="showEditPatentNo(scope.row)" @mouseenter="showIcon(scope.row)" @mouseleave="closeIcon(scope.row)">
          <span>{{scope.row.patentApplicationNo|filterPatentNo}}</span>
          <i class="el-icon-edit" v-if="(scope.row.repeatStatus == false)&&(listType!='personal')&&(!currentAccountInfo.isPartner)&&(permissions.bt_edit_intellectual_patent_task)"></i>
        </div>
      </template>
      <template slot="cFollowStatus" slot-scope="scope">
        <span>{{scope.row.isFollowToday | filterFollowToDay}}</span>
      </template>
    </avue-crud>
    <!-- 任务分配 -->
    <el-dialog :visible.sync="taskAllotDialog" width="500px" :title="allotTitle" :close-on-click-modal="false">
      <task-allocation
        v-if="taskAllotDialog"
        :taskInfo="taskInfo"
        :allotType="allotType"
        :listType="listType"
        :apiInfo="apiInfo"
        :taskIdList="taskIdList"
        @closeAllotDialog="closeAllotDialog"
        @cancelAllotDialog="cancelAllotDialog" />
    </el-dialog>
    <!-- 提交进度 -->
    <el-dialog :visible.sync="submitScheduleDialog" width="700px" title="提交进度" :close-on-click-modal="false">
     <task-submit-schedule :operateType="operateType" :listType="listType" :apiInfo="apiInfo" :taskInfoList="taskInfoList" :taskInfo="taskInfo" v-if="submitScheduleDialog"  @colseProcessDialog="colseProcessDialog"></task-submit-schedule>
    </el-dialog>
    <!-- 客户跟进 -->
    <el-dialog title="客户跟进" :visible.sync="followClueDialog" width="600px" :close-on-click-modal="false">
      <customer-follow :taskInfo="taskInfo" :listType="listType" :apiInfo="apiInfo" @closeDialog="closeDialog" v-if="followClueDialog" />
    </el-dialog>
    <!-- 专利编号修改 -->
    <edit-patent-no @refresh="getTaskList()" ref="patent-no"></edit-patent-no>
    <!-- 工程师修改 -->
    <el-dialog :visible.sync="showEngineerBtn" width="300px" title="工程师修改" :close-on-click-modal="false">
      <el-cascader
       ref="engineerOne"
       :show-all-levels="false"
       :options="empList"
       collapse-tags
       filterable
       clearable
       :before-filter="beforeFilter"
       :key="isResouceShow"
       v-model="cValue"
       :props="{ value: 'customerId', label: 'label', multiple: true, emitPath: false }"
       class="cascader-sty">
      <template slot-scope="{data}">
        <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
          <div slot="content">{{data.customerNo}}</div>
          <span>{{data.label}}</span>
        </el-tooltip>
      </template>
      </el-cascader>
      <div class="common-engineer-btn">
        <el-button type="primary" class="right-btn-sty" @click.native="editEngineerName(cTaskInfo)">确定</el-button>
        <el-button @click.native="changeEngineerBtn(false)">取消</el-button>
      </div>
    </el-dialog>
    <!-- 导入专利申请号&导入专利申请结果 -->
    <import-patent-demo @refresh="getTaskList()" ref="patent-demo"></import-patent-demo>
    <dialog-column ref="defaultColumn" @hideColumn="hideColumn"></dialog-column>
  </div>
</template>

<script>
import { saveDetal } from "@/util/clearDetail";
import { getPrrocessStatus } from "@/api/task/new-task";
import { taskTableOption } from "@/const/crud/task/task-project";
import { taskonlineTableOption } from "@/const/crud/task/task-property";
import taskData from "@/components/task/js/task.js";
import TaskAllocation from "./task-allocation";
import { allByDeptAndPartnerDept } from "@/api/clue/clue";
import TaskSubmitSchedule from "./task-submit-schedule";
import customerFollow from "./customer-follow";
import { editTaskList, updateEngineerName, partnerList, updateCustomerSetting } from "@/api/task/index";
import Temporary from "../../views/siteSettings/temporary";
import importPatentDemo from "@/components/task/import-operate/import-patent-demo";
import editPatentNo from "@/components/task/edit-patent-no";
import dialogColumn from "@/components/common/dialog-column";
import multipartUpload from "@/components/task/upload/multipart-upload";
import { mapGetters, mapState } from "vuex";
import { getNewEmpDetail } from "@/api/admin/user";
import * as CodeMsg from "@/api/common/CodeChange";
import taskConfigData from "@/components/common/data.js"
export default {
  components: {
    TaskAllocation,
    TaskSubmitSchedule,
    customerFollow,
    Temporary,
    importPatentDemo,
    editPatentNo,
    dialogColumn,
    multipartUpload
  },
  provide () {
    return {
      crud: this
    };
  },
  directives: {
    //注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function (el) {
        // 聚焦元素
        el.querySelector("input").focus();
      },
    },
  },
  props: {
    orderType: {
      // 2-知产 1-项目
      type: Number,
      default: null,
    },
    listType: {
      // 我的任务- 'personal'
      type: String,
      default: null,
    },
    showEngineer: {
      type: Boolean,
      default: true,
    },
    showEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columnConfigList: taskConfigData.columnConfigList,
      defaults:{},
      cTaskInfo: {},
      taskTableOption: {...taskTableOption},
      tasksListData: [],
      showEngineerBtn: false,
      tableLoading: false,
      operateType: 0, // 0-单个提交，1-批量提交
      sortField: "", // 排序名称
      sortType: "", // DESC降序 ASC升序
      processList: [], // 进行中状态列表
      taskIdList: [], // 选择的任务id集合
      taskInfoList: [], // 选择的任务对象集合
      cValue: [],
      partnerList: [], //合作机构
      hasTapBtn: false,
      inicialData: [],
      allotTitle: "",
      allotType: 0, //1-批量分配
      taskForm: {
        keyWords: null,
        salesmanNo: null,
        engineerNo: null,
        taskStatus: null,
        processName: "", // 进度工作流名称
        finishType: null, //完成状态
        productSubType: null, // 知产类型
        source: null, // 任务来源
        taskType: null, // 任务类型
        partnerId: null, //任务消化方
      },
      taskStatusList: [
        {
          label: "全部",
          count: 0,
          taskStatus: null,
        },
        {
          label: "待开始",
          count: 0,
          taskStatus: 0,
        },
        {
          label: "进行中",
          count: 0,
          taskStatus: 1,
          startCount: 0,
        },
        {
          label: "已暂停",
          count: 0,
          taskStatus: -1,
        },
        {
          label: "已完成",
          count: 0,
          taskStatus: 2,
        },
        {
          label: "已关闭",
          count: 0,
          taskStatus: -2,
        },
      ],
      completeStatusList: [
        {
          dropdownKey: "A",
          dropdownValue: "已完成",
        },
        {
          dropdownKey: "B",
          dropdownValue: "已完成(通过)",
        },
        {
          dropdownKey: "C",
          dropdownValue: "已完成(未通过)",
        },
      ],
      priorityList: taskData.priorityList,
      page: {
        pageSize: 20,
        currentPage: 1,
        total: 0,
        pageSizes: [3, 5, 10, 20, 50],
      },
      taskAllotDialog: false,
      taskInfo: {},
      empList: [],
      isResouceShow: 0,
      submitScheduleDialog: false,
      followClueDialog: false,
      filterpropertyList: taskData.filterpropertyList,
      taskTypeList: taskData.taskTypeList,
      taskIds: [],
      apiInfo: {},
      orderPermissions: {},
    };
  },
  filters: {
    filterFollowToDay(val) {
      return val == true ? "今日已跟进" : "-";
    },
    filterPatentNo(val) {
      return Number(val) == 0 ? "-" : val;
    },
    taskStatus(val) {
      return taskData.taskStatus(val);
    },
    priority(val) {
      return taskData.priority(val);
    },
    finishType(val) {
      if (val == 1) {
        return "已完成(通过)";
      } else if (val == 2) {
        return "已完成(未通过)";
      } else {
        return "已完成";
      }
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    getInputText(){
      let msg = '请输入客户名称/任务名称/交付物名称关键字/任务编号'
      if(this.listType == 'personal'||this.orderType == 2){
        return `${msg}/专利申请号`
      }else{
        return msg
      }
    },
  },
  created() {
    if(sessionStorage.getItem(`${this.$route.path}`)){
        let keepParams =JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
        if(keepParams.detail.path){
          this.$router.push({
            path: keepParams.detail.path,
            query: keepParams.detail.query
          })
          return
        }
      this.taskForm = keepParams.screening;
      this.page = keepParams.page
    }
    this.$nextTick(()=>{
      this.setTableOption();
    })
    this.setToDetail();
  },
  mounted() {
    if (this.listType != "personal") {
      [this.apiInfo] = taskData.taskApiList.filter(
        (item) => item.type == this.orderType
      );
    }
    this.getDropList();
    this.getProcess();
    this.getTaskList();
    this.getPartnerList();
  },
  methods: {
    // 列显隐性设置绑定用户
    columnSetting(val){
      this.columnConfigList.forEach(item => {
        if(item.path == this.$route.path){
          item.customerSetting = []
          item.customerSetting = val
        }
      })
      this.updateCustomerSetting(JSON.parse(JSON.stringify(this.columnConfigList)))
    },
    updateCustomerSetting(val){
      updateCustomerSetting({
          userId: this.userInfo.id,
          customerSetting: JSON.stringify(val)
        }).then(res => {
          if(res.data.code != CodeMsg.CODE_0){
            this.$offsetMessage({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }).catch(err=>{
          return err
        })
    },
    // 子组件触发
    hideColumn(val){
      this.columnSetting(JSON.parse(JSON.stringify(this.taskTableOption.column)))
    },
    // 修改显隐
    changeColumn(){
      this.$refs.defaultColumn.handleShow()
    },
    // 0-导入专利申请号 1-导入专利申请结果
    showPatentDemo(type) {
      if (this.$refs["patent-demo"]) {
        this.$refs["patent-demo"].openVisble = true;
        this.$refs["patent-demo"].demoType = type;
        this.$refs["patent-demo"].importFailStatus = false;
        this.$refs["patent-demo"].fileList = [];
      }
    },
    // 设置初始option
    async setTableOption() {
      await getNewEmpDetail().then((res) => {
        if(res.data.code == CodeMsg.CODE_0){
          this.taskTableOption = this.orderType == 2 || this.listType == "personal" ? {...taskonlineTableOption} : {...taskTableOption}
          let response = res.data.data.customerSetting
          if(response){
            let arr = JSON.parse(res.data.data.customerSetting)
            arr.forEach(item => {
              if(item.path == this.$route.path){
                if(item.customerSetting.length == 0){
                  this.taskTableOption.column.forEach(item =>{
                    if(['deliveryTime','deliveryName','priority','orderNo'].includes(item.prop)){
                      item.hide = true
                    }else{
                      item.hide = false
                    }
                  })
                  return false
                }
                this.$set(this.taskTableOption, "column", item.customerSetting)
              }
            })
          }else{
            this.taskTableOption.column.forEach(item =>{
              if(['deliveryTime','deliveryName','priority','orderNo'].includes(item.prop)){
                item.hide = true
              }else{
                item.hide = false
              }
            })
          }
        }
      })
    },
    setToDetail() {
      // 详情里跳详情
      if (sessionStorage.getItem(`${this.$route.path}`)) {
        let keepParams = JSON.parse(
          sessionStorage.getItem(`${this.$route.path}`)
        );
        let pathArr = [
          "/order-detail",
          "/orderonline-detail",
          "/contracts-detail",
          "/mycontracts-detail",
        ];
        this.page = keepParams.page;
        if (
          keepParams.detail.path !== "" &&
          pathArr.includes(keepParams.detail.path)
        ) {
          this.$router.push({
            path: keepParams.detail.path,
            query: keepParams.detail.query,
            source: this.$route.query.source,
          });
          return;
        }
      }
    },
    // 工程师弹窗显示控制
    changeEngineerBtn(val, row) {
      if (val) {
        this.cTaskInfo = row;
      }
      this.showEngineerBtn = val;
    },
    // 专利号弹窗显示控制
    showEditPatentNo(row) {
      if((row.repeatStatus == false)&&(this.listType!='personal')&&(!this.currentAccountInfo.isPartner)&&(this.permissions.bt_edit_intellectual_patent_task)){
        if (this.$refs["patent-no"]) {
           this.$refs["patent-no"].showPatentBtn = true;
           this.$refs["patent-no"].taskInfo = row;
           this.$refs["patent-no"].rowForm.patentNo = row.patentApplicationNo;
         }
       }
    },
    getOrderPermissions(row) {
      [this.orderPermissions] = taskData.permissionsOfOrder.filter(
        (item) => item.type.indexOf(row.categoryId) > -1
      );
    },
    // 获取数据员工 false-去除禁用后的员工 true-获取所有员工
    getDropList() {
      allByDeptAndPartnerDept().then((res) => {
        ++this.isResouceShow;
        const emp = res.data.data;
        this.empList = [...emp.deptTree, ...emp.partnerDeptTree];
      });
    },
    getPartnerList() {
      partnerList().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.partnerList = res.data.data;
          this.partnerList.unshift({
            partnerName: "全部",
            partnerId: null,
          });
        }
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
      this.$loop(this.empList[0], this.empList[0]);
      return false;
    },
    changeSubType() {
      this.taskForm.taskStatus = null;
      this.taskForm.processName = "";
      this.taskForm.finishType = null;
      this.page.currentPage = 1;
      this.hasTapBtn = true;
      this.getTaskList();
    },
    //排序
    changeSort(e) {
      this.sortField =
        e.prop == "priority"
          ? "priority"
          : e.prop == "deliverTime"
          ? "deliverTime"
          : e.prop == "createTime"
          ? "createTime"
          : e.prop;
      this.sortType = e.order == "ascending" ? "ASC" : "DESC";
      this.getTaskList();
    },
    changeStatus(row) {
      if((row.taskStatus == 2)&&(row.finishLabel=="通过"||row.finishLabel=="不通过"||row.finishLabel=="完成")){
        return
      }
      this.operateType = 0;
      this.taskInfo = row;
      this.submitScheduleDialog = true;
    },
    //任务状态数量
    getTaskStatistical() {
      let param = {
        keyWord: this.taskForm.keyWords,
        listType: this.listType,
        startTime: this.taskForm.createTime ? this.taskForm.createTime[0] : "",
        endTime: this.taskForm.createTime ? this.taskForm.createTime[1] : "",
        engineerInfo: this.taskForm.engineerNo ? this.taskForm.engineerNo : "", // 工程师
        clueSalesmanEmpInfo: this.taskForm.salesmanNo
          ? this.taskForm.salesmanNo
          : "", // 业务员
        source: this.taskForm.source,
        stepName: this.taskForm.processName,
        finishType: this.taskForm.finishType,
        listType: this.listType,
      };
      if (this.orderType == 2) {
        param.categoryIds =
          this.taskForm.productSubType == null
            ? [3, 4, 5, 6]
            : [this.taskForm.productSubType];
      } else {
        param.categoryId = this.orderType;
      }
      taskData.getTaskStatistical(param, this.apiInfo).then((res) => {
        if (res.data.code == 0) {
          let r = res.data.data;
          this.fixTaskValua(r);
        }
      });
    },
    fixTaskValua(r) {
      if (this.taskForm.taskStatus == null) {
        this.taskStatusList[1].count = r.waitStartCount;
        this.taskStatusList[2].startCount = r.inUseCount;
        this.taskStatusList[2].count = r.inUseCount;
        this.taskStatusList[3].count = r.suspendCount;
      } else if (this.taskForm.taskStatus == 0) {
        this.taskStatusList[1].count = r.waitStartCount;
        this.taskStatusList[2].count = this.taskStatusList[2].startCount;
      } else if (this.taskForm.taskStatus == 1) {
        this.taskStatusList[2].count = r.inUseCount;
      } else if (this.taskForm.taskStatus == -1) {
        this.taskStatusList[3].count = r.suspendCount;
        this.taskStatusList[2].count = this.taskStatusList[2].startCount;
      } else if (
        this.taskForm.taskStatus == 2 ||
        this.taskForm.taskStatus == -2
      ) {
        this.taskStatusList[2].count = this.taskStatusList[2].startCount;
      }
    },
    getProcess() {
      getPrrocessStatus().then((res) => {
        if (res.data.code == 0) {
          this.processList = res.data.data;
        }
      });
    },
    // 展示编辑工程师
    showChangeEngineer(status, row) {
      this.changeEngineerBtn(status, row);
      this.cValue = [];
      if (row.trTaskEngineerList) {
        row.trTaskEngineerList.forEach((item) => {
          this.cValue.push(item.engineerId);
        });
      }
    },
    // 编辑工程师-前置条件判断
    editEngineerName(row) {
      this.$nextTick(() => {
        let rList = this.$refs.engineerOne.getCheckedNodes(true);
        if (this.cValue.length > 3||this.cValue.length == 0) {
          this.$message({
            type: "warning",
            message:this.cValue.length > 3? "至多选择三个工程师！":"至少选择一个工程师！"
          });
        } else {
          let eList = [];
          rList.forEach((item) => {
            if (item.data.value != null) {
              eList.push({
                engineerId: item.data.customerId,
                engineerNo: item.data.customerNo,
                engineerName: item.data.customerName,
              });
            }
          });
          this.setEngineerName(row, eList);
        }
      });
    },
    // 编辑工程师-调用接口
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
          this.changeEngineerBtn(false);
          this.getTaskList();
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg,
          });
        }
      });
    },
    showIcon(row) {
      this.tasksListData.forEach((item) => {
        if (row.id == item.id) {
          this.$set(row, "repeatStatus", false);
        }
      });
    },
    closeIcon(row) {
      this.tasksListData.forEach((item) => {
        if (row.id == item.id) {
          this.$set(row, "repeatStatus", true);
        }
      });
    },
    dochange(val) {
      val == 1
        ? (this.taskForm.finishType = null)
        : val == 2
        ? (this.taskForm.processName = "")
        : "";
      this.page.currentPage = 1;
      this.taskForm.taskStatus = val;
      this.getTaskList();
    },
    closeDialog(val, status) {
      this.followClueDialog = val;
      if (status) {
        this.getTaskList();
      }
    },
    colseProcessDialog(val, status) {
      this.submitScheduleDialog = val;
      if (status) {
        this.getTaskList();
        this.$refs.progress.getList();
        this.getTaskStatistical();
      }
    },
    cancelAllotDialog(val) {
      this.taskAllotDialog = val;
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getTaskList();
    },
    changeTaskStatus() {
      this.taskForm.processName = "";
      this.taskForm.finishType = null;
      this.getTaskList();
    },
    resetTask() {
      this.taskForm = {
        taskStatus: null,
        salesmanNo: "",
        engineerNo: "",
        keyWords: "",
        processName: "",
        finishType: null,
        source: null,
        taskType: null,
        productSubType: null,
        partnerId: null,
      };
      ++this.isResouceShow;
      this.getTaskList();
    },
    closeAllotDialog(val) {
      this.taskAllotDialog = val;
      this.taskInfo = {};
      this.getTaskList();
    },
    handleBatch() {
      let completeTask = this.taskInfoList.filter(
        (item) => item.taskStatus == 2
      );
      if (completeTask.length > 0) {
        this.$message.warning("存在已完成的任务，请检查后再操作！");
      } else {
        if (this.taskInfoList.length == 1) {
          // 单个提交
          this.submitScheduleDialog = true;
          this.taskInfo = this.taskInfoList[0];
          this.operateType = 0;
        }
        if (this.taskInfoList.length > 1) {
          this.operateType = 1;
          let result = this.taskInfoList.filter((item) => {
            return item.orderId == this.taskInfoList[0].orderId;
          });
          if (result.length != this.taskInfoList.length) {
            this.$message({
              type: "warning",
              message: "当前所选项不归属于同一订单，请重新选择！",
              offset: 300,
            });
          } else {
            this.submitScheduleDialog = true;
            this.taskInfo = this.taskInfoList[0];
          }
        }
      }
    },
    // 客户跟进
    handlFollow() {
      if (this.taskInfoList.length == 0) {
        this.$message.warning("请至少选择一项任务");
      } else if (this.taskInfoList.length > 1) {
        this.$message.warning("只能选择一项任务");
      } else {
        this.followClueDialog = true;
        this.taskInfo = this.taskInfoList[0];
      }
    },
    //任务分配 // type:0-单个分配，1-批量；row：当前选中的行
    taskAllot(type, row) {
      this.allotType = type;
      if (type == 1) {
        if (this.taskInfoList.length > 0) {
          this.allotTitle = "批量分配";
          this.taskAllotDialog = true;
        } else {
          this.$message.warning("请至少选择一项任务");
        }
      } else {
        this.$refs.crud.selectClear();
        this.allotTitle = "任务分配";
        this.taskInfo = row;
        this.taskAllotDialog = true;
      }
    },
    toViewTask(row) {
      let path = "/task-detail";
      let query = {
        categoryId: row.categoryId,
          id: row.id,
          listType: this.listType,
          type: this.orderType, //任务类型
          showEdit: this.showEdit,
      }
      saveDetal(`${this.$route.path}`,path,query)
      this.$router.push({
        path: path,
        query:query
      });
    },
    getTaskList() {
      this.tableLoading = true;
      var param = {
        showStatus: 1, // 显示不显示
        partnerId: this.taskForm.partnerId,
        pageSize: this.page.pageSize,
        pageNo: this.page.currentPage,
        keyWord: this.taskForm.keyWords,
        taskStatus: this.taskForm.taskStatus,
        listType: this.listType,
        startTime: this.taskForm.createTime ? this.taskForm.createTime[0] : "",
        endTime: this.taskForm.createTime ? this.taskForm.createTime[1] : "",
        engineerInfo: this.taskForm.engineerNo ? this.taskForm.engineerNo : "", // 工程师
        clueSalesmanEmpInfo: this.taskForm.salesmanNo
          ? this.taskForm.salesmanNo
          : "", // 业务员
        source: this.taskForm.source,
        stepName: this.taskForm.processName,
        finishType:
          this.taskForm.finishType == "" ? null : this.taskForm.finishType,
        finishLabel:
          this.taskForm.finishType == "A"
            ? "完成"
            : this.taskForm.finishType == "B"
            ? "通过"
            : this.taskForm.finishType == "C"
            ? "未通过"
            : null,
      };
      if (this.sortField != "") {
        param.sortField = this.sortField;
        param.sortType = this.sortType;
      }
      // 我的任务
      if (this.listType == "personal") {
        // 1 项目,2 知产(父级)->taskType,3 专利,4 版权，5 商标，6 其他->productSubType
        if (this.taskForm.taskType == 1) {
          param.categoryId = this.taskForm.taskType;
        } else if (this.taskForm.taskType == 2) {
          param.categoryIds = [3, 4, 5, 6];
        }
      } else {
        if (this.orderType == 2 && this.taskForm.productSubType == null) {
          param.categoryIds = [3, 4, 5, 6];
        } else {
          if (this.orderType == 2) {
            param.categoryId = this.taskForm.productSubType;
          } else {
            param.categoryId = this.orderType;
          }
        }
      }
      sessionStorage.setItem(
        JSON.parse(sessionStorage.getItem("pigx-tag")).content.value,
        JSON.stringify({
          page: this.page,
          screening: this.taskForm, //表单筛选信息
          ID: JSON.parse(sessionStorage.getItem("pigx-tag")).content.label, //页面标识
          detail: { query: {} },
        })
      ); //保存页面信息
      let keepParams = {
            params:this.taskForm,
            page:this.page,
            detail:{
                path:'',
                query:{}
            }
         }
      // sessionStorage.setItem(`${this.$route.path}-data`, JSON.stringify(keepParams))
      taskData.taskList(param, this.apiInfo).then((res) => {
        this.hasTapBtn = false;
        this.tasksListData = res.records;
        this.inicialData = [];
        this.tasksListData.forEach((item) => {
          this.$set(item, "show", true);
          //记住每行交付物名称
          this.inicialData.push({
            taskNo: item.taskNo,
            deliveryName: item.deliveryName,
            engineerName: item.engineerName,
            priority: item.priority,
          });
        });
        this.page.total = res.total;
        this.tableLoading = false;
      });
      // 任务状态数量
      this.getTaskStatistical();
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getTaskList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getTaskList();
    },
    // 手动勾选某一行时
    selectRows(selection, row) {
      this.tasksListData.forEach((item) => {
        if (item.orderType == row.orderType) {
          item.disabled = false;
        } else {
          item.disabled = true;
        }
      });
      this.taskInfoList = selection;
      this.taskInfo = selection[0];
    },
    // 全选按钮
    selectAll(selection) {
      if (selection.length > 0) {
        if (
          !selection.every((item) => item.orderType == selection[0].orderType)
        ) {
          this.$message.warning(
            "此列表中的订单类型不同，不可全选，请先选中一种订单再批量分配"
          );
          this.$refs.crud.selectClear();
          this.taskInfoList = [];
        } else {
          this.taskInfoList = selection;
        }
      } else {
        this.taskInfoList = [];
      }
    },
    selectionChange(row) {
      this.taskIdList = [];
      this.taskInfoList = row;
      row.forEach((item) => {
        this.taskIdList.push({
          id: item.id,
        });
      });
      //选项发生变化时
      if (row.length == 0) {
        this.tasksListData.forEach((item) => {
          item.disabled = false;
        });
      }
    },
    cancelEdit(row) {
      this.$set(row, "repeatStatus", true);
      setTimeout(() => {
        this.$set(row, "editPriority", false);
      }, 300);
      this.getTaskList();
    },
    editTime(row) {
      this.tasksListData.forEach((item) => {
        if (row.id == item.id) {
          this.$set(item, "editTime", true);
        } else {
          this.$set(item, "editTime", false);
        }
      });
    },
    editName(row){
      this.tasksListData.forEach((item) => {
        if (row.id == item.id) {
          this.$set(item, "editName", true);
        } else {
          this.$set(item, "editName", false);
        }
      });
    },
    editPriority(row){
      this.tasksListData.forEach((item) => {
        if (row.id == item.id) {
          this.$set(item, "editPriority", true);
        } else {
          this.$set(item, "editPriority", false);
        }
      });
      let that = this;
      setTimeout(() => {
        that.$refs["input" + row.id].focus();
      }, 300);
    },
    //修改交付物名称
    updateDeliverableName(row) {
      this.$set(row, "editName", false);
      this.inicialData.forEach((item) => {
        if (item.taskNo == row.taskNo) {
          //当前选择的行且交付物名称编辑过
          if (item.deliveryName != row.deliveryName) {
            let params = {
              deliveryName: row.deliveryName,
              id: row.id,
            };
             if(Number(row.deliveryName)!=0){
              editTaskList(params,this.listType,this.apiInfo).then((res) => {
                if (res.data.code == 0) {
                  this.$message.success("编辑成功");
                  this.getTaskList();
                } else {
                  this.$message({
                    type:'warning',
                    message: res.data.msg
                  })
                }
              });
            } else{
              this.$message.warning("请补全交付物名称后再试");
              this.getTaskList();
            }
          }
        }
      });
    },
    //修改交付物时间
    updateDeliverableTime(row) {
      this.$set(row, "editTime", false);
       if(Number(row.deliveryName)!=0){
        this.inicialData.forEach((item) => {
        if (item.taskNo == row.taskNo) {
          //当前选择的行且交付物编辑过
          if (item.deliveryTime != row.deliveryTime) {
            let params = {
              deliveryTime: row.deliveryTime,
              id: row.id,
            };
            editTaskList(params,this.listType,this.apiInfo).then((res) => {
              if (res.data.code == 0) {
                this.$message.success("编辑成功");
                this.getTaskList();
              } else {
                this.$message({
                  type:'warning',
                  message: res.data.msg
                })
              }
            });
          }
        }
      });
      }else{
        this.$message.warning("请补全交付物名称后再试");
        this.getTaskList();
      }
    },
    //修改优先级
    updatePriority(row) {
      if(Number(row.deliveryName)!=0){
        this.inicialData.forEach((item) => {
        if (item.taskNo == row.taskNo) {
          let params = {
            priority: row.priority,
            id: row.id,
          };
          editTaskList(params,this.listType,this.apiInfo).then((res) => {
            if (res.data.code == 0) {
              this.$message.success("编辑成功");
              this.getTaskList();
            } else {
              this.$message({
                type:'warning',
                message: res.data.msg
              })
            }
          });
        }
      });
      }else{
        this.$message.warning("请补全交付物名称后再试");
        this.getTaskList();
      }
    },
  },
};
</script>

<style scoped>
.com_padding_sty {
  padding: 3px 3px;
}
.task-sty {
  width: 110px;
}
.keywords-sty {
  margin-left: 13px;
}
.batch-allot-sty {
  margin-left: 6px;
  margin-bottom: 12px;
}
.batch-submit-sty {
  margin-left: 10px;
  margin-bottom: 12px;
}
.customer-follow-sty {
  margin-left: 10px;
  margin-bottom: 12px;
}
.cascader-sty {
  width: 240px !important;
}
.handle-thing-sty {
  width: 160px;
  height: 34px;
}
.priority-sty {
  width: 60px !important;
}
.pointer-sty {
  cursor: pointer;
}
.handle-time-sty {
  width: 80px;
  height: 34px;
  display: inline-block;
}
.enginner {
  display: block;
}
.enginner p {
  margin: 0;
}
.common-flex {
  display: flex;
  align-items: center;
}
.common-btn {
  margin-left: 10px;
}
.common-contain {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.task-list >>> .el-radio-button__inner {
  padding: 12px 20px;
}
NaNpxove-padding >>> .el-radio-button__inner {
  padding: 5px 10px;
}
.taskmr {
  position: relative;
  left: 8px;
}
.istop {
  top: 1px;
}
.statusImg {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 7px;
  left: 2px;
}
.task-list {
  padding: 10px;
  margin-right: 10px;
  height: 100%;
  background: #fff;
}
.task-status {
  margin: 12px;
  font-size: 14px;
  color: #606266;
}
.radio-sty {
  margin-left: 12px;
}
.radio-left-sty {
  border-left: 1px solid #dcdfe6;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
.blue-circle {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 7px;
}
.name-flow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.newsuccess {
  font-weight: bolder;
  font-size: 12px;
  display: inline-block;
  color: #027502;
  margin-right: 2px;
}
.circleRed {
  background: #ff0000;
}
.in-service {
  background: #f3ab03;
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
.task-keywords {
  width: 400px;
}
.task-short-keywords{
  width: 350px;
}
.list-task-no {
  color: #36a6fe;
  cursor: pointer;
  text-align: center;
}
.list-order-no {
  color: #36a6fe;
  cursor: pointer;
}
.task-no-text {
  text-align: center;
}
.task-priority {
  cursor: pointer;
}
.emp_name {
  margin: 0;
}
.cancleEdit {
  margin-left: 10px;
  cursor: pointer;
}
.order-time {
  width: 280px;
}
.right-btn-sty {
  margin-right: 50px;
}
.common-engineer-btn {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.task-btn-contain{
  margin-left: 12px;
}
.show-sty {
  float: right;
}
</style>
