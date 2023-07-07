<template>
  <basic-container>
    <div
      v-if="
        permissions.sys_contract_detail ||
          permissions.sys_contract_audit ||
          this.$route.path.includes('personal')
      "
    >
      <!-- 合同审批 -->
      <el-form
        :model="processlistForm"
        ref="processlistForm"
        class="search"
        inline
        label-width="90"
        @keyup.enter.native="handleSearch"
      >
        <div>
          <el-form-item :label="$t('label.processState')" prop="state">
            <el-radio-group
              size="medium"
              v-model="processlistForm.flowStatus"
              @change="stateChange"
            >
              <!--     v-if="stateList.length > 0" -->
              <el-radio-button :label="null" class="state-right"
                >全部</el-radio-button
              >
              <el-radio-button :label="1" class="state-right radio-sty-left"
                >待审核
                <!--  -->
                <span class="circleBlue"> </span>
                <span>({{ changeState.waitAuditCount }})</span></el-radio-button
              >
              <el-radio-button :label="3" class="state-right radio-sty-left"
                >未通过 <span class="circlecloor"> </span
                ><span>({{ changeState.notPassCount }})</span></el-radio-button
              >
              <el-radio-button :label="2" class="state-right radio-sty-left"
                >已通过
                <span class="success"><b>✔</b></span>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <!-- 关键字 -->
          <el-form-item :label="$t('label.processkey')" prop="keyWords">
            <el-input
              style="width: 380px"
              placeholder="请输入流程编号、订单编号或客户名称"
              class="keyword"
              v-model.trim="processlistForm.keyWords"
            ></el-input>
          </el-form-item>
          <!-- 订单类型 -->
          <el-form-item label="订单类型：" aria-placeholder>
            <el-select v-model="processlistForm.isDisabled">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="产品订单" :value="1"></el-option>
              <el-option label="课程订单" :value="2"></el-option>
              <el-option label="课堂会员订单" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <!-- 发起人 -->
          <el-form-item :label="$t('label.sponsor')" prop="sponsor">
            <el-cascader
              style="width: 110px"
              :show-all-levels="false"
              :key="isResouceShow"
              filterable
              clearable
              :before-filter="beforeFilter"
              ref="sponsorDom"
              :options="sponsorList"
              v-model="processlistForm.sponsor"
              @change="sponsorChange"
              :props="{ value: 'customerId', label: 'label' }"
            >
              <template slot-scope="{data}">
                <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                  <div slot="content">{{data.customerNo}}</div>
                  <span>{{data.label}}</span>
                </el-tooltip>
              </template>
            </el-cascader>
          </el-form-item>
          <!-- 待处理人 -->
          <el-form-item :label="$t('label.pendperson')" prop="pendperson">
            <el-cascader
              style="width: 110px"
              :show-all-levels="false"
              :key="isResouceShow"
              filterable
              clearable
              :before-filter="beforeFilter1"
              ref="pendpersonDom"
              :options="pendpersonList"
              v-model="processlistForm.pendperson"
              @change="pendpersonChange"
              :props="{ value: 'customerId', label: 'label' }"
            >
              <template slot-scope="{data}">
                <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                  <div slot="content">{{data.customerNo}}</div>
                  <span>{{data.label}}</span>
                </el-tooltip>
              </template>
            </el-cascader>
          </el-form-item>
          <!-- 搜索 -->
          <el-button size="small" type="primary" @click="handleSearch">{{
            $t("button.search")
          }}</el-button>
          <!-- 重置 -->
          <el-button
            size="small"
            type="warning"
            @click="reset('processlistForm')"
            >{{ $t("button.reset") }}</el-button
          >
        </div>
      </el-form>
      <!-- 流程列表 -->
      <avue-crud
        v-loading="loading"
        ref="crud"
        class="batch-choose"
        :data="tableData"
        :option="listOption"
        :page.sync="page"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <!-- 流程编号 -->
        <template slot="flowNo" slot-scope="scope">
          <span
            style="cursor: pointer;color: #409EFF;"
            @click="showDetail(scope.row)"
          >
            {{ scope.row.flowNo }}
          </span>
        </template>
        <!-- 发起人 -->
        <template slot="createByName" slot-scope="scope">
          <span style="cursor: pointer">
            <el-tooltip
              effect="dark"
              :content="'工号：' + cEmpNo + '   部门：' + cDeptName"
              placement="top"
            >
              <span @mouseover="showUserInfo(scope.row.createBy)">{{
                scope.row.createByName
              }}</span>
            </el-tooltip>
          </span>
        </template>
        <template slot-scope="scope" slot="orderType">
          <span v-if="scope.row.orderType === 1" style="cursor: pointer;"
            >产品</span
          >
          <span v-if="scope.row.orderType === 2" style="cursor: pointer;"
            >课程</span
          >
          <span v-if="scope.row.orderType === 3" style="cursor: pointer;"
            >课堂会员</span
          >
        </template>

        <!-- 待处理人 -->
        <template slot="handleByName" slot-scope="scope">
          <span style="cursor: pointer" v-if="scope.row.flowStatus == 1">
            <el-tooltip
              effect="dark"
              v-if="scope.row.handleBy"
              :content="'工号：' + cEmpNo + '   部门：' + cDeptName"
              placement="top"
            >
              <span @mouseover="showUserInfo(scope.row.handleBy)">{{
                scope.row.handleByName
              }}</span>
            </el-tooltip>
          </span>
          <span v-else>无</span>
        </template>
        <!-- 流程状态 -->
        <template slot="flowStatus" slot-scope="scope">
          <span v-show="scope.row.flowStatus == 1" class="circleBluec"></span>
          <span v-show="scope.row.flowStatus == 2" class="successc"
            ><b>✔</b></span
          >
          <span v-show="scope.row.flowStatus == 3" class="circleRedc"></span>
          <span>{{ scope.row.flowStatus | filterStatus }} </span>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-view"
            @click="showDetail(scope.row)"
            >{{ $t("button.godetail") }}</el-button
          >
        </template>
      </avue-crud>
    </div>
  </basic-container>
</template>

<script>
import { getChangeMyList, getByMyStatus } from "@/api/personal/myprocess";
import { getEmpList } from "@/api/clue/clue";
import { listAlterOption } from "@/const/crud/processmanage/list";
import { getEmpInfo } from "@/api/project/wtClass";
import { mapGetters } from "vuex";
import { number } from 'mathjs';

export default {
  props: {
    refundFrom: {
      //我的流程有值 否则无值
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      stateList: [],
      selectList: [],
      isResouceShow: 0,
      baseUrl: process.env.BASE_URL,
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        pageSize: 20
      },
      listOption: listAlterOption,
      tableData: [],
      sponsorList: [],
      pendpersonList: [],
      processlistForm: {
        isDisabled: null, // 课程类型
        flowStatus: 1,
        keyWords: "", // 关键字
        sponsor: null,
        pendperson: null
      },
      sponsorNo: "",
      pendpersonNo: "",
      cEmpNo: "",
      cDeptName: "",
      changeState: {}
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  filters: {
    filterResult(val) {
      if (val == "0") {
        return "待处理";
      } else if (val == "1") {
        return "已完结";
      } else if (val == "2") {
        return "已完结";
      }
    },
    filterStatus(val) {
      if (val == 1) {
        return "待审核";
      } else if (val == 2) {
        return "已通过";
      } else if (val == 3) {
        return "未通过";
      }
    }
  },
  created() {
    if (
      !this.permissions.sys_contract_detail &&
      !this.permissions.sys_contract_audit &&
      !this.$route.path.includes("personal")
    )
      this.$notAuthorized();
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      if (keepParams.detail.path !== "") {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query
        });
        return;
      }
      this.processlistForm = keepParams.params;
      this.page = keepParams.page;
    }
    // 获取改价状态
    this.getByMyStatus();
  },
  mounted() {
    this.getData();
    this.getprocessList();
  },
  methods: {
    //显示工号
    async beforeFilter() {
      getEmpList(true).then(res => {
        this.sponsorList = res.data.data;
      });
      this.$loop(this.sponsorList[0], this.sponsorList[0])
      return false
    },
    //显示工号
    async beforeFilter1() {
      getEmpList(true).then(res => {
        this.pendpersonList = res.data.data;
      });
      this.$loop(this.pendpersonList[0], this.pendpersonList[0])
      return false
    },
    // 获取改价状态
    getByMyStatus() {
      getByMyStatus().then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.changeState = res.data.data;
          this.$emit("update:numberParent", Number(res.data.data.waitAuditCount+res.data.data.notPassCount));
        }
      });
    },
    // 获取员工信息
    showUserInfo(id) {
      getEmpInfo(id).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.cEmpNo = res.data.data.number;
          this.cDeptName = res.data.data.deptName;
        }
      });
    },
    getData() {
      if (this.refundFrom || this.$route.path == "/personal/my-process") {
        this.processlistForm.flowStatus = 1;
      }
      getEmpList(true).then(res => {
        let data = res.data.data;
        this.sponsorList = data;
        this.pendpersonList = data;
      });
    },
    //获取合同审批列表
    getprocessList() {
      // this.loading = true
      this.getList();
      var createBy = JSON.parse(JSON.stringify(this.processlistForm.sponsor));
      var handlerId = JSON.parse(
        JSON.stringify(this.processlistForm.pendperson)
      );
      if (createBy != null) {
        createBy = createBy[createBy.length - 1];
      }
      if (handlerId != null) {
        handlerId = handlerId[handlerId.length - 1];
      }
      var params = {
        keyWord: this.processlistForm.keyWords, //关键字
        flowStatus: this.processlistForm.flowStatus, //流程状态
        createBy: createBy != null ? createBy : null, //发起人
        handleBy: handlerId != null ? handlerId : null, //待处理人
        orderType: this.processlistForm.isDisabled, // 课程类型
        pageSize: this.page.pageSize,
        pageNo: this.page.currentPage
      };
      getChangeMyList(params, this.refundFrom).then(res => {
        if (res.data.code == 0) {
          this.loading = false;
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
        }
      });
    },
    // 缓存数据
    getList() {
      let params = {
        flowStatus: this.processlistForm.flowStatus,
        sponsor: this.processlistForm.sponsor,
        pendperson: this.processlistForm.pendperson,
        isDisabled: this.processlistForm.isDisabled,
        pageSize: this.page.pageSize,
        pageNo: this.page.currentPage
      };
      let keepParams = {
        params: params,
        detail: { path: "", query: {} },
        changeType: this.changeType
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
    },

    // 状态栏切换
    stateChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = 20;
      this.getprocessList();
    },
    sponsorChange(val) {
      ++this.isResouceShow;
      this.$nextTick(() => {
        this.sponsorNo = this.$refs[
          "sponsorDom"
        ].getCheckedNodes()[0].data.customerId;
      });
    },
    pendpersonChange(val) {
      ++this.isResouceShow;
      this.$nextTick(() => {
        this.pendpersonNo = this.$refs[
          "pendpersonDom"
        ].getCheckedNodes()[0].data.customerId;
      });
    },
    //重置
    reset(formName) {
      ++this.isResouceShow;
      this.$refs[formName].resetFields();
      this.processlistForm.flowStatus = 1;
      this.processlistForm.keyWords = ""; // 关键字
      this.sponsorNo = "";
      this.pendpersonNo = "";
      this.processlistForm.sponsor = null;
      this.processlistForm.pendperson = null;
      this.processlistForm.isDisabled = null;
      if (sessionStorage.getItem(`${this.$route.path}special`)) {
        sessionStorage.removeItem(`${this.$route.path}special`);
      }
      this.getprocessList();
    },
    // 查看详情
    showDetail(row) {
      this.$router.push({
        path: "/contracts-changePricelistdetail",
        query: {
          id: row.id,
          flowNo: row.flowNo,
          source: this.$route.path.includes("personal")
            ? "personal"
            : "contracts"
        }
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getprocessList();
    },
    // 搜索
    handleSearch() {
      sessionStorage.setItem(
        `${this.$route.path}special`,
        JSON.stringify(this.processlistForm)
      );
      this.getprocessList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getprocessList();
    }
  }
};
</script>

<style scoped>
.text {
  overflow: hidden;
  white-space: nowrap;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.orderMsg {
  display: flex;
  flex-direction: column;
}
.orangeName {
  color: #e6a23c;
}
.senior {
  margin: 10px 0px;
}
.search {
  margin: 0 0 0 0;
}
.radio-sty {
  margin-left: 20px;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
.cell-blue {
  color: #36a6fe;
  cursor: pointer;
}
.list-btn {
  padding: 8px 20px;
  margin: 0 5px;
  border: 1px solid #eee;
  border-radius: 5px;
  cursor: pointer;
}
.activebtn {
  background: #36a6fe;
  border-radius: 5px;
  border: 0;
  color: #fff;
}
.circleBlue {
  width: 6px;
  height: 6px;
  float: left;
  border-radius: 50%;
  background: #36a6fe;
  margin-top: 4px;
  margin-right: 7px;
}
.circlecloor {
  width: 6px;
  height: 6px;
  float: left;
  border-radius: 50%;
  background: red;
  margin-top: 4px;
  margin-right: 7px;
}
.circleBluec {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 7px;
}
.circleRed {
  background: red;
}
.circleRedc {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 7px;
  background: red;
}
.success {
  font-weight: bolder;
  font-size: 12px;
  float: left;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
.successc {
  font-weight: bolder;
  font-size: 12px;
  color: green;
  margin-right: 6px;
}
.pagination {
  float: right;
}
.keyword {
  width: 350px;
}
.state-right {
  margin-right: 20px;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
</style>
