<template>
  <basic-container>
    <el-button type="primary" class="work-flow-btn" @click="showDialog()">新建工作流</el-button>
    <avue-crud ref="crud" :option="option" :page.sync="page" :data="dataList"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="menu" slot-scope="scope">
        <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="text" size="small" icon="el-icon-delete" v-if="scope.row.refProductNum == 0" @click="handleDelete(scope.row)">删除</el-button>
      </template>
      <template slot="workId" slot-scope="scope">
        <span>{{scope.row.flowNo}}</span>
      </template>
      <template slot="processImg" slot-scope="scope">
        <span v-for="(item, index) in scope.row.flowStepList" :key="index">
          <span>{{item.stepName}}</span>
          <span v-if="item.finishType!=null">{{item.finishType|filterFinishType}}</span>
          <span v-if="index !== scope.row.flowStepList.length - 1" class="pointer_right"></span>
        </span>
      </template>
      <template slot="productNum" slot-scope="scope">
        <span id="handle-style" @click="showProduct(scope.row)">{{scope.row.refProductNum}}</span>
      </template>
    </avue-crud>
    <!-- 新建/编辑工作流-->
    <el-dialog :title="className" :visible.sync="dialogVisible" :close-on-click-modal="false" width="500px">
      <h3 class="edit-tip" v-if="!showStatus">更改后的工作流只对待开始任务及新任务生效！</h3>
      <el-form :model="addForm" ref="addForm" inline :rules="rules">
        <el-form-item label="工作流名称：" prop="className">
          <el-input v-model.trim="addForm.className" class="input-200" maxlength="10">
          </el-input>
        </el-form-item>
        <el-form-item prop="startStep" label="步骤1：" label-width="100px">{{ addForm.startStep }}</el-form-item>
        <div v-for="(item, index) in addForm.optionList" :key="index">
          <el-form-item :rules="rules.selectDrop" :prop="'optionList.' + index + '.name'" :label="'步骤' + (index + 2) + '：'" label-width="100px">
            <el-input value-key="id" v-model.trim="item.name" class="add-btn-sty" maxlength="10"></el-input>
            <el-button size="mini" v-if="addForm.optionList.length !== 1 && index >= 0" @click="sliceList(index)">-</el-button>
            <el-button v-if="index == addForm.optionList.length - 1" size="mini" @click="pushList">+</el-button>
          </el-form-item>
        </div>
        <el-form-item prop="endStep" :label="'步骤' + (addForm.optionList.length + 2) + '：'" label-width="100px">
          <el-radio-group v-model="addForm.endStep">
            <div class="check-list">
              <el-radio class="check-item" v-for="obj in endList" :key="obj.type" :label="obj.type" @change="changeEndStep(obj.shortName)">{{ obj.name }}</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <div class="btn-contain">
          <el-button size="medium" class="confirm-sty" type="primary" @click="opearateFlow()">{{ $t("button.confirm") }}</el-button>
          <el-button size="medium" @click="handleClose()">{{ $t("button.cancel")}}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 关联产品dialog -->
    <related-products @refresh="getAllList()" ref="child"></related-products>
  </basic-container>
</template>

<script>
import { clientOption } from "@/const/crud/processmanage/work-flow";
import * as CodeMsg from "@/api/common/CodeChange";
import relatedProducts from "@/components/process-manage/related-products";
import {
  getWorkList,
  delWorkFlow,
  operateWorkFlow,
} from "@/api/processmanage/work-flow";
export default {
  components: {
    relatedProducts,
  },
  data() {
    return {
      shortName: "",
      endList: [
        { name: "完成(A)：仅可选完成", type: "A", shortName: "完成" },
        { name: "完成(B)：可选通过、不通过", type: "B", shortName: "完成" },
        { name: "完成(C)：可选完成、通过、不通过", type: "C",shortName: "完成" },
      ],
      filterStatus: true,
      editInfo: {},
      showStatus: true,
      className: "新建工作流",
      dialogVisible: false,
      addForm: {
        startStep: "待开始",
        className: "",
        endStep: "",
        optionList: [
          {
            name: "",
          },
        ],
      },
      rules: {
        className: [
          { required: true, message: "请输入工作流名称", trigger: "blur" },
        ],
        startStep: [
          { required: true, message: "请输入工作流名称", trigger: "blur" },
        ],
        endStep: [
          { required: true, message: "请选择完成步骤", trigger: "blur" },
        ],
        selectDrop: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      dataList: [],
      option: clientOption,
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条,
        isAsc: false, // 是否倒序
        pageSizes: [5, 8, 10, 20, 30, 50, 100],
      },
    };
  },
  filters:{
    filterFinishType(val){
      return val == 'A'?'':val == 'B'?'（通过、不通过）':val == 'C'?'（完成、通过、不通过）':''
    },
  },
  methods: {
    // 修改完成步骤
    changeEndStep(name) {
      this.shortName = name;
    },
    // 展示关联产品
    showProduct(row) {
      this.$refs.child.workInfo = row;
      this.$refs.child.showInfo();
      this.$refs.child.countDialog = true;
    },
    // 步骤列表赋值
    setStepList() {
      let list = [{
        stepName: this.addForm.startStep,
        sort: 1,
        stepType: 0,
      }];
      this.addForm.optionList.forEach((item, index) => {
        let object = {
          stepName: item.name,
          sort: index + 2,
          stepType: 1,
        };
        list.push(object);
      });
      list.push({
        stepName: this.shortName,
        sort: this.addForm.optionList.length + 2,
        stepType: 2,
        finishType: this.addForm.endStep,
      });
      return list;
    },
    // 操作工作流
    opearateFlow() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          let list = this.setStepList();
          this.operateWorkFlow(list, this.showStatus == true ? 0 : 1);
        }
      });
    },
    // 操作工作流 0-添加 1-编辑
    operateWorkFlow(list, type) {
      let params = {
        flowName: this.addForm.className,
        flowStepList: list,
      };
      if (type == 1) {
        params.id = this.editInfo.id;
        params.version = this.editInfo.version;
      }
      operateWorkFlow(params, type).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: type == 0 ? "添加成功！" : "操作成功，修改工作流只对新任务生效！",
            offset: 300,
          });
          this.dialogVisible = false;
          this.handleClose();
          this.getAllList();
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg,
            offset: 300,
          });
        }
      });
    },
    // 添加工作流弹窗
    showDialog() {
      this.className = "添加工作流";
      this.addForm.className = "";
      this.addForm.endStep = ""
      this.showStatus = true;
      this.addForm.optionList = [{ name: "" }];
      this.dialogVisible = true;
    },
    // 获取工作流列表 pageNo为1
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    // 获取工作流列表
    getList() {
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      getWorkList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          this.dataList = r.records;
          this.page.total = r.total;
        }
      });
    },
    // 编辑回显工作流
    handleEdit(row) {
      this.editInfo = row;
      this.className = "编辑工作流";
      this.showStatus = false;
      this.dialogVisible = true;
      this.addForm.className = row.flowName;
      this.addForm.optionList = [];
      row.flowStepList.forEach((item, index) => {
        if (index > 0 && index != row.flowStepList.length - 1) {
          this.addForm.optionList.push({
            name: item.stepName,
          });
        } else if (index == row.flowStepList.length - 1) {
          this.addForm.endStep = item.finishType;
          this.shortName = item.stepName;
        }
      });
    },
    // 删除工作流
    handleDelete(row) {
      this.$confirm("确认删除?", "提示", {
        type: "warning",
        confirmButtonText: "确定删除？",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
        delWorkFlow(row.id).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "删除成功！",
              offset: 300,
            });
            this.getAllList();
          }
        });
      });
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false;
      this.$refs["addForm"].resetFields();
      this.addForm.className = "";
      this.addForm.optionList = [{ name: "" }];
    },
    // 删除步骤
    sliceList(index) {
      if (this.addForm.optionList.length > 1) {
        this.addForm.optionList.splice(index, 1);
      }
    },
    // 添加步骤
    pushList() {
      this.addForm.optionList.push({
        options: "",
      });
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
  },
};
</script>

<style scoped>
.work-flow-btn {
  margin: 20px 0 12px 2px;
}
#handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
.pointer_right {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-top: 1px solid #606266;
  border-right: 1px solid #606266;
  transform: rotate(45deg);
  margin: 0 6px 1px 3px;
}
.check-list {
  display: flex;
  flex-direction: column;
}
.input-200 {
  width: 200px;
}
.add-btn-sty {
  width: 200px;
  margin-right: 20px;
}
.btn-contain {
  display: flex;
  justify-content: center;
  margin-top: 0px;
}
.confirm-sty {
  margin-right: 50px;
}
.check-item {
  margin-bottom: 10px;
}
.edit-tip{
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
}
</style>