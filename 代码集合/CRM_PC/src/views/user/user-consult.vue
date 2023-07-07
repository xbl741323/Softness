<template>
<!-- 排查完成 -->
  <basic-container>
    <div class="user_consult">
      <el-form
        inline
        ref="consultForm"
        :model="consultForm"
        @submit.native.prevent
        @keyup.enter.native="searchList()"
      >
        <div>
          <el-form-item label="回复状态:" prop="replyStatus">
            <el-radio-group
              size="medium"
              v-model="consultForm.replyStatus"
              @change="searchList()"
            >
              <el-radio-button class="state-right" :label="null"
                >全部</el-radio-button
              >
              <el-radio-button class="state-right radio-sty-left" :label="0">
                <span class="circleBlue"></span>
                待回复
                <span>({{ consultCount }})</span>
              </el-radio-button>
              <el-radio-button class="state-right radio-sty-left" :label="1">
                <span class="success"><b>✔</b></span
                >已回复
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="关键字：" prop="keyWords">
          <el-input
            v-model.trim="consultForm.keyWords"
            placeholder="请输入手机号或公司名称关键字"
            class="key"
          />
        </el-form-item>
        <el-form-item label="客服：" prop="service">
          <el-cascader
            :show-all-levels="false"
            filterable
            v-model="consultForm.service"
            :options="serviceList"
            :props="{ value: 'customerId', label: 'label' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="来源：" prop="source">
          <el-select v-model="consultForm.source">
            <el-option
              v-for="item in sourceList"
              :key="item.label"
              :label="item.value"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="咨询时间：" prop="createTime">
          <el-date-picker
            v-model="consultForm.createTime"
            type="datetimerange"
            :picker-options="expireTimeOption"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-button size="mini" type="primary" @click="searchList()"
          >搜索</el-button
        >
        <el-button size="mini" type="warning" @click="reset()">重置</el-button>
      </el-form>
      <div class="batch-handle">
        <el-button
          type="primary"
          :disabled="batchList.length == 0"
          @click="allotCustomer('batch')"
          >分配客服</el-button
        >
      </div>
      <avue-crud
        ref="crud"
        @selection-change="selectionChange"
        class="batch-choose"
        :page.sync="page"
        :data="tableData"
        :option="tableOption"
        @size-change="sizeChange"
        @current-change="currentChange"
        @on-load="getConsultList"
      >
        <template slot="replyRecord" slot-scope="scope">
          <p class="margin0-p">{{ scope.row.replyRecord }}</p>
        </template>
        <template slot="companyName" slot-scope="scope">
          <p v-if="scope.row.companyName">{{ scope.row.companyName }}</p>
          <p v-else>/</p>
        </template>
        <template slot="username" slot-scope="scope">
          <p v-if="scope.row.username">{{ scope.row.username }}</p>
          <p v-else>/</p>
        </template>
        <template slot="replyTime" slot-scope="scope">
          <p v-if="scope.row.state == '1'">{{ scope.row.replyTime }}</p>
          <p v-else><span class="circle"></span>待回复</p>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="scope.row.state == '0'"
            @click="handleListReply(scope.row, 'reply')"
            >回复记录</el-button
          >
          <el-button
            type="text"
            size="small"
            v-if="scope.row.state == '1'"
            @click="handleListReply(scope.row, 'edit')"
            >编辑回复</el-button
          >
          <el-button
            type="text"
            size="small"
            v-if="scope.row.state == '0'"
            @click="rowAllot(scope.row, 'rowAllot')"
            >分配</el-button
          >
        </template>
      </avue-crud>
      <!-- 弹框组件 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="pageDialog"
        :close-on-click-modal="false"
        width="30%"
      >
        <!-- 回复记录弹框 -->
        <div
          class="reply-info"
          v-if="dialogPosition == 'reply' || dialogPosition == 'edit'"
        >
          <p>
            <b>手机号码：</b><span>{{ dialogForm.phoneNumber }}</span>
          </p>
          <p>
            <b>公司名称：</b><span>{{ dialogForm.companyName }}</span>
          </p>
          <p>
            <b>来 源：</b><span>{{ dialogForm.origin }}</span>
          </p>
          <p class="reply-box"><span class="must-symbol">*</span>回复记录：</p>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            maxlength="100"
            show-word-limit
            v-model.trim="dialogForm.replyRecord"
          ></el-input>
        </div>
        <!-- 分配客服弹框 -->
        <div v-else>
          <el-form
            ref="dialogForm"
            :model="dialogForm"
            label-width="80px"
            :rules="formRules"
          >
            <el-form-item label="分配客服" prop="customerService">
              <!-- <el-cascader :show-all-levels='false' filterable v-model="dialogForm.customerService" :options="serviceList" :props="{ value: 'customerId', label: 'label'}"></el-cascader> -->
              <el-select
                v-model="dialogForm.customerService"
                placeholder="请选择客服"
                @change="handleChange"
              >
                <el-option
                  v-for="item in customerList"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="handleDialog(dialogPosition)"
            v-preventReClick
            >确 定</el-button
          >
          <el-button @click="closeDialog">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import { consultTableOption } from "@/const/crud/user/user-consult";
import consultData from "./consult-data";
import { getConsultCount } from "@/api/admin/client";
import * as CodeMsg from "@/api/common/CodeChange";
import { mapState } from "vuex";
import { getDeptService } from "@/api/admin/user";
import {
  getConsult,
  postReply,
  getServices,
  editReply,
  allotSingleService,
  batchService
} from "@/api/user/consult";
export default {
  data() {
    return {
      consultForm: {
        keyWords: "",
        service: null,
        source: null,
        createTime: "",
        replyStatus: null
      },
      clickStatus: false,
      pageDialog: false,
      dialogTitle: "",
      dialogPosition: "",
      replyRecord: "",
      tableOption: consultTableOption,
      sourceList: consultData.sourceList,
      tableData: [],
      batchList: [],
      serviceList: [],
      customerList: [],
      allotId: [],
      dialogForm: {},
      consultCount: "",
      page: {
        total: 0,
        pageSize: 20,
        currentPage: 1
      },
      expireTimeOption: {
        disabledDate: date => {
          return date.getTime() > Date.now();
        }
      },
      formRules: {
        customerService: [
          { required: true, message: "请选择客服", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getService();
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    currentChange(val) {
      this.page.currentPage = val;
      this.getConsultList();
    },
    //获取客服列表数据
    getService() {
      getDeptService().then(res => {
        this.serviceList = res.data.data;
      });
      getServices().then(res => {
        this.customerList = res.data.data;
      });
    },
    //多选框改变事件
    selectionChange(val) {
      this.batchList = val;
      this.allotId = [];
      val.forEach(item => {
        this.allotId.push(item.id);
      });
      // this.$refs.crud.toggleSelection(val);
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getConsultList();
    },

    chooseType() {
      this.page.currentPage = 1;
      this.getConsultList();
    },
    // 同一个弹框组件根据判断显示内容
    handleDialog(val) {
      if (val == "reply" || val == "edit") {
        if (
          this.dialogForm.replyRecord != "" &&
          this.dialogForm.replyRecord != undefined
        ) {
          this.handleReply(val);
        } else {
          this.$message({
            message: "请填写回复内容",
            type: "warning",
            offset: 300
          });
        }
      } else {
        this.handleAllot("dialogForm");
      }
    },
    //关闭弹框
    closeDialog() {
      this.pageDialog = false;
      this.dialogForm = {};
      if (this.dialogPosition != "reply" && this.dialogPosition != "edit") {
        this.$refs.dialogForm.clearValidate();
      }
    },
    // 回复记录弹框
    handleListReply(row, val) {
      if (this.userInfo.id == row.customerService) {
        this.dialogPosition = val;
        this.dialogTitle = "回复记录";
        this.dialogForm = JSON.parse(JSON.stringify(row)); //深拷贝解决表单数据被同步修改
        this.pageDialog = true;
      } else {
        this.$message({
          message: "权限不足！",
          type: "warning",
          offset: 300
        });
      }
    },
    handleChange() {},
    // 表单列分配客服弹框
    rowAllot(row, val) {
      this.dialogPosition = val;
      this.dialogTitle = "分配客服";
      this.dialogForm = JSON.parse(JSON.stringify(row)); //深拷贝解决表单数据被同步修改
      if (row.customerService) {
        var isExist = this.customerList.findIndex(item => {
          //查询客服是否属于被分配的客服，否不显示
          return item.userId == Number(row.customerService);
        });
      }
      if (isExist != -1) {
        this.dialogForm.customerService = Number(
          this.dialogForm.customerService
        );
      } else {
        this.dialogForm.customerService = null;
      }
      this.pageDialog = true;
    },

    // 批量分配客服弹框
    allotCustomer(val) {
      this.dialogTitle = "批量分配客服";
      this.dialogPosition = val;
      this.pageDialog = true;
    },
    // 提交回复按钮
    handleReply(val) {
      let para = {
        id: this.dialogForm.id,
        consultNo: this.dialogForm.consultNo,
        replyRecord: this.dialogForm.replyRecord
      };
      if (val == "reply") {
        postReply(para).then(res => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              message: "操作成功！",
              type: "success",
              offset: 300
            });
            this.resetDialog();
          }
        });
      } else {
        editReply(para).then(res => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              message: "操作成功！",
              type: "success",
              offset: 300
            });
            this.resetDialog();
          }
        });
      }
    },
    //关闭重置弹框
    resetDialog(val) {
      this.dialogForm = {};
      this.pageDialog = false;
      this.reset();
    },
    // 分配客服按钮
    handleAllot(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogPosition == "batch") {
            //批量分配客服
            let para = {
              ids: this.allotId,
              service: this.dialogForm.customerService
            };
            batchService(para).then(res => {
              if (res.data.code == CodeMsg.CODE_0) {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                  offset: 300
                });
                this.resetDialog();
              }
            });
          } else {
            //单个分配客服
            let para = {
              id: this.dialogForm.id,
              consultNo: this.dialogForm.consultNo,
              customerService: this.dialogForm.customerService
            };
            allotSingleService(para).then(res => {
              if (res.data.code == CodeMsg.CODE_0) {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                  offset: 300
                });
                this.resetDialog();
              }
            });
          }
        } else {
          return false;
        }
      });
    },

    // 重置搜索表单
    reset() {
      this.clickStatus = false;
      this.clearForm(); //清除搜索数据
      this.getConsultList(); // 清除多选搜索
      if (this.batchList.length > 0) {
        this.$nextTick(() => {
          this.$refs.crud.toggleSelection(this.batchList);
        });
      }
    },
    //清除搜索数据
    clearForm() {
      this.consultForm.replyStatus = null;
      this.consultForm.keyWords = "";
      this.consultForm.service = null;
      this.consultForm.source = null;
      this.consultForm.createTime = "";
      this.page.pageSize = 20;
      this.page.currentPage = 1;
    },
    // 获取列表数据
    getConsultList() {
      let param = {
        size: this.page.pageSize,
        current: this.page.currentPage,
        origin: this.clickStatus == true ? this.consultForm.source : null,
        state: this.clickStatus == true ? this.consultForm.replyStatus : null,
        customerService:
          this.clickStatus == true
            ? this.consultForm.service
              ? this.consultForm.service[this.consultForm.service.length - 1]
              : null
            : null
      };
      if (this.consultForm.keyWords) {
        param.keyWords =
          this.clickStatus == true ? this.consultForm.keyWords : "";
      }
      if (this.consultForm.createTime) {
        param.consultTimeStart =
          this.clickStatus == true ? this.consultForm.createTime[0] : "";
        param.consultTimeEnd =
          this.clickStatus == true ? this.consultForm.createTime[1] : "";
      }
      //缓存搜索条件
      let keepParams = {
        clickStatus: this.clickStatus,
        params: this.consultForm,
        page: this.page,
        detail: { path: "", query: {} }
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getConsult(param)
        .then(res => {
          this.tableData = res.data.data.list;
          this.page.total = res.data.data.total;
        })
        .catch(err => {
          return err;
        });
    },
    //清除多选列表
    searchList() {
      this.clickStatus = true;
      this.getConsultList();
      if (this.batchList.length > 0) {
        this.$nextTick(() => {
          this.$refs.crud.toggleSelection(this.batchList);
        });
      }
    },
    toggleSelection(val) {
      this.$refs.crud.toggleSelection(val);
    },
    // 重置表单
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
        console.log(this.consultForm);
      }
    },
    getCount() {
      getConsultCount().then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.consultCount = res.data.data;
        }
      });
    }
  },
  //勾选缓存条件
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      this.consultForm = keepParams.params;
      this.page = keepParams.page;
      this.clickStatus = keepParams.clickStatus;
    }
    this.getCount();
  }
};
</script>

<style scoped>
.user_consult {
  padding: 10px;
  min-width: 960px;
  height: 100%;
  background: #ffffff;
}
.key {
  width: 400px;
}
.batch-handle {
  margin-top: -8px !important;
}
.reply-info {
  margin-top: -30px;
}
.reply-info b {
  display: inline-block;
  color: #333;
  width: 72px;
  text-align: justify;
  text-align-last: justify;
}
.reply-info span {
  color: #1e90ff;
}
.reply-box {
  margin-top: 20px;
  color: #666;
}
.circle {
  background: orange !important;
}
.must-symbol {
  color: red !important;
  margin-right: 3px;
}
</style>
