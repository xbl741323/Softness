<template>
  <div>
    <basic-container v-if="authority(1)">
      <div v-loading="uploadLoading">
        <el-form
          @keyup.enter.native="getFirstAllList()"
          :model="filters"
          ref="filters"
          class="search"
          inline
          label-width="90"
        >
          <div>
            <el-form-item label="流程待办：" prop="createTime">
              <el-radio-group
                size="medium"
                v-model="filters.processWaitStatus"
                @change="changeStatus()"
              >
                <el-radio-button :label="null">全部</el-radio-button>
                <el-radio-button class="radio-item" :label="1">
                  <span class="circle-sty"></span>
                  <span>待我处理({{ countInfo.waitMeCount }})</span>
                </el-radio-button>
                <el-radio-button class="radio-item" :label="2">
                  <span class="circle-sty"></span>
                  <span>待他人处理({{ countInfo.waitOtherCount }})</span>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="考核日期：" prop="createTime">
              <el-date-picker
                :clearable="false"
                v-model="filters.appraisalDate"
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
            <el-button size="small" type="primary" @click="getFirstAllList()"
              >搜索</el-button
            >
            <el-button size="small" type="warning" @click="resetForm()">重置</el-button>
          </div>
        </el-form>
        <div class="template_sty_box">
          <span @click="downloadTemplateFun()">下载录入模板</span>
          <span @click="authority(3) ? changValueVisible() : $notAuthorized()"
            >批量录入结果值
          </span>
          <el-tooltip
            class="item"
            effect="dark"
            content="批量录入待我处理的审批方案（目前仅支持批量录入行政数据）"
            placement="top"
          >
            <div class="prompt_sty">?</div>
          </el-tooltip>
          <!-- <span @click="authority(4) ? exportFinanceData() : $notAuthorized()"
            >导出财务数据
          </span> -->
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="导出员工应发工资（需注意仅财务审核处理后会有完整数据，方案若未完成处理，导出的数据可能不正确）"
            placement="top"
          >
            <div class="prompt_sty">?</div>
          </el-tooltip> -->
        </div>
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
            <span
              @click="authority(2) ? checkDetail(scope.row) : $notAuthorized()"
              class="handle-sty"
              >{{ scope.row.flowNo }}</span
            >
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
              <span
                v-for="(item, index) in scope.row.handlerNames.split('、')"
                :key="index"
              >
                <el-tooltip
                  effect="dark"
                  :content="'工号：' + empNo + ' ' + '部门：' + deptName"
                  placement="top-start"
                >
                  <span
                    @mouseenter="showUserInfo(scope.row.handlerIds.split(',')[index])"
                    >{{ item }}</span
                  >
                </el-tooltip>
                <span v-if="index < scope.row.handlerNames.split('、').length - 1"
                  >，</span
                >
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
            <el-button
              type="text"
              icon="el-icon-view"
              @click="authority(2) ? checkDetail(scope.row) : $notAuthorized()"
              >查看详情
            </el-button>
          </template>
        </avue-crud>
      </div>
      <el-dialog
        title="批量录入结果值"
        :visible.sync="inputValueVisible"
        :close-on-click-modal="false"
        width="40%"
        :before-close="handleClose"
      >
        <div>
          <span>导入成功后，是否将对应的流程中方案状态更改为"完成录入"</span>
          <span class="complete_the_entry">（完成录入后结果值将无法修改）</span>
          <div class="operation">
            <el-radio v-model="radio" label="1">是</el-radio>
            <el-radio v-model="radio" label="0">否</el-radio>
          </div>
          <div class="file_upload">
            <file-upload
              ref="upload"
              :limit="1"
              :acceptType="'.xlsx,.xls'"
              :fileSize="5"
              :multipleFile="false"
              :wordLimit="100"
              class="upload-file"
              @fileList="getFileList"
              :contractFile="templateFile"
              :status="templateStatus"
              v-model="templateForm.file"
            />
          </div>
          <p class="complete_the_entry">
            只允许上传一份文件,格式为xlsx,xls,文件大小不超过5M
          </p>
          <div class="dialog-footer">
            <span slot="footer">
              <el-button @click="handleClose()">取 消</el-button>
              <el-button type="primary" @click="inputValueFun()">确 定</el-button>
            </span>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="callbackVisible"
        width="30%"
        :before-close="callbackVisibleFun"
      >
        <template #title>
          <div class="callback_icon_sty">
            <img src="../../assets/images/icons/duihao.png" alt="" />
            <div>数据导入完成</div>
          </div>
        </template>
        <div class="callback_txt_sty">数据已导入完成，可下载返回表格查看具体导入结果</div>
        <div class="callback_xls_sty" @click="downloadReturnForm()">
          <span>下载返回表格</span>
        </div>
      </el-dialog>
    </basic-container>
    <div v-else class="no-authority">
      <img :src="require('@/assets/images/common/no-authority.svg')" alt="" />
      <p>抱歉！暂无权限查看薪酬审批</p>
    </div>
  </div>
</template>
<script>
import { saveAs } from "file-saver";
import fileUpload from "@/components/file/file-upload.vue";
import { personalOption } from "@/const/crud/processmanage/salaryList";
import { getMySalaryList, getMySalaryCount } from "@/api/processmanage/salary";
import {
  downloadTemplate,
  // exportFinancialData,
  batchImportIndex,
  indexImportGetResult,
} from "@/api/processmanage/salary";
import { getEmpList } from "@/api/clue/clue";
import { fetchNewTree } from "@/api/admin/dept";
import { saveDetal } from "@/util/clearDetail";
import * as CodeMsg from "@/api/common/CodeChange";
import { mapGetters } from "vuex";
export default {
  components: {
    fileUpload,
  },
  props: {
    refundFrom: {
      type: String,
    },
  },
  data() {
    return {
      uploadLoading: false,
      indexImportNumber: null,
      // 定义轮询间隔时间（单位：毫秒）
      intervalTime: 1000,
      xlsUrl: process.env.VUE_APP_IMAGE_BASEURL,
      upDateCallbackInfo: {},
      callbackVisible: false,
      templateForm: {},
      templateFile: [],
      templateStatus: false,
      uploading: true,
      radio: "1",
      inputValueVisible: false,
      clickStatus: false,
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
      },
      option: personalOption,
      tableLoading: false,
      empList: [],
      empProps: {
        value: "customerId",
        label: "label",
      },
      treeData: [],
      countInfo: {
        waitMeCount: 0, // 待我处理
        waitOtherCount: 0, // 待他人处理
      },
      filters: {
        appraisalDate: this.$moment().subtract(1, "month").format("YYYY-MM"), // 考核日期-默认上一个月
        processWaitStatus: null, // 流程待办筛选项
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
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}+salary`)) {
      let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}+salary`));
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
      this.filters.processWaitStatus = keepParams.params.handlerState;
      this.filters.deptId = keepParams.params.deptId;
      this.filters.appraisalDate = keepParams.appraisalDate;
      this.filters.appraiseeManId = keepParams.appraiseeManId;
      this.filters.waitHandleManId = keepParams.waitHandleManId;
    }
  },
  methods: {
    /***
     *  薪酬流转-我的         bt_salary_audit_my_flag
        薪酬审批列表-我的     bt_page_salary_my
        薪酬审批详情-我的     bt_get_salary_my
        批量录入结果值-我的   bt_batch_result_salary_my
        导出财务数据-我的     bt_export_financial_salary_my
     *  @param type 1 列表 2 详情 3 批量录入结果值-我的 4导出财务数据-我的
     *
     * **/
    authority(type) {
      const permissionMap = {
        1: "bt_page_salary_my",
        2: "bt_get_salary_my",
        3: "bt_batch_result_salary_my",
        4: "bt_export_financial_salary_my",
      };
      const permissionName = permissionMap[type];
      return permissionName ? this.permissions[permissionName] : false;
    },
    getFileList(val) {
      //获取上传的文件
      this.$set(this.templateForm, "file", val[0] || false);
    },
    // 下载录入模板
    downloadTemplateFun() {
      downloadTemplate()
        .then((res) => {
          const fileName = decodeURI(
            res.headers["content-disposition"].replace("attachment;filename*=utf-8''", "")
          );
          const blob = new Blob([res.data], {
            type: res.headers["content-type"],
          });
          saveAs(blob, fileName);
        })
        .catch((error) => {});
    },
    // 批量录入结果值
    async inputValueFun() {
      try {
        if (!this.templateForm.file) {
          this.$message({
            type: "warning",
            message: "添加文件",
          });
        } else {
          let formData = new FormData();
          formData.append("file", this.templateForm.file.raw);
          formData.append("changeStatus", Number(this.radio));
          let res = await batchImportIndex(formData);
          if (res.data.code == CodeMsg.CODE_0) {
            this.indexImportNumber = res.data.data;
            this.inputValueVisible = false;
            this.uploadLoading = true;
            this.radio = "1";
            this.$refs.upload.handleAllRemove();
            this.pollIndexImportResult();
          }
        }
      } catch (error) {
        this.uploadLoading = false;
        this.$message({
          type: "warning",
          message: error.message || "请求失败",
        });
      }
    },
    async pollIndexImportResult() {
      const params = { number: this.indexImportNumber };
      try {
        const response = await indexImportGetResult(params);
        if (response.data.code == CodeMsg.CODE_0) {
          const { status, remark } = response.data.data;
          switch (status) {
            case 0:
            case 1:
              setTimeout(() => {
                this.pollIndexImportResult();
              }, this.intervalTime);
              break;
            case 2:
              // 导入成功，显示提示框，停止轮询
              this.upDateCallbackInfo = response.data.data;
              this.callbackVisible = true;
              this.uploadLoading = false;
              break;
            case -1:
              // 导入失败，显示提示框，停止轮询
              this.uploadLoading = false;
              this.$message({
                type: "warning",
                message: remark,
              });
              break;
          }
        }
      } catch (error) {
        this.uploadLoading = false;
        this.$message({
          type: "warning",
          message: error.message || "请求失败",
        });
      }
    },
    handleClose() {
      if (!this.uploadLoading) {
        this.$refs.upload.handleAllRemove();
        this.inputValueVisible = false;
      }
    },
    callbackVisibleFun() {
      this.callbackVisible = false;
    },
    // 批量录入结果值 下载返回表格
    downloadReturnForm() {
      window.open(this.xlsUrl + this.upDateCallbackInfo.ossUrl, "_self");
      this.callbackVisible = false;
    },
    changValueVisible() {
      this.inputValueVisible = true;
    },
    // 导出财务数据
    // exportFinanceData() {
    //   let params = {
    //     month: this.clickStatus
    //       ? this.$moment(this.filters.appraisalDate).format("YYYY-MM")
    //       : this.$moment().subtract(1, "month").format("YYYY-MM"),
    //   };
    //   exportFinancialData(params)
    //     .then((res) => {
    //       const fileName = decodeURI(
    //         res.headers["content-disposition"].replace("attachment;filename*=utf-8''", "")
    //       );
    //       const blob = new Blob([res.data], {
    //         type: res.headers["content-type"],
    //       });
    //       saveAs(blob, fileName);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    changeStatus() {
      this.getAllList();
    },
    checkDetail(row) {
      let path = "/examine-process"; // 路由名称
      let query = {
        id: row.flowId,
        path: this.$route.path,
        source: "personal",
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
        handlerState: this.filters.processWaitStatus, // 流程状态
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
      sessionStorage.setItem(`${this.$route.path}+salary`, JSON.stringify(keepParams));
      getMySalaryList(params).then((res) => {
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
      getMySalaryCount(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          this.countInfo.waitMeCount = r.toBeHandledByMeCount;
          this.countInfo.waitOtherCount = r.toBeHandledByOthersCount;
        }
      });
    },
    resetForm() {
      this.filters.appraisalDate = this.$moment().subtract(1, "month").format("YYYY-MM");
      this.filters.processWaitStatus = null;
      this.filters.keyWords = "";
      this.filters.deptId = "";
      this.filters.appraiseeManId = "";
      this.filters.waitHandleManId = "";
      this.clickStatus = false;
      this.getAllList();
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
.circle-sty {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background: #128ee9;
  margin-right: 5px;
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
  cursor: pointer;
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
.callback_xls_sty {
  text-align: right;
  color: #128ee9;
  cursor: pointer;
}
.callback_icon_sty {
  display: flex;
  justify-content: center;
  align-items: center;
}
.callback_icon_sty img {
  width: 20px;
  margin-right: 10px;
}
.callback_txt_sty {
  text-align: center;
  -moz-user-select: none; /* Firefox私有属性 */
  -webkit-user-select: none; /* WebKit内核私有属性 */
  -ms-user-select: none; /* IE私有属性(IE10及以后) */
  -khtml-user-select: none; /* Khtml内核私有属性 */
  -o-user-select: none; /* Opera私有属性 */
  user-select: none; /* CSS3属性 */
}
.dialog-footer {
  text-align: right !important;
}
.complete_the_entry {
  color: rgba(0, 0, 0, 0.44);
}
.file_upload {
  display: inline-block;
}
</style>
