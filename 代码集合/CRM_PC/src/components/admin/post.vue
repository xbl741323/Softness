<template>
  <div class="dept_post">
    <el-button
      type="primary"
      style="margin: 10px 0 25px 0"
      @click.stop="addDialog = true"
    >
      添加/插入岗位
    </el-button>
    <avue-crud
      ref="crud"
      class="batch-choose"
      :data="tableData"
      :option="listOption"
      :page.sync="page"
      @on-load="getAppoint"
    >
      <template slot="name" slot-scope="scope">
        <div
          :class="[
            'common-contain',
            jilu.stationId == scope.row.stationId ? 'xuanzhong' : '',
          ]"
          @mouseenter="showIcon(scope.row)"
          @mouseleave="closeIcon(scope.row)"
          @click.stop="jilu == scope.row ? (jilu = '') : (jilu = scope.row)"
        >
          <div
            class="common-flex"
            v-if="!scope.row.editName"
            @click.stop="editName(scope.row),(changeName = scope.row.name)"
          >
            <p class="name-flow" v-if="scope.row.name">
              <span v-if="scope.row.name != null">{{ scope.row.name }}</span>
              <span v-else>暂无数据</span>
              <i
                class="el-icon-edit"
                v-if="scope.row.repeatStatus == false"
              ></i>
            </p>
            <div v-else style="width: 160px; height: 34px">
              <span>暂无数据</span>
              <i
                class="el-icon-edit"
                v-if="scope.row.repeatStatus == false"
              ></i>
            </div>
          </div>
          <template v-else>
            <div class="common-flex">
              <el-input
                v-focus
                maxlength="30"
                :ref="'postNameInput' + scope.row.stationId"
                @blur="updatePostableName(scope.row)"
                v-model="scope.row.name"
                placeholder="请输入内容"
              >
              </el-input>
            </div>
          </template>
        </div>
      </template>
      <template slot="relatedSysUserCount" slot-scope="scope">
        <div>
          <span
            class="userNum"
            @click.stop="(userNameDialog = true), (dialogForm = scope.row)"
            >{{ scope.row.relatedSysUserCount }}</span
          >
        </div>
      </template>
      <template slot="menu" slot-scope="scope">
        <div>
          <el-button
            type="text"
            :disabled="scope.row.relatedSysUserCount != 0"
            @click.stop="(delDialog = true), (dialogForm = scope.row)"
            >删除</el-button
          >
        </div>
      </template>
    </avue-crud>
    <!-- 删除提示弹窗 -->
    <el-dialog title="删除提示" :visible.sync="delDialog" width="30%" center>
      <span>是否确定删除改职位</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="delDialog = false">取 消</el-button>
        <el-button type="primary" @click.stop="handleDelete(dialogForm)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加岗位弹窗 -->
    <el-dialog
      title="添加岗位"
      :visible.sync="addDialog"
      :close-on-click-modal="false"
      width="30%"
      center
      class="addFrom"
    >
      <el-form :model="addForm" :rules="addRules" ref="form">
        <el-form-item prop="name" label="岗位名称：">
          <el-input
            placeholder="请输入岗位名称"
            v-model="addForm.name"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="addDialog = false">取 消</el-button>
        <el-button type="primary" @click.stop="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户姓名弹窗 -->
    <el-dialog title="使用人姓名" :visible.sync="userNameDialog">
      <avue-crud
        ref="crud"
        :option="option"
        :data="dataList"
        :page.sync="page"
        @on-load="getPostUserCount"
        @size-change="sizeChange"
        v-if="userNameDialog"
        @current-change="currentChange"
      >
      </avue-crud>
    </el-dialog>
  </div>
</template>

<script>
import { listOption, option } from "@/const/crud/admin/post";
import {
  addPost,
  deletePost,
  editPost,
  getPostList,
  getPostUserCount,
} from "@/api/admin/dept";

export default {
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
  data() {
    return {
      listOption: listOption,
      page: {
        currentPage: 1,
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper",
        repeatStatus: true,
        background: true,
        pageSizes: [5, 8, 10, 20, 30, 40, 50, 100], //选择每页显示条数
        pageSize: 20,
        dialogForm: "",
      },
      jilu: "",
      tableData: [],
      dataList: [],
      option: option,
      delDialog: false,
      addDialog: false,
      userNameDialog: false,
      changeName: "",
      addForm: {
        name: "",
      },
      addRules: {
        name: [
          {
            required: true,
            message: "请输入岗位名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    handleAdd() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        let params = {
          level: this.jilu ? this.jilu.level : this.tableData.length + 1,
          name: this.addForm.name,
        };
        addPost(params).then((res) => {
          if (res.data.code == 0) {
            this.getAppoint();
            this.addDialog = false;
            this.$message({
              type: "success",
              message: "添加成功",
            });
            this.addForm.name = "";
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
          }
        });
      });
    },
    getAppoint() {
      getPostList().then((res) => {
        this.tableData = res.data.data;
      });
    },
    showIcon(row) {
      this.tableData.forEach((item) => {
        if (row.stationId == item.stationId) {
          this.$set(row, "repeatStatus", false);
        }
      });
    },
    closeIcon(row) {
      this.tableData.forEach((item) => {
        if (row.stationId == item.stationId) {
          this.$set(row, "repeatStatus", true);
        }
      });
    },
    editName(row) {
      this.tableData.forEach((item) => {
        if (row.stationId == item.stationId) {
          this.$set(item, "editName", true);
        } else {
          this.$set(item, "editName", false);
        }
      });
    },
    //编辑名称
    updatePostableName(row) {
      if (row.name != this.changeName) {
        let params = {
        name: row.name,
        stationId: row.stationId,
        };
        editPost(params).then((res) => {
          if (res.data.code == 0) {
            this.getAppoint();
            this.$message({
              type: "success",
              message: "修改成功",
            });
          } else {
            this.getAppoint();
            this.$message({
              type: "error",
              message: res.data.msg,
            });
          }
        });
        this.$set(row, "editName", false);
      } else {
        this.$set(row, "editName", false);
      }
    },
    //删除岗位
    handleDelete(val) {
      let params = {
        stationId: val.stationId,
      };
      deletePost(params).then((res) => {
        if (res.data.code == 0) {
          this.getAppoint();
          this.delDialog = false;
          this.$message({
            type: "success",
            message: "删除成功",
            duration: 2000
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
          this.delDialog = false;
        }
      });
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getPostUserCount();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getPostUserCount();
    },
    getPostUserCount() {
      let params = {
        stationId: this.dialogForm.stationId,
        current: this.page.currentPage,
        size: this.page.pageSize,
      };
      getPostUserCount(params).then((res) => {
        if (res.data.code == 0) {
          this.dataList = res.data.data.records;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dept_post {
  :deep(.el-table__row) {
    height: 49px;
  }
  .common-flex {
    display: flex;
    align-items: center;
  }
  .name-flow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .common-contain {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .userNum {
    color: #1890ff;
  }
  .userNum:hover {
    cursor: pointer;
  }
  .xuanzhong {
    background-color: #f2f2f2;
  }
  .addFrom {
    :deep(.el-form-item) {
      display: flex;
    }
  }
}
</style>

