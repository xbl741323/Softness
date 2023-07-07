<template>
  <basic-container>
    <el-form
      @keyup.enter.native="getFirstAllList()"
      :model="filters"
      ref="filters"
      class="search"
      inline
      label-width="90"
    >
      <div>
        <el-form-item label="流程状态：" prop="createTime">
          <el-radio-group
            size="medium"
            v-model="filters.processStatus"
            @change="changeStatus()"
          >
            <el-radio-button :label="null">全部</el-radio-button>
            <el-radio-button class="radio-item" :label="1">
              <span class="circle-sty"></span>
              <span>待提交审核({{ countInfo.waitEnterCount }})</span>
            </el-radio-button>
            <el-radio-button class="radio-item" :label="2">
              <span class="circle-sty"></span>
              <span>待审核({{ countInfo.waitAuditCount }})</span>
            </el-radio-button>
            <el-radio-button class="radio-item" :label="5">
              <span class="done-sty">✔</span>
              <span>已通过</span>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="考核日期：" prop="createTime">
          <el-date-picker
            :clearable="false"
            v-model="filters.appraisalDate"
            @change="getFirstAllList"
            type="month"
            placeholder="选择月"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="关键字：" prop="keyWords">
          <el-input
            class="long-input"
            placeholder="请输入流程编号/任务名称关键字"
            v-model.trim="filters.keyWords"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="deptId">
          <avue-input-tree
            v-model="filters.deptId"
            :node-click="getNodeData"
            :dic="treeData"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择部门"
          />
        </el-form-item>
        <el-form-item label="被考核人：" prop="appraiseeManId">
          <el-cascader
            :before-filter="beforeFilter"
            ref="appraiseeManId"
            filterable
            :show-all-levels="false"
            clearable
            :options="empList"
            v-model="filters.appraiseeManId"
            :props="empProps"
          >
            <template slot-scope="{ data }">
              <el-tooltip effect="dark" placement="right" v-if="data.customerNo">
                <div slot="content">{{ data.customerNo }}</div>
                <span>{{ data.label }}</span>
              </el-tooltip>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="待处理人：" prop="waitHandleManId">
          <el-cascader
            :before-filter="beforeFilter"
            ref="waitHandleManId"
            filterable
            :show-all-levels="false"
            clearable
            :options="empList"
            v-model="filters.waitHandleManId"
            :props="empProps"
          >
            <template slot-scope="{ data }">
              <el-tooltip effect="dark" placement="right" v-if="data.customerNo">
                <div slot="content">{{ data.customerNo }}</div>
                <span>{{ data.label }}</span>
              </el-tooltip>
            </template>
          </el-cascader>
        </el-form-item>
        <el-button size="small" type="primary" @click="getFirstAllList()">搜索</el-button>
        <el-button size="small" type="warning" @click="resetForm()">重置</el-button>
      </div>
    </el-form>
    <avue-crud
      ref="crudTable"
      class="batch-choose"
      :data="dataList"
      :table-loading="tableLoading"
      :option="option"
      :page.sync="page"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList"
    >
      <template slot="flowNo" slot-scope="scope">
        <span @click="checkDetail(scope.row)" class="handle-sty">{{
          scope.row.flowNo
        }}</span>
      </template>
      <template slot="appraiseName" slot-scope="scope">
        <el-tooltip
          effect="dark"
          :content="'工号：' + empNo + ' ' + '部门：' + deptName"
          placement="top-start"
        >
          <span @mouseenter="showUserInfo(scope.row.appraiseId)">{{
            scope.row.appraiseName
          }}</span>
        </el-tooltip>
      </template>
      <template slot="handlerNames" slot-scope="scope">
        <div v-if="scope.row.processState == 5">无</div>
        <div v-if="scope.row.processState != 5 && scope.row.handlerNames != null">
          <span v-for="(item, index) in scope.row.handlerNames.split('、')" :key="index">
            <el-tooltip
              effect="dark"
              :content="'工号：' + empNo + ' ' + '部门：' + deptName"
              placement="top-start"
            >
              <span @mouseenter="showUserInfo(scope.row.handlerIds.split(',')[index])">{{
                item
              }}</span>
            </el-tooltip>
            <span v-if="index < scope.row.handlerNames.split('、').length - 1">，</span>
          </span>
        </div>
      </template>
      <template slot="processState" slot-scope="scope">
        <div class="process-contain">
          <span v-if="scope.row.processState == 5" class="done-sty">✔</span>
          <span v-else class="circle-sty"></span>
          <span>{{ scope.row.processState | filterProcessStatus }}</span>
        </div>
      </template>
      <template slot="passTime" slot-scope="scope">
        <span v-if="scope.row.passTime != null && scope.row.passTime != ''">{{
          scope.row.passTime
        }}</span>
        <span v-else>/</span>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" icon="el-icon-view" @click="checkDetail(scope.row)"
          >查看详情</el-button
        >
      </template>
    </avue-crud>
  </basic-container>
</template>
<script>
import { tableOption } from "@/const/crud/processmanage/salaryList";
import { getSalaryList, getSalaryCount } from "@/api/processmanage/salary";
import { getEmpList } from "@/api/clue/clue";
import { fetchNewTree } from "@/api/admin/dept";
import { saveDetal } from "@/util/clearDetail";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  data() {
    return {
      clickStatus: false,
      dataList: [],
      page: {
        total: 3, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
      },
      option: tableOption,
      tableLoading: false,
      empList: [],
      empProps: {
        value: "customerId",
        label: "label",
      },
      treeData: [],
      countInfo: {
        waitEnterCount: 0, // 待录入
        waitAuditCount: 0, // 待审核
      },
      filters: {
        appraisalDate: this.$moment().subtract(1, "month").format("YYYY-MM"), // 考核日期-默认上一个月
        processStatus: null, // 流程待办筛选项
        keyWords: "", // 关键词
        deptId: "", // 部门
        appraiseeManId: "", // 被考核人
        waitHandleManId: "", // 待处理人
      },
    };
  },
  filters: {
    filterProcessStatus(val) {
      return val == 1 ? "待提交审核" : val == 2 ? "待审核" : val == 5 ? "已通过" : "";
    },
  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
      if (keepParams.detail.path !== "") {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
      this.clickStatus = keepParams.clickStatus;
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.keyWords = keepParams.params.keyword;
      this.filters.processStatus = keepParams.params.processState;
      this.filters.deptId = keepParams.params.deptId;
      this.filters.appraisalDate = keepParams.appraisalDate;
      this.filters.appraiseeManId = keepParams.appraiseeManId;
      this.filters.waitHandleManId = keepParams.waitHandleManId;
    }
  },
  methods: {

    changeStatus() {
      this.getAllList();
    },
    // 跳转到薪酬审批详情
    checkDetail(row) {
      console.log(row);
      let path = "/examine-process"; // 路由名称
      let query = {
        id: row.flowId,
        path: this.$route.path,
        source: "list",
      }; // 路由参数
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    getFirstAllList() {
      this.clickStatus = true;
      this.page.currentPage = 1;
      this.getList();
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      let params = {
        keyword: this.clickStatus ? this.filters.keyWords : "", // 关键词
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        assessedDate: this.clickStatus
          ? this.$moment(this.filters.appraisalDate).format("YYYY-MM")
          : this.$moment().subtract(1, "month").format("YYYY-MM"), // 考核月份
        processState: this.filters.processStatus, // 流程状态
        deptId: this.clickStatus ? this.filters.deptId : "", // 部门id
        appraiseId: this.clickStatus
          ? Number(this.filters.appraiseeManId) != 0
            ? this.filters.appraiseeManId[this.filters.appraiseeManId.length - 1]
            : ""
          : "", // 被考核人id
        handlerId: this.clickStatus
          ? Number(this.filters.waitHandleManId) != 0
            ? this.filters.waitHandleManId[this.filters.waitHandleManId.length - 1]
            : ""
          : "", // 待处理人id
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus: this.clickStatus,
        appraisalDate: this.filters.appraisalDate,
        appraiseeManId: this.filters.appraiseeManId,
        waitHandleManId: this.filters.waitHandleManId,
        params: params,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getSalaryList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.dataList = res.data.data.records;
          this.page.total = res.data.data.total;
          this.tableLoading = false;
          this.getCount();
        } else {
          this.tableLoading = false;
        }
      });
    },
    // 获取统计数据
    getCount() {
      let params = {
        assessedDate: this.clickStatus
          ? this.$moment(this.filters.appraisalDate).format("YYYY-MM")
          : this.$moment().subtract(1, "month").format("YYYY-MM"),
      };
      getSalaryCount(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          this.countInfo.waitEnterCount = r.toBeEnterCount;
          this.countInfo.waitAuditCount = r.toBeReviewedCount;
        }
      });
    },
    getNodeData() {},
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
    },
    //显示工号
    async beforeFilter() {
      getEmpList(true).then((res) => {
        this.empList = res.data.data;
      });
      this.$loop(this.empList[0], this.empList[0]);
      return false;
    },
    getDropList() {
      // 获取员工数据
      getEmpList(true).then((res) => {
        this.empList = res.data.data;
      });
      // 获取部门数据
      fetchNewTree({ menuFlag: "emp_list" }).then((response) => {
        this.treeData = response.data.data;
      });
    },
    resetForm() {
      this.filters.appraisalDate = this.$moment().subtract(1, "month").format("YYYY-MM");
      this.filters.processStatus = null;
      this.filters.keyWords = "";
      this.filters.deptId = "";
      this.filters.appraiseeManId = "";
      this.filters.waitHandleManId = "";
      this.clickStatus = false;
      this.getAllList();
    },
  },
  mounted() {
    this.getDropList();
  },
};
</script>

<style scoped>
.radio-item {
  margin-left: 20px;
  border-left: 1px solid #dcdfe6;
}
.long-input {
  width: 240px;
}
.circle-sty {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background: #128ee9;
  margin-right: 4px;
}
.process-contain {
  display: flex;
  justify-content: center;
  align-items: center;
}
.done-sty {
  margin-right: 1px;
}
.handle-sty {
  color: #36a6fe;
  cursor: pointer;
}
.template_sty_box {
  text-align: right;
  -moz-user-select: none; /* Firefox私有属性 */
  -webkit-user-select: none; /* WebKit内核私有属性 */
  -ms-user-select: none; /* IE私有属性(IE10及以后) */
  -khtml-user-select: none; /* Khtml内核私有属性 */
  -o-user-select: none; /* Opera私有属性 */
  user-select: none; /* CSS3属性 */
}
.template_sty_box span {
  margin: 0 0 0 8px;
  color: #128ee9;
}
.prompt_sty {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  color: #fff;
  background-color: rgb(216, 233, 120);
  line-height: 14px;
  text-align: center;
}
.operation {
  margin: 10px;
}
</style>
