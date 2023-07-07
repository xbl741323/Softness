<template>
  <!-- 专利申请号修改 -->
  <el-dialog v-if="showPatentBtn" :visible.sync="showPatentBtn" width="400px" title="专利号修改" :close-on-click-modal="false">
    <el-form :model="rowForm" ref="rowForm" inline :rules="rules">
      <el-form-item label="专利号：" prop="patentNo">
        <el-input
          class="patent-input-sty"
          v-model.trim="rowForm.patentNo"
          placeholder="请填写"
          maxlength="20">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="btn-contain">
      <el-button class="right-btn-sty" type="primary" @click="submitEdit()">确定</el-button>
      <el-button @click="handleClose()">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editPatentNo } from "@/api/task/new-task";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  data() {
    return {
      taskInfo: {},
      showPatentBtn: false,
      rowForm: {
        patentNo: "",
      },
      rules: {
        patentNo: [
          { required: true, message: "请输入专利申请号", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 修改专利申请号
    submitEdit() {
      this.$refs["rowForm"].validate((val) => {
        if (val) {
          let params = {
            taskNo: this.taskInfo.taskNo,
            patentApplicationNo: this.rowForm.patentNo,
          };
          editPatentNo(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "修改成功！"
              });
              this.handleClose();
              this.rowForm.patentNo = ''
              this.$emit("refresh");
            } else {
              this.$message({
                type: "warning",
                message: res.data.msg,
              });
            }
          });
        }
      });
    },
    // 专利号弹窗显示控制
    handleClose() {
      this.showPatentBtn = false;
    },
  },
};
</script>

<style scoped>
.patent-input-sty {
  width: 220px;
}
.btn-contain {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.right-btn-sty {
  margin-right: 50px;
}
</style>