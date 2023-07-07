<template>
  <basic-container>
    <div class="marg" v-if="filterStatus(permissions, 3)">
      <el-form
        class="form-indus"
        inline
        :model="filters"
        ref="filters"
        label-width="90px"
        @submit.native.prevent
      >
        <div class="indus-flex-sty">
          <div>
            <el-form-item
              label="关键字："
              prop="keywords"
              label-width="70px"
              style="margin-right: -10px"
            >
              <el-input
                v-model.trim="filters.keywords"
                placeholder="请输入 用户ID/账户名/问题标题"
                @keyup.enter.native="getFirstAllList()"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 10px" label="显示状态：" aria-placeholder>
              <el-select v-model="filters.showStatus">
                <el-option label="全部" :value="null"></el-option>
                <el-option label="显示" :value="0"></el-option>
                <el-option label="用户已删除" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间：" prop="publishTime">
              <el-date-picker
                v-model="filters.publishTime"
                :unlink-panels="true"
                style="width: 310px"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="getFirstAllList()">{{
              $t("button.search")
            }}</el-button>
            <el-button icon="el-icon-refresh-left" @click="resetForm('filters')">{{
              $t("button.reset")
            }}</el-button>
            <!-- <el-button @click="syncMapping(1)">syncMapping</el-button>
            <el-button @click="syncMapping(2)">syncData</el-button> -->
          </div>
        </div>
      </el-form>
      <div>
        <avue-crud
          class="batch-choose"
          ref="crud"
          :table-loading="tableLoading"
          :page.sync="page"
          :data="tableData"
          :option="tableOption"
          @selection-change="selectionChange"
          @on-load="getList"
          @size-change="sizeChange"
        >
          <template slot="deleted" slot-scope="scope">
            <span>{{ scope.row.deleted | filterDeleted }}</span>
          </template>
          <template slot="title" slot-scope="scope">
            <span
              @click="
                filterStatus(permissions, 1)
                  ? goViewDetails(scope.row, 1)
                  : $notAuthorized()
              "
              style="color: #409eff; cursor: pointer"
              >{{ scope.row.title }}</span
            >
          </template>
          <template slot="menu" slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="
                filterStatus(permissions, 1)
                  ? goViewDetails(scope.row, 1)
                  : $notAuthorized()
              "
              >查看</el-button
            >
            <el-button
              v-if="scope.row.deleted == 0"
              type="text"
              size="small"
              @click="
                filterStatus(permissions, 2) && filterStatus(permissions, 1)
                  ? goViewDetails(scope.row, 2)
                  : $notAuthorized()
              "
              >回复</el-button
            >
            <el-button
              v-if="!routeBool"
              type="text"
              size="small"
              @click="
                permissions.bt_deleteQuestion
                  ? removerItemFn(scope.row)
                  : $notAuthorized()
              "
              >删除</el-button
            >
          </template>
        </avue-crud>
        <el-dialog
          title="删除"
          :visible.sync="removerDialog"
          width="30%"
          :before-close="handleClose"
        >
          <span v-if="removeData"
            >确认删除"{{ removeData.title }}"吗?删除后,客户端同步删除。</span
          >
          <span slot="footer" class="dialog-footer">
            <el-button @click="removerDialog = false">取 消</el-button>
            <el-button type="primary" @click="deleteQuestion()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </basic-container>
</template>
<script>
import { tableOption } from "@/const/crud/policy/issue.js";
import * as CodeMsg from "@/api/common/CodeChange";
import {
  getQuestionList,
  deleteQuestion,
  // syncMapping
} from "@/api/personal/my-answer.js";
import { saveDetal } from "@/util/clearDetail";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tableOption: tableOption,
      tableLoading: false,
      policyDelete: false,
      statusInfo: {
        filterStatus: "",
      },
      tableData: [],
      filters: {
        publishMan: "",
        keywords: "",
        publishTime: [],
        showStatus: null,
      },
      showStatusData: [
        { value: 0, label: "全部" },
        { value: 1, label: "显示" },
        { value: 2, label: "用户已删除" },
      ],
      routeBool: this.$route.path.includes("/personal/myPublish"),
      // page: {
      //   total: 0, // 总页数
      //   layout: "total,prev,pager,next, jumper",
      //   pageSize: 20,
      //   background: true,
      //   pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
      //   currentPage: 1, // 当前页数
      // },
      page: {
        total: 0, // 总页数
        layout: "total, sizes, prev, pager, next, jumper",
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
      },
      removerDialog: false,
      removeData: null,
    };
  },
  filters: {
    filterDeleted(val) {
      return val == 0 ? "显示" : "用户已删除";
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    if (!this.filterStatus(this.permissions, 3)) {
      this.$notAuthorized();
      return;
    }
    if (sessionStorage.getItem(`${this.$route.path}` + "+issue")) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}` + "+issue")
      );
      if (keepParams.detail.path !== "") {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
      this.filters.keywords = keepParams.params.keyWord;
      this.filters.showStatus = keepParams.params.deleted;
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.publishTime = keepParams.publishTime;
    }
  },
  methods: {
    // syncMapping(num){
    //   syncMapping(num).then(res=>{
    //       if (res.data.code == CodeMsg.CODE_0) {
    //       this.$message({
    //       type: "success",
    //       message: "成功",
    //       duration: 2000,
    //     });
    //     }
    //  })
    // },
    /***
     * @param filterType 1 查看  2 回复 3列表
     * **/
    filterStatus(state, filterType) {
      if (filterType == 1) {
        return this.routeBool ? state.bt_getMyById : state.bt_getById;
      } else if (filterType == 2) {
        return this.routeBool ? state.bt_saveMyAnswer : state.bt_saveAnswer;
      } else if (filterType == 3) {
        return this.routeBool ? state.bt_pageJoinQuestion : state.bt_pageQuestion;
      }
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getList();
    },
    handleClose(done) {
      this.removerDialog = false;
    },
    removerItemFn(row) {
      this.removeData = row;
      this.removerDialog = true;
    },
    deleteQuestion() {
      let data = {
        id: this.removeData.id,
      };
      deleteQuestion(data).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功",
            duration: 2000,
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
        this.removerDialog = false;
      });
    },
    goViewDetails(row, e) {
      let path = "/issue-detail";
      let query = {
        type: e,
        number: row.id,
        source: this.routeBool ? "myPublish" : "policy",
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    getFirstAllList() {
      this.page.pageSize = 20;
      this.page.currentPage = 1;
      this.getList();
    },
    selectionChange(val) {
      this.batchList = [];
      this.batchVal = [];
      this.batchVal = val;
      this.policyDelete = false;
      for (let i = 0; i < this.batchVal.length; i++) {
        this.batchList.push(this.batchVal[i].industryNo);
        if (this.batchVal[i].policyStatus == 0) {
          this.policyDelete = true;
        }
      }
    },
    getList() {
      this.tableLoading = true;
      let params = {
        keyWord: this.filters.keywords,
        deleted: this.filters.showStatus,
        pageSize: this.page.pageSize,
        pageNo: this.page.currentPage,
        startTime:
          this.filters.publishTime[0] != null
            ? this.$moment(this.filters.publishTime[0]).format("YYYY-MM-DD HH:mm:ss")
            : "",
        endTime:
          this.filters.publishTime[1] != null
            ? this.$moment(this.filters.publishTime[1]).format("YYYY-MM-DD HH:mm:ss")
            : "",
      };
      // 需要缓存的参数
      let keepParams = {
        params: params,
        publishTime: this.filters.publishTime,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(
        `${this.$route.path}` + "+issue",
        JSON.stringify(keepParams)
      );
      getQuestionList(params, this.routeBool).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
          this.tableLoading = false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.filters.keywords = "";
      this.filters.showStatus = null;
      this.filters.publishTime = [];
      this.getFirstAllList();
    },
  },
};
</script>

<style>
.filter_punt {
  margin: 5px 0px 15px 0px;
}
.filter_province {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  margin-left: 8px;
}
.province_parent_indu {
  margin-left: -4px;
  display: flex;
  align-items: center;
}
.industry_province_child {
  margin-left: 38px;
}
.radio_item:nth-of-type(1) {
  border-left: none;
}
.radio_item {
  margin-right: 10px;
  margin-top: 10px;
  border-left: 1px solid #dcdfe6;
  border-radius: 0px 0px 0px 0px;
}
.area-sty {
  font-size: 14px;
  color: #606266;
}
.senior-sty-indu {
  margin-left: 2px;
}
.batch-handle-indu {
  margin: 10px 2px 12px 2px;
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
.success {
  font-weight: bolder;
  font-size: 12px;
  float: left;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
.circleRed {
  background: red;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
.radio-sty {
  margin-left: 20px;
}
.filter-Status {
  margin: 0 0 -10px -22px;
}
.form-indus {
  margin-bottom: -10px;
}
.industry-over-sty-flex {
  display: block;
  width: 107px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.industry-class-sty {
  width: 250px;
}
.indus-flex-sty {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.audit-status {
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-right: 4px;
  background: #fff;
  border-radius: 10px;
}
.audit-status-blue {
  background: #36a6fe;
  border-radius: 10px;
}
.audit-status-orange {
  background: orange;
  border-radius: 10px;
}
.audit-status-red {
  background: red;
  border-radius: 10px;
}
.audit-status-font-green {
  color: green;
  font-weight: bold;
  margin-right: 2px;
}
.policy-status-sty {
  display: flex;
  justify-content: center;
  align-items: center;
}
.marg {
  padding: 10px 20px;
}
</style>
