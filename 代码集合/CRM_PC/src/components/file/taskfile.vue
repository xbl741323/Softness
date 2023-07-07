<template>
  <div>
    <!-- 文件替换 -->
    <el-dialog
      :visible.sync="replaceDialog"
      title="添加附件"
      width="450px"
      :close-on-click-modal="false"
      @close="closeResourceDialog()"
    >
      <span>请选择附件的来源：</span>
      <template>
        <el-radio-group v-model="sourceFile">
          <el-radio :label="1">本地文件</el-radio>
          <el-radio :label="0">文件库</el-radio>
        </el-radio-group>
      </template>
      <div style="margin-top: 40px; text-align: center">
        <el-button size="mini" type="primary" @click="next()">下一步</el-button>
        <el-button size="mini" type="warning" @click="closeResourceDialog()">{{
          $t("button.cancel")
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 文件库附件 -->
    <el-dialog
      :visible.sync="libraryDialog"
      title="上传附件"
      :close-on-click-modal="false"
    >
      <el-input
        placeholder="请输入目标文件编号或文件名称关键字"
        style="width: 260px; margin: 0 20px 0 0"
        v-model="fileKeywords"
        @keyup.enter.native="next()"
      />
      <el-button @click="next()" type="primary">搜索</el-button>
      <!-- :header-cell-class-name="cellClass"   :selectable="radioBox"  -->
      <el-table
        border
        :data="libraryList"
        class="table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :selectable="radioBox"
        ></el-table-column>
        <el-table-column label="文件编号" prop="number"></el-table-column>
        <el-table-column label="文件名称" prop="name"></el-table-column>
        <el-table-column label="上传人" prop="createUserName">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.userTip"
              placement="right"
            >
              <span>{{ scope.row.createUser }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" prop="createTime"></el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center; margin-top: 15px"
        background
        layout="prev, pager, next, total"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :total="total"
      ></el-pagination>
      <div style="margin-top: 40px; text-align: center">
        <!-- class="policyFileBtn" -->
        <el-button size="mini" type="primary" @click="lastStep()"
          >上一步</el-button
        >
        <el-button
          size="mini"
          type="primary"
          :disabled="this.selectedList.length <= 0"
          @click="toReplace()"
          >{{ $t("button.confirm") }}</el-button
        >
        <el-button size="mini" type="warning" @click="closeFileDialog">{{
          $t("button.cancel")
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 本地上传弹框 -->
    <el-dialog
      :visible.sync="uploadDialog"
      width="45%"
      title="上传附件"
      :close-on-click-modal="false"
      @close="cancleUpload"
    >
      <div class="upload">
        <div style="display: flex; align-items: center">
          <span>选择文件：</span>
          <el-upload
            :disabled="this.fileList.length >= 5"
            class="upload-demo"
            action
            ref="upload"
            :file-list="fileList"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="5"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
            :on-change="OnChange"
            :auto-upload="false"
            :show-file-list="false"
          >
            <el-button
              size="small"
              :disabled="this.fileList.length >= 5"
              type="primary"
              >{{ $t("label.addFiles") }}</el-button
            >
          </el-upload>
        </div>
        <!-- 文件上传表格 -->
        <div class="file-replace-box">
          <div>
            <!-- 文件列表替换 -->
            <el-table
              :data="this.tempraoryList"
              border
              class="table"
              :header-cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="文件名称" prop="name" align="center">
                <template slot-scope="scope">
                  <edit-box
                    :row="scope.row"
                    @saveKeywords="childSave"
                  ></edit-box>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" style="color:#409EFF;border:none" @click="deleteRowFile(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="margin-left: 100px; margin-top: 40px">
          <el-button size="mini" type="primary" @click="cancleUpload()"
            >上一步</el-button
          >
          <el-button
            @click="beforeUploadFiles()"
            :loading="isLoading"
            :disabled="
              this.fileList.length == 0 ||
              this.length + this.fileList.length > 5
            "
            type="primary"
            style="width: 70px; margin-left: 50px"
            >{{ $t("button.confirm") }}</el-button
          >
          <el-button
            @click="cancleUpload()"
            style="margin-left: 50px; width: 70px"
            >{{ $t("button.cancel") }}</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOtherLibrary, localAdd, kuAdd } from "@/api/task/index.js";
import * as CodeMsg from "@/api/common/CodeChange"
import EditBox from "@/components/file/editBox";

export default {
  components: {
    EditBox,
  },
  props: {
    listLength: {
      type: Number,
      required: false,
    },
    taskId: {
      type: Number,
      required: true,
    },
    customerId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      libraryDialog: false,
      replaceDialog: true,
      uploadDialog: false,
      sourceFile: 1, // 附件来源类型
      libraryList: [], // 文件库接口数据
      fileKeywords: "", // 关键字
      replacedId: [],
      selectedList: [], // 记录选中项
      tempData: {}, // 上传列表查重使用
      tempraoryList: [], // 本地上传文件数据
      fileList: [], // 本地上传记录数据
      length: "",
      filelength: "",
      fileLengthStauts: true, // 上传状态
    };
  },
  methods: {
    closeFileDialog() {
      this.libraryDialog = false;
      this.fileKeywords ="";
    },
    lastStep() {
      this.libraryDialog = false;
      this.fileKeywords ="";
    },
    /* 删除本地上传 */
    deleteRowFile(row) {
      this.$confirm("确认删除" + row.name + "吗？", "删除", {
        type: "warning",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
        this.tempraoryList.splice(this.tempraoryList.indexOf(row), 1);
        for (let i = 0; i < this.fileList.length; i++) {
          if (row.uid == this.fileList[i].uid) {
            this.fileList.splice(this.fileList.indexOf(this.fileList[i]), 1);
          }
        }
      });
    },
    // 文件库确定操作
    toReplace() {
      this.fileKeywords ="";
      let ids = [];
      let fileNos = [];
      this.selectedList.forEach((item) => {
        ids.push(item.id);
        fileNos.push(item.number);
      });
      let param = {
        // customerId:this.customerId,
        taskId: this.taskId,
        ids,
        numbers:fileNos
      };
      kuAdd(param).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$emit("closeDialog", false);
          this.$emit("doRefresh");
        } else {
          this.$message({
            type: "warning",
            message: res.data.data,
          });
        }
      });
    },
    // cellClass(row){
    //   if(row.columnIndex == 0){
    //     return 'disabledSelection'
    //   }
    // },
    closeResourceDialog() {
      this.$emit("closeDialog", false);
    },
    // 控制显隐
    radioBox(row) {
      return row.enable;
    },
    unique(arr) {
      let array = [];
      arr.forEach((id) => {
        if (array.indexOf(id) === -1) {
          array.push(id);
        }
      });
      return array;
    },
    handleSelectionChange(row) {
      this.selectedList = row;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.next();
    },
    next() {
      //文件库列表
      if (this.sourceFile == 0) {
        this.libraryDialog = true;
        let param = {
          taskId: this.taskId,
          pageSize: 20,
          pageNo: this.currentPage,
          customerId:this.customerId,
          keyword: this.fileKeywords.trim()
        };
        getOtherLibrary(param).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.libraryList = res.data.data.records;

              //  for(let i = 0; i <this.libraryList.length; i++){
              //       this.$set(this.libraryList[i],'able',true);
              // }
              this.total = res.data.data.total;
            }
          })
          .catch(() => {
            return false;
          });
      } else {
        this.uploadDialog = true;
      }
    },
    // 本地文件确定操作
    beforeUploadFiles() {
      if (this.fileList.length > 5) {
        this.$message({
          type: "warning",
          message: `文章总文件个数不多于 5 个文件，本次选择了 ${this.fileList.length} 个文件，共有 ${this.fileList.length} 个文件`,
        });
      } else {
        this.uploadFiles();
      }
    },
    /* 本地上传附件 */
    uploadFiles() {
      this.isLoading = true;
      if (this.fileList.length <= 5) {
        var list = {
          fileNames: [],
        };
        for (let i = 0; i < this.fileList.length; i++) {
          list.fileNames.push(this.fileList[i].name);
        }
        let param = new FormData();
        param.append("taskId", this.taskId);
        param.append("customerId", this.customerId);
        this.fileList.forEach((item) => {
          param.append("files", item.raw, item.name);
        });
        // 接口查重
        localAdd(param).then((res) => {
          this.isLoading = false;
          if (res.data.code == CodeMsg.CODE_0) {
            this.uploadDialog = false;
            // this.$emit('fileList',this.fileList);
            this.$emit("closeDialog", false);
            this.$emit("doRefresh");
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: `1本地上传文件不多于 5 个文件，本次选择了 ${this.fileList.length} 个文件，共选择了 ${this.fileList.length} 个文件`,
        });
      }
    },
    cancleUpload() {
      this.fileList = [];
      this.tempraoryList = [];
      this.uploadDialog = false;
    },
    // 本地文件列表查重
    childSave(val) {
      console.log(val,'jjjj')
      if (typeof val.uid !== "undefined") {
        var hasSameFileName = false; //修改的名称是否重复
        for (let i = 0; i < this.fileList.length; i++) {
          if (this.fileList[i].name == val.name) {
            this.$message({
              type: "warning",
              message: "文件名" + val.name + "已存在",
            });
            hasSameFileName = true;
          } else {
          }
        }
        if (!hasSameFileName) {
          for (let i = 0; i < this.fileList.length; i++) {
            if (val.uid == this.fileList[i].uid) {
              this.tempData = val;
              this.tempraoryList.splice(
                this.tempraoryList.indexOf(this.tempraoryList[i]),
                1,
                this.tempData
              );
              this.fileList[i].name = val.name; //修改上传的文件名
            }
          }
        }
      }
      // this.getList(val);
    },
    handleRemove(file, fileList) {
      let index = this.fileList.indexOf(file);
      this.fileList.splice(index, 1);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 20MB!",
          type: "warning",
          offset: 300,
        });
      }
      return isLt2M;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, {
        cancelButtonClass: "btn-custom-cancel",
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    OnChange(file, fileList) {
      if (fileList.length > 5) {
        this.fileLengthStauts = false;
        this.$message.warning(
          `当前限制选择 5 个文件，本次选择了 ${
            fileList.length
          } 个文件，共选择了 ${this.length + fileList.length} 个文件`
        );
      }
      let existFile = fileList
        .slice(0, fileList.length - 1)
        .find((f) => f.name === file.name);
      if (existFile) {
        this.$message.error(file.name + "已经存在!");
        fileList.pop();
      }
      this.fileList = fileList;
      let names = [];
      for (let i = 0; i < this.fileList.length; i++) {
        names.push({ name: fileList[i].name });
      }
      this.fileName = this.unique(names);
      this.tempraoryList = []; //置空临时数组
      for (let i = 0; i < this.fileList.length; i++) {
        this.tempraoryList.push(
          //添加临时文件列表
          {
            name: this.fileList[i].name,
            options: null,
            uid: this.fileList[i].uid,
          }
        );
      }
    },
    unique(names) {
      const res = new Map();
      return names.filter(
        (names) => !res.has(names.name) && res.set(names.name, 1)
      );
    },
  },
};
</script>

<style scoped>
.table {
  margin-top: 10px;
}
.file-replace-box {
  line-height: 30px;
}
.new-file {
  display: flex;
}
/* 去除table表头的全选框 */
.el-table /deep/.disabledSelection .cell .el-checkbox__inner {
  display: none;
  position: relative;
}
.el-table /deep/.disabledSelection .cell:before {
  content: "";
  position: absolute;
}
</style>